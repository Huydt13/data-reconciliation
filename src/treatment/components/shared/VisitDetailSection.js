/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { FiPlus, FiChevronRight, FiCheck, FiEdit3 } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { getVisits } from 'treatment/actions/visit';
import { Breadcrumb } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import { formatToTime } from 'app/utils/helpers';
import VisitModal from './VisitModal';
import CompleteVisitModal from './CompleteVisitModal';

const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;
const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Địa điểm', accessor: 'place' },
  {
    Header: 'Thời gian',
    formatter: ({ visitTime }) => formatToTime(visitTime),
  },
  {
    Header: 'Ghi chú',
    formatter: ({ note, closeNote }) => (
      <>
        {note && `Thăm khám: ${note}`}
        {note && closeNote && <br />}
        {closeNote && `Hoàn thành: ${closeNote}`}
      </>
    ),
  },
  {
    Header: 'Trạng thái',
    formatter: ({ status }) =>
      status === 0 ? (
        <b style={{ color: '#DB2729' }}>Chưa hoàn thành</b>
      ) : (
        <b style={{ color: '#21BA44' }}>Đã hoàn thành</b>
      ),
  },
];
const VisitDetailSection = ({ onClose, data }) => {
  const dispatch = useDispatch();

  const { data: visitData, pageCount } = useSelector(
    (s) => s.treatment.visit.visitData,
  );
  const loading = useSelector((s) => s.treatment.visit.getVisitsLoading);

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [selecting, setSelecting] = useState(undefined);
  const [visitModal, setVisitModal] = useState(false);
  const [completeVisitModal, setCompleteVisitModal] = useState(false);

  const getData = useCallback(() => {
    if (Boolean(data.profile.id) && Boolean(data.profile.id)) {
      setSelecting(data);
      dispatch(
        getVisits({
          facilityId: data.facility.id,
          profileId: data.profile.id,
          pageSize,
          pageIndex,
        }),
      );
    }
  }, [dispatch, data, pageSize, pageIndex]);

  useEffect(getData, [getData]);

  return (
    <div>
      <BreadcrumbWrapper>
        <Breadcrumb
          sections={[
            {
              key: 0,
              content: data.profile.fullName,
              active: false,
              onClick: onClose,
            },
            {
              key: 1,
              content: 'Lịch sử thăm khám',
              active: true,
            },
          ]}
          icon={<StyledChevronRight />}
        />
      </BreadcrumbWrapper>

      <DataTable
        title="Lịch sử thăm khám"
        columns={columns}
        data={visitData.map((r, i) => ({ ...r, index: i + 1 }))}
        loading={loading}
        pageCount={pageCount}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageSize(ps);
          setPageIndex(pi);
        }}
        actions={[
          {
            icon: <FiPlus />,
            title: 'Tạo phiên thăm khám',
            color: 'green',
            onClick: () => {
              setSelecting(data);
              setVisitModal(true);
            },
            globalAction: true,
          },
          {
            icon: <FiEdit3 />,
            title: 'Cập nhật',
            color: 'violet',
            onClick: (r) => {
              setSelecting(r);
              setVisitModal(true);
            },
          },
          {
            icon: <FiCheck />,
            title: 'Kết thúc',
            color: 'green',
            onClick: (r) => {
              setSelecting({
                ...r,
                ...data,
              });
              setCompleteVisitModal(true);
            },
          },
        ]}
      />

      <VisitModal
        key={visitModal ? 'OpenVisitDetailModal' : 'CloseVisitDetailModal'}
        open={visitModal}
        onClose={() => {
          setVisitModal(false);
          setSelecting(data);
        }}
        data={selecting}
        getData={getData}
      />

      <CompleteVisitModal
        key={
          completeVisitModal
            ? 'OpenCompleteVisitDetailModal'
            : 'CloseCompleteVisitDetailModal'
        }
        open={completeVisitModal}
        onClose={() => {
          setCompleteVisitModal(false);
          setSelecting(data);
        }}
        data={selecting}
        getData={getData}
      />
    </div>
  );
};

VisitDetailSection.propTypes = {
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    profile: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    facility: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default VisitDetailSection;
