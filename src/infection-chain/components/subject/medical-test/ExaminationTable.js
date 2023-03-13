/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button, Form, Select, Header, Message } from 'semantic-ui-react';
import { FiPlus, FiEdit2, FiX } from 'react-icons/fi';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';
import { showConfirmModal } from 'app/actions/global';
import {
  getDiseaseSamples,
  getExaminationTypes,
  getRePrintDisease,
  getAvailableCodesToUse,
} from 'medical-test/actions/medical-test';

import { DataTable } from 'app/components/shared';
import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';
import ExaminationReasonSection from 'medical-test/components/assigns/ExaminationReasonSection';

import ExaminationDetailSection from './ExaminationDetailSection';
import SamplingPlaceSection from './SamplingPlaceSection';

const fields = [
  { name: 'id', options: {} },
  { name: 'unitId', options: {} },
  { name: 'diseaseId', options: {} },
  { name: 'dateTaken', options: {} },
  { name: 'person', options: {} },
  { name: 'feeType', options: {} },
  { name: 'examinationDetails', options: {} },
  { name: 'examinationTypeId', options: {} },
  { name: 'address', options: {} },
];
const feeTypeOptions = [
  { value: 0, text: 'Không thu phí' },
  { value: 1, text: 'Thu phí' },
];
const StyledButton = styled(Button)`
  margin-right: 0 !important;
  margin-left: 8px !important;
  margin-top: 15px !important;
`;

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

