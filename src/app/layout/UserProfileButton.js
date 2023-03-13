import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'semantic-ui-react';
import { FiLogOut, FiUser, FiKey } from 'react-icons/fi';
import styled from 'styled-components';

import { useAuth } from 'app/hooks';
import { useHistory } from 'react-router-dom';

const StyledIconWrapper = styled.span`
  font-size: 1em;
  margin-right: 5px;
  & svg {
    vertical-align: bottom;
  }
`;

const UserProfileButton = (props) => {
  const { inverted } = props;

  const history = useHistory();

  const { getAuthInfo, logout } = useAuth();
  const userInfo = getAuthInfo();

  return (
    <>
      <Button.Group>
        <Button inverted={inverted}>{userInfo?.Username}</Button>
        <Dropdown
          floating
          simple
          className="button icon"
          // eslint-disable-next-line react/jsx-fragments
          trigger={<React.Fragment />}
        >
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                history.push('/info');
              }}
            >
              <StyledIconWrapper>
                <FiUser />
              </StyledIconWrapper>
              Thông tin tài khoản
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                history.push('/change-password');
              }}
            >
              <StyledIconWrapper>
                <FiKey />
              </StyledIconWrapper>
              Đổi mật khẩu
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                logout();
                history.push('/login');
              }}
            >
              <StyledIconWrapper>
                <FiLogOut />
              </StyledIconWrapper>
              Đăng xuất
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Button.Group>
    </>
  );
};

UserProfileButton.propTypes = {
  inverted: PropTypes.bool,
};

UserProfileButton.defaultProps = {
  inverted: true,
};

export default UserProfileButton;
