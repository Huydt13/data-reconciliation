/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  FiPlus,
  FiTrash2,
  FiFileText,
  FiDownload,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';
import { FaSlash } from 'react-icons/fa';

import { Header, Icon, Popup, Step } from 'semantic-ui-react';

import { useSelector, useDispatch } from 'react-redux';
import {
  getTransports,
  deleteTransport,
  exportTransportFile,
} from 'medical-test/actions/transport';
import { getTransportStatus } from 'infection-chain/utils/helpers';
import { showConfirmModal } from 'app/actions/global';
import { formatToTime } from 'app/utils/helpers';

import { DataTable } from 'app/components/shared';
import { TransportType } from 'infection-chain/utils/constants';
import TransportFilter from './TransportFilter';
import TransportModal from './TransportModal';
import TransportCheckingModal from './TransportCheckingModal';
import SampleTransportExcelModal from './SampleTransportExcelModal';
import RejectNoteModal from './RejectNoteModal';
import SendTransportModal from './SendTransportModal';
import QuickReceiveModal from './QuickReceiveModal';

const IconStack = styled.span`
  display: inline-block;
  position: relative;
`;

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Thông tin chuyển mẫu',
    formatter: ({ fromUnit, sendingTime }) => (
      <div>
        <Header sub>{fromUnit?.name}</Header>
        <span>
          {formatToTime(sendingTime) &&
            `Chuyển lúc ${formatToTime(sendingTime)}`}
        </span>
      </div>
    ),
  },
  {
    Header: 'Thông tin nhận mẫu',
    formatter: ({ toUnit, receivingTime }) => (
      <div>
        <Header sub>{toUnit?.name}</Header>
        <span>
          {formatToTime(receivingTime) &&
            `Nhận lúc ${formatToTime(receivingTime)}`}
        </span>
      </div>
    ),
  },
  { Header: 'Số lượng mẫu', formatter: ({ count }) => count },
  {
    Header: 'Trạng thái',
    formatter: ({ status, dateCreated, sendingTime, receivingTime }) => (
      <Popup
        pinned
        flowing
        size="mini"
        content={
          <Step.Group size="mini">
            <Step completed>
              <Icon name="plus" />
              <Step.Content>
                <Step.Title>Tạo</Step.Title>
                <Step.Description>{formatToTime(dateCreated)}</Step.Description>
              </Step.Content>
            </Step>

            <Step
              completed={Boolean(sendingTime)}
              active={dateCreated && !sendingTime}
            >
              <Icon name="arrow up" />
              <Step.Content>
                <Step.Title>Chuyển</Step.Title>
                <Step.Description>{formatToTime(sendingTime)}</Step.Description>
              </Step.Content>
            </Step>

            {!(dateCreated && !sendingTime) && (
              <Step active completed={Boolean(receivingTime)}>
                <Icon name="arrow down" />
                <Step.Content>
                  <Step.Title>Nhận</Step.Title>
                  <Step.Description>
                    {formatToTime(receivingTime)}
                  </Step.Description>
                </Step.Content>
              </Step>
            )}
          </Step.Group>
        }
        trigger={<span>{getTransportStatus(status).label}</span>}
      />
    ),
  },
  { Header: 'Ghi chú', formatter: (row) => row.note, cutlength: 50 },
];

