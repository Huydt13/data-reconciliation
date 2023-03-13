import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { FiFileText, FiExternalLink } from 'react-icons/fi';
import { DataTable } from 'app/components/shared';
import InfectiousDiseaseFilter from 'profile/components/infectious-disease/InfectiousDiseaseFilter';
import InfectiousDiseaseDetailModal from 'profile/components/infectious-disease/InfectiousDiseaseDetailModal';

import { useDispatch, useSelector } from 'react-redux';
import { getInfectiousDiseaseHistories } from 'profile/actions/profile';
import { formatAddressToString, formatToTime, renderProfileKey } from 'app/utils/helpers';

const columns = [
  {
    Header: 'ID hồ sơ',
    formatter: ({ profile }) => profile?.id,
  },
  {
    Header: 'Tên',
    formatter: ({ profile }) => profile?.fullName ?? '',
    cutlength: 50,
  },
  {
    Header: 'Ngày sinh',
    formatter: ({ profile }) => profile?.dateOfBirth
        ? !profile?.hasYearOfBirthOnly
          ? moment(profile.dateOfBirth).format('DD-MM-YYYY')
          : moment(profile.dateOfBirth).format('YYYY')
        : 'Chưa xác định',
  },
  {
    Header: 'Địa chỉ nhà',
    formatter: ({ profile }) => formatAddressToString(profile?.addressesInVietnam[0] ?? []),
    cutlength: 50,
  },
  {
    Header: 'Thông tin xác thực',
    formatter: ({ profile }) => renderProfileKey({ ...profile, keyWithAddress: false }),
  },
  {
    Header: 'Số điện thoại',
    formatter: ({ profile }) => profile?.phoneNumber,
  },
  {
    Header: 'Số lần bị nhiễm',
    accessor: 'numberOfPositiveTimes',
  },
  {
    Header: 'Lần gần nhất bị nhiễm',
    formatter: ({ lastPositiveTime }) => formatToTime(lastPositiveTime),
  },
];

const InfectiousDiseaseTable = ({ isNewest }) => {
  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [modalDetail, setModalDetail] = useState(undefined);

  const dispatch = useDispatch();
  const {
    infectiousDiseaseHistoriesData: { totalPages, totalRows, data },
    getInfectiousDiseaseHistoriesLoading,
  } = useSelector((state) => state.profile);

  const getData = useCallback(() => {
    dispatch(getInfectiousDiseaseHistories({
      ...filter,
      IsPositive: isNewest ? true : filter.isPositive,
      FromDate: filter.FromDate,
      ToDate: filter.ToDate,
      PageIndex: pageIndex,
      PageSize: pageSize,
    }));
  }, [dispatch, isNewest, filter, pageIndex, pageSize]);
  useEffect(getData, [getData]);

  return (
    <>
      <InfectiousDiseaseFilter hasDateFilter={!isNewest} onChange={setFilter} />
      <DataTable
        title={`Danh sách F0 ${isNewest ? 'mới' : ''}`}
        loading={getInfectiousDiseaseHistoriesLoading}
        columns={columns}
        data={data || []}
        pageCount={totalPages}
        totalCount={totalRows}
        onPaginationChange={({ pageIndex: pi, pageSize: ps }) => {
          setPageIndex(pi);
          setPageSize(ps);
        }}
        actions={[
          {
            icon: <FiExternalLink />,
            title: 'Lịch sử bị nhiễm',
            color: 'purple',
            onClick: (r) => setModalDetail(r),
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (r) => window.open(`/profile/${r.profileId}`, '_blank'),
          },
        ]}
      />

      <InfectiousDiseaseDetailModal
        data={modalDetail}
        onClose={() => setModalDetail(undefined)}
      />
    </>
  );
};

InfectiousDiseaseTable.defaultProps = {
  isNewest: false,
};

InfectiousDiseaseTable.propTypes = {
  isNewest: PropTypes.bool,
};

export default InfectiousDiseaseTable;
