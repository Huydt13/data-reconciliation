/* eslint-disable no-nested-ternary */
import React, { useEffect, useCallback, useState } from 'react';
import moment from 'moment';

import { FiPlus, FiFileText, FiCheck } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import {
  createQuarantineForm,
  getQuarantineForms,
} from 'quarantine-facilities/actions/quarantine-form';

import { DataTable } from 'app/components/shared';
import { showConfirmModal } from 'app/actions/global';

import { checkFilter } from 'app/utils/helpers';

import FacilityFormFilter from './FacilityFormFilter';
import CreateFacilityFormModal from './CreateFacilityFormModal';
import FacilityFormDetailModal from './FacilityFormDetailModal';

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Tên', formatter: (r) => r.fullName },
  {
    Header: 'Ngày đăng ký',
    formatter: (r) => moment(r.dateCreated).format('DD-MM-YY HH:mm'),
  },
  {
    Header: 'Đã duyệt',
    formatter: (r) => (r.finalApproval ? <FiCheck /> : null),
  },
];
const FacilityFormTable = () => {
  const {
    quarantineFormData,
    getQuarantineFormLoading,
    createQuarantineFormLoading,
    updateQuarantineFormLoading,
    deleteQuarantineFormLoading,
  } = useSelector((s) => s.quarantineForm);
  const loading =
    getQuarantineFormLoading ||
    createQuarantineFormLoading ||
    updateQuarantineFormLoading ||
    deleteQuarantineFormLoading;
  const { totalPages, data } = quarantineFormData;

  const dispatch = useDispatch();
  const [filter, setFilter] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const getData = useCallback(() => {
    dispatch(
      getQuarantineForms({
        ...filter,
        pageIndex,
        pageSize,
      }),
    );
  }, [dispatch, filter, pageIndex, pageSize]);
  useEffect(getData, [getData]);

  const [selectingId, setSelectingId] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const handleCreate = (d) => {
    const {
      requester,
      requester: { dateOfBirth },
    } = d;
    let formattedDOB = '';
    if (dateOfBirth.length === 4) {
      formattedDOB = moment(dateOfBirth, 'YYYY')
        .startOf('year')
        .format('YYYY-MM-DD');
    }
    dispatch(
      createQuarantineForm({
        ...d,
        requester: {
          ...requester,
          dateOfBirth: formattedDOB || dateOfBirth,
        },
      }),
    ).then(() => {
      setCreateModal(false);
      getData();
    });
  };
  const handleApprove = () => {
    dispatch(
      showConfirmModal('Chấp nhận đăng ký này?', () => {
        setSelectingId('');
        setDetailModal(false);
        getData();
      }),
    );
  };
  const handleDecline = () => {
    dispatch(
      showConfirmModal('Từ chối đăng ký này?', () => {
        setSelectingId('');
        setDetailModal(false);
        getData();
      }),
    );
  };

  return (
    <>
      <FacilityFormFilter
        onChange={(d) => checkFilter(filter, d) && setFilter(d)}
      />
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
      <CreateFacilityFormModal
        open={createModal}
        onClose={() => setCreateModal(false)}
        onSubmit={handleCreate}
      />
      <FacilityFormDetailModal
        open={detailModal}
        onClose={() => setDetailModal(false)}
        requestId={selectingId}
        onApprove={handleApprove}
        onDecline={handleDecline}
      />
    </>
  );
};

export default FacilityFormTable;
