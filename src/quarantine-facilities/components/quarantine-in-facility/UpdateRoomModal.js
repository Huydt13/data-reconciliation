import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateRoom } from 'quarantine-facilities/actions/quarantine-facility';

const UpdateRoomModal = (props) => {
  const {
    open, onClose, onSubmit, data,
  } = props;
  const {
    watch, control, reset, getValues,
  } = useForm({ defaultValues: data });
  useEffect(() => reset(data), [reset, data]);
  const disabled = useMemo(
    () => Boolean(!watch('name') || !watch('occupancy')),
    [watch],
  );

  const dispatch = useDispatch();
  const { selectedFacility, updateRoomLoading } = useSelector(
    (s) => s.quarantineFacility,
  );
  const handleUpdateRoom = async () => {
    if (selectedFacility) {
      const { id, name, occupancy } = getValues();
      await dispatch(
        updateRoom(selectedFacility.id, {
          id,
          name,
          occupancy: parseInt(occupancy, 10),
        }),
      );
      onClose();
      onSubmit();
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Cập nhật phòng</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleUpdateRoom}>
          <Form.Group widths="equal">
            <Controller control={control} defaultValue="" name="id" />
            <Controller
              control={control}
              defaultValue=""
              name="name"
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  label="Tên"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="occupancy"
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  type="number"
                  label="Số giường"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
          <Form.Button
            primary
            content="Xác nhận"
            disabled={disabled || updateRoomLoading}
            loading={updateRoomLoading}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

UpdateRoomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
};

export default UpdateRoomModal;
