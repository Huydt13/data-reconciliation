import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Modal, Form, Button } from 'semantic-ui-react';
import AddressDetails from './AddressDetails';

const AddressModal = (props) => {
  const { open, onClose, onSubmit, initialData, label } = props;

  const { reset, register, setValue, getValues, handleSubmit } = useForm({
    defaultValues: { ...initialData },
  });

  useEffect(() => {
    register({ name: 'guid' });
    register({ name: 'addresses' });
    // eslint-disable-next-line
  }, [register]);

  useEffect(() => {
    reset(initialData);
    // eslint-disable-next-line
  }, [reset, initialData.id]);

  const modal = (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {initialData?.guid ? 'Sửa ' : 'Thêm '}
        {label.toLowerCase()}
      </Modal.Header>
      <Modal.Content>
        <Form className="ui form" onSubmit={handleSubmit(onSubmit)}>
          <Form.Field
            control={AddressDetails}
            initialData={initialData || {}}
            onChange={(d) => {
              setValue('addresses', d);
              getValues();
            }}
          />
          <Button primary>Xác nhận</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );

  return <div>{modal}</div>;
};

AddressModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  initialData: PropTypes.shape({}),
  label: PropTypes.string,
};

AddressModal.defaultProps = {
  open: false,
  onClose: () => {},
  onSubmit: () => {},
  initialData: {},
  label: '',
};

export default AddressModal;
