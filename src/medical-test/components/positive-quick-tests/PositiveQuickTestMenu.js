import React from 'react';
import styled from 'styled-components';

import { Tab } from 'semantic-ui-react';
import PositiveQuickTestTable from 'medical-test/components/positive-quick-tests/PositiveQuickTestTable';

const Wrapper = styled.div`
  & .segment {
    background-color: white !important;
    &:hover {
      background-color: white !important;
    }
  }
`;

const panes = [
  {
    menuItem: 'Ngày hiện tại',
    render: () => (
      <Tab.Pane>
        <PositiveQuickTestTable />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Tất cả',
    render: () => (
      <Tab.Pane>
        <PositiveQuickTestTable isGetAll />
      </Tab.Pane>
    ),
  },
];

const PositiveQuickTestMenu = () => (
  <Wrapper>
    <Tab renderActiveOnly panes={panes} />
  </Wrapper>
);

export default PositiveQuickTestMenu;
