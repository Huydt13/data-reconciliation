/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { toast } from 'react-toastify';
import _ from 'lodash';

import { useForm } from 'react-hook-form';
import { Modal, Form, Button, Label, Icon } from 'semantic-ui-react';
import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';

import store from 'app/store';
import { useSelector, useDispatch } from 'react-redux';
import {
  getTransportById,
  getUnitsAvailable,
  clearExaminationsExcel,
  deleteTransport,
  createTransport,
  updateTransport,
  sendTransport,
} from 'medical-test/actions/transport';
import { clearExams, selectExams } from 'medical-test/actions/session';
import { showConfirmModal } from 'app/actions/global';
import { InfoRow, KeyboardDatePicker } from 'app/components/shared';
import { formatToTime } from 'app/utils/helpers';

import { importantTypeList } from 'infection-chain/utils/helpers';
import { ImportantType, TransportType } from 'infection-chain/utils/constants';

import SentExaminationTable from './SentExaminationTable';
import AvailableExaminationTable from './AvailableExaminationTable';
import ImportExaminationSection from './ImportExaminationSection';

const fields = [
  'id',
  'fromUnitId',
  'toUnitId',
  'sendingTime',
  'receivingTime',
  'status',
  'transportType',
  'transportDetails',
  'expectedTime',
  'sendTransportDetails',
  'addedTransportDetails',
  'limited',
];

const StyledLabel = styled(Label)`
  margin-left: -8px !important;
`;

const StyledIcon = styled(Icon)`
  margin-left: 10px !important;
  font-size: 0.85em !important;
`;

const Flex = styled.div`
  display: flex !important;
  cursor: pointer !important;
`;

