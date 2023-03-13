import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Tab } from 'semantic-ui-react';
import AssignQuickTestTable from 'medical-test/components/quick-test/AssignQuickTestTable';
import QuickTestTable from 'medical-test/components/quick-test/QuickTestTable';

import { useAuth } from 'app/hooks';

const MenuWrapper = styled.div`
  & .attached {
    padding-top: 0.5rem !important;
  }
  & .segment {
    background-color: white !important;
    &:hover {
      background-color: white !important;
    }
  }
`;

const QuickTestSelfMenu = () => {
  const { isAdmin } = useAuth();

  const panes = useMemo(() => {
    const paneList = [
      {
        menuItem: 'Chỉ định',
        render: () => (
          <Tab.Pane>
            <AssignQuickTestTable isWaiting />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Đã thực hiện',
        render: () => (
          <Tab.Pane>
            <QuickTestTable isDone />
          </Tab.Pane>
        ),
      },
    ];

    if (isAdmin) {
      // paneList.push({
      //   menuItem: 'Đã xoá',
      //   render: () => (
      //     <Tab.Pane>
      //       <QuickTestTable isDeleted />
      //     </Tab.Pane>
      //   ),
      // });
    }
    return paneList;
  }, [isAdmin]);

  return (
    <Tab
      menu={{ secondary: true, pointing: true }}
      panes={panes}
    />
  );
};

const QuickTestMenu = () => {
  const { isAdmin } = useAuth();

  const panes = useMemo(() => {
    let paneList = [
      {
        menuItem: 'Cơ sở hiện tại',
        render: () => (
          <Tab.Pane>
            <QuickTestSelfMenu />
          </Tab.Pane>
        ),
      },
    ];

    if (!isAdmin) {
      paneList = [
        ...paneList,
        {
          menuItem: 'Cơ sở cấp dưới',
          render: () => (
            <Tab.Pane>
              <QuickTestTable isManagementUnit />
            </Tab.Pane>
          ),
        },
        {
          menuItem: 'Được chia sẻ',
          render: () => (
            <Tab.Pane>
              <QuickTestTable isSharedUnit />
            </Tab.Pane>
          ),
        },
      ];
    }

    return paneList;
  }, [isAdmin]);

  return (
    <MenuWrapper>
      <Tab panes={panes} />
    </MenuWrapper>
  );
};

export default QuickTestMenu;
