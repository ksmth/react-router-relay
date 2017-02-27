import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import Relay from 'react-relay';

import RouteAggregator from './RouteAggregator';

var RelayRouterContext = function (_React$Component) {
  _inherits(RelayRouterContext, _React$Component);

  function RelayRouterContext(props, context) {
    _classCallCheck(this, RelayRouterContext);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

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

    _this._routeAggregator = new RouteAggregator();
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
    return React.createElement(Relay.RootContainer, _extends({}, this.props, {
      Component: this._routeAggregator,
      renderFailure: this.renderFailure,
      renderFetched: this.renderFetched,
      renderLoading: this.renderLoading,
      route: this._routeAggregator.route
    }));
  };

  return RelayRouterContext;
}(React.Component);

RelayRouterContext.propTypes = {
  location: React.PropTypes.object.isRequired,
  children: React.PropTypes.node.isRequired
};
RelayRouterContext.childContextTypes = {
  routeAggregator: React.PropTypes.instanceOf(RouteAggregator).isRequired
};
export default RelayRouterContext;