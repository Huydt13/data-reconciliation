import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

import { useAuth } from "app/hooks";

const AppRoute = (props) => {
  const {
    component: Component,
    layout: Layout,
    path,
    exact,
    isPrivate,
  } = props;

  const { isAuthenticated } = useAuth();

  return (
    <Route
      path={path}
      exact={exact}
      render={(componentProps) => {
        if ((isPrivate && isAuthenticated()) || !isPrivate) {
          if (Layout) {
            return (
              <Layout>
                <Component
                  location={componentProps.location}
                  history={componentProps.history}
                />
              </Layout>
            );
          }
          return (
            <Component
              location={componentProps.location}
              history={componentProps.history}
            />
          );
        }
        return (
          <Redirect
            to={{
              pathname: "/",
              state: {
                from: componentProps.location,
              },
            }}
          />
        );
      }}
    />
  );
};

AppRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  layout: PropTypes.elementType,
  path: PropTypes.string,
  exact: PropTypes.bool,
  isPrivate: PropTypes.bool,
};

AppRoute.defaultProps = {
  layout: null,
  path: null,
  exact: false,
  isPrivate: false,
};

export default AppRoute;
