import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { getChildProfile } from 'profile/actions/profile';

import {
  formatToYear,
  renderGender,
  renderProfileKey,
} from 'app/utils/helpers';

import { DataTable } from 'app/components/shared';

const columns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Họ và tên',
    formatter: (row) => row.fullName.toUpperCase(),
    cutlength: 50,
  },
  {
    Header: 'Năm sinh',
    formatter: ({ dateOfBirth }) => formatToYear(dateOfBirth),
  },
  {
    Header: 'Giới tính',
    formatter: renderGender,
  },
  {
    Header: 'Số điện thoại',
    formatter: ({ phoneNumber }) => phoneNumber,
  },
  {
    Header: 'Địa chỉ nhà',
    formatter: renderProfileKey,
  },
];

const GroupProfileModal = ({ open, onClose, data }) => {
  const dispatch = useDispatch();
  const childProfileList = useSelector((s) => s.profile.childProfileList);
  const loading = useSelector((s) => s.profile.getChildProfileLoading);
  useEffect(() => {
    if (open && data) {
      dispatch(getChildProfile(data.person.profileId));
    }
    // eslint-disable-next-line
  }, [dispatch, data]);

  return (
    <Modal open={open} onClose={onClose} size="large">
      <Modal.Header>Danh sách hồ sơ trong mẫu gộp</Modal.Header>
      <Modal.Content>
        <DataTable
          columns={columns}
          data={childProfileList.map((r, i) => ({ ...r, index: i + 1 }))}
          loading={loading}
          onRowClick={(r) => window.open(`/profile/${r.id}`, '_blank')}
        />
      </Modal.Content>
    </Modal>
  );
};

GroupProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    person: PropTypes.shape({
      profileId: PropTypes.number,
    }),
  }),
};

GroupProfileModal.defaultProps = {
  data: undefined,
};

export default GroupProfileModal;
