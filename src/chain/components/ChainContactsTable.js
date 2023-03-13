import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { FiDownload } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { exportContactsByChain, getContactsByChain } from 'chain/actions/chain';

import { DataTable } from 'app/components/shared';
import { getFullLocationName, calculateColumnsTotal } from 'app/utils/helpers';

const columns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Các mốc dịch',
    columns: [
      {
        Header: 'Địa điểm',
        formatter: getFullLocationName,
      },
      {
        Header: 'Thời gian',
        formatter: (r) =>
          `${moment(r.fromTime).format('HH:mm | DD-MM')} ~ ${moment(
            r.toTime,
          ).format('HH:mm | DD-MM')}`,
      },
    ],
  },
  {
    Header: 'Điều tra và xét nghiệm',
    columns: [
      {
        Header: 'Tiếp xúc gần',
        Footer: (info) => calculateColumnsTotal(info, 'numberOfCloseContacts'),
        accessor: 'numberOfCloseContacts',
      },
      {
        Header: 'Tiếp xúc khác',
        Footer: (info) => calculateColumnsTotal(info, 'numberOfOtherContacts'),

        accessor: 'numberOfOtherContacts',
      },
      {
        Header: 'Tiếp cận được',
        Footer: (info) =>
          calculateColumnsTotal(info, 'numberOfApproachedSubjects'),

        accessor: 'numberOfApproachedSubjects',
      },
      {
        Header: 'Đã lấy mẫu',
        Footer: (info) =>
          calculateColumnsTotal(info, 'numberOfExaminedSubjects'),

        accessor: 'numberOfExaminedSubjects',
      },
    ],
  },
  {
    Header: 'Kết quả tiếp xúc',
    columns: [
      {
        Header: 'Dương tính',
        Footer: (info) =>
          calculateColumnsTotal(info, 'numberOfExaminedPositiveSubjects'),

        accessor: 'numberOfExaminedPositiveSubjects',
      },
      {
        Header: 'Âm tính',
        Footer: (info) =>
          calculateColumnsTotal(info, 'numberOfExaminedNegativeSubjects'),

        accessor: 'numberOfExaminedNegativeSubjects',
      },
      {
        Header: 'Chờ kết quả',
        Footer: (info) =>
          calculateColumnsTotal(info, 'numberOfExaminedWaitingSubjects'),

        accessor: 'numberOfExaminedWaitingSubjects',
      },
    ],
  },
];

const ChainContactsTable = ({ chainId }) => {
  const {
    contactsByChainData: { data },
    getContactsByChainLoading,
    exportContactsByChainLoading,
  } = useSelector((s) => s.chain);

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(getContactsByChain({ chainId }));
  }, [dispatch, chainId]);
  useEffect(getData, [getData]);
  return (
    <div>
      <DataTable
        celled
        footer
        noPaging
        pageCount={1}
        title="Thông tin tiếp xúc"
        loading={getContactsByChainLoading || exportContactsByChainLoading}
        columns={columns}
        data={data.map((d, i) => ({ ...d, index: i + 1 }))}
        actions={[
          {
            icon: <FiDownload />,
            title: 'Export To Excel',
            color: 'green',
            onClick: () => dispatch(exportContactsByChain(chainId)),
            globalAction: true,
          },
        ]}
      />
    </div>
  );
};

ChainContactsTable.propTypes = {
  chainId: PropTypes.string,
};

ChainContactsTable.defaultProps = {
  chainId: '',
};

export default ChainContactsTable;
