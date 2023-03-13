import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FiFastForward,
  FiRepeat,
  FiX,
  FiEdit2,
  FiCommand,
} from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';

import moment from 'moment';

import locations from 'app/assets/mock/locations.json';
import { DataTable } from 'app/components/shared';

import { showConfirmModal } from 'app/actions/global';
import {
  getQuarantine,
  completeQuarantine,
  moveQuarantine,
  extendDuration,
  editHistory,
  getZones,
} from 'quarantine/actions/quarantine';
import {
  getSubjectRelated,
  processSubject,
} from 'infection-chain/actions/subject';

import SubjectHomeModal from 'infection-chain/components/process/SubjectHomeModal';
import SubjectQuarantineZoneModal from 'infection-chain/components/process/SubjectQuarantineZoneModal';
import SubjectTreatmentZoneModal from 'infection-chain/components/process/SubjectTreatmentZone';
import { ProcessType, CreateFromType } from 'infection-chain/utils/constants';

import MoveQuarantineModal from './MoveQuarantineModal';
import ExtendDurationModal from './ExtendDurationModal';
import EditHistoryModal from './EditHistoryModal';
import CompleteQuarantineModal from './CompleteQuarantineModal';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Hình thức',
    formatter: (row) => (row.type === 1 ? 'Tại khu cách ly' : 'Tại nhà'),
  },
  {
    Header: 'Địa điểm',
    formatter: (row) =>
      row.type === 1 ? row.quarantineName : row.address?.locationType,
  },
  {
    Header: 'Địa chỉ',
    formatter: (row) =>
      row.type === 1 ? row.quarantineAddress || '' : row.homeAddress || '',
  },
  {
    Header: 'Ngày bắt đầu',
    formatter: (row) =>
      row.startTime ? moment(row.startTime).format('DD-MM-YYYY') : null,
  },
  {
    Header: 'Ngày kết thúc',
    formatter: (row) =>
      row.endTime ? moment(row.endTime).format('DD-MM-YYYY') : null,
  },
  {
    Header: 'Ngày nhận vào phòng',
    formatter: (row) =>
      row.enterRoomDate ? moment(row.enterRoomDate).format('DD-MM-YYYY') : null,
  },
  {
    Header: 'Trạng thái',
    formatter: (row) => (row.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'),
  },
];

const formattedData = (data) =>
  (data || []).map((e, i) => {
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
    formattedDistrict =
      e?.address?.districtValue && e?.address?.provinceValue
        ? `${
            locations
              ?.find((p) => p?.value === e?.address?.provinceValue)
              ?.districts?.find((d) => d?.value === e?.address?.districtValue)
              ?.label
          }, `
        : '';
    formattedWard =
      e?.address?.wardValue &&
      e?.address?.provinceValue &&
      e?.address?.districtValue
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
        formattedFloor +
        formattedBlock +
        formattedStreet +
        formattedWard +
        formattedDistrict +
        formattedProvince,
      quarantineAddress: e?.quarantineZone?.address?.streetHouseNumber ?? '',
      quarantineName: e?.quarantineZone?.name ?? '',
    };
    return result;
  });

const QuarantineTable = (props) => {
  const { profileId } = props;
  const dispatch = useDispatch();
  const { subjectRelated, getSubjectRelatedLoading: loading } = useSelector(
    (s) => s.subject,
  );
  const getData = useCallback(() => {
    dispatch(getSubjectRelated(profileId));
  }, [dispatch, profileId]);
  useEffect(getData, [getData]);

  const [subject, setSubject] = useState(subjectRelated);

  useEffect(() => {
    setSubject(subjectRelated);
  }, [subjectRelated]);

  const [selected, setSelected] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [extendModal, setExtendModal] = useState(false);
  const [moveQuarantineModal, setMoveQuarantineModal] = useState(false);
  const [completeQuarantineModal, setCompleteQuarantineModal] = useState(false);

  const { quarantineList, getQuarantineLoading, availableRoomsList } =
    useSelector((state) => state.quarantine);

  const { data, pageCount } = quarantineList ?? { data: [], pageCount: 0 };

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [modal, setModal] = useState({
    home: false,
    quarantineZone: false,
    treatmentZone: false,
  });

  const handleRefresh = () => {
    if (subject?.id) {
      dispatch(
        getQuarantine({
          subjectId: subject?.id,
          pageIndex,
          pageSize,
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(getZones());
  }, [dispatch]);

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, [subject, pageSize, pageIndex]);

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
        await dispatch(completeQuarantine(selected.subjectId, d));
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
    dispatch(extendDuration(subject?.id, d)).then(() => {
      setExtendModal(false);
      handleRefresh();
    });
  };

  const handleEditHistory = (d) => {
    dispatch(editHistory(subject?.id, d)).then(() => {
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
    const { newZoneId, dateStartedToWait, startTime, endTime } = d;
    dispatch(
      moveQuarantine(
        subject?.id,
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

  const dropdownActions = useMemo(() => {
    if (subject?.type === 0) {
      return [
        {
          titleDropdown: 'Xử lý tại cơ sở điều trị',
          onDropdownClick: () => setModal({ treatmentZone: true }),
        },
      ];
    }
    return [
      {
        titleDropdown: 'Xử lý tại nhà',
        onDropdownClick: () => setModal({ home: true }),
      },
      {
        titleDropdown: 'Xử lý tại khu cách ly',
        onDropdownClick: () => setModal({ quarantineZone: true }),
      },
    ];
  }, [subject]);

  const handleSubmit = (d, t) => {
    // process
    dispatch(
      processSubject({
        ...d,
        subjectId: subject?.id,
        type: t,
      }),
    ).then(() => {
      setModal({
        home: false,
        quarantineZone: false,
        treatmentZone: false,
      });
      handleRefresh();
    });
  };

  return (
    <div>
      <DataTable
        title="Hồ sơ cách ly"
        columns={columns}
        data={formattedData(data)}
        loading={getQuarantineLoading || loading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiCommand />,
            title: 'Chỉ định cách ly',
            color: 'yellow',
            onClick: () => {
              setMoveQuarantineModal(true);
            },
            globalAction: true,
            dropdown: true,
            dropdownActions,
            disabled:
              pageCount !== 0 ||
              subject?.createFromType !== CreateFromType.INFECTIONCHAIN,
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
            // disabled: (row) => row.isCompleted,
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
        subject={subject}
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
        disabledIds={[selected?.quarantineZoneId] ?? []}
        subject={subject}
        onSubmit={handleMoveQuarantine}
        onClose={() => {
          setMoveQuarantineModal(false);
        }}
      />

      <SubjectHomeModal
        open={modal.home}
        onClose={() => setModal({ home: false })}
        onSubmit={(d) => handleSubmit(d, ProcessType.HOME)}
      />
      <SubjectQuarantineZoneModal
        open={modal.quarantineZone}
        onClose={() => setModal({ quarantineZone: false })}
        onSubmit={(d) => handleSubmit(d, ProcessType.QUARANTINE_ZONE)}
      />
      <SubjectTreatmentZoneModal
        open={modal.treatmentZone}
        onClose={() => setModal({ treatmentZone: false })}
        onSubmit={(d) => handleSubmit(d, ProcessType.TREATMENT_ZONE)}
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

QuarantineTable.propTypes = {
  profileId: PropTypes.number,
};

QuarantineTable.defaultProps = {
  profileId: 0,
};

export default QuarantineTable;
