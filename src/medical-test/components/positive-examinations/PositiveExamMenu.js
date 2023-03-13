import React from 'react';
import styled from 'styled-components';

import { Tab } from 'semantic-ui-react';
import PositiveExamTable from 'medical-test/components/positive-examinations/PositiveExamTable';

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
        <PositiveExamTable />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Tất cả',
    render: () => (
      <Tab.Pane>
        <PositiveExamTable isGetAll />
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
