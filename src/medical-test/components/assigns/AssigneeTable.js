/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  FiFileText,
  FiPlus,
  FiX,
  FiCommand,
  FiUserPlus,
  FiEdit2,
  FiUpload,
  // FiAlertTriangle,
} from 'react-icons/fi';

import { useSelector, useDispatch } from 'react-redux';
import {
  getAssignees,
  createExamination,
  cancelAssign,
  assignWithCodeOnly,
  createAssignWithProfile,
  createAssignWithDate,
  deleteExamination,
  getExaminationByDetail,
  updateExamination,
} from 'medical-test/actions/medical-test';
import { useAuth } from 'app/hooks';

import apiLinks from 'app/utils/api-links';
import { importExcel, showConfirmModal } from 'app/actions/global';

import { DataTable } from 'app/components/shared';
import { getAssignStatus, getSourceType } from 'infection-chain/utils/helpers';
import { AssignStatuses } from 'infection-chain/utils/constants';
import ProcessModal from 'infection-chain/components/subject/medical-test/ProcessModal';
import MedicalTestModal from 'infection-chain/components/subject/medical-test/MedicalTestModal';

import { formatToYear } from 'app/utils/helpers';

import AssigneeFilter from './AssigneeFilter';
import AssignWithCodeOnlyModal from '../subjects/AssignWithCodeOnlyModal';
import CreateGroupProfileModal from './CreateGroupProfileModal';
import CreateSingleProfileModal from './CreateSingleProfileModal';
import GroupProfileModal from '../examinations/GroupProfileModal';
import DetailExamModal from './DetailExamModal';
import ImportPcrModal from './ImportPcrModal';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Người được xét nghiệm',
    formatter: (row) => `${row.person?.name ?? ''} ${row.instanceTime
        ? moment(row.instanceTime).format('DD-MM-YY HH:mm')
        : ''
      }`,
    cutlength: 50,
  },
  {
    Header: 'Năm sinh',
    formatter: ({ person }) => formatToYear(person?.dateOfBirth),
  },
  { Header: 'Tên cơ sở', formatter: (row) => row.unit.name },
  {
    Header: 'Ngày chỉ định',
    formatter: ({ dateAssigned }) => moment(dateAssigned).format('YYYY') !== '0001'
        ? moment(dateAssigned).format('DD-MM-YYYY')
        : '',
  },
  { Header: 'Nguồn', formatter: (row) => getSourceType(row.source)?.label },
  {
    Header: 'Trạng thái',
    formatter: (row) => getAssignStatus(row.status)?.label,
  },
];

