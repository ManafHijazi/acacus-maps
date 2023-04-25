import React, { memo } from 'react';
import { Route } from 'react-router-dom'; // Redirect
import PropTypes from 'prop-types';

export const PrivateRouteComponent = memo(
  ({ component: Component, login, addRoute, isExact, ...rest }) => (
    <Route
      {...rest}
      render={(props) => <Component {...props} exact={isExact} addRoute={addRoute} />}
    />
  )
);

PrivateRouteComponent.displayName = 'PrivateRouteComponent';

PrivateRouteComponent.propTypes = {
  component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  login: PropTypes.string,
  isExact: PropTypes.bool,
  addRoute: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
PrivateRouteComponent.defaultProps = {
  component: undefined,
  login: '/accounts/login',
  addRoute: undefined,
  exact: undefined,
};
