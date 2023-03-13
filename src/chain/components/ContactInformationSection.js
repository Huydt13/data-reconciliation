import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FiFileText, FiList } from 'react-icons/fi';

import moment from 'moment';

import { useSelector } from 'react-redux';

import { DataTable } from 'app/components/shared';
import EvaluateModal from 'chain/components/EvaluateModal';
import { getFullLocationName } from 'app/utils/helpers';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Các mốc dịch',
    formatter: getFullLocationName,
  },
  {
    Header: 'Thời gian',
    formatter: (r) =>
      `${moment(r.fromTime).format('HH:mm | DD-MM')} ~ ${moment(
        r.toTime,
      ).format('HH:mm | DD-MM')}`,
  },
  {
    Header: 'Tiếp xúc gần',
    accessor: 'numberOfCloseContacts',
  },
  {
    Header: 'Tiếp xúc khác',
    accessor: 'numberOfOtherContacts',
  },
  {
    Header: 'Tiếp cận được',
    accessor: 'numberOfApproachedSubjects',
  },
  {
    Header: 'Đã lấy mẫu',
    accessor: 'numberOfExaminedSubjects',
  },
  {
    Header: 'Dương tính',
    accessor: 'numberOfExaminedPositiveSubjects',
  },
  {
    Header: 'Âm tính',
    accessor: 'numberOfExaminedNegativeSubjects',
  },
  {
    Header: 'Chờ kết quả',
    accessor: 'numberOfExaminedWaitingSubjects',
  },
];

const ContactInformationSection = ({ onPaginationChange }) => {
  const [investigateModal, setInvestigateModal] = useState(false);
  const {
    contactsByChainData: { data, totalPages },
    getContactsByChainLoading,
  } = useSelector((s) => s.chain);
  return (
    <div>
      <DataTable
        title="Thông tin tiếp xúc"
        columns={columns}
        data={data.map((d, i) => ({ ...d, index: i + 1 }))}
        pageCount={totalPages}
        loading={getContactsByChainLoading}
        onPaginationChange={onPaginationChange}
        actions={[
          {
            icon: <FiList />,
            title: 'Điều tra',
            color: 'violet',
            onClick: () => setInvestigateModal(true),
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: ({ id }) => window.open(`/profile/${id}`, '_blank'),
          },
        ]}
      />
      <EvaluateModal
        open={investigateModal}
        onClose={() => setInvestigateModal(false)}
      />
    </div>
  );
};

ContactInformationSection.propTypes = {
  onPaginationChange: PropTypes.func.isRequired,
};

export default ContactInformationSection;
