import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import SelectYear from 'app/components/shared/SelectYear';
import { exportExamBook } from 'medical-test/actions/medical-test';

const months = [...Array(12).keys()].map((e) => e + 1);

const ExportExamBookModal = (props) => {
  const {
    open,
    onClose,
  } = props;
  const {
    watch,
    control,
  } = useForm();

  const month = watch('month');
  const year = watch('year');

  const { exportExamBookLoading } = useSelector((s) => s.medicalTest);
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    await dispatch(exportExamBook(month, year));
    onClose();
  };

  const disabled = useMemo(() => !month || !year, [month, year]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Xuất sổ xét nghiệm</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="month"
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  required
                  fluid
                  label="Tháng"
                  value={value}
                  onChange={(_, { value: v }) => onChange(v)}
                  onBlur={onBlur}
                  options={months.map((m) => ({
                    value: m,
                    text: `Tháng ${m}`,
                  }))}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="year"
              render={({ onChange, onBlur }) => (
                <Form.Field
                  fluid
                  control={SelectYear}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
          <Form.Button
            primary
            disabled={disabled || exportExamBookLoading}
            loading={exportExamBookLoading}
            content="Xác nhận"
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

ExportExamBookModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExportExamBookModal;
