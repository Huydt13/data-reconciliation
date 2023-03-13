/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FiCheck, FiFileText } from 'react-icons/fi';
import { Header } from 'semantic-ui-react';

import { useSelector } from 'react-redux';
import { getProfilesWithouDispatch } from 'profile/actions/profile';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';
import { DataTable } from 'app/components/shared';
import { formatToYear } from 'app/utils/helpers';

import ContactRelativeFilter from './ContactRelativeFilter';

const columns = [
  { Header: 'ID', accessor: 'id' },
  { Header: 'Tên', formatter: (r) => r.fullName, cutlength: 50 },
  {
    Header: 'Năm sinh',
    formatter: ({ dateOfBirth }) => formatToYear(dateOfBirth),
  },
  { Header: 'Căn cước công dân', formatter: ({ cccd }) => cccd, cutlength: 12 },
  {
    Header: 'Chứng minh nhân dân',
    formatter: ({ cmnd }) => cmnd,
    cutlength: 12,
  },
  { Header: 'Hộ chiếu', accessor: 'passportNumber' },
  { Header: 'Số bảo hiểm', accessor: 'healthInsuranceNumber' },
];

const ContactRelativeTable = ({
  notFetchApi,
  profileId,
  toSubjectList,
  onChange,
}) => {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({ name: '', isRelative: false });

  const { changeProfileLoading } = useSelector((state) => state.medicalTest);

  const rowActions = useMemo(
    () => [
      {
        icon: <FiCheck />,
        title: 'Chọn',
        color: 'green',
        onClick: (r) => {
          if (notFetchApi) {
            onChange(r);
          } else {
            setFetching(true);
            httpClient
              .callApi({
                url: `${apiLinks.profiles.get}/${r.id}`,
              })
              .then(({ data: profile }) => {
                onChange({
                  ...profile,
                  criterias: [],
                  profileId: profile?.id,
                  subjectToProfileId: profile?.id,
                });
                setFetching(false);
              });
          }
        },
        hidden: (r) => toSubjectList.map((s) => s.profileId).includes(r.id),
      },
      {
        icon: <FiFileText />,
        title: 'Hồ sơ',
        color: 'blue',
        onClick: (r) => window.open(`/profile/${r.id}`, '_blank'),
      },
    ],
    [notFetchApi, toSubjectList, onChange],
  );

  useEffect(() => {
    setFetching(true);
    const { name, isRelative } = filter;
    getProfilesWithouDispatch({
      name,
      realtedPositiveProfileId: isRelative ? profileId : undefined,
      pageSize,
      pageIndex,
    }).then(({ data: dataRes, totalPages }) => {
      setData(dataRes);
      setPageCount(totalPages);
      setFetching(false);
    });
  }, [profileId, filter, pageSize, pageIndex]);
  return (
    <>
      <Header as="h3">Danh sách hồ sơ trong hệ thống</Header>
      <ContactRelativeFilter onChange={setFilter} />
      <DataTable
        columns={columns}
        data={data || []}
        loading={fetching || changeProfileLoading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={rowActions}
      />
    </>
  );
};

ContactRelativeTable.propTypes = {
  toSubjectList: PropTypes.arrayOf(PropTypes.shape()),
  profileId: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  notFetchApi: PropTypes.bool,
};

ContactRelativeTable.defaultProps = {
  toSubjectList: [],
  profileId: 0,
  notFetchApi: false,
};

export default ContactRelativeTable;
