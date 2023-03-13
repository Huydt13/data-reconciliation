import React from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';

import ExaminationTable from 'infection-chain/components/subject/medical-test/ExaminationTable';

const AssignWithCodeOnlyModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const dispatch = useDispatch();
  const { assignWithCodeOnlyLoading } = useSelector(
    (state) => state.medicalTest,
  );
  return (
    <Modal
      open={open}
      onClose={() =>
        dispatch(
          showConfirmModal('Dữ liệu chưa được lưu, bạn có muốn đóng?', onClose),
        )
      }
    >
      <Modal.Header>Tạo khẩn cấp</Modal.Header>
      <Modal.Content>
        <Form loading={assignWithCodeOnlyLoading}>
          <ExaminationTable isAnonymous onSubmit={onSubmit} />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

AssignWithCodeOnlyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AssignWithCodeOnlyModal;
