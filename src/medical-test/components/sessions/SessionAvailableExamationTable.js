/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';

import _ from 'lodash';
import moment from 'moment';

import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from 'app/hooks';
import {
  getDiseases,
  getDiseaseSamples,
  getExaminationTypes,
  getPrefixes,
  getUnitTypes,
  getUnitInfo,
  getExaminationDetailsAvailableForTestSession,
} from 'medical-test/actions/medical-test';

import { DataTable } from 'app/components/shared';
import { getImportantType } from 'infection-chain/utils/helpers';

import { FiCheck, FiPlus } from 'react-icons/fi';
import SessionAvailableExaminationFilter from './SessionAvailableExaminationFilter';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Mã',
    formatter: ({ code }) => (code?.length === 12 ? <b>{code}</b> : code),
  },
  {
    Header: 'Người xét nghiệm',
    formatter: (row) => row?.person?.name,
  },
  {
    Header: 'Mẫu',
    formatter: (row) => row?.diseaseSample?.name,
    // cutlength: 10,
  },
  {
    Header: 'Nơi lấy',
    formatter: (row) => row.unitTaken?.name,
    // cutlength: 10,
  },
  {
    Header: 'Ngày lấy',
    formatter: (row) =>
      row.dateTaken ? moment(row.dateTaken).format('DD-MM-YY HH:mm') : '',
    // cutlength: 8,
  },
  {
    Header: 'Ưu tiên',
    // eslint-disable-next-line react/prop-types
    formatter: ({ importantValue }) => (
      <>
        <Label
          empty
          circular
          style={{ marginRight: '5px' }}
          key={getImportantType(importantValue)?.color}
          color={getImportantType(importantValue)?.color}
        />
        {getImportantType(importantValue)?.label}
      </>
    ),
  },
  {
    Header: 'Mẫu gộp',
    // eslint-disable-next-line react/prop-types
    formatter: ({ isGroup }) => (isGroup ? <FiCheck /> : null),
  },
];
const SessionAvailableExamationTable = (props) => {
  const { selecting, onSubmit } = props;

  const dispatch = useDispatch();

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [filter, setFilter] = useState({});

  const {
    unitInfo,
    prefixList,
    diseaseList,
    unitTypeList,
    diseaseSampleList,
    examinationTypeList,
    examinationDetailsAvailableForTestSessionList: { data, pageCount },
    getExaminationDetailsAvailableForTestSessionLoading,
    updateExaminationLoading,
    updateExamDetailLoading,
    deleteExaminationLoading,
    getUnitInfoLoading,
    getUnitTypesLoading,
    exportExamLoading,
  } = useSelector((state) => state.medicalTest);

  const { isAdmin } = useAuth();
  const { isTester, isCollector, isReceiver } = unitInfo;
  const isJoiningExam = isTester && isCollector && isReceiver;

  useEffect(() => {
    if (prefixList.length === 0 && (isAdmin || isJoiningExam)) {
      dispatch(getPrefixes());
    }
    if (diseaseList.length === 0) {
      dispatch(getDiseases());
    }
    if (!unitInfo) {
      dispatch(getUnitInfo());
    }
    if (unitTypeList.length === 0) {
      dispatch(getUnitTypes());
    }
    if (diseaseSampleList.length === 0) {
      dispatch(getDiseaseSamples());
    }
    if (examinationTypeList.length === 0) {
      dispatch(getExaminationTypes());
    }
    // eslint-disable-next-line
  }, [dispatch]);

  const loading =
    getExaminationDetailsAvailableForTestSessionLoading ||
    updateExaminationLoading ||
    deleteExaminationLoading ||
    updateExamDetailLoading ||
    getUnitInfoLoading ||
    getUnitTypesLoading ||
    exportExamLoading;

  const handleRefresh = useCallback(() => {
    if (
      ((!(isAdmin || isJoiningExam) && filter.unitId) ||
        isAdmin ||
        isJoiningExam) &&
      !_.isEmpty(filter)
    ) {
      dispatch(
        getExaminationDetailsAvailableForTestSession({
          ...filter,
          pageSize,
          pageIndex,
        }),
      );
    }
  }, [dispatch, isAdmin, isJoiningExam, filter, pageSize, pageIndex]);
  useEffect(handleRefresh, [handleRefresh]);

  return (
    <div>
      <SessionAvailableExaminationFilter onChange={setFilter} />
      <DataTable
        title="Danh sách mẫu có thể thêm"
        selectable
        columns={columns}
        data={_.orderBy(
          (data || []).map((r, i) => ({ ...r, index: i + 1 })),
          ({ code }) => selecting.includes(code),
          'asc',
        )}
        loading={loading}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageSize(ps);
          setPageIndex(pi);
        }}
        pageCount={pageCount}
        actions={[
          {
            icon: <FiPlus />,
            title: 'Thêm mẫu đã chọn vào khay',
            color: 'green',
            onClick: (rows) => {
              if (selecting.length + rows.length > 94) {
                toast.warn('Vượt quá số mẫu cho phép');
              } else {
                onSubmit(
                  rows
                    .filter(({ code }) => !selecting.includes(code))
                    .map((r) => r.code),
                );
              }
            },
            globalAction: true,
          },
          {
            icon: <FiPlus />,
            title: 'Thêm',
            color: 'green',
            onClick: (row) => {
              if (selecting.length === 94) {
                toast.warn('Vượt quá số mẫu cho phép');
              } else {
                onSubmit([row.code]);
              }
            },
            hidden: ({ code }) => selecting.includes(code),
          },
        ]}
      />
    </div>
  );
};

SessionAvailableExamationTable.propTypes = {
  selecting: PropTypes.arrayOf(PropTypes.string),
  onSubmit: PropTypes.func.isRequired,
};

SessionAvailableExamationTable.defaultProps = {
  selecting: [],
};

export default SessionAvailableExamationTable;
