import _getIterator from 'babel-runtime/core-js/get-iterator';
import _typeof from 'babel-runtime/helpers/typeof';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import invariant from 'invariant';

import getRouteParams from 'react-router/lib/getRouteParams';

function getLocationParams(paramNames, paramSource) {
  if (!paramNames) {
    return null;
  }

  var paramsForRoute = {};
  paramNames.forEach(function (name) {
    var param = paramSource ? paramSource[name] : null;
    paramsForRoute[name] = param !== undefined ? param : null;
  });

  return paramsForRoute;
}

export default function getParamsForRoute(_ref) {
  var route = _ref.route,
      routes = _ref.routes,
      params = _ref.params,
      location = _ref.location;

  var paramsForRoute = {};

  // Extract route params for current route and all ancestors.
  for (var _iterator = routes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
    var _ref2;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref2 = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref2 = _i.value;
    }

    var ancestorRoute = _ref2;

    _Object$assign(paramsForRoute, getRouteParams(ancestorRoute, params));
    if (ancestorRoute === route) {
      break;
    }
  }

  _Object$assign(paramsForRoute, getLocationParams(route.queryParams, location.query), getLocationParams(route.stateParams, location.state));

  var prepareParams = route.prepareParams;

  if (prepareParams) {
    !(typeof prepareParams === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'react-router-relay: Expected `prepareParams` to be a function.') : invariant(false) : void 0;
    paramsForRoute = prepareParams(paramsForRoute, route);
    !((typeof paramsForRoute === 'undefined' ? 'undefined' : _typeof(paramsForRoute)) === 'object' && paramsForRoute !== null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'react-router-relay: Expected `prepareParams` to return an object.') : invariant(false) : void 0;
  }

  return paramsForRoute;
}