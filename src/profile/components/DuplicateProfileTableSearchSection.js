/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { FiArrowRight } from 'react-icons/fi';
import { Header } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import DuplicateProfileFilter from 'profile/components/DuplicateProfileFilter';

import { getDuplicateProfilesWithouDispatch } from 'profile/actions/profile';
import {
  formatToYear,
  renderGender,
  renderProfileKey,
} from 'app/utils/helpers';

const shrinkColumn = [
  { Header: 'Họ và tên', formatter: (r) => r.fullName, cutlength: 20 },
];
const expandColumns = [
  {
    Header: '#',
    accessor: 'index',
  },
  { Header: 'Họ và tên', formatter: (r) => r.fullName, cutlength: 50 },
  {
    Header: 'Năm sinh',
    formatter: ({ dateOfBirth }) => formatToYear(dateOfBirth),
  },
  {
    Header: 'Giới tính',
    formatter: renderGender,
  },
  {
    Header: 'Số điện thoại',
    formatter: ({ phoneNumber }) => phoneNumber,
  },
  {
    Header: 'Địa chỉ nhà',
    formatter: renderProfileKey,
  },
];
const normalColumns = [
  {
    Header: '#',
    accessor: 'index',
  },
  { Header: 'Họ và tên', formatter: (r) => r.fullName, cutlength: 50 },
  {
    Header: 'Năm sinh',
    formatter: ({ dateOfBirth }) => formatToYear(dateOfBirth),
  },
  {
    Header: 'Địa chỉ nhà',
    formatter: renderProfileKey,
    cutlength: 20,
  },
];

const DuplicateProfileTableSearchSection = ({
  isShrink,
  isNormal,
  isCloseFilter,
  selectingList,
  onChange,
}) => {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({});

  const rowActions = useMemo(
    () => [
      {
        icon: <FiArrowRight />,
        title: 'Chọn',
        color: 'green',
        onClick: onChange,
        hidden: (r) => selectingList.map((s) => s.id).includes(r.id),
      },
    ],
    [selectingList, onChange],
  );

  useEffect(() => {
    setFetching(true);
    getDuplicateProfilesWithouDispatch({
      ...filter,
      pageSize,
      pageIndex,
    }).then(({ data: dataRes, totalPages }) => {
      setData(dataRes);
      setPageCount(totalPages);
      setFetching(false);
    });
  }, [filter, pageSize, pageIndex]);

  return (
    <>
      <Header as="h3">Danh sách hồ sơ trùng trong hệ thống</Header>
      <DuplicateProfileFilter
        isCloseFilter={isCloseFilter}
        onChange={setFilter}
      />
      <DataTable
        noPaging={isShrink || isNormal}
        columns={
          isShrink ? shrinkColumn : isNormal ? normalColumns : expandColumns
        }
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={fetching}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={isShrink ? [] : rowActions}
      />
    </>
  );
};

DuplicateProfileTableSearchSection.propTypes = {
  selectingList: PropTypes.arrayOf(PropTypes.shape()),
  onChange: PropTypes.func.isRequired,
  isCloseFilter: PropTypes.bool,
  isShrink: PropTypes.bool,
  isNormal: PropTypes.bool,
};

DuplicateProfileTableSearchSection.defaultProps = {
  selectingList: [],
  isCloseFilter: true,
  isShrink: false,
  isNormal: false,
};

export default DuplicateProfileTableSearchSection;
