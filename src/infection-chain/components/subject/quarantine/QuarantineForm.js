import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Select,
  Button,
} from 'semantic-ui-react';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';

import { KeyboardDatePicker } from 'app/components/shared';

const StyledForm = styled(Form)`
  padding: 20px;
`;

const QuarantineForm = (props) => {
  const {
    symptomList,
  } = useSelector((state) => state.happening);

  const {
    subject,
    initialData,
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
  } = useForm({ defaultValues: initialData || {} });

  useEffect(() => {
    register({ name: 'id' });
    register({ name: 'subjectId' });
    register({ name: 'checkupDate' });
    register({ name: 'doctorName' });
    register({ name: 'temperature' });
    register({ name: 'bloodPressure' });
    register({ name: 'symptomIds' });
    register({ name: 'pulse' });
    register({ name: 'state' });
    register({ name: 'result' });
    setValue('subjectId', subject.id);
  }, [register, setValue, subject.id]);

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <Form.Group widths="equal">
        <Form.Field
          label="Bác sĩ khám"
          control={Input}
          value={watch('doctorName') || ''}
          onChange={(e, { value }) => {
            setValue('doctorName', value);
          }}
        />
        <Form.Field
          label="Thời gian khám"
          control={KeyboardDatePicker}
          disabledDays={[{ after: new Date() }]}
          value={watch('checkupDate') || ''}
          onChange={(date) => {
            clearErrors('checkupDate');
            setValue('checkupDate', date);
          }}
          onError={(e) => setError('checkupDate', e)}
          error={Boolean(errors.checkupDate)}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field
          label="Nhiệt độ"
          control={Input}
          value={watch('temperature') || ''}
          onChange={(e, { value }) => {
            setValue('temperature', value);
          }}
        />
        <Form.Field
          label="Huyết áp"
          control={Input}
          value={watch('bloodPressure') || ''}
          onChange={(e, { value }) => {
            setValue('bloodPressure', value);
          }}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field
          search
          deburr
          multiple
          clearable
          control={Select}
          label="Triệu chứng"
          options={symptomList.map((e) => ({
            key: e.id,
            text: e.name,
            value: e.id,
          })) || []}
          value={watch('symptomIds') || []}
          onChange={(e, { value }) => {
            setValue('symptomIds', value);
          }}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field
          label="Mạch"
          control={Input}
          value={watch('pulse') || ''}
          onChange={(e, { value }) => {
            setValue('pulse', value);
          }}
        />
        <Form.Field
          multiple
          control={Input}
          label="Tình trạng"
          value={watch('state') || ''}
          onChange={(e, { value }) => {
            setValue('state', value);
          }}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field
          label="Kết quả"
          control={Input}
          value={watch('result') || ''}
          onChange={(e, { value }) => {
            setValue('result', value);
          }}
        />
      </Form.Group>
      <Button
        primary
        type="submit"
        content="Xác nhận"
      />
    </StyledForm>
  );
};

QuarantineForm.propTypes = {
  initialData: PropTypes.shape({}),
  subject: PropTypes.shape({
    id: PropTypes.string,
    information: PropTypes.shape({
      fullName: PropTypes.string,
    }),
  }),
  onSubmit: PropTypes.func,
};

QuarantineForm.defaultProps = {
  initialData: {},
  subject: {
    id: '',
    ìnormation: {
      fullName: '',
    },
  },
  onSubmit: () => {},
};

export default QuarantineForm;
