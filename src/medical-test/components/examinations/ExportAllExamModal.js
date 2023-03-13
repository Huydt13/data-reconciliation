import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { Button, Form, Modal } from 'semantic-ui-react';

import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { exportExcel } from 'app/actions/global';
import apiLinks from 'app/utils/api-links';

import { KeyboardDatePicker } from 'app/components/shared';

import FeeTypeSelect from './FeeTypeSelect';

const groupOptions = [
  { value: 0, text: 'Tất cả' },
  { value: 1, text: 'Mẫu đơn' },
  { value: 2, text: 'Mẫu gộp' },
];
const ExportAllExamModal = (props) => {
  const { open, onClose } = props;
  const { watch, control, handleSubmit } = useForm();

  const loading = useSelector((s) => s.global.exportLoading);

  const dispatch = useDispatch();
  const onSubmit = async (d) => {
    try {
      await dispatch(
        exportExcel({
          method: 'GET',
          url: apiLinks.excel.dateRangeListAll,
          params: {
            ...d,
            from: d.from || undefined,
            to: d.to || undefined,
            isGroup: d.isGroup === 0 ? undefined : d.isGroup === 2,
            feeType: d.feeType === -1 ? undefined : d.feeType,
          },
        }),
      );
      onClose();
    } catch {
      toast.warn('Không có mẫu');
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Xuất dữ liệu xét nghiệm tổng</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="from"
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  label="Từ ngày"
                  control={KeyboardDatePicker}
                  disabledDays={[{ after: new Date() }]}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="to"
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  label="Đến ngày"
                  control={KeyboardDatePicker}
                  disabledDays={[
                    {
                      after: new Date(),
                      before: new Date(watch('from')),
                    },
                  ]}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue={groupOptions[0].value}
              name="isGroup"
              render={({ onChange, onBlur }) => (
                <Form.Select
                  clearable
                  label="Loại mẫu"
                  defaultValue={groupOptions[0].value}
                  options={groupOptions}
                  onBlur={onBlur}
                  onChange={(e, { value }) => onChange(value)}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue={-1}
              name="feeType"
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  clearable
                  control={FeeTypeSelect}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue={false}
              name="hasResultOnly"
              render={({ onChange, onBlur }) => (
                <Form.Checkbox
                  label="Chỉ xuất mẫu có kết quả"
                  style={{ paddingTop: '35px' }}
                  onBlur={onBlur}
                  onChange={(_, { checked }) => onChange(checked)}
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
          disabled={loading}
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

ExportAllExamModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExportAllExamModal;
