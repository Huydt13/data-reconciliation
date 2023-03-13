import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { FiCommand } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { getHistories } from 'quarantine-facilities/actions/quarantine';

import { DataTable } from 'app/components/shared';
import { formatToDate } from 'app/utils/helpers';

import AppointModal from './AppointModal';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Hình thức',
    accessor: 'quarantineForm',
  },
  {
    Header: 'Mốc thời gian cách ly',
    formatter: ({ startTime }) => formatToDate(startTime),
  },
  {
    Header: 'Khu cách ly/ Đơn vị quản lý',
    accessor: 'quarantineFacility',
  },
  {
    Header: 'Ngày chỉ định',
    formatter: ({ appointedTime }) => formatToDate(appointedTime),
  },
  {
    Header: 'Ngày tiếp nhận',
    formatter: ({ takeInTime }) => formatToDate(takeInTime),
  },
  {
    Header: 'Ngày kết thúc',
    formatter: ({ actualEndTime }) => formatToDate(actualEndTime),
  },
  {
    Header: 'Trạng thái',
    accessor: 'status',
  },
];

const QuarantineHistoryTable = ({ profile }) => {
  const {
    historyData: { data, totalPages },
    getHistoriesLoading,
  } = useSelector((s) => s.quarantine);
  const dispatch = useDispatch();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [appointModal, setAppointModal] = useState(false);

  const getData = useCallback(() => {
    dispatch(
      getHistories({
        id: profile.id,
        pageSize,
        pageIndex,
      }),
    );
  }, [dispatch, pageSize, pageIndex, profile]);
  useEffect(getData, [getData]);

  return (
    <div>
      <DataTable
        title="Lịch sử cách ly"
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={getHistoriesLoading}
        pageCount={totalPages}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiCommand />,
            title: 'Chỉ định cách ly',
            color: 'yellow',
            onClick: () => setAppointModal(true),
            globalAction: true,
            hidden: (data || []).length > 0,
          },
        ]}
      />

      <AppointModal
        open={appointModal}
        onClose={() => setAppointModal(false)}
        onSubmit={getData}
        profile={profile}
      />
    </div>
  );
};

QuarantineHistoryTable.propTypes = {
  // onRefresh: PropTypes.func,
  profile: PropTypes.shape({
    id: PropTypes.number,
    fullName: PropTypes.string,
    information: PropTypes.shape({
      fullName: PropTypes.string,
      alias: PropTypes.string,
    }),
    diseaseLocation: PropTypes.shape({}),
    type: PropTypes.number,
    code: PropTypes.string,
    createFromType: PropTypes.number,
  }),
};

QuarantineHistoryTable.defaultProps = {
  // onRefresh: () => {},
  profile: {},
};

export default QuarantineHistoryTable;
