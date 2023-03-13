/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';

import { DataTable } from 'app/components/shared';
import { FiFileText, FiList } from 'react-icons/fi';

import EvaluateModal from 'chain/components/EvaluateModal';
import { Label } from 'semantic-ui-react';
import { getFullLocationName } from 'app/utils/helpers';

const columns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Nhãn thông báo',
    formatter: ({ infectionTypeFromSubjectFromInvestigation }) => (
      <Label
        basic
        color={infectionTypeFromSubjectFromInvestigation?.colorCode ?? 'black'}
        content={infectionTypeFromSubjectFromInvestigation?.name ?? 'F?'}
        className="type-label"
      />
    ),
  },
  {
    Header: 'Nhãn điều tra',
    formatter: ({ infectionTypeFromSubjectToInvestigation }) => (
      <Label
        basic
        color={infectionTypeFromSubjectToInvestigation?.colorCode ?? 'black'}
        content={infectionTypeFromSubjectToInvestigation?.name ?? 'F?'}
        className="type-label"
      />
    ),
  },
  {
    Header: 'Nơi tiếp xúc',
    formatter: getFullLocationName,
  },
  {
    Header: 'Từ thời gian',
    formatter: ({ fromTime }) => moment(fromTime).format('HH:mm | DD-MM'),
  },
  {
    Header: 'Đến thời gian',
    formatter: ({ toTime }) => moment(toTime).format('HH:mm | DD-MM'),
  },
  {
    Header: 'Người chỉ điểm',
    formatter: ({ subjectFrom }) => subjectFrom?.profileDetail?.fullName,
  },
];
const InformSubjectSection = ({
  onPaginationChange,
  onRefresh: onRefreshProp,
}) => {
  const [selected, setSelected] = useState({});
  const {
    contactData: { data, totalPages },
    getContactsBySubjectLoading,
  } = useSelector((s) => s.chain);
  return (
    <div>
      <DataTable
        title="Thông tin chỉ điểm"
        columns={columns}
        data={data.map((d, i) => ({ ...d, index: i + 1 }))}
        pageCount={totalPages}
        loading={getContactsBySubjectLoading}
        onPaginationChange={onPaginationChange}
        actions={[
          {
            icon: <FiList />,
            title: 'Phiếu đánh giá tiếp xúc',
            color: 'violet',
            onClick: setSelected,
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ người chỉ điểm',
            color: 'blue',
            onClick: ({ subjectFrom }) =>
              window.open(`/profile/${subjectFrom?.profileId}`, '_blank'),
            hidden: ({ subjectFrom }) => !subjectFrom?.profileId,
          },
        ]}
      />
      <EvaluateModal
        data={selected}
        onClose={() => setSelected({})}
        onRefresh={onRefreshProp}
      />
    </div>
  );
};

InformSubjectSection.propTypes = {
  onPaginationChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default InformSubjectSection;
