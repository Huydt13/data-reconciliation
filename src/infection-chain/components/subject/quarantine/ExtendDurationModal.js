import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'semantic-ui-react';
import { KeyboardDatePicker } from 'app/components/shared';
import { useForm } from 'react-hook-form';

const ExtendDurationModal = (props) => {
  const {
    open,
    onClose,
    subject,
    onSubmit,
  } = props;

  const {
    watch,
    errors,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({ defaultValues: {} });

  useEffect(() => {
    register({ name: 'newEndDate' });
  }, [register]);

  return (
    <Modal
      size="mini"
      open={open}
      onClose={onClose}
    >
      <Modal.Header>{subject?.information?.fullName ?? subject?.fullName}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field
            label="Ngày kết thúc mới"
            control={KeyboardDatePicker}
            value={watch('newEndDate') || ''}
            onChange={(date) => {
              clearErrors('newEndDate');
              setValue('newEndDate', date);
            }}
            onError={(e) => setError('newEndDate', e)}
            error={Boolean(errors.newEndDate)}
          />
          <Button primary content="Xác nhận" disabled={!watch('newEndDate')} />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

ExtendDurationModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  subject: PropTypes.oneOfType([
    PropTypes.shape({
      information: PropTypes.shape({
        fullName: PropTypes.string,
      }),
    }),
    PropTypes.shape({
      fullName: PropTypes.string,
    }),
  ]),
  onSubmit: PropTypes.func,
};

ExtendDurationModal.defaultProps = {
  open: false,
  onClose: () => {},
  subject: {},
  onSubmit: () => {},
};

export default ExtendDurationModal;
