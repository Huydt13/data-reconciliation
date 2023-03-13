/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import {
  FiArrowLeft,
  FiFastForward,
  FiRepeat,
  FiX,
  FiSkipForward,
  FiFileText,
} from 'react-icons/fi';
import { Breadcrumb, Header, Label } from 'semantic-ui-react';

import { InstantSearchBar, DataTable } from 'app/components/shared';
import { filterArray } from 'app/utils/helpers';
import { showConfirmModal } from 'app/actions/global';

import MoveQuarantineModal from 'infection-chain/components/subject/quarantine/MoveQuarantineModal';
import ExtendDurationModal from 'infection-chain/components/subject/quarantine/ExtendDurationModal';
import MoveRoomModal from 'infection-chain/components/subject/quarantine/MoveRoomModal';
import { getSubjectType } from 'infection-chain/utils/helpers';
import {
  openRoomDetail,
  getSubjectInRoom,
  completeQuarantine,
  extendDuration,
  moveQuarantine,
  openZoneDetail,
  moveRoom,
} from '../../actions/quarantine';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Loại',
    formatter: (row) => {
      const { label, color } = getSubjectType(row.type);
      return (
        <Label basic color={color} content={label} className="type-label" />
      );
    },
  },
  { Header: 'Tên', accessor: 'fullName' },
  {
    Header: 'Ngày sinh',
    formatter: (row) =>
      row.dateOfBirth
        ? !row.hasYearOfBirthOnly
          ? moment(row.dateOfBirth).format('DD-MM-YYYY')
          : moment(row.dateOfBirth).format('YYYY')
        : 'Chưa xác định',
  },
  {
    Header: 'Ngày nhận vào phòng',
    formatter: (row) => moment(row.enterRoomDate).format('DD-MM-YYYY'),
  },
  {
    Header: 'Ngày bắt đầu cách ly',
    formatter: (row) => moment(row.startTime).format('DD-MM-YYYY'),
  },
  {
    Header: 'Ngày kết thúc cách ly',
    formatter: (row) => moment(row.endTime).format('DD-MM-YYYY'),
  },
];

const IconWrapper = styled.div`
  position: relative;
  width: 26px;
  height: 26px;
`;

const AbsoulateIcon = styled(FiArrowLeft)`
  position: absolute;
  top: 75%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
`;

const RoomTable = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [extendModal, setExtendModal] = useState(false);
  const [moveRoomModal, setMoveRoomModal] = useState(false);
  const [moveQuarantineModal, setMoveQuarantineModal] = useState(false);
  const [subject, setSubject] = useState(null);
  const {
    subjectsInRoom,
    selectedRoom,
    selectedZone,
    getSubjectsInRoomLoading,
  } = useSelector((state) => state.quarantine);

  const handleRefresh = useCallback(() => {
    dispatch(getSubjectInRoom(selectedZone.id, selectedRoom.id));
  }, [dispatch, selectedZone, selectedRoom]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleComplete = (d) => {
    dispatch(completeQuarantine(d.id)).then(handleRefresh);
  };

  const handleExtendDuration = (d) => {
    dispatch(extendDuration(subject.id, d)).then(() => {
      setExtendModal(false);
      handleRefresh();
    });
  };

  const handleMoveQuarantine = (d) => {
    const { newZoneId, dateStartedToWait, startTime, endTime } = d;
    dispatch(
      moveQuarantine(
        subject.id,
        newZoneId,
        dateStartedToWait,
        startTime,
        endTime,
      ),
    ).then(() => {
      setMoveQuarantineModal(false);
      handleRefresh();
    });
  };

  const handleMoveRoom = (d) => {
    const { newRoomId } = d;
    dispatch(moveRoom(subject.id, selectedZone.id, newRoomId)).then(() => {
      setMoveRoomModal(false);
      handleRefresh();
    });
  };

  return (
    <div>
      <InstantSearchBar onChange={(value) => setSearchValue(value)} />
      <DataTable
        title={
          <Breadcrumb>
            <Breadcrumb.Section
              link
              onClick={() => {
                dispatch(openRoomDetail(false));
                dispatch(openZoneDetail(true));
              }}
            >
              <IconWrapper>
                <AbsoulateIcon size={24} />
              </IconWrapper>
            </Breadcrumb.Section>
            <Breadcrumb.Section active>
              <Header as="h3">{`Danh sách đối tượng tại ${selectedRoom.name}`}</Header>
            </Breadcrumb.Section>
          </Breadcrumb>
        }
        columns={columns}
        data={filterArray(subjectsInRoom, searchValue).map((r, i) => ({
          ...r,
          index: i + 1,
        }))}
        loading={getSubjectsInRoomLoading}
        actions={[
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (r) => window.open(`/profile/${r.profileId}`, '_blank'),
          },
          {
            icon: <FiSkipForward />,
            title: 'Chuyển phòng',
            color: 'green',
            onClick: (row) => {
              setMoveRoomModal(true);
              setSubject(row);
            },
            disabled: (row) => row.isCompleted,
          },
          {
            icon: <FiFastForward />,
            title: 'Chuyển khu cách ly',
            color: 'olive',
            onClick: (row) => {
              setMoveQuarantineModal(true);
              setSubject(row);
            },
            disabled: (row) => row.isCompleted,
          },
          {
            icon: <FiRepeat />,
            title: 'Gia hạn thời gian cách ly',
            color: 'orange',
            onClick: (row) => {
              setExtendModal(true);
              setSubject(row);
            },
            disabled: (row) => row.isCompleted,
          },
          {
            icon: <FiX />,
            title: 'Kết thúc cách ly',
            color: 'red',
            onClick: (row) =>
              dispatch(
                showConfirmModal('Kết thúc cách ly của đôi tượng này?', () =>
                  handleComplete(row),
                ),
              ),
            disabled: (row) => row.isCompleted,
          },
        ]}
      />
      <ExtendDurationModal
        key={
          extendModal ? 'OpenExtendDurationModal' : 'CloseExtendDurationModal'
        }
        open={extendModal}
        subject={subject}
        onSubmit={handleExtendDuration}
        onClose={() => {
          setExtendModal(false);
        }}
      />

      <MoveQuarantineModal
        key={
          moveQuarantineModal
            ? 'OpenMoveQuarantineModal'
            : 'CloseMoveQuarantineModal'
        }
        open={moveQuarantineModal}
        subject={subject}
        disabledIds={[selectedZone.id]}
        onSubmit={handleMoveQuarantine}
        onClose={() => {
          setMoveQuarantineModal(false);
        }}
      />

      <MoveRoomModal
        key={moveRoomModal ? 'OpenMoveRoomModal' : 'CloseMoveRoomModal'}
        open={moveRoomModal}
        subject={subject}
        zoneId={selectedZone.id}
        disabledIds={[selectedRoom.id]}
        onSubmit={handleMoveRoom}
        onClose={() => {
          setMoveRoomModal(false);
        }}
      />
    </div>
  );
};

export default RoomTable;
