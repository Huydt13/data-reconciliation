import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { transferRoom } from 'quarantine-facilities/actions/quarantine';
import { getAvailableRooms } from 'quarantine-facilities/actions/quarantine-facility';

const RoomTransferModal = (props) => {
  const { open, onClose, onSubmit, data } = props;
  const { watch, control, getValues } = useForm();

  const dispatch = useDispatch();
  const {
    facilityInfo,
    selectedRoom,
    selectedFacility,
    getAvailableRoomsLoading,
    availableRoomData: { data: availableRoomList },
  } = useSelector((s) => s.quarantineFacility);

  useEffect(() => {
    if (open && (selectedFacility || facilityInfo[0]?.id)) {
      dispatch(
        getAvailableRooms({
          id: selectedFacility?.id ?? facilityInfo[0]?.id,
          pageIndex: 0,
          pageSize: 1000,
        }),
      );
    }
  }, [open, dispatch, selectedFacility, facilityInfo]);
  const { transferRoomLoading } = useSelector((s) => s.quarantine);
  const handleTransfer = async () => {
    await dispatch(transferRoom(data.quarantineForm.id, getValues()));
    onClose();
    onSubmit();
  };
  const disabled = useMemo(() => Boolean(!watch('newRoomId')), [watch]);
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Chuyển phòng</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleTransfer}>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="newRoomId"
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  fluid
                  search
                  deburr
                  required
                  clearable
                  loading={getAvailableRoomsLoading}
                  label="Phòng mới"
                  value={value}
                  onChange={(e, { value: v }) => onChange(v)}
                  onBlur={onBlur}
                  options={(availableRoomList || [])
                    .filter(
                      (f) => f.id !== (selectedRoom ? selectedRoom.id : ''),
                    )
                    .map((f) => ({
                      value: f.id,
                      text: f.name,
                    }))}
                />
              )}
            />
          </Form.Group>
          <Form.Button
            primary
            loading={transferRoomLoading}
            disabled={disabled || transferRoomLoading}
            content="Xác nhận"
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

RoomTransferModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.shape({
    quarantineForm: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default RoomTransferModal;
