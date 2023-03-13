import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { takeIn } from 'quarantine-facilities/actions/quarantine';
import { getAvailableRooms } from 'quarantine-facilities/actions/quarantine-facility';

const ApproveModal = (props) => {
  const { open, onClose, onSubmit, data } = props;
  const { watch, control, getValues } = useForm();
  const { takeInLoading } = useSelector((s) => s.quarantine);
  const {
    selectedFacility,
    facilityInfo,
    availableRoomData: { data: availableRoomList },
    getAvailableRoomsLoading,
  } = useSelector((s) => s.quarantineFacility);
  const dispatch = useDispatch();
  useEffect(() => {
    if (open && (selectedFacility || facilityInfo[0]?.id)) {
      dispatch(
        getAvailableRooms({
          id: selectedFacility?.id ?? facilityInfo[0].id,
          pageIndex: 0,
          pageSize: 1000,
        }),
      );
    }
  }, [open, dispatch, selectedFacility, facilityInfo]);
  const disabled = useMemo(() => !watch('roomId'), [watch]);
  const handleTakeIn = async () => {
    const d = getValues();
    await dispatch(
      takeIn({
        ...d,
        quarantineFormId: data.quarantineForm.id,
      }),
    );
    onClose();
    onSubmit();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Duyệt đối tượng</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleTakeIn}>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="roomId"
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  fluid
                  search
                  deburr
                  required
                  clearable
                  loading={getAvailableRoomsLoading}
                  label="Phòng"
                  value={value}
                  onChange={(e, { value: v }) => onChange(v)}
                  onBlur={onBlur}
                  options={(availableRoomList || []).map((d) => ({
                    text: d.name,
                    value: d.id,
                  }))}
                />
              )}
            />
          </Form.Group>
          <Form.Button
            primary
            loading={takeInLoading}
            disabled={disabled || takeInLoading}
            content="Xác nhận"
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

ApproveModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.shape({
    quarantineForm: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default ApproveModal;
