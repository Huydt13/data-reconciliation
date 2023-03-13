/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';

import { Icon } from 'semantic-ui-react';
import {
  FiEdit3,
  // FiTrash2,
} from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import {
  // deleteContactLocation,
  searchOtherVehicle,
} from 'contact/actions/contact';
// import { showConfirmModal } from 'app/actions/global';

import { DataTable } from 'app/components/shared';
import VehicleModal from './VehicleModal';
import ContactVehicleFilter from '../../contact-vehicle/ContactVehicleFilter';

const columns = [
  { Header: 'Tên phương tiện', accessor: 'vehicleName' },
  { Header: 'Loại hình', accessor: 'vehicleType' },
  {
    Header: 'Thông tin di chuyển',
    formatter: ({ from, to }) => (
      <>
        <span style={{ paddingRight: '10px' }}>{from}</span>
        <Icon name="long arrow alternate right" />
        <span style={{ paddingLeft: '10px' }}>{to}</span>
      </>
    ),
  },
  { Header: 'Mã số chuyến đi', accessor: 'tripNumber' },
  { Header: 'Biển đăng ký xe', accessor: 'liscencePlateNumber' },
];
const VehicleTable = () => {
  const dispatch = useDispatch();

  const { data, totalPages } = useSelector(
    (s) => s.contact.searchOtherVehicleList,
  );
  const loading = useSelector((s) => s.contact.getSearchOtherVehicleLoading);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({});
  const [selecting, setSelecting] = useState({});

  const getData = useCallback(() => {
    dispatch(searchOtherVehicle({ ...filter, pageSize, pageIndex }));
  }, [dispatch, filter, pageSize, pageIndex]);
  useEffect(getData, [getData]);
  return (
    <>
      <ContactVehicleFilter onChange={setFilter} />
      <DataTable
        title="Danh sách phương tiện khác"
        columns={columns}
        loading={loading}
        data={data || []}
        pageCount={totalPages}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageSize(ps);
          setPageIndex(pi);
        }}
        actions={[
          {
            icon: <FiEdit3 />,
            color: 'violet',
            title: 'Cập nhật',
            onClick: setSelecting,
          },
          // {
          //   icon: <FiTrash2 />,
          //   color: 'red',
          //   title: 'Xóa',
          //   onClick: (r) =>
          //     dispatch(
          //       showConfirmModal('Xóa?', () =>
          //         dispatch(deleteContactLocation(r.id)),
          //       ),
          //     ),
          // },
        ]}
      />
      <VehicleModal
        data={selecting}
        onClose={() => setSelecting({})}
        onRefresh={getData}
      />
    </>
  );
};

export default VehicleTable;
