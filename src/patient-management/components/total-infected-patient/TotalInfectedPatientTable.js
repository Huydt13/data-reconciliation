/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  FiFileText,
  FiEdit3,
  FiShare,
  FiCommand,
  // FiSend,
  FiCheck,
  FiRefreshCw,
  FiTrash2,
  FiDownload,
  FiRotateCcw,
} from 'react-icons/fi';
import { Header, Popup } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import ImportInfectedPatientModal from 'patient-management/components/infected-patient/ImportInfectedPatientModal';
import CreateAssignExamModal from 'patient-management/components/infected-patient/CreateAssignExamModal';

import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from 'app/hooks';
import { showConfirmModal, exportExcel } from 'app/actions/global';
import {
  getQuickTestsByUnitType,
  getQuickTestsByManagementUnit,
  getInfectedPatients,
  deleteInfectedPatient,
} from 'patient-management/actions/medical-test';
import { QUICK_TEST_STATUSES } from 'patient-management/utils/constants';

import {
  formatToYear,
  formatToDate,
  renderExaminationResult,
  formatAddressToString,
} from 'app/utils/helpers';
import apiLinks from 'app/utils/api-links';
import { IconButton } from 'app/components/shared/data-table/Elements';
import TotalInfectedPatientFilter from './TotalInfectedPatientFilter';
import ExportTotalInfectedPatientModal from './ExportTotalInfectedPatientModal';

const Wrapper = styled.div`
  & .table {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-bottom: 0 !important;
  }
`;
const StyledIconButtonWrapper = styled.span`
  margin-left: 10px !important;
`;

const immunizationStatusOptions = [
  { key: 0, value: 0, text: 'Chưa tiêm' },
  { key: 1, value: 1, text: 'Tiêm 1 mũi' },
  { key: 2, value: 2, text: 'Tiêm 2 mũi' },
  { key: 3, value: 3, text: 'Chưa rõ' },
  { key: 4, value: 4, text: 'Tiêm trên 2 mũi' },
];

const columns = [
  {
    Header: '#',
    accessor: 'index',
  },

  {
    Header: 'Họ và tên',
    formatter: (r) => r?.profileInformation?.fullName?.toUpperCase(),
    cutlength: 25,
  },

  {
    Header: 'Từ nguồn khai báo',
    formatter: ({ profileHealthDeclarations }) => (
      profileHealthDeclarations[0]?.dataSource === 2 || profileHealthDeclarations[0]?.duplicateId
        ? <Popup
          inverted
          size="tiny"
          key="Hồ sơ"
          content="Hồ sơ"
          trigger={
            <StyledIconButtonWrapper key="Hồ sơ">
              <IconButton
                basic
                color="blue"
                icon={<FiFileText />}
                title="Hồ sơ"
                onClick={() => window.open(`/infected-patient-detail/${profileHealthDeclarations[0]?.dataSource === 2 ? profileHealthDeclarations[0]?.guid : profileHealthDeclarations[0]?.duplicateId}`, '_blank')
                }
              />
            </StyledIconButtonWrapper>
          }
        />
        : null
    ),
  },
  {
    Header: 'Từ nguồn cơ sở',
    formatter: ({ profileHealthDeclarations }) => (
      profileHealthDeclarations[0]?.dataSource === 1 || profileHealthDeclarations[0]?.duplicateId
        ? <Popup
          inverted
          size="tiny"
          key="Hồ sơ"
          content="Hồ sơ"
          trigger={
            <StyledIconButtonWrapper key="Hồ sơ">
              <IconButton
                basic
                color="blue"
                icon={<FiFileText />}
                title="Hồ sơ"
                onClick={() => window.open(`/infected-patient-detail/${profileHealthDeclarations[0]?.dataSource === 1 ? profileHealthDeclarations[0]?.guid : profileHealthDeclarations[0]?.duplicateId}`, '_blank')
                }
              />
            </StyledIconButtonWrapper>
          }
        />
        : null
    ),
  },
];

const TotalInfectedPatientTable = (props) => {
  const { isManagementUnit, isSharedUnit, isDeleted, isDone } = props;
  const { isAdmin } = useAuth();

  const [filter, setFilter] = useState({});
  const [from, setFrom] = useState(moment().format('YYYY-MM-DDT00:00:00+07:00'));
  const [to, setTo] = useState(moment().format('YYYY-MM-DDT23:59:59+07:00'));
  const [hideDateFilter, setHideDateFilter] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [importInfectedPatientModal, setImportInfectedPatientModal] = useState(false);
  const [updateQuickTestModal, setUpdateQuickTestModal] = useState(undefined);
  const [createAssignExamModal, setCreateAssignExamModal] = useState(undefined);
  const [selectingQuickTest, setSelectingQuickTest] = useState(undefined);
  const [exportInfectedPatientModal, setExportInfectedPatientModal] = useState(false);

  const dispatch = useDispatch();
  const { isUsername } = useAuth();
  const {
    infectedPatients: { totalRows, data },
    getInfectedPatientsLoading,
  } = useSelector((state) => state.infectedPatient);
  const loading = getInfectedPatientsLoading;

  const pageCount = totalRows ? Math.ceil(totalRows / pageSize) : 0;


  const handleRefresh = useCallback(() => {
    dispatch(
      getInfectedPatients({
        ...filter,
        status: QUICK_TEST_STATUSES.DONE,
        DateType: filter.DateType ? filter.DateType === 1 ? 0 : filter.DateType : 4,
        PageIndex: pageIndex,
        PageSize: pageSize,
      }),
    );
  }, [
    dispatch,
    filter,
    from,
    to,
    pageIndex,
    pageSize,
  ]);
  const handleDelete = () => {
    dispatch(
      showConfirmModal('Xác nhận xóa?', async () => {
        await dispatch(deleteInfectedPatient(data.profileHealthDeclarations ? data.profileHealthDeclarations[data.profileHealthDeclarations.length - 1].guid : ''));
        handleRefresh();
      }),
    );
  };
  useEffect(handleRefresh, [handleRefresh]);
  return (
    <Wrapper>
      <TotalInfectedPatientFilter hideDateFilter={hideDateFilter} onChange={setFilter} />
      <DataTable
        title="Danh sách tổng F0"
        loading={loading}
        columns={columns}
        data={(data || []).map((r, i) => ({
          ...r,
          index: i + 1,
        }))}
        pageCount={pageCount}
        totalCount={totalRows}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiDownload />,
            title: 'Xuất dữ liệu',
            color: 'blue',
            onClick: () => setExportInfectedPatientModal(true),
            globalAction: true,
            hidden: isManagementUnit || isSharedUnit || isDeleted,
          },
          {
            icon: <FiTrash2 />,
            title: 'Xóa',
            color: 'red',
            onClick: handleDelete,
            hidden: !isAdmin,
          },
        ]}
      />

      <ExportTotalInfectedPatientModal
        open={exportInfectedPatientModal}
        onClose={() => setExportInfectedPatientModal(false)}
      />
    </Wrapper>
  );
};

TotalInfectedPatientTable.defaultProps = {
  isDeleted: false,
};

TotalInfectedPatientTable.propTypes = {
  isDeleted: PropTypes.bool,
};

export default TotalInfectedPatientTable;
