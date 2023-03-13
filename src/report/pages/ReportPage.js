import React from 'react';
import { Container, Tab } from 'semantic-ui-react';
import styled from 'styled-components';

const StyledTabPane = styled(Tab.Pane)`
  margin: 0 !important;
  border-top: 0 !important;
  border-top-right-radius: 0 !important;
  border-top-left-radius: 0 !important;
`;
const childPanes = [
  {
    menuItem: 'Tab 1.1 child',
    parentIndex: 1,
    render: () => <Tab.Pane attached={false}>Tab 1.1 child Content</Tab.Pane>,
  },
  {
    menuItem: 'Tab 1.2 child',
    parentIndex: 1,
    render: () => <Tab.Pane attached={false}>Tab 1.2 child Content</Tab.Pane>,
  },
  {
    menuItem: 'Tab 1.3 child',
    parentIndex: 1,
    render: () => <Tab.Pane attached={false}>Tab 1.3 child Content</Tab.Pane>,
  },
  {
    menuItem: 'Tab 2.1 child',
    parentIndex: 2,
    render: () => <Tab.Pane attached={false}>Tab 2.1 child Content</Tab.Pane>,
  },
  {
    menuItem: 'Tab 2.2 child',
    parentIndex: 2,
    render: () => <Tab.Pane attached={false}>Tab 2.2 child Content</Tab.Pane>,
  },
  {
    menuItem: 'Tab 2.3 child',
    parentIndex: 2,
    render: () => <Tab.Pane attached={false}>Tab 2.3 child Content</Tab.Pane>,
  },
];

const panes = [
  {
    menuItem: 'Tab 1',
    render: () => (
      <StyledTabPane attached={false}>
        <Tab
          menu={{ pointing: true }}
          panes={childPanes.filter((e) => e.parentIndex === 1)}
        />
      </StyledTabPane>
    ),
  },
  {
    menuItem: 'Tab 2',
    render: () => (
      <StyledTabPane attached={false}>
        <Tab
          menu={{ pointing: true }}
          panes={childPanes.filter((e) => e.parentIndex === 2)}
        />
      </StyledTabPane>
    ),
  },
];

const ReportPage = () => (
  <Container>
    <Tab panes={panes} />
  </Container>
);

export default ReportPage;
