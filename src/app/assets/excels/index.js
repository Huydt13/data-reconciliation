import ImportAssignsTemplate from './Mẫu import Chỉ định lấy mẫu.xlsx';
import ImportExamsTemplate from './Mẫu import Phiên lấy mẫu.xlsx';

import ImportWaitingList from './Mẫu import DS chờ cách ly.xlsx';

export default [
  {
    name: 'Điều tra',
    folders: [
      // {
      //   name: 'C1',
      //   files: [
      //     { name: 'Test qq', file: ImportExamsTemplate },
      //     { name: 'Test zzz', file: ImportExamsTemplate },
      //   ],
      // },
      // {
      //   name: 'T07',
      //   files: [
      //     { name: 'Test sfndjkf', file: ImportAssignsTemplate },
      //     { name: 'Test', file: ImportExamsTemplate },
      //   ],
      // },
    ],
  },
  {
    name: 'Xét nghiệm',
    folders: [
      // {
      //   name: 'Mã',
      //   files: [
      //     { name: 'Mẫu import phiên lấy mẫu 1', file: ImportExamsTemplate },
      //     { name: 'Mẫu import phiên lấy mẫu 3', file: ImportExamsTemplate },
      //   ],
      // },
      {
        name: 'Phiên lấy mẫu',
        files: [
          {
            name: 'Mẫu import "Chỉ định lấy mẫu"',
            file: ImportAssignsTemplate,
            enable: true,
          },
          {
            name: 'Mẫu import "Phiên lấy mẫu"',
            file: ImportExamsTemplate,
            enable: true,
          },
        ],
      },
      // {
      //   name: 'Chuyển mẫu',
      //   files: [
      //     { name: 'Mẫu import phiên lấy mẫu 2', file: ImportAssignsTemplate },
      //     { name: 'Mẫu import phiên lấy mẫu 4', file: ImportAssignsTemplate },
      //   ],
      // },
      // {
      //   name: 'Phiên xét nghiệm',
      //   files: [
      //     { name: 'Mẫu import phiên lấy mẫu zz', file: ImportExamsTemplate },
      //     { name: 'Mẫu import phiên lấy mẫu nn', file: ImportExamsTemplate },
      //   ],
      // },
    ],
  },
  {
    name: 'Cách ly',
    folders: [
      {
        name: 'Chờ cách ly',
        files: [
          {
            name: 'Mẫu import "DS chờ cách ly"',
            file: ImportWaitingList,
            enable: true,
          },
        ],
      },
      // {
      //   name: 'Đang cách ly',
      //   files: [
      //     { name: 'Test s', file: ImportAssignsTemplate },
      //     { name: 'Test', file: ImportExamsTemplate },
      //   ],
      // },
      // {
      //   name: 'Đã cách ly',
      //   files: [
      //     { name: 'Test f', file: ImportAssignsTemplate },
      //     { name: 'Test', file: ImportExamsTemplate },
      //   ],
      // },
    ],
  },
];
