import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { FiMaximize2, FiMinimize2, FiX } from 'react-icons/fi';
import { Dimmer, Loader, Grid, Modal, Header, Button } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import DuplicateProfileTableSearchSection from 'profile/components/DuplicateProfileTableSearchSection';

import { useSelector, useDispatch } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import { mergeDuplicateProfile } from 'profile/actions/profile';

import {
  formatToYear,
  renderGender,
  renderProfileKey,
} from 'app/utils/helpers';

const ModalContent = styled(Modal.Content)`
  postion: relative;
`;
const GridColumn = styled(Grid.Column)`
  transition: 0.5s;
`;
const IconStack = styled.span`
  position: relative;
  float: right;
  cursor: pointer;
`;

const expandColumns = [
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
const normalColumns = [
  {
    Header: '#',
    accessor: 'index',
  },
  { Header: 'Họ và tên', formatter: (r) => r.fullName, cutlength: 50 },
  {
    Header: 'Năm sinh',
    formatter: ({ dateOfBirth }) => formatToYear(dateOfBirth),
  },
  {
    Header: 'Địa chỉ nhà',
    formatter: renderProfileKey,
    cutlength: 20,
  },
];
const shrinkColumn = [
  {
    Header: 'Họ và tên',
    formatter: (row) => row.fullName.toUpperCase(),
    cutlength: 50,
  },
];

const MergeProfileDuplicateModal = (props) => {
  const { open, onRefresh, onClose } = props;

  const [hoverIndex, setHoverIndex] = useState(0);
  const [profileList, setProfileList] = useState([]);

  const dispatch = useDispatch();
  const { mergeDuplicateProfileLoading } = useSelector((state) => state.profile);

  const onSubmit = () => {
    if (profileList.length <= 0) {
      return;
    }

    dispatch(mergeDuplicateProfile(profileList))
      .then((profileId) => {
        toast.success(`Đã gộp thành hồ sơ ${profileId}`);
        onClose();
        onRefresh();
      })
      .catch((error) => {
        toast.warn(`Lỗi: ${error?.response?.data}`);
      });
  };

  return (
    <Modal
      open={open}
      size="fullscreen"
      onClose={() =>
        dispatch(
          showConfirmModal(
            'Dữ liệu chưa được lưu, bạn có muốn đóng?',
            onClose,
          ),
        )
      }
    >
      <Modal.Header>
        Gộp hồ sơ trùng
      </Modal.Header>
      <ModalContent>
        <Dimmer inverted active={mergeDuplicateProfileLoading}>
          <Loader />
        </Dimmer>
        <Grid divided>
          <GridColumn
            width={hoverIndex === 0 ? 8 : hoverIndex === 1 ? 12 : 4}
          >
            <IconStack
              onClick={() => setHoverIndex(hoverIndex === 1 ? 0 : 1)}
            >
              {hoverIndex !== 1 ? <FiMaximize2 /> : <FiMinimize2 />}
            </IconStack>
            <DuplicateProfileTableSearchSection
              isShrink={hoverIndex === 2}
              isNormal={hoverIndex === 0}
              isCloseFilter={hoverIndex !== 1}
              selectingList={profileList}
              onChange={(r) => setProfileList((pl) => [...pl, r])}
            />
          </GridColumn>
          <GridColumn
            width={hoverIndex === 0 ? 8 : hoverIndex === 2 ? 12 : 4}
          >
            <IconStack
              onClick={() => setHoverIndex(hoverIndex === 2 ? 0 : 2)}
            >
              {hoverIndex !== 2 ? <FiMaximize2 /> : <FiMinimize2 />}
            </IconStack>
            <Header as="h3" content="Danh sách hồ sơ đã chọn" />
            <DataTable
              hideGoToButton
              columns={
                hoverIndex === 1
                  ? shrinkColumn
                  : hoverIndex === 0
                  ? normalColumns
                  : expandColumns
              }
              data={profileList.map((r, i) => ({ ...r, index: i + 1 }))}
              actions={[
                {
                  icon: <FiX />,
                  title: 'Xóa',
                  color: 'red',
                  onClick: (row) => {
                    setProfileList((pl) =>
                      pl.filter((p) => p.id !== row.id),
                    );
                  },
                },
              ]}
            />
          </GridColumn>
        </Grid>
      </ModalContent>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          disabled={mergeDuplicateProfileLoading}
          loading={mergeDuplicateProfileLoading}
          onClick={onSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
};

MergeProfileDuplicateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
};

MergeProfileDuplicateModal.defaultProps = {
  open: false,
  onClose: () => {},
  onRefresh: () => {},
};

export default MergeProfileDuplicateModal;
