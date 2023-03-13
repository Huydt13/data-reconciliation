/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FiEdit3 } from 'react-icons/fi';


import { DataTable } from 'app/components/shared';
import { formatAddressToString, formatToDate } from 'app/utils/helpers';

import { renderInfectiousReason, renderInfectiousStatus } from 'profile/utils/helpers';
import { useAuth } from 'app/hooks';
import UpdateQuarantineAddressModal from './UpdateQuarantineAddress';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Thời gian',
    formatter: ({ date }) => formatToDate(date),
  },
  {
    Header: 'Tên bệnh',
    formatter: () => (<div>Covid-19</div>),
  },
  {
    Header: 'Loại ca bệnh',
    formatter: ({ chainType }) => (<div>{chainType === 1 ? 'Nghi ngờ' : 'Xác định'}</div>),
  },
  {
    Header: 'Địa chỉ phát bệnh',
    formatter: ({ diseaseLocation }) => formatAddressToString({
        ...diseaseLocation,
        streetHouseNumber: diseaseLocation?.streetHouseNumber ?? '',
      }),
    cutlength: 30,
  },
  {
    Header: 'Địa chỉ cách ly',
    formatter: ({ quarantineAddress }) => formatAddressToString({
        ...quarantineAddress,
        streetHouseNumber: quarantineAddress?.streetHouseNumber ?? '',
      }),
    cutlength: 30,
  },
  {
    Header: 'Trạng thái',
    formatter: ({ result }) => renderInfectiousStatus(result?.toLowerCase().includes('dương tính') ? 1 : 0),
  },
  {
    Header: 'Lý do xác định ca bệnh',
    formatter: ({ infectionReason }) => renderInfectiousReason(infectionReason),
  },
  // {
  //   Header: 'Kết quả',
  //   formatter: ({ actualEndTime }) => formatToDate(actualEndTime),
  // },
];

const DiseaseHistoryTable = ({ initialData: { profileHealthDeclarations, profileInformation }, loading, onRefresh }) => {
  const [ModalUpdateQuarantinedAddress, setModalUpdateQuarantinedAddress] = useState(undefined);
  const { isAdmin } = useAuth();
  return (
    <div>
      <DataTable
        title="Lịch sử ca bệnh"
        columns={columns}
        loading={loading}
        data={(profileHealthDeclarations || []).map((r, i) => ({ ...r, diseaseLocation: profileInformation?.addressInVietnam, index: i + 1 }))}
        onPaginationChange={() => {
        }}
        actions={[
          {
            icon: <FiEdit3 />,
            title: 'Cập nhật địa chỉ cách ly',
            color: 'yellow',
            onClick: (d) => setModalUpdateQuarantinedAddress(d),
            hidden: !isAdmin,
          },
        ]}
      />
      <UpdateQuarantineAddressModal
        data={ModalUpdateQuarantinedAddress}
        onClose={() => setModalUpdateQuarantinedAddress(undefined)}
        onRefresh={() => onRefresh()}
      />
    </div>

  );
};

DiseaseHistoryTable.propTypes = {
  // onRefresh: PropTypes.func,
  profile: PropTypes.shape({
    id: PropTypes.number,
    fullName: PropTypes.string,
    information: PropTypes.shape({
      fullName: PropTypes.string,
      alias: PropTypes.string,
    }),
    diseaseLocation: PropTypes.shape({}),
    type: PropTypes.number,
    code: PropTypes.string,
    createFromType: PropTypes.number,
  }),
};

DiseaseHistoryTable.defaultProps = {
  // onRefresh: () => {},
  profile: {},
};

export default DiseaseHistoryTable;
