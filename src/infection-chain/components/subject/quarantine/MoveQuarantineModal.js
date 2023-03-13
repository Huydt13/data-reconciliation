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
import { getZones } from 'quarantine/actions/quarantine';
import { KeyboardDatePicker } from 'app/components/shared';

const MoveQuarantineModal = (props) => {
  const {
    open,
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
    clearErrors,
    setError,
    errors,
  } = useForm({ defaultValues: {} });

  useEffect(() => {
    register({ name: 'newZoneId' });
    register({ name: 'dateStartedToWait' });
    register({ name: 'startTime' });
    register({ name: 'endTime' });
  }, [register]);

  const dispatch = useDispatch();
  const { zoneList } = useSelector((state) => state.quarantine);
  useEffect(() => {
    if (zoneList.length === 0) {
      dispatch(getZones());
    }
  }, [dispatch, zoneList]);

  const zoneOptions = zoneList.map((z) => ({
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
            required
            clearable
            label="Khu cách ly mới"
            control={Select}
            options={zoneOptions.filter((z) => !disabledIds.includes(z.key))}
            value={watch('newZoneId') || ''}
            onChange={(e, { value }) => {
              setValue('newZoneId', value);
            }}
          />
          <Form.Field
            label="Ngày nhận vào phòng"
            control={KeyboardDatePicker}
            value={watch('dateStartedToWait') || ''}
            onChange={(date) => {
              clearErrors('dateStartedToWait');
              setValue('dateStartedToWait', date);
            }}
            onError={(e) => setError('dateStartedToWait', e)}
            error={Boolean(errors.dateStartedToWait)}
          />
          <Form.Field
            label="Ngày bắt đầu cách ly"
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
            label="Ngày kết thúc cách ly"
            control={KeyboardDatePicker}
            value={watch('endTime') || ''}
            onChange={(date) => {
              clearErrors('endTime');
              setValue('endTime', date);
            }}
            onError={(e) => setError('endTime', e)}
            error={Boolean(errors.endTime)}
          />
          <Button primary content="Xác nhận" disabled={!watch('newZoneId')} />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

MoveQuarantineModal.propTypes = {
  open: PropTypes.bool,
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

MoveQuarantineModal.defaultProps = {
  open: false,
  disabledIds: [],
  onClose: () => {},
  subject: {},
  onSubmit: () => {},
};

export default MoveQuarantineModal;
