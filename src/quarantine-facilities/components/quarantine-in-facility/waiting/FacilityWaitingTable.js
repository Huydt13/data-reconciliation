/* eslint-disable no-nested-ternary */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FiCheck,
  FiCommand,
  FiDownload,
  FiFileText,
  FiUpload,
  FiUserPlus,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';
import {
  getFacilities,
  getFacilityInfo,
  getWaitingList,
} from 'quarantine-facilities/actions/quarantine-facility';
import {
  createAssignWithDate,
  getPrefixes,
  getUnitInfo,
} from 'medical-test/actions/medical-test';
import { exportExcel, importExcel } from 'app/actions/global';

import apiLinks from 'app/utils/api-links';
import { DataTable } from 'app/components/shared';
import { formatAddressToString, formatToDate } from 'app/utils/helpers';

import ProcessModal from 'infection-chain/components/subject/medical-test/ProcessModal';
import SelectFacilitySection from 'quarantine-facilities/components/facilities/SelectFacilitySection';
import TakeInModal from '../TakeInModal';
import CreateProfileFromQuarantineModal from '../CreateProfileFromQuarantineModal';

const FacilityWaitingTable = () => {
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();

  const importLoading = useSelector((s) => s.global.importLoading);
  const exportLoading = useSelector((s) => s.global.exportLoading);

  const {
    facilityInfo,
    selectedFacility,
    waitingListData,
    getWaitingListLoading,
  } = useSelector((s) => s.quarantineFacility);
  const { data, totalPages } = waitingListData;

  const [createProfileModal, setCreateProfileModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectingRow, setSelectingRow] = useState({});
  const [approveModal, setApproveModal] = useState(false);

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
        getWaitingList({
          facilityId: selectedFacility?.id ?? facilityInfo[0].id,
          pageSize,
          pageIndex,
        }),
      );
    }
  }, [dispatch, isAdmin, selectedFacility, facilityInfo, pageSize, pageIndex]);
  useEffect(getData, [getData]);

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
        Header: 'Địa chỉ',
        formatter: (r) =>
          formatAddressToString(
            r.quarantineForm.homeRequest?.homeAddress ?? {},
          ),
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

  const handleWaitingList = useCallback(() => {
    dispatch(
      exportExcel({
        url: apiLinks.facilities.quarantine.exportWaitingList,
        params: { facilityId: selectedFacility?.id ?? facilityInfo[0].id },
        fileName: `DS chờ ${selectedFacility?.name ?? facilityInfo[0].name}`,
        isQuarantine: true,
      }),
    );
  }, [dispatch, selectedFacility, facilityInfo]);

  const component = useMemo(
    () => (
      <DataTable
        showTemplate
        columns={columns}
        title="Danh sách chờ cách ly"
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        pageCount={totalPages}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        loading={getWaitingListLoading || importLoading || exportLoading}
        actions={[
          {
            icon: <FiUpload />,
            title: 'Import danh sách chờ',
            color: 'pink',
            onClick: () => fileRef.current.click(),
            globalAction: true,
          },
          {
            icon: <FiDownload />,
            title: 'Export danh sách chờ',
            color: 'violet',
            onClick: handleWaitingList,
            globalAction: true,
          },
          {
            icon: <FiUserPlus />,
            title: 'Tạo đối tượng cách ly',
            color: 'green',
            onClick: () => setCreateProfileModal(true),
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
            icon: <FiCheck />,
            title: 'Duyệt',
            color: 'green',
            onClick: (r) => {
              setSelectingRow(r);
              setApproveModal(true);
            },
            hidden: isAdmin,
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
      isAdmin,
      data,
      totalPages,
      getWaitingListLoading,
      importLoading,
      exportLoading,
      handleWaitingList,
    ],
  );

  return (
    <div>
      {isAdmin ? (
        <SelectFacilitySection
          isWaiting
          componentLabel="Danh sách chờ cách ly"
          component={component}
        />
      ) : (
        component
      )}

      <TakeInModal
        open={approveModal}
        onClose={() => setApproveModal(false)}
        onSubmit={getData}
        data={selectingRow}
      />

      <CreateProfileFromQuarantineModal
        open={createProfileModal}
        onClose={() => setCreateProfileModal(false)}
        onSubmit={getData}
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

export default FacilityWaitingTable;
