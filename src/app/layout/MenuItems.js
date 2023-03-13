import React from "react";
import styled from "styled-components";

import { useAuth } from "app/hooks";
import { Menu, Dropdown } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import useWindowSize from "app/hooks/use-window-size";

const StyledMenuItem = styled(Menu.Item)`
  padding: 0 !important;
  padding-right: 20px !important;
  span {
    font-size: 43px;
    font-weight: bold;
  }
`;
const StyledDropdown = styled(Dropdown)`
  div,
  i {
    color: black !important;
  }
`;

const MenuItems = () => {
  const history = useHistory();
  const { isAdmin, isHcdcDtr } = useAuth();
  const { isIpadSize } = useWindowSize();

  return (
    <>
      <StyledMenuItem
        header
        content={
          <>
            <span>Data reconciliation</span>
          </>
        }
        onClick={() => history.push("/home")}
      />
      <Menu.Item as={Link} to="/test" content="Test" />
    </>
  );
};

export default MenuItems;
