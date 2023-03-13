/* eslint-disable no-nested-ternary */
import React, {
  useState,
  useEffect,
  useCallback,
  // useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  FiCheck, FiEdit3, FiKey, FiPlus, FiTrash,
} from 'react-icons/fi';

import { DataTable } from 'app/components/shared';

import {
  getUnitConfigs,
  updateCode,
  deleteUnitConfig,
} from 'medical-test/actions/medical-test';
import { showConfirmModal } from 'app/actions/global';
import UnitConfigModal from './UnitConfigModal';

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Mã', accessor: 'code' },
  { Header: 'Đã tạo', formatter: (r) => r.createdCount },
  { Header: 'Sử dụng', formatter: (r) => (r.isUsing ? <FiCheck /> : null) },
];

const UnitConfigTable = ({ unitId, unitName }) => {
  const dispatch = useDispatch();
  const [unitConfigList, setUnitConfigList] = useState([]);
  const [unitConfigModal, setUnitConfigModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectingRow, setSelectingRow] = useState({});
  // const {
  //   createUnitConfigLoading,
  //   updateUnitConfigLoading,
  //   deleteUnitConfigLoading,
  // } = useSelector((s) => s.medicalTest);

  const getData = useCallback(() => {
    setLoading(true);
    getUnitConfigs(unitId).then((response) => {
      setUnitConfigList(response);
      setLoading(false);
    });
  }, [unitId]);
  useEffect(getData, [getData]);

  return (
    <div>
      <DataTable
        title={`Quản lý mã phụ của ${unitName}`}
        columns={columns}
        loading={loading}
        data={(unitConfigList ?? []).map((r, i) => ({ ...r, index: i + 1 }))}
        actions={[
          {
            icon: <FiPlus />,
            title: 'Thêm',
            color: 'green',
            globalAction: true,
            onClick: () => {
              setUnitConfigModal(true);
              setSelectingRow({});
            },
          },
          {
            icon: <FiKey />,
            title: 'Sử dụng mã',
            color: 'blue',
            onClick: (r) => updateCode({ unitId: r.unitId, code: r.code }).then(getData),
            disabled: (r) => r.isUsing,
          },
          {
            icon: <FiEdit3 />,
            title: 'Sửa mã',
            color: 'violet',
            onClick: (r) => {
              setUnitConfigModal(true);
              setSelectingRow(r);
            },
          },
          {
            icon: <FiTrash />,
            title: 'Xóa',
            color: 'red',
            onClick: (r) => dispatch(
              showConfirmModal('Bạn có chắc chắn?', () => {
                dispatch(deleteUnitConfig(r.id)).then(getData);
              }),
            ),
          },
        ]}
      />
      <UnitConfigModal
        key={unitConfigModal ? 'OpenUnitConfigModal' : 'CloseUnitConfigModal'}
        unitId={unitId}
        loading={loading}
        data={selectingRow}
        open={unitConfigModal}
        onClose={() => setUnitConfigModal(false)}
        onRefresh={getData}
        onLoad={setLoading}
      />
    </div>
  );
};

UnitConfigTable.propTypes = {
  unitId: PropTypes.string,
  unitName: PropTypes.string,
};

UnitConfigTable.defaultProps = {
  unitId: '',
  unitName: '',
};

export default UnitConfigTable;
