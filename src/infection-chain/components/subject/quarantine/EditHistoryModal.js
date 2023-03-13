import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Form, Button, Select,
} from 'semantic-ui-react';
import { KeyboardDatePicker } from 'app/components/shared';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { getRooms, getAvailableRooms } from 'quarantine/actions/quarantine';

const fields = [
  'id',
  'subjectId',
  'quarantineZoneId',
  'roomId',
  'type',
  'dateCreated',
  'startTime',
  'endTime',
  'enterRoomDate',
  'isCompleted',
  'dateCompleted',
];

const EditHistoryModal = (props) => {
  const {
    open,
    onClose,
    subject,
    onSubmit,
    initialData,
  } = props;

  const {
    watch,
    errors,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({ defaultValues: initialData || {} });

  const dispatch = useDispatch();

  useEffect(() => {
    fields.forEach((name) => {
      register({ name });
    });
    // eslint-disable-next-line
  }, [register]);

  const quarantineZoneId = watch('quarantineZoneId');

  useEffect(() => {
    if (quarantineZoneId) {
      dispatch(getRooms(quarantineZoneId));
      dispatch(getAvailableRooms(quarantineZoneId));
    }
    // eslint-disable-next-line
  }, [quarantineZoneId, dispatch]);

  const { zoneList, roomList, getAvailableRoomsLoading } = useSelector((state) => state.quarantine);
  const qrtOptions = zoneList
    .map((z) => ({
      key: z.id,
      text: z.name,
      value: z.id,
      isTreatmentZone: z.isTreatmentZone,
    }))
    .filter((z) => (subject?.type === 0 ? z.isTreatmentZone : !z.isTreatmentZone));
  const roomOptions = roomList
    .map((r) => ({
      key: r.id,
      text: r.name,
      value: r.id,
    }));

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {subject?.information?.fullName ?? subject?.fullName}
      </Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)} loading={getAvailableRoomsLoading}>
          <Form.Group widths="equal">
            <Form.Field
              clearable
              required
              deburr
              label="Khu cách ly"
              control={Select}
              options={qrtOptions}
              value={watch('quarantineZoneId') || ''}
              onChange={(e, { value }) => {
                setValue('quarantineZoneId', value);
                setValue('roomId', '');
              }}
            />
            <Form.Field
              clearable
              required
              deburr
              label="Tên phòng"
              control={Select}
              options={roomOptions}
              value={watch('roomId') || ''}
              onChange={(e, { value }) => {
                setValue('roomId', value);
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              label="Ngày vào bắt đầu cách ly"
              control={KeyboardDatePicker}
              value={watch('startTime') || ''}
              onChange={(date) => {
                clearErrors('startTime');
                setValue('startTime', date);
              }}
              onError={(e) => setError('startTime', e)}
              error={Boolean(errors.startTime)}
            />
            <Form.Field
              label="Ngày vào kết thúc cách ly"
              control={KeyboardDatePicker}
              value={watch('endTime') || ''}
              onChange={(date) => {
                clearErrors('endTime');
                setValue('endTime', date);
              }}
              onError={(e) => setError('endTime', e)}
              error={Boolean(errors.endTime)}
            />
            <Form.Field
              label="Ngày nhận vào phòng"
              control={KeyboardDatePicker}
              value={watch('enterRoomDate') || ''}
              onChange={(date) => {
                clearErrors('enterRoomDate');
                setValue('enterRoomDate', date);
              }}
              onError={(e) => setError('enterRoomDate', e)}
              error={Boolean(errors.enterRoomDate)}
            />
          </Form.Group>
          <Button
            primary
            disabled={
              !watch('quarantineZoneId')
              || !watch('roomId')
              || !watch('startTime')
              || !watch('endTime')
              || !watch('enterRoomDate')
            }
            content="Xác nhận"
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

EditHistoryModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  subject: PropTypes.oneOfType([
    PropTypes.shape({
      type: PropTypes.number,
      information: PropTypes.shape({
        fullName: PropTypes.string,
      }),
    }),
    PropTypes.shape({
      type: PropTypes.number,
      fullName: PropTypes.string,
    }),
  ]),
  initialData: PropTypes.shape({}),
  onSubmit: PropTypes.func,
};

EditHistoryModal.defaultProps = {
  open: false,
  onClose: () => {},
  subject: {},
  initialData: {},
  onSubmit: () => {},
};

export default EditHistoryModal;
