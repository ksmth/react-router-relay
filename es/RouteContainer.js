import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import React from 'react';
import StaticContainer from 'react-static-container';

import RouteAggregator from './RouteAggregator';
import getParamsForRoute from './utils/getParamsForRoute';

var propTypes = {
  queries: React.PropTypes.object.isRequired,
  routerProps: React.PropTypes.object.isRequired,
  children: React.PropTypes.node.isRequired
};

var contextTypes = {
  routeAggregator: React.PropTypes.instanceOf(RouteAggregator).isRequired
};

function RouteContainer(_ref, _ref2) {
  var routeAggregator = _ref2.routeAggregator;

  var queries = _ref.queries,
      routerProps = _ref.routerProps,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ['queries', 'routerProps', 'children']);

  var key = routerProps.key,
      route = routerProps.route;


  var params = getParamsForRoute(routerProps);

  var _routeAggregator$getD = routeAggregator.getData(route, key, queries, params),
      failure = _routeAggregator$getD.failure,
      fragmentPointers = _routeAggregator$getD.fragmentPointers,
      readyState = _routeAggregator$getD.readyState;

  var shouldUpdate = true;
  var element = void 0;

  // This is largely copied from RelayRootContainer#render.
  if (failure) {
    var renderFailure = route.renderFailure;

    if (renderFailure && (typeof renderFailure === 'undefined' ? 'undefined' : _typeof(renderFailure)) === 'object') {
      renderFailure = renderFailure[key];
    }

    if (renderFailure) {
      var error = failure[0],
          retry = failure[1];

      element = renderFailure(error, retry);
    } else {
      element = null;
    }
  } else if (fragmentPointers) {
    var data = _extends({}, props, params, fragmentPointers);

    var renderFetched = route.renderFetched;

    if (renderFetched && (typeof renderFetched === 'undefined' ? 'undefined' : _typeof(renderFetched)) === 'object') {
      renderFetched = renderFetched[key];
    }

    if (renderFetched) {
      element = renderFetched(_extends({}, routerProps, { data: data }), readyState);
    } else {
      element = React.cloneElement(children, data);
    }
  } else {
    var renderLoading = route.renderLoading;

    if (renderLoading && (typeof renderLoading === 'undefined' ? 'undefined' : _typeof(renderLoading)) === 'object') {
      renderLoading = renderLoading[key];
    }

    if (renderLoading) {
      element = renderLoading();
    } else {
      element = undefined;
    }

    if (element === undefined) {
      element = null;
      shouldUpdate = false;
    }
  }

  return React.createElement(
    StaticContainer,
    { shouldUpdate: shouldUpdate },
    element
  );
}

RouteContainer.propTypes = propTypes;
RouteContainer.contextTypes = contextTypes;

export default RouteContainer;