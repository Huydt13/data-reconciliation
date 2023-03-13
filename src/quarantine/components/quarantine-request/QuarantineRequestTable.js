/* eslint-disable no-nested-ternary */
import React, {
  useEffect,
  useCallback,
  useState,
} from 'react';

import { FiPlus, FiFileText, FiCheck } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { createQuarantineRequest, getQuarantineRequests } from 'quarantine/actions/quarantine-request';

import { DataTable } from 'app/components/shared';
import { showConfirmModal } from 'app/actions/global';
// import nations from 'app/assets/mock/nations.json';

import moment from 'moment';
import QuarantineRequestFilter from './QuarantineRequestFilter';
import CreateQuarantineRequestModal from './CreateQuarantineRequestModal';
import DetailQuarantineRequestModal from './DetailQuarantineRequestModal';

// const nationOptions = nations.map((n) => ({
//   key: n.countryCode,
//   text: n.name,
//   value: n.countryCode,
//   flag: n.countryCode,
// }));

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Tên', formatter: (r) => r.fullName },
  { Header: 'Ngày đăng ký', formatter: (r) => moment(r.dateCreated).format('DD-MM-YY HH:mm') },
  { Header: 'Đã duyệt', formatter: (r) => (r.finalApproval ? <FiCheck /> : null) },
  // {
  //   Header: 'Giới tính',
  //   formatter: (r) => (r.requester.gender === 1 ? 'Nam' : 'Nữ'),
  // },
  // {
  //   Header: 'Ngày sinh',
  //   formatter: (row) => (row.requester.dateOfBirth
  //     ? !row.requester.hasYearOfBirthOnly
  //       ? moment(row.requester.dateOfBirth).format('DD-MM-YYYY')
  //       : moment(row.requester.dateOfBirth).format('YYYY')
  //     : 'Chưa xác định'),
  // },
  // { Header: 'Số điện thoại', formatter: (r) => r.requester.phoneNumber },
  // { Header: 'Email', formatter: (r) => r.requester.email },
  // { Header: 'Passport', formatter: (r) => r.requester.passport },
  // { Header: 'CMND/Hộ chiếu', formatter: (r) => r.requester.identityNumber },
  // {
  //   Header: 'Quốc tịch',
  //   formatter: (r) => (r.requester.nationality ? nationOptions.find((n) => n.value === r.requester.nationality).text : ''),
  // },
];
const QuarantineRequestTable = () => {
  const {
    quarantineRequestData,
    getQuarantineRequestLoading,
    createQuarantineRequestLoading,
    updateQuarantineRequestLoading,
    deleteQuarantineRequestLoading,
  } = useSelector((s) => s.quarantineRequest);
  const loading = getQuarantineRequestLoading
    || createQuarantineRequestLoading
    || updateQuarantineRequestLoading
    || deleteQuarantineRequestLoading;
  const { totalPages, data } = quarantineRequestData;

  const dispatch = useDispatch();
  const [filter, setFilter] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const getData = useCallback(() => {
    dispatch(getQuarantineRequests({
      ...filter,
      pageIndex,
      pageSize,
    }));
  }, [
    dispatch,
    filter,
    pageIndex,
    pageSize,
  ]);
  useEffect(getData, [getData]);

  const [selectingId, setSelectingId] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const handleCreate = (d) => {
    const { requester } = d;
    let formattedDOB = '';
    if (requester.dateOfBirth.length === 4) {
      formattedDOB = moment(requester.dateOfBirth, 'YYYY').format();
    }
    dispatch(createQuarantineRequest({
      ...d,
      requester: {
        ...requester,
        dateOfBirth: formattedDOB || formattedDOB,
      },
    })).then(() => {
      setCreateModal(false);
      getData();
    });
  };
  const handleApprove = () => {
    dispatch(showConfirmModal('Chấp nhận đăng ký này?', () => {
      setSelectingId('');
      setDetailModal(false);
      getData();
    }));
  };
  const handleDecline = () => {
    dispatch(showConfirmModal('Từ chối đăng ký này?', () => {
      setSelectingId('');
      setDetailModal(false);
      getData();
    }));
  };

  return (
    <>
      <QuarantineRequestFilter onChange={setFilter} />
      <DataTable
        title="Danh sách đăng ký cách ly"
        loading={loading}
        columns={columns}
        pageCount={totalPages}
        onPaginationChange={(p) => {
          setPageSize(p.pageSize);
          setPageIndex(p.pageIndex);
        }}
        data={(data || []).map((d, i) => ({ ...d, index: i + 1 }))}
        actions={[
          {
            icon: <FiPlus />,
            title: 'Thêm',
            color: 'green',
            globalAction: true,
            onClick: () => {
              setSelectingId('');
              setCreateModal(true);
            },
          },
          {
            icon: <FiFileText />,
            title: 'Chi tiết',
            color: 'blue',
            onClick: (r) => {
              setSelectingId(r.id);
              setDetailModal(true);
            },
          },
        ]}
      />
      <CreateQuarantineRequestModal
        open={createModal}
        onClose={() => setCreateModal(false)}
        onSubmit={handleCreate}
      />
      <DetailQuarantineRequestModal
        open={detailModal}
        onClose={() => setDetailModal(false)}
        requestId={selectingId}
        onApprove={handleApprove}
        onDecline={handleDecline}
      />
    </>
  );
};

export default QuarantineRequestTable;
