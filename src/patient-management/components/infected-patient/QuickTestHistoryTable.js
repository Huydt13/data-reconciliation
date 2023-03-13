/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import { FiChevronRight, FiCommand } from 'react-icons/fi';
import { Breadcrumb } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';

import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';
import { createAssignQuickTest, getPersonalQuickTestHistory } from 'medical-test/actions/medical-test';
import { getAssignQuickTestStatus } from 'medical-test/utils/helpers';
import QuickTestHistoryDetailTable from './QuickTestHistoryDetailTable';

const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;
const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Tên cơ sở', accessor: 'unit' },
  { Header: 'Trạng thái', formatter: () => (<div>Đã xét nghiệm</div>) },
];

const QuickTestHistoryTable = ({ initialData: { profileHealthDeclarations, profileInformation }, profile, loading, onRefresh }) => {
  const [selected, setSelected] = useState(undefined);

  const { id } = useParams();
  const { isUsername } = useAuth();
  const dispatch = useDispatch();

  const handleCreateAssignQuickTest = async () => {
    try {
      await dispatch(createAssignQuickTest([{ profileId: profile?.id ?? id }]));
      onRefresh();
      // eslint-disable-next-line no-empty
    } catch (error) { }
  };


  const dataTable = useMemo(() => (
    <DataTable
      title="Lịch sử test nhanh"
      columns={columns}
      loading={loading}
      data={profileHealthDeclarations.map((h, i) => ({ ...h, index: i + 1, immunization: { vaccinationStatus: profileInformation?.immunizationStatus, lastInjectionDate: profileInformation?.injectionDate } }))}
      onRowClick={(d) => {
        if (d.guid) {
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
  ), [loading, profileHealthDeclarations, isUsername]);

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
          <QuickTestHistoryDetailTable data={selected} />
        </>
      ) : (
        dataTable
      )}
    </div>
  );
};

QuickTestHistoryTable.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.number,
  }),
  loading: PropTypes.bool,
};

QuickTestHistoryTable.defaultProps = {
  profile: {},
  loading: false,
};

export default QuickTestHistoryTable;
