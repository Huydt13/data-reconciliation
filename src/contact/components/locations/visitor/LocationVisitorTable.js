import React, { useEffect, useState } from 'react';

import { FiPlus } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { getLocationVisitors } from 'contact/actions/location';

import { formatToTime } from 'app/utils/helpers';
import { LocationType } from 'infection-chain/utils/constants';

import { DataTable } from 'app/components/shared';
import VisitorDetailModal from './VisitorDetailModal';
import AddVisitorModal from './AddVisitorModal';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Thời gian',
    formatter: ({ fromTime, toTime }) =>
      `${formatToTime(fromTime)} ~ ${formatToTime(toTime)}`,
  },
  {
    Header: 'Số tiếp xúc',
    formatter: ({ visitorProfileIds }) => visitorProfileIds.length,
  },
];
const LocationVisitorTable = () => {
  const dispatch = useDispatch();

  const selectedEstate = useSelector((s) => s.location.selectedEstate);
  const selectedAirplane = useSelector((s) => s.location.selectedAirplane);
  const selectedVehicle = useSelector((s) => s.location.selectedVehicle);
  const selected = selectedEstate || selectedAirplane || selectedVehicle;

  const locationVisitorsData = useSelector(
    (s) => s.location.locationVisitorsData,
  );
  const getLocationVisitorsLoading = useSelector(
    (s) => s.location.getLocationVisitorsLoading,
  );
  const { data, totalPages } = locationVisitorsData;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectingRow, setSelectingRow] = useState(undefined);
  const [openAddVisitorModal, setOpenAddVisitorModal] = useState(false);

  useEffect(() => {
    const getData = async () => {
      if (selected && !selectingRow && !openAddVisitorModal) {
        switch (selected.id) {
          case selectedEstate?.id:
            await dispatch(
              getLocationVisitors({
                locationId: selected.id,
                locationType: LocationType.LOCATION,
                pageIndex,
                pageSize,
              }),
            );
            break;
          case selectedAirplane?.id:
            await dispatch(
              getLocationVisitors({
                locationId: selected.id,
                locationType: LocationType.AIRPLANE,
                pageIndex,
                pageSize,
              }),
            );
            break;
          case selectedVehicle?.id:
            await dispatch(
              getLocationVisitors({
                locationId: selected.id,
                locationType: LocationType.VEHICLE,
                pageIndex,
                pageSize,
              }),
            );
            break;
          default:
            break;
        }
      }
    };
    getData();
  }, [
    dispatch,
    selected,
    selectedEstate,
    selectedAirplane,
    selectedVehicle,
    pageIndex,
    pageSize,
    selectingRow,
    openAddVisitorModal,
  ]);

  return (
    <>
      <DataTable
        columns={columns}
        loading={getLocationVisitorsLoading}
        data={data.map((r, i) => ({ ...r, index: i + 1 }))}
        pageCount={totalPages}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageSize(ps);
          setPageIndex(pi);
        }}
        onRowClick={setSelectingRow}
        actions={[
          {
            icon: <FiPlus />,
            color: 'green',
            title: 'Thêm mốc dịch tễ',
            onClick: () => setOpenAddVisitorModal(true),
            globalAction: true,
          },
        ]}
      />
      <VisitorDetailModal
        onClose={() => setSelectingRow(undefined)}
        data={selectingRow}
        location={{ ...selected, locationType: LocationType.LOCATION }}
      />
      <AddVisitorModal
        open={openAddVisitorModal}
        data={{ ...selected, locationType: LocationType.LOCATION }}
        onClose={() => {
          setOpenAddVisitorModal(false);
        }}
      />
    </>
  );
};

export default LocationVisitorTable;