const AssigneeTable = (props) => {
  const { isOld, isWaiting, isTaken, hasImport } = props;

  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [openGroupProfileModal, setOpenGroupProfileModal] = useState(false);

  const [from, setFrom] = useState(moment().format('YYYY-MM-DD'));
  const [to, setTo] = useState(moment().format('YYYY-MM-DD'));
  const [hideDateFilter, setHideDateFilter] = useState(false);

  const {
    unitInfo,
    assigneeList,
    cancelAssignLoading,
    getAssigneesLoading,
    assignWithCodeOnlyLoading,
  } = useSelector((state) => state.medicalTest);
  const { importLoading } = useSelector((s) => s.global);

  const { isAdmin } = useAuth();

  const dispatch = useDispatch();

  const getData = useCallback(() => {
    let isOther = '';
    let status = '';
    let assignFrom = '';
    let assignTo = '';
    if (isTaken) {
      status = AssignStatuses.TAKEN;
      assignFrom = from || filter.assignDateFrom;
      assignTo = to || filter.assignDateTo;
    } else if (isWaiting) {
      isOther = false;
      status = AssignStatuses.CREATE;
      assignFrom = moment().subtract('2', 'days').format('YYYY-MM-DD');
      assignTo = moment().format('YYYY-MM-DD');
    } else if (isOld) {
      isOther = false;
      status = AssignStatuses.CREATE;
      assignTo = moment().subtract('2', 'days').format('YYYY-MM-DD');
    } else {
      isOther = true;
      status = filter.status;
    }
    dispatch(
      getAssignees({
        ...filter,
        isAvailable: true,
        status,
        isOther,
        pageIndex,
        pageSize,
        unitId: isAdmin ? filter.unitId : unitInfo?.id,
        assignDateFrom: assignFrom || filter.assignDateFrom,
        assignDateTo: assignTo || filter.assignDateTo,
      }),
    );
  }, [
    dispatch,
    isAdmin,
    isOld,
    isTaken,
    isWaiting,
    unitInfo,
    filter,
    pageSize,
    pageIndex,
    from,
    to,
  ]);
  useEffect(getData, [getData]);

  const { data, pageCount } = assigneeList;

  const [selectingRow, setSelectingRow] = useState({});

  const [processModal, setProcessModal] = useState(false);
  const [createExamModal, setCreateExamModal] = useState(false);
  const [updateExamModal, setUpdateExamModal] = useState(false);
  const [createSingleProfileModal, setCreateSingleProfileModal] = useState(false);
  const [createGroupProfileModal, setCreateGroupProfileModal] = useState(false);
  const [assignWithCodeOnlyModal, setAssignWithCodeOnlyModal] = useState(false);
  const [detailExamModal, setDetailExamModal] = useState(false);

  const [isImportAssigns, setIsImportAssigns] = useState(false);
  const [isImportExams, setIsImportExams] = useState(false);
  const [isImportPcrModal, setIsImportPcrModal] = useState(false);

  const fileRef = useRef();
  const [selectedFile, setSelectedFile] = useState(undefined);
  useEffect(() => {
    if (selectedFile) {
      const uploadFile = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);
        if (isImportAssigns) {
          await dispatch(
            importExcel({
              url: apiLinks.excel.importAssigns,
              formData,
              isExamination: true,
            }),
          );
        }
        if (isImportExams) {
          await dispatch(
            importExcel({
              url: apiLinks.excel.importExams,
              formData,
              isExamination: true,
            }),
          );
        }
        getData();
      };
      uploadFile();
    }
    fileRef.current.value = '';
    setSelectedFile(undefined);
    setIsImportExams(false);
    setIsImportAssigns(false);
    // eslint-disable-next-line
  }, [dispatch, selectedFile]);

  const handleAssignWithCodeOnly = async (d) => {
    await dispatch(assignWithCodeOnly(d));
    getData();
    setAssignWithCodeOnlyModal(false);
  };

  const handleProcess = (d) => {
    const { unitId, dateAssigned } = d;
    dispatch(
      createAssignWithDate({
        profileId: selectingRow.person.profileId,
        unitId,
        dateAssigned,
      }),
    ).then(() => {
      getData();
      setProcessModal(false);
    });
  };

  const handleSubmit = async (d) => {
    if (createExamModal) {
      const createData = {
        ...d,
        assignId: selectingRow.id,
        reasonLevel1: d.reasonLv1,
        // reasonLevel1 is reasonLevel2 after breaking changes
        reasonLevel2: d.reasonLv1,
        reasonLevel3: d.reasonLv3,
        reasonLv1: undefined,
        reasonLv2: undefined,
        reasonLv3: undefined,
      };
      let newAssign = {};
      if (isTaken) {
        newAssign = await dispatch(
          createAssignWithProfile({
            profileId: selectingRow.person.profileId,
            unitId: unitInfo.id,
          }),
        );
        await dispatch(
          createExamination({
            ...createData,
            assignId: newAssign.id,
          }),
        );
      } else {
        await dispatch(createExamination(createData));
      }
      setCreateExamModal(false);
    } else {
      await dispatch(updateExamination(d));
      setUpdateExamModal(false);
    }
    setSelectingRow(null);
    getData();
  };

  const handleDelete = () => {
    if (selectingRow?.id) {
      dispatch(
        showConfirmModal(
          'Trạng thái sẽ trở về "Sẵn sàng lẫy mẫu", bạn có chắc chắn xóa?',
          () => {
            dispatch(deleteExamination(selectingRow.id)).then(() => {
              setUpdateExamModal(false);
              getData();
            });
          },
        ),
      );
    }
  };

  const title = `Danh sách ${isTaken ? 'đã lấy mẫu' : ''}${isWaiting ? 'sẵn sàng lấy mẫu' : ''
    }${isOld ? 'chỉ định cũ' : ''}${!isTaken && !isWaiting && !isOld ? 'khác' : ''
    }`;

  return (
    <div>
      <AssigneeFilter
        isOld={isOld}
        isTaken={isTaken}
        isWaiting={isWaiting}
        hideDateFilter={hideDateFilter}
        onChange={setFilter}
        onRefresh={getData}
      />
      <DataTable
        // showTemplate={isWaiting || isTaken}
        title={title}
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={
          getAssigneesLoading
          || cancelAssignLoading
          || assignWithCodeOnlyLoading
          || importLoading
        }
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        filterByDate={isTaken}
        onFilterByDateChange={({ from: f, to: t, hideDateFilter: h }) => {
          setFrom(f);
          setTo(t);
          setHideDateFilter(h);
        }}
        actions={[
          // {
          //   icon: <FiUpload />,
          //   title: 'Import chỉ định',
          //   color: 'violet',
          //   onClick: () => {
          //     setIsImportAssigns(true);
          //     fileRef.current.click();
          //   },
          //   globalAction: true,
          //   hidden: !isWaiting,
          // },

          // {
          //   icon: <FiAlertTriangle />,
          //   title: 'Tạo khấn cấp',
          //   color: 'orange',
          //   onClick: () => setAssignWithCodeOnlyModal(true),
          //   globalAction: true,
          //   hidden: !isWaiting,
          // },
          {
            icon: <FiUpload />,
            title: 'Nạp dữ liệu từ Excel',
            color: 'pink',
            onClick: () => setIsImportPcrModal(true),
            globalAction: true,
            hidden: !hasImport,
            // hidden: !isTaken && !isOld,
          },
          {
            icon: <FiUserPlus />,
            title: 'Tạo đối tượng',
            color: 'green',
            globalAction: true,
            hidden: !isWaiting,
            dropdown: true,
            dropdownActions: [
              {
                titleDropdown: 'Mẫu đơn',
                onDropdownClick: () => setCreateSingleProfileModal(true),
              },
              {
                titleDropdown: 'Mẫu gộp',
                onDropdownClick: () => setCreateGroupProfileModal(true),
              },
            ],
          },
          {
            icon: <FiPlus />,
            title: 'Thêm xét nghiệm',
            color: 'green',
            onClick: (row) => {
              setSelectingRow(row);
              setCreateExamModal(true);
            },
            hidden: !isWaiting && !isTaken && !isOld,
          },
          {
            icon: <FiEdit2 />,
            title: 'Sửa xét nghiệm',
            color: 'violet',
            onClick: async (row) => {
              const result = await dispatch(
                getExaminationByDetail(row.examinationId),
              );
              setSelectingRow(result);
              if (!result.isEditable || result.unit?.id !== unitInfo?.id) {
                setDetailExamModal(true);
              } else {
                setUpdateExamModal(true);
              }
            },
            hidden: !isTaken,
            disabled: (row) => !row.examinationId,
          },
          {
            icon: <FiX />,
            title: 'Hủy chỉ định',
            color: 'red',
            onClick: (row) => dispatch(
                showConfirmModal('Hủy chỉ định này?', () => {
                  dispatch(cancelAssign(row.id)).then(getData);
                }),
              ),
            disabled: (row) => row.status !== AssignStatuses.CREATE,
            hidden: !isWaiting && !isOld,
          },
          {
            icon: <FiCommand />,
            title: 'Chỉ định lại',
            color: 'yellow',
            onClick: (row) => {
              setSelectingRow(row);
              setProcessModal(true);
            },
            hidden: !isAdmin || isWaiting || isTaken || isOld,
            disabled: (row) => !(
                row.status === AssignStatuses.REJECT_ASSIGN
                || row.status === AssignStatuses.CANCEL_ASSIGN
              ),
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (row) => {
              window.open(
                `/profile/${row.person?.profileId || row.person?.id
                }/medical-test`,
                '_blank',
              );
            },
            hidden: ({ person }) => person?.isGroup,
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (r) => {
              setSelectingRow(r);
              setOpenGroupProfileModal(true);
            },
            hidden: ({ person }) => !person?.isGroup,
          },
        ]}
      />
      <ImportPcrModal
        open={isImportPcrModal}
        onClose={() => setIsImportPcrModal(false)}
      />
      <CreateSingleProfileModal
        key={
          createSingleProfileModal
            ? 'CreateSingleProfileModalOpen'
            : 'CreateSingleProfileModalClose'
        }
        open={createSingleProfileModal}
        onClose={() => setCreateSingleProfileModal(false)}
        getData={(d) => {
          getData();
          setSelectingRow(d);
          setCreateExamModal(true);
        }}
      />

      <CreateGroupProfileModal
        key={
          createGroupProfileModal
            ? 'CreateGroupProfileModalOpen'
            : 'CreateGroupProfileModalClose'
        }
        open={createGroupProfileModal}
        onClose={() => setCreateGroupProfileModal(false)}
        getData={(d) => {
          getData();
          setSelectingRow(d);
          setCreateExamModal(true);
        }}
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

      <ProcessModal
        key={processModal ? 'OpenProcessModal' : 'CloseProcessModal'}
        open={processModal}
        onClose={() => setProcessModal(false)}
        onSubmit={handleProcess}
      />

      <DetailExamModal
        key={detailExamModal ? 'OpenDetailExamModal' : 'CloseDetailExamModal'}
        open={detailExamModal}
        data={selectingRow}
        onClose={() => {
          setDetailExamModal(false);
        }}
      />

      <MedicalTestModal
        key={
          createExamModal || updateExamModal
            ? 'OpenCreateMedicalTestModal'
            : 'CloseCreateMedicalTestModal'
        }
        open={createExamModal || updateExamModal}
        isUpdate={updateExamModal}
        subject={{
          id: selectingRow?.person?.id,
          information: {
            fullName: selectingRow?.person?.name,
            isGroupProfile: selectingRow?.person?.isGroup,
          },
        }}
        examination={selectingRow}
        handleSubmit={handleSubmit}
        onClose={() => {
          setCreateExamModal(false);
          setUpdateExamModal(false);
        }}
        onDelete={handleDelete}
      />
      <GroupProfileModal
        open={openGroupProfileModal}
        onClose={() => setOpenGroupProfileModal(false)}
        data={selectingRow}
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

AssigneeTable.propTypes = {
  isOld: PropTypes.bool,
  isWaiting: PropTypes.bool,
  isTaken: PropTypes.bool,
};

AssigneeTable.defaultProps = {
  isOld: false,
  isWaiting: false,
  isTaken: false,
};

export default AssigneeTable;
