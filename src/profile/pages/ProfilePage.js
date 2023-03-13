import React from "react";
import styled from "styled-components";

import { Tab } from "semantic-ui-react";
import ProfileTable from "profile/components/ProfileTable";

const Wrapper = styled.div`
  & .segment {
    background-color: white !important;
    &:hover {
      background-color: white !important;
    }
  }
`;

const panes = [
  // {
  //   menuItem: 'Hồ sơ đơn có lịch sử',
  //   render: () => (
  //     <Tab.Pane>
  //       <ProfileTable hasOnUsingProfiles hasGroupProfiles={false} />
  //     </Tab.Pane>
  //   ),
  // },
  // {
  //   menuItem: 'Hồ sơ đơn không lịch sử',
  //   render: () => (
  //     <Tab.Pane>
  //       <ProfileTable hasOnUsingProfiles={false} hasGroupProfiles={false} />
  //     </Tab.Pane>
  //   ),
  // },
  {
    menuItem: "Hồ sơ đơn",
    render: () => (
      <Tab.Pane>
        <ProfileTable hasGroupProfiles={false} />
      </Tab.Pane>
    ),
  },
  {
    menuItem: "Hồ sơ gộp",
    render: () => (
      <Tab.Pane>
        <ProfileTable hasGroupProfiles />
      </Tab.Pane>
    ),
  },
];

const ProfilePage = () => (
  <Wrapper>
    <Tab renderActiveOnly panes={panes} />
  </Wrapper>
);

export default ProfilePage;
