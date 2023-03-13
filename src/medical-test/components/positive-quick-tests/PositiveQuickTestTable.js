/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { FiFileText } from 'react-icons/fi';
import { Header } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import PositiveQuickTestFilter from 'medical-test/components/positive-quick-tests/PositiveQuickTestFilter';

import { useSelector, useDispatch } from 'react-redux';
import { getPositiveQuickTests } from 'medical-test/actions/medical-test';

import {
  formatToYear,
  formatToDate,
  renderExaminationResult,
  formatAddressToString,
} from 'app/utils/helpers';

const Wrapper = styled.div`
  & .table {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-bottom: 0 !important;
  }
`;

const immunizationStatusOptions = [
  { key: 0, value: 0, text: 'Chưa tiêm' },
  { key: 1, value: 1, text: 'Tiêm 1 mũi' },
  { key: 2, value: 2, text: 'Tiêm 2 mũi' },
  { key: 3, value: 3, text: 'Chưa rõ' },
  { key: 4, value: 4, text: 'Tiêm trên 2 mũi' },
];

const columns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Mã',
    accessor: 'code',
  },
  {
    Header: 'Họ và tên',
    formatter: ({ person }) => person?.name.toUpperCase(),
    cutlength: 25,
  },
  {
    Header: 'Năm sinh',
    formatter: ({ person }) => formatToYear(person?.dateOfBirth),
  },
  {
    Header: 'Số điện thoại',
    formatter: ({ person }) => person?.phone,
  },
  {
    Header: 'Địa chỉ',
    formatter: ({ person }) =>
      formatAddressToString({
        ...person,
        streetHouseNumber: person?.houseNumber ?? '',
      }),
    cutlength: 30,
  },
  {
    Header: 'Tiền sử tiêm vắc xin',
    formatter: ({ vaccinationStatus, lastInjectionDate }) => (
      <div>
        {typeof vaccinationStatus !== 'undefined' ? (
          <Header sub>
            {immunizationStatusOptions.find((o) => o.value === vaccinationStatus)?.text ?? ''}
          </Header>
        ) : null}
        {typeof lastInjectionDate !== 'undefined' && vaccinationStatus !== 0 && vaccinationStatus !== 3 ? (
          <span>{moment(lastInjectionDate).format('DD-MM-YYYY')}</span>
        ) : null}
      </div>
    ),
  },
  {
    Header: 'Thông tin lấy mẫu',
    formatter: ({ unit: { name }, date }) => (
      <div>
        <Header sub>{name}</Header>
        <span>{formatToDate(date)}</span>
      </div>
    ),
  },
  {
    Header: 'Triệu chứng',
    formatter: ({ hasSymptom }) => hasSymptom ? 'Có' : 'Không',
  },
  {
    Header: 'Kết quả',
    formatter: ({ result }) =>
      result ? (
        <div>
          <Header sub>{renderExaminationResult(result)}</Header>
        </div>
      ) : (
        ''
      ),
  },
];

const PositiveQuickTestTable = (props) => {
  const { isGetAll } = props;

  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();
  const {
    positiveQuickTestData: { pageCount, data, count },
    getPositiveQuickTestLoading,
  } = useSelector((state) => state.medicalTest);

  const from = moment().format('YYYY-MM-DDT00:00:00+07:00');
  const to = moment().format('YYYY-MM-DDT23:59:59+07:00');
  const loading = getPositiveQuickTestLoading;

  const handleRefresh = useCallback(() => {
    dispatch(
      getPositiveQuickTests({
        ...filter,
        from: isGetAll ? filter.from : from,
        to: isGetAll ? filter.to : to,
        pageIndex,
        pageSize,
      }),
    );
  }, [
    dispatch,
    isGetAll,
    from,
    to,
    filter,
    pageIndex,
    pageSize,
  ]);
  useEffect(handleRefresh, [handleRefresh]);

  return (
    <Wrapper>
      <PositiveQuickTestFilter hideDateFilter={!isGetAll} onChange={setFilter} />
      <DataTable
        title="Danh sách xét nghiệm nhanh"
        loading={loading}
        columns={columns}
        data={(data || []).map((r, i) => ({
          ...r,
          index: i + 1,
        }))}
        pageCount={pageCount}
        totalCount={count}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: ({ person }) => {
              window.open(`/profile/${person?.profileId}`, '_blank');
            },
          },
        ]}
      />
    </Wrapper>
  );
};

export default PositiveQuickTestTable;
