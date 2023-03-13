/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { FiFileText, FiPlus, FiTrash2 } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import { getContactsBySubject, deleteContact } from 'chain/actions/chain';

import { getFullLocationName } from 'app/utils/helpers';
import { DataTable } from 'app/components/shared';

import CreateContactModal from './CreateContactModal';
import UpdateContactModal from './UpdateContactModal';

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

const ContactBySubjectTable = ({
  chainId,
  subjectId: subjectIdProp,
  profileId,
  infectionTypeId,
  profileName,
  onRefresh: onRefreshProp,
}) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectingRow, setSelectingRow] = useState({});

  const [contactList, setContactList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const { subjectDetail, deleteContactLoading } = useSelector((s) => s.chain);
  const {
    id: subjectId,
    profileDetail: { dateOfBirth: subjectDob, fullName: subjectName },
  } = subjectDetail?.id
    ? subjectDetail
    : {
        id: '',
        profileDetail: { dateOfBirth: '', fullName: '' },
      };

  const getData = useCallback(() => {
    const id = subjectId || subjectIdProp;
    if (id) {
      setLoading(true);
      getContactsBySubject({
        getContactsAsSubjectFrom: true,
        subjectId: id,
        pageIndex,
        pageSize,
      }).then(({ data, totalPages }) => {
        setContactList(data);
        setPageCount(totalPages);
        setLoading(false);
      });
    }
  }, [subjectId, subjectIdProp, pageIndex, pageSize]);
  useEffect(getData, [getData]);

  return (
    <div>
      <DataTable
        title="Thông tin tiếp xúc"
        columns={columns}
        loading={loading || deleteContactLoading}
        data={contactList.map((r, i) => ({ ...r, index: i + 1 }))}
        pageCount={pageCount}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageIndex(pi);
          setPageSize(ps);
        }}
        actions={[
          {
            icon: <FiPlus />,
            title: 'Thêm tiếp xúc',
            color: 'green',
            globalAction: true,
            onClick: () => setModal(true),
          },
          {
            title: 'Chi tiết',
            icon: <FiFileText />,
            color: 'blue',
            onClick: setSelectingRow,
          },
          {
            title: 'Xóa',
            icon: <FiTrash2 />,
            color: 'red',
            onClick: ({ id }) =>
              dispatch(
                showConfirmModal('Xóa tiếp xúc?', async () => {
                  await deleteContact(id);
                  getData();
                }),
              ),
          },
        ]}
      />
      <CreateContactModal
        open={modal}
        loading={loading}
        chainId={chainId}
        subjectId={subjectId || subjectIdProp}
        profileId={profileId}
        profileName={subjectName || profileName}
        profileDob={subjectDob}
        onLoad={setLoading}
        onRefresh={() => {
          getData();
          onRefreshProp();
        }}
        onClose={() => setModal(false)}
      />
      <UpdateContactModal
        data={selectingRow}
        profileId={profileId}
        onRefresh={() => {
          getData();
          onRefreshProp();
        }}
        infectionTypeId={infectionTypeId}
        onClose={() => setSelectingRow({})}
      />
    </div>
  );
};

ContactBySubjectTable.propTypes = {
  chainId: PropTypes.string,
  subjectId: PropTypes.string,
  profileId: PropTypes.number,
  profileName: PropTypes.string,
  infectionTypeId: PropTypes.string,
  onRefresh: PropTypes.func,
};

ContactBySubjectTable.defaultProps = {
  chainId: '',
  subjectId: '',
  profileId: 0,
  profileName: '',
  infectionTypeId: '',
  onRefresh: () => {},
};

export default ContactBySubjectTable;
