/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
  FiEdit2, FiFastForward, FiFileText, FiRepeat, FiX,
} from 'react-icons/fi';
import { Label } from 'semantic-ui-react';
import moment from 'moment';

import locations from 'app/assets/mock/locations.json';

import { useDispatch, useSelector } from 'react-redux';
import {
  getQuarantineSubjects,
  completeQuarantine,
  extendDuration,
  editHistory,
  moveQuarantine,
} from 'quarantine/actions/quarantine';

import { DataTable } from 'app/components/shared';
import { showConfirmModal } from 'app/actions/global';

import EditHistoryModal from 'infection-chain/components/subject/quarantine/EditHistoryModal';
import ExtendDurationModal from 'infection-chain/components/subject/quarantine/ExtendDurationModal';
import MoveQuarantineModal from 'infection-chain/components/subject/quarantine/MoveQuarantineModal';
import { getSubjectType } from 'infection-chain/utils/helpers';

import CompleteQuarantineModal from 'infection-chain/components/subject/quarantine/CompleteQuarantineModal';
import QuarantineSubjectFilter from './QuarantineSubjectFilter';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Loại',
    formatter: (row) => {
      const { label, color } = getSubjectType(row.subject.type);
      return (
        <Label basic color={color} content={label} className="type-label" />
      );
    },
  },
  { Header: 'Tên', formatter: (row) => row.subject.information.fullName },
  {
    Header: 'Ngày sinh',
    formatter: (row) => (row?.subject?.information.dateOfBirth
      ? !row?.subject?.information.hasYearOfBirthOnly
        ? moment(row?.subject?.information.dateOfBirth).format('DD-MM-YY')
        : moment(row?.subject?.information.dateOfBirth).format('YYYY')
      : 'Chưa xác định'),
  },
  {
    Header: 'Hình thức',
    formatter: (row) => (row.type === 1 ? 'Tại khu cách ly' : 'Tại nhà'),
  },
  {
    Header: 'Địa điểm',
    formatter: (row) => (row.type === 1 ? row.quarantineName : row.address?.locationType),
  },
  {
    Header: 'Địa chỉ',
    formatter: (row) => (row.type === 1 ? row.quarantineAddress || '' : row.homeAddress || ''),
  },
  {
    Header: 'Ngày bắt đầu',
    formatter: (row) => moment(row.startTime).format('DD-MM-YY'),
  },
  {
    Header: 'Ngày kết thúc',
    formatter: (row) => moment(row.endTime).format('DD-MM-YY'),
  },
  {
    Header: 'Ngày nhận vào phòng',
    formatter: (row) => (row.enterRoomDate ? moment(row.enterRoomDate).format('DD-MM-YY') : null),
  },
  {
    Header: 'Trạng thái',
    formatter: (row) => (row.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'),
  },
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
  formattedDistrict = e?.address?.districtValue && e?.address?.provinceValue
    ? `${
            locations
              ?.find((p) => p?.value === e?.address?.provinceValue)
              ?.districts?.find((d) => d?.value === e?.address?.districtValue)
              ?.label
    }, `
    : '';
  formattedWard = e?.address?.wardValue
      && e?.address?.provinceValue
      && e?.address?.districtValue
    ? `${
            locations
              ?.find((p) => p?.value === e?.address?.provinceValue)
              ?.districts?.find((d) => d?.value === e?.address?.districtValue)
              ?.wards?.find((w) => w?.value === e?.address?.wardValue)?.label
    }, `
    : '';
  const result = {
    ...e,
    index: i + 1,
    homeAddress:
        formattedFloor
        + formattedBlock
        + formattedStreet
        + formattedWard
        + formattedDistrict
        + formattedProvince,
    quarantineAddress: e?.quarantineZone?.address?.streetHouseNumber ?? '',
    quarantineName: e?.quarantineZone?.name ?? '',
  };
  return result;
});

