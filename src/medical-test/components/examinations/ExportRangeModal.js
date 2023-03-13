import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Button, Checkbox, Form, Modal } from 'semantic-ui-react';

import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { KeyboardDatePicker } from 'app/components/shared';
import FeeTypeSelect from './FeeTypeSelect';

const ExportRangeModal = ({ open, onClose, onSubmit }) => {
  const { watch, register, handleSubmit, setValue } = useForm();
  const { from, to, feeType } = watch();

  useEffect(() => {
    register({ name: 'from' });
    register({ name: 'to' });
    register({ name: 'hasResultOnly' });
    register({ name: 'feeType' });
    setValue('hasResultOnly', false);
  }, [register, setValue]);
  const { exportExaminationResultLoading } = useSelector((s) => s.medicalTest);

  const disabled = useMemo(() => !(from && to), [from, to]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Xuất danh sách theo khoảng ngày</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group widths="equal">
            <Form.Field
              required
              label="Từ ngày (nhận mẫu)"
              control={KeyboardDatePicker}
              disabledDays={[{ after: new Date() }]}
              onChange={(v) => setValue('from', v)}
            />
            <Form.Field
              required
              label="Đến ngày (nhận mẫu)"
              control={KeyboardDatePicker}
              disabledDays={[
                {
                  after: new Date(),
                  before: new Date(from),
                },
              ]}
              onChange={(v) => setValue('to', v)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <FeeTypeSelect
              clearable
              value={feeType}
              onChange={(v) => setValue('feeType', v)}
            />
            <Form.Field
              control={Checkbox}
              style={{ paddingTop: '35px' }}
              label="Chỉ xuất mẫu có kết quả"
              onChange={(e, { checked }) => setValue('hasResultOnly', checked)}
            />
          </Form.Group>
          <Button
            primary
            content="Xác nhận"
            loading={exportExaminationResultLoading}
            disabled={disabled || exportExaminationResultLoading}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

ExportRangeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ExportRangeModal;
