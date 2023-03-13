import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiTrash2,
  FiPlus,
  FiEye,
  FiEdit2,
} from 'react-icons/fi';

import { DataTable } from 'app/components/shared';
import { showConfirmModal } from 'app/actions/global';
import locations from 'app/assets/mock/locations.json';

import MoveQuarantineModal from 'infection-chain/components/subject/quarantine/MoveQuarantineModal';
import {
  selectZone,
  updateZone,
  deleteZone,
  createZone,
  openZoneDetail,
  takeIn,
  moveQuarantine,
  getAllZones,
} from '../../actions/quarantine';
import ZoneModal from './QuarantineZoneModal';
import WaitingSubjectTable from '../waiting/WaitingSubjectTable';
import ApproveSubjectModal from '../waiting/ApproveSubjectModal';
import QuarantineZoneFilter from './QuarantineZoneFilter';

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Loại hình', formatter: (row) => (row.isTreatmentZone ? 'Khu cách ly điều trị' : 'Khu cách ly kiểm dịch') },
  { Header: 'Tên khu', accessor: 'name' },
  { Header: 'Địa chỉ', accessor: 'quarantineAddress' },
  { Header: 'Người quản lý', accessor: 'contactName' },
  { Header: 'Số điện thoại liên hệ', accessor: 'contactPhone' },
  { Header: 'Số phòng', accessor: 'numberOfRoom' },
  { Header: 'Số giường', accessor: 'numberOfBed' },
  { Header: 'Tổng số hiện có', accessor: 'totalQuarantineSubjects' },
  { Header: 'Tổng số chờ', accessor: 'totalWaitingSubjects' },
];

const formattedData = (data) => (data || []).map((e, i) => {
  let formattedFloor = '';
  let formattedBlock = '';
  let formattedStreet = '';
  let formattedWard = '';
  let formattedDistrict = '';
  let formattedProvince = '';

  formattedFloor = e?.address?.floor ? `Tầng ${e?.address?.floor}, ` : '';
  formattedBlock = e?.address?.block ? `Lô ${e?.address?.block}, ` : '';
  formattedStreet = e?.address?.streetHouseNumber
    ? `${e?.address?.streetHouseNumber}, `
    : '';
  formattedProvince = e?.address?.provinceValue
    ? locations?.find((p) => p?.value === e?.address?.provinceValue)?.label
    : '';
  formattedDistrict = (e?.address?.districtValue && e?.address?.provinceValue)
    ? `${locations
      ?.find((p) => p?.value === e?.address?.provinceValue)
      ?.districts?.find((d) => d?.value === e?.address?.districtValue)?.label}, `
    : '';
  formattedWard = (e?.address?.wardValue && e?.address?.provinceValue && e?.address?.districtValue)
    ? `${locations
      ?.find((p) => p?.value === e?.address?.provinceValue)
      ?.districts?.find((d) => d?.value === e?.address?.districtValue)
      ?.wards?.find((w) => w?.value === e?.address?.wardValue)?.label}, `
    : '';
  return {
    ...e,
    index: i + 1,
    quarantineAddress:
      formattedFloor + formattedBlock + formattedStreet
    + formattedWard + formattedDistrict + formattedProvince,
  };
});

