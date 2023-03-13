/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import {
  // FiAlertTriangle,
  FiFileText,
  FiUploadCloud,
} from 'react-icons/fi';

import { useSelector, useDispatch } from 'react-redux';
import {
  assignWithCodeOnly,
  getAssignees,
  importInformation,
} from 'medical-test/actions/medical-test';
import { useAuth } from 'app/hooks';
import { showInfoModal } from 'app/actions/global';
import { DataTable } from 'app/components/shared';

import { SourceType } from 'infection-chain/utils/constants';

import AnonymousAssignFilter from './AnonymousAssignFilter';
import AssignWithCodeOnlyModal from '../subjects/AssignWithCodeOnlyModal';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Mã xét nghiệm',
    formatter: ({ code }) => (code?.length === 12 ? <b>{code}</b> : code),
  },
  { Header: 'Tên cơ sở', formatter: (row) => row.unit.name },
];

const AnonymousAssignTable = () => {
  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    assigneeList,
    cancelAssignLoading,
    getAssigneesLoading,
    assignWithCodeOnlyLoading,
    importInformationLoading,
  } = useSelector((state) => state.medicalTest);

  const { isAdmin } = useAuth();

  const dispatch = useDispatch();

  const handleRefresh = () => {
    if (((!isAdmin && filter.unitId) || isAdmin) && !_.isEmpty(filter)) {
      dispatch(
        getAssignees({
          ...filter,
          isUnknown: true,
          pageIndex,
          pageSize,
        }),
      );
    }
  };

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, [filter, pageIndex, pageSize]);

  const { data, pageCount } = assigneeList;

  const [assignWithCodeOnlyModal, setAssignWithCodeOnlyModal] = useState(false);
  const handleAssignWithCodeOnly = async (d) => {
    await dispatch(assignWithCodeOnly(d));
    handleRefresh();
    setAssignWithCodeOnlyModal(false);
  };

  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      dispatch(importInformation(formData)).then(({ completed, failed }) => {
        dispatch(showInfoModal(`Thành công: ${completed}`, failed, () => {}));
        setSelectedFile(null);
        handleRefresh();
      });
    }
    // eslint-disable-next-line
  }, [dispatch, selectedFile]);

  return (
    <div>
      <AnonymousAssignFilter onChange={setFilter} onRefresh={handleRefresh} />
      <DataTable
        title="Danh sách mẫu chưa xác định"
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={
          getAssigneesLoading ||
          cancelAssignLoading ||
          assignWithCodeOnlyLoading ||
          importInformationLoading
        }
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          // {
          //   icon: <FiAlertTriangle />,
          //   title: 'Tạo khấn cấp',
          //   color: 'orange',
          //   onClick: () => setAssignWithCodeOnlyModal(true),
          //   globalAction: true,
          // },
          {
            icon: <FiUploadCloud />,
            title: 'Import Excel',
            color: 'teal',
            onClick: () => fileInputRef.current.click(),
            globalAction: true,
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (row) => {
              window.open(`/profile/${row.personId}/medical-test`, '_blank');
            },
            disabled: (row) => row.source === SourceType.BOOKING,
          },
        ]}
      />
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={(e) => setSelectedFile(e.target.files[0])}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
      <AssignWithCodeOnlyModal
        key={
          assignWithCodeOnlyModal
            ? 'OpenCreateSubjectEmergencyModal'
            : 'CloseCreateSubjectEmergencyModal'
        }
        open={assignWithCodeOnlyModal}
        onClose={() => setAssignWithCodeOnlyModal(false)}
        onSubmit={handleAssignWithCodeOnly}
      />
    </div>
  );
};

export default AnonymousAssignTable;
