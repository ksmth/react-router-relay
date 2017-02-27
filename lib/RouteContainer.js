'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactStaticContainer = require('react-static-container');

var _reactStaticContainer2 = _interopRequireDefault(_reactStaticContainer);

var _RouteAggregator = require('./RouteAggregator');

var _RouteAggregator2 = _interopRequireDefault(_RouteAggregator);

var _getParamsForRoute = require('./utils/getParamsForRoute');

var _getParamsForRoute2 = _interopRequireDefault(_getParamsForRoute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  queries: _react2.default.PropTypes.object.isRequired,
  routerProps: _react2.default.PropTypes.object.isRequired,
  children: _react2.default.PropTypes.node.isRequired
};

var contextTypes = {
  routeAggregator: _react2.default.PropTypes.instanceOf(_RouteAggregator2.default).isRequired
};

function RouteContainer(_ref, _ref2) {
  var routeAggregator = _ref2.routeAggregator;
  var queries = _ref.queries,
      routerProps = _ref.routerProps,
      children = _ref.children,
      props = (0, _objectWithoutProperties3.default)(_ref, ['queries', 'routerProps', 'children']);
  var key = routerProps.key,
      route = routerProps.route;


  var params = (0, _getParamsForRoute2.default)(routerProps);

  var _routeAggregator$getD = routeAggregator.getData(route, key, queries, params),
      failure = _routeAggregator$getD.failure,
      fragmentPointers = _routeAggregator$getD.fragmentPointers,
      readyState = _routeAggregator$getD.readyState;

  var shouldUpdate = true;
  var element = void 0;

  // This is largely copied from RelayRootContainer#render.
  if (failure) {
    var renderFailure = route.renderFailure;

    if (renderFailure && (typeof renderFailure === 'undefined' ? 'undefined' : (0, _typeof3.default)(renderFailure)) === 'object') {
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
    var data = (0, _extends3.default)({}, props, params, fragmentPointers);

    var renderFetched = route.renderFetched;

    if (renderFetched && (typeof renderFetched === 'undefined' ? 'undefined' : (0, _typeof3.default)(renderFetched)) === 'object') {
      renderFetched = renderFetched[key];
    }

    if (renderFetched) {
      element = renderFetched((0, _extends3.default)({}, routerProps, { data: data }), readyState);
    } else {
      element = _react2.default.cloneElement(children, data);
    }
  } else {
    var renderLoading = route.renderLoading;

    if (renderLoading && (typeof renderLoading === 'undefined' ? 'undefined' : (0, _typeof3.default)(renderLoading)) === 'object') {
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

  return _react2.default.createElement(
    _reactStaticContainer2.default,
    { shouldUpdate: shouldUpdate },
    element
  );
}

RouteContainer.propTypes = propTypes;
RouteContainer.contextTypes = contextTypes;

exports.default = RouteContainer;
module.exports = exports['default'];