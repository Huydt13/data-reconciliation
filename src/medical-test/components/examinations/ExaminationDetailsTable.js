/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { Header, Label } from 'semantic-ui-react';
import SelectTable from 'app/components/shared/data-table/SelectTable';
import ExaminationDetailsFilter from 'medical-test/components/transports/ExaminationDetailsFilter';

import { useDispatch, useSelector } from 'react-redux';
import { getExaminationDetail } from 'medical-test/actions/medical-test';

import {
  checkFilter,
  formatToTime,
} from 'app/utils/helpers';
import { getImportantType } from 'infection-chain/utils/helpers';
import {
  SAMPLE_FILTER_TYPE,
  SAMPLE_SUB_FILTER,
} from 'medical-test/utils/constants';

const ExaminationDetailsTable = (props) => {
  const {
    noResult,
    hasSatisfactorySample,
    isTakenUnit,
    isReceivedUnit,
    onChange,
  } = props;

  const columns = useMemo(
    () => [
      { Header: '#', accessor: 'index' },
      {
        Header: 'Mã',
        accessor: 'code',
        copiable: true,
        formatter: ({ importantValue, code }) => (
          <Label size="small" basic color={getImportantType(importantValue)?.color}>
            {code.length < 10
              ? code
              : code.substring(3, 6).concat(code.substring(8))}
          </Label>
        ),
      },
      {
        Header: 'Họ và tên',
        formatter: (row) => row?.person?.name,
        maxlength: (noResult || hasSatisfactorySample) ? 30 : 50,
      },
      {
        Header: 'Thông tin lấy mẫu',
        formatter: ({ unitTaken, dateTaken }) => (
          <div>
            <Header sub>{unitTaken?.name}</Header>
            <span>{formatToTime(dateTaken)}</span>
          </div>
        ),
      },
      {
        Header: 'Mẫu',
        formatter: ({ diseaseSample, feeType, isGroup }) => (
          <div>
            <Header sub>{diseaseSample?.name}</Header>
            <span>
              {feeType === 0 ? 'Không thu phí | ' : 'Thu phí | '}
              {isGroup ? 'Mẫu gộp' : 'Mẫu đơn'}
            </span>
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
    ],
    [noResult, hasSatisfactorySample],
  );
  const dispatch = useDispatch();

  const {
    examinationDetailTempData: { data, pageCount },
    getExaminationDetailLoading,
  } = useSelector((state) => state.medicalTest);

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [filter, setFilter] = useState({});

  const getData = useCallback(() => {
    dispatch(getExaminationDetail({
      ...filter,
      pageIndex,
      pageSize,
      apiV2: isTakenUnit || isReceivedUnit,
      sampleFilterType:
        isReceivedUnit
          ? SAMPLE_FILTER_TYPE.RECEIVED
          : isTakenUnit
            ? SAMPLE_FILTER_TYPE.TAKEN
            : 0,
      sampleSubFilter:
        noResult
          ? SAMPLE_SUB_FILTER.WAITING
          : hasSatisfactorySample
            ? SAMPLE_SUB_FILTER.UNQUALIFY
            : 0,
    }));
  }, [
    dispatch,
    filter,
    pageSize,
    pageIndex,
    noResult,
    hasSatisfactorySample,
    isTakenUnit,
    isReceivedUnit,
  ]);
  useEffect(getData, [getData]);

  return (
    <>
      <ExaminationDetailsFilter
        nonImportantValue
        isTakenUnit={isTakenUnit}
        isReceivedUnit={isReceivedUnit}
        onChange={(d) => checkFilter(filter, d) && setFilter(d)}
      />
      <SelectTable
        title="Danh sách mẫu trong hệ thống"
        selectable
        columns={columns}
        data={data.map((d, i) => ({ ...d, index: i + 1 }))}
        loading={getExaminationDetailLoading}
        pageCount={pageCount}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageSize(ps);
          setPageIndex(pi);
        }}
        onSelectionChange={onChange}
      />
    </>
  );
};

ExaminationDetailsTable.propTypes = {
  noResult: PropTypes.bool,
  hasSatisfactorySample: PropTypes.bool,
  isTakenUnit: PropTypes.bool,
  isReceivedUnit: PropTypes.bool,
  onChange: PropTypes.func,
};

ExaminationDetailsTable.defaultProps = {
  noResult: false,
  hasSatisfactorySample: false,
  isTakenUnit: false,
  isReceivedUnit: false,
  onChange: () => {},
};

export default ExaminationDetailsTable;
