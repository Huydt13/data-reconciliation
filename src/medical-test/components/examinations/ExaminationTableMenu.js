import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Tab } from 'semantic-ui-react';
import ExamManagementTable from 'medical-test/components/examinations/ExamManagementTable';

import { useDispatch, useSelector } from 'react-redux';
import { getUnitInfo, clearExaminationDetailFilter } from 'medical-test/actions/medical-test';

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

const ExaminationTableChildMenu = (props) => {
  const {
    isTakenUnit,
    isReceivedUnit,
  } = props;

  const dispatch = useDispatch();
  const {
    clearExaminationDetailFilter: statusClearFilter,
  } = useSelector((state) => state.medicalTest);

  const panes = useMemo(() => ([
    {
      menuItem: 'Chờ xử lý',
      render: () => (
        <Tab.Pane attached={false}>
          <ExamManagementTable
            isTakenUnit={isTakenUnit}
            isReceivedUnit={isReceivedUnit}
            isWaitingSample
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Đã xử lý',
      render: () => (
        <Tab.Pane attached={false}>
          <ExamManagementTable
            isTakenUnit={isTakenUnit}
            isReceivedUnit={isReceivedUnit}
            isProcessedSample
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Mẫu không đạt',
      render: () => (
        <Tab.Pane attached={false}>
          <ExamManagementTable
            isTakenUnit={isTakenUnit}
            isReceivedUnit={isReceivedUnit}
            isUnQualifySample
          />
        </Tab.Pane>
      ),
    },
  ]), [
    isTakenUnit,
    isReceivedUnit,
  ]);

  return (
    <Tab
      menu={{ secondary: true, pointing: true }}
      panes={panes}
      onTabChange={() =>
        dispatch(clearExaminationDetailFilter(!statusClearFilter))
      }
    />
  );
};

ExaminationTableChildMenu.defaultProps = {
  isTakenUnit: undefined,
  isReceivedUnit: undefined,
};

ExaminationTableChildMenu.propTypes = {
  isTakenUnit: PropTypes.bool,
  isReceivedUnit: PropTypes.bool,
};

const ExaminationTableMenu = () => {
  const dispatch = useDispatch();
  const {
    unitInfo,
    clearExaminationDetailFilter: statusClearFilter,
  } = useSelector((state) => state.medicalTest);

  const panes = useMemo(() => {
    const menu = [
      {
        menuItem: 'Quản lý mẫu chung',
        render: () => (
          <Tab.Pane>
            <ExamManagementTable />
          </Tab.Pane>
        ),
      },
    ];
    if (unitInfo?.isCollector) {
      menu.push({
        menuItem: 'Quản lý mẫu tự lấy',
        render: () => (
          <Tab.Pane>
            <ExaminationTableChildMenu isTakenUnit />
          </Tab.Pane>
        ),
      });
    }

    if (unitInfo?.isTester) {
      menu.push({
        menuItem: 'Quản lý mẫu nhận từ nơi khác',
        render: () => (
          <Tab.Pane>
            <ExaminationTableChildMenu isReceivedUnit />
          </Tab.Pane>
        ),
      });
    }

    return menu;
  }, [unitInfo]);

  useEffect(() => {
    dispatch(getUnitInfo());
  }, [dispatch]);

  return (
    <MenuWrapper>
      <Tab
        panes={panes}
        onTabChange={() =>
          dispatch(clearExaminationDetailFilter(!statusClearFilter))
        }
      />
    </MenuWrapper>
  );
};

export default ExaminationTableMenu;
