/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';

import {
  FiDownload,
  FiUserPlus,
  // FiTrash2,
  // FiGitMerge,
} from 'react-icons/fi';

import { useHistory } from 'react-router-dom';

import { Label } from 'semantic-ui-react';

import { useSelector, useDispatch } from 'react-redux';
import { getDiseaseTypes, getInfectionTypes } from 'general/actions/general';
// import { useAuth } from 'app/hooks';
// import { showConfirmModal } from 'app/actions/global';
import {
  getSubjects,
  // deleteSubject,
} from 'infection-chain/actions/subject';

import { checkFilter, formatToYear } from 'app/utils/helpers';

import { DataTable } from 'app/components/shared';
import SubjectFilter from './SubjectFilter';
import SubjectChainsTable from './SubjectChainsTable';
import ExportF0Modal from './ExportSubjectsModal';
// import SubjectInfectionChainModal from './information/SubjectInfectionChainModal';

const SubjectTable = ({ isUnverified }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({});

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);

  // const [from, setFrom] = useState(moment().format('YYYY-MM-DD'));
  // const [to, setTo] = useState(moment().format('YYYY-MM-DD'));
  // const [hideDateFilter, setHideDateFilter] = useState(false);

  const { subjectList, getSubjectsLoading, deleteSubjectLoading } = useSelector(
    (state) => state.subject,
  );

  const {
    diseaseTypeData: { data: diseaseTypeOptions },
  } = useSelector((s) => s.general);

  const getData = useCallback(() => {
    dispatch(
      getSubjects({
        ...filter,
        infectionTypeIds: filter?.infectionTypeIds ?? [
          'dac24534-df20-4d45-a3ed-88ef263aa48f',
        ],
        isUnverified,
        pageIndex,
        pageSize,
        // fromTime: from || filter.from,
        // toTime: to || filter.to,
        fromTime: filter.from,
        toTime: filter.to,
      }),
    );
  }, [
    dispatch,
    filter,
    isUnverified,
    pageSize,
    pageIndex,
    // from,
    // to,
  ]);
  useEffect(getData, [getData]);
  useEffect(() => {
    if (diseaseTypeOptions.length !== 0) {
      dispatch(
        getInfectionTypes({
          diseaseTypeId: diseaseTypeOptions.find(
            (d) => d.name.includes('19')?.id ?? '',
          ),
          pageIndex: 0,
          pageSize: 1000,
        }),
      );
    }
  }, [dispatch, diseaseTypeOptions]);

  useEffect(() => {
    dispatch(getDiseaseTypes({ pageIndex: 0, pageSize: 1000 }));
  }, [dispatch]);

  const { data, totalPages } = subjectList;
  const columns = useMemo(() => {
    const defaultColumns = [
      {
        Header: 'Loại',
        formatter: ({ infectionType }) => (
          <Label
            basic
            color={infectionType?.colorCode ?? 'black'}
            content={infectionType?.name ?? 'F?'}
            className="type-label"
          />
        ),
      },
      { Header: 'ID Hồ sơ', accessor: 'profileId' },
      { Header: 'Bí danh CDC', accessor: 'hcdC_Alias' },
      { Header: 'Bí danh HCM', accessor: 'hcM_Alias' },
      { Header: 'Bí danh BYT', accessor: 'byT_Alias' },
      { Header: 'Tên', accessor: 'fullName' },
      {
        Header: 'Năm sinh',
        formatter: ({ dateOfBirth }) => formatToYear(dateOfBirth),
      },
    ];
    if (isUnverified) {
      defaultColumns.splice(1, 4);
    }
    return defaultColumns;
  }, [isUnverified]);

  return (
    <>
      <SubjectFilter
        isUnverified={isUnverified}
        // hideDateFilter={hideDateFilter}
        onChange={(d) => checkFilter(filter, d) && setFilter(d)}
      />
      <DataTable
        title={`Danh sách ${isUnverified ? 'chưa' : 'đã'} xác minh`}
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={getSubjectsLoading || deleteSubjectLoading}
        pageCount={totalPages}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        onRowClick={(row) => window.open(`/profile/${row.profileId}`, '_blank')}
        actions={[
          {
            icon: <FiDownload />,
            title: 'Xuất danh sách đối tượng',
            color: 'blue',
            onClick: () => setOpen(true),
            globalAction: true,
          },
          {
            icon: <FiUserPlus />,
            title: 'Thêm',
            color: 'green',
            onClick: () => history.push('/create-subject'),
            globalAction: true,
          },
        ]}
        subComponent={(r) => (
          <SubjectChainsTable
            profileId={r.profileId}
            profileName={r.fullName}
            data={r.chainInfectionTypes}
          />
        )}
        // filterByDate
        // onFilterByDateChange={({ from: f, to: t, hideDateFilter: h }) => {
        //   setFrom(f);
        //   setTo(t);
        //   setHideDateFilter(h);
        // }}
      />

      <ExportF0Modal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

SubjectTable.propTypes = {
  isUnverified: PropTypes.bool,
};
SubjectTable.defaultProps = {
  isUnverified: false,
};

export default SubjectTable;
