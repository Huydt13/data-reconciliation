import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Modal } from 'semantic-ui-react';

import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { addLocationVisitors } from 'contact/actions/location';

import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';

const AddVisitorModal = ({ open, onClose, data }) => {
  const dispatch = useDispatch();

  const { addLocationVisitorsLoading } = useSelector((s) => s.location);

  const { watch, control, getValues } = useForm();
  const handleSubmit = async () => {
    const d = getValues();
    await dispatch(
      addLocationVisitors({
        locationVisitorAddModel: {
          ...d,
          locationId: data.id,
          locationType: data.locationType,
          profileIds: [],
        },
      }),
    );
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo mốc dịch tễ</Modal.Header>
      <Modal.Content>
        <div className="ui form">
          <Form.Group widths="equal">
            <Controller
              name="fromTime"
              defaultValue=""
              control={control}
              render={({ onChange, value }) => (
                <Form.Field
                  required
                  isHavingTime
                  label="Từ thời gian (Mốc dịch tễ)"
                  control={KeyboardDateTimePicker}
                  onChange={onChange}
                  value={value}
                  disabledDays={[{ after: new Date() }]}
                />
              )}
            />
            <Controller
              name="toTime"
              defaultValue=""
              control={control}
              render={({ onChange, value }) => (
                <Form.Field
                  isHavingTime
                  label="Đến thời gian (Mốc dịch tễ)"
                  control={KeyboardDateTimePicker}
                  onChange={onChange}
                  value={value}
                  disabledDays={[
                    {
                      after: new Date(),
                      before: new Date(watch('fromTime')),
                    },
                  ]}
                />
              )}
            />
          </Form.Group>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Hoàn tất"
          loading={addLocationVisitorsLoading}
          disabled={!watch('fromTime') || addLocationVisitorsLoading}
          onClick={handleSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
};

AddVisitorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    locationType: PropTypes.number,
  }).isRequired,
};

export default AddVisitorModal;
