import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FiTrash2, FiPlus, FiArrowLeft, FiUsers } from 'react-icons/fi';
import { Breadcrumb, Header } from 'semantic-ui-react';

import { InstantSearchBar, DataTable } from 'app/components/shared';
import { filterArray } from 'app/utils/helpers';
import { showConfirmModal } from 'app/actions/global';

import {
  getRooms,
  deleteRoom,
  createRoom,
  openZoneDetail,
  openRoomDetail,
  selectRoom,
} from '../../actions/quarantine';
import CreateRoomModal from './CreateQuarantineRoomModal';

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Tên phòng', accessor: 'name' },
  { Header: 'Số giường trong phòng', accessor: 'numberOfBed' },
  { Header: 'Số người hiện hành', accessor: 'numberOfSubject' },
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
  const [searchRoomValue, setSearchRoomValue] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const {
    roomList,
    selectedZone,
    getRoomsLoading,
    createRoomLoading,
    updateRoomLoading,
    deleteRoomLoading,
  } = useSelector((state) => state.quarantine);

  const handleRefresh = useCallback(() => {
    dispatch(getRooms(selectedZone.id));
  }, [dispatch, selectedZone]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return (
    <div>
      <InstantSearchBar onChange={(value) => setSearchRoomValue(value)} />
      <DataTable
        title={
          <Breadcrumb>
            <Breadcrumb.Section
              link
              onClick={() => dispatch(openZoneDetail(false))}
            >
              <IconWrapper>
                <AbsoulateIcon size={24} />
              </IconWrapper>
            </Breadcrumb.Section>
            <Breadcrumb.Section active>
              <Header as="h3">{`Danh sách phòng tại ${selectedZone.name}`}</Header>
            </Breadcrumb.Section>
          </Breadcrumb>
        }
        columns={columns}
        data={filterArray(roomList, searchRoomValue).map((r, i) => ({
          ...r,
          index: i + 1,
        }))}
        loading={getRoomsLoading || updateRoomLoading || deleteRoomLoading}
        actions={[
          {
            icon: <FiPlus />,
            title: 'Thêm',
            color: 'green',
            onClick: () => setOpenCreateModal(true),
            globalAction: true,
          },
          {
            icon: <FiUsers />,
            title: 'Danh sách đối tượng',
            color: 'blue',
            onClick: (row) => {
              dispatch(selectRoom(row));
              dispatch(openZoneDetail(false));
              dispatch(openRoomDetail(true));
            },
          },
          {
            icon: <FiTrash2 />,
            title: 'Xóa',
            color: 'red',
            onClick: (row) =>
              dispatch(
                showConfirmModal(
                  'Xác nhận xóa phòng của khu vực này?',
                  async () => {
                    await dispatch(deleteRoom(selectedZone.id, row.id));
                    handleRefresh();
                  },
                ),
              ),
          },
        ]}
      />
      <CreateRoomModal
        key={openCreateModal ? 'CreateRoomModalOpen' : 'CreateRoomModalClose'}
        open={openCreateModal}
        loading={createRoomLoading}
        onCreate={(data) => {
          setOpenCreateModal(false);
          dispatch(createRoom(selectedZone.id, data)).then(() =>
            handleRefresh(),
          );
        }}
        onClose={() => setOpenCreateModal(false)}
      />
    </div>
  );
};

export default RoomTable;
