/* eslint-disable no-nested-ternary */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FiCommand, FiDownload, FiFileText } from 'react-icons/fi';

import moment from 'moment';
import { useAuth } from 'app/hooks';

import { useDispatch, useSelector } from 'react-redux';
import {
  getFacilities,
  getFacilityInfo,
  getCompleted,
} from 'quarantine-facilities/actions/quarantine-facility';
import {
  createAssignWithDate,
  getPrefixes,
  getUnitInfo,
} from 'medical-test/actions/medical-test';
import { DataTable } from 'app/components/shared';
import { formatAddressToString, formatToDate } from 'app/utils/helpers';

import ProcessModal from 'infection-chain/components/subject/medical-test/ProcessModal';
import SelectFacilitySection from 'quarantine-facilities/components/facilities/SelectFacilitySection';
import { exportExcel, importExcel } from 'app/actions/global';
import apiLinks from 'app/utils/api-links';

const FacilityCompletedTable = () => {
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();

  const importLoading = useSelector((s) => s.global.importLoading);
  const exportLoading = useSelector((s) => s.global.exportLoading);

  const { facilityInfo, selectedFacility, completedData, getCompletedLoading } =
    useSelector((s) => s.quarantineFacility);
  const { data, totalPages } = completedData;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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
        getCompleted({
          facilityId: selectedFacility?.id ?? facilityInfo[0].id,
          pageSize,
          pageIndex,
        }),
      );
    }
  }, [dispatch, isAdmin, facilityInfo, selectedFacility, pageSize, pageIndex]);
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
        Header: 'Địa chỉ',
        formatter: (r) =>
          formatAddressToString(r.quarantineForm.homeRequest.homeAddress),
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
      {
        Header: 'Ngày kết thúc cách ly',
        formatter: ({
          quarantineForm: {
            facilityRequest: { actualEndTime },
          },
        }) => formatToDate(actualEndTime),
      },
    ];
    if (isAdmin) {
      const addingColumns = [
        { Header: 'Khu cách ly', accessor: 'quarantineName' },
      ];
      columnsTable.splice(1, 0, ...addingColumns);
    }
    return columnsTable;
  }, [isAdmin]);

  const handleCompletedList = useCallback(() => {
    dispatch(
      exportExcel({
        url:
          apiLinks.facilities.quarantine.exportCompletedQuarantineList +
          (selectedFacility?.id ?? facilityInfo[0].id),
        fileName: `DS kết thúc ${
          selectedFacility?.name ?? facilityInfo[0].name
        }`,
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
        await dispatch(
          importExcel({
            method: 'POST',
            url: apiLinks.facilities.quarantine.importWaitingList,
            formData,
          }),
        );
        getData();
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
        title="Danh sách đã kết thúc cách ly"
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        pageCount={totalPages}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        loading={getCompletedLoading || importLoading || exportLoading}
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
            title: 'Export danh sách kết thúc cách ly',
            color: 'violet',
            onClick: handleCompletedList,
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
      data,
      getCompletedLoading,
      totalPages,
      importLoading,
      exportLoading,
      handleCompletedList,
    ],
  );

  return (
    <div>
      {isAdmin ? (
        <SelectFacilitySection
          isCompleted
          componentLabel="Danh sách kết thúc cách ly"
          component={component}
        />
      ) : (
        component
      )}

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

export default FacilityCompletedTable;
