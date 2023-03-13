import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'semantic-ui-react';

import { Controller, useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { updateExamDetail } from 'medical-test/actions/medical-test';

import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';
import { deburr } from 'app/utils/helpers';

const statuses = ['Dương tính', 'Âm tính', 'Nghi ngờ', 'Không xác định'];

const UpdateExamModal = ({ open, onClose, getData, data }) => {
  const { control, errors, setError, clearErrors, handleSubmit, watch } =
    useForm();

  const updateExamDetailLoading = useSelector(
    (state) => state.medicalTest.updateExamDetailLoading
  );

  const dispatch = useDispatch();
  const onSubmit = async (d) => {
    await dispatch(
      updateExamDetail({
        ...data,
        ...d,
        diseaseSampleId: data.diseaseSample?.id ?? undefined,
        examinationId: data.examId,
        dateTaken: undefined,
        diseaseSample: undefined,
        examId: undefined,
        feeType: undefined,
        isGroup: undefined,
        person: undefined,
        unitTaken: undefined,
      })
    );
    onClose();
    getData();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>{`Cập nhật mẫu - ${data?.code}`}</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths='equal'>
            <Controller
              name='resultDate'
              defaultValue=''
              control={control}
              rules={{ required: true }}
              render={({ onChange, value }) => (
                <Form.Field
                  required
                  isHavingTime
                  label='Thời gian có kết quả'
                  control={KeyboardDateTimePicker}
                  value={value}
                  onChange={(date) => {
                    onChange(date);
                    clearErrors('resultDate');
                  }}
                  disabledDays={[{ after: new Date() }]}
                  onError={(e) => setError('resultDate', e)}
                  error={Boolean(errors.resultDate)}
                />
              )}
            />
            <Controller
              name='result'
              defaultValue=''
              control={control}
              rules={{ required: true }}
              render={({ onChange, value }) => (
                <Form.Select
                  required
                  fluid
                  label='Kết quả'
                  value={value}
                  onChange={(_, { value: v }) => onChange(v)}
                  options={statuses.map((s) => ({
                    value: s.toUpperCase(),
                    text: s,
                  }))}
                  error={Boolean(errors.result)}
                />
              )}
            />
          </Form.Group>
          {(deburr(watch('result')) === deburr('Dương tính') ||
            deburr(watch('result')) === deburr('Nghi ngờ')) && (
            <Form.Group widths='equal'>
              <Controller
                name='cT_N'
                defaultValue=''
                control={control}
                render={({ onChange, value }) => (
                  <Form.Input
                    fluid
                    label='CT N'
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                name='cT_E'
                defaultValue=''
                control={control}
                render={({ onChange, value }) => (
                  <Form.Input
                    fluid
                    label='CT E'
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                name='cT_RdRp'
                defaultValue=''
                control={control}
                render={({ onChange, value }) => (
                  <Form.Input
                    fluid
                    label='CT RdRp'
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                name='orF1ab'
                defaultValue=''
                control={control}
                render={({ onChange, value }) => (
                  <Form.Input
                    fluid
                    label='CT ORF1ab'
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                name='index'
                defaultValue=''
                control={control}
                render={({ onChange, value }) => (
                  <Form.Input
                    fluid
                    label='Index(0.5-150)'
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition='right'
          icon='checkmark'
          content='Hoàn tất'
          loading={updateExamDetailLoading}
          disabled={updateExamDetailLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

UpdateExamModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    code: PropTypes.string,
    examId: PropTypes.string,
    diseaseSample: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

UpdateExamModal.defaultProps = {
  data: {},
};

export default UpdateExamModal;
