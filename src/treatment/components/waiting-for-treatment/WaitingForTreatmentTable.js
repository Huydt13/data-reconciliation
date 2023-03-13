/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';

import { FiUserPlus } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { getProfileList } from 'treatment/actions/profile-list';

import { DataTable } from 'app/components/shared';
import { checkFilter, formatAddressToString } from 'app/utils/helpers';

import WaitingForTreatmentFilter from './WaitingForTreatmentFilter';
import AddFilteredProfileToTreatmentModal from '../shared/AddFilteredProfileToTreatmentModal';

const columns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Địa chỉ',
    formatter: ({ address }) => formatAddressToString(address),
  },
  {
    Header: 'Ghi chú',
    formatter: ({ description }) => description,
  },
];

const WaitingForTreatmentTable = () => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [addProfileListModal, setAddProfileListModal] = useState(false);

  const { data, pageCount } = useSelector(
    (s) => s.treatment.profileList.profileListData,
  );
  const getDataLoading = useSelector(
    (s) => s.treatment.profileList.getProfileListLoading,
  );

  const getData = useCallback(() => {
    dispatch(
      getProfileList({
        ...filter,
        pageSize,
        pageIndex,
      }),
    );
  }, [dispatch, filter, pageIndex, pageSize]);

  useEffect(getData, [getData]);

  return (
    <div>
      <WaitingForTreatmentFilter
        onChange={(d) => checkFilter(filter, d) && setFilter(d)}
      />
      <DataTable
        title="Danh sách chờ điều trị"
        columns={columns}
        data={data.map((d, i) => ({ ...d, index: i + 1 }))}
        actions={[
          {
            title: 'Tạo',
            color: 'green',
            icon: <FiUserPlus />,
            onClick: () => {
              setAddProfileListModal(true);
            },
            globalAction: true,
          },
        ]}
        loading={getDataLoading}
        pageCount={pageCount}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageSize(ps);
          setPageIndex(pi);
        }}
      />

      <AddFilteredProfileToTreatmentModal
        key={addProfileListModal ? 'OpenAddProfileModal' : 'CloseProfileModal'}
        open={addProfileListModal}
        onClose={() => setAddProfileListModal(false)}
        getData={getData}
      />
    </div>
  );
};

export default WaitingForTreatmentTable;
