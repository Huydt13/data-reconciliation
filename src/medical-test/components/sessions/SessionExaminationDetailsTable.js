import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import { Label } from 'semantic-ui-react';

import { DataTable } from 'app/components/shared';
import { getImportantType } from 'infection-chain/utils/helpers';

const SessionExaminationDetailsTable = (props) => {
  const { data, onChange } = props;
  const columns = useMemo(
    () => [
      { Header: '#', accessor: 'index' },
      { Header: 'Mã xét nghiệm', formatter: (row) => row.code },

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
  const dataTable = useMemo(
    () => (data || []).map((r, i) => ({ ...r, index: i + 1 })),
    [data],
  );
  const defaultSelected = useMemo(() => (data || []).map((r) => r.id), [data]);
  return (
    <DataTable
      title="Danh sách mẫu trong phiên"
      // noPaging
      selectable
      columns={columns}
      data={dataTable}
      actions={[]}
      defaultSelected={defaultSelected}
      onSelectionChange={(row) => {
        onChange(row);
      }}
    />
  );
};

SessionExaminationDetailsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  onChange: PropTypes.func,
};

SessionExaminationDetailsTable.defaultProps = {
  data: [],
  onChange: () => {},
};

export default SessionExaminationDetailsTable;
