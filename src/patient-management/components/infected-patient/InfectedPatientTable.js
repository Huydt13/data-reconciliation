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
import { Header } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import InfectedPatientFilter from 'patient-management/components/infected-patient/InfectedPatientFilter';
import ImportInfectedPatientModal from 'patient-management/components/infected-patient/ImportInfectedPatientModal';
import CreateAssignExamModal from 'patient-management/components/infected-patient/CreateAssignExamModal';
import ExportInfectedPatientModal from 'patient-management/components/infected-patient/ExportInfectedPatientModal';

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

const Wrapper = styled.div`
  & .table {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-bottom: 0 !important;
  }
`;
const StyledIcon = styled.div`
  font-size: 20px;
  color: green;
  margin-left: 10px;
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
    Header: 'Mã',
    formatter: (r) => r?.profileHealthDeclarations[r?.profileHealthDeclarations.length - 1]?.code,
  },
  {
    Header: 'Họ và tên',
    formatter: (r) => r?.profileInformation?.fullName?.toUpperCase(),
    cutlength: 25,
  },
  {
    Header: 'Năm sinh',
    formatter: (r) => formatToYear(r?.profileInformation?.dateOfBirth),
  },
  {
    Header: 'Số điện thoại',
    formatter: (r) => r?.profileInformation?.phoneNumber,
  },
  {
    Header: 'Địa chỉ cư trú',
    formatter: ({ profileInformation }) => formatAddressToString({
        ...profileInformation?.addressInVietnam,
        streetHouseNumber: profileInformation?.addressInVietnam?.streetHouseNumber ?? '',
      }),
    cutlength: 25,
  },
  {
    Header: 'Tiền sử tiêm vắc xin',
    formatter: ({ profileInformation }) => (
      <div>
        {typeof (profileInformation?.immunizationStatus) !== 'undefined' ? (
          <Header sub>
            {immunizationStatusOptions.find(
              (o) => o.value === profileInformation?.immunizationStatus,
            )?.text ?? ''}
          </Header>
        ) : null}
        {typeof profileInformation?.lastInjectionDate !== 'undefined'
          && profileInformation?.immunizationStatus !== 0
          && profileInformation?.immunizationStatus !== 3 ? (
            <span>{moment(profileInformation?.lastInjectionDate).format('DD-MM-YYYY')}</span>
        ) : null}
      </div>
    ),
  },
  {
    Header: 'Thông tin xác minh',
    formatter: ({ profileHealthDeclarations }) => (
      <div>
        <Header sub>{profileHealthDeclarations[profileHealthDeclarations.length - 1]?.unit || '-'}</Header>
        <span>{formatToDate(profileHealthDeclarations[profileHealthDeclarations.length - 1]?.receptionDate)}</span>
      </div>
    ),
  },
  // {
  //   Header: "Kết quả",
  //   formatter: ({ profileHealthDeclarations }) =>
  //     profileHealthDeclarations[0]?.result ? (
  //       <div>
  //         <Header sub>{renderExaminationResult(profileHealthDeclarations[profileHealthDeclarations.length - 1]?.result)}</Header>
  //         <span>{formatToDate(profileHealthDeclarations[profileHealthDeclarations.length - 1]?.date)}</span>
  //       </div>
  //     ) : (
  //       ""
  //     ),
  // },

  {
    Header: 'Địa chỉ cách ly',
    formatter: ({ profileHealthDeclarations }) => formatAddressToString({
        ...profileHealthDeclarations[0]?.quarantineAddress,
        streetHouseNumber: profileHealthDeclarations[0]?.quarantineAddress?.streetHouseNumber ?? '',
      }),
    cutlength: 25,
  },
  {
    Header: 'Ca bệnh xác định',
    formatter: ({ profileHealthDeclarations }) => (
      profileHealthDeclarations[0]?.chainType === 1 ? null : <StyledIcon><FiCheck /></StyledIcon>
    ),
  },

];

const InfectedPatientTable = (props) => {
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
  const title = isManagementUnit
    ? 'Danh sách số ca f0 của cơ sở cấp dưới'
    : isSharedUnit
      ? 'Danh sách số ca f0 được chia sẻ'
      : 'Quản lý số ca khai báo f0';

  const pageCount = totalRows ? Math.ceil(totalRows / pageSize) : 0;

  const handleRefresh = useCallback(() => {
    dispatch(
      getInfectedPatients({
        ...filter,
        status: QUICK_TEST_STATUSES.DONE,
        FromDate: from || filter.FromDate,
        ToDate: to || filter.ToDate,
        DateType: filter.DateType ? filter.DateType === 1 ? 0 : filter.DateType : 4,
        DataSource: 2 || filter.DataSource,
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
  useEffect(handleRefresh, [handleRefresh]);
  const handleDelete = () => {
    dispatch(
      showConfirmModal('Xác nhận xóa?', async () => {
        await dispatch(deleteInfectedPatient(data.profileHealthDeclarations ? data.profileHealthDeclarations[data.profileHealthDeclarations.length - 1].guid : ''));
        handleRefresh();
      }),
    );
  };

  return (
    <Wrapper>
      <InfectedPatientFilter hideDateFilter={hideDateFilter} onChange={setFilter} />
      <DataTable
        title={title}
        loading={loading}
        columns={columns}
        data={(data || []).map((r, i) => ({
          ...r,
          index: i + 1,
        }))}
        filterByDate
        onFilterByDateChange={({ from: f, to: t, hideDateFilter: h }) => {
          setFrom(f ? moment(f).format('YYYY-MM-DDT00:00:00+07:00') : '');
          setTo(t ? moment(t).format('YYYY-MM-DDT23:59:59+07:00') : '');
          setHideDateFilter(h);
        }}
        pageCount={pageCount}
        totalCount={totalRows}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiShare />,
            title: 'Nạp dữ liệu từ Excel',
            color: 'purple',
            onClick: () => setImportInfectedPatientModal(true),
            globalAction: true,
            hidden:
              isManagementUnit
              || isSharedUnit
              || isDeleted
              || isUsername('hcdc'),
          },
          {
            icon: <FiDownload />,
            title: 'Xuất dữ liệu khai báo f0',
            color: 'blue',
            onClick: () => setExportInfectedPatientModal(true),
            globalAction: true,
            hidden: isManagementUnit || isSharedUnit || isDeleted,
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: ({ profileHealthDeclarations }) => {
              window.open(`/infected-patient-detail/${profileHealthDeclarations[profileHealthDeclarations.length - 1]?.guid}`, '_blank');
            },
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

      <ImportInfectedPatientModal
        open={importInfectedPatientModal}
        onClose={() => setImportInfectedPatientModal(false)}
        onRefresh={() => handleRefresh()}
      />
      <ExportInfectedPatientModal
        open={exportInfectedPatientModal}
        onClose={() => setExportInfectedPatientModal(false)}
      />
    </Wrapper>
  );
};

InfectedPatientTable.defaultProps = {
  isDeleted: false,
};

InfectedPatientTable.propTypes = {
  isDeleted: PropTypes.bool,
};

export default InfectedPatientTable;
