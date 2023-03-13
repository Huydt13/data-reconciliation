import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { KeyboardDatePicker } from 'app/components/shared';

const ExportReceiveModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const { watch, register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    register({ name: 'dateReceived' });
  }, [register]);
  const { exportExaminationExcelLoading } = useSelector((s) => s.medicalTest);

  const disabled = useMemo(() => !watch('dateReceived'), [watch]);

  return (
    <Modal size="mini" open={open} onClose={onClose}>
      <Modal.Header>Xuất theo ngày nhận</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group widths="equal">
            <Form.Field
              required
              label="Ngày nhận"
              control={KeyboardDatePicker}
              disabledDays={[{ after: new Date() }]}
              onChange={(v) => setValue('dateReceived', v)}
            />
          </Form.Group>
          <Button
            primary
            content="Xác nhận"
            loading={exportExaminationExcelLoading}
            disabled={disabled || exportExaminationExcelLoading}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

ExportReceiveModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ExportReceiveModal;
