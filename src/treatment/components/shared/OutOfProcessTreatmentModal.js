import React from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { outOfProcessTreatment } from 'treatment/actions/quarantine-list';
import { KeyboardDateTimePicker } from 'app/components/shared';

const OutOfProcessTreatmentModal = ({ open, onClose, data, getData }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit } = useForm();

  const loading = useSelector(
    (s) => s.treatment.quarantineList.outOfProcessTreatmentLoading,
  );
  const onSubmit = async (d) => {
    await dispatch(
      outOfProcessTreatment({
        ...d,
        profileId: data.profile.id,
        facilityId: data.facility.id,
      }),
    );
    onClose();
    getData();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Chuyển đến ngoài quy trình</Modal.Header>
      <Modal.Content>
        <Form widths="equal">
          <Controller
            control={control}
            defaultValue=""
            name="outOfProcessDate"
            rules={{ required: true }}
            render={({ onChange, onBlur, value }) => (
              <Form.Field
                fluid
                required
                isHavingTime
                control={KeyboardDateTimePicker}
                disabledDays={[{ after: new Date() }]}
                label="Thời gian chuyển đến ngoài quy trình"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            control={control}
            defaultValue=""
            name="outOfProcessNote"
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

OutOfProcessTreatmentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    profile: PropTypes.shape({
      id: PropTypes.number,
    }),
    facility: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default OutOfProcessTreatmentModal;
