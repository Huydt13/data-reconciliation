import React from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { approveWaitingList } from 'treatment/actions/waiting-list';
import { KeyboardDateTimePicker } from 'app/components/shared';

const ApproveTreatmentModal = ({ open, onClose, data, getData }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, getValues } = useForm();

  const loading = useSelector((s) => s.treatment.waitingList.approveLoading);
  const onSubmit = async () => {
    await dispatch(
      approveWaitingList(
        data.profileIds.map((id) => ({
          ...getValues(),
          facilityId: data.facilityId,
          profileId: id,
        })),
      ),
    );
    onClose();
    getData();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Duyệt đối tượng vào cơ sở điều trị</Modal.Header>
      <Modal.Content>
        <Form widths="equal">
          <Controller
            control={control}
            defaultValue=""
            name="approveDate"
            rules={{ required: true }}
            render={({ onChange, onBlur, value }) => (
              <Form.Field
                fluid
                required
                isHavingTime
                control={KeyboardDateTimePicker}
                disabledDays={[{ after: new Date() }]}
                label="Thời gian duyệt vào cơ sở"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            control={control}
            defaultValue=""
            name="note"
            render={({ onChange, onBlur, value }) => (
              <Form.TextArea
                label="Ghi chú"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          loading={loading}
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

ApproveTreatmentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    profileIds: PropTypes.arrayOf(PropTypes.number),
    facilityId: PropTypes.string,
  }).isRequired,
};

export default ApproveTreatmentModal;
