import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Input,
  Modal,
} from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import AddressDetails from 'infection-chain/components/subject/information/form-sections/AddressDetails';

const AddFacilityModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const { getFacilitiesLoading, createFacilityLoading } = useSelector((s) => s.facility);
  const {
    watch,
    register,
    setValue,
    handleSubmit,
  } = useForm();
  useEffect(() => {
    register('address');
  }, [register]);
  const disabled = !watch('name');
  const loading = getFacilitiesLoading || createFacilityLoading;
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header content="Thêm khu/khách sạn cho quận/huyện" />
      <Modal.Content>
        <Form loading={loading} onSubmit={handleSubmit(onSubmit)}>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Input}
              label="Tên khu/khách sạn"
              name="name"
              input={{ ref: register }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              label="Người liên hệ"
              name="contactName"
              input={{ ref: register }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              type="number"
              control={Input}
              label="Số điện thoại liên hệ"
              name="contactPhone"
              input={{ ref: register, maxLength: '10' }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              label="Địa chỉ"
              control={AddressDetails}
              onChange={(d) => {
                setValue('address', d);
              }}
            />
          </Form.Group>
          <Button primary disabled={disabled} content="Xác nhận" />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

AddFacilityModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddFacilityModal;
