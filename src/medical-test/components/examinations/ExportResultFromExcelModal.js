import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Checkbox, Form, Header, Modal } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { exportResultFromExcel } from 'medical-test/actions/medical-test';

import { useAuth } from 'app/hooks';

import FeeTypeSelect from './FeeTypeSelect';

const ExportResultFromExcelModal = (props) => {
  const { open, onClose } = props;
  const { isMasterXng } = useAuth();
  const { watch, setValue, register, getValues } = useForm();
  const {
    unitInfo,
    getPrefixesLoading,
    prefixList,
    exportResultFromExcelLoading,
  } = useSelector((s) => s.medicalTest);
  useEffect(() => {
    register('feeType');
    register('hasResultOnly');
    setValue('hasResultOnly', false);
    register('unitId');
    if (!isMasterXng && unitInfo) {
      setValue('unitId', unitInfo.id);
    }
  }, [register, setValue, isMasterXng, unitInfo]);

  const fileRef = useRef();
  const [selectedFile, setSelectedFile] = useState(undefined);

  const dispatch = useDispatch();
  const handleSubmit = async () => {
    const { unitId, feeType, hasResultOnly } = getValues();
    const formData = new FormData();
    formData.append('file', selectedFile);
    await dispatch(
      exportResultFromExcel({ formData, hasResultOnly, feeType, unitId }),
    );
    fileRef.current.value = '';
    setSelectedFile(undefined);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Xuất kết quả theo mã từ Excel</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <FeeTypeSelect
              clearable
              value={watch('feeType')}
              onChange={(v) => setValue('feeType', v)}
            />
            <Form.Field
              control={Checkbox}
              style={{ paddingTop: '35px' }}
              label="Chỉ xuất mẫu có kết quả"
              onChange={(e, { checked }) => setValue('hasResultOnly', checked)}
            />
          </Form.Group>
          {isMasterXng && (
            <Form.Group widths="equal">
              <Form.Select
                search
                deburr
                label="Cơ sở"
                loading={getPrefixesLoading}
                options={prefixList.map((z) => ({
                  key: z.id,
                  text: z.name,
                  value: z.id,
                }))}
                onChange={(e, { value }) => {
                  setValue('unitId', value);
                }}
              />
            </Form.Group>
          )}
          <Form.Group>
            <Form.Button
              required
              label="File danh sách mã"
              icon="upload"
              labelPosition="right"
              color="green"
              content="Chọn File"
              onClick={(e) => {
                e.preventDefault();
                if (fileRef?.current) {
                  fileRef.current.click();
                }
              }}
            />
            <Header as="h5">{selectedFile?.name}</Header>
          </Form.Group>
          <input
            hidden
            required
            type="file"
            ref={fileRef}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={(e) => {
              if (e.target !== null && e.target.files !== null) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          content="Xác nhận"
          loading={exportResultFromExcelLoading}
          disabled={exportResultFromExcelLoading || !selectedFile}
          onClick={handleSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
};

ExportResultFromExcelModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExportResultFromExcelModal;
