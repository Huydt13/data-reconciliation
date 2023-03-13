import { DataTable } from 'app/components/shared';
import React from 'react';

const columns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Họ và tên',
    accessor: 'name',
  },
  {
    Header: 'Năm sinh',
    accessor: 'dob',
  },
  {
    Header: 'Giới tính',
    accessor: 'gender',
  },
  {
    Header: 'Quốc tịch',
    accessor: 'nation',
  },
  {
    Header: 'Số hộ chiếu',
    accessor: 'passport',
  },
  {
    Header: 'Phương tiện',
    accessor: 'b',
  },
  {
    Header: 'Số hiệu',
    accessor: 'c',
  },
  {
    Header: 'Số ghế',
    accessor: 'd',
  },
  {
    Header: 'Ngày khởi hành',
    accessor: 'e',
  },
  {
    Header: 'Ngày nhập cảnh',
    accessor: 'f',
  },
  {
    Header: 'Địa chỉ',
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
    Header: 'SDT',
    accessor: 'phone',
  },
  {
    Header: 'Ngày tiếp nhận cách ly',
    accessor: 'in',
  },
  {
    Header: 'Ngày dự kiến kết thúc',
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

const QuarantineStatisticSheet3 = () => (
  <div>
    <DataTable celled columns={columns} data={data} />
  </div>
);

export default QuarantineStatisticSheet3;
