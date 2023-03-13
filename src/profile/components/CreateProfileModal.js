import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import SubjectForm from 'infection-chain/components/subject/information/SubjectForm';
import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';

const CreateProfileModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const dispatch = useDispatch();
  const { createProfileLoading } = useSelector((s) => s.profile);
  const { mergeProfileLoading } = useSelector((s) => s.medicalTest);
  return (
    <Modal open={open} onClose={() => dispatch(showConfirmModal('Dữ liệu chưa được lưu, bạn có muốn đóng?', onClose))} size="large">
      <Modal.Header>Bổ sung thông tin cho hồ sơ</Modal.Header>
      <Modal.Content>
        <SubjectForm
          isCreateFromAnonymous
          onSubmit={onSubmit}
          loading={createProfileLoading || mergeProfileLoading}
        />
      </Modal.Content>
    </Modal>
  );
};

CreateProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateProfileModal;
