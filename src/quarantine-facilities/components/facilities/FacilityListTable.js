import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiChevronRight, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import {
  deleteFacility,
  getFacilities,
  selectFacility,
  selectRoom,
} from 'quarantine-facilities/actions/quarantine-facility';

import { DataTable } from 'app/components/shared';
import { checkFilter, formatAddress } from 'app/utils/helpers';

import { Breadcrumb } from 'semantic-ui-react';
import FacilityModal from './FacilityModal';
import FacilityListFilter from './FacilityListFilter';
import FacilityRoomListTable from '../quarantine-in-facility/being/FacilityRoomListTable';
import FacilityPeopleInRoomTable from '../quarantine-in-facility/being/FacilityPeopleInRoomTable';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Khu', accessor: 'name' },
  { Header: 'Người liên hệ', accessor: 'contactName' },
  { Header: 'SDT liên hệ', accessor: 'contactPhone' },
  {
    Header: 'Loại hình',
    formatter: ({ type }) =>
      // eslint-disable-next-line no-nested-ternary
      type === 0
        ? 'Cách ly tập trung'
        : type === 1
        ? 'Cách ly điều trị'
        : 'Bệnh viện',
  },
  { Header: 'Tổng số phòng', formatter: ({ totalRoom }) => totalRoom },
  {
    Header: 'Tổng số giường',
    formatter: ({ totalOccupancy }) => totalOccupancy,
  },
  {
    Header: 'Tổng số người đang cách ly',
    formatter: ({ totalOccupier }) => totalOccupier,
  },
  {
    Header: 'Tổng số giường còn lại',
    formatter: ({ availableOccupancy }) => availableOccupancy,
  },
  {
    Header: 'Tổng số giường sẵn sàng',
    formatter: ({ readyOccupancy }) => readyOccupancy,
  },
];

const FacilityListTable = () => {
  const { facilityData, getFacilitiesLoading, deleteFacilityLoading } =
    useSelector((s) => s.quarantineFacility);
  const { data, totalPages } = facilityData;

  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [facilityModal, setFacilityModal] = useState(false);
  const [selectingRow, setSelectingRow] = useState({});

  const { selectedFacility, selectedRoom } = useSelector(
    (s) => s.quarantineFacility,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(selectFacility(undefined));
    dispatch(
      getFacilities({
        ...filter,
        pageSize,
        pageIndex,
      }),
    );
  }, [dispatch, filter, pageSize, pageIndex]);

  useEffect(getData, [getData]);

  const sections = useMemo(() => {
    const bc = [
      {
        key: 0,
        content: !selectedFacility ? 'Khu cách ly' : selectedFacility.name,
        active: !selectedFacility,
        onClick: () => {
          dispatch(selectFacility(undefined));
          dispatch(selectRoom(undefined));
        },
      },
    ];

    if (selectedFacility) {
      bc.push({
        key: 1,
        content: !selectedRoom
          ? 'Danh sách phòng trong khu'
          : selectedRoom.name,
        onClick: () => dispatch(selectRoom(undefined)),
      });
    }

    if (selectedRoom) {
      bc.push({
        key: 2,
        content: 'Danh sách đối tượng trong phòng',
        active: true,
      });
    }

    return bc;
  }, [dispatch, selectedFacility, selectedRoom]);

  const table = useMemo(
    () => (
      <>
        <FacilityListFilter
          onChange={(d) => checkFilter(filter, d) && setFilter(d)}
        />
        <DataTable
          columns={columns}
          title="Danh sách khu cách ly"
          data={formatAddress(data || [])
            .filter((d) => !d.isTreatmentZone)
            .map((r, i) => ({ ...r, index: i + 1 }))}
          pageCount={totalPages}
          onPaginationChange={(p) => {
            setPageIndex(p.pageIndex);
            setPageSize(p.pageSize);
          }}
          onRowClick={(r) => dispatch(selectFacility(r))}
          loading={getFacilitiesLoading || deleteFacilityLoading}
          actions={[
            {
              title: 'Thêm khu cách ly',
              color: 'green',
              icon: <FiPlus />,
              onClick: () => {
                setFacilityModal(true);
                setSelectingRow({});
              },
              globalAction: true,
            },
            {
              title: 'Cập nhật thông tin',
              color: 'violet',
              icon: <FiEdit2 />,
              onClick: (r) => {
                setFacilityModal(true);
                setSelectingRow(r);
              },
            },
            {
              title: 'Xoá khu cách ly',
              color: 'red',
              icon: <FiTrash2 />,
              onClick: (row) =>
                dispatch(
                  showConfirmModal('Xác nhận xóa?', () =>
                    dispatch(deleteFacility(row.id)).then(getData),
                  ),
                ),
            },
          ]}
        />
      </>
    ),
    [
      data,
      totalPages,
      filter,
      getFacilitiesLoading,
      deleteFacilityLoading,
      dispatch,
      getData,
    ],
  );

  const handleRefresh = useCallback(() => {
    dispatch(selectRoom(undefined));
  }, [dispatch]);

  const facilityRoomListTable = useMemo(() => <FacilityRoomListTable />, []);
  const facilityPeopleInRoomTable = useMemo(
    () => <FacilityPeopleInRoomTable onRefresh={handleRefresh} />,
    [handleRefresh],
  );

  return (
    <div>
      <BreadcrumbWrapper>
        <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
      </BreadcrumbWrapper>
      {!selectedFacility && table}
      {selectedFacility && !selectedRoom && facilityRoomListTable}
      {selectedFacility && selectedRoom && facilityPeopleInRoomTable}

      <FacilityModal
        open={facilityModal}
        onClose={() => setFacilityModal(false)}
        data={selectingRow}
        onSubmit={getData}
      />
    </div>
  );
};

export default FacilityListTable;
