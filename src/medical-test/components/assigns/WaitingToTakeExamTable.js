/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { FiFileText } from 'react-icons/fi';

import { useSelector, useDispatch } from 'react-redux';
import { getAssignees } from 'medical-test/actions/medical-test';
import { useAuth } from 'app/hooks';

import { formatToYear } from 'app/utils/helpers';
import { getSourceType } from 'infection-chain/utils/helpers';

import { DataTable } from 'app/components/shared';
import WaitingToTakeExamFilter from './WaitingToTakeExamFilter';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Người được xét nghiệm',
    formatter: (row) =>
      `${row.person?.name ?? ''} ${
        row.instanceTime
          ? moment(row.instanceTime).format('DD-MM-YY HH:mm')
          : ''
      }`,
    cutlength: 50,
  },
  {
    Header: 'Năm sinh',
    formatter: ({ person }) => formatToYear(person?.dateOfBirth),
  },
  { Header: 'Cơ sở được chỉ định', formatter: ({ unit: { name } }) => name },
  {
    Header: 'Ngày chỉ định',
    formatter: ({ dateAssigned }) =>
      moment(dateAssigned).format('YYYY') !== '0001'
        ? moment(dateAssigned).format('DD-MM-YYYY')
        : '',
  },
  { Header: 'Nguồn', formatter: (row) => getSourceType(row.source)?.label },
];

const WaitingToTakeExamTable = () => {
  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { assigneeList, getAssigneesLoading } = useSelector(
    (state) => state.medicalTest,
  );

  const { isAdmin } = useAuth();

  const dispatch = useDispatch();

  const handleRefresh = () => {
    if (((!isAdmin && filter.unitId) || isAdmin) && !_.isEmpty(filter)) {
      dispatch(
        getAssignees({
          ...filter,
          isAvailable: false,
          isOther: undefined,
          isUnknown: undefined,
          status: 0,
          pageIndex,
          pageSize,
        }),
      );
    }
  };

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, [filter, pageIndex, pageSize]);

  const { data, pageCount } = assigneeList;

  return (
    <div>
      <WaitingToTakeExamFilter onChange={setFilter} />
      <DataTable
        title="Danh sách chờ lấy mẫu"
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={getAssigneesLoading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (row) => {
              window.open(
                `/profile/${
                  row.person?.profileId || row.person.id
                }/medical-test`,
                '_blank',
              );
            },
          },
        ]}
      />
    </div>
  );
};

export default WaitingToTakeExamTable;