const TransportTable = () => {
  const { unitInfo, getPrefixesLoading } = useSelector(
    (state) => state.medicalTest,
  );
  const {
    getUnitInfoLoading,
    transportData,
    getTransportsLoading,
    createTransportLoading,
    updateTransportLoading,
    deleteTransportLoading,
    exportTransportLoading,
    sendTransportLoading,
  } = useSelector((state) => state.transport);
  const loading =
    getTransportsLoading ||
    getPrefixesLoading ||
    createTransportLoading ||
    updateTransportLoading ||
    deleteTransportLoading ||
    getUnitInfoLoading ||
    exportTransportLoading ||
    sendTransportLoading;

  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rejectType, setRejectType] = useState(0);

  const [selectingRow, setSelectingRow] = useState(null);

  const [quickReceiveModal, setQuickReceiveModal] = useState(false);
  const [transportModal, setTransportModal] = useState(false);
  const [transportCheckingModal, setTransportCheckingModal] = useState(false);
  const [sendTransportModal, setSendTransportModal] = useState(false);
  const [sampleModal, setSampleModal] = useState(false);

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(
      getTransports({
        ...filter,
        pageSize,
        pageIndex,
      }),
    );
  }, [dispatch, filter, pageSize, pageIndex]);

  useEffect(getData, [getData]);

  const { data, pageCount } = transportData;

  return (
    <div>
      <TransportFilter
        onChange={setFilter}
        onOpenModal={() => setSampleModal(true)}
      />
      <DataTable
        title="Quản lý chuyển mẫu"
        data={(data || []).map((d, i) => ({ ...d, index: i + 1 }))}
        columns={columns}
        loading={loading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            title: 'Nhận mẫu nhanh',
            icon: <FiArrowDown />,
            color: 'blue',
            onClick: () => setQuickReceiveModal(true),
            globalAction: true,
          },
          {
            title: 'Thêm',
            icon: <FiPlus />,
            color: 'green',
            onClick: () => {
              setSelectingRow();
              setTransportModal(true);
            },
            globalAction: true,
          },
          {
            title: 'Xuất file Excel',
            icon: <FiDownload />,
            color: 'green',
            onClick: (row) => dispatch(exportTransportFile(row.id)),
          },
          {
            title: 'Chuyển mẫu',
            icon: (
              <IconStack>
                <FiArrowUp textAnchor="middle" alignmentBaseline="middle" />
              </IconStack>
            ),
            color: 'orange',
            onClick: (row) => {
              setSelectingRow(row);
              setSendTransportModal(true);
            },
            hidden: ({ toUnit }) => !toUnit,
            disabled: (row) =>
              !(
                row.status === TransportType.CREATE &&
                unitInfo?.id === row?.fromUnit?.id
              ),
          },
          {
            title: 'Hủy chuyển',
            icon: (
              <IconStack>
                <FiArrowUp textAnchor="middle" alignmentBaseline="middle" />
                <FaSlash
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                  }}
                />
              </IconStack>
            ),
            color: 'orange',
            onClick: (row) => {
              setRejectType(1);
              setSelectingRow(row);
            },
            disabled: (row) => row.status !== TransportType.SENT,
            hidden: !unitInfo?.isJoiningExam,
          },
          {
            title: 'Hủy nhận',
            icon: (
              <IconStack>
                <FiArrowDown textAnchor="middle" alignmentBaseline="middle" />
                <FaSlash
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                  }}
                />
              </IconStack>
            ),
            color: 'orange',
            onClick: (row) => {
              setRejectType(2);
              setSelectingRow(row);
            },
            disabled: (row) => row.status !== TransportType.RECEIVED,
            hidden: !unitInfo?.isJoiningExam,
          },
          {
            title: 'Chi tiết',
            icon: <FiFileText />,
            color: 'blue',
            onClick: (row) => {
              setSelectingRow(row);
              if (
                row.status === TransportType.SENT &&
                unitInfo?.id === row?.toUnit?.id
              ) {
                setTransportCheckingModal(true);
              } else {
                setTransportModal(true);
              }
            },
          },
          {
            title: 'Xóa',
            icon: <FiTrash2 />,
            color: 'red',
            onClick: (row) => {
              dispatch(
                showConfirmModal('Xác nhận xóa?', () => {
                  dispatch(deleteTransport(row.id)).then(getData);
                }),
              );
            },
            disabled: (row) => row.status !== TransportType.CREATE,
          },
        ]}
      />

      <TransportCheckingModal
        key={
          transportCheckingModal
            ? 'OpenTransportCheckingModal'
            : 'CloseTransportCheckingModal'
        }
        open={transportCheckingModal}
        id={selectingRow?.id}
        onClose={() => setTransportCheckingModal(false)}
        getData={getData}
      />

      <TransportModal
        key={transportModal ? 'OpenTransportModal' : 'CloseTransportModal'}
        open={transportModal}
        id={selectingRow?.id}
        onClose={() => setTransportModal(false)}
        getData={getData}
      />

      <SampleTransportExcelModal
        key={
          sampleModal ? 'OpenTransportSampleModal' : 'CloseTransportSampleModal'
        }
        open={sampleModal}
        onClose={() => setSampleModal(false)}
        onRefresh={getData}
      />

      <RejectNoteModal
        type={rejectType}
        onClose={() => setRejectType(0)}
        data={selectingRow}
        getData={getData}
      />

      <SendTransportModal
        key={
          sendTransportModal
            ? 'OpenSendTransportModal'
            : 'CloseSendTransportModal'
        }
        open={sendTransportModal}
        onClose={() => setSendTransportModal(false)}
        data={selectingRow}
        getData={getData}
      />

      <QuickReceiveModal
        key={
          quickReceiveModal ? 'OpenQuickReceiveModal' : 'CloseQuickReceiveModal'
        }
        open={quickReceiveModal}
        onClose={() => setQuickReceiveModal(false)}
        getData={getData}
      />
    </div>
  );
};

export default TransportTable;
