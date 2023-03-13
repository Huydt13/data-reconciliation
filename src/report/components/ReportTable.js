import React, { useEffect, useState } from 'react';
import { DataTable } from 'app/components/shared';
import { FiDownload } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { getSummaryReports } from 'infection-chain/actions/subject';
import apiLinks from 'app/utils/api-links';

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Ca F0', accessor: 'name' },
  { Header: 'Số ca khai báo tiếp xúc gần', accessor: 'closeContacts' },
  { Header: 'Số ca khai báo tiếp xúc xa', accessor: 'farContacts' },
  { Header: 'Số ca khai báo chưa xác định', accessor: 'undefinedContacts' },
  { Header: 'Số đã xác minh', accessor: 'verified' },
  { Header: 'Số chờ xác minh', accessor: 'waitingVerified' },
  { Header: 'Số đã lấy mẫu XN', accessor: 'examined' },
  { Header: 'Âm tính', accessor: 'negativeExaminations' },
  { Header: 'Dương tính', accessor: 'positiveExaminations' },
  { Header: 'Chờ', accessor: 'waitingResultExaminations' },
  { Header: 'Cách ly tập trung', accessor: 'treatmentAndNormalQuarantine' },
  { Header: 'Cách ly tại nhà', accessor: 'homeQuarantine' },
];

const ReportTable = () => {
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { reportList, getReportsLoading } = useSelector(
    (state) => state.subject,
  );
  const { data, pageCount } = reportList;

  const handleRefresh = () => {
    dispatch(
      getSummaryReports({
        pageIndex,
        pageSize,
      }),
    );
  };

  // eslint-disable-next-line
  useEffect(() => {
    handleRefresh();
  }, [pageIndex, pageSize]);

  return (
    <DataTable
      title="Báo cáo tổng"
      columns={columns}
      data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
      loading={getReportsLoading}
      pageCount={pageCount}
      onPaginationChange={(p) => {
        setPageIndex(p.pageIndex);
        setPageSize(p.pageSize);
      }}
      actions={[
        {
          icon: <FiDownload />,
          title: 'Xuất file Excel',
          color: 'green',
          onClick: () => {
            window.open(`${apiLinks.exportExcel}`, '_blank');
          },
          globalAction: true,
        },
      ]}
    />
  );
};

export default ReportTable;
