import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Label } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { getAvailableExamForTransport } from 'medical-test/actions/transport';

import { checkFilter } from 'app/utils/helpers';
import { getImportantType } from 'infection-chain/utils/helpers';

import SelectTable from 'app/components/shared/data-table/SelectTable';
import ExaminationDetailsFilter from 'medical-test/components/transports/ExaminationDetailsFilter';

const AvailableExaminationTable = (props) => {
  const { importantValue, onChange } = props;
  const columns = useMemo(
    () => [
      { Header: '#', accessor: 'index' },
      {
        Header: 'Người được xét nghiệm',
        formatter: (row) => row?.person?.name,
        maxlength: 20,
      },
      {
        Header: 'Mã xét nghiệm',
        // eslint-disable-next-line react/prop-types
        formatter: ({ code }) => (code?.length === 12 ? <b>{code}</b> : code),
      },
      { Header: 'Mẫu bệnh phẩm', formatter: (row) => row?.diseaseSample?.name },
      {
        Header: 'Ngày lấy mẫu',
        formatter: (row) =>
          row.dateTaken ? moment(row.dateTaken).format('DD-MM-YY HH:mm') : '',
      },
      { Header: 'Kỹ thuật xét nghiệm', accessor: 'testTechnique' },
      {
        Header: 'Độ ưu tiên',
        formatter: ({ importantValue: iv }) => (
          <>
            <Label
              empty
              circular
              style={{ marginRight: '5px' }}
              key={getImportantType(iv)?.color}
              color={getImportantType(iv)?.color}
            />
            {getImportantType(iv)?.label}
          </>
        ),
      },
    ],
    [],
  );
  const dispatch = useDispatch();

  const {
    availableExamForTransportList: { data, pageCount },
    getAvailableExamForTransportLoading,
  } = useSelector((state) => state.transport);

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [filter, setFilter] = useState({});

  const getData = useCallback(() => {
    dispatch(
      getAvailableExamForTransport({
        ...filter,
        importantValue,
        pageIndex,
        pageSize,
      }),
    );
  }, [dispatch, filter, pageSize, pageIndex, importantValue]);
  useEffect(getData, [getData]);

  return (
    <>
      <ExaminationDetailsFilter
        nonImportantValue
        onChange={(d) => checkFilter(filter, d) && setFilter(d)}
      />
      <SelectTable
        title="Danh sách mẫu trong hệ thống"
        selectable
        columns={columns}
        data={data.map((d, i) => ({ ...d, index: i + 1 }))}
        loading={getAvailableExamForTransportLoading}
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

AvailableExaminationTable.propTypes = {
  importantValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};

AvailableExaminationTable.defaultProps = {
  importantValue: '',
  onChange: () => {},
};

export default AvailableExaminationTable;
