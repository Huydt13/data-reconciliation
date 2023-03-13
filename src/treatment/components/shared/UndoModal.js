import React from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { undoTreatment } from 'treatment/actions/facility';

const UndoModal = ({ onClose, data, getData }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit } = useForm();

  const loading = useSelector((s) => s.treatment.facility.undoTreatmentLoading);
  const onSubmit = async (d) => {
    await dispatch(
      undoTreatment({
        ...d,
        sessionId: data.sessionId,
        facilityId: data.facility.id,
      }),
    );
    onClose();
    getData();
  };

  return (
    <Modal open={Boolean(data)} onClose={onClose}>
      <Modal.Header>Hoàn tác</Modal.Header>
      <Modal.Content>
        <Form>
          <Controller name="sessionId" control={control} defaultValue="" />
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="reason"
              render={({ onChange, onBlur, value }) => (
                <Form.TextArea
                  label="Lý do"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          loading={loading}
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

UndoModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    sessionId: PropTypes.string,
    facility: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

UndoModal.defaultProps = {
  data: undefined,
};

export default UndoModal;
