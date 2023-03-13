import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { getExaminationByDetail } from 'medical-test/actions/medical-test';
import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';

const testTechniques = [
  'Realtime RT PCR',
  'Test nhanh kháng thể',
  'Test nhanh kháng nguyên',
  'Test MD kháng thể',
  'Test MD kháng nguyên',
  'Test nhanh KN-KT',
  'Test MD KN-KT',
];
const statuses = ['Dương tính', 'Âm tính', 'Nghi ngờ', 'Không xác định'];

const UpdateAssignModal = (props) => {
  const { open, onClose, onSubmit, id } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getExaminationByDetail(id));
    }
  }, [id, dispatch]);
  const {
    examinationDetail: data,
    getExaminationDetailLoading,
    diseaseSampleList,
    prefixList,
  } = useSelector((s) => s.medicalTest);
  const loading = getExaminationDetailLoading;
  const { control, register, handleSubmit, reset, setValue } = useForm({
    defaultValues: data || {},
  });
  useEffect(() => {
    register('unitName');
    register('diseaseSampleName');
  }, [register]);
  useEffect(() => reset(data), [reset, data]);
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Cập nhật</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)} loading={loading}>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="diseaseSampleId"
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  fluid
                  required
                  clearable
                  label="Mẫu bệnh phẩm"
                  value={value}
                  options={diseaseSampleList.map((d) => ({
                    text: d.name,
                    value: d.id,
                  }))}
                  onChange={(_, { value: v }) => {
                    onChange(v);
                    setValue(
                      'diseaseSampleName',
                      diseaseSampleList.find((d) => d.id === value)?.name,
                    );
                  }}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="testTechnique"
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  fluid
                  required
                  clearable
                  label="Kỹ thuật xét nghiệm"
                  value={value}
                  options={testTechniques.map((t) => ({
                    text: t,
                    value: t,
                  }))}
                  onChange={(_, { value: v }) => onChange(v)}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="unitId"
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  fluid
                  required
                  clearable
                  label="Đơn vị xét nghiệm"
                  value={value}
                  options={diseaseSampleList.map((d) => ({
                    text: d.name,
                    value: d.id,
                  }))}
                  onChange={(_, { value: v }) => {
                    onChange(v);
                    setValue(
                      'unitName',
                      prefixList.find((d) => d.id === value)?.name,
                    );
                  }}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="resultDate"
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  isHavingTime
                  label="Thời gian có kết quả"
                  control={KeyboardDateTimePicker}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="result"
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  fluid
                  label="Kết quả"
                  value={value}
                  options={statuses.map((s) => ({ value: s.toUpperCase(), text: s }))}
                  onChange={(_, { value: v }) => onChange(v)}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
          <Form.Button primary content="Xác nhận" />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

UpdateAssignModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default UpdateAssignModal;
