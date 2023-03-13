import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { FiPlus, FiUserPlus, FiX, FiFileText } from 'react-icons/fi';
import { DataTable } from 'app/components/shared';
import AssignQuickTestFilter from 'medical-test/components/quick-test/AssignQuickTestFilter';
import CreateAssignQuickTestModal from 'medical-test/components/quick-test/CreateAssignQuickTestModal';
import UpdateQuickTestModal from 'medical-test/components/quick-test/UpdateQuickTestModal';

import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';
import { showConfirmModal } from 'app/actions/global';
import {
  getQuickTests,
  deleteQuickTest,
  deleteQuickTestByAdmin,
} from 'medical-test/actions/medical-test';

import {
  formatToYear,
  formatAddressToString,
} from 'app/utils/helpers';

const Wrapper = styled.div`
  & .table {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-bottom: 0 !important;
  }
`;

const columns = [
  {
    Header: 'Người được chỉ định',
    formatter: ({ person }) => person?.name ?? '',
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
    formatter: ({ person }) =>
      formatAddressToString({
        ...person,
        streetHouseNumber: person?.houseNumber ?? '',
      }),
  },
  {
    Header: 'Tên cơ sở',
    formatter: ({ unit }) => unit?.name,
  },
  {
    Header: 'Ngày chỉ định',
    formatter: ({ date }) => moment(date).format('DD-MM-YYYY'),
  },
];

const AssignQuickTestTable = (props) => {
  const { isWaiting } = props;

  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [createProfileQuickTestModal, setCreateAssignQuickTestModal] = useState(false);
  const [updateQuickTestModal, setUpdateQuickTestModal] = useState(undefined);

  const dispatch = useDispatch();
  const { isUsername } = useAuth();
  const {
    quickTestData: { pageCount, data },
    getQuickTestLoading,
  } = useSelector((state) => state.medicalTest);

  const handleRefresh = useCallback(() => {
    dispatch(
      getQuickTests({
        ...filter,
        status: isWaiting ? 0 : 2,
        pageIndex,
        pageSize,
      }),
    );
  }, [dispatch, filter, isWaiting, pageIndex, pageSize]);
  useEffect(handleRefresh, [handleRefresh]);

  return (
    <Wrapper>
      <AssignQuickTestFilter onChange={setFilter} />
      <DataTable
        title="Danh sách chỉ định test nhanh"
        loading={getQuickTestLoading}
        columns={columns}
        data={(data || []).map((r, i) => ({
          ...r,
          index: i + 1,
        }))}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiUserPlus />,
            title: 'Tạo đối tượng',
            color: 'green',
            onClick: () => setCreateAssignQuickTestModal(true),
            globalAction: true,
            hidden: !isWaiting || isUsername('hcdc'),
          },
          {
            icon: <FiPlus />,
            title: 'Thêm xét nghiệm',
            color: 'green',
            onClick: (row) => setUpdateQuickTestModal(row),
            hidden: !isWaiting || isUsername('hcdc'),
          },
          {
            icon: <FiX />,
            title: 'Xoá',
            color: 'red',
            onClick: (row) => dispatch(
              showConfirmModal('Xác nhận xóa?', () => {
                dispatch(
                  isUsername('hcdc')
                  ? deleteQuickTestByAdmin(row.id)
                  : deleteQuickTest(row.id),
                ).then(() => {
                  handleRefresh();
                }).catch(() => {});
              }),
            ),
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

      <CreateAssignQuickTestModal
        open={createProfileQuickTestModal}
        onClose={() => setCreateAssignQuickTestModal(false)}
        onRefresh={handleRefresh}
      />

      <UpdateQuickTestModal
        isCreateExam
        data={updateQuickTestModal}
        onClose={() => setUpdateQuickTestModal(undefined)}
        onRefresh={handleRefresh}
      />
    </Wrapper>
  );
};

AssignQuickTestTable.defaultProps = {
  isWaiting: false,
};

AssignQuickTestTable.propTypes = {
  isWaiting: PropTypes.bool,
};

export default AssignQuickTestTable;
