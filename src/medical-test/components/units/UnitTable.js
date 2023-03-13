import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiPlus,
  FiEdit2,
  FiZap,
  FiTrash2,
  FiSliders,
  // FiTrash2,
} from 'react-icons/fi';

import _ from 'lodash';
import { DataTable } from 'app/components/shared';
import { showConfirmModal } from 'app/actions/global';
import {
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} from 'medical-test/actions/medical-test';
import { useAuth } from 'app/hooks';
import UnitFilter from './UnitFilter';
import UnitModal from './UnitModal';
import WattageModal from './WattageModal';
import AllWattageModal from './AllWattageModal';
import UnitConfigTable from './UnitConfigTable';

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Tên cơ sở', accessor: 'name' },
  { Header: 'Mã cơ sở', accessor: 'code' },
  { Header: 'Loại chức năng lấy mẫu', accessor: 'samplingFunctionType' },
  {
    Header: 'Công suất / Chỉ tiêu lấy mẫu',
    formatter: (row) =>
      row.isCollector ? `${row.collectW} / ${row.collectLimit}` : '',
  },
  {
    Header: 'Công suất trung bình / Tối đa / Chỉ tiêu xét nghiệm',
    formatter: (row) =>
      row.isTester
        ? `${row.testW} / ${row.testWattMax} / ${row.testLimit}`
        : '',
  },
  // { Header: 'Công suất tối đa', formatter: (row) => (row.isTester ? row.testW : '') },
  // { Header: 'Chỉ tiêu', formatter: (row) => (row.isTester ? row.testLimit : '') },
];

const UnitTable = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [modal, setModal] = useState({
    isOpen: false,
    data: null,
  });

  const [selectingRow, setSelectingRow] = useState({});
  const [wattageModal, setWattageModal] = useState(false);
  const [allWattageModal, setAllWattageModal] = useState(false);

  const {
    unitList,
    getUnitsLoading,
    createUnitLoading,
    updateUnitLoading,
    printCodeLoading,
    publishCodeLoading,
  } = useSelector((state) => state.medicalTest);

  const loading =
    getUnitsLoading ||
    createUnitLoading ||
    updateUnitLoading ||
    printCodeLoading ||
    publishCodeLoading;

  const handleRefresh = useCallback(() => {
    if (!_.isEmpty(filter)) {
      dispatch(
        getUnits({
          ...filter,
          pageIndex,
          pageSize,
        }),
      );
    }
  }, [dispatch, filter, pageIndex, pageSize]);

  // eslint-disable-next-line
  useEffect(handleRefresh, [handleRefresh]);

  const handleSubmit = (d) => {
    dispatch(
      !d.id
        ? createUnit(d)
        : updateUnit({
            ...modal.data,
            ...d,
          }),
    ).then(() => {
      setModal({ isOpen: false, data: null });
      handleRefresh();
    });
  };
  const handleUpdateWattage = (d) => {
    dispatch(
      updateUnit({
        ...selectingRow,
        ...d,
      }),
    ).then(() => {
      setWattageModal(false);
      handleRefresh();
    });
  };
  const { data, pageCount } = unitList;
  const { isAdmin } = useAuth();

  return (
    <div>
      <UnitFilter onChange={setFilter} />
      <DataTable
        title="Quản lý cơ sở"
        columns={columns}
        data={(data || []).map((d, i) => ({ ...d, index: i + 1 }))}
        loading={loading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiSliders />,
            title: 'Điều chỉnh chỉ tiêu tổng',
            color: 'yellow',
            onClick: () => setAllWattageModal(true),
            globalAction: true,
            hidden: !isAdmin,
          },
          {
            icon: <FiPlus />,
            title: 'Thêm',
            color: 'green',
            onClick: () =>
              setModal({
                isOpen: true,
                data: null,
              }),
            globalAction: true,
            hidden: !isAdmin,
          },
          {
            icon: <FiZap />,
            title: 'Điều chỉnh công suất/ chỉ tiêu',
            color: 'yellow',
            onClick: (row) => {
              setSelectingRow(row);
              setWattageModal(true);
            },
          },
          {
            icon: <FiEdit2 />,
            title: 'Cập nhật',
            color: 'violet',
            onClick: (row) =>
              setModal({
                isOpen: true,
                data: row,
              }),
          },
          {
            icon: <FiTrash2 />,
            title: 'Xóa',
            color: 'red',
            onClick: (row) =>
              dispatch(
                showConfirmModal('Xác nhận xóa?', () => {
                  dispatch(deleteUnit(row.id)).then(() => {
                    handleRefresh();
                  });
                }),
              ),
            hidden: !isAdmin,
          },
        ]}
        subComponent={(row) => (
          <UnitConfigTable unitId={row.id} unitName={row.name} />
        )}
      />

      <WattageModal
        key={wattageModal ? 'OpenWattageModal' : 'CloseWattageModal'}
        open={wattageModal}
        initialData={selectingRow}
        onClose={() => setWattageModal(false)}
        onSubmit={handleUpdateWattage}
      />

      <AllWattageModal
        key={allWattageModal ? 'OpenAllWattageModal' : 'CloseAllWattageModal'}
        open={allWattageModal}
        onClose={() => {
          setAllWattageModal(false);
          handleRefresh();
        }}
      />

      <UnitModal
        key={modal.isOpen ? 'ModalCreateUnitModal' : 'CloseCreateUnitModal'}
        open={modal.isOpen}
        isAdmin={isAdmin}
        initialData={modal.data}
        onClose={() =>
          setModal({
            isOpen: false,
            data: null,
          })
        }
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default UnitTable;
