import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import {
  rejectReceivedTransport,
  rejectSentTransport,
} from 'medical-test/actions/transport';

const RejectNoteModal = (props) => {
  const dispatch = useDispatch();
  const rejectLoading = useSelector((s) => s.transport.updateTransportLoading);
  const { type, onClose, data, getData } = props;
  const { control, handleSubmit } = useForm();
  const onSubmit = async (d) => {
    if (type === 1) {
      await dispatch(rejectSentTransport({ id: data.id, ...d }));
    } else {
      await dispatch(rejectReceivedTransport({ id: data.id, ...d }));
    }
    onClose();
    getData();
  };
  return (
    <Modal open={Boolean(type)} onClose={onClose}>
      <Modal.Header>{type === 1 ? 'Hủy chuyển' : 'Hủy nhận'}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="note"
              rules={{ required: true }}
              render={({ onChange, onBlur, value }) => (
                <Form.TextArea
                  required
                  label={`Lý do hủy ${type === 1 ? 'chuyển' : 'nhận'}`}
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
          content="Hoàn tất"
          loading={rejectLoading}
          disabled={rejectLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

RejectNoteModal.propTypes = {
  type: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
  }),
  getData: PropTypes.func.isRequired,
};

RejectNoteModal.defaultProps = {
  data: null,
};

export default RejectNoteModal;
