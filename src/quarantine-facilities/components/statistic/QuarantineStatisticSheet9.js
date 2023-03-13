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
    Header: 'Giới tính',
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
    Header: 'Địa chỉ lưu trú',
    columns: [
      {
        Header: 'Số nhà-Đường',
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
    ],
  },
  {
    Header: 'Điện thoại',
    accessor: 'phone',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Thời gian KCL',
    columns: [
      {
        Header: 'Ngày vào',
        accessor: 'in',
      },
      {
        Header: 'Ngày ra',
        accessor: 'out',
      },
    ],
  },
  {
    Header:
      'Ghi chú (ghi rõ nhóm đối tượng vào KCL tập trung: chuyên gia hoặc F1 hoặc nhập cảnh trái phép hoặc khác)',
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

const QuarantineStatisticSheet9 = () => (
  <div>
    <DataTable celled columns={columns} data={data} />
  </div>
);

export default QuarantineStatisticSheet9;