const QuarantineSubjectTable = () => {
  const [filter, setFilter] = useState({});
  const [selected, setSelected] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [editModal, setEditModal] = useState(false);
  const [extendModal, setExtendModal] = useState(false);
  const [moveQuarantineModal, setMoveQuarantineModal] = useState(false);
  const [completeQuarantineModal, setCompleteQuarantineModal] = useState(false);

  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(
      getQuarantineSubjects({
        ...filter,
        pageIndex,
        pageSize,
      }),
    );
  };

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, [filter, pageSize, pageIndex]);

  const {
    availableRoomsList,
    getQuarantineSubjectsLoading,
    quarantineSubjectList: { data, pageCount },
  } = useSelector((state) => state.quarantine);

  const handleComplete = async (d) => {
    switch (d.type) {
      // completed quarantine
      case 0: {
        await dispatch(
          completeQuarantine(selected.subjectId, {
            startTime: null,
            endTime: null,
            quarantineHomeAddress: null,
          }),
        );
        break;
      }
      // home quarantine
      case 1: {
        await dispatch(
          completeQuarantine(selected.subjectId, d),
        );
        break;
      }
      default:
        break;
    }
    setCompleteQuarantineModal(false);
    setSelected(null);
    handleRefresh();
  };

  const handleExtendDuration = (d) => {
    dispatch(extendDuration(selected.subjectId, d)).then(() => {
      setExtendModal(false);
      handleRefresh();
    });
  };

  const handleEditHistory = (d) => {
    dispatch(editHistory(selected.subjectId, d)).then(() => {
      setEditModal(false);
      handleRefresh();
    });
  };

  const handleSubmitEditHistory = (d) => {
    if (availableRoomsList.some((r) => r.id === d.roomId)) {
      handleEditHistory(d);
    } else {
      dispatch(
        showConfirmModal(
          'Phòng này đã đủ người, vẫn thêm đối tượng vào phòng?',
          () => handleEditHistory(d),
        ),
      );
    }
  };

  const handleMoveQuarantine = (d) => {
    const {
      newZoneId, dateStartedToWait, startTime, endTime,
    } = d;
    dispatch(
      moveQuarantine(
        selected.subjectId,
        newZoneId,
        dateStartedToWait,
        startTime,
        endTime,
      ),
    ).then(() => {
      setMoveQuarantineModal(false);
      setSelected(null);
      handleRefresh();
    });
  };

  return (
    <div>
      <QuarantineSubjectFilter onChange={setFilter} />
      <DataTable
        title="Đối tượng đang cách ly"
        columns={columns}
        data={formattedData(data)}
        loading={getQuarantineSubjectsLoading}
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
            onClick: (r) => window.open(`/profile/${r.subject.profileId}`, '_blank'),
            disabled: (r) => !r.subject.profileId,
          },
          {
            icon: <FiEdit2 />,
            title: 'Cập nhật',
            color: 'violet',
            onClick: (row) => {
              dispatch(
                showConfirmModal(
                  'Thay đổi này có thể sẽ thay đổi toàn bộ hệ thống, bạn có muốn tiếp tục?',
                  () => {
                    setSelected(row);
                    setEditModal(true);
                  },
                ),
              );
            },
          },
          {
            icon: <FiFastForward />,
            title: 'Chuyển khu cách ly',
            color: 'olive',
            onClick: (row) => {
              setSelected(row);
              setMoveQuarantineModal(true);
            },
            disabled: (row) => row.isCompleted,
          },
          {
            icon: <FiRepeat />,
            title: 'Gia hạn thời gian cách ly',
            color: 'orange',
            onClick: () => setExtendModal(true),
            disabled: (row) => row.isCompleted,
          },
          {
            icon: <FiX />,
            title: 'Kết thúc cách ly',
            color: 'red',
            onClick: (row) => {
              setSelected(row);
              setCompleteQuarantineModal(true);
            },
            disabled: (row) => row.isCompleted,
          },
        ]}
      />

      <EditHistoryModal
        key={editModal ? 'OpenEditHistoryModal' : 'CloseEditHistoryModal'}
        open={editModal}
        subject={selected?.subject}
        initialData={selected}
        onSubmit={handleSubmitEditHistory}
        onClose={() => {
          setEditModal(false);
        }}
      />

      <ExtendDurationModal
        key={
          extendModal ? 'OpenExtendDurationModal' : 'CloseExtendDurationModal'
        }
        open={extendModal}
        subject={selected?.subject}
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
        disabledIds={[selected?.quarantineZoneId] ?? []}
        subject={selected?.subject}
        onSubmit={handleMoveQuarantine}
        onClose={() => {
          setMoveQuarantineModal(false);
        }}
      />

      <CompleteQuarantineModal
        key={
          completeQuarantineModal
            ? 'OpenCompleteQuarantineModal'
            : 'CloseCompleteQuarantineModal'
        }
        open={completeQuarantineModal}
        onSubmit={handleComplete}
        onClose={() => {
          setCompleteQuarantineModal(false);
        }}
      />
    </div>
  );
};

export default QuarantineSubjectTable;
