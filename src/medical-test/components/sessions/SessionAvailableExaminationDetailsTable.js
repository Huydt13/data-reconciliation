import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';

import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getExaminationDetails } from 'medical-test/actions/medical-test';

import { DataTable } from 'app/components/shared';
import { getImportantType } from 'infection-chain/utils/helpers';

const SessionAvailableExaminationDetailsTable = (props) => {
  const { data, onChange } = props;
  const columns = useMemo(
    () => [
      { Header: '#', accessor: 'index' },
      {
        Header: 'Mã xét nghiệm',
        // eslint-disable-next-line react/prop-types
        formatter: ({ code }) => (code?.length === 12 ? <b>{code}</b> : code),
      },
      {
        Header: 'Người được xét nghiệm',
        formatter: (row) => row?.person?.name,
        cutlength: 50,
      },
      { Header: 'Mẫu bệnh phẩm', formatter: (row) => row?.diseaseSample?.name },
      {
        Header: 'Cơ sở lấy mẫu',
        formatter: (row) => row.unitTaken.name,
      },
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
    ],
    [],
  );
  const dispatch = useDispatch();
  const { examinationDetailData } = useSelector((state) => state.medicalTest);
  useEffect(() => {
    dispatch(getExaminationDetails({ importantValue: '' }));
  }, [dispatch]);
  const dataTable = useMemo(
    () =>
      (examinationDetailData || [])
        .filter((e) => !(data || []).map((d) => d.id).includes(e.id))
        .map((e, i) => ({ ...e, index: i + 1 })),
    [data, examinationDetailData],
  );
  return (
    <DataTable
      title="Danh sách mẫu có thể thêm vào phiên"
      // noPaging
      selectable
      columns={columns}
      data={dataTable}
      actions={[]}
      onSelectionChange={(row) => {
        onChange(row);
      }}
    />
  );
};

SessionAvailableExaminationDetailsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  onChange: PropTypes.func,
};

SessionAvailableExaminationDetailsTable.defaultProps = {
  data: [],
  onChange: () => {},
};

export default SessionAvailableExaminationDetailsTable;
