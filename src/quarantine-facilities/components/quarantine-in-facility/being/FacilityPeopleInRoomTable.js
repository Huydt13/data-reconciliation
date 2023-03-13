import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  FiCommand,
  FiDownload,
  FiFastForward,
  FiFileText,
  FiPlay,
  FiRepeat,
  FiSkipForward,
  FiX,
} from 'react-icons/fi';

import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import { completeFacility } from 'quarantine-facilities/actions/quarantine';
import { createAssignWithDate } from 'medical-test/actions/medical-test';

import apiLinks from 'app/utils/api-links';
import { DataTable } from 'app/components/shared';
import { exportExcel, showConfirmModal } from 'app/actions/global';
import { formatAddressToString, formatToDate } from 'app/utils/helpers';

import ProcessModal from 'infection-chain/components/subject/medical-test/ProcessModal';
import ExtendModal from '../ExtendModal';
import TreatmentTransferModal from '../TreatmentTransferModal';
import FacilityTransferModal from '../FacilityTransferModal';
import RoomTransferModal from '../RoomTransferModal';

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Tên', formatter: (r) => r.quarantineForm.requester.fullName },
  {
    Header: 'Ngày/Năm sinh',
    formatter: (r) =>
      r.quarantineForm.requester.dateOfBirth
        ? moment(r.quarantineForm.requester.dateOfBirth).format(
            r.quarantineForm.requester.hasYearOfBirthOnly
              ? 'YYYY'
              : 'DD-MM-YYYY',
          )
        : '',
  },
  {
    Header: 'Địa chỉ',
    formatter: (r) =>
      formatAddressToString(r.quarantineForm.homeRequest?.homeAddress ?? {}),
  },
  {
    Header: 'Mốc thời gian cách ly',
    formatter: ({
      quarantineForm: {
        facilityRequest: { startTime },
      },
    }) => formatToDate(startTime),
  },
  {
    Header: 'Ngày chỉ định',
    formatter: ({
      quarantineForm: {
        facilityRequest: { appointedTime },
      },
    }) => formatToDate(appointedTime),
  },
  {
    Header: 'Ngày tiếp nhận',
    formatter: ({
      quarantineForm: {
        facilityRequest: { takeInTime },
      },
    }) => formatToDate(takeInTime),
  },
  {
    Header: 'Ngày dự kiến kết thúc cách ly',
    formatter: ({
      quarantineForm: {
        facilityRequest: { endTime },
      },
    }) => formatToDate(endTime),
  },
];

const FacilityPeopleInRoomTable = (props) => {
  const { onRefresh } = props;
  const dispatch = useDispatch();
  const {
    selectedFacility,
    facilityInfo,
    selectedRoom,
    selectedRoom: { occupiers: data },
  } = useSelector((s) => s.quarantineFacility);

  const [treatmentTransferModal, setTreatmentTransferModal] = useState(false);
  const [facilityTransferModal, setFacilityTransferModal] = useState(false);
  const [roomTransferModal, setRoomTransferModal] = useState(false);
  const [extendModal, setExtendModal] = useState(false);

  const [profileId, setProfileId] = useState('');
  const [processModal, setProcessModal] = useState(false);
  const handleProcess = async (d) => {
    await dispatch(
      createAssignWithDate({
        ...d,
        profileId,
      }),
    );
    setProfileId('');
    setProcessModal(false);
  };

  const [selectingRow, setSelectingRow] = useState({});

  return (
    <div>
      <DataTable
        columns={columns}
        title="Danh sách đối tượng trong phòng"
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        actions={[
          {
            icon: <FiDownload />,
            title: 'Export danh sách đang cách ly',
            color: 'violet',
            globalAction: true,
            onClick: () =>
              dispatch(
                exportExcel({
                  url: apiLinks.facilities.quarantineFacilities
                    .exportFacilityRooms,
                  params: {
                    facilityId: selectedFacility?.id ?? facilityInfo[0].id,
                    roomId: selectedRoom.id,
                    exportToExcel: true,
                  },
                  fileName: `DS đang cách ly ${
                    selectedFacility?.name ?? facilityInfo[0].name
                  } - ${selectedRoom?.name}`,
                  isQuarantine: true,
                }),
              ),
          },
          {
            icon: <FiCommand />,
            title: 'Chỉ định xét nghiệm',
            color: 'yellow',
            onClick: (r) => {
              setProfileId(r.quarantineForm.requester.profileId);
              setProcessModal(true);
            },
          },
          {
            icon: <FiPlay />,
            title: 'Chuyển sang cách ly điều trị',
            color: 'olive',
            onClick: (row) => {
              setSelectingRow(row);
              setTreatmentTransferModal(true);
            },
          },
          {
            icon: <FiFastForward />,
            title: 'Chuyển khu cách ly mới',
            color: 'olive',
            onClick: (row) => {
              setSelectingRow(row);
              setFacilityTransferModal(true);
            },
          },
          {
            icon: <FiSkipForward />,
            title: 'Chuyển phòng',
            color: 'olive',
            onClick: (row) => {
              setSelectingRow(row);
              setRoomTransferModal(true);
            },
          },
          {
            icon: <FiRepeat />,
            title: 'Gia hạn thời gian cách ly',
            color: 'orange',
            onClick: (row) => {
              setSelectingRow(row);
              setExtendModal(true);
            },
          },
          {
            icon: <FiX />,
            title: 'Kết thúc cách ly',
            color: 'red',
            onClick: (r) =>
              dispatch(
                showConfirmModal('Kết thúc cách ly?', async () => {
                  await dispatch(completeFacility(r.quarantineForm.id));
                }),
              ),
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (r) => {
              window.open(
                `/profile/${r.quarantineForm.requester.profileId}/quarantine`,
                '_blank',
              );
            },
          },
        ]}
      />

      <RoomTransferModal
        open={roomTransferModal}
        onClose={() => setRoomTransferModal(false)}
        onSubmit={onRefresh}
        data={selectingRow}
      />
      <TreatmentTransferModal
        open={treatmentTransferModal}
        onClose={() => setTreatmentTransferModal(false)}
        onSubmit={onRefresh}
        data={selectingRow}
      />
      <FacilityTransferModal
        open={facilityTransferModal}
        onClose={() => setFacilityTransferModal(false)}
        onSubmit={onRefresh}
        data={selectingRow}
      />
      <ExtendModal
        open={extendModal}
        onClose={() => setExtendModal(false)}
        onSubmit={onRefresh}
        data={selectingRow}
      />
      <ProcessModal
        key={processModal ? 'OpenProcessModal' : 'CloseProcessModal'}
        open={processModal}
        onClose={() => setProcessModal(false)}
        onSubmit={handleProcess}
      />
    </div>
  );
};

FacilityPeopleInRoomTable.propTypes = {
  onRefresh: PropTypes.func.isRequired,
};

export default FacilityPeopleInRoomTable;
