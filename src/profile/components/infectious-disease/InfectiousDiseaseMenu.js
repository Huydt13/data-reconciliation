import React from 'react';
import styled from 'styled-components';

import { Tab } from 'semantic-ui-react';
import InfectiousDiseaseTable from 'profile/components/infectious-disease/InfectiousDiseaseTable';

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
    menuItem: 'F0 hiện tại',
    render: () => (
      <Tab.Pane>
        <InfectiousDiseaseTable isNewest />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'F0',
    render: () => (
      <Tab.Pane>
        <InfectiousDiseaseTable />
      </Tab.Pane>
    ),
  },
];

const InfectiousDiseaseMenu = () => (
  <Wrapper>
    <Tab renderActiveOnly panes={panes} />
  </Wrapper>
);

export default InfectiousDiseaseMenu;
