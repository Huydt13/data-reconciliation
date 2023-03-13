import React from 'react';
import PropTypes from 'prop-types';
import { Responsive } from 'semantic-ui-react';

import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';

const getWidth = () =>
  typeof window === 'undefined'
    ? Responsive.onlyTablet.minWidth
    : window.innerWidth;

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer getWidth={getWidth}>{children}</DesktopContainer>
    <MobileContainer getWidth={getWidth}>{children}</MobileContainer>
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

ResponsiveContainer.defaultProps = {
  children: null,
};

const AppLayout = (props) => {
  const { children } = props;

  return (
    <>
      <ResponsiveContainer>
        <div style={{ padding: '1em 1.5em' }}>
          {children}
        </div>
      </ResponsiveContainer>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
