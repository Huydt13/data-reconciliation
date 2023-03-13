import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { FiCheck, FiUserPlus } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { getFacilities, getFacilityInfo } from 'treatment/actions/facility';
import { getWaitingListByFacility } from 'treatment/actions/waiting-list';

import { useAuth } from 'app/hooks';
import {
  checkFilter,
  formatAddressToString,
  formatToTime,
  formatToYear,
  renderGender,
} from 'app/utils/helpers';

import WaitingToTakeFilter from './WaitingToTakeFilter';
import AddProfileModal from '../shared/AddProfileToTreatmentModal';
import ApproveTreatmentModal from '../shared/ApproveTreatmentModal';
import TreatmentSelectTable from '../shared/TreatmentSelectTable';

const WaitingToTakeTable = () => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [selecting, setSelecting] = useState({});

  const [addProfileModal, setAddProfileModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);

  const facilityInfo = useSelector((s) => s.treatment.facility.facilityInfo);
  const getFacilityInfoLoading = useSelector(
    (s) => s.treatment.facility.getFacilityInfoLoading,
  );

  const { data, pageCount } = useSelector(
    (s) => s.treatment.waitingList.waitingListByFacilityData,
  );
  const getDataLoading = useSelector(
    (s) => s.treatment.waitingList.getWaitingListByFacilityLoading,
  );

  const { isHcdcDtr } = useAuth();
  const columns = useMemo(() => {
    const defaultColumns = [
      {
        Header: '#',
        accessor: 'index',
      },
      {
        Header: 'Họ và tên',
        formatter: ({ profile }) => profile.fullName,
        cutlength: 50,
      },
      {
        Header: 'Năm sinh',
        formatter: ({ profile }) => formatToYear(profile.dateOfBirth),
      },
      {
        Header: 'Giới tính',
        formatter: ({ profile }) => renderGender(profile),
      },
      {
        Header: 'Số điện thoại',
        formatter: ({ profile }) => profile.phoneNumber,
      },
      {
        Header: 'Địa chỉ nhà',
        formatter: ({ profile }) =>
          formatAddressToString(profile.addressesInVietnam[0] || {}),
      },
      {
        Header: 'Thời gian chỉ định',
        formatter: ({ requestedDate }) => formatToTime(requestedDate),
      },
    ];
    if (isHcdcDtr) {
      defaultColumns.splice(6, 0, {
        Header: 'Cơ sở tiếp nhận',
        formatter: ({ facility }) => facility.name,
      });
    }
    return defaultColumns;
  }, [isHcdcDtr]);
  useEffect(() => {
    if (isHcdcDtr) {
      dispatch(getFacilities({ pageSize: 1000, pageIndex: 0 }));
    } else if (!facilityInfo) {
      dispatch(getFacilityInfo());
    }
  }, [dispatch, isHcdcDtr, facilityInfo]);

  const getData = useCallback(() => {
    if (facilityInfo?.id || isHcdcDtr) {
      dispatch(
        getWaitingListByFacility({
          ...filter,
          facilityId: isHcdcDtr ? filter.facilityId : facilityInfo.id,
          pageSize,
          pageIndex,
        }),
      );
    }
  }, [dispatch, isHcdcDtr, facilityInfo, filter, pageIndex, pageSize]);

  useEffect(getData, [getData]);

  return (
    <div>
      <WaitingToTakeFilter
        onChange={(d) => checkFilter(filter, d) && setFilter(d)}
      />
      <TreatmentSelectTable
        selectable={!isHcdcDtr}
        title="Danh sách chờ tiếp nhận"
        columns={columns}
        data={data.map((d, i) => ({ ...d, index: i + 1 }))}
        actions={[
          {
            icon: <FiUserPlus />,
            title: 'Tạo đối tượng',
            color: 'green',
            globalAction: true,
            hidden: !isHcdcDtr,
            onClick: () => setAddProfileModal(true),
          },
          {
            icon: <FiCheck />,
            title: 'Duyệt',
            color: 'green',
            globalAction: true,
            hidden: isHcdcDtr,
            disabled: (rows) => rows.length === 0,
            onClick: (rows) => {
              setSelecting({
                profileIds: rows.map(({ profile }) => profile.id),
                facilityId: facilityInfo.id,
              });
              setApproveModal(true);
            },
          },
        ]}
        loading={getFacilityInfoLoading || getDataLoading}
        pageCount={pageCount}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageSize(ps);
          setPageIndex(pi);
        }}
      />

      <AddProfileModal
        key={addProfileModal ? 'OpenAddProfileModal' : 'CloseProfileModal'}
        open={addProfileModal}
        onClose={() => setAddProfileModal(false)}
        getData={getData}
      />

      <ApproveTreatmentModal
        key={approveModal ? 'OpenApproveModal' : 'CloseApproveModal'}
        open={approveModal}
        onClose={() => setApproveModal(false)}
        data={selecting}
        getData={getData}
      />
    </div>
  );
};

export default WaitingToTakeTable;
