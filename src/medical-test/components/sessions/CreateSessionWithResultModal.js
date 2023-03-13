/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { Button, Form, Message, Modal } from 'semantic-ui-react';

import { Controller, useForm } from 'react-hook-form';

import apiLinks from 'app/utils/api-links';

import { useDispatch, useSelector } from 'react-redux';
import { importExcel } from 'app/actions/global';
import { createAndUpdateResult } from 'medical-test/actions/session';

import { DataTable, InstantSearchBar } from 'app/components/shared';
import {
  deburr,
  formatToTime,
  renderExaminationResult,
} from 'app/utils/helpers';

const columns = [
  { Header: '#', accessor: 'idx' },
  { Header: 'Mã', accessor: 'code' },
  { Header: 'Kỹ thuật xét nghiệm', accessor: 'testTechnique' },
  {
    Header: 'Kết quả',
    formatter: ({ result }) => renderExaminationResult(result),
  },
  {
    Header: 'Ngày có kết quả',
    formatter: ({ resultDate }) => formatToTime(resultDate),
  },
  { Header: 'CT N', accessor: 'cT_N' },
  { Header: 'CT E', accessor: 'cT_E' },
  { Header: 'CT RdRp', accessor: 'cT_RdRp' },
  { Header: 'CT ORF1ab', accessor: 'orF1ab' },
  { Header: 'Index(0.5-150)', accessor: 'index' },
];
const CreateWithResultModal = ({ open, onClose, getData }) => {
  const dispatch = useDispatch();
  const importLoading = useSelector((s) => s.global.importLoading);
  const createLoading = useSelector(
    (s) => s.session.createAndUpdateResultLoading
  );

  const { control, errors, handleSubmit } = useForm();

  const [searchValue, setSearchValue] = useState('');
  const [importErrors, setImportErrors] = useState([]);
  const [data, setData] = useState([]);

  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(undefined);
  useEffect(() => {
    const uploadFile = async () => {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        fileInputRef.current.value = '';
        setSelectedFile(undefined);

        const result = await dispatch(
          importExcel({
            method: 'PUT',
            url: apiLinks.excel.readPlateResult,
            formData,
          })
        );
        setData(result.data);
        setImportErrors(result.errors);
      }
    };
    uploadFile();
  }, [dispatch, selectedFile]);

  const onSubmit = async (d) => {
    if (data.length === 0) {
      toast.warning('Chưa chọn mẫu!');
    } else if (data.filter((e) => e.testTechnique).length < data.length) {
      toast.warning('Chưa đủ kỹ thuật xét nghiệm!');
    } else if (data.filter((e) => e.result).length < data.length) {
      toast.warning('Chưa đủ kết quả!');
    } else if (data.filter((e) => e.resultDate).length < data.length) {
      toast.warning('Chưa đủ ngày có kết quả');
    } else {
      await dispatch(createAndUpdateResult({ ...d, details: data }));
      onClose();
      getData();
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo và cập nhật kết quả nhanh</Modal.Header>
      <Modal.Content scrolling>
        <Form loading={importLoading}>
          <Controller
            name='name'
            defaultValue=''
            control={control}
            rules={{ required: true }}
            render={({ onChange, onBlur, value }) => (
              <Form.Input
                fluid
                required
                label='Tên phiên xét nghiệm'
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={Boolean(errors.name)}
              />
            )}
          />
          <Form.Group widths='equal'>
            <Controller
              name='description'
              defaultValue=''
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.TextArea
                  label='Ghi chú'
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>

          <Button
            icon='upload'
            labelPosition='right'
            color='green'
            content='Chọn File'
            style={{ marginBottom: '20px' }}
            loading={importLoading}
            disabled={importLoading}
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current.click();
            }}
          />
        </Form>
        {importErrors.length > 0 && (
          <Message error header='Lỗi File:' list={importErrors} />
        )}
        {data.length > 0 && (
          <>
            <InstantSearchBar onChange={setSearchValue} />
            <DataTable
              columns={columns}
              data={data
                .filter((e) => deburr(e.code).includes(deburr(searchValue)))
                .map((r, i) => ({ ...r, idx: i + 1 }))}
            />
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition='right'
          icon='checkmark'
          content='Xác nhận'
          loading={createLoading}
          disabled={createLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
      <input
        ref={fileInputRef}
        type='file'
        hidden
        onChange={(e) => setSelectedFile(e.target.files[0])}
        accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
      />
    </Modal>
  );
};

CreateWithResultModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

export default CreateWithResultModal;
