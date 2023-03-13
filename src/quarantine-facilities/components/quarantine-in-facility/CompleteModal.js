import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

const CompleteModal = (props) => {
  const {
    open,
    onClose,
    onSubmit,
    data,
  } = props;
  const {
    control,
    handleSubmit,
    reset,
  } = useForm({ defaultValues: data });
  useEffect(() => reset(data), [reset, data]);
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Kết thúc cách ly</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="name"
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  label="Tên"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

CompleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
};

export default CompleteModal;
