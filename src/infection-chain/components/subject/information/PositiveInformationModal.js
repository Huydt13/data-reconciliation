import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import {
  Button,
  Form,
  Header,
  Input,
  Modal,
} from 'semantic-ui-react';
import AddressDetails from './form-sections/AddressDetails';

const PositiveInformationModal = (props) => {
  const {
    open,
    loading,
    onClose,
    onSubmit,
  } = props;
  const {
    errors,
    register,
    setValue,
    getValues,
    trigger,
  } = useForm();
  useEffect(() => {
    register({ name: 'code', required: true }); // cdc
    register({ name: 'alias' }); // byt
    register({ name: 'privateAlias' }); // byt
    register({ name: 'diseaseLocation' });
  }, [register]);
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Modal.Header>Thông tin bệnh nhân</Modal.Header>
        <Modal.Content>
          <Form loading={loading} onSubmit={() => onSubmit(getValues())}>
            <Header as="h4" content="Thông tin người bệnh" />
            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                label="Bí danh CDC"
                onChange={(e, { value }) => {
                  trigger('code');
                  setValue('code', value);
                }}
                error={Boolean(errors.code)}
              />
              <Form.Field
                control={Input}
                label="Bí danh HCM"
                onChange={(e, { value }) => {
                  setValue('privateAlias', value);
                }}
              />
              <Form.Field
                control={Input}
                label="Bí danh BYT"
                onChange={(e, { value }) => {
                  setValue('alias', value);
                }}
              />
            </Form.Group>
            <Header as="h4" content="Địa điểm phát bệnh" />
            <Form.Group widths="equal">
              <Form.Field
                control={AddressDetails}
                onChange={(d) => {
                  setValue('diseaseLocation', d);
                }}
              />
            </Form.Group>
            <Button primary content="Xác nhận" loading={loading} />
          </Form>
        </Modal.Content>
      </Modal>
    </>
  );
};

PositiveInformationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default PositiveInformationModal;
