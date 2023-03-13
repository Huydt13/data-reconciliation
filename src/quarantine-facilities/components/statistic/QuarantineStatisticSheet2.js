import { DataTable } from 'app/components/shared';
import React from 'react';

const columns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Họ tên',
    accessor: 'name',
  },
  {
    Header: 'Giới',
    accessor: 'gender',
  },
  {
    Header: 'Năm sinh',
    accessor: 'dob',
  },
  {
    Header: 'Quốc tịch',
    accessor: 'nation',
  },
  {
    Header: 'Số nhà đường',
    accessor: 'street',
  },
  {
    Header: 'Phường Xã',
    accessor: 'ward',
  },
  {
    Header: 'Quận Huyện',
    accessor: 'district',
  },
  {
    Header: 'Tỉnh Thành',
    accessor: 'province',
  },
  {
    Header: 'Điện thoại',
    accessor: 'phone',
  },
  {
    Header: 'Ngày ra',
    accessor: 'in',
  },
  {
    Header: 'Ngày vào',
    accessor: 'out',
  },
  {
    Header: 'Ghi chú',
    accessor: 'note',
  },
];

const data = [
  { index: 1 },
  { index: 2 },
  { index: 3 },
  { index: 4 },
  { index: 5 },
];

const QuarantineStatisticSheet2 = () => (
  <div>
    <DataTable celled columns={columns} data={data} />
  </div>
);

export default QuarantineStatisticSheet2;
