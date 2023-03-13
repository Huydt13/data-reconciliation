import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import {
  Form,
  Input,
  Card,
  Button,
  Select,
} from 'semantic-ui-react';

const StyledCard = styled(Card)`
  padding: 20px !important;
  width: auto !important;
  margin-top: 0 !important;
`;

const vehicleTypes = [
  { key: 'Máy bay', text: 'Máy bay', value: 'Máy bay' },
  { key: 'Tàu điện', text: 'Tàu điện', value: 'Tàu điện' },
  { key: 'Tàu hỏa', text: 'Tàu hỏa', value: 'Tàu hỏa' },
  { key: 'Tàu thủy', text: 'Tàu thủy', value: 'Tàu thủy' },
  { key: 'Xe khách', text: 'Xe khách', value: 'Xe khách' },
  { key: 'Xe buýt', text: 'Xe buýt', value: 'Xe buýt' },
  { key: 'Taxi', text: 'Taxi', value: 'Taxi' },
  { key: 'Grab car', text: 'Grab car', value: 'Grab car' },
  { key: 'Grab bike', text: 'Grab bike', value: 'Grab bike' },
  { key: 'Xe ôm', text: 'Xe ôm', value: 'Xe ôm' },
  { key: 'Ô tô', text: 'Ô tô', value: 'Ô tô' },
];

const ContactVehicleForm = (props) => {
  const { initialData, onChange, onSubmit } = props;
  const {
    reset,
    watch,
    register,
    setValue,
    getValues,
    handleSubmit,
  } = useForm(
    {
      defaultValues: initialData,
      reValidateMode: 'onChange',
    },
  );

  useEffect(() => {
    reset(initialData);
    // eslint-disable-next-line
  }, [reset, initialData.id]);

  useEffect(() => {
    register({ name: 'id' });
    register({ name: 'vehicleType' });
  }, [register]);

  return (
    <StyledCard className="ContactVehicleForm">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            label="Tên phương tiện"
            name="vehicleName"
            input={{ ref: register }}
            onBlur={() => {
              onChange(getValues());
            }}
          />
          <Form.Field
            label="Loại hình"
            clearable
            control={Select}
            value={watch('vehicleType') || ''}
            options={vehicleTypes}
            onChange={(e, { value }) => {
              setValue('vehicleType', value);
              onChange(getValues());
            }}
          />
          <Form.Field
            control={Input}
            label="Só ghế"
            name="seatNumber"
            input={{ ref: register }}
            onBlur={() => {
              onChange(getValues());
            }}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            label="Điểm khởi hành"
            name="from"
            input={{ ref: register }}
            onBlur={() => {
              onChange(getValues());
            }}
          />
          <Form.Field
            control={Input}
            label="Điểm đến"
            name="to"
            input={{ ref: register }}
            onBlur={() => {
              onChange(getValues());
            }}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            label="Ghi chú"
            name="notes"
            input={{ ref: register }}
            onBlur={() => {
              onChange(getValues());
            }}
          />
        </Form.Group>
        <Button primary>Xác nhận</Button>
      </Form>
    </StyledCard>
  );
};

ContactVehicleForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    notes: PropTypes.string,
    address: PropTypes.shape({
      floor: PropTypes.string,
      block: PropTypes.string,
      streetHouseNumber: PropTypes.string,
      provinceValue: PropTypes.string,
      districtValue: PropTypes.string,
      wardValue: PropTypes.string,
    }),
  }),
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

ContactVehicleForm.defaultProps = {
  initialData: {},
  onChange: () => {},
  onSubmit: () => {},
};

export default ContactVehicleForm;
