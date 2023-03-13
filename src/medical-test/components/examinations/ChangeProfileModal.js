import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

import ContactRelativeTable from 'chain/components/ContactRelativeTable';

const ChangeProfileModal = (props) => {
  const { open, onClose, onSubmit } = props;
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Đổi hồ sơ của mẫu</Modal.Header>
      <Modal.Content>
        <ContactRelativeTable selectable onChange={onSubmit} />
      </Modal.Content>
    </Modal>
  );
};

ChangeProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ChangeProfileModal;
