import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

import QuarantineForm from './QuarantineForm';

const EditQuarantineModal = (props) => {
  const {
    open,
    onClose,
    subject,
    handleSubmit,
  } = props;

  const {
    selectedQuarantine,
  } = useSelector((state) => state.quarantine);

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Modal.Header>{subject.information.fullName}</Modal.Header>
      <Modal.Content>
        <QuarantineForm
          initialData={selectedQuarantine}
          subject={subject}
          onSubmit={handleSubmit}
        />
      </Modal.Content>
    </Modal>
  );
};

EditQuarantineModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  subject: PropTypes.shape({
    information: PropTypes.shape({
      fullName: PropTypes.string,
    }),
  }),
  handleSubmit: PropTypes.func,
};

EditQuarantineModal.defaultProps = {
  open: false,
  onClose: () => {},
  subject: {},
  handleSubmit: () => {},
};

export default EditQuarantineModal;
