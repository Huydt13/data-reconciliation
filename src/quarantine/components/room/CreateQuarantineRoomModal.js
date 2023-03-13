import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Button,
  Modal,
} from 'semantic-ui-react';

const CreateRoomModal = (props) => {
  const [data, setData] = useState(null);

  const {
    open,
    loading,
    onClose,
  } = props;

  const handleCreate = () => {
    const {
      onCreate,
    } = props;

    onCreate(data);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo</Modal.Header>
      <Modal.Content>
        <Form
          loading={loading}
          onSubmit={handleCreate}
        >
          <Form.Input
            label="Tên phòng"
            onChange={(event) => setData({
              ...data,
              name: event.target.value,
            })}
          />
          <Form.Input
            label="Số giường"
            type="number"
            min={1}
            onChange={(event) => setData({
              ...data,
              numberOfBed: event.target.value,
            })}
          />
          <Button primary type="submit">Xác nhận</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

CreateRoomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateRoomModal;
