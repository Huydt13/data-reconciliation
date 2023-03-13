import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Modal,
  Button,
  Form,
} from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { KeyboardDatePicker } from 'app/components/shared';
import AddressDetails from '../../../contact/components/contact-location/ContactLocationAddress';

const SubjectHomeModal = (props) => {
  const {
    open,
    onClose,
    onChange,
    onSubmit,
  } = props;
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {},
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    register({ name: 'address' });
    register({ name: 'startTime' });
    register({ name: 'endTime' });
    setValue('startTime', moment().add(1, 'days'));
    setValue('endTime', moment().add(15, 'days'));
  }, [setValue, register]);

  const address = watch('address');
  const [expectedTime, setExpectedTime] = useState(null);

  const handleChangeExpectedTime = () => {
    if (expectedTime) {
      setValue('endTime', expectedTime);
    } else {
      setValue('endTime', moment(watch('startTime')).add(14, 'days').format());
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Địa chỉ nhà cách ly</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field
            control={AddressDetails}
            onChange={(d) => {
              setValue('address', { ...address, ...d });
              onChange(getValues());
            }}
          />
          <Form.Group widths="equal">
            <Form.Field
              required
              control={KeyboardDatePicker}
              label="Ngày bắt đầu cách ly"
              value={watch('startTime') || ''}
              onChange={(d) => {
                setValue('startTime', moment(d, 'YYYY-MM-DD').format());
                handleChangeExpectedTime();
              }}
            />
            <Form.Field
              required
              control={KeyboardDatePicker}
              readOnly
              label="Dự kiến ngày kết thúc cách ly"
              value={moment(watch('startTime')).add(14, 'days') || ''}
            />
            <Form.Field
              control={KeyboardDatePicker}
              label="Ngày chính thức kết thúc cách ly"
              value={expectedTime}
              onChange={(d) => {
                setExpectedTime(moment(d, 'YYYY-MM-DD').format());
                handleChangeExpectedTime();
              }}
            />
          </Form.Group>
          <Button primary>Xác nhận</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

SubjectHomeModal.propTypes = {
  open: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
};

SubjectHomeModal.defaultProps = {
  open: false,
  onChange: () => {},
  onSubmit: () => {},
  onClose: () => {},
};

export default SubjectHomeModal;
