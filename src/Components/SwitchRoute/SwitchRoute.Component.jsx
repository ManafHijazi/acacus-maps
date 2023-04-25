import React, { memo, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

export const SwitchRouteComponent = memo(({ routes }) => {
  /**
   * @author Manaf Hijazi (manafhijazii@gmail.com)
   * @Description this method is to get the latest active child
   * of the route or the component or if the route not exists
   * at all then redirect to the first default
   * P.S:- need to enhance in future projects to check if
   * the first default is can be accessed or not
   * if not then redirect to the login page or
   * the authorized page like landing page
   * directly before even enter the init of the pages
   */
  const getCurrentRouteGroup = useMemo(
    () => (currentRoutes) => {
      const localPath = window.location.pathname || '';
      const routeIndex = currentRoutes.findIndex(
        (f) =>
          (f.isExact && localPath === f.layout + f.path) ||
          (!f.isExact && localPath.includes(f.layout + f.path))
      );
      if (routeIndex !== -1) {
        if (currentRoutes[routeIndex].component) return currentRoutes;
        if (currentRoutes[routeIndex].children && currentRoutes[routeIndex].children.length > 0)
          return getCurrentRouteGroup(currentRoutes[routeIndex].children);
      }
      const currentDefault = currentRoutes.find((f) => f.default);
      if (
        currentDefault &&
        currentDefault.isRecursive &&
        currentDefault.children &&
        currentDefault.children.length > 0
      )
        return getCurrentRouteGroup(currentDefault.children);

      return currentDefault;
    },
    []
  );

  const [route, setRoute] = useState(getCurrentRouteGroup(routes));
  const history = useHistory();

  useEffect(() => {
    setRoute(getCurrentRouteGroup(routes));
  }, [getCurrentRouteGroup, history, routes]);

  return (
    <Switch>
      {route &&
        Array.isArray(route) &&
        route.map((value, key) => {
          if (!value.isRoute || !value.component) return null;
          if (!value.defaultPermissions)
            return (
              <Route
                path={value.layout + value.path}
                component={value.component}
                key={`publicRoute${key + 1}`}
                exact={value.isExact}
              />
            );
        })}
      {route && !Array.isArray(route) && <Redirect from='**' to={route.layout + route.path} />}
      <Route path='**' component={null} />
    </Switch>
  );
});

SwitchRouteComponent.displayName = 'SwitchRouteComponent';

SwitchRouteComponent.propTypes = {
  routes: PropTypes.instanceOf(Array).isRequired,
};
