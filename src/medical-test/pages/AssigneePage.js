import React, { useEffect } from 'react';
import { Tab } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { getPrefixes, getUnitInfo } from 'medical-test/actions/medical-test';

import AssigneeTable from 'medical-test/components/assigns/AssigneeTable';
import AnonymousAssignTable from 'medical-test/components/assigns/AnonymousAssignTable';
import AvailableTakingExamTable from 'medical-test/components/assigns/WaitingToTakeExamTable';

const panes = [
  {
    menuItem: 'Sẵn sàng lấy mẫu',
    render: () => (
      <Tab.Pane>
        <AssigneeTable isWaiting hasImport />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Chỉ định cũ',
    render: () => (
      <Tab.Pane>
        <AssigneeTable isOld />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Chờ lấy mẫu',
    render: () => (
      <Tab.Pane>
        <AvailableTakingExamTable />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Đã lấy mẫu',
    render: () => (
      <Tab.Pane>
        <AssigneeTable isTaken />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Mẫu chưa xác định',
    render: () => (
      <Tab.Pane>
        <AnonymousAssignTable />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Khác',
    render: () => (
      <Tab.Pane>
        <AssigneeTable />
      </Tab.Pane>
    ),
  },
];

const AssigneePage = () => {
  const dispatch = useDispatch();
  const { unitInfo, prefixList } = useSelector((state) => state.medicalTest);
  useEffect(() => {
    if (prefixList.length === 0) {
      dispatch(getPrefixes());
    }
    if (!unitInfo) {
      dispatch(getUnitInfo());
    }
    // eslint-disable-next-line
  }, [dispatch]);

  return <Tab renderActiveOnly panes={panes} />;
};

export default AssigneePage;
