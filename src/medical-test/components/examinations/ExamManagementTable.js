/* eslint-disable react/prop-types */
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Header, Label } from 'semantic-ui-react';
import {
  FiFileText,
  FiEdit2,
  FiDownload,
  FiFile,
  FiRefreshCw,
  FiUpload,
  FiX,
} from 'react-icons/fi';

import { toast } from 'react-toastify';

import { useSelector, useDispatch } from 'react-redux';
import {
  getExaminationDetail,
  getDiseases,
  getDiseaseSamples,
  getExaminationTypes,
  getPrefixes,
  getUnitTypes,
  getUnitInfo,
  exportExamFile,
  exportByTaken,
  exportExaminationResult,
  exportExaminationResultHCDC,
  exportExaminationFile,
  exportByRange,
  exportByDateReceived,
  changeProfile,
  uploadProfilesFromExcel,
} from 'medical-test/actions/medical-test';

import apiLinks from 'app/utils/api-links';
import { useAuth } from 'app/hooks';
import {
  importExcel,
  showConfirmModal,
  showErrorModal,
} from 'app/actions/global';
import { DataTable } from 'app/components/shared';

import {
  deburr,
  formatToTime,
  renderExaminationResult,
} from 'app/utils/helpers';
import { getImportantType } from 'infection-chain/utils/helpers';
import {
  SAMPLE_FILTER_TYPE,
  SAMPLE_SUB_FILTER,
} from 'medical-test/utils/constants';

import UpdateExamModal from './UpdateExamModal';
import SampleExaminationExcelModal from './SampleExaminationExcelModal';
import ExportExaminationResultModal from './ExportExaminationResultModal';
import ExportExamBookModal from './ExportExamBookModal';
import ExportExamByTakenModal from './ExportExamByTakenModal';
import ExportRangeModal from './ExportRangeModal';
import ExportReceiveModal from './ExportReceiveModal';
import ChangeProfileModal from './ChangeProfileModal';
import FindProfileFromExcelModal from './FindProfileFromExcelModal';
import ExportResultFromExcelModal from './ExportResultFromExcelModal';
import ExaminationDetailsFilter from '../transports/ExaminationDetailsFilter';
import GroupProfileModal from './GroupProfileModal';
import ExportAllExamModal from './ExportAllExamModal';
import ExportStatisticExaminationModal from './ExportStatisticExaminationModal';
import ExportStatisticExaminationByCodesModal from './ExportStatisticExaminationByCodesModal';
import UnsatisfactorySampleModal from './UnsatisfactorySampleModal';

const columns = [
  { Header: '#', accessor: 'idx' },
  {
    Header: 'Mã',
    accessor: 'code',
    copiable: true,
    formatter: ({ importantValue, code }) => (
      <Label size='small' basic color={getImportantType(importantValue)?.color}>
        {code.length < 10
          ? code
          : code.substring(3, 6).concat(code.substring(8))}
      </Label>
    ),
  },
  {
    Header: 'Họ và tên',
    formatter: (row) => row?.person?.name,
    cutlength: 50,
  },
  {
    Header: 'Thông tin lấy mẫu',
    formatter: ({ unitTaken, dateTaken }) => (
      <div>
        <Header sub>{unitTaken?.name}</Header>
        <span>{formatToTime(dateTaken)}</span>
      </div>
    ),
  },
  {
    Header: 'Mẫu',
    formatter: ({ diseaseSample, feeType, isGroup }) => (
      <div>
        <Header sub>{diseaseSample?.name}</Header>
        <span>
          {feeType === 0 ? 'Không thu phí | ' : 'Thu phí | '}
          {isGroup ? 'Mẫu gộp' : 'Mẫu đơn'}
        </span>
      </div>
    ),
  },
  {
    Header: 'Thông tin xét nghiệm',
    formatter: ({ unitName, resultDate }) => (
      <div>
        <Header sub>{unitName}</Header>
        <span>{formatToTime(resultDate)}</span>
      </div>
    ),
  },
  {
    Header: 'Kết quả',
    formatter: ({
      result,
      cT_E: e,
      cT_N: n,
      cT_RdRp: r,
      orF1ab: o,
      index: i,
    }) =>
      result ? (
        <div>
          <Header sub>{renderExaminationResult(result)}</Header>
          {(deburr(result) === deburr('Dương tính') ||
            deburr(result) === deburr('Nghi ngờ')) && (
            <span>
              {`CT N: ${n ?? ''} | CT E: ${e ?? ''} | CT RdRp: ${
                r ?? ''
              } | CT ORF1ab: ${o ?? ''} | Index(0.5-150):${i ?? ''}`}
            </span>
          )}
        </div>
      ) : (
        ''
      ),
  },
];

