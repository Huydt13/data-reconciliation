import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'semantic-ui-react';

const ExaminationDetailsModal = (props) => {
  const { open, onClose } = props;
  return (
    <Modal size="fullscreen" open={open} onClose={onClose}>
      <Modal.Header>
        Danh sách mẫu xét nghiệm
      </Modal.Header>
      <Modal.Content>
        asd
      </Modal.Content>
    </Modal>
  );
};

ExaminationDetailsModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  initialData: PropTypes.shape({
    id: PropTypes.string,
  }),
};

ExaminationDetailsModal.defaultProps = {
  open: false,
  onClose: () => {},
  onSubmit: () => {},
  initialData: {
    id: '',
  },
};

export default ExaminationDetailsModal;
