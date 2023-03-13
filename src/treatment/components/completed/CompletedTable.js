/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';

import { FiCornerUpLeft } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import {
  getFacilities,
  getFacilityInfo,
  getCompleted,
} from 'treatment/actions/facility';

import { useAuth } from 'app/hooks';
import {
  checkFilter,
  formatAddressToString,
  formatToTime,
  formatToYear,
  renderGender,
} from 'app/utils/helpers';

import { DataTable } from 'app/components/shared';

import CompletedFilter from './CompletedFilter';

import UndoModal from '../shared/UndoModal';

const columns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Họ và tên',
    formatter: ({ profile }) => profile.fullName,
    cutlength: 50,
  },
  {
    Header: 'Năm sinh',
    formatter: ({ profile }) => formatToYear(profile.dateOfBirth),
  },
  {
    Header: 'Giới tính',
    formatter: ({ profile }) => renderGender(profile),
  },
  {
    Header: 'Số điện thoại',
    formatter: ({ profile }) => profile.phoneNumber,
  },
  {
    Header: 'Địa chỉ nhà',
    formatter: ({ profile }) =>
      formatAddressToString(profile.addressesInVietnam[0] || {}),
  },
  {
    Header: 'Thời gian điều trị',
    formatter: ({ approveDate, expectedEndDate }) => (
      <div>
        <span>{`Thời gian bắt đầu: ${formatToTime(approveDate)}`}</span>
        <br />
        <span>
          Thời gian dự kiến hoàn thành:
          {`${formatToTime(expectedEndDate)}`}
        </span>
      </div>
    ),
  },
  {
    Header: 'Thông tin hoàn thành',
    formatter: ({ actualEndDate, completeNote }) => (
      <div>
        <span>{`Ghi chú: ${completeNote}`}</span>
        <br />
        <span>{`Thời gian hoàn thành: ${formatToTime(actualEndDate)}`}</span>
      </div>
    ),
  },
];

const CompletedTable = () => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [selecting, setSelecting] = useState(undefined);

  const facilityInfo = useSelector((s) => s.treatment.facility.facilityInfo);
  const getFacilityInfoLoading = useSelector(
    (s) => s.treatment.facility.getFacilityInfoLoading,
  );

  const { data, pageCount } = useSelector(
    (s) => s.treatment.facility.completedData,
  );
  const getDataLoading = useSelector(
    (s) => s.treatment.facility.getCompletedLoading,
  );

  const { isHcdcDtr } = useAuth();
  useEffect(() => {
    if (isHcdcDtr) {
      dispatch(getFacilities({ pageSize: 1000, pageIndex: 0 }));
    } else if (!facilityInfo) {
      dispatch(getFacilityInfo());
    }
  }, [dispatch, isHcdcDtr, facilityInfo]);

  const getData = useCallback(() => {
    dispatch(
      getCompleted({
        ...filter,
        pageSize,
        pageIndex,
      }),
    );
  }, [dispatch, filter, pageIndex, pageSize]);

  useEffect(getData, [getData]);

  return (
    <div>
      <CompletedFilter
        onChange={(d) => checkFilter(filter, d) && setFilter(d)}
      />
      <DataTable
        title="Danh sách hoàn thành"
        columns={columns}
        data={data.map((d, i) => ({ ...d, index: i + 1 }))}
        loading={getFacilityInfoLoading || getDataLoading}
        pageCount={pageCount}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageSize(ps);
          setPageIndex(pi);
        }}
        actions={[
          {
            icon: <FiCornerUpLeft />,
            color: 'red',
            title: 'Hoàn tác',
            onClick: setSelecting,
            disabled: (row) => !row.canUndoComplete,
          },
        ]}
      />

      <UndoModal
        onClose={() => setSelecting(undefined)}
        data={selecting}
        getData={getData}
      />
    </div>
  );
};

export default CompletedTable;
