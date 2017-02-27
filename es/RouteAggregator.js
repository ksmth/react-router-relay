import _getIterator from 'babel-runtime/core-js/get-iterator';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _typeof from 'babel-runtime/helpers/typeof';
import _WeakMap from 'babel-runtime/core-js/weak-map';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import invariant from 'invariant';
import isEqual from 'lodash/isEqual';
import Relay from 'react-relay';

import getParamsForRoute from './utils/getParamsForRoute';
import getRouteQueries from './utils/getRouteQueries';

var DEFAULT_KEY = '@@default';

var RouteAggregator = function () {
  function RouteAggregator() {
    _classCallCheck(this, RouteAggregator);

    // We need to use a map to track route indices instead of throwing them on
    // the route itself with a Symbol to ensure that, when rendering on the
    // server, each request generates route indices independently.
    this._routeIndices = new _WeakMap();
    this._lastRouteIndex = 0;

    this.route = null;
    this._fragmentSpecs = null;

    this._failure = null;
    this._data = {};
    this._readyState = null;
  }

  RouteAggregator.prototype.updateRoute = function updateRoute(routerProps) {
    var _this = this;

    var routes = routerProps.routes,
        components = routerProps.components,
        params = routerProps.params,
        location = routerProps.location;


    var relayRoute = {
      name: null,
      queries: {},
      params: {}
    };
    var fragmentSpecs = {};

    routes.forEach(function (route, i) {
      var routeQueries = getRouteQueries(route, routerProps);
      if (!routeQueries) {
        return;
      }

      var routeComponent = components[i];

      var componentMap = void 0;
      var queryMap = void 0;
      if ((typeof routeComponent === 'undefined' ? 'undefined' : _typeof(routeComponent)) === 'object') {
        componentMap = routeComponent;
        queryMap = routeQueries;
      } else {
        var _componentMap, _queryMap;

        componentMap = (_componentMap = {}, _componentMap[DEFAULT_KEY] = routeComponent, _componentMap);
        queryMap = (_queryMap = {}, _queryMap[DEFAULT_KEY] = routeQueries, _queryMap);
      }

      _Object$keys(componentMap).forEach(function (key) {
        var component = componentMap[key];
        var queries = queryMap[key];

        if (!queries) {
          return;
        }

        // In principle not all container component routes have to specify
        // queries, because some of them might somehow receive fragments from
        // their parents, but it would definitely be wrong to specify queries
        // for a component that isn't a container.
        !Relay.isContainer(component) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'relay-nested-routes: Route with queries specifies component `%s` ' + 'that is not a Relay container.', component.displayName || component.name) : invariant(false) : void 0;

        var routeParams = getParamsForRoute({ route: route, routes: routes, params: params, location: location });
        _Object$assign(relayRoute.params, routeParams);

        _Object$keys(queries).forEach(function (queryName) {
          var query = queries[queryName];
          var uniqueQueryName = _this._getUniqueQueryName(route, key, queryName);

          // Relay depends on the argument count of the query function, so try
          // to preserve it as well as possible.
          var wrappedQuery = void 0;
          if (query.length === 0) {
            // Relay doesn't like using the exact same query in multiple
            // places, so wrap it to prevent that when sharing queries between
            // routes.
            wrappedQuery = function wrappedQuery() {
              return query();
            };
          } else {
            // We just need the query function to have > 0 arguments.
            /* eslint-disable no-unused-vars */
            wrappedQuery = function wrappedQuery(_) {
              return query(component, routeParams);
            };
            /* eslint-enable */
          }

          relayRoute.queries[uniqueQueryName] = wrappedQuery;
          fragmentSpecs[uniqueQueryName] = { component: component, queryName: queryName };
        });
      });
    });

    relayRoute.name = ['XX_aggregated'].concat(_Object$keys(relayRoute.queries)).join('-');

    // RootContainer uses referential equality to check for route change, so
    // replace the route object entirely.
    this.route = relayRoute;
    this._fragmentSpecs = fragmentSpecs;
  };

  RouteAggregator.prototype._getUniqueQueryName = function _getUniqueQueryName(route, key, queryName) {
    // There might be some edge case here where the query changes but the route
    // object does not, in which case we'll keep using the old unique name.
    // Anybody who does that deserves whatever they get, though.

    // Prefer an explicit route name if specified.
    if (route.name) {
      // The slightly different template here ensures that we can't have
      // collisions with the below template.
      return 'X_' + route.name + '_' + key + '_' + queryName;
    }

    // Otherwise, use referential equality on the route name to generate a
    // unique index.
    var routeIndex = this._routeIndices.get(route);
    if (routeIndex === undefined) {
      routeIndex = ++this._lastRouteIndex;
      this._routeIndices.set(route, routeIndex);
    }

    return 'XX_route[' + routeIndex + ']_' + key + '_' + queryName;
  };

  RouteAggregator.prototype.setFailure = function setFailure(error, retry) {
    this._failure = [error, retry];
  };

  RouteAggregator.prototype.setFetched = function setFetched(data, readyState) {
    this._failure = null;
    this._data = data;
    this._readyState = readyState;
  };

  RouteAggregator.prototype.setLoading = function setLoading() {
    this._failure = null;
  };

  RouteAggregator.prototype.getData = function getData(route) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_KEY;
    var queries = arguments[2];
    var params = arguments[3];

    // Check that the subset of parameters used for this route match those used
    // for the fetched data.
    for (var _iterator = _Object$keys(params), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var paramName = _ref;

      if (!isEqual(this._data[paramName], params[paramName])) {
        return this._getDataNotFound();
      }
    }

    var fragmentPointers = {};
    for (var _iterator2 = _Object$keys(queries), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2);;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var queryName = _ref2;

      var uniqueQueryName = this._getUniqueQueryName(route, key, queryName);

      var fragmentPointer = this._data[uniqueQueryName];
      if (!fragmentPointer) {
        return this._getDataNotFound();
      }

      fragmentPointers[queryName] = fragmentPointer;
    }

    return {
      fragmentPointers: fragmentPointers,
      readyState: this._readyState
    };
  };

  RouteAggregator.prototype._getDataNotFound = function _getDataNotFound() {
    return { failure: this._failure };
  };

  RouteAggregator.prototype.getFragmentNames = function getFragmentNames() {
    return _Object$keys(this._fragmentSpecs);
  };

  RouteAggregator.prototype.getFragment = function getFragment(fragmentName, variableMapping) {
    var _fragmentSpecs$fragme = this._fragmentSpecs[fragmentName],
        component = _fragmentSpecs$fragme.component,
        queryName = _fragmentSpecs$fragme.queryName;

    return component.getFragment(queryName, variableMapping);
  };

  RouteAggregator.prototype.hasFragment = function hasFragment(fragmentName) {
    return this._fragmentSpecs[fragmentName] !== undefined;
  };

  RouteAggregator.prototype.hasVariable = function hasVariable(variableName) {
    // It doesn't matter what the component variables are. The only variables
    // we're going to pass down are the ones defined from our route parameters.
    return Object.prototype.hasOwnProperty.call(this.route.params, variableName);
  };

  return RouteAggregator;
}();

export default RouteAggregator;