/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { Button, Form, Header, Modal } from 'semantic-ui-react';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  createExamination,
  getRePrintCode,
  getRePrintDisease,
} from 'medical-test/actions/medical-test';

import { getImportantType } from 'infection-chain/utils/helpers';

import { DataTable } from 'app/components/shared';

// import ProfileReasonSection from 'profile/components/ProfileReasonSection';
import FeeTypeSelect from 'medical-test/components/examinations/FeeTypeSelect';
import ExaminationDetailSection from 'infection-chain/components/subject/medical-test/ExaminationDetailSection';
import { showConfirmModal } from 'app/actions/global';
import { FiEdit2, FiPlus, FiX } from 'react-icons/fi';
import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';
import { getCollectingSessionById } from '../actions/collecting-session';

const ButtonGroupWrapper = styled.div`
  margin-bottom: 10px;
  text-align: right;
  & .buttons {
    margin-top: 16px;
    margin-right: 4px;
  }
`;

const MarginLeftButton = styled(Button)`
  margin-left: 10px !important;
`;

const AddExaminationToCollectingSessionModal = ({
  open,
  onClose,
  data: dataProp,
  getData,
}) => {
  const dispatch = useDispatch();
  const unitInfo = useSelector((s) => s.medicalTest.unitInfo);
  const getDiseasesLoading = useSelector(
    (state) => state.medicalTest.getDiseasesLoading,
  );
  const diseaseList = useSelector((state) => state.medicalTest.diseaseList);
  const examinationTypeList = useSelector(
    (state) => state.medicalTest.examinationTypeList,
  );
  const getExaminationTypesLoading = useSelector(
    (state) => state.medicalTest.getExaminationTypesLoading,
  );
  const addExaminationToCollectingSessionLoading = useSelector(
    (s) => s.collectingSession.addExaminationToCollectingSessionLoading,
  );
  const getCollectingSessionDetailLoading = useSelector(
    (s) => s.collectingSession.getCollectingSessionDetailLoading,
  );

  const [data, setData] = useState({});
  const [recordList, setRecordList] = useState([]);
  useEffect(() => {
    const getDetail = async () => {
      if (dataProp?.id) {
        const result = await dispatch(getCollectingSessionById(dataProp.id));
        setData(result);
        setRecordList(
          result?.examinations?.map((e) => ({
            ...e,
            diseaseSampleId: e.diseaseSample.id,
            diseaseSampleName: e.diseaseSample.name,
            key: e.id || e.key || uuidv4(),
          })) ?? [],
        );
      }
    };
    getDetail();
  }, [dispatch, dataProp]);

  const {
    watch,
    control,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data || {},
  });

  useEffect(() => {
    reset(data);
  }, [reset, data]);

  useEffect(() => {
    if (data?.id) {
      dispatch(getRePrintDisease(unitInfo?.code));
      dispatch(
        getRePrintCode(
          unitInfo.code,
          diseaseList.find((d) => d.id === data.diseaseId)?.code ?? '',
          true,
        ),
      );
      setValue('dateTaken', moment());
    }
    // eslint-disable-next-line
  }, [dispatch, data]);

  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Mẫu bệnh phẩm',
        formatter: (row) => row?.diseaseSampleName ?? '',
      },
      {
        Header: 'Mã xét nghiệm',
        formatter: ({ code }) => (code?.length === 12 ? <b>{code}</b> : code),
      },
      { Header: 'Kỹ thuật xét nghiệm', accessor: 'testTechnique' },
    ],
    [],
  );
  const tableActions = [
    {
      icon: <FiPlus />,
      title: 'Thêm',
      color: 'green',
      onClick: () => {
        setIsCreate(true);
        setIsUpdate(false);
        setDisabled(true);
        setCurrentRecord(null);
      },
      globalAction: true,
    },
    {
      icon: <FiEdit2 />,
      title: 'Sửa',
      color: 'violet',
      onClick: (row) => {
        setIsUpdate(true);
        setIsCreate(false);
        setDisabled(true);
        setCurrentRecord(row);
      },
      disabled: (row) => !row.isEditable || data?.unitId !== unitInfo?.id,
    },
    {
      icon: <FiX />,
      title: 'Xóa',
      color: 'red',
      onClick: (row) =>
        dispatch(
          showConfirmModal('Xác nhận xóa?', () => {
            setCurrentRecord(null);
            setIsCreate(false);
            setIsUpdate(false);
            setDisabled(false);
            setRecordList((oldRecord) =>
              oldRecord.filter((r) => r.key !== row.key),
            );
          }),
        ),
      disabled: (row) => !row.isEditable || data?.unitId !== unitInfo?.id,
    },
  ];

  const updateRecordList = () => {
    if (isUpdate) {
      setRecordList((oldRecord) =>
        oldRecord.map((s) =>
          s.key !== currentRecord.key
            ? s
            : {
                ...currentRecord,
              },
        ),
      );
    } else {
      setRecordList((oldRecord) => [
        ...oldRecord,
        {
          ...currentRecord,
        },
      ]);
    }
    setIsCreate(false);
    setIsUpdate(false);
    setDisabled(false);
    setCurrentRecord(null);
  };

  const table = (
    <DataTable
      title="Danh sách mẫu bệnh phẩm"
      columns={tableColumns}
      data={recordList}
      actions={tableActions}
    />
  );
  const confirmButton = (
    <MarginLeftButton
      basic
      disabled={!currentRecord?.code}
      color={isCreate ? 'green' : 'violet'}
      content={isCreate ? 'Thêm' : 'Cập nhật'}
      onClick={updateRecordList}
    />
  );
  const cancelButton = (
    <MarginLeftButton
      basic
      color="grey"
      content="Huỷ"
      onClick={() => {
        setIsCreate(false);
        setIsUpdate(false);
        setDisabled(false);
        setCurrentRecord(null);
      }}
    />
  );
  const handleImmediatelyChange = (d) => {
    setRecordList((oldRecord) => [
      ...oldRecord,
      {
        ...d,
        key: uuidv4(),
      },
    ]);
  };
  const detailInformation = (
    <>
      <Header as="h4" content="Chi tiết mẫu bệnh phẩm" />
      <Form.Field
        recordList={recordList}
        initialData={currentRecord}
        control={ExaminationDetailSection}
        onDisabled={setDisabled}
        onChange={setCurrentRecord}
        onImmediatelyChange={handleImmediatelyChange}
      />
    </>
  );

  const onSubmit = async () => {
    const values = getValues();
    const d = {
      ...getValues(),
      collectingSessionId: dataProp.id,
      reasonLv1: values.reason,
      reasonLv2: values.reasonType,
      reasonLv3:
        values.fromCountry || values.fromProvince || values.relatedProfileId,
      reason: undefined,
      reasonType: undefined,
      relatedProfileId: undefined,
      fromCountry: undefined,
      fromProvince: undefined,
      isGroup: undefined,
      examinationDetails: recordList.map((e) => ({
        ...e,
        isGroup: Boolean(values.isGroup),
      })),
    };
    await dispatch(createExamination(d));
    onClose();
    getData();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Thêm phiên lấy mẫu vào buổi</Modal.Header>
      <Modal.Content>
        <FormProvider
          control={control}
          watch={watch}
          setValue={setValue}
          formState={{ errors }}
        >
          <Form loading={getCollectingSessionDetailLoading}>
            <Controller
              name="unitId"
              defaultValue={unitInfo?.id}
              control={control}
            />
            {/* <ProfileReasonSection data={data} /> */}
            <Form.Group widths="equal">
              <Controller
                name="diseaseId"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    required
                    search
                    deburr
                    label="Loại bệnh"
                    loading={getDiseasesLoading}
                    options={_.sortBy(diseaseList, ({ code }) =>
                      code === 'U07' ? 0 : 1,
                    ).map((c) => ({
                      key: c.id,
                      value: c.id,
                      text: `${c.name} - Mã bệnh: ${c.code}`,
                    }))}
                    value={value}
                    onBlur={onBlur}
                    onChange={(__, { value: v }) => onChange(v)}
                    error={Boolean(errors.diseaseId)}
                  />
                )}
              />
              <Controller
                name="examinationTypeId"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    required
                    search
                    deburr
                    label="Loại mẫu xét nghiệm"
                    loading={getExaminationTypesLoading}
                    options={examinationTypeList.map((c) => ({
                      key: c.id,
                      value: c.id,
                      text: `${c.name} - Độ ưu tiên: ${
                        getImportantType(c.importantValue)?.label
                      }`,
                      label: {
                        empty: true,
                        circular: true,
                        color: `${getImportantType(c.importantValue)?.color}`,
                      },
                    }))}
                    value={value}
                    onBlur={onBlur}
                    onChange={(__, { value: v }) => onChange(v)}
                    error={Boolean(errors.examinationTypeId)}
                  />
                )}
              />
            </Form.Group>

            <Form.Group widths="equal">
              <Controller
                name="dateTaken"
                defaultValue={moment()}
                control={control}
                rules={{ required: true }}
                render={({ onChange, onBlur }) => (
                  <Form.Field
                    required
                    isHavingTime
                    label="Thời gian lấy mẫu"
                    control={KeyboardDateTimePicker}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.dateTaken)}
                    disabledDays={[
                      {
                        after: new Date(),
                      },
                    ]}
                  />
                )}
              />
            </Form.Group>

            <Form.Group widths="equal">
              <Controller
                name="feeType"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ onChange, onBlur, value }) => (
                  <Form.Field
                    required
                    clearable
                    displayValueOnly
                    value={value}
                    control={FeeTypeSelect}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.feeType)}
                  />
                )}
              />
              <Controller
                name="isGroup"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    search
                    required
                    clearable
                    value={value}
                    label="Mẫu đơn/Mẫu gộp"
                    options={[
                      { value: 0, text: 'Mẫu đơn' },
                      { value: 1, text: 'Mẫu gộp' },
                    ]}
                    onChange={(__, { value: v }) => onChange(v)}
                    onBlur={onBlur}
                    error={Boolean(errors.isGroup)}
                  />
                )}
              />
            </Form.Group>

            {table}
            {(isCreate || isUpdate) && (
              <>
                {detailInformation}
                <ButtonGroupWrapper>
                  {confirmButton}
                  {cancelButton}
                </ButtonGroupWrapper>
              </>
            )}
          </Form>
        </FormProvider>
      </Modal.Content>
      {!disabled && (
        <Modal.Actions>
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content="Xác nhận"
            loading={addExaminationToCollectingSessionLoading}
            disabled={addExaminationToCollectingSessionLoading}
            onClick={handleSubmit(onSubmit)}
          />
        </Modal.Actions>
      )}
    </Modal>
  );
};

AddExaminationToCollectingSessionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    examinations: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  getData: PropTypes.func.isRequired,
};

AddExaminationToCollectingSessionModal.defaultProps = {
  data: {},
};

export default AddExaminationToCollectingSessionModal;
