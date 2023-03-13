import React from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { completeTreatment } from 'treatment/actions/quarantine-list';

import { KeyboardDateTimePicker } from 'app/components/shared';

const CompleteTreatmentModal = ({ open, onClose, data, getData }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit } = useForm();

  const loading = useSelector(
    (s) => s.treatment.quarantineList.completeTreatmentLoading,
  );
  const onSubmit = async (d) => {
    await dispatch(
      completeTreatment({
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
      <Modal.Header>Hoàn thành điều trị</Modal.Header>
      <Modal.Content>
        <Form widths="equal">
          <Controller
            control={control}
            defaultValue=""
            name="actualEndDate"
            rules={{ required: true }}
            render={({ onChange, onBlur, value }) => (
              <Form.Field
                fluid
                required
                isHavingTime
                control={KeyboardDateTimePicker}
                disabledDays={[{ after: new Date() }]}
                label="Thời gian kết thúc điều trị"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            control={control}
            defaultValue=""
            name="completeNote"
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

CompleteTreatmentModal.propTypes = {
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

export default CompleteTreatmentModal;
