'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRelay = require('react-relay');

var _reactRelay2 = _interopRequireDefault(_reactRelay);

var _RouteAggregator = require('./RouteAggregator');

var _RouteAggregator2 = _interopRequireDefault(_RouteAggregator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RelayRouterContext = function (_React$Component) {
  (0, _inherits3.default)(RelayRouterContext, _React$Component);

  function RelayRouterContext(props, context) {
    (0, _classCallCheck3.default)(this, RelayRouterContext);

    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props, context));

    _this.renderFailure = function (error, retry) {
      _this._routeAggregator.setFailure(error, retry);
      return _this.props.children;
    };

    _this.renderFetched = function (data, readyState) {
      _this._routeAggregator.setFetched(data, readyState);
      return _this.props.children;
    };

    _this.renderLoading = function () {
      _this._routeAggregator.setLoading();
      return _this.props.children;
    };

    _this._routeAggregator = new _RouteAggregator2.default();
    _this._routeAggregator.updateRoute(props);
    return _this;
  }

  RelayRouterContext.prototype.getChildContext = function getChildContext() {
    return {
      routeAggregator: this._routeAggregator
    };
  };

  RelayRouterContext.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.location === this.props.location) {
      return;
    }

    this._routeAggregator.updateRoute(nextProps);
  };

  RelayRouterContext.prototype.render = function render() {
    return _react2.default.createElement(_reactRelay2.default.RootContainer, (0, _extends3.default)({}, this.props, {
      Component: this._routeAggregator,
      renderFailure: this.renderFailure,
      renderFetched: this.renderFetched,
      renderLoading: this.renderLoading,
      route: this._routeAggregator.route
    }));
  };

  return RelayRouterContext;
}(_react2.default.Component);

RelayRouterContext.propTypes = {
  location: _react2.default.PropTypes.object.isRequired,
  children: _react2.default.PropTypes.node.isRequired
};
RelayRouterContext.childContextTypes = {
  routeAggregator: _react2.default.PropTypes.instanceOf(_RouteAggregator2.default).isRequired
};
exports.default = RelayRouterContext;
module.exports = exports['default'];