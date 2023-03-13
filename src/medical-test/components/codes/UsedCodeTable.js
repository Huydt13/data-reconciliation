/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { useAuth } from 'app/hooks';
import { getUsedCode } from 'medical-test/actions/medical-test';

import { DataTable } from 'app/components/shared';

import UsedCodeFilter from './UsedCodeFilter';

const UsedCodeTable = () => {
  const columns = [
    { Header: '#', accessor: 'index' },
    {
      Header: 'Mã xét nghiệm',
      formatter: ({ code }) => (code?.length === 12 ? <b>{code}</b> : code),
    },
    {
      Header: 'Ngày cấp',
      formatter: (row) =>
        row.publishedDate
          ? moment(row.publishedDate).format('DD-MM-YY HH:mm')
          : '',
    },
    {
      Header: 'Số lần in',
      accessor: 'printedCount',
    },
    {
      Header: 'Lần in cuối cùng',
      formatter: (row) =>
        row.lastPrintedDate
          ? moment(row.lastPrintedDate).format('DD-MM-YY HH:mm')
          : '',
    },
  ];
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    unitInfo,
    usedCodeData,
    getUsedCodesLoading,
    getDiseasesLoading,
    getPrefixesLoading,
  } = useSelector((state) => state.medicalTest);

  const loading =
    getUsedCodesLoading || getPrefixesLoading || getDiseasesLoading;

  const { isAdmin } = useAuth();

  const handleRefresh = useCallback(() => {
    dispatch(
      getUsedCode({
        ...filter,
        unitPrefix: isAdmin ? filter.unitPrefix : unitInfo?.code,
        pageSize,
        pageIndex,
      }),
    );
  }, [filter, pageIndex, pageSize, dispatch, isAdmin, unitInfo]);

  useEffect(handleRefresh, [handleRefresh]);

  const { data, pageCount } = usedCodeData;

  return (
    <div>
      <UsedCodeFilter onChange={setFilter} />
      <DataTable
        title="Mã đã sử dụng"
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={loading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[]}
      />
    </div>
  );
};

export default UsedCodeTable;
