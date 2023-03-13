import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Breadcrumb } from 'semantic-ui-react';
import { FiChevronRight, FiEdit2 } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectFacility,
  getFacilityInfo,
  selectRoom,
} from 'quarantine-facilities/actions/quarantine-facility';

import { DataTable } from 'app/components/shared';
import { formatAddress } from 'app/utils/helpers';

import FacilityModal from 'quarantine-facilities/components/facilities/FacilityModal';
import FacilityRoomListTable from 'quarantine-facilities/components/quarantine-in-facility/being/FacilityRoomListTable';
import FacilityPeopleInRoomTable from 'quarantine-facilities/components/quarantine-in-facility/being/FacilityPeopleInRoomTable';

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

const FacilityInfoTable = () => {
  const {
    facilityInfo,
    getFacilityInfoLoading,
    selectedFacility,
    selectedRoom,
  } = useSelector((s) => s.quarantineFacility);

  const [facilityModal, setFacilityModal] = useState(false);

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(getFacilityInfo());
  }, [dispatch]);

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
      <DataTable
        noPaging
        columns={columns}
        data={formatAddress(facilityInfo || []).map((r, i) => ({
          ...r,
          index: i + 1,
        }))}
        loading={getFacilityInfoLoading}
        onRowClick={(r) => dispatch(selectFacility(r))}
        actions={[
          {
            title: 'Cập nhật thông tin',
            color: 'violet',
            icon: <FiEdit2 />,
            onClick: () => setFacilityModal(true),
          },
        ]}
      />
    ),
    [dispatch, facilityInfo, getFacilityInfoLoading],
  );

  const handleRefresh = useCallback(async () => {
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
        data={facilityInfo[0]}
        onSubmit={getData}
      />
    </div>
  );
};

export default FacilityInfoTable;
