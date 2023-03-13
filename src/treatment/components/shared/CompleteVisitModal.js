/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button } from 'semantic-ui-react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { completeVisit } from 'treatment/actions/visit';

import { KeyboardDateTimePicker } from 'app/components/shared';

const CompleteVisitModal = ({ open, onClose, data, getData }) => {
  const dispatch = useDispatch();
  const methods = useForm();

  const loading = useSelector((s) => s.treatment.visit.completeVisitLoading);

  const onSubmit = async (d) => {
    await dispatch(
      completeVisit({
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
      <Modal.Header>Kết thúc Thăm khám</Modal.Header>
      <Modal.Content>
        <FormProvider {...methods}>
          <Form widths="equal">
            <Controller
              control={methods.control}
              defaultValue={new Date()}
              name="endTime"
              rules={{ required: true }}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  required
                  isHavingTime
                  control={KeyboardDateTimePicker}
                  disabledDays={[{ after: new Date() }]}
                  label="Thời gian kết thúc"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={methods.control}
              defaultValue=""
              name="closeNote"
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
        </FormProvider>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          loading={loading}
          disabled={loading}
          onClick={methods.handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

CompleteVisitModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    profile: PropTypes.shape({
      id: PropTypes.number,
      addressesInVietnam: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    facility: PropTypes.shape({
      id: PropTypes.string,
    }),
    facilityId: PropTypes.string,
  }),
};

CompleteVisitModal.defaultProps = {
  data: {
    profile: {
      addressesInVietnam: [],
    },
  },
};

export default CompleteVisitModal;
