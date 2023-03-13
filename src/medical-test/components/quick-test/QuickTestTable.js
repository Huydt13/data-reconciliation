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
  FiRefreshCw,
  FiTrash2,
  FiDownload,
  FiRotateCcw,
} from 'react-icons/fi';
import { Header } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import QuickTestFilter from 'medical-test/components/quick-test/QuickTestFilter';
import ImportQuickTestModal from 'medical-test/components/quick-test/ImportQuickTestModal';
import CreateAssignExamModal from 'medical-test/components/quick-test/CreateAssignExamModal';
import UpdateQuickTestModal from 'medical-test/components/quick-test/UpdateQuickTestModal';
// import PublishQuickTestsModal from
//   'medical-test/components/quick-test/PublishQuickTestsModal';
// import PublishSingleQuickTestModal from
//   'medical-test/components/quick-test/PublishSingleQuickTestModal';
import ChangeProfileModal from 'medical-test/components/examinations/ChangeProfileModal';
import ExportQuickTestModal from 'medical-test/components/quick-test/ExportQuickTestModal';

import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from 'app/hooks';
import { showConfirmModal, exportExcel } from 'app/actions/global';
import {
  getQuickTests,
  getQuickTestsByUnitType,
  getQuickTestsByManagementUnit,
  getDeletedQuickTests,
  deleteQuickTest,
  deleteQuickTestByAdmin,
  recoveryQuickTest,
  changeProfileQuickTest,
} from 'medical-test/actions/medical-test';
import { QUICK_TEST_STATUSES } from 'medical-test/utils/constants';

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
    Header: 'Mã',
    accessor: 'code',
  },
  {
    Header: 'Họ và tên',
    formatter: ({ person }) => person?.name.toUpperCase(),
    cutlength: 25,
  },
  {
    Header: 'Năm sinh',
    formatter: ({ person }) => formatToYear(person?.dateOfBirth),
  },
  {
    Header: 'Số điện thoại',
    formatter: ({ person }) => person?.phone,
  },
  {
    Header: 'Địa chỉ',
    formatter: ({ person }) => formatAddressToString({
        ...person,
        streetHouseNumber: person?.houseNumber ?? '',
      }),
    cutlength: 30,
  },
  {
    Header: 'Tiền sử tiêm vắc xin',
    formatter: ({ vaccinationStatus, lastInjectionDate }) => (
      <div>
        {typeof vaccinationStatus !== 'undefined' ? (
          <Header sub>
            {immunizationStatusOptions.find(
              (o) => o.value === vaccinationStatus,
            )?.text ?? ''}
          </Header>
        ) : null}
        {typeof lastInjectionDate !== 'undefined'
          && vaccinationStatus !== 0
          && vaccinationStatus !== 3 ? (
            <span>{moment(lastInjectionDate).format('DD-MM-YYYY')}</span>
        ) : null}
      </div>
    ),
  },
  {
    Header: 'Thông tin lấy mẫu',
    formatter: ({ unit: { name }, examinationType, date }) => (
      <div>
        <div style={{ marginBottom: '-30px' }}>{examinationType?.name}</div>
        <Header sub>{name}</Header>
        <span>{formatToDate(date)}</span>
      </div>
    ),
  },
  {
    Header: 'Triệu chứng',
    formatter: ({ hasSymptom }) => (hasSymptom ? 'Có' : 'Không'),
  },
  {
    Header: 'Kết quả',
    formatter: ({ result }) => result ? (
      <div>
        <Header sub>{renderExaminationResult(result)}</Header>
      </div>
      ) : (
        ''
      ),
  },
  // {
  //   Header: 'Ngày công bố',
  //   formatter: ({ publishDate }) => publishDate ? moment(publishDate).format('DD-MM-YYYY') : '',
  // },
];

