import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Modal,
  Select,
} from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const SetSetManagerModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const { userList, selectedUser } = useSelector((s) => s.authorize);
  const { setManagerLoading } = useSelector((s) => s.facility);
  const {
    watch,
    register,
    setValue,
    handleSubmit,
  } = useForm();
  useEffect(() => {
    register('managerId');
  }, [register]);
  const disabled = !watch('managerId');
  const loading = setManagerLoading;
  return (
    <Modal size="small" open={open} onClose={onClose}>
      <Modal.Header>Chọn cơ sở quản lý mới</Modal.Header>
      <Modal.Content>
        <Form loading={setManagerLoading} onSubmit={handleSubmit(onSubmit)}>
          <Form.Field
            search
            deburr
            label="Cơ sở quản lý"
            control={Select}
            options={userList
              .filter((u) => u.id !== selectedUser?.id)
              .map((u) => ({
                value: u.id,
                text: u.fullName,
              }))}
            onChange={(e, { value }) => {
              setValue('managerId', value);
            }}
          />
          <Button
            primary
            content="Xác nhận"
            loading={loading}
            disabled={disabled}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

SetSetManagerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SetSetManagerModal;
