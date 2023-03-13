/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';

import moment from 'moment';
import { Icon } from 'semantic-ui-react';
import {
  FiEdit3,
  // FiTrash2,
} from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import {
  // deleteContactLocation,
  searchAirplane,
} from 'contact/actions/contact';
// import { showConfirmModal } from 'app/actions/global';

import { DataTable } from 'app/components/shared';
import AirplaneModal from './AirplaneModal';
import AirplaneFilter from './AirplaneFilter';

const columns = [
  { Header: 'Tên chuyến bay', accessor: 'flightNumber' },
  { Header: 'Số ghế', accessor: 'seatNumber' },
  {
    Header: 'Thông tin chuyến bay',
    formatter: ({ flightFrom, flightTo, departureTime, arrivalTime }) => (
      <>
        <span style={{ paddingRight: '10px' }}>
          {`${flightFrom} - ${moment(departureTime).format(
            'HH:mm | DD-MM-YY',
          )}`}
        </span>
        <Icon name="plane" />
        <span style={{ paddingLeft: '10px' }}>
          {`${flightTo} - ${moment(arrivalTime).format('HH:mm | DD-MM-YY')}`}
        </span>
      </>
    ),
  },
];
const AirplaneTable = () => {
  const dispatch = useDispatch();

  const { data, totalPages } = useSelector((s) => s.contact.searchAirplaneList);
  const loading = useSelector((s) => s.contact.getSearchAirplaneLoading);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({});
  const [selecting, setSelecting] = useState({});

  const getData = useCallback(() => {
    dispatch(searchAirplane({ ...filter, pageSize, pageIndex }));
  }, [dispatch, filter, pageSize, pageIndex]);
  useEffect(getData, [getData]);
  return (
    <>
      <AirplaneFilter onChange={setFilter} />
      <DataTable
        title="Danh sách chuyến bay"
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
      <AirplaneModal
        data={selecting}
        onClose={() => setSelecting({})}
        onRefresh={getData}
      />
    </>
  );
};

export default AirplaneTable;
