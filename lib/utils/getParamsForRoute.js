'use strict';

exports.__esModule = true;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = getParamsForRoute;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _getRouteParams = require('react-router/lib/getRouteParams');

var _getRouteParams2 = _interopRequireDefault(_getRouteParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function getParamsForRoute(_ref) {
  var route = _ref.route,
      routes = _ref.routes,
      params = _ref.params,
      location = _ref.location;

  var paramsForRoute = {};

  // Extract route params for current route and all ancestors.
  for (var _iterator = routes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
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

    (0, _assign2.default)(paramsForRoute, (0, _getRouteParams2.default)(ancestorRoute, params));
    if (ancestorRoute === route) {
      break;
    }
  }

  (0, _assign2.default)(paramsForRoute, getLocationParams(route.queryParams, location.query), getLocationParams(route.stateParams, location.state));

  var prepareParams = route.prepareParams;

  if (prepareParams) {
    !(typeof prepareParams === 'function') ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'react-router-relay: Expected `prepareParams` to be a function.') : (0, _invariant2.default)(false) : void 0;
    paramsForRoute = prepareParams(paramsForRoute, route);
    !((typeof paramsForRoute === 'undefined' ? 'undefined' : (0, _typeof3.default)(paramsForRoute)) === 'object' && paramsForRoute !== null) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'react-router-relay: Expected `prepareParams` to return an object.') : (0, _invariant2.default)(false) : void 0;
  }

  return paramsForRoute;
}
module.exports = exports['default'];