/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';

import { FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Icon } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';

import { DataTable } from 'app/components/shared';
import {
  checkFilter,
  formatToTime,
  formatExaminationAddressToString,
} from 'app/utils/helpers';

import {
  getDiseases,
  getDiseaseSamples,
  getExaminationTypes,
  getUnitInfo,
} from 'medical-test/actions/medical-test';
import {
  deleteCollectingSession,
  getCollectingSessions,
} from '../actions/collecting-session';

import CollectingSessionModal from './CollectingSessionModal';
import CollectingSessionFilter from './CollectingSessionFilter';
import AddExaminationToCollectingSessionModal from './AddExaminationToCollectingSessionModal';

const columns = [
  { Header: 'Tên', accessor: 'name' },
  { Header: 'Cơ sở', accessor: 'unitName' },
  {
    Header: 'Thời gian',
    formatter: ({ startTime, endTime }) => (
      <>
        <span style={{ paddingRight: '10px' }}>
          {`${formatToTime(startTime)}`}
        </span>
        {endTime && <Icon name="arrow right" />}

        <span style={{ paddingLeft: '10px' }}>
          {`${formatToTime(endTime)}`}
        </span>
      </>
    ),
  },
  { Header: 'Địa chỉ', formatter: formatExaminationAddressToString },
  { Header: 'Ghi chú', accessor: 'note' },
];

const CollectingSessionTable = () => {
  const dispatch = useDispatch();

  const [selected, setSelected] = useState(undefined);

  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [addExaminationOpen, setAddExaminationOpen] = useState(false);
  const [collectingSessionOpen, setCollectingSessionOpen] = useState(false);

  const { data, pageCount } = useSelector(
    (s) => s.collectingSession.collectingSessionData,
  );
  const getCollectingSessionLoading = useSelector(
    (s) => s.collectingSession.getCollectingSessionLoading,
  );
  const deleteCollectingSessionLoading = useSelector(
    (s) => s.collectingSession.deleteCollectingSessionLoading,
  );
  const unitInfo = useSelector((s) => s.medicalTest.unitInfo);

  const getData = useCallback(() => {
    dispatch(getCollectingSessions({ ...filter, pageSize, pageIndex }));
  }, [dispatch, filter, pageSize, pageIndex]);
  useEffect(getData, [getData]);
  useEffect(() => {
    if (!unitInfo) {
      dispatch(getUnitInfo());
    }
  }, [dispatch, unitInfo]);
  useEffect(() => {
    dispatch(getDiseases());
    dispatch(getExaminationTypes());
    dispatch(getDiseaseSamples());
  }, [dispatch]);
  return (
    <div>
      <CollectingSessionFilter
        onChange={(d) => (checkFilter(filter, d) ? setFilter(d) : {})}
      />
      <DataTable
        title="Danh sách buổi lấy mẫu"
        data={data}
        columns={columns}
        pageCount={pageCount}
        loading={getCollectingSessionLoading || deleteCollectingSessionLoading}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageIndex(pi);
          setPageSize(ps);
        }}
        actions={[
          {
            title: 'Tạo',
            icon: <FiPlus />,
            color: 'green',
            onClick: () => {
              setSelected({});
              setCollectingSessionOpen(true);
            },
            globalAction: true,
          },
          {
            title: 'Thêm phiên lấy mẫu',
            icon: <FiPlus />,
            color: 'green',
            onClick: (r) => {
              setSelected(r);
              setAddExaminationOpen(true);
            },
          },
          {
            title: 'Sửa thông tin',
            icon: <FiEdit3 />,
            color: 'violet',
            onClick: (r) => {
              setSelected(r);
              setCollectingSessionOpen(true);
            },
          },
          {
            title: 'Xóa',
            icon: <FiTrash2 />,
            color: 'red',
            onClick: ({ id }) =>
              dispatch(
                showConfirmModal('Xác nhận xóa?', async () => {
                  await dispatch(deleteCollectingSession(id));
                  getData();
                }),
              ),
          },
        ]}
      />

      <CollectingSessionModal
        key={
          collectingSessionOpen
            ? 'OpenCollectingSessionModal'
            : 'CloseCollectingSessionModal'
        }
        open={collectingSessionOpen}
        data={selected}
        getData={getData}
        onClose={() => setCollectingSessionOpen(false)}
      />

      <AddExaminationToCollectingSessionModal
        key={
          addExaminationOpen
            ? 'OpenAddExaminationToCollectingSessionModal'
            : 'CloseAddExaminationToCollectingSessionModal'
        }
        open={addExaminationOpen}
        data={selected}
        getData={getData}
        onClose={() => setAddExaminationOpen(false)}
      />
    </div>
  );
};

export default CollectingSessionTable;
