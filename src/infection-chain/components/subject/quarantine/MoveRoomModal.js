import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Form,
  Select,
  Button,
} from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getAvailableRooms } from 'quarantine/actions/quarantine';

const MoveRoomModal = (props) => {
  const {
    open,
    zoneId,
    disabledIds,
    onClose,
    subject,
    onSubmit,
  } = props;

  const {
    watch,
    register,
    setValue,
    handleSubmit,
  } = useForm({ defaultValues: {} });

  useEffect(() => {
    register({ name: 'newRoomId' });
  }, [register]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (zoneId) {
      dispatch(getAvailableRooms(zoneId));
    }
  }, [dispatch, zoneId]);

  const { availableRoomsList } = useSelector((state) => state.quarantine);
  const availableRoomsOptions = availableRoomsList.map((z) => ({
    key: z.id,
    text: z.name,
    value: z.id,
  }));

  return (
    <Modal
      size="mini"
      open={open}
      onClose={onClose}
    >
      <Modal.Header>{subject?.information?.fullName ?? subject?.fullName}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field
            clearable
            required
            label="Phòng mới"
            control={Select}
            options={availableRoomsOptions.filter((r) => !disabledIds.includes(r.key))}
            value={watch('newRoomId') || ''}
            onChange={(e, { value }) => {
              setValue('newRoomId', value);
            }}
          />
          <Button primary content="Xác nhận" disabled={!watch('newRoomId')} />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

MoveRoomModal.propTypes = {
  open: PropTypes.bool,
  zoneId: PropTypes.string,
  disabledIds: PropTypes.arrayOf(PropTypes.string),
  onClose: PropTypes.func,
  subject: PropTypes.oneOfType([
    PropTypes.shape({
      information: PropTypes.shape({
        fullName: PropTypes.string,
      }),
    }),
    PropTypes.shape({
      fullName: PropTypes.string,
    }),
  ]),
  onSubmit: PropTypes.func,
};

MoveRoomModal.defaultProps = {
  open: false,
  zoneId: '',
  disabledIds: [],
  onClose: () => {},
  subject: {},
  onSubmit: () => {},
};

export default MoveRoomModal;
