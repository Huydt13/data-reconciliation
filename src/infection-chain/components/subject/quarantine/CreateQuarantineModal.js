import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

import QuarantineForm from './QuarantineForm';

const CreateQuarantineModal = (props) => {
  const {
    open,
    onClose,
    subject,
    handleSubmit,
  } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Modal.Header>{subject.information.fullName}</Modal.Header>
      <Modal.Content>
        <QuarantineForm
          subject={subject}
          onSubmit={handleSubmit}
        />
      </Modal.Content>
    </Modal>
  );
};

CreateQuarantineModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  subject: PropTypes.shape({
    information: PropTypes.shape({
      fullName: PropTypes.string,
    }),
  }),
  handleSubmit: PropTypes.func,
};

CreateQuarantineModal.defaultProps = {
  open: false,
  onClose: () => {},
  subject: {},
  handleSubmit: () => {},
};

export default CreateQuarantineModal;
