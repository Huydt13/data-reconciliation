/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import {
  FiCheck,
  FiDownload,
  FiEdit2,
  FiLock,
  FiPlus,
  FiTrash2,
  FiUnlock,
} from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectRoom,
  getRooms,
  deleteRoom,
  enableRoom,
  disableRoom,
} from 'quarantine-facilities/actions/quarantine-facility';
import { exportExcel, showConfirmModal } from 'app/actions/global';

import apiLinks from 'app/utils/api-links';

import { DataTable } from 'app/components/shared';

import CreateRoomModal from '../CreateRoomModal';
import UpdateRoomModal from '../UpdateRoomModal';

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Tên phòng', accessor: 'name' },
  { Header: 'Số giường', accessor: 'occupancy' },
  { Header: 'Số người đang cách ly', formatter: (r) => r.occupiers.length },
  {
    Header: 'Số người giường còn lại',
    formatter: ({ availableOccupancy }) => availableOccupancy,
  },
  {
    Header: 'Số người giường sẵn sàng',
    formatter: ({ isActive, availableOccupancy }) =>
      isActive ? availableOccupancy : 0,
  },
  {
    Header: 'Đang mở',
    formatter: ({ isActive }) => (isActive ? <FiCheck /> : null),
  },
];
const FacilityRoomListTable = () => {
  const dispatch = useDispatch();

  const exportLoading = useSelector((s) => s.global.exportLoading);

  const {
    facilityInfo,
    selectedFacility,
    roomData: { data, totalPages },
    getRoomsLoading,
    deleteRoomLoading,
    toggleRoomStatusLoading,
  } = useSelector((s) => s.quarantineFacility);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [createRoomModal, setCreateRoomModal] = useState(false);
  const [updateRoomModal, setUpdateRoomModal] = useState(false);
  const [selectingRow, setSelectingRow] = useState({});

  const getData = useCallback(() => {
    if (selectedFacility) {
      dispatch(
        getRooms({
          id: selectedFacility.id,
          pageSize,
          pageIndex,
        }),
      );
    }
  }, [dispatch, selectedFacility, pageSize, pageIndex]);
  useEffect(getData, [getData]);

  return (
    <div>
      <DataTable
        columns={columns}
        title="Danh sách phòng"
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        pageCount={totalPages}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        loading={
          getRoomsLoading ||
          toggleRoomStatusLoading ||
          deleteRoomLoading ||
          exportLoading
        }
        onRowClick={(r) => dispatch(selectRoom(r))}
        actions={[
          {
            icon: <FiDownload />,
            title: 'Export danh sách phòng',
            color: 'violet',
            globalAction: true,
            onClick: () =>
              dispatch(
                exportExcel({
                  url: apiLinks.facilities.quarantineFacilities
                    .exportFacilityRooms,
                  params: {
                    facilityId: selectedFacility?.id ?? facilityInfo[0].id,
                    exportToExcel: true,
                  },
                  fileName: `DS phòng ${
                    selectedFacility?.name ?? facilityInfo[0].name
                  }`,
                  isQuarantine: true,
                }),
              ),
          },
          {
            title: 'Thêm phòng',
            color: 'green',
            icon: <FiPlus />,
            onClick: () => {
              setCreateRoomModal(true);
              setSelectingRow({});
            },
            globalAction: true,
          },
          {
            title: 'Khóa phòng',
            icon: <FiLock />,
            onClick: async (r) => {
              await dispatch(
                disableRoom({ facilityId: selectedFacility.id, roomId: r.id }),
              );
              getData();
            },
            disabled: ({ isActive }) => !isActive,
          },
          {
            title: 'Mở phòng',
            icon: <FiUnlock />,
            onClick: async (r) => {
              await dispatch(
                enableRoom({ facilityId: selectedFacility.id, roomId: r.id }),
              );
              getData();
            },
            disabled: ({ isActive }) => isActive,
          },
          {
            title: 'Cập nhật thông tin phòng',
            color: 'violet',
            icon: <FiEdit2 />,
            onClick: (r) => {
              setUpdateRoomModal(true);
              setSelectingRow(r);
            },
          },
          {
            title: 'Xoá phòng',
            color: 'red',
            icon: <FiTrash2 />,
            onClick: (row) =>
              dispatch(
                showConfirmModal('Xác nhận xóa?', () =>
                  dispatch(deleteRoom(selectedFacility.id, row.id)).then(
                    getData,
                  ),
                ),
              ),
          },
        ]}
      />

      <CreateRoomModal
        open={createRoomModal}
        onClose={() => setCreateRoomModal(false)}
        onSubmit={getData}
      />

      <UpdateRoomModal
        open={updateRoomModal}
        onClose={() => setUpdateRoomModal(false)}
        onSubmit={getData}
        data={selectingRow}
      />
    </div>
  );
};

export default FacilityRoomListTable;
