import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Label } from 'semantic-ui-react';
import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import { getExaminationDetails } from 'medical-test/actions/medical-test';

import { DataTable } from 'app/components/shared';
import { getImportantType } from 'infection-chain/utils/helpers';
import ExaminationDetailsFilter from './ExaminationDetailsFilter';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Người được xét nghiệm',
    formatter: (row) => row?.person?.name,
    cutlength: 50,
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
];

const ExaminationDetailsTable = (props) => {
  const {
    selectable,
    initialData,
    onChange,
    onUpdate,
    isShowSentTransport,
    isShowTransport,
    importantValue,
  } = props;
  const [filter, setFilter] = useState({});

  const dispatch = useDispatch();
  const handleRefresh = () => {
    if (Number.isInteger(importantValue)) {
      dispatch(
        getExaminationDetails({
          ...filter,
          importantValue,
        }),
      );
    }
  };
  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, [filter, importantValue]);

  const { examinationDetailData } = useSelector((state) => state.medicalTest);
  const { data } = examinationDetailData;
  const [defaultSelected, setDefaultSelected] = useState([]);
  useEffect(() => {
    setDefaultSelected(
      initialData.map((e) => {
        if (e?.id) {
          return e.id;
        }
        return e.examinationDetail.id;
      }),
    );
  }, [initialData]);

  const dataOfTable = useMemo(() => {
    if (!selectable) {
      return initialData
        .map((e) => e.examinationDetail)
        .map((r, i) => ({ ...r, index: i + 1 }));
    }
    return (data || [])
      .sort(
        (a, b) => defaultSelected.indexOf(b.id) - defaultSelected.indexOf(a.id),
      )
      .map((r, i) => ({ ...r, index: i + 1 }));
    // eslint-disable-next-line
  }, [selectable, defaultSelected, data]);

  const sentTransport = (initialData || [])
    .map((e) => e.examinationDetail)
    .filter((e) => !(data || []).map((d) => d.id).includes(e.id));

  return (
    <>
      {isShowTransport && (
        <>
          <h4>Danh sách mẫu xét nghiệm</h4>
          {selectable && (
            <ExaminationDetailsFilter nonImportantValue onChange={setFilter} />
          )}
          <DataTable
            // noPaging
            selectable={selectable}
            columns={columns}
            data={dataOfTable}
            actions={[]}
            defaultSelected={defaultSelected}
            onSelectionChange={(row) => {
              if (defaultSelected.length === 0 && row.length !== 0) {
                onChange(row);
              } else {
                onUpdate(row);
              }
            }}
          />
        </>
      )}
      {sentTransport.length !== 0 && isShowSentTransport && (
        <>
          <h4>Danh sách mẫu đã được chuyển tại phiên khác</h4>
          <DataTable
            // noPaging
            columns={columns}
            data={(sentTransport || []).map((r, i) => ({ ...r, index: i + 1 }))}
            actions={[]}
          />
        </>
      )}
    </>
  );
};

ExaminationDetailsTable.propTypes = {
  selectable: PropTypes.bool,
  isShowTransport: PropTypes.bool,
  isShowSentTransport: PropTypes.bool,
  initialData: PropTypes.arrayOf(PropTypes.shape({})),
  importantValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onUpdate: PropTypes.func,
};

ExaminationDetailsTable.defaultProps = {
  selectable: false,
  isShowTransport: false,
  isShowSentTransport: false,
  initialData: [],
  importantValue: '',
  onChange: () => {},
  onUpdate: () => {},
};

export default ExaminationDetailsTable;
