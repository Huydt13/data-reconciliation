import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Form,
  Button,
  Select,
  Checkbox,
} from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAvailableRooms } from 'quarantine/actions/quarantine';
import { useForm } from 'react-hook-form';
import { KeyboardDatePicker } from 'app/components/shared';

const ApproveSubjectModal = (props) => {
  const {
    open,
    zoneId,
    loading,
    onSubmit,
    onClose,
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
    register({ name: 'roomId' });
    register({ name: 'enterRoomDate' });
    register({ name: 'useCurrentTime' });
    setValue('useCurrentTime', false);
  }, [register, setValue]);

  const useCurrentTime = watch('useCurrentTime');

  const dispatch = useDispatch();

  useEffect(() => {
    if (zoneId) {
      dispatch(getAvailableRooms(zoneId));
    }
  }, [dispatch, zoneId]);

  const { availableRoomsList, getAvailableRoomsLoading } = useSelector((state) => state.quarantine);
  const availableRoomOptions = availableRoomsList.map((r) => ({
    key: r.id,
    text: `${r.name} - Số giường: ${r.numberOfBed}`,
    value: r.id,
  }));

  return (
    <Modal size="small" open={open} onClose={onClose}>
      <Modal.Header>Chọn phòng cho đối tượng</Modal.Header>
      <Modal.Content>
        <Form loading={loading} onSubmit={handleSubmit(onSubmit)}>
          <Form.Field
            required
            clearable
            loading={getAvailableRoomsLoading}
            label="Tên phòng"
            control={Select}
            options={availableRoomOptions}
            value={watch('roomId') || ''}
            onChange={(e, { value }) => {
              setValue('roomId', value);
            }}
          />
          <Form.Field
            required
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
          <Form.Field>
            <Checkbox
              radio
              label="Bắt đầu cách ly ngay hôm sau"
              name="checkboxRadioGroup"
              checked={useCurrentTime}
              onChange={() => {
                setValue('useCurrentTime', true);
              }}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              radio
              label="Bắt đầu cách ly từ thời gian đã nhập khi xử lý đối tượng"
              name="checkboxRadioGroup"
              checked={!useCurrentTime}
              onChange={() => setValue('useCurrentTime', false)}
            />
          </Form.Field>
          <Button
            primary
            content="Xác nhận"
            disabled={!watch('roomId') || !watch('enterRoomDate')}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

ApproveSubjectModal.propTypes = {
  open: PropTypes.bool,
  zoneId: PropTypes.string,
  loading: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

ApproveSubjectModal.defaultProps = {
  open: false,
  zoneId: '',
  loading: false,
  onClose: () => {},
  onSubmit: () => {},
};
export default ApproveSubjectModal;
