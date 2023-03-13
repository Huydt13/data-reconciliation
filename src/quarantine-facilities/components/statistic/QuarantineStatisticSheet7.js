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
        Header: 'Số nhận mới cách ly trong 24 giờ qua',
        formatter: () => Math.floor(Math.random() * 100),
      },
      {
        Header: 'Số người chuyển đi trong 24 giờ qua',
        formatter: () => Math.floor(Math.random() * 100),
      },
      {
        Header: 'Số người hết cách ly trong 24 giờ qua  ',
        formatter: () => Math.floor(Math.random() * 100),
      },
      {
        Header: 'Số người đang cách ly',
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
  {
    Header: 'Ghi chú',
    accessor: 'a',
  },
];

const data = [
  { index: 1 },
  { index: 2 },
  { index: 3 },
  { index: 4 },
  { index: 5 },
];

const QuarantineStatisticSheet7 = () => (
  <div>
    <DataTable celled columns={columns} data={data} />
  </div>
);

export default QuarantineStatisticSheet7;
