/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Label } from 'semantic-ui-react';
import moment from 'moment';
import { FiFileText } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import {
  getCompletedSubjects,
} from 'quarantine/actions/quarantine';

import { DataTable } from 'app/components/shared';
import { getSubjectType } from 'infection-chain/utils/helpers';

import CompletedSubjectFilter from './CompletedSubjectFilter';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Loại',
    formatter: (row) => {
      const { label, color } = getSubjectType(row.type);
      return <Label basic color={color} content={label} className="type-label" />;
    },
  },
  { Header: 'Tên', formatter: (r) => r.information.fullName },
  {
    Header: 'Ngày sinh',
    formatter: (row) => (row?.information?.dateOfBirth ? (!row?.information?.hasYearOfBirthOnly
      ? moment(row?.information?.dateOfBirth).format('DD-MM-YYYY')
      : moment(row?.information?.dateOfBirth).format('YYYY')) : 'Chưa xác định'),
  },
  { Header: 'Bí danh CDC', accessor: 'code' },
  { Header: 'Bí danh HCM', formatter: (r) => r.information.privateAlias },
  { Header: 'Bí danh BYT', formatter: (r) => r.information.alias },
];

const CompletedSubjectTable = () => {
  const [filter, setFilter] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(getCompletedSubjects({
      ...filter,
      pageIndex,
      pageSize,
    }));
  };

  useEffect(() => {
    handleRefresh();
  // eslint-disable-next-line
  }, [
    filter,
    pageSize,
    pageIndex,
  ]);

  const {
    getCompletedSubjectsLoading,
    completedSubjectData: { data, pageCount },
  } = useSelector((state) => state.quarantine);

  return (
    <div>
      <CompletedSubjectFilter onChange={setFilter} />
      <DataTable
        title="Đối tượng đã kết thúc cách ly"
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={getCompletedSubjectsLoading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageSize(p.pageSize);
          setPageIndex(p.pageIndex);
        }}
        actions={[
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (r) => window.open(`/profile/${r.profileId}`, '_blank'),
            disabled: (r) => !r.profileId,
          },
        ]}
      />
    </div>
  );
};

export default CompletedSubjectTable;