const ExaminationTable = (props) => {
  const {
    subject,
    examination,
    onSubmit,
    isUpdate: isUpdateProps,
    isAnonymous,
    onDelete,
  } = props;
  const { isAdmin } = useAuth();
  const {
    unitInfo,
    prefixList,
    availableDiseaseToPrintList,
    examinationTypeList,
    getDiseaseSamplesLoading,
    createExaminationLoading,
    updateExaminationLoading,
    deleteExaminationLoading,
    createAssignLoading,
  } = useSelector((state) => state.medicalTest);

  const loading =
    createAssignLoading ||
    createExaminationLoading ||
    updateExaminationLoading ||
    deleteExaminationLoading;

  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [recordList, setRecordList] = useState(
    examination?.examinationDetails?.map((e) => ({
      ...e,
      diseaseSampleId: e.diseaseSample.id,
      diseaseSampleName: e.diseaseSample.name,
      key: e.id || e.key || uuidv4(),
    })) ?? [],
  );
  const [selectingUnit, setSelectingUnit] = useState(null);
  const [selectingDisease, setSelectingDisease] = useState('');
  const [selectingExaminationType, setSelectingExaminationType] =
    useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDiseaseSamples());
    dispatch(getExaminationTypes());
  }, [dispatch]);

  const {
    watch,
    errors,
    control,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({ defaultValues: examination || {} });

  const unitId = watch('unitId');
  useEffect(() => {
    if (selectingUnit?.code) {
      dispatch(getRePrintDisease(selectingUnit.code));
    }
  }, [dispatch, selectingUnit]);

  useEffect(() => {
    if (selectingUnit?.id && selectingDisease?.code) {
      dispatch(getAvailableCodesToUse(selectingUnit.id, selectingDisease.code));
    }
  }, [dispatch, selectingUnit, selectingDisease]);

  useEffect(() => {
    fields.forEach((field) => {
      register(field.name, field.options);
    });
    if (subject?.id) {
      setValue('person', {
        id: subject.id,
        name: subject.information.fullName,
      });
    }
    if (unitInfo?.id) {
      setSelectingUnit(prefixList.find((z) => z.code === unitInfo?.code));
      setValue('unitId', unitInfo?.id);
    }
    if (examination?.id) {
      setSelectingUnit(prefixList.find((z) => z.id === examination?.unit?.id));
      setValue('dateTaken', examination?.dateTaken ?? moment());
      setValue('unitId', examination?.unit?.id);
      setValue('examinationTypeId', examination?.examinationType?.id);
      setValue(
        'examinationDetails',
        examination?.examinationDetails?.map((e) => ({
          ...e,
          diseaseSampleId: e?.diseaseSample?.id,
          diseaseSampleName: e?.diseaseSample?.name,
        })),
      );
      setSelectingDisease(
        availableDiseaseToPrintList.find((d) => d.id === watch('diseaseId')),
      );
      setSelectingExaminationType(
        examinationTypeList.find((e) => e.id === watch('examinationTypeId')),
      );
    } else {
      setValue('dateTaken', moment());
    }

    setValue('feeType', 0);

    if (availableDiseaseToPrintList.length === 1) {
      setValue('diseaseId', availableDiseaseToPrintList[0].id);
      setSelectingDisease(availableDiseaseToPrintList[0]);
    }
    // eslint-disable-next-line
  }, [register, setValue, prefixList, availableDiseaseToPrintList]);

  useEffect(() => {
    if (currentRecord && !currentRecord.key) {
      setCurrentRecord((r) => ({
        ...r,
        key: r.id || uuidv4(),
        unitId,
      }));
    }
  }, [currentRecord, unitId]);

  useEffect(() => {
    setValue('examinationDetails', recordList);
  }, [recordList, setValue]);

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
      hidden: isUpdateProps,
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
      disabled: (row) =>
        isUpdateProps &&
        (!row.isEditable || examination?.unit?.id !== unitInfo?.id),
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
      disabled: (row) =>
        isUpdateProps &&
        (!row.isEditable || examination?.unit?.id !== unitInfo?.id),
      hidden: isUpdateProps,
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

  const generalInformation = (
    <>
      {!isAnonymous && !isUpdateProps && (
        <>
          <Header as="h4" content="Lý do xét nghiệm" />
          <ExaminationReasonSection
            required
            isExamination
            data={examination?.profileCreationReason ?? null}
          />
          <SamplingPlaceSection required />
        </>
      )}

      <Header as="h4" content="Thông tin chung" />

      <Form.Group widths="equal">
        <Form.Field
          required
          label="Đơn vị lấy mẫu"
          control={Select}
          disabled={isUpdateProps}
          options={
            isAdmin
              ? prefixList
                  .filter((z) => z?.id === watch('unitId'))
                  .map((z) => ({
                    key: z.id,
                    text: z.name,
                    value: z.id,
                  }))
              : [
                  {
                    text: unitInfo.name,
                    key: unitInfo.id,
                    value: unitInfo.id,
                  },
                ]
          }
          value={watch('unitId') || ''}
          onChange={(e, { value }) => {
            setSelectingUnit(prefixList.find((z) => z.id === value));
            setValue('unitId', value);
            setValue('address', prefixList.find((z) => z.id === value).address);
          }}
        />
        <Form.Field
          required
          isHavingTime
          disabled={isUpdateProps}
          label="Thời gian lấy mẫu"
          control={KeyboardDateTimePicker}
          value={watch('dateTaken') || ''}
          onChange={(date) => {
            clearErrors('dateTaken');
            setValue('dateTaken', date);
          }}
          onError={(e) => setError('dateTaken', e)}
          error={Boolean(errors.dateTaken)}
          disabledDays={[
            {
              before: moment().subtract(1, 'days').toDate(),
              after: new Date(),
            },
          ]}
        />
      </Form.Group>
      {/* <Form.Group widths="equal">
        <Form.Field
          required
          search
          deburr
          clearable={!isUpdateProps}
          disabled={isUpdateProps}
          label="Loại mẫu xét nghiệm"
          control={Select}
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
          value={watch('examinationTypeId') || ''}
          onChange={(e, { value }) => {
            setSelectingExaminationType(
              examinationTypeList.find((ex) => ex.id === value),
            );
            setValue('examinationTypeId', value);
          }}
        />
      </Form.Group> */}
      <Form.Group widths="equal">
        <Form.Field
          required
          search
          deburr
          readOnly
          clearable={!isUpdateProps}
          disabled={isUpdateProps}
          label="Loại bệnh"
          control={Select}
          options={availableDiseaseToPrintList.map((c) => ({
            key: c.id,
            value: c.id,
            text: `${c.name} - Mã bệnh: ${c.code}`,
          }))}
          value={watch('diseaseId') || ''}
          onChange={(e, { value }) => {
            setValue('diseaseId', value);
            setSelectingDisease(
              availableDiseaseToPrintList.find((d) => d.id === value),
            );
          }}
        />
        <Form.Field
          required
          search
          clearable={!isUpdateProps}
          disabled={isUpdateProps}
          label="Loại hình"
          control={Select}
          options={feeTypeOptions}
          value={typeof watch('feeType') === 'number' ? watch('feeType') : ''}
          onChange={(_, { value }) => {
            setValue('feeType', value);
          }}
        />
      </Form.Group>
    </>
  );
  const table = (
    <DataTable
      // noPaging
      loading={getDiseaseSamplesLoading}
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
        isDisabled={!watch('unitId') || !watch('diseaseId')}
        control={ExaminationDetailSection}
        onDisabled={setDisabled}
        onChange={setCurrentRecord}
        onImmediatelyChange={handleImmediatelyChange}
        importantValue={selectingExaminationType?.importantValue}
      />
    </>
  );

  return (
    <FormProvider
      control={control}
      watch={watch}
      formState={{ errors }}
      setValue={setValue}
    >
      <div className="ui form">
        {generalInformation}
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
        {!disabled &&
          !(
            isUpdateProps &&
            (!examination?.isEditable || examination?.unit?.id !== unitInfo?.id)
          ) && (
            <ButtonGroupWrapper>
              <StyledButton
                primary
                content={isUpdateProps ? 'Cập nhật' : 'Tạo mới'}
                loading={loading}
                disabled={
                  loading ||
                  recordList.length === 0 ||
                  (isUpdateProps && !examination?.isEditable) ||
                  (isUpdateProps && examination?.unit?.id !== unitInfo?.id)
                }
                onClick={handleSubmit(onSubmit)}
              />
              {isUpdateProps && (
                <StyledButton
                  content="Xóa"
                  color="red"
                  loading={loading}
                  disabled={
                    loading ||
                    recordList.length === 0 ||
                    !examination?.isEditable ||
                    examination?.unit?.id !== unitInfo?.id
                  }
                  onClick={onDelete}
                />
              )}
            </ButtonGroupWrapper>
          )}
        {isUpdateProps &&
          (!examination?.isEditable ||
            examination?.unit?.id !== unitInfo?.id) && (
            <Message negative>
              <Message.Header>Không thể sửa/xóa</Message.Header>
              <Message.List>
                {examination?.unit?.id !== unitInfo?.id && (
                  <Message.Item>
                    Không thể sửa/xóa do không phải mẫu thuộc tài khoản hiện
                    hành
                  </Message.Item>
                )}
                {isUpdateProps && !examination?.isEditable && (
                  <Message.Item>
                    {`Mẫu ${examination.examinationDetails
                      .filter((ex) => !ex.isEditable)
                      .map((ex) => ex.code)
                      .join(
                        ', ',
                      )} đã tồn tại trong phiên chuyển mẫu, không thể sửa hoặc xóa mẫu`}
                  </Message.Item>
                )}
              </Message.List>
            </Message>
          )}
      </div>
    </FormProvider>
  );
};

ExaminationTable.propTypes = {
  subject: PropTypes.shape({
    id: PropTypes.string,
    information: PropTypes.shape({
      fullName: PropTypes.string,
      isGroupProfile: PropTypes.bool,
    }),
  }),
  isUpdate: PropTypes.bool,
  isAnonymous: PropTypes.bool,
  initialData: PropTypes.shape({}),
  examination: PropTypes.shape({
    examinationDetails: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  onSubmit: PropTypes.func,
  onDelete: PropTypes.func,
};

ExaminationTable.defaultProps = {
  subject: {},
  isUpdate: false,
  isAnonymous: false,
  initialData: {},
  examination: {},
  onSubmit: () => {},
  onDelete: () => {},
};

export default ExaminationTable;
