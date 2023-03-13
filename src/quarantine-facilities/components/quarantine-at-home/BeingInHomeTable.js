/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiCommand, FiFileText } from 'react-icons/fi';

import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';
import { getInHome } from 'quarantine-facilities/actions/quarantine-facility';
import {
  createAssignWithDate,
  getPrefixes,
  getUnitInfo,
} from 'medical-test/actions/medical-test';
import { DataTable } from 'app/components/shared';
import { checkFilter, formatAddressToString } from 'app/utils/helpers';

import ProcessModal from 'infection-chain/components/subject/medical-test/ProcessModal';
import FacilityFilter from '../quarantine-in-facility/FacilityFilter';

const FacilityInHomeTable = () => {
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();

  const { inHomeData, getInHomeLoading } = useSelector(
    (s) => s.quarantineFacility,
  );
  const { data, totalPages } = inHomeData;

  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getPrefixes());
    dispatch(getUnitInfo());
  }, [dispatch]);

  const [profileId, setProfileId] = useState('');
  const [processModal, setProcessModal] = useState(false);
  const handleProcess = async (d) => {
    await dispatch(
      createAssignWithDate({
        ...d,
        profileId,
      }),
    );
    setProfileId('');
    setProcessModal(false);
  };

  const getData = useCallback(() => {
    dispatch(
      getInHome({
        ...filter,
        pageSize,
        pageIndex,
      }),
    );
  }, [dispatch, filter, pageSize, pageIndex]);
  useEffect(getData, [getData]);

  const columns = useMemo(() => {
    const columnsTable = [
      { Header: '#', accessor: 'index' },
      { Header: 'Tên', formatter: (r) => r.quarantineForm.requester.fullName },
      {
        Header: 'Ngày/Năm sinh',
        formatter: (r) =>
          r.quarantineForm.requester.dateOfBirth
            ? moment(r.quarantineForm.requester.dateOfBirth).format(
                r.quarantineForm.requester.hasYearOfBirthOnly
                  ? 'YYYY'
                  : 'DD-MM-YYYY',
              )
            : '',
      },
      {
        Header: 'Ngày bắt đầu cách ly tại nhà',
        formatter: (r) =>
          `${moment(r.quarantineForm.homeRequest.startTime).format(
            'DD-MM-YYYY',
          )}`,
      },
      {
        Header: 'Địa chỉ nhà',
        formatter: (r) =>
          formatAddressToString(r.quarantineForm.homeRequest.homeAddress),
      },
    ];
    if (isAdmin) {
      const addingColumns = [
        {
          Header: 'Khu cách ly',
          formatter: (r) => r?.facility.name ?? '',
        },
      ];
      columnsTable.splice(3, 0, ...addingColumns);
    }
    return columnsTable;
  }, [isAdmin]);

  return (
    <div>
      {isAdmin && (
        <FacilityFilter
          onChange={(d) => checkFilter(filter, d) && setFilter(d)}
        />
      )}
      <DataTable
        columns={columns}
        title="Danh sách cách ly tại nhà"
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        pageCount={totalPages}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        loading={getInHomeLoading}
        actions={[
          {
            icon: <FiCommand />,
            title: 'Chỉ định xét nghiệm',
            color: 'yellow',
            onClick: (r) => {
              setProfileId(r.quarantineForm.requester.profileId);
              setProcessModal(true);
            },
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (r) => {
              window.open(
                `/profile/${r.quarantineForm.requester.profileId}/quarantine`,
                '_blank',
              );
            },
          },
        ]}
      />

      <ProcessModal
        key={processModal ? 'OpenProcessModal' : 'CloseProcessModal'}
        open={processModal}
        onClose={() => setProcessModal(false)}
        onSubmit={handleProcess}
      />
    </div>
  );
};

export default FacilityInHomeTable;
