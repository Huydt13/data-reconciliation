import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { getSubject } from 'infection-chain/actions/subject';

import MedicalTestForm from './MedicalTestForm';

const CreateMedicalTestModal = (props) => {
  const {
    open,
    onClose,
    subjectId,
    handleSubmit,
  } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    if (subjectId) {
      dispatch(getSubject(subjectId));
    }
  }, [dispatch, subjectId]);

  const { subject } = useSelector((state) => state.subject);

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Modal.Header>{subject?.information?.fullName}</Modal.Header>
      <Modal.Content>
        <MedicalTestForm
          subjectCode={subject?.code}
          diseaseLocation={subject?.diseaseLocation}
          onSubmit={handleSubmit}
        />
      </Modal.Content>
    </Modal>
  );
};

CreateMedicalTestModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  subjectId: PropTypes.string,
  handleSubmit: PropTypes.func,
};

CreateMedicalTestModal.defaultProps = {
  open: false,
  onClose: () => {},
  subjectId: '',
  handleSubmit: () => {},
};

export default CreateMedicalTestModal;