const ExamManagementTable = (props) => {
  const {
    isTakenUnit,
    isReceivedUnit,
    isWaitingSample,
    isProcessedSample,
    isUnQualifySample,
  } = props;

  const dispatch = useDispatch();

  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [from, setFrom] = useState(
    moment().format('YYYY-MM-DDT00:00:00+07:00')
  );
  const [to, setTo] = useState(moment().format('YYYY-MM-DDT23:59:59+07:00'));
  const [hideDateFilter, setHideDateFilter] = useState(false);

  const [updateExaminationModal, setUpdateExaminationModal] = useState(false);
  const [sampleModal, setSampleModal] = useState(false);
  const [exportExamBookModal, setExportExamBookModal] = useState(false);
  const [exportExamByTakenModal, setExportExamByTakenModal] = useState(false);
  const [exportRange, setExportRange] = useState(false);
  const [exportReceive, setExportReceive] = useState(false);
  const [exportResultFromExcelModal, setExportResultFromExcelModal] =
    useState(false);
  const [openExportExcelModal, setOpenExportExcelModal] = useState(false);
  const [exportAll, setExportAll] = useState(false);
  const [exportStatistic, setExportStatistic] = useState(false);
  const [exportStatisticByCodes, setExportStatisticByCodes] = useState(false);

  const [quickUpdateResult, setQuickUpdateResult] = useState(false);

  const [exportOneUnit, setExportOneUnit] = useState(true);
  const [selectingExamination, setSelectingExamination] = useState(undefined);

  const [selected, setSelected] = useState(null);
  const [openGroupProfileModal, setOpenGroupProfileModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(undefined);
  const fileInputRef = useRef();
  const [changeProfileModal, setChangeProfileModal] = useState(false);

  const [markAsUnsatisfactorySample, setMarkAsUnsatisfactorySample] =
    useState(false);
  const [unMarkAsUnsatisfactorySample, setUnMarkAsUnsatisfactorySample] =
    useState(false);

  useEffect(() => {
    const uploadFile = async () => {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        if (quickUpdateResult) {
          const result = await dispatch(
            importExcel({
              url: apiLinks.excel.importQuickResultUpdate,
              formData,
            })
          );
          if (result.errors.length !== 0) {
            dispatch(
              showErrorModal('Import logs', result.data, result.errors ?? [])
            );
          }
          setQuickUpdateResult(false);
        } else {
          await dispatch(uploadProfilesFromExcel(formData));
          setChangeProfileModal(true);
        }
      }
    };
    uploadFile();
    fileInputRef.current.value = '';
    setSelectedFile(undefined);
    // eslint-disable-next-line
  }, [dispatch, selectedFile]);

  const {
    unitInfo,
    prefixList,
    diseaseList,
    unitTypeList,
    diseaseSampleList,
    examinationTypeList,
    examinationDetailTempData,
    getExaminationDetailLoading,
    updateExaminationLoading,
    updateExamDetailLoading,
    deleteExaminationLoading,
    getUnitInfoLoading,
    getUnitTypesLoading,
    exportExamLoading,
    uploadProfilefromExcelLoading,
  } = useSelector((state) => state.medicalTest);

  const importLoading = useSelector((s) => s.global.importLoading);

  const { isAdmin, isMasterXng, isUsername } = useAuth();

  useEffect(() => {
    if (prefixList.length === 0) {
      dispatch(getPrefixes());
    }
    if (diseaseList.length === 0) {
      dispatch(getDiseases());
    }
    if (!unitInfo) {
      dispatch(getUnitInfo());
    }
    if (unitTypeList.length === 0) {
      dispatch(getUnitTypes());
    }
    if (diseaseSampleList.length === 0) {
      dispatch(getDiseaseSamples());
    }
    if (examinationTypeList.length === 0) {
      dispatch(getExaminationTypes());
    }
    // eslint-disable-next-line
  }, [dispatch]);

  const title = useMemo(
    () =>
      `Quản lý mẫu${
        isTakenUnit ? ' tự lấy' : isReceivedUnit ? ' nhận từ nơi khác' : ''
      }`,
    [isTakenUnit, isReceivedUnit]
  );

  const loading =
    getExaminationDetailLoading ||
    updateExaminationLoading ||
    deleteExaminationLoading ||
    updateExamDetailLoading ||
    getUnitInfoLoading ||
    getUnitTypesLoading ||
    uploadProfilefromExcelLoading ||
    exportExamLoading ||
    importLoading;

  const handleRefresh = useCallback(() => {
    const params = {
      ...filter,
      from: from || filter.from,
      to: to || filter.to,
      pageIndex,
      pageSize,
    };
    if (isTakenUnit || isReceivedUnit) {
      params.apiV2 = true;
      params.sampleFilterType = isReceivedUnit
        ? SAMPLE_FILTER_TYPE.RECEIVED
        : isTakenUnit
        ? SAMPLE_FILTER_TYPE.TAKEN
        : 0;
      params.sampleSubFilter = isUnQualifySample
        ? SAMPLE_SUB_FILTER.UNQUALIFY
        : isProcessedSample
        ? SAMPLE_SUB_FILTER.PROCESSED
        : isWaitingSample
        ? SAMPLE_SUB_FILTER.WAITING
        : 0;
    }

    dispatch(getExaminationDetail(params));
  }, [
    dispatch,
    filter,
    pageIndex,
    pageSize,
    from,
    to,
    isTakenUnit,
    isReceivedUnit,
    isWaitingSample,
    isProcessedSample,
    isUnQualifySample,
  ]);

  useEffect(handleRefresh, [handleRefresh]);

  const { data, pageCount } = examinationDetailTempData;

  const handleExportExaminationResult = (d) => {
    const { unitId, resultDate, hasResultOnly, feeType } = d;
    dispatch(
      exportOneUnit
        ? exportExaminationResult(unitId, resultDate, hasResultOnly, feeType)
        : exportExaminationResultHCDC(resultDate, hasResultOnly, feeType)
    ).then(() => {
      setOpenExportExcelModal(false);
    });
  };

  const handleExportByTaken = ({ unitId, takenDate, feeType }) => {
    dispatch(exportByTaken(unitId, takenDate, feeType)).then(() => {
      setExportExamByTakenModal(false);
    });
  };

  const handleExportReceive = ({ dateReceived }) => {
    dispatch(exportByDateReceived(dateReceived)).then(() => {
      setExportReceive(false);
    });
  };

  const handleExportRange = async (d) => {
    try {
      await dispatch(exportByRange(d));
      setExportRange(false);
    } catch {
      toast.warn('Không có mẫu');
    }
  };

  const handleChangeProfile = (d) => {
    const dispatchChangeProfile = async () => {
      try {
        await dispatch(
          changeProfile({
            examId: selectingExamination.examId,
            profileId: d.profileId,
          })
        );
        setSelectingExamination(undefined);
        handleRefresh();
      } catch (e) {
        toast.warn(e);
      }
    };
    dispatch(
      showConfirmModal(
        `Chuyển mẫu ${selectingExamination.code} cho hồ sơ ${d.fullName}`,
        () => {
          dispatchChangeProfile();
        }
      )
    );
  };

  return (
    <div>
      <ExaminationDetailsFilter
        isGetAll={!(isTakenUnit || isReceivedUnit)}
        isTakenUnit={isTakenUnit}
        isReceivedUnit={isReceivedUnit}
        isProcessedSample={isProcessedSample}
        onChange={setFilter}
        hideDateFilter={hideDateFilter}
      />
      <DataTable
        title={title}
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, idx: i + 1 }))}
        loading={loading}
        filterByDate
        onFilterByDateChange={({ from: f, to: t, hideDateFilter: h }) => {
          setFrom(f ? moment(f).format('YYYY-MM-DDT00:00:00+07:00') : '');
          setTo(t ? moment(t).format('YYYY-MM-DDT23:59:59+07:00') : '');
          setHideDateFilter(h);
        }}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiRefreshCw />,
            title: 'Cập nhật mẫu không đạt',
            color: 'yellow',
            onClick: () => setMarkAsUnsatisfactorySample(true),
            globalAction: true,
            hidden: !isWaitingSample,
          },
          {
            icon: <FiX />,
            title: 'Huỷ kết quả mẫu không đạt',
            color: 'red',
            onClick: () => setUnMarkAsUnsatisfactorySample(true),
            globalAction: true,
            hidden: !isUnQualifySample,
          },
          {
            icon: <FiUpload />,
            title: 'Import Excel',
            color: 'violet',
            hidden: !isUsername('hcdc'),
            globalAction: true,
            dropdown: true,
            dropdownActions: [
              {
                titleDropdown: 'Sửa kết quả nhanh',
                onDropdownClick: () => {
                  setQuickUpdateResult(true);
                  fileInputRef.current.click();
                },
                dropdownHidden: !isUsername('hcdc'),
              },
            ],
          },
          {
            icon: <FiDownload />,
            title: 'Xuất Excel',
            color: 'blue',
            globalAction: true,
            dropdown: true,
            dropdownActions: [
              // {
              //   titleDropdown: 'Tìm hồ sơ bằng File Excel',
              //   onDropdownClick: () => fileInputRef.current.click(),
              //   dropdownHidden: !isMasterXng,
              // },
              // {
              //   titleDropdown: 'Xuất sổ xét nghiệm',
              //   onDropdownClick: () => setExportExamBookModal(true),
              //   dropdownHidden: !isAdmin,
              // },
              {
                titleDropdown: 'Xuất kết quả theo ngày lấy mẫu',
                onDropdownClick: () => setExportExamByTakenModal(true),
              },
              {
                titleDropdown: 'Xuất kết quả theo ngày nhận mẫu',
                onDropdownClick: () => {
                  setOpenExportExcelModal(true);
                  setExportOneUnit(true);
                },
              },
              // {
              //   titleDropdown: 'Xuất kết quả theo khoảng ngày',
              //   onDropdownClick: () => setExportRange(true),
              // },
              // {
              //   titleDropdown: 'Xuất kết quả TỔNG theo ngày',
              //   onDropdownClick: () => {
              //     setOpenExportExcelModal(true);
              //     setExportOneUnit(false);
              //   },
              //   dropdownHidden: !isAdmin,
              // },
              {
                titleDropdown: 'Xuất kết quả theo mã từ Excel',
                onDropdownClick: () => setExportResultFromExcelModal(true),
              },
              // {
              //   titleDropdown: 'Xuất thống kê theo ngày nhận',
              //   onDropdownClick: () => setExportReceive(true),
              //   dropdownHidden: !isAdmin,
              // },
              // {
              //   titleDropdown: 'Xuất dữ liệu xét nghiệm tổng',
              //   onDropdownClick: () => setExportAll(true),
              //   dropdownHidden: !isUsername('hcdc'),
              // },
              {
                titleDropdown: 'Xuất dữ liệu chi tiết theo mã xét nghiệm',
                onDropdownClick: () => setExportStatisticByCodes(true),
              },
              {
                titleDropdown: 'Xuất dữ liệu xét nghiệm chi tiết',
                onDropdownClick: () => setExportStatistic(true),
              },
            ],
          },
          // {
          //   icon: <FiUpload />,
          //   title: 'Import',
          //   color: 'pink',
          //   onClick: () => setSampleModal(true),
          //   globalAction: true,
          // },
          {
            icon: <FiFile />,
            title: 'Phiếu kết quả xét nghiệm chẩn đoán',
            color: 'brown',
            onClick: (row) => dispatch(exportExaminationFile(row.code)),
            disabled: (row) => !row.result,
            hidden: !isUsername('hcdc.dvu.xng') && !isUsername('hcdc.kdi.xng'),
          },
          {
            icon: <FiDownload />,
            title: 'Phiếu trả lời kết quả xét nghiệm',
            color: 'green',
            onClick: (row) => dispatch(exportExamFile(row.id, row.code)),
            disabled: (row) => !row.result,
            hidden: !isAdmin && !isUsername('hcdc.dph.xng'),
          },
          {
            icon: <FiRefreshCw />,
            title: 'Đổi hồ sơ của mẫu',
            color: 'yellow',
            onClick: setSelectingExamination,
            hidden: !isMasterXng,
          },
          {
            icon: <FiEdit2 />,
            title: 'Sửa kết quả',
            color: 'violet',
            onClick: (row) => {
              setUpdateExaminationModal(true);
              setSelected(row);
            },
            hidden: !isMasterXng,
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (row) => {
              setOpenGroupProfileModal(true);
              setSelected(row);
            },
            hidden: ({ person }) => !person.isGroup,
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (row) => {
              window.open(
                `/profile/${
                  row.person?.profileId || row.person.id
                }/medical-test`,
                '_blank'
              );
            },
            hidden: ({ person }) => person.isGroup,
          },
        ]}
      />

      <UpdateExamModal
        key={
          updateExaminationModal
            ? 'OpenUpdateExaminationModal'
            : 'CloseUpdateExaminationModal'
        }
        open={updateExaminationModal}
        onClose={() => setUpdateExaminationModal(false)}
        data={selected}
        getData={handleRefresh}
      />

      <ExportExamBookModal
        key={
          exportExamBookModal
            ? 'OpenExportExamBookModal'
            : 'CloseExportExamBookModal'
        }
        open={exportExamBookModal}
        onClose={() => setExportExamBookModal(false)}
      />

      <SampleExaminationExcelModal
        key={sampleModal ? 'OpenSampleModal' : 'CloseSampleModal'}
        open={sampleModal}
        onClose={() => setSampleModal(false)}
        onRefresh={handleRefresh}
      />

      <ExportExaminationResultModal
        key={openExportExcelModal ? 'OpenExportModal' : 'CloseExportModal'}
        open={openExportExcelModal}
        isAdmin={isAdmin}
        isExportOneUnit={exportOneUnit}
        onClose={() => setOpenExportExcelModal(false)}
        onSubmit={handleExportExaminationResult}
      />

      <ExportExamByTakenModal
        key={
          exportExamByTakenModal
            ? 'OpenExportExamByTakenModal'
            : 'CloseExportExamByTakenModal'
        }
        open={exportExamByTakenModal}
        isAdmin={isAdmin}
        onClose={() => setExportExamByTakenModal(false)}
        onSubmit={handleExportByTaken}
      />

      <ExportRangeModal
        key={exportRange ? 'OpenExportRangeModal' : 'CloseExportRangeModal'}
        open={exportRange}
        onClose={() => setExportRange(false)}
        onSubmit={handleExportRange}
      />
      <ExportReceiveModal
        key={
          exportReceive ? 'OpenExportReceiveModal' : 'CloseExportReceiveModal'
        }
        open={exportReceive}
        onClose={() => setExportReceive(false)}
        onSubmit={handleExportReceive}
      />
      <ChangeProfileModal
        key={
          selectingExamination
            ? 'OpenChangeProfileModal'
            : 'CloseChangeProfileModal'
        }
        open={Boolean(selectingExamination?.id)}
        onClose={() => setSelectingExamination(undefined)}
        onSubmit={handleChangeProfile}
      />
      <FindProfileFromExcelModal
        open={changeProfileModal}
        onClose={() => {
          setChangeProfileModal(false);
          fileInputRef.current.value = '';
          setSelectedFile(undefined);
        }}
      />
      <ExportResultFromExcelModal
        open={exportResultFromExcelModal}
        onClose={() => setExportResultFromExcelModal(false)}
      />
      <GroupProfileModal
        open={openGroupProfileModal}
        onClose={() => setOpenGroupProfileModal(false)}
        data={selected}
      />
      <ExportAllExamModal
        open={exportAll}
        onClose={() => setExportAll(false)}
      />
      <ExportStatisticExaminationModal
        open={exportStatistic}
        onClose={() => setExportStatistic(false)}
      />
      <UnsatisfactorySampleModal
        open={markAsUnsatisfactorySample || unMarkAsUnsatisfactorySample}
        isTakenUnit={isTakenUnit}
        isReceivedUnit={isReceivedUnit}
        mark={markAsUnsatisfactorySample}
        unMark={unMarkAsUnsatisfactorySample}
        onClose={() => {
          setMarkAsUnsatisfactorySample(false);
          setUnMarkAsUnsatisfactorySample(false);
        }}
        onRefresh={handleRefresh}
      />
      <ExportStatisticExaminationByCodesModal
        open={exportStatisticByCodes}
        onClose={() => setExportStatisticByCodes(false)}
      />

      <input
        ref={fileInputRef}
        type='file'
        hidden
        onChange={(e) => setSelectedFile(e.target.files[0])}
        accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
      />
    </div>
  );
};

ExamManagementTable.defaultProps = {
  isTakenUnit: undefined,
  isReceivedUnit: undefined,
  isWaitingSample: undefined,
  isProcessedSample: undefined,
  isUnQualifySample: undefined,
};

ExamManagementTable.propTypes = {
  isTakenUnit: PropTypes.bool,
  isReceivedUnit: PropTypes.bool,
  isWaitingSample: PropTypes.bool,
  isProcessedSample: PropTypes.bool,
  isUnQualifySample: PropTypes.bool,
};

export default ExamManagementTable;
