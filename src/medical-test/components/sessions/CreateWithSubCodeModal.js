/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Input, Modal, Table } from 'semantic-ui-react';

import { Controller, useForm } from 'react-hook-form';

import apiLinks from 'app/utils/api-links';
import { useDispatch, useSelector } from 'react-redux';
import { getExaminationDetailsAvailableForTestSession } from 'medical-test/actions/medical-test';
import { createSession } from 'medical-test/actions/session';
import { toast } from 'react-toastify';
import { importExcel } from 'app/actions/global';

const CreateWithSubCodeModal = ({ open, onClose, getData }) => {
  const dispatch = useDispatch();
  const getExamsLoading = useSelector(
    (s) => s.medicalTest.getExaminationDetailsAvailableForTestSessionLoading,
  );
  const importLoading = useSelector((s) => s.global.importLoading);
  const createLoading = useSelector((s) => s.session.createSessionLoading);
  const unitInfo = useSelector((s) => s.medicalTest.unitInfo);

  const { control, errors, handleSubmit } = useForm();

  const [numberOfExams, setNumberOfExams] = useState(0);
  const [data, setData] = useState([]);

  const generateTable = async () => {
    const result = await dispatch(
      getExaminationDetailsAvailableForTestSession({}),
    );
    if (result.length === 0) {
      toast.warn('Không còn mẫu khả dụng');
    } else {
      if (result.length < numberOfExams) {
        toast.warn(`Chỉ còn lại ${result.length} mẫu!`);
      }
      const slicedResult = result.slice(
        0,
        result.length < numberOfExams ? result.length : numberOfExams,
      );
      setData(slicedResult);
    }
  };

  const inputRefs = useRef([]);

  const [selectingType, setSelectingType] = useState(0);
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(undefined);
  useEffect(() => {
    const uploadFile = async () => {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const result = await dispatch(
          importExcel({
            method: 'PUT',
            url: apiLinks.excel.importSecodaryCodeMapping,
            formData,
            isExamination: true,
          }),
        );

        if (result.data.length === 0 && result.failLogs.length === 0) {
          toast.warn('Không tìm thấy mẫu phù hợp, vui lòng chọn file khác');
        } else {
          setData(result.data);
        }

        fileInputRef.current.value = '';
        setSelectedFile(undefined);
      }
    };
    uploadFile();
  }, [dispatch, selectedFile]);

  const onSubmit = async (d) => {
    if (data.length === 0) {
      toast.warning('Chưa chọn mẫu!');
    } else if (data.filter((e) => e.secondaryCode).length < data.length) {
      toast.warning('Thiếu mã thứ cấp!');
    } else {
      await dispatch(
        createSession({
          ...d,
          unitId: unitInfo.id,
          testSessionType: 1,
          examinationDetails: data.map((e) => ({
            ...e,
            person: undefined,
            disease: undefined,
            diseaseSample: undefined,
            unitTaken: undefined,
            examinationType: undefined,
          })),
        }),
      );
      onClose();
      getData();
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo phiên xét nghiệm từ mã thứ cấp</Modal.Header>
      <Modal.Content>
        <Form loading={getExamsLoading || importLoading}>
          <Controller
            name="name"
            defaultValue=""
            control={control}
            rules={{ required: true }}
            render={({ onChange, onBlur, value }) => (
              <Form.Input
                fluid
                required
                label="Tên phiên xét nghiệm"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={Boolean(errors.name)}
              />
            )}
          />
          <Form.Group widths="equal">
            <Controller
              name="description"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.TextArea
                  label="Ghi chú"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>

          <>
            <Form.Field>
              Chọn mẫu từ:{' '}
              <b>
                {selectingType
                  ? selectingType === 1
                    ? 'Hệ thống'
                    : 'File Excel'
                  : ''}
              </b>
            </Form.Field>
            <Form.Checkbox
              radio
              value={1}
              name="checkboxRadioGroup"
              label="Hệ thống"
              checked={selectingType === 1}
              onChange={(_, { value }) => {
                setSelectingType(value);
              }}
            />
            <Form.Checkbox
              radio
              value={2}
              name="checkboxRadioGroup"
              label="File Excel"
              checked={selectingType === 2}
              onChange={(_, { value }) => {
                setSelectingType(value);
              }}
            />
          </>

          {selectingType === 1 && data.length === 0 && (
            <Form.Group widths="equal">
              <Form.Input
                inline
                type="number"
                label="Số lượng mẫu trong plate"
                onChange={(__, { value }) => setNumberOfExams(value)}
                action={{
                  color: 'green',
                  icon: 'plus',
                  onClick: (e) => {
                    e.preventDefault();
                    generateTable();
                  },
                }}
              />
            </Form.Group>
          )}

          {selectingType === 2 && (
            <Button
              icon="upload"
              labelPosition="right"
              color="green"
              content="Chọn File"
              style={{ marginBottom: '20px' }}
              loading={importLoading}
              disabled={importLoading}
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current.click();
              }}
            />
          )}

          {data.length > 0 && (
            <>
              {selectingType === 1 && (
                <Button
                  basic
                  size="small"
                  color="blue"
                  floated="right"
                  style={{ marginBottom: '8px' }}
                  content="Sao chép tất cả"
                  onClick={(e) => {
                    e.preventDefault();
                    setData((d) =>
                      d.map((r) => ({ ...r, secondaryCode: r.code })),
                    );
                  }}
                />
              )}
              <Table fixed celled size="small">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>Mã sơ cấp</Table.HeaderCell>
                    <Table.HeaderCell>Mã thứ cấp</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.map((r, i) => (
                    <Table.Row key={r.id}>
                      <Table.Cell content={i + 1} />
                      <Table.Cell
                        content={
                          r.code?.length === 12 ? <b>{r.code}</b> : r.code
                        }
                      />
                      <Table.Cell>
                        <Input
                          ref={(ref) => {
                            inputRefs.current.push(ref);
                          }}
                          value={r?.secondaryCode ?? ''}
                          onChange={(__, { value }) => {
                            setData((d) =>
                              d.map((row, idx) =>
                                i === idx
                                  ? { ...row, secondaryCode: value }
                                  : row,
                              ),
                            );
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.keyCode === 13 &&
                              inputRefs.current[i + 1]?.focus()
                            ) {
                              inputRefs.current[i + 1].focus();
                            }
                          }}
                          action={
                            selectingType === 1
                              ? {
                                  color: 'blue',
                                  icon: 'paste',
                                  onClick: (e) => {
                                    e.preventDefault();
                                    setData((d) =>
                                      d.map((row, idx) =>
                                        i === idx
                                          ? { ...row, secondaryCode: row.code }
                                          : row,
                                      ),
                                    );
                                  },
                                }
                              : null
                          }
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </>
          )}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          loading={createLoading}
          disabled={createLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={(e) => setSelectedFile(e.target.files[0])}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </Modal>
  );
};

CreateWithSubCodeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

export default CreateWithSubCodeModal;