const TransportModal = (props) => {
  const { open, onClose, getData, id } = props;

  const { unitInfo, getExaminationDetailsLoading } = useSelector(
    (state) => state.medicalTest,
  );

  const {
    unitAvailableList,
    getUnitsAvailableLoading,
    getTransportsLoading,
    createTransportLoading,
    updateTransportLoading,
    deleteTransportLoading,
    getTransportByIdLoading,
    sendTransportLoading,
    receiveTransportLoading,
  } = useSelector((state) => state.transport);

  const [responseData, setResponseData] = useState(undefined);

  const dispatch = useDispatch();
  const [data, setData] = useState(undefined);
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (id && open) {
      const getTransport = async () => {
        const result = await dispatch(getTransportById(id));
        setData(result);
        setStatus(result.status);
      };
      getTransport();
    }
    // eslint-disable-next-line
  }, [dispatch, id]);

  const creating = !id;
  const updating = Boolean(id);
  const created = status === TransportType.CREATE;
  const sent = status === TransportType.SENT;
  const received = status === TransportType.RECEIVED;

  const [disabled, setDisabled] = useState(false);

  const [importantValue, setImportantValue] = useState('');

  const [selectingTransportType, setSelectingTransportType] = useState(0);

  const [copied, setCopied] = useState(false);

  const { watch, setValue, register, reset, handleSubmit } = useForm();
  useEffect(() => {
    fields.forEach(register);
    setValue('sendTransportDetails', []);
    setValue('addedTransportDetails', []);

    setValue('fromUnitId', unitInfo?.id);
    setValue('toUnitId', data?.toUnit?.id);
    if (creating) {
      setValue('expectedTime', moment().toJSON());
    }
  }, [register, setValue, unitInfo, data, creating]);
  useEffect(() => reset(data), [reset, data]);

  useEffect(() => {
    if (data) {
      setImportantValue(
        data?.transportDetails
          ? data?.transportDetails[0]?.examinationDetail?.importantValue
          : ImportantType.IMPORTANT,
      );
    }
  }, [setValue, data]);

  const expectedTime = moment(watch('expectedTime')).format('YYYY-MM-DD');

  useEffect(() => {
    if (expectedTime && open) {
      dispatch(getUnitsAvailable(expectedTime));
    }
    // eslint-disable-next-line
  }, [dispatch, expectedTime]);

  const onSubmit = async (d) => {
    const addedTransportDetailsFromSession = _.flattenDeep(
      store
        .getState()
        .session.selectedRows.filter((e) => e.exams)
        .map((e) => e.exams),
    );
    const {
      addedTransportDetails: addedTransportDetailsFromModal,
      sendTransportDetails,
      limited,
    } = d;

    const initialTransportDetails = data?.transportDetails ?? [];

    const initialTransportDetailIds = initialTransportDetails.map((e) => ({
      examinationDetailId: e.examinationDetail.id,
    }));
    const addedTransportDetails =
      selectingTransportType === 1
        ? addedTransportDetailsFromSession
        : addedTransportDetailsFromModal;
    const transportDetails = [
      ...new Set(
        [...addedTransportDetails, ...sendTransportDetails].map((e) => ({
          examinationDetailId: e.id,
        })),
      ),
    ];

    const removeExamDetailIds = _.differenceBy(
      initialTransportDetailIds,
      transportDetails,
      'examinationDetailId',
    ).map((e) => e.examinationDetailId);

    const submitData = {
      ...d,
      addedTransportDetails: undefined,
      sendTransportDetails: undefined,
      initialTransportDetails: undefined,
      selectingTransportType: undefined,
      limited: undefined,
      transportDetails,
      addList: _.differenceBy(
        transportDetails,
        initialTransportDetailIds,
        'examinationDetailId',
      ),
      removeList: initialTransportDetails
        .filter((e) => removeExamDetailIds.includes(e.examinationDetail.id))
        .map((e) => e.id),
    };

    if (transportDetails.length === 0) {
      if (!submitData?.id) {
        toast.warning('Chưa chọn mẫu sẽ chuyển!');
      } else {
        dispatch(
          showConfirmModal(
            'Không có mẫu nào trong phiên, bạn có muốn xóa phiên?',
            async () => {
              await dispatch(deleteTransport(submitData.id));
              onClose();
              getData();
            },
          ),
        );
      }
    } else if (transportDetails.length > limited) {
      toast.warning('Vượt quá giới hạn nhận mẫu!');
    } else {
      const response = await dispatch(
        creating
          ? createTransport({
            ...submitData,
            addList: undefined,
            removeList: undefined,
          })
          : updateTransport({ ...submitData, transportDetails: undefined }),
      );

      if (submitData.toUnitId && updating) {
        getData();
        setResponseData(response);
        setValue('sendingTime', moment().toJSON());
      } else {
        dispatch(clearExams());

        onClose();
        getData();
      }
    }
  };

  const onSend = async (d) => {
    if (moment(d).isBefore(moment(responseData.dateCreated))) {
      toast.warn(
        `Thời gian chuyển mẫu phải sau ${formatToTime(
          responseData.dateCreated,
        )}`,
      );
    } else if (moment(d).isAfter(moment())) {
      toast.warn(`Thời gian chuyển mẫu phải trước ${formatToTime(moment())}`);
    } else {
      await dispatch(sendTransport({ id: responseData.id, sendingTime: d }));

      dispatch(clearExams());
      setResponseData(undefined);

      onClose();
      getData();
    }
  };

  return (
    <>
      <Modal
        open={open}
        size="large"
        onClose={() => dispatch(
            showConfirmModal(
              'Dữ liệu chưa được lưu, bạn có muốn đóng?',
              onClose,
            ),
          )
        }
      >
        <Modal.Header>
          {id && (
            <StyledLabel
              size="large"
              color="green"
              ribbon
              content={
                created
                  ? 'Đã tạo'
                  : sent
                    ? 'Đã chuyển'
                    : received
                      ? 'Đã nhận'
                      : ''
              }
            />
          )}
          {creating ? 'Tạo' : 'Chi tiết'} phiên chuyển mẫu
        </Modal.Header>
        <Modal.Content scrolling>
          <div
            className={`ui form ${getTransportByIdLoading || getExaminationDetailsLoading
              ? 'loading'
              : ''
              }`}
          >
            {/* create new transport */}
            {creating ? (
              <>
                <Form.Group widths="equal">
                  <Form.Select
                    clearable
                    required
                    search
                    deburr
                    label="Độ ưu tiên"
                    value={importantValue}
                    options={importantTypeList.map((i) => ({
                      value: i.value,
                      text: i.label,
                      label: {
                        empty: true,
                        circular: true,
                        color: i.color,
                      },
                    }))}
                    onChange={(e, { value }) => {
                      setImportantValue(value);
                    }}
                  />
                  <Form.Field
                    isHavingTime
                    label="Thời gian tra cứu công suất"
                    control={KeyboardDatePicker}
                    value={watch('expectedTime') || null}
                    onChange={(date) => {
                      setValue('expectedTime', moment(date).toJSON());
                    }}
                    disabledDays={[
                      {
                        before: moment().toDate(),
                        after: moment().add(2, 'days').toDate(),
                      },
                    ]}
                  />
                  <Form.Select
                    deburr
                    search
                    readOnly
                    clearable
                    disabled={!watch('expectedTime')}
                    label="Cơ sở nhận mẫu"
                    loading={getUnitsAvailableLoading}
                    options={(unitAvailableList || []).map((z) => ({
                      key: z.id,
                      value: z.id,
                      text: z.name,
                      content: `${z.name} - Giới hạn còn lại trong ngày: ${z?.testAvailable}/${z?.testLimit} mẫu`,
                    }))}
                    value={watch('toUnitId') || ''}
                    onChange={(e, { value }) => {
                      setValue('toUnitId', value);
                      setValue(
                        'limited',
                        unitAvailableList.find((u) => u.id === value)
                          ?.testAvailable,
                      );
                    }}
                  />
                </Form.Group>
              </>
            ) : (
              <>
                {/* update + send transport */}
                <Flex
                  role="button"
                  tabIndex={0}
                  onKeyUp={() => { }}
                  onClick={() => {
                    setCopied(true);
                    navigator.clipboard.writeText(data?.id);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                  }}
                >
                  <InfoRow label="Id" content={data?.id ?? '...'} />
                  <StyledIcon
                    color={copied ? 'green' : null}
                    name={copied ? 'check' : 'copy outline'}
                  />
                </Flex>
                <InfoRow
                  label="Tạo phiên lúc"
                  content={formatToTime(data?.dateCreated) ?? '...'}
                />
                <InfoRow
                  label="Thông tin chuyển mẫu"
                  content={
                    data?.fromUnit?.name
                      ? data?.sendingTime
                        ? `${data?.fromUnit?.name} - ${formatToTime(
                          data?.sendingTime,
                        )}`
                        : data?.fromUnit?.name
                      : '...'
                  }
                />
                {sent || received || data?.fromUnitId !== unitInfo?.id ? (
                  <InfoRow
                    label="Thông tin nhận mẫu"
                    content={
                      data?.toUnit?.name
                        ? data?.receivingTime
                          ? `${data?.toUnit?.name} - ${formatToTime(
                            data?.receivingTime,
                          )}`
                          : data?.toUnit?.name
                        : '...'
                    }
                  //   data?.toUnit?.name && data?.receivingTime
                  //     ? `${data?.toUnit?.name} - ${
                  //         formatToTime(data?.receivingTime) ?? '...'
                  //       }`
                  //     : '...'
                  // }
                  />
                ) : (
                  <Form.Group widths="equal">
                    <Form.Field
                      isHavingTime
                      label="Thời gian tra cứu công suất"
                      control={KeyboardDatePicker}
                      value={watch('expectedTime') || null}
                      onChange={(date) => {
                        setValue('expectedTime', moment(date).toJSON());
                      }}
                      disabledDays={[
                        {
                          before: moment().toDate(),
                          after: moment().add(2, 'days').toDate(),
                        },
                      ]}
                    />
                    <Form.Select
                      deburr
                      search
                      clearable
                      disabled={!watch('expectedTime')}
                      label="Cơ sở nhận mẫu"
                      options={(unitAvailableList || []).map((z) => ({
                        key: z.id,
                        value: z.id,
                        text: z.name,
                        content: `${z.name} - Giới hạn còn lại trong ngày: ${z?.testAvailable}/${z?.testLimit} mẫu`,
                      }))}
                      loading={getUnitsAvailableLoading}
                      value={watch('toUnitId') || data?.toUnit?.id || ''}
                      onChange={(e, { value }) => {
                        setValue('toUnitId', value);
                        setValue(
                          'limited',
                          unitAvailableList.find((u) => u.id === value)
                            ?.testAvailable,
                        );
                      }}
                    />
                  </Form.Group>
                )}
              </>
            )}

            {/* update */}
            {updating && (
              <Form.Field
                control={SentExaminationTable}
                initialData={data?.transportDetails}
                isDisplayLabelNote={received}
                selectable={created}
                onChange={(d) => setValue('sendTransportDetails', d)}
              />
            )}

            {/* create new or status is created */}
            {(creating || created) && (
              <>
                <Form.Field>
                  Chọn mẫu từ:{' '}
                  <b>
                    {selectingTransportType
                      ? selectingTransportType === 1
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
                  checked={selectingTransportType === 1}
                  onChange={(__, { value }) => {
                    setSelectingTransportType(value);
                    dispatch(clearExams());
                    dispatch(clearExaminationsExcel());
                  }}
                />
                {/* <Form.Checkbox
                  radio
                  value={2}
                  name="checkboxRadioGroup"
                  label="File Excel"
                  checked={selectingTransportType === 2}
                  onChange={(__, { value }) => {
                    setSelectingTransportType(value);
                    dispatch(clearExams());
                    dispatch(clearExaminationsExcel());
                  }}
                /> */}
              </>
            )}

            {/* create new or status is created && select exam */}
            {(creating || created) &&
              selectingTransportType === 1 &&
              Number.isInteger(importantValue) && (
                <Form.Field
                  control={AvailableExaminationTable}
                  importantValue={importantValue}
                  onChange={({ data: d, pageIndex }) => {
                    dispatch(selectExams(d, pageIndex));
                  }}
                />
              )}

            {/* create new or status is created && excel */}
            {(creating || created) &&
              selectingTransportType === 2 &&
              Number.isInteger(importantValue) && (
                <Form.Field
                  control={ImportExaminationSection}
                  importantValue={importantValue}
                  onDisable={(d) => setDisabled(d)}
                  onChange={(d) => setValue('addedTransportDetails', d)}
                />
              )}
          </div>
        </Modal.Content>
        <Modal.Actions>
          {/* create new or status is created */}
          {(creating || created) && (
            <>
              <Button
                // labelPosition="right"
                // icon={'close'}
                // negative
                // content={'Đóng'}
                color={creating ? 'green' : 'violet'}
                icon={creating ? 'checkmark' : 'sync'}
                content={creating ? 'Tạo phiên' : 'Cập nhật phiên và chuyển mẫu'}
                loading={
                  getTransportsLoading ||
                  createTransportLoading ||
                  updateTransportLoading ||
                  deleteTransportLoading
                }
                disabled={
                  disabled ||
                  !watch('fromUnitId') ||
                  selectingTransportType !== 1 ||
                  getTransportsLoading ||
                  createTransportLoading ||
                  updateTransportLoading ||
                  deleteTransportLoading ||
                  receiveTransportLoading
                }
                onClick={handleSubmit(onSubmit)}
              // onClick={() => {
              //   onClose();
              //   setResponseData(undefined);
              // }}
              />
              <Button
                labelPosition="right"
                icon="close"
                negative
                content="Đóng"
                // color={creating ? 'green' : 'violet'}
                // icon={creating ? 'checkmark' : 'sync'}
                // content={creating ? 'Tạo phiên' : 'Cập nhật phiên và chuyển mẫu'}
                loading={
                  getTransportsLoading ||
                  createTransportLoading ||
                  updateTransportLoading ||
                  deleteTransportLoading
                }
                disabled={
                  disabled ||
                  !watch('fromUnitId') ||
                  getTransportsLoading ||
                  createTransportLoading ||
                  updateTransportLoading ||
                  deleteTransportLoading ||
                  receiveTransportLoading
                }
                // onClick={handleSubmit(onSubmit)}
                onClick={() => {
                  onClose();
                  setResponseData(undefined);
                }}
              />
            </>
          )}
        </Modal.Actions>
        <Modal size="small" open={Boolean(responseData)}>
          <Modal.Header>Xác nhận chuyển mẫu</Modal.Header>
          <Modal.Content>
            <div className="ui form">
              <InfoRow
                label="Thời gian tạo phiên"
                content={formatToTime(responseData?.dateCreated ?? moment())}
              />
              <Form.Field
                required
                isHavingTime
                label="Thời gian chuyển mẫu"
                control={KeyboardDateTimePicker}
                value={watch('sendingTime')}
                onChange={(date) => setValue('sendingTime', moment(date).toJSON())
                }
                disabledDays={[
                  {
                    before: moment(data?.dateCreated).toDate(),
                    after: moment().toDate(),
                  },
                ]}
              />
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Đóng"
              labelPosition="right"
              icon="x"
              onClick={() => {
                onClose();
                setResponseData(undefined);
              }}
            />
            <Button
              positive
              labelPosition="right"
              icon="arrow up"
              content="Chuyển mẫu"
              loading={sendTransportLoading}
              disabled={!watch('sendingTime') || sendTransportLoading}
              onClick={() => onSend(watch('sendingTime'))}
            />
          </Modal.Actions>
        </Modal>
      </Modal>
    </>
  );
};

TransportModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  getData: PropTypes.func,
  id: PropTypes.string,
};

TransportModal.defaultProps = {
  open: false,
  onClose: () => { },
  getData: () => { },
  id: '',
};

export default TransportModal;
