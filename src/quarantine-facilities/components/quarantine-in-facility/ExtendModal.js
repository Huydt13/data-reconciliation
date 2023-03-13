import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { extendFacility } from 'quarantine-facilities/actions/quarantine';

import { KeyboardDatePicker } from 'app/components/shared';

const ExtendModal = (props) => {
  const { open, onClose, onSubmit, data } = props;
  const { watch, control, getValues } = useForm();
  const dispatch = useDispatch();
  const { extendLoading } = useSelector((s) => s.quarantine);
  const handleExtend = async () => {
    const d = getValues();
    await dispatch(extendFacility(data.quarantineForm.id, d));
    onClose();
    onSubmit();
  };
  const disabled = useMemo(
    () => Boolean(!watch('startTime') || !watch('endTime')),
    [watch]
  );
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Gia hạn cách ly</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleExtend}>
          <Form.Group widths='equal'>
            <Controller
              control={control}
              defaultValue=''
              name='startTime'
              render={({ onChange }) => (
                <Form.Field
                  fluid
                  label='Thời gian bắt đầu'
                  control={KeyboardDatePicker}
                  onChange={onChange}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue=''
              name='endTime'
              render={({ onChange }) => (
                <Form.Field
                  fluid
                  label='Thời gian kết thúc'
                  control={KeyboardDatePicker}
                  onChange={onChange}
                />
              )}
            />
          </Form.Group>
          <Form.Button
            primary
            content='Xác nhận'
            loading={extendLoading}
            disabled={extendLoading || disabled}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

ExtendModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.shape({
    quarantineForm: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default ExtendModal;
