import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Responsive,
  Visibility,
  Segment,
  Menu,
  Container,
} from 'semantic-ui-react';
import styled from 'styled-components';

import MenuItems from './MenuItems';
import UserProfileButton from './UserProfileButton';

const StyledMenuItem = styled(Menu.Item)`
  padding-right: 0 !important;
  margin-right: 0 !important;
`;

const DesktopContainer = (props) => {
  const { children, getWidth } = props;
  const [fixed, setFixed] = useState(false);

  return (
    <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
      <Visibility
        once={false}
        onBottomPassed={() => setFixed(true)}
        onBottomPassedReverse={() => setFixed(false)}
      >
        <Segment
          inverted
          textAlign="center"
          style={{ padding: '1em 0em' }}
          vertical
        >
          <Menu
            fixed={fixed ? 'top' : null}
            inverted={!fixed}
            secondary={!fixed}
            size="large"
          >
            <Container>
              <MenuItems />
              <StyledMenuItem position="right">
                <UserProfileButton inverted={!fixed} />
              </StyledMenuItem>
            </Container>
          </Menu>
        </Segment>
      </Visibility>

      {children}
    </Responsive>
  );
};

DesktopContainer.propTypes = {
  children: PropTypes.node,
  getWidth: PropTypes.func,
};

DesktopContainer.defaultProps = {
  children: null,
  getWidth: () => {},
};

export default DesktopContainer;
