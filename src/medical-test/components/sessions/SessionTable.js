import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiCheck,
  FiDownload,
  FiDownloadCloud,
  FiEdit2,
  FiFileText,
  FiGrid,
  FiPlus,
  FiTrash2,
  FiUpload,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
// import { useAuth } from 'app/hooks';
import { showConfirmModal } from 'app/actions/global';
import {
  createSession,
  deleteSession,
  exportPlate,
  getSessions,
  updateSession,
  updateSessionResult,
  exportPlateResult,
  sessionTesting,
} from 'medical-test/actions/session';
import {
  getAllExaminationDetailsAvailableForTestSessionList,
  getPrefixes,
  getUnitInfo,
} from 'medical-test/actions/medical-test';

import { useAuth } from 'app/hooks';
import { DataTable } from 'app/components/shared';
import { SessionStatus } from 'infection-chain/utils/constants';
import { getSessionStatus } from 'infection-chain/utils/helpers';
import { formatToTime } from 'app/utils/helpers';

import SessionFilter from './SessionFilter';
import CreateSessionModal from './CreateSessionModal';
import UpdateSessionModal from './UpdateSessionModal';
import SessionUpdateResultModal from './SessionUpdateResultModal';
import SampleImportSessionModal from './SampleImportSessionModal';
import SessionDetailModal from './SessionDetailModal';
import CreateWithSubCodeModal from './CreateWithSubCodeModal';
import UpdateWithSubCodeModal from './UpdateWithSubCodeModal';
import DetailWithSubCodeModal from './DetailWithSubCodeModal';
import CreateSessionWithResultModal from './CreateSessionWithResultModal';
import DetailWithResultModal from './DetailWithResultModal';