const QuickTestTable = (props) => {
  const { isManagementUnit, isSharedUnit, isDeleted } = props;
  const [filter, setFilter] = useState({});
  const [from, setFrom] = useState(
    moment().format('YYYY-MM-DDT00:00:00+07:00'),
  );
  const [to, setTo] = useState(moment().format('YYYY-MM-DDT23:59:59+07:00'));
  const [hideDateFilter, setHideDateFilter] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [importQuickTestModal, setImportQuickTestModal] = useState(false);
  const [updateQuickTestModal, setUpdateQuickTestModal] = useState(undefined);
  const [createAssignExamModal, setCreateAssignExamModal] = useState(undefined);
  // const [publishQuickTestsModal, setPublishQuickTestsModal] = useState(false);
  // const [publishSingleQuickTestModal, setPublishSingleQuickTestModal] = useState(undefined);
  const [selectingQuickTest, setSelectingQuickTest] = useState(undefined);
  // const [changeProfileModal, setChangeProfileModal] = useState(false);
  const [exportQuickTestModal, setExportQuickTestModal] = useState(false);

  const dispatch = useDispatch();
  const { isUsername } = useAuth();
  const {
    quickTestData,
    deletedQuickTestData,
    quickTestsByManagementUnitData,
    quickTestsByUnitTypeData,
    getQuickTestLoading,
    getQuickTestsByManagementUnitLoading,
    getQuickTestsByUnitTypeLoading,
  } = useSelector((state) => state.medicalTest);

  const loading = getQuickTestLoading
    || getQuickTestsByManagementUnitLoading
    || getQuickTestsByUnitTypeLoading;
  const title = isManagementUnit
    ? 'Danh sách test nhanh của cơ sở cấp dưới'
    : isSharedUnit
      ? 'Danh sách test nhanh được chia sẻ'
      : `Quản lý test nhanh ${isDeleted ? 'đã xoá' : ' đã thực hiện'}`;

  const data = isManagementUnit
    ? quickTestsByManagementUnitData?.data ?? []
    : isSharedUnit
      ? quickTestsByUnitTypeData?.data ?? []
      : isDeleted
        ? deletedQuickTestData?.data ?? []
        : quickTestData?.data ?? [];
  const pageCount = isManagementUnit
    ? quickTestsByManagementUnitData?.pageCount ?? 0
    : isSharedUnit
      ? quickTestsByUnitTypeData?.pageCount ?? 0
      : isDeleted
        ? deletedQuickTestData?.pageCount ?? 0
        : quickTestData?.pageCount ?? 0;
  // const exportQuickTestAvailableToPublish = async () => {
  //   await dispatch(
  //     exportExcel({
  //       method: 'GET',
  //       url: apiLinks.excel.exportQuickTestAvailableToPublish,
  //       params: {
  //         ...filter,
  //         from: from || filter.from,
  //         to: to || filter.to,
  //       },
  //       fileName: 'Xuất dữ liệu test nhanh có thể công bố',
  //       isExamination: true,
  //     }),
  //   );
  // };

  const exportQuicktestResultAnswerForm = async (d) => {
    await dispatch(
      exportExcel({
        method: 'GET',
        url: apiLinks.excel.exportQuickTestResultAnswerForm,
        params: {
          qtid: d.id,
        },
        fileName: `Phiếu kết quả test nhanh (${d?.code})`,
        isExamination: true,
      }),
    );
  };

  const handleRefresh = useCallback(() => {
    dispatch(
      isManagementUnit
        ? getQuickTestsByManagementUnit({
          ...filter,
          from: from || filter.from,
          to: to || filter.to,
          pageIndex,
          pageSize,
        })
        : isSharedUnit
          ? getQuickTestsByUnitType({
            ...filter,
            from: from || filter.from,
            to: to || filter.to,
            pageIndex,
            pageSize,
          })
          : isDeleted
            ? getDeletedQuickTests({
              ...filter,
              from: from || filter.from,
              to: to || filter.to,
              pageIndex,
              pageSize,
            })
            : getQuickTests({
              ...filter,
              status: QUICK_TEST_STATUSES.DONE,
              from: from || filter.from,
              to: to || filter.to,
              pageIndex,
              pageSize,
            }),
    );
  }, [
    dispatch,
    isManagementUnit,
    isSharedUnit,
    isDeleted,
    from,
    to,
    filter,
    pageIndex,
    pageSize,
  ]);
  useEffect(handleRefresh, [handleRefresh]);

  const handleChangeProfile = (d) => {
    const dispatchChangeProfile = async () => {
      dispatch(
        changeProfileQuickTest({
          quickTestId: selectingQuickTest.id,
          profileId: d.profileId,
        }),
      ).then(() => {
        setSelectingQuickTest(undefined);
        handleRefresh();
      });
    };

    dispatch(
      showConfirmModal(
        `Chuyển mẫu ${selectingQuickTest.code} cho hồ sơ ${d.fullName}`,
        () => {
          dispatchChangeProfile();
        },
      ),
    );
  };

  return (
    <Wrapper>
      <QuickTestFilter hideDateFilter={hideDateFilter} onChange={setFilter} />
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
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          // {
          //   icon: <FiSend />,
          //   title: 'Công bố test nhanh',
          //   color: 'green',
          //   dropdown: true,
          //   dropdownActions: [
          //     {
          //       titleDropdown: 'Công bố dữ liệu test nhanh',
          //       onDropdownClick: () => setPublishQuickTestsModal(true),
          //     },
          //     {
          //       titleDropdown: 'Xuất dữ liệu test nhanh có thể công bố',
          //       onDropdownClick: () => exportQuickTestAvailableToPublish(),
          //     },
          //   ],
          //   globalAction: true,
          //   hidden:
          //     isManagementUnit || isSharedUnit || isDeleted || isUsername('hcdc'),
          // },
          {
            icon: <FiShare />,
            title: 'Nạp dữ liệu từ Excel',
            color: 'purple',
            onClick: () => setImportQuickTestModal(true),
            globalAction: true,
            hidden:
              isManagementUnit
              || isSharedUnit
              || isDeleted
              || isUsername('hcdc'),
          },
          {
            icon: <FiDownload />,
            title: 'Xuất dữ liệu test nhanh chi tiết',
            color: 'blue',
            onClick: () => setExportQuickTestModal(true),
            globalAction: true,
            hidden: isManagementUnit || isSharedUnit || isDeleted,
          },
          {
            icon: <FiDownload />,
            title: 'Xuất phiếu kết quả test nhanh',
            color: 'green',
            onClick: (r) => exportQuicktestResultAnswerForm(r),
            hidden: isManagementUnit || isSharedUnit || isDeleted,
          },
          {
            icon: <FiCommand />,
            title: 'Chỉ định xét nghiệm PCR',
            color: 'yellow',
            onClick: (row) => setCreateAssignExamModal(row),
            hidden: isManagementUnit || isSharedUnit || isDeleted,
          },
          // {
          //   icon: <FiSend />,
          //   title: 'Công bố',
          //   color: 'green',
          //   onClick: (row) => setPublishSingleQuickTestModal(row),
          //   hidden:
          //     isManagementUnit || isSharedUnit || isDeleted || isUsername('hcdc'),
          // },
          {
            icon: <FiRefreshCw />,
            title: 'Đổi hồ sơ của mẫu',
            color: 'yellow',
            onClick: setSelectingQuickTest,
            hidden:
              isManagementUnit
              || isSharedUnit
              || isDeleted
              || !isUsername('hcdc'),
          },
          {
            icon: <FiEdit3 />,
            title: 'Sửa',
            color: 'violet',
            onClick: (row) => setUpdateQuickTestModal(row),
            hidden: isManagementUnit || isSharedUnit || isDeleted,
          },
          {
            icon: <FiTrash2 />,
            title: 'Xoá',
            color: 'red',
            onClick: (row) => dispatch(
                showConfirmModal('Xác nhận xóa?', () => {
                  dispatch(
                    isUsername('hcdc')
                      ? deleteQuickTestByAdmin(row.id)
                      : deleteQuickTest(row.id),
                  )
                    .then(() => {
                      handleRefresh();
                    })
                    .catch(() => { });
                }),
              ),
            hidden: isManagementUnit || isSharedUnit,
          },
          {
            icon: <FiRotateCcw />,
            title: 'Khôi phục',
            color: 'purple',
            onClick: (row) => dispatch(
                showConfirmModal('Xác nhận khôi phục?', () => {
                  dispatch(recoveryQuickTest(row.id)).then(() => {
                    handleRefresh();
                  });
                }),
              ),
            hidden: true,
            // isManagementUnit || isSharedUnit || isDeleted || !isUsername('hcdc'),
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: ({ person }) => {
              window.open(`/profile/${person?.profileId}`, '_blank');
            },
          },
        ]}
      />

      <ImportQuickTestModal
        open={importQuickTestModal}
        onClose={() => setImportQuickTestModal(false)}
        onRefresh={handleRefresh}
      />

      {/* <PublishQuickTestsModal
        open={publishQuickTestsModal}
        onClose={() => setPublishQuickTestsModal(false)}
        onRefresh={handleRefresh}
      /> */}

      <CreateAssignExamModal
        data={createAssignExamModal}
        onClose={() => setCreateAssignExamModal(undefined)}
        onRefresh={handleRefresh}
      />

      <UpdateQuickTestModal
        data={updateQuickTestModal}
        onClose={() => setUpdateQuickTestModal(undefined)}
        onRefresh={handleRefresh}
      />

      <ChangeProfileModal
        key={
          selectingQuickTest
            ? 'OpenChangeProfileModal'
            : 'CloseChangeProfileModal'
        }
        open={Boolean(selectingQuickTest?.id)}
        onClose={() => setSelectingQuickTest(undefined)}
        onSubmit={handleChangeProfile}
      />

      <ExportQuickTestModal
        open={exportQuickTestModal}
        onClose={() => setExportQuickTestModal(false)}
      />
    </Wrapper>
  );
};

QuickTestTable.defaultProps = {
  isDeleted: false,
};

QuickTestTable.propTypes = {
  isDeleted: PropTypes.bool,
};

export default QuickTestTable;
