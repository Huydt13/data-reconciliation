/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import { FiChevronRight, FiCommand } from 'react-icons/fi';
import { Breadcrumb } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import PersonalQuickTestHistoryDetailTable from 'medical-test/components/quick-test/PersonalQuickTestHistoryDetailTable';

import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';
import {
  createAssignQuickTest,
  getPersonalQuickTestHistory,
} from 'medical-test/actions/medical-test';
import { getAssignQuickTestStatus } from 'medical-test/utils/helpers';

const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;
const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Tên cơ sở', formatter: (row) => row?.unit?.name },
  {
    Header: 'Trạng thái',
    formatter: (row) => getAssignQuickTestStatus(row?.status)?.label,
  },
];

const PersonalQuickTestHistoryTable = (props) => {
  const { loading: loadingProp, profile } = props;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(undefined);

  const { id } = useParams();
  const { isUsername } = useAuth();
  const dispatch = useDispatch();
  const { personalQuickTestHistoryList, getPersonalQuickTestHistoryLoading } =
    useSelector((state) => state.medicalTest);

  const loading = loadingProp || getPersonalQuickTestHistoryLoading;
  const handleRefresh = useCallback(() => {
    dispatch(
      getPersonalQuickTestHistory({
        profileId: profile?.id ?? id,
        pageIndex,
        pageSize,
      })
    );
  }, [dispatch, id, profile, pageIndex, pageSize]);
  useEffect(handleRefresh, [handleRefresh]);

  const handleCreateAssignQuickTest = async () => {
    try {
      await dispatch(createAssignQuickTest([{ profileId: profile?.id ?? id }]));
      handleRefresh();
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  const dataTable = useMemo(
    () => (
      <DataTable
        title='Lịch sử test nhanh'
        loading={loading}
        columns={columns}
        data={personalQuickTestHistoryList.map((h, i) => ({
          ...h,
          index: i + 1,
        }))}
        onRowClick={(d) => {
          if (d.id) {
            setSelected(d);
          } else {
            toast.info('Chưa có dữ liệu');
          }
        }}
        actions={[
          {
            icon: <FiCommand />,
            title: 'Chỉ định xét nghiệm',
            color: 'yellow',
            globalAction: true,
            onClick: () => handleCreateAssignQuickTest(),
            disabled: !(
              profile?.cccd ||
              profile?.cmnd ||
              profile?.passportNumber ||
              profile?.healthInsuranceNumber
            ),
            hidden: isUsername('hcdc'),
          },
        ]}
      />
      // eslint-disable-next-line
    ),
    [loading, profile, personalQuickTestHistoryList, isUsername]
  );

  const sections = useMemo(() => {
    const bc = [
      {
        key: 0,
        content: selected && 'Lịch sử test nhanh',
        active: !selected,
        onClick: () => setSelected(undefined),
      },
    ];

    return bc;
  }, [selected]);

  return (
    <div>
      {selected ? (
        <>
          <BreadcrumbWrapper>
            <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
          </BreadcrumbWrapper>
          <PersonalQuickTestHistoryDetailTable data={selected} />
        </>
      ) : (
        dataTable
      )}
    </div>
  );
};

PersonalQuickTestHistoryTable.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.number,
  }),
  loading: PropTypes.bool,
};

PersonalQuickTestHistoryTable.defaultProps = {
  profile: {},
  loading: false,
};

export default PersonalQuickTestHistoryTable;
