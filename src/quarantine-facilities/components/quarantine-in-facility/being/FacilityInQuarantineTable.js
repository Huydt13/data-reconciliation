/* eslint-disable no-nested-ternary */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FiCommand,
  FiDownload,
  FiFastForward,
  FiFileText,
  FiPlay,
  FiRepeat,
  FiSkipForward,
  // FiUpload,
  FiX,
} from 'react-icons/fi';

import { toast } from 'react-toastify';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { exportExcel, importExcel, showConfirmModal } from 'app/actions/global';
import { completeFacility } from 'quarantine-facilities/actions/quarantine';
import {
  getFacilities,
  getFacilityInfo,
  getInQuarantine,
} from 'quarantine-facilities/actions/quarantine-facility';
import {
  createAssignWithDate,
  getPrefixes,
  getUnitInfo,
} from 'medical-test/actions/medical-test';
import { DataTable } from 'app/components/shared';

import apiLinks from 'app/utils/api-links';
import { useAuth } from 'app/hooks';
import { formatToDate } from 'app/utils/helpers';

import ProcessModal from 'infection-chain/components/subject/medical-test/ProcessModal';
import SelectFacilitySection from 'quarantine-facilities/components/facilities/SelectFacilitySection';

import ExtendModal from '../ExtendModal';
import CompleteModal from '../CompleteModal';
import TreatmentTransferModal from '../TreatmentTransferModal';
import FacilityTransferModal from '../FacilityTransferModal';
import RoomTransferModal from '../RoomTransferModal';

const FacilityInQuarantineTable = () => {
  const dispatch = useDispatch();

  const importLoading = useSelector((s) => s.global.importLoading);
  const exportLoading = useSelector((s) => s.global.exportLoading);

  const {
    facilityInfo,
    selectedFacility,
    inQuarantineData,
    getInQuarantineLoading,
    completeQuarantineLoading,
  } = useSelector((s) => s.quarantineFacility);
  const { data, totalPages } = inQuarantineData;
  const { isAdmin } = useAuth();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectingRow, setSelectingRow] = useState({});
  const [treatmentTransferModal, setTreatmentTransferModal] = useState(false);
  const [facilityTransferModal, setFacilityTransferModal] = useState(false);
  const [roomTransferModal, setRoomTransferModal] = useState(false);
  const [extendModal, setExtendModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);

  useEffect(() => {
    dispatch(getPrefixes());
    dispatch(getUnitInfo());
    dispatch(getFacilityInfo());
    dispatch(getFacilities({ pageIndex: 0, pageSize: 1000 }));
  }, [dispatch]);

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

  const getData = useCallback(() => {
    if (selectedFacility || (facilityInfo[0] && !isAdmin)) {
      dispatch(
        getInQuarantine({
          facilityId: selectedFacility?.id ?? facilityInfo[0].id,
          pageSize,
          pageIndex,
        }),
      );
    }
  }, [dispatch, facilityInfo, selectedFacility, isAdmin, pageSize, pageIndex]);
  useEffect(getData, [getData]);

  const columns = useMemo(() => {
    const columnsTable = [
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
      { Header: 'Phòng', accessor: 'roomName' },
      {
        Header: 'Ngày dự kiến kết thúc cách ly',
        formatter: ({
          quarantineForm: {
            facilityRequest: { endTime },
          },
        }) => formatToDate(endTime),
      },
    ];
    if (isAdmin) {
      const addingColumns = [
        {
          Header: 'Khu cách ly',
          formatter: (r) => r.quarantineForm.facilityRequest.facility.name,
        },
      ];
      columnsTable.splice(1, 0, ...addingColumns);
    }
    return columnsTable;
  }, [isAdmin]);

  const handleBeingList = useCallback(() => {
    dispatch(
      exportExcel({
        url:
          apiLinks.facilities.quarantine.exportFacilityQuarantineList +
          (selectedFacility?.id ?? facilityInfo[0].id),
        fileName: `DS đang ${selectedFacility?.name ?? facilityInfo[0].name}`,
        isQuarantine: true,
      }),
    );
  }, [dispatch, selectedFacility, facilityInfo]);

  const fileRef = useRef();
  const [selectedFile, setSelectedFile] = useState(undefined);
  useEffect(() => {
    if (selectedFile) {
      const uploadFile = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
          await dispatch(
            importExcel({
              method: 'POST',
              url: apiLinks.facilities.quarantine.importWaitingList,
              formData,
              isQuarantine: true,
            }),
          );
          getData();
        } catch {
          toast.warn('Đã có lỗi xảy ra');
        }
      };
      uploadFile();
    }
    fileRef.current.value = '';
    setSelectedFile(undefined);
    // eslint-disable-next-line
  }, [dispatch, selectedFile]);

  const component = useMemo(
    () => (
      <DataTable
        // showTemplate
        columns={columns}
        title="Danh sách đang cách ly"
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        pageCount={totalPages}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        loading={
          getInQuarantineLoading ||
          completeQuarantineLoading ||
          importLoading ||
          exportLoading
        }
        actions={[
          // {
          //   icon: <FiUpload />,
          //   title: 'Import danh sách đang cách ly',
          //   color: 'pink',
          //   onClick: () => fileRef.current.click(),
          //   globalAction: true,
          // },
          {
            icon: <FiDownload />,
            title: 'Export danh sách đang cách ly',
            color: 'violet',
            onClick: handleBeingList,
            globalAction: true,
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
                  try {
                    await dispatch(completeFacility(r.quarantineForm.id));
                    getData();
                  } catch (e) {
                    toast.warn(
                      'Chưa có kết quả xét nghiệm hoặc kết quả chưa âm tính',
                    );
                  }
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
    ),
    [
      columns,
      completeQuarantineLoading,
      data,
      dispatch,
      getData,
      getInQuarantineLoading,
      totalPages,
      importLoading,
      exportLoading,
      handleBeingList,
    ],
  );

  return (
    <div>
      {isAdmin ? (
        <SelectFacilitySection
          isBeing
          component={component}
          componentLabel="Danh sách đang cách ly"
        />
      ) : (
        component
      )}

      <RoomTransferModal
        open={roomTransferModal}
        onClose={() => setRoomTransferModal(false)}
        onSubmit={getData}
        data={selectingRow}
      />
      <TreatmentTransferModal
        open={treatmentTransferModal}
        onClose={() => setTreatmentTransferModal(false)}
        onSubmit={getData}
        data={selectingRow}
      />
      <FacilityTransferModal
        open={facilityTransferModal}
        onClose={() => setFacilityTransferModal(false)}
        onSubmit={getData}
        data={selectingRow}
      />
      <ExtendModal
        open={extendModal}
        onClose={() => setExtendModal(false)}
        onSubmit={getData}
        data={selectingRow}
      />
      <CompleteModal
        open={completeModal}
        onClose={() => setCompleteModal(false)}
        onSubmit={getData}
        data={selectingRow}
      />
      <ProcessModal
        key={processModal ? 'OpenProcessModal' : 'CloseProcessModal'}
        open={processModal}
        onClose={() => setProcessModal(false)}
        onSubmit={handleProcess}
      />
      <input
        ref={fileRef}
        type="file"
        hidden
        onChange={(e) => setSelectedFile(e.target.files[0])}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </div>
  );
};

export default FacilityInQuarantineTable;
