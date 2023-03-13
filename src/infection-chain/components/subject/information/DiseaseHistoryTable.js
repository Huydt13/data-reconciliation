import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';


import { useDispatch, useSelector } from 'react-redux';

import { DataTable } from 'app/components/shared';
import { formatAddressToString, formatToDate } from 'app/utils/helpers';

import { getInfectiousDiseaseHistoriesByProfile } from 'profile/actions/profile';
import { renderInfectiousReason, renderInfectiousStatus } from 'profile/utils/helpers';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Thời gian',
    formatter: ({ date }) => formatToDate(date),
  },
  {
    Header: 'Tên bệnh',
    formatter: () => (<div>Covid-19</div>),
  },

  {
    Header: 'Loại ca bệnh',
    formatter: () => (<div>Ca bệnh xác định</div>),
  },
  {
    Header: 'Địa chỉ phát bệnh',
    formatter: (r) => r?.airPlane ? `Chuyến bay:${r?.airPlane?.seatNumber}-${r?.airPlane?.flightFrom}`
      : r?.estate ? formatAddressToString({
        ...r?.estate,
        streetHouseNumber: r?.estate.streetHouseNumber ?? '',
      })
        : r?.vehicle ? `Phương tiện :${r?.vehicle?.vehicleName}-${r?.vehicle?.from}`
          : null,
    cutlength: 30,
  },
  {
    Header: 'Địa chỉ cách ly',
    formatter: ({ quarantineAddress }) => formatAddressToString({
        ...quarantineAddress,
        streetHouseNumber: quarantineAddress?.streetHouseNumber ?? '',
      }),
    cutlength: 30,
  },
  {
    Header: 'Trạng thái',
    formatter: ({ infectiousDiseaseStatus }) => renderInfectiousStatus(infectiousDiseaseStatus),
  },
  {
    Header: 'Lý do xác định ca bệnh',
    formatter: ({ infectionReason }) => renderInfectiousReason(infectionReason),
  },
  // {
  //   Header: 'Kết thúc theo tiêu chí',
  //   formatter: ({ takeInTime }) => formatToDate(takeInTime),
  // },
  // {
  //   Header: 'Kết quả',
  //   formatter: ({ actualEndTime }) => formatToDate(actualEndTime),
  // },
];

const DiseaseHistoryTable = ({ profile }) => {
  const {
    infectiousDiseaseHistoriesByProfile: { totalPages, data },
    getInfectiousDiseaseHistoriesByProfileLoading,
  } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // const getData = useCallback(() => {
  //   dispatch(
  //     getHistories({
  //       id: profile.id,
  //       pageSize,
  //       pageIndex,
  //     }),
  //   );
  // }, [dispatch, pageSize, pageIndex, profile]);
  const getData = useCallback(() => {
    if (profile?.id) {
      dispatch(getInfectiousDiseaseHistoriesByProfile({ profileId: profile.id }));
    }
  }, [dispatch, pageSize, pageIndex, profile]);
  useEffect(getData, [getData]);

  return (
    <div>
      <DataTable
        title="Lịch sử ca bệnh"
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={getInfectiousDiseaseHistoriesByProfileLoading}
        pageCount={totalPages}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
      />
    </div>
  );
};

DiseaseHistoryTable.propTypes = {
  // onRefresh: PropTypes.func,
  profile: PropTypes.shape({
    id: PropTypes.number,
    fullName: PropTypes.string,
    information: PropTypes.shape({
      fullName: PropTypes.string,
      alias: PropTypes.string,
    }),
    diseaseLocation: PropTypes.shape({}),
    type: PropTypes.number,
    code: PropTypes.string,
    createFromType: PropTypes.number,
  }),
};

DiseaseHistoryTable.defaultProps = {
  // onRefresh: () => {},
  profile: {},
};

export default DiseaseHistoryTable;
