import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import xlsx from 'xlsx';

import { Message, Icon, Button } from 'semantic-ui-react';
import DataTable from 'app/components/shared/data-table/DataTable';

import importExcelTemplate from 'app/assets/excels/Mẫu import Mã xét nghiệm.xlsx';

const ImportSampleTable = (props) => {
  const { onChange } = props;

  const [selectedFile, setSelectedFile] = useState(undefined);
  const [sampleList, setSampleList] = useState([]);

  const fileInputRef = useRef();

  const columns = useMemo(() => ([
    { Header: '#', accessor: 'index' },
    {
      Header: 'Mã xét nghiệm',
      accessor: 'code',
      copiable: true,
    },

  ]), []);

  const downloadExcelTemplate = () => {
    const link = document.createElement('a');
    link.href = importExcelTemplate;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseExcelToData = useCallback((binary) => {
    try {
      const book = xlsx.read(binary, { type: 'binary' });
      const sheet = book.SheetNames[0];
      const sheetContent = book.Sheets[sheet];
      const samples = Object
        .keys(sheetContent)
        .filter((r) => /^A\d+/.test(r))
        .map((c) => sheetContent[c].v);

      if (!samples || samples.length === 0) {
        toast.warn('Tệp tin không có dữ liệu hoặc dữ liệu không chính xác');
        return;
      }

      setSampleList(samples);
      onChange(samples);
    } catch (e) {
      toast.warn('Tệp tin không đúng định dạng');
    }
  }, [onChange, setSampleList]);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      if (reader.readAsBinaryString) {
        reader.onload = () => parseExcelToData(reader.result);
        reader.readAsBinaryString(selectedFile);
      }
    }
  }, [selectedFile, parseExcelToData]);

  return (
    <>
      <Button
        icon="upload"
        labelPosition="right"
        color="green"
        content="Chọn File"
        onClick={() => fileInputRef.current.click()}
      />
      {sampleList.length > 0 && (
        <DataTable
          title="Danh sách mẫu"
          columns={columns}
          data={(sampleList || []).map((s, i) => ({ index: i + 1, code: s }))}
        />
      )}
      {(!selectedFile || sampleList.length === 0) && (
      <Message
        info
        icon
        style={{ marginBottom: 0, cursor: 'pointer' }}
        onClick={downloadExcelTemplate}
      >
        <Icon name="download" />
        <Message.Content>
          <Message.Header>Tải tệp tin mẫu</Message.Header>
          Sử dụng tệp tin mẫu, để đảm bảo dữ liệu chính xác
        </Message.Content>
      </Message>
      )}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={(e) => {
          setSampleList([]);
          setSelectedFile(e.target.files[0]);
        }}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </>
  );
};

ImportSampleTable.defaultProps = {
  onChange: () => {},
};

ImportSampleTable.propTypes = {
  onChange: PropTypes.func,
};

export default ImportSampleTable;
