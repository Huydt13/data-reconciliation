import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

import ExaminationTable from './ExaminationTable';

const MedicalTestModal = (props) => {
  const {
    open,
    onClose,
    subject,
    examination,
    handleSubmit,
    isUpdate,
    onDelete,
  } = props;

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {subject?.fullName ?? subject?.information?.fullName ?? 'CHƯA XÁC ĐỊNH'}
      </Modal.Header>
      <Modal.Content>
        <ExaminationTable
          isUpdate={isUpdate}
          examination={examination}
          subject={subject}
          onSubmit={handleSubmit}
          onDelete={onDelete}
        />
      </Modal.Content>
    </Modal>
  );
};

MedicalTestModal.propTypes = {
  open: PropTypes.bool,
  isUpdate: PropTypes.bool,
  onClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  onDelete: PropTypes.func,
  subject: PropTypes.shape({
    fullName: PropTypes.string,
  }),
  examination: PropTypes.shape({}),
};

MedicalTestModal.defaultProps = {
  open: false,
  isUpdate: false,
  onClose: () => {},
  handleSubmit: () => {},
  onDelete: () => {},
  subject: {},
  examination: {},
};

export default MedicalTestModal;
