import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Button, Label } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { uploadTransportExcel } from 'medical-test/actions/transport';

import { getImportantType } from 'infection-chain/utils/helpers';

import { DataTable, InstantSearchBar } from 'app/components/shared';
import { deburr } from 'app/utils/helpers';

const ImportExaminationTable = (props) => {
  const { importantValue, onChange } = props;
  const columns = useMemo(
    () => [
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

  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(undefined);
  useEffect(() => {
    const uploadFile = async () => {
      if (selectedFile && Number.isInteger(importantValue)) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        await dispatch(uploadTransportExcel(formData, importantValue));
        fileInputRef.current.value = '';
        setSelectedFile(undefined);
      }
    };
    uploadFile();
    // eslint-disable-next-line
  }, [dispatch, selectedFile, importantValue]);
  const { importTransportExcelData, uploadProgressLoading } = useSelector(
    (state) => state.transport,
  );

  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(importTransportExcelData);
    setSearchValue('');
  }, [importTransportExcelData]);

  return (
    <>
      <Button
        icon="upload"
        labelPosition="right"
        color="green"
        content="Chọn File"
        style={{ marginBottom: '20px' }}
        loading={uploadProgressLoading}
        disabled={uploadProgressLoading}
        onClick={() => fileInputRef.current.click()}
      />
      {data.length !== 0 && (
        <>
          <InstantSearchBar onChange={setSearchValue} />
          <DataTable
            title="Danh sách mẫu trong file"
            selectable
            columns={columns}
            data={data
              .filter((d) =>
                deburr(d?.person?.name + d.code).includes(deburr(searchValue)),
              )
              .map((d, i) => ({ ...d, index: i + 1 }))}
            onSelectionChange={onChange}
          />
        </>
      )}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={(e) => setSelectedFile(e.target.files[0])}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </>
  );
};

ImportExaminationTable.propTypes = {
  importantValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};

ImportExaminationTable.defaultProps = {
  importantValue: '',
  onChange: () => {},
};

export default ImportExaminationTable;
