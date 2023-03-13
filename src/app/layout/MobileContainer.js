import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Responsive,
  Segment,
  Menu,
  Container,
  Sidebar,
} from 'semantic-ui-react';
import { FiMenu } from 'react-icons/fi';
import styled from 'styled-components';

import { useSelector } from 'react-redux';

import MenuItems from './MenuItems';
import UserProfileButton from './UserProfileButton';

const StyledMenuButtonItem = styled(Menu.Item)`
  padding: 10px !important;
  padding-left: 0 !important;
  & svg {
    font-size: 44px;
  }
`;
const StyledMenuItem = styled(Menu.Item)`
  padding-right: 0 !important;
  margin-right: 0 !important;
`;

const MobileContainer = (props) => {
  const { children, getWidth } = props;
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const sidebarOpen = useSelector((s) => s.global.sidebarOpen);
  useEffect(() => setSidebarOpened(sidebarOpen), [sidebarOpen]);

  return (
    <Responsive
      as={Sidebar.Pushable}
      style={{ minHeight: '100vh' }}
      getWidth={getWidth}
      maxWidth={Responsive.onlyMobile.maxWidth}
    >
      <Sidebar
        as={Menu}
        animation="push"
        inverted
        onHide={() => setSidebarOpened(false)}
        vertical
        visible={sidebarOpened}
      >
        <MenuItems getWidth={getWidth} />
      </Sidebar>

      <Sidebar.Pusher dimmed={sidebarOpened} style={{ minHeight: '100vh' }}>
        <Segment inverted textAlign="center" vertical>
          <Container>
            <Menu inverted pointing secondary size="large">
              <StyledMenuButtonItem onClick={() => setSidebarOpened(true)}>
                <FiMenu />
              </StyledMenuButtonItem>
              <StyledMenuItem position="right">
                <UserProfileButton />
              </StyledMenuItem>
            </Menu>
          </Container>
        </Segment>

        {children}
      </Sidebar.Pusher>
    </Responsive>
  );
};

MobileContainer.propTypes = {
  children: PropTypes.node,
  getWidth: PropTypes.func,
};

MobileContainer.defaultProps = {
  children: null,
  getWidth: () => {},
};

export default MobileContainer;
