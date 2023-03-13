/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';

import { DataTable } from 'app/components/shared';

import { useDispatch, useSelector } from 'react-redux';
import { deleteHospital, getHospitals } from 'treatment/actions/hospital';

import { checkFilter, formatAddressToString } from 'app/utils/helpers';

import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { showConfirmModal } from 'app/actions/global';

import HospitalModal from './HospitalModal';
import HospitalFilter from './HospitalFilter';

const columns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Tên bệnh viện',
    formatter: ({ description }) => description,
  },
  {
    Header: 'Địa chỉ',
    formatter: ({ address }) => formatAddressToString(address),
  },
];

const HospitalTable = () => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [hospitalModal, setHospitalModal] = useState(false);
  const [selectingRow, setSelectingRow] = useState({});

  const { data, pageCount } = useSelector(
    (s) => s.treatment.hospital.hospitalData,
  );
  const getDataLoading = useSelector(
    (s) => s.treatment.hospital.getHospitalsLoading,
  );

  const getData = useCallback(() => {
    dispatch(
      getHospitals({
        ...filter,
        pageSize,
        pageIndex,
      }),
    );
  }, [dispatch, filter, pageIndex, pageSize]);

  useEffect(getData, [getData]);

  return (
    <div>
      <HospitalFilter
        onChange={(d) => checkFilter(filter, d) && setFilter(d)}
      />
      <DataTable
        title="Danh sách bệnh viện"
        columns={columns}
        data={data.map((d, i) => ({ ...d, index: i + 1 }))}
        actions={[
          {
            title: 'Tạo',
            color: 'green',
            icon: <FiPlus />,
            onClick: () => {
              setHospitalModal(true);
              setSelectingRow({});
            },
            globalAction: true,
          },
          {
            title: 'Cập nhật',
            color: 'violet',
            icon: <FiEdit2 />,
            onClick: (r) => {
              setHospitalModal(true);
              setSelectingRow(r);
            },
          },
          {
            title: 'Xoá',
            color: 'red',
            icon: <FiTrash2 />,
            onClick: ({ id }) => {
              dispatch(
                showConfirmModal('Xóa bệnh viện?', async () => {
                  await dispatch(deleteHospital(id));
                  getData();
                }),
              );
            },
          },
        ]}
        loading={getDataLoading}
        pageCount={pageCount}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageSize(ps);
          setPageIndex(pi);
        }}
      />

      <HospitalModal
        key={hospitalModal ? 'OpenHospitalModal' : 'CloseHospitalModal'}
        open={hospitalModal}
        onClose={() => setHospitalModal(false)}
        data={selectingRow}
        getData={getData}
      />
    </div>
  );
};

export default HospitalTable;
