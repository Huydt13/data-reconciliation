import React, { useCallback, useEffect } from 'react';
import { DataTable } from 'app/components/shared';
import { getQuarantineStatistic1 } from 'quarantine-facilities/actions/quarantine-statistic';
import { useDispatch, useSelector } from 'react-redux';

const columns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Tên khu cách ly',
    formatter: ({ quarantineFacility: { description } }) => description,
  },
  {
    Header: 'Khả năng tiếp nhận',
    columns: [
      {
        Header: 'Sức chứa',
        accessor: 'abilityToReceive',
      },
      {
        Header: 'Số phòng',
        accessor: 'room',
      },
      {
        Header: 'Số giường đã sử dụng',
        accessor: 'occupancy',
      },
      {
        Header: 'Số giường còn trống',
        accessor: 'availableBed',
      },
    ],
  },
  {
    Header: 'Tình hình cách ly',
    columns: [
      {
        Header: 'Số người cách ly đã báo cáo cuối ngày trước',
        accessor: 'lastDayReported',
      },
      {
        Header:
          'Tổng số (lũy tích) cách ly từ ngày đầu tiên đến đầu ngày báo cáo',
        accessor: 'totalOccupiers',
      },
      {
        Header: 'Số nhận mới trong 24 giờ qua',
        accessor: 'newOccupiersWithin24Hours',
      },
      {
        Header: 'Số người chuyển đi trong 24 giờ qua',
        accessor: 'movedOccupiersWithin24Hours',
      },
      {
        Header: 'Số người ra về trong 24 giờ qua  ',
        accessor: 'releasedOccupiersWithin24Hours',
      },
      {
        Header: 'Số người đang hiện diện cách ly',
        accessor: 'currentOccupiers',
      },
      {
        Header: 'Tổng số (lũy tích) cách ly  đến cuối  ngày báo cáo',
        accessor: 'currentOccupiersAtLastHour',
      },
      {
        Header: 'Tổng số (lũy tích) người hết cách ly',
        accessor: 'totalReleasedOccupiers',
      },
    ],
  },
];

const QuarantineStatisticSheet1 = () => {
  const dispatch = useDispatch();
  const {
    quarantineStatistic1Data,
    getQuarantineStatistic1Loading,
  } = useSelector((s) => s.quarantineStatistic);

  const getData = useCallback(() => {
    dispatch(getQuarantineStatistic1());
  }, [dispatch]);
  useEffect(getData, [getData]);
  return (
    <div>
      <DataTable
        celled
        columns={columns}
        data={quarantineStatistic1Data.map((r, i) => ({ ...r, index: i + 1 }))}
        loading={getQuarantineStatistic1Loading}
      />
    </div>
  );
};

export default QuarantineStatisticSheet1;
