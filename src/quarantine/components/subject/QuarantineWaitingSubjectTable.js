/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useMemo } from 'react';
import {
  FiFastForward,
  FiFileText,
  FiCheck,
} from 'react-icons/fi';
import { Label } from 'semantic-ui-react';
import moment from 'moment';
import locations from 'app/assets/mock/locations.json';

import { useDispatch, useSelector } from 'react-redux';
import {
  getQuarantineWaitingSubjects, takeIn, moveQuarantine,
} from 'quarantine/actions/quarantine';

import { DataTable } from 'app/components/shared';
import { getSubjectType } from 'infection-chain/utils/helpers';
import MoveQuarantineModal from 'infection-chain/components/subject/quarantine/MoveQuarantineModal';
import ApproveSubjectModal from '../waiting/ApproveSubjectModal';
import QuarantineWaitingSubjectFilter from './QuarantineWaitingSubjectFilter';

const columns = [
  {
    Header: 'Loại',
    formatter: (row) => {
      const { label, color } = getSubjectType(row.type);
      return <Label basic color={color} content={label} className="type-label" />;
    },
  },
  { Header: 'Tên', accessor: 'fullName' },
  {
    Header: 'Ngày sinh',
    formatter: (row) => (row.dateOfBirth ? (!row.hasYearOfBirthOnly
      ? moment(row.dateOfBirth).format('DD-MM-YYYY')
      : moment(row.dateOfBirth).format('YYYY')) : 'Chưa xác định'),
  },
  { Header: 'Địa điểm', accessor: 'quarantineName' },
  { Header: 'Địa chỉ', accessor: 'quarantineAddress' },
  { Header: 'Ngày bắt đầu chờ vào khu', formatter: (row) => (moment(row.dateStartedToWait).format('DD-MM-YYYY')) },
];

const formattedData = (data) => (data || []).map((obj) => {
  const e = obj.quarantineZone;
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
    ...obj,
    quarantineName: e?.name,
    quarantineAddress:
      formattedFloor + formattedBlock + formattedStreet
    + formattedWard + formattedDistrict + formattedProvince,
  };
});
const QuarantineWaitingSubjectTable = () => {
  const [filter, setFilter] = useState({});
  const [selected, setSelected] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [approveModal, setApproveModal] = useState(false);
  const [moveModal, setMoveModal] = useState(false);

  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(getQuarantineWaitingSubjects({
      ...filter,
      pageIndex,
      pageSize,
    }));
  };

  useEffect(() => {
    handleRefresh();
  // eslint-disable-next-line
  }, [
    filter,
    pageSize,
    pageIndex,
  ]);

  const {
    getQuarantineWaitingSubjectsLoading,
    quarantineWaitingSubjectList: { data, pageCount },
  } = useSelector((state) => state.quarantine);

  const handleApprove = (d) => {
    const { roomId, enterRoomDate, useCurrentTime } = d;
    dispatch(takeIn(selected.id, roomId, enterRoomDate, useCurrentTime)).then(() => {
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
    dispatch(moveQuarantine(selected.id, newZoneId, dateStartedToWait, startTime, endTime)).then(() => {
      setMoveModal(false);
      handleRefresh();
    });
  };

  const approveElement = useMemo(() => (
    <ApproveSubjectModal
      key={approveModal ? 'ApproveSubjectModalOpen' : 'ApproveSubjectModalClose'}
      open={approveModal}
      zoneId={selected?.quarantineZone.id ?? ''}
      onClose={() => setApproveModal(false)}
      onSubmit={handleApprove}
    />
  // eslint-disable-next-line
  ), [approveModal, selected]);

  const moveElement = useMemo(() => (
    <MoveQuarantineModal
      key={moveModal ? 'OpenMoveQuarantineModal' : 'CloseMoveQuarantineModal'}
      open={moveModal}
      subject={selected}
      disabledIds={[selected?.quarantineZone.id ?? '']}
      onClose={() => setMoveModal(false)}
      onSubmit={handleMove}
    />

  // eslint-disable-next-line
  ), [moveModal, selected]);

  return (
    <div>
      <QuarantineWaitingSubjectFilter onChange={setFilter} />
      <DataTable
        title="Đối tượng chờ cách ly"
        columns={columns}
        data={formattedData(data)}
        loading={getQuarantineWaitingSubjectsLoading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageSize(p.pageSize);
          setPageIndex(p.pageIndex);
        }}
        actions={[
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (row) => {
              window.open(`/profile/${row.profileId}`, '_blank');
            },
            disabled: (r) => !r.profileId,
          },
          {
            icon: <FiCheck />,
            title: 'Chấp nhận',
            color: 'green',
            onClick: (row) => {
              setApproveModal(true);
              setSelected(row);
            },
          },
          {
            icon: <FiFastForward />,
            title: 'Chuyển khu cách ly',
            color: 'orange',
            onClick: (row) => {
              setMoveModal(true);
              setSelected(row);
            },
            disabled: (row) => row.isCompleted,
          },
        ]}
      />

      {approveElement}
      {moveElement}

    </div>

  );
};

export default QuarantineWaitingSubjectTable;
