import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Label } from 'semantic-ui-react';
import { FiFileText } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { getChainDetail, getChainSubjects } from 'chain/actions/chain';

import { formatToYear } from 'app/utils/helpers';

import { DataTable } from 'app/components/shared';
import ContactBySubjectTable from './ContactBySubjectTable';

const columns = [
  {
    Header: 'Loại',
    formatter: (row) => (
      <Label
        basic
        color={row?.infectionType?.colorCode ?? 'black'}
        content={row?.infectionType?.name ?? 'F?'}
        className="type-label"
      />
    ),
  },
  {
    Header: 'Họ và tên',
    formatter: ({ profileDetail: { fullName } }) => fullName,
  },
  {
    Header: 'Năm sinh',
    formatter: ({ profileDetail: { dateOfBirth } }) =>
      formatToYear(dateOfBirth),
  },
  { Header: 'Căn cước', formatter: ({ profileDetail: { cccd } }) => cccd },
  { Header: 'Chứng minh', formatter: ({ profileDetail: { cmnd } }) => cmnd },
  {
    Header: 'Hộ chiếu',
    formatter: ({ profileDetail: { passportNumber } }) => passportNumber,
  },
  {
    Header: 'Bảo hiểm',
    formatter: ({ profileDetail: { healthInsuranceNumber } }) =>
      healthInsuranceNumber,
  },
];

const ChainSubjectsTable = ({ chainId }) => {
  const dispatch = useDispatch();
  const {
    getChainDetailLoading,
    chainSubjectsData: { data, totalPages },
    getChainSubjectsLoading,
  } = useSelector((s) => s.chain);

  const loading = getChainDetailLoading || getChainSubjectsLoading;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const getChainData = useCallback(() => {
    dispatch(getChainDetail(chainId));
  }, [dispatch, chainId]);

  const getChainSubjectsData = useCallback(() => {
    dispatch(getChainSubjects({ chainId, pageSize, pageIndex }));
  }, [dispatch, chainId, pageSize, pageIndex]);

  useEffect(() => {
    getChainData();
    getChainSubjectsData();
  }, [getChainData, getChainSubjectsData]);
  return (
    <div>
      <DataTable
        title="Danh sách đối tượng"
        loading={loading}
        columns={columns}
        data={(data || []).map((d, i) => ({
          ...d,
          index: i + 1,
          profileDetail: d.profileDetail || {
            fullName: '',
            dateOfBirth: '',
            cccd: '',
            cmnd: '',
            passportNumber: '',
            healthInsuranceNumber: '',
          },
        }))}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageIndex(pi);
          setPageSize(ps);
        }}
        pageCount={totalPages}
        actions={[
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: ({ profileId: pId }) =>
              window.open(
                `/profile/${pId}/infection-chain/${chainId}`,
                '_blank',
              ),
          },
        ]}
        subComponent={({
          id: subjectId,
          profileId,
          infectionType,
          profileDetail: { fullName },
        }) => (
          <ContactBySubjectTable
            chainId={chainId}
            subjectId={subjectId}
            infectionTypeId={infectionType?.id ?? ''}
            profileId={profileId}
            profileName={fullName}
          />
        )}
      />
    </div>
  );
};

ChainSubjectsTable.propTypes = {
  chainId: PropTypes.string,
};

ChainSubjectsTable.defaultProps = {
  chainId: '',
};

export default ChainSubjectsTable;
