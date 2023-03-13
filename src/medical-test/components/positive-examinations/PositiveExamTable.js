/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { FiFileText } from 'react-icons/fi';
import { Header, Label } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import PositiveExaminationFilter from 'medical-test/components/positive-examinations/PositiveExamFilter';

import { useSelector, useDispatch } from 'react-redux';
import { getPositiveExaminationDetail } from 'medical-test/actions/medical-test';

import {
  deburr,
  formatToTime,
  renderExaminationResult,
  formatAddressToString,
} from 'app/utils/helpers';
import { getImportantType } from 'infection-chain/utils/helpers';

const Wrapper = styled.div`
  & .table {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-bottom: 0 !important;
  }
`;

const columns = [
  { Header: '#', accessor: 'idx' },
  {
    Header: 'Mã',
    formatter: ({ importantValue, code }) => (
      <Label size='small' basic color={getImportantType(importantValue)?.color}>
        {code}
      </Label>
    ),
  },
  {
    Header: 'Họ và tên',
    formatter: ({ person }) => person?.name,
    cutlength: 20,
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
    cutlength: 20,
  },
  {
    Header: 'Thông tin lấy mẫu',
    formatter: ({ unitTaken, dateTaken }) => (
      <div>
        <Header sub>{unitTaken?.name ?? ''}</Header>
        <span>{formatToTime(dateTaken)}</span>
      </div>
    ),
  },
  {
    Header: 'Thông tin xét nghiệm',
    formatter: ({ unitName, resultDate }) => (
      <div>
        <Header sub>{unitName}</Header>
        <span>{formatToTime(resultDate)}</span>
      </div>
    ),
  },
  {
    Header: 'Kết quả',
    formatter: ({
      result,
      resultDate,
      cT_E: e,
      cT_N: n,
      cT_RdRp: r,
      orF1ab: o,
      index: i,
    }) =>
      result ? (
        <div>
          <Header sub>{renderExaminationResult(result)}</Header>
          <span>{formatToTime(resultDate)}</span>
          <br />
          {deburr(result) === deburr('Dương tính') && (
            <span>
              {`CT N: ${n ?? ''} | CT E: ${e ?? ''} | CT RdRp: ${
                r ?? ''
              } | CT ORF1ab: ${o ?? ''} | Index(0.5-150):${i ?? ''}`}
            </span>
          )}
        </div>
      ) : (
        ''
      ),
  },
];

const PositiveExaminationTable = (props) => {
  const { isGetAll } = props;

  const [initial, setInitial] = useState(true);
  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();
  const {
    positiveExaminationDetailData,
    getUnitsLoading,
    getExaminationTypeLoading,
    getPositiveExaminationDetailLoading,
  } = useSelector((state) => state.medicalTest);

  const loading =
    getUnitsLoading ||
    getExaminationTypeLoading ||
    getPositiveExaminationDetailLoading;

  const { data, pageCount } = positiveExaminationDetailData;

  const from = moment().format('YYYY-MM-DDT00:00:00+07:00');
  const to = moment().format('YYYY-MM-DDT23:59:59+07:00');

  const handleRefresh = useCallback(() => {
    const payload = filter;
    if (initial) {
      payload.dateType = 0;
      payload.hasNoResult = false;
      payload.result = 'DƯƠNG TÍNH';
      setInitial(false);
    }

    dispatch(
      getPositiveExaminationDetail({
        ...payload,
        from: isGetAll ? filter.from : from,
        to: isGetAll ? filter.to : to,
        pageIndex,
        pageSize,
      })
    );
  }, [dispatch, isGetAll, initial, filter, from, to, pageIndex, pageSize]);
  useEffect(handleRefresh, [handleRefresh]);

  return (
    <Wrapper>
      <PositiveExaminationFilter
        hideDateFilter={!isGetAll}
        onChange={setFilter}
      />
      <DataTable
        title='Danh sách xét nghiệm PCR'
        loading={loading}
        columns={columns}
        data={(data || []).map((r, i) => ({
          ...r,
          idx: i + 1,
        }))}
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
              window.open(`/profile/${row?.profileId}`, '_blank');
            },
          },
        ]}
      />
    </Wrapper>
  );
};

export default PositiveExaminationTable;