const ZoneTable = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    data: {},
  });

  const {
    getAllZonesLoading,
    allZonesData,
    getZonesLoading,
    createZoneLoading,
    updateZoneLoading,
    deleteZoneLoading,
  } = useSelector((state) => state.quarantine);

  const handleRefresh = () => {
    dispatch(getAllZones({
      ...filter,
      isTreatmentZone: filter?.type === 1 || undefined,
      pageIndex,
      pageSize,
    }));
  };


  useEffect(handleRefresh, [
    filter,
    pageSize,
    pageIndex,
  ]);

  const handleOpenModal = (data) => {
    setOpenModal({
      isOpen: true,
      data: data || {},
    });
  };

  const handleCloseModal = () => {
    setOpenModal({
      isOpen: false,
      data: {},
    });
  };

  const handleSubmit = (data) => {
    handleCloseModal();
    const { isTreatmentZone } = data;
    if (data.id) {
      dispatch(updateZone({
        ...data,
        isTreatmentZone: isTreatmentZone === 1,
      })).then(() => {
        handleRefresh();
      });
    } else {
      dispatch(createZone({
        ...data,
        isTreatmentZone: isTreatmentZone === 1,
      })).then(() => {
        handleRefresh();
      });
    }
  };

  const [subject, setSubject] = useState(null);
  const [approveModal, setApproveModal] = useState(false);
  const [moveModal, setMoveModal] = useState(false);
  const [selectingZone, setSelectingZone] = useState(null);

  const handleApprove = (d) => {
    const { roomId, enterRoomDate, useCurrentTime } = d;
    dispatch(takeIn(subject.id, roomId, enterRoomDate, useCurrentTime)).then(() => {
      setApproveModal(false);
      handleRefresh();
    });
  };

  const handleMove = (d) => {
    const {
      newZoneId,
      dateStartedToWait,
      startTime,
      endTime,
    } = d;
    dispatch(moveQuarantine(subject.id, newZoneId, dateStartedToWait, startTime, endTime)).then(() => {
      setMoveModal(false);
      handleRefresh();
    });
  };

  const approveElement = useMemo(() => (
    <ApproveSubjectModal
      key={approveModal ? 'ApproveSubjectModalOpen' : 'ApproveSubjectModalClose'}
      open={approveModal}
      zoneId={selectingZone?.id ?? ''}
      onClose={() => setApproveModal(false)}
      onSubmit={handleApprove}
    />
  // eslint-disable-next-line
  ), [
    approveModal,
    selectingZone,
  ]);

  const moveElement = useMemo(() => (
    <MoveQuarantineModal
      key={moveModal ? 'OpenMoveQuarantineModal' : 'CloseMoveQuarantineModal'}
      open={moveModal}
      subject={subject}
      disabledIds={[selectingZone?.id ?? '']}
      onClose={() => setMoveModal(false)}
      onSubmit={handleMove}
    />

  // eslint-disable-next-line
  ), [
    moveModal,
    subject,
    selectingZone,
  ]);

  const { data, pageCount } = allZonesData;

  return (
    <div>
      <QuarantineZoneFilter onChange={setFilter} />
      <DataTable
        title="Khu cách ly"
        columns={columns}
        data={formattedData(data)}
        loading={getAllZonesLoading || getZonesLoading || updateZoneLoading || deleteZoneLoading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageSize(p.pageSize);
          setPageIndex(p.pageIndex);
        }}
        actions={[
          {
            icon: <FiPlus />,
            title: 'Thêm',
            color: 'green',
            onClick: () => handleOpenModal(),
            globalAction: true,
          },
          {
            icon: <FiEye />,
            title: 'Chi tiết',
            color: 'blue',
            onClick: (row) => {
              dispatch(selectZone(row));
              dispatch(openZoneDetail(true));
            },
          },
          {
            icon: <FiEdit2 />,
            title: 'Sửa',
            color: 'violet',
            onClick: (row) => handleOpenModal(row),
          },
          {
            icon: <FiTrash2 />,
            title: 'Xóa',
            color: 'red',
            onClick: (row) => dispatch(showConfirmModal('Xác nhận xóa?', () => {
              dispatch(deleteZone(row.id)).then(() => {
                handleRefresh();
              });
            })),
          },
        ]}
        subComponent={(row) => (
          <WaitingSubjectTable
            zoneId={row.id}
            zoneName={row.name}
            onApprove={(d) => {
              setSubject(d);
              setApproveModal(true);
              setSelectingZone(row);
            }}
            onMove={(d) => {
              setSubject(d);
              setMoveModal(true);
              setSelectingZone(row);
            }}
            onRefresh={handleRefresh}
          />
        )}
      />

      <ZoneModal
        key={openModal.isOpen ? 'ZoneModalOpen' : 'ZoneModalClose'}
        initialData={openModal.data}
        open={openModal.isOpen}
        loading={createZoneLoading || updateZoneLoading}
        onSubmit={handleSubmit}
        onClose={() => handleCloseModal()}
      />

      {approveElement}
      {moveElement}

    </div>
  );
};

export default ZoneTable;
