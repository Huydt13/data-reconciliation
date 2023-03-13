/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiPlus,
  // FiCheck,
  FiPrinter,
  FiUpload,
  FiCheck,
} from 'react-icons/fi';

import moment from 'moment';
import { DataTable } from 'app/components/shared';
import {
  createMedicalTestCode,
  printCodeByZone,
  publishCodeByZone,
  getAvailableCodes,
  rePrintCodeByZone,
  getOtherCode,
  rePrintCodeFrom,
  createBatchUnit,
  publishBatchUnit,
} from 'medical-test/actions/medical-test';
import { showConfirmModal } from 'app/actions/global';
import { useAuth } from 'app/hooks';

import CodeFilter from './CodeFilter';
import CreateCodeModal from './CreateCodeModal';
import PublishAndPrintModal from './PublishAndPrintModal';
import PrintFromModal from './PrintFromModal';
import AddBatchUnitModal from './AddBatchUnitModal';
import PublishBatchUnitModal from './PublishBatchUnitModal';

const CodeTable = (props) => {
  const { isAvailable } = props;
  const columns = useMemo(() => {
    if (isAvailable) {
      return [
        { Header: '#', accessor: 'index' },
        {
          Header: 'Mã xét nghiệm',
          formatter: ({ code }) => (code?.length === 12 ? <b>{code}</b> : code),
        },
        {
          Header: 'Lần in cuối cùng',
          formatter: (row) =>
            row.lastPrintedDate
              ? moment(row.lastPrintedDate).format('DD-MM-YY HH:mm')
              : '',
        },
        { Header: 'Số lần in', accessor: 'printedCount' },
        {
          Header: 'Ngày cấp',
          formatter: (row) =>
            row.publishedDate
              ? moment(row.publishedDate).format('DD-MM-YY HH:mm')
              : '',
        },
      ];
    }
    return [
      { Header: '#', accessor: 'index' },
      {
        Header: 'Mã xét nghiệm',
        formatter: ({ code }) => (code?.length === 12 ? <b>{code}</b> : code),
      },
      {
        Header: 'Đã cấp',
        formatter: ({ isPublished }) => (isPublished ? <FiCheck /> : ''),
      },
      {
        Header: 'Ngày cấp',
        formatter: (row) =>
          row.publishedDate
            ? moment(row.publishedDate).format('DD-MM-YY HH:mm')
            : '',
      },
    ];
  }, [isAvailable]);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [modal, setModal] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const [printFromModal, setPrintFromModal] = useState(false);
  const [publishAndPrintModal, setPublishAndPrintModal] = useState(false);
  const [createBatchCodeModal, setCreateBatchCodeModal] = useState(false);
  const [publishBatchCodeModal, setPublishBatchCodeModal] = useState(false);

  const { isAdmin } = useAuth();

  const {
    unitInfo,
    getDiseasesLoading,
    otherCodeData,
    availableCodeList,
    getOtherCodesLoading,
    getAvailableCodesLoading,
    createCodeLoading,
    getPrefixesLoading,
    rePrintCodeLoading,
    printCodeLoading,
    publishCodeLoading,
  } = useSelector((state) => state.medicalTest);

  const loading =
    getOtherCodesLoading ||
    getAvailableCodesLoading ||
    createCodeLoading ||
    getPrefixesLoading ||
    getDiseasesLoading ||
    rePrintCodeLoading ||
    printCodeLoading ||
    publishCodeLoading;

  const handleRefresh = useCallback(() => {
    dispatch(
      isAvailable
        ? getAvailableCodes({
            ...filter,
            unitPrefix: isAdmin ? filter.unitPrefix : unitInfo?.code,
            pageIndex,
            pageSize,
          })
        : getOtherCode({
            ...filter,
            unitPrefix: isAdmin ? filter.unitPrefix : unitInfo?.code,
            pageIndex,
            pageSize,
          }),
    );
  }, [dispatch, isAdmin, unitInfo, isAvailable, filter, pageIndex, pageSize]);

  useEffect(handleRefresh, [handleRefresh]);

  const handleCreate = (d) => {
    const data = {
      ...d,
      quantity: parseInt(d.quantity, 10),
    };
    dispatch(createMedicalTestCode(data)).then(() => {
      setModal(false);
      handleRefresh();
    });
  };

  const handlePublishOrPrint = (d) => {
    const data = {
      ...d,
      quantity: parseInt(d.quantity, 10),
    };
    dispatch(
      isPrint
        ? isAvailable
          ? rePrintCodeByZone(data)
          : printCodeByZone(data)
        : publishCodeByZone(data),
    ).then(() => {
      setPublishAndPrintModal(false);
      handleRefresh();
    });
  };

  const handlePrintFrom = (d) => {
    const data = {
      ...d,
      quantity: parseInt(d.quantity, 10),
    };
    dispatch(rePrintCodeFrom(data)).then(() => {
      setPrintFromModal(false);
      handleRefresh();
    });
  };

  const handleCreateBatchCode = (d) => {
    dispatch(createBatchUnit(d)).then(() => {
      setCreateBatchCodeModal(false);
      handleRefresh();
    });
  };

  const handlePublishBatchCode = (d) => {
    dispatch(publishBatchUnit(d)).then(() => {
      setPublishBatchCodeModal(false);
      handleRefresh();
    });
  };

  const title = isAvailable ? 'Mã sẵn sàng' : 'Mã chưa sẵn sàng';
  const { data, pageCount } = isAvailable ? availableCodeList : otherCodeData;

  return (
    <div>
      <CodeFilter isAvailable={isAvailable} onChange={setFilter} />
      <DataTable
        title={title}
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={loading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiPrinter />,
            title: `In ${isAvailable ? 'lại' : ''}`,
            color: 'yellow',
            globalAction: true,
            onClick: () => {
              setIsPrint(true);
              setPublishAndPrintModal(true);
            },
            dropdown: isAvailable,
            dropdownActions: [
              {
                titleDropdown: 'In lại từ đầu',
                onDropdownClick: () => {
                  setIsPrint(true);
                  setPublishAndPrintModal(true);
                },
              },
              {
                titleDropdown: 'In lại chọn lọc',
                onDropdownClick: () => {
                  setPrintFromModal(true);
                },
              },
            ],
          },
          {
            icon: <FiUpload />,
            title: 'Cấp',
            color: 'blue',
            // onClick: () => {
            //   setIsPrint(false);
            //   setPublishAndPrintModal(true);
            // },
            globalAction: true,
            hidden: !isAdmin || isAvailable,
            dropdown: true,
            dropdownActions: [
              {
                titleDropdown: 'Cấp mã cho một cơ sở',
                onDropdownClick: () => {
                  setIsPrint(false);
                  setPublishAndPrintModal(true);
                },
              },
              {
                titleDropdown: 'Cấp mã cho nhiều cơ sở',
                onDropdownClick: () => {
                  setPublishBatchCodeModal(true);
                },
              },
            ],
          },
          {
            icon: <FiPlus />,
            title: 'Tạo',
            color: 'green',
            // onClick: () => setModal(true),
            globalAction: true,
            hidden: isAvailable || !isAdmin,
            dropdown: true,
            dropdownActions: [
              {
                titleDropdown: 'Tạo mã cho một cơ sở',
                onDropdownClick: () => {
                  setModal(true);
                },
              },
              {
                titleDropdown: 'Tạo mã cho nhiều cơ sở',
                onDropdownClick: () => {
                  setCreateBatchCodeModal(true);
                },
              },
            ],
          },
        ]}
      />

      <CreateCodeModal
        key={modal ? 'ModalCreateCodeModal' : 'CloseCreateCodeModal'}
        open={modal}
        onClose={() => setModal(false)}
        onSubmit={(d) => {
          const { year } = d;
          if (year !== moment().format('YYYY')) {
            dispatch(
              showConfirmModal(
                `Bạn đang chọn cho năm ${year}?, bạn có chắc chắn?`,
                () => handleCreate(d),
              ),
            );
          } else {
            handleCreate(d);
          }
        }}
      />

      <PublishAndPrintModal
        key={
          publishAndPrintModal
            ? 'OpenPublishAndPrintModal'
            : 'ClosePublishAndPrintModal'
        }
        open={publishAndPrintModal}
        isAvailable={isAvailable}
        isPrint={isPrint}
        onClose={() => setPublishAndPrintModal(false)}
        onSubmit={(d) => {
          const { year } = d;
          if (year !== moment().format('YYYY')) {
            dispatch(
              showConfirmModal(
                `Bạn đang chọn cho năm ${year}?, bạn có chắc chắn?`,
                () => handlePublishOrPrint(d),
              ),
            );
          } else {
            handlePublishOrPrint(d);
          }
        }}
      />

      <AddBatchUnitModal
        key={
          createBatchCodeModal
            ? 'OpenCreateBatchCodeModal'
            : 'CloseCreateBatchCodeModal'
        }
        open={createBatchCodeModal}
        onClose={() => setCreateBatchCodeModal(false)}
        onSubmit={(d) => {
          const { year } = d;
          if (year !== moment().format('YYYY')) {
            dispatch(
              showConfirmModal(
                `Bạn đang chọn cho năm ${year}?, bạn có chắc chắn?`,
                () => handleCreateBatchCode(d),
              ),
            );
          } else {
            handleCreateBatchCode(d);
          }
        }}
      />

      <PublishBatchUnitModal
        key={
          publishBatchCodeModal
            ? 'OpenPublishBatchCodeModal'
            : 'ClosePublishBatchCodeModal'
        }
        open={publishBatchCodeModal}
        onClose={() => setPublishBatchCodeModal(false)}
        onSubmit={(d) => {
          const { year } = d;
          if (year !== moment().format('YYYY')) {
            dispatch(
              showConfirmModal(
                `Bạn đang chọn cho năm ${year}?, bạn có chắc chắn?`,
                () => handlePublishBatchCode(d),
              ),
            );
          } else {
            handlePublishBatchCode(d);
          }
        }}
      />

      <PrintFromModal
        key={printFromModal ? 'OpenPrintFromModal' : 'ClosePrintFromModal'}
        open={printFromModal}
        onClose={() => setPrintFromModal(false)}
        onSubmit={(d) => {
          const { year } = d;
          if (year !== moment().format('YYYY')) {
            dispatch(
              showConfirmModal(
                `Bạn đang chọn cho năm ${year}?, bạn có chắc chắn?`,
                () => handlePrintFrom(d),
              ),
            );
          } else {
            handlePrintFrom(d);
          }
        }}
      />
    </div>
  );
};

CodeTable.propTypes = {
  isAvailable: PropTypes.bool,
};

CodeTable.defaultProps = {
  isAvailable: false,
};

export default CodeTable;
