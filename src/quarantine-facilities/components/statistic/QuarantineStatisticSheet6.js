import { DataTable } from 'app/components/shared';
import React from 'react';

const columns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Tên khu cách ly',
    formatter: () => `Khu cách ly quận ${Math.floor(Math.random() * 12)}`,
  },
  {
    Header: 'Khả năng tiếp nhận',
    columns: [
      {
        Header: 'Sức chứa',
        formatter: () => Math.floor(Math.random() * 100),
      },
      {
        Header: 'Số giường đã sử dụng',
        formatter: () => Math.floor(Math.random() * 100),
      },
      {
        Header: 'Số giường còn trống',
        formatter: () => Math.floor(Math.random() * 100),
      },
    ],
  },
  {
    Header: 'Tình hình cách ly',
    columns: [
      {
        Header: 'Số người cách ly đã báo cáo cuối ngày trước',
        formatter: () => Math.floor(Math.random() * 100),
      },
      {
        Header:
          'Tổng số (lũy tích) cách ly từ ngày đầu tiên đến đầu ngày báo cáo',
        formatter: () => Math.floor(Math.random() * 100),
      },
      {
        Header: 'Số nhận mới trong 24 giờ qua',
        formatter: () => Math.floor(Math.random() * 100),
      },
      {
        Header: 'Số người chuyển đi trong 24 giờ qua',
        formatter: () => Math.floor(Math.random() * 100),
      },
      {
        Header: 'Số người ra về trong 24 giờ qua  ',
        formatter: () => Math.floor(Math.random() * 100),
      },
      {
        Header: 'Số người đang hiện diện cách ly',
        formatter: () => Math.floor(Math.random() * 100),
      },
      {
        Header: 'Tổng số (lũy tích) cách ly  đến cuối  ngày báo cáo',
        formatter: () => Math.floor(Math.random() * 100),
      },
      {
        Header: 'Tổng số (lũy tích) người hết cách ly',
        formatter: () => Math.floor(Math.random() * 100),
      },
    ],
  },
];

const data = [
  { index: 1 },
  { index: 2 },
  { index: 3 },
  { index: 4 },
  { index: 5 },
];

const QuarantineStatisticSheet6 = () => (
  <div>
    <DataTable celled columns={columns} data={data} />
  </div>
);

export default QuarantineStatisticSheet6;
