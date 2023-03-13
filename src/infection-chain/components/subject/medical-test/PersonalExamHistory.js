/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import moment from 'moment';

import { Breadcrumb } from 'semantic-ui-react';
import { FiChevronRight, FiCommand, FiRefreshCw } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { DataTable } from 'app/components/shared';

import { useSelector, useDispatch } from 'react-redux';
import {
  getPersonalExamHistory,
  getUnitInfo,
  getByProfileId,
  createAssignWithDate,
  updateProfile,
  getPrefixes,
} from 'medical-test/actions/medical-test';

import { getAssignStatus, getSourceType } from 'infection-chain/utils/helpers';
import { CreateFromType } from 'infection-chain/utils/constants';
import { formatToDate } from 'app/utils/helpers';

import ProcessModal from './ProcessModal';
import PersonalExamHistoryDetailTable from './PersonalExamHistoryDetailTable';

const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;
const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Tên cơ sở', formatter: (row) => row.unit.name },
  {
    Header: 'Ngày chỉ định',
    formatter: ({ dateAssigned }) => moment(dateAssigned).format('YYYY') !== '0001'
        ? moment(dateAssigned).format('DD-MM-YYYY')
        : '',
  },
  {
    Header: 'Loại chỉ định',
    formatter: ({ person }) => (person.isGroup ? 'Gộp' : 'Đơn'),
  },
  { Header: 'Nguồn', formatter: (row) => getSourceType(row.source)?.label },
  {
    Header: 'Trạng thái',
    formatter: (row) => getAssignStatus(row.status)?.label,
  },
];

const PersonalExamHistoryTable = (props) => {
  const { loading: loadingProp, profile } = props;

  const [selected, setSelected] = useState(undefined);

  const {
    unitInfo,
    prefixList,
    personalExamHistoryList,
    getPersonalExamHistoryLoading,
    getMedicalTestLoading,
    createAssignLoading,
    getPeopleByProfileIdLoading,
    updateProfileLoading,
  } = useSelector((state) => state.medicalTest);

  const loading = loadingProp
    || getPeopleByProfileIdLoading
    || getMedicalTestLoading
    || createAssignLoading
    || getPersonalExamHistoryLoading
    || updateProfileLoading;

  const dispatch = useDispatch();

  const { id } = useParams();
  // === ko - is profileId, có - là guid
  const isProfileId = id.indexOf('-') === -1;
  const personId = profile?.id ?? id;

  // if profile then get examination id of that person
  useEffect(() => {
    if (isProfileId) {
      dispatch(getByProfileId(personId));
    }
  }, [dispatch, personId, isProfileId]);

  // if profile then get examination
  const handleRefresh = useCallback(() => {
    dispatch(
      getPersonalExamHistory({
        profileId: id,
      }),
    );
  }, [id, dispatch]);

  useEffect(handleRefresh, []);

  const [processModal, setProcessModal] = useState(false);
  const handleProcess = (d) => {
    dispatch(
      createAssignWithDate({
        ...d,
        profileId: personId,
      }),
    ).then(() => {
      handleRefresh();
      setProcessModal(false);
    });
  };

  useEffect(() => {
    if (!unitInfo) {
      dispatch(getUnitInfo());
    }
    if (prefixList.length === 0) {
      dispatch(getPrefixes());
    }
    // eslint-disable-next-line
  }, [dispatch]);

  const dataTable = useMemo(
    () => (
      <DataTable
        title="Lịch sử xét nghiệm"
        columns={columns}
        data={(personalExamHistoryList || []).map((h, i) => ({
          ...h,
          index: i + 1,
        }))}
        loading={loading}
        onRowClick={(d) => {
          if (d.examinationId) {
            setSelected(d);
          } else {
            toast.info('Chưa có dữ liệu');
          }
        }}
        actions={[
          {
            icon: <FiRefreshCw />,
            title: 'Đồng bộ dữ liệu hồ sơ',
            color: 'blue',
            globalAction: true,
            onClick: () => dispatch(updateProfile(id)),
          },
          {
            icon: <FiCommand />,
            title: 'Chỉ định xét nghiệm',
            color: 'yellow',
            globalAction: true,
            onClick: () => setProcessModal(true),
            disabled: !(
              profile?.cccd
              || profile?.cmnd
              || profile?.passportNumber
              || profile?.healthInsuranceNumber
            ),
            hidden: profile?.createFromType === CreateFromType.QUARANTINE,
          },
        ]}
      />
    ),
    [id, loading, personalExamHistoryList, profile, dispatch],
  );

  const sections = useMemo(() => {
    const bc = [
      {
        key: 0,
        content: selected && 'Lịch sử xét nghiệm',
        active: !selected,
        onClick: () => setSelected(undefined),
      },
    ];

    if (selected) {
      bc.push({
        key: 1,
        content: `Ngày chỉ định ${formatToDate(selected.dateAssigned)}`,
        active: true,
      });
    }

    return bc;
  }, [selected]);

  return (
    <div>
      {selected ? (
        <>
          <BreadcrumbWrapper>
            <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
          </BreadcrumbWrapper>
          <PersonalExamHistoryDetailTable data={selected} />
        </>
      ) : (
        dataTable
      )}
      <ProcessModal
        key={processModal ? 'OpenProcessModal' : 'CloseProcessModal'}
        open={processModal}
        onClose={() => setProcessModal(false)}
        onSubmit={handleProcess}
      />
    </div>
  );
};

PersonalExamHistoryTable.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.number,
    diseaseLocation: PropTypes.shape({}),
    type: PropTypes.number,
    code: PropTypes.string,
    createFromType: PropTypes.number,
  }),
  loading: PropTypes.bool,
};

PersonalExamHistoryTable.defaultProps = {
  profile: {},
  loading: false,
};

export default PersonalExamHistoryTable;
