/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Button, Form, Input, Modal,
} from 'semantic-ui-react';
import { FiX } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { createRooms } from 'quarantine-facilities/actions/quarantine-facility';

const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 0 !important;
`;
const CreateRoomModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const [rooms, setRooms] = useState([{ name: '', occupancy: '' }]);
  const handleAdd = (e) => {
    e.preventDefault();
    setRooms([...rooms, { name: '', occupancy: '' }]);
  };
  const handleRemove = (e, index) => {
    e.preventDefault();
    const values = [...rooms];
    values.splice(index, 1);
    setRooms(values);
  };
  const handleOccupancyChange = (index, value) => {
    const values = [...rooms];
    values[index].occupancy = parseInt(value, 10);
    setRooms(values);
  };
  const handleNameChange = (index, value) => {
    const values = [...rooms];
    values[index].name = value;
    setRooms(values);
  };

  const dispatch = useDispatch();
  const { selectedFacility, createRoomsLoading } = useSelector(
    (s) => s.quarantineFacility,
  );
  const handleCreateRooms = async () => {
    if (selectedFacility) {
      await dispatch(createRooms(selectedFacility.id, rooms));
      onClose();
      onSubmit();
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo phòng</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleCreateRooms}>
          {rooms.map((r, i) => (
            <StyledFormGroup key={i}>
              <Form.Field
                control={Input}
                width="8"
                required
                label="Tên phòng"
                value={rooms[i]?.name ?? ''}
                onChange={(e, { value }) => handleNameChange(i, value)}
              />
              <Form.Field
                width="7"
                required
                type="number"
                name="occupancy"
                label="Số giường"
                control={Input}
                value={rooms[i]?.occupancy ?? ''}
                onChange={(e, { value }) => handleOccupancyChange(i, value)}
              />
              <Form.Group>
                <Form.Button
                  label="Xoá"
                  basic
                  color="red"
                  icon={<FiX />}
                  title="Xoá"
                  onClick={(e) => handleRemove(e, i)}
                />
              </Form.Group>
            </StyledFormGroup>
          ))}
          <>
            <Button
              color="green"
              content="Thêm phòng"
              onClick={(e) => handleAdd(e)}
            />
            <Button
              primary
              content="Xác nhận"
              loading={createRoomsLoading}
              disabled={
                rooms.filter((r) => !r.name || !r.occupancy).length !== 0
                || createRoomsLoading
              }
            />
          </>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

CreateRoomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateRoomModal;