const SessionTable = () => {
  const { isMasterXng, isHcdcXng } = useAuth();

  const { unitInfo, getUnitInfoLoading, getExaminationDetailLoading } =
    useSelector((state) => state.medicalTest);

  const isJoiningExam =
    unitInfo?.isTester && unitInfo?.isCollector && unitInfo?.isReceiver;

  const {
    sessionData,
    getSessionsLoading,
    createSessionLoading,
    updateSessionLoading,
    deleteSessionLoading,
    exportPlateLoading,
    exportPlateResultLoading,
    updateSessionResultLoading,
    sessionTestingLoading,
  } = useSelector((state) => state.session);

  const [selectingId, setSelectingId] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [createWithResultModal, setCreateWithResultModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [sampleModal, setSampleModal] = useState(false);

  const [createWithSubCodeModal, setCreateWithSubCodeModal] = useState(false);
  const [updateWithSubCodeModal, setUpdateWithSubCodeModal] = useState(false);
  const [detailWithSubCodeModal, setDetailWithSubCodeModal] = useState(false);

  const [updateResultModal, setUpdateResultModal] = useState(false);
  const [sessionDetailModal, setSessionDetailModal] = useState(false);
  const [detailWithResultModal, setDetailWithResultModal] = useState(false);
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({});

  const getData = useCallback(
    () => dispatch(getAllExaminationDetailsAvailableForTestSessionList()),
    [dispatch]
  );
  useEffect(() => {
    if (!unitInfo) {
      dispatch(getUnitInfo());
    }
    getData();
    // eslint-disable-next-line
  }, [dispatch]);
  const handleRefresh = useCallback(() => {
    dispatch(
      getSessions({
        ...filter,
        pageSize,
        pageIndex,
      })
    );
  }, [dispatch, filter, pageSize, pageIndex]);
  useEffect(handleRefresh, [handleRefresh]);

  const { isAdmin } = useAuth();
  useEffect(() => {
    if (isAdmin) {
      dispatch(getPrefixes());
    }
  }, [isAdmin, dispatch]);
  const columns = useMemo(
    () => [
      { Header: '#', formatter: (row) => row.index },
      { Header: 'Tên', formatter: (row) => row.name },
      { Header: 'Cơ sở xét nghiệm', formatter: (row) => row.unitName },
      {
        Header: 'Số lượng mẫu',
        formatter: (row) => row.count,
      },
      {
        Header: 'Ngày xét nghiệm',
        formatter: (row) => formatToTime(row.dateTesting),
      },
      {
        Header: 'Loại hình',
        formatter: ({ testSessionType }) =>
          testSessionType === 0
            ? 'Thông thường'
            : testSessionType === 1
            ? 'Mã thứ cấp'
            : 'Khác',
      },
      { Header: 'Ghi chú', formatter: (row) => row.description, cutlength: 50 },
      {
        Header: 'Trạng thái',
        formatter: (row) => getSessionStatus(row?.status)?.label,
      },
    ],
    []
  );
  const { data, pageCount } = sessionData;
  const dataTable = useMemo(() => data, [data]);
  const loading =
    getUnitInfoLoading ||
    getExaminationDetailLoading ||
    getSessionsLoading ||
    createSessionLoading ||
    updateSessionLoading ||
    deleteSessionLoading ||
    exportPlateLoading ||
    exportPlateResultLoading ||
    updateSessionResultLoading ||
    sessionTestingLoading;
  const handleSubmit = (d) => {
    const { examinationDetails } = d;
    if (examinationDetails.length === 0) {
      if (!d?.id) {
        toast.warning('Chưa chọn mẫu!');
      } else {
        dispatch(
          showConfirmModal(
            'Không có mẫu nào trong phiên, bạn có muốn xóa phiên?',
            () => {
              dispatch(deleteSession(d.id)).then(() => {
                setCreateModal(false);
                setUpdateModal(false);
              });
            }
          )
        );
      }
    } else {
      dispatch(d.id ? updateSession(d) : createSession(d)).then(() => {
        handleRefresh();
        getData();
        setCreateModal(false);
        setUpdateModal(false);
      });
    }
  };
  const handleUpdateResult = (d) => {
    if (d.examinationDetails.filter((ed) => !ed.result).length > 0) {
      dispatch(
        showConfirmModal(
          'Chưa đủ kết quả của các mẫu, bạn có muốn tiếp tục?',
          () => {
            dispatch(
              updateSessionResult({
                ...d,
                status: SessionStatus.DONE,
              })
            ).then(() => {
              handleRefresh();
              getData();
              setUpdateResultModal(false);
            });
          }
        )
      );
    } else {
      dispatch(
        updateSessionResult({
          ...d,
          status: SessionStatus.DONE,
        })
      ).then(() => {
        handleRefresh();
        getData();
        setUpdateResultModal(false);
      });
    }
  };
  return (
    <>
      <SessionFilter onChange={setFilter} />
      <DataTable
        title='Danh sách phiên xét nghiệm'
        data={(dataTable || []).map((r, i) => ({ ...r, index: i + 1 }))}
        columns={columns}
        loading={loading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            title: 'Upload kết quả',
            icon: <FiUpload />,
            color: 'blue',
            onClick: () => {
              setSampleModal(true);
            },
            globalAction: true,
            hidden: !(unitInfo?.isJoiningExam || unitInfo?.isSelfTest),
          },
          {
            icon: <FiPlus />,
            title: 'Tạo',
            color: 'green',
            globalAction: true,
            hidden: !(unitInfo?.isJoiningExam || unitInfo?.isSelfTest),
            dropdown: true,
            dropdownActions: [
              {
                titleDropdown: 'Tạo thông thường',
                onDropdownClick: () => {
                  setSelectingId('');
                  setCreateModal(true);
                },
              },
              {
                titleDropdown: 'Tạo từ mã thứ cấp',
                onDropdownClick: () => {
                  setCreateWithSubCodeModal(true);
                },
              },
              {
                titleDropdown: 'Tạo và cập nhật kết quả nhanh',
                onDropdownClick: () => {
                  setSelectingId('');
                  setCreateWithResultModal(true);
                },
              },
            ],
          },
          {
            title: 'Tải Excel - Danh sách mẫu',
            icon: <FiDownload />,
            color: 'green',
            onClick: (row) => dispatch(exportPlate(row.id, row.name)),
          },
          {
            title: 'Tải Excel - Kết quả',
            icon: <FiDownloadCloud />,
            color: 'green',
            onClick: (r) => dispatch(exportPlateResult(r.id)),
            hidden: (r) => r.status !== SessionStatus.DONE,
          },
          {
            title: 'Cập nhật khay xét nghiệm',
            icon: <FiGrid />,
            color: 'teal',
            onClick: ({ id, testSessionType }) => {
              setSelectingId(id);
              if (testSessionType !== 1) {
                setUpdateModal(true);
              } else {
                setUpdateWithSubCodeModal(true);
              }
            },
            hidden: (r) => r.status !== SessionStatus.CREATED,
          },
          {
            title: 'Cập nhật kết quả',
            icon: <FiEdit2 />,
            color: 'violet',
            onClick: (row) => {
              setSelectingId(row.id);
              setUpdateResultModal(true);
            },
            hidden: ({ status, testSessionType }) =>
              testSessionType === 2 ||
              status === SessionStatus.CREATED ||
              !(isMasterXng || isHcdcXng || isJoiningExam),
          },
          {
            title: 'Xác nhận xét nghiệm',
            icon: <FiCheck />,
            color: 'violet',
            hidden: (r) => r.status !== SessionStatus.CREATED,
            onClick: ({ id }) =>
              dispatch(
                showConfirmModal('Bạn có chắc chắn?', async () => {
                  await dispatch(sessionTesting(id));
                  handleRefresh();
                })
              ),
          },
          {
            title: 'Chi tiết phiên xét nghiệm',
            icon: <FiFileText />,
            color: 'blue',
            onClick: ({ id, testSessionType }) => {
              setSelectingId(id);
              if (testSessionType === 0) {
                setSessionDetailModal(true);
              } else if (testSessionType === 1) {
                setDetailWithSubCodeModal(true);
              } else {
                setDetailWithResultModal(true);
              }
            },
          },
          {
            title: 'Xóa',
            icon: <FiTrash2 />,
            color: 'red',
            onClick: (row) => {
              dispatch(
                showConfirmModal('Xác nhận xóa?', () => {
                  dispatch(deleteSession(row.id)).then(() => {
                    handleRefresh();
                    getData();
                  });
                })
              );
            },
            disabled: ({ status }) => status === SessionStatus.DONE,
          },
        ]}
      />
      <CreateSessionModal
        key={createModal ? 'OpenSessionModal' : 'CloseSessionModal'}
        open={createModal}
        onClose={() => setCreateModal(false)}
        loading={loading}
        onSubmit={handleSubmit}
      />
      <CreateSessionWithResultModal
        key={
          createWithResultModal
            ? 'OpenCreateWithResultModal'
            : 'CloseCreateWithResultModal'
        }
        open={createWithResultModal}
        onClose={() => setCreateWithResultModal(false)}
        getData={handleRefresh}
      />
      <UpdateSessionModal
        key={updateModal ? 'OpenUpdateSessionModal' : 'CloseUpdateSessionModal'}
        open={updateModal}
        onClose={() => {
          setSelectingId('');
          setUpdateModal(false);
        }}
        id={selectingId}
        loading={loading}
        onSubmit={handleSubmit}
      />
      <SessionUpdateResultModal
        key={
          updateResultModal
            ? 'OpenSessionUpdateResultModal'
            : 'CloseSessionUpdateResultModal'
        }
        open={updateResultModal}
        onClose={() => setUpdateResultModal(false)}
        loading={loading}
        id={selectingId}
        onSubmit={handleUpdateResult}
      />
      <SampleImportSessionModal
        key={sampleModal ? 'OpenSessionSampleModal' : 'CloseSessionSampleModal'}
        open={sampleModal}
        onClose={() => setSampleModal(false)}
        onRefresh={() => {
          handleRefresh();
          getData();
        }}
      />
      <SessionDetailModal
        key={
          sessionDetailModal
            ? 'OpenSessionDetailModal'
            : 'CloseSessionDetailModal'
        }
        open={sessionDetailModal}
        id={selectingId}
        onClose={() => setSessionDetailModal(false)}
      />

      <CreateWithSubCodeModal
        key={
          createWithSubCodeModal
            ? 'OpenCreateWithSubCodeModalModal'
            : 'CloseCreateWithSubCodeModalModal'
        }
        open={createWithSubCodeModal}
        onClose={() => setCreateWithSubCodeModal(false)}
        getData={() => {
          handleRefresh();
          getData();
        }}
      />

      <UpdateWithSubCodeModal
        key={
          updateWithSubCodeModal
            ? 'OpenUpdateWithSubCodeModal'
            : 'CloseUpdateWithSubCodeModal'
        }
        open={updateWithSubCodeModal}
        onClose={() => {
          setSelectingId('');
          setUpdateWithSubCodeModal(false);
        }}
        id={selectingId}
        getData={() => {
          handleRefresh();
          getData();
        }}
      />

      <DetailWithSubCodeModal
        key={
          detailWithSubCodeModal
            ? 'OpenDetailWithSubCodeModal'
            : 'CloseDetailWithSubCodeModal'
        }
        id={selectingId}
        open={detailWithSubCodeModal}
        onClose={() => {
          setSelectingId('');
          setDetailWithSubCodeModal(false);
        }}
      />

      <DetailWithResultModal
        key={
          detailWithResultModal
            ? 'OpenDetailWithResultModal'
            : 'CloseDetailWithResultModal'
        }
        id={selectingId}
        open={detailWithResultModal}
        onClose={() => {
          setSelectingId('');
          setDetailWithResultModal(false);
        }}
      />
    </>
  );
};

export default SessionTable;
