import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, Form, Modal } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { KeyboardDatePicker } from 'app/components/shared';
import AddressDetails from '../information/form-sections/AddressDetails';

const fields = ['startTime', 'endTime', 'quarantineHomeAddress'];

const ButtonWrapper = styled.div`
  width: 100%;
  text-align: right;
  & button {
    margin: 16px 0 0 10px !important;
  }
  & .text {
    font-weight: bold;
  }
`;

const CompleteQuarantineModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const { completeQuarantineLoading } = useSelector((s) => s.quarantine);
  const {
    watch,
    register,
    clearErrors,
    setValue,
    setError,
    errors,
    getValues,
  } = useForm();
  useEffect(() => {
    fields.forEach((name) => {
      register({ name });
    });
    // eslint-disable-next-line
  }, [register]);

  const disabledCompleted = useMemo(
    () =>
      Boolean(
        !watch('startTime') ||
          !watch('endTime') ||
          !watch('quarantineHomeAddress'),
      ),
    [watch],
  );
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Kết thúc cách ly</Modal.Header>
      <Modal.Content>
        <Form loading={completeQuarantineLoading}>
          <Form.Group widths="equal">
            <Form.Field
              label="Ngày chỉ định tại nhà"
              control={KeyboardDatePicker}
              value={watch('startTime') || ''}
              onChange={(date) => {
                clearErrors('startTime');
                setValue('startTime', date);
              }}
              onError={(e) => setError('startTime', e)}
              error={Boolean(errors.startTime)}
            />
            <Form.Field
              label="Ngày kết thúc cách ly tại nhà"
              control={KeyboardDatePicker}
              value={watch('endTime') || ''}
              onChange={(date) => {
                clearErrors('endTime');
                setValue('endTime', date);
              }}
              onError={(e) => setError('endTime', e)}
              error={Boolean(errors.endTime)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              label="Địa chỉ nơi tiếp tục cách ly"
              control={AddressDetails}
              onChange={(d) => setValue('quarantineHomeAddress', d)}
            />
          </Form.Group>
          <ButtonWrapper>
            <Button
              color="yellow"
              content="Tiếp tục cách ly tại nhà"
              disabled={disabledCompleted}
              onClick={() => {
                const values = getValues();
                onSubmit({
                  ...values,
                  type: 1,
                });
              }}
            />
            <Button
              color="green"
              content="Kết thúc cách ly"
              onClick={() => {
                const values = getValues();
                onSubmit({
                  ...values,
                  type: 0,
                });
              }}
            />
          </ButtonWrapper>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

CompleteQuarantineModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CompleteQuarantineModal;
