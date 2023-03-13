/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { toast } from 'react-toastify';

import { FiX } from 'react-icons/fi';
import {
  Button,
  Dimmer,
  Form,
  Grid,
  Input,
  Label,
  Loader,
  Modal,
} from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import {
  getTransportById,
  receiveTransport,
} from 'medical-test/actions/transport';
import { showConfirmModal } from 'app/actions/global';

import { DataTable, InfoRow } from 'app/components/shared';
import { formatToTime } from 'app/utils/helpers';
import { TransportCheckingStatus } from 'infection-chain/utils/constants';
import {
  getImportantType,
  getTransportCheckingStatus,
  transportCheckingList,
} from 'infection-chain/utils/helpers';

import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';

const LabelWrapper = styled.div`
  text-align: right;
  padding-top: 1rem;
`;
const StyledLabel = styled(Label)`
  margin-left: -8px !important;
`;

const TransportCheckingModal = (props) => {
  const { open, onClose, id, getData } = props;
  const dispatch = useDispatch();

  const [data, setData] = useState(false);
  const [fetchingData, setFetchingData] = useState(undefined);
  const [receivingTime, setReceivingTime] = useState(undefined);
  const [sentTransportData, setSentTransportData] = useState([]);

  useEffect(() => {
    if (id && open) {
      const getTransport = async () => {
        const result = await dispatch(getTransportById(id));
        setData(result);
        setSentTransportData(result.transportDetails);
      };
      getTransport();
    }
    // eslint-disable-next-line
  }, [dispatch, id]);

  const columnsSentTransportTable = useMemo(
    () => [
      { Header: '#', accessor: 'index' },
      {
        Header: 'Người được xét nghiệm',
        formatter: (row) => row.examinationDetail.person.name,
        cutlength: 50,
      },
      {
        Header: 'Mã xét nghiệm',
        formatter: ({ exception, examinationDetail }) => (
          <>
            <Label
              basic
              color={
                exception ??
                getTransportCheckingStatus(TransportCheckingStatus.MISSING)
                  .color
              }
              content={examinationDetail.code}
            />
          </>
        ),
      },
      {
        Header: 'Mẫu bệnh phẩm',
        formatter: (row) => row.examinationDetail?.diseaseSample?.name,
      },
      {
        Header: 'Ngày lấy mẫu',
        formatter: (row) =>
          row.examinationDetail.dateTaken
            ? moment(row.examinationDetail.dateTaken).format('DD-MM-YY HH:mm')
            : '',
      },
      {
        Header: 'Kỹ thuật xét nghiệm',
        formatter: (row) => row.examinationDetail.testTechnique,
      },
      {
        Header: 'Độ ưu tiên',
        formatter: ({ examinationDetail }) => (
          <>
            <Label
              empty
              circular
              style={{ marginRight: '5px' }}
              key={getImportantType(examinationDetail.importantValue)?.color}
              color={getImportantType(examinationDetail.importantValue)?.color}
            />
            {getImportantType(examinationDetail.importantValue)?.label}
          </>
        ),
      },
    ],
    [],
  );
  const columnsScannedTransportTable = useMemo(
    () => [
      { Header: '#', accessor: 'index' },
      {
        Header: 'Mã',
        formatter: ({ color, code }) => (
          <Label basic color={color} content={code} />
        ),
      },
    ],
    [],
  );

  const [scannedTransportData, setScannedTransportData] = useState([]);

  const [searchValue, setSearchValue] = useState('');
  const clearAndCheck = (v) => {
    const value = v.toUpperCase();
    const selecting = sentTransportData.find(
      (st) => st.examinationDetail.code === value,
    );
    if (value) {
      if (selecting) {
        if (
          !selecting?.exception ||
          selecting?.exception ===
            getTransportCheckingStatus(TransportCheckingStatus.MISSING).color
        ) {
          const values = [...sentTransportData];
          values.find((e) => e.examinationDetail.code === value).exception =
            getTransportCheckingStatus(TransportCheckingStatus.AVAILABLE).color;
          // scanning code existed in sent
          // remove from sent
          setSentTransportData(values);
          // add to scanned
          setScannedTransportData([
            ...scannedTransportData,
            {
              code: value,
              value: getTransportCheckingStatus(
                TransportCheckingStatus.AVAILABLE,
              ).value,
              color: getTransportCheckingStatus(
                TransportCheckingStatus.AVAILABLE,
              ).color,
            },
          ]);
        } else if (
          // scanning code existed in scanned
          sentTransportData.find((st) => st.examinationDetail.code === value)
            ?.exception ===
          getTransportCheckingStatus(TransportCheckingStatus.AVAILABLE).color
        ) {
          toast.warn('Mã này đã được quét!');
        }
      } else if (
        scannedTransportData.find((sc) => sc.code === value)?.color ===
        getTransportCheckingStatus(TransportCheckingStatus.SPARE).color
      ) {
        toast.warn('Mã này đã được quét!');
      } else {
        // scanning code not existed in sent
        // add to scanned
        setScannedTransportData([
          ...scannedTransportData,
          {
            code: value,
            value: getTransportCheckingStatus(TransportCheckingStatus.SPARE)
              .value,
            color: getTransportCheckingStatus(TransportCheckingStatus.SPARE)
              .color,
          },
        ]);
      }
      setSearchValue('');
    }
  };

  const handleRemove = (row) => {
    setScannedTransportData(
      scannedTransportData.filter((sc) => sc.code !== row.code),
    );
    switch (row.value) {
      case TransportCheckingStatus.AVAILABLE: {
        const values = [...sentTransportData];
        values.find((e) => e.examinationDetail.code === row.code).exception =
          getTransportCheckingStatus(TransportCheckingStatus.MISSING).color;
        setSentTransportData(values);
        break;
      }
      case TransportCheckingStatus.SPARE: {
        break;
      }
      case TransportCheckingStatus.MISSING: {
        break;
      }
      default: {
        break;
      }
    }
  };

  const { receiveTransportLoading, getTransportByIdLoading } = useSelector(
    (state) => state.transport,
  );

  const onReceive = async (d) => {
    const { sent: missing, scanned, transportDetails } = d;
    const scannedAvailableCode = scanned
      .filter((sc) => sc.value === TransportCheckingStatus.AVAILABLE)
      .map((sc) => sc.code);
    const spareData = scanned
      .filter((sc) => sc.value === TransportCheckingStatus.SPARE)
      .map((sc) => ({
        code: sc.code,
        exception: getTransportCheckingStatus(TransportCheckingStatus.SPARE)
          .color,
      }));
    const missingData = missing.map((m) => ({
      ...m,
      examinationDetailId: m.examinationDetail.id,
      exception: getTransportCheckingStatus(TransportCheckingStatus.MISSING)
        .color,
    }));
    const availableData = transportDetails
      .filter((t) => scannedAvailableCode.includes(t.examinationDetail.code))
      .map((t) => ({
        ...t,
        examinationDetailId: t.examinationDetail.id,
        exception: getTransportCheckingStatus(TransportCheckingStatus.AVAILABLE)
          .color,
      }));
    const checkingData = {
      id: data.id,
      note:
        spareData.length !== 0 || missingData.length !== 0
          ? `${spareData.length !== 0 ? `Dư ${spareData.length} mã ` : ''}${
              missingData.length !== 0 ? `Thiếu ${missingData.length} mã` : ''
            }`
          : '',
      transportDetails: [...availableData, ...missingData, ...spareData],
      receivingTime: moment(receivingTime).toDate(),
    };
    if (
      [...availableData, ...missingData, ...spareData].filter(
        (e) => !e.exception,
      ).length > 0
    ) {
      toast.warn('Kiểm tra console log');
      console.log('TransportDetails:', [
        ...availableData,
        ...missingData,
        ...spareData,
      ]);
    }
    if (moment(receivingTime).isBefore(moment(data.sendingTime))) {
      toast.warn(
        `Thời gian chuyển mẫu phải sau ${formatToTime(data.sendingTime)}`,
      );
    } else if (moment(receivingTime).isAfter(moment())) {
      toast.warn(`Thời gian chuyển mẫu phải trước ${formatToTime(moment())}`);
    } else {
      await dispatch(receiveTransport(checkingData));
      setFetchingData(undefined);
      onClose();
      getData();
    }
  };

  return (
    <Modal
      size="fullscreen"
      open={open}
      onClose={() =>
        dispatch(
          showConfirmModal('Dữ liệu chưa được lưu, bạn có muốn đóng?', onClose),
        )
      }
    >
      <Dimmer inverted active={getTransportByIdLoading}>
        <Loader />
      </Dimmer>
      <Modal.Header>
        <StyledLabel size="large" color="green" ribbon content="Đã chuyển" />
        Kiểm tra và nhận mẫu
      </Modal.Header>
      <Modal.Content>
        <Grid>
          <Grid.Row style={{ paddingBottom: 0 }}>
            <Grid.Column width={16}>
              <Input
                fluid
                placeholder="Nhấn vào đây và quét mã xét nghiệm"
                value={searchValue}
                onChange={(_, { value }) => setSearchValue(value)}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    // full code
                    clearAndCheck(e.target.value);
                  }
                }}
              />
            </Grid.Column>
            <Grid.Column width={16}>
              <LabelWrapper>
                {transportCheckingList.map((t) => (
                  <Label
                    key={t.value}
                    basic
                    color={t.color}
                    content={t.label}
                  />
                ))}
              </LabelWrapper>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row divided>
            <Grid.Column width={12}>
              <DataTable
                columns={columnsSentTransportTable}
                title="Danh sách mã chuyển tới"
                data={sentTransportData.map((e, i) => ({ ...e, index: i + 1 }))}
                actions={[]}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <DataTable
                hideGoToButton
                columns={columnsScannedTransportTable}
                title="Danh sách mã đã quét"
                data={scannedTransportData.map((e, i) => ({
                  ...e,
                  index: i + 1,
                }))}
                actions={[
                  {
                    title: 'Xóa',
                    icon: <FiX />,
                    color: 'red',
                    onClick: handleRemove,
                  },
                ]}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          icon="check"
          labelPosition="right"
          content="Hoàn tất quét nhận mẫu"
          onClick={() =>
            setFetchingData({
              sent: sentTransportData.filter(
                (st) =>
                  !st.exception ||
                  st.exception ===
                    getTransportCheckingStatus(TransportCheckingStatus.MISSING)
                      .color,
              ),
              scanned: scannedTransportData,
              transportDetails: data.transportDetails,
            })
          }
        />
        <Button
          icon="arrow down"
          color="yellow"
          labelPosition="right"
          content="Đủ mẫu và nhận mẫu ngay"
          onClick={() => {
            setFetchingData({
              sent: [],
              scanned: sentTransportData.map((st) => ({
                code: st.examinationDetail.code,
                value: getTransportCheckingStatus(
                  TransportCheckingStatus.AVAILABLE,
                ).value,
                color: getTransportCheckingStatus(
                  TransportCheckingStatus.AVAILABLE,
                ).color,
              })),
              transportDetails: data.transportDetails,
            });
          }}
        />
      </Modal.Actions>
      <Modal size="small" open={Boolean(fetchingData)}>
        <Modal.Header>Xác nhận nhận mẫu</Modal.Header>
        <Modal.Content>
          <div className="ui form">
            <InfoRow
              label="Thời gian chuyển mẫu"
              content={formatToTime(data?.sendingTime) ?? '...'}
            />
            <Form.Field
              required
              isHavingTime
              label="Thời gian nhận mẫu"
              control={KeyboardDateTimePicker}
              value={receivingTime}
              onChange={setReceivingTime}
              disabledDays={[
                {
                  before: moment(data?.sendingTime).toDate(),
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
              setFetchingData(undefined);
            }}
          />
          <Button
            positive
            labelPosition="right"
            icon="arrow up"
            content="Nhận mẫu"
            loading={receiveTransportLoading}
            disabled={!receivingTime || receiveTransportLoading}
            onClick={() => onReceive(fetchingData)}
          />
        </Modal.Actions>
      </Modal>
    </Modal>
  );
};

TransportCheckingModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  id: PropTypes.string,
};

TransportCheckingModal.defaultProps = {
  id: '',
};

export default TransportCheckingModal;
