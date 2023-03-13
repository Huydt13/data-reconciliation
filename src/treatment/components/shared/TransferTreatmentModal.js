/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button } from 'semantic-ui-react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { transferTreatment } from 'treatment/actions/quarantine-list';

import { KeyboardDateTimePicker } from 'app/components/shared';

import FacilitySelection from './FacilitySelection';

const TransferTreatmentModal = ({ open, onClose, data, getData }) => {
  const dispatch = useDispatch();
  const methods = useForm();

  const facilityInfo = useSelector((s) => s.treatment.facility.facilityInfo);
  const loading = useSelector(
    (s) => s.treatment.quarantineList.createTransferLoading,
  );
  const onSubmit = async (d) => {
    await dispatch(
      transferTreatment({
        ...d,
        fromFacilityId: facilityInfo.id,
        profileId: data.profile.id,
        toFacilityId: d.facilityId,
      }),
    );
    onClose();
    getData();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Chuyển cơ sở điều trị</Modal.Header>
      <Modal.Content>
        <FormProvider {...methods}>
          <Form widths="equal">
            <FacilitySelection required hiddenIds={[facilityInfo?.id]} />
            <Controller
              control={methods.control}
              defaultValue=""
              name="transferDate"
              rules={{ required: true }}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  required
                  isHavingTime
                  control={KeyboardDateTimePicker}
                  disabledDays={[{ after: new Date() }]}
                  label="Thời gian chuyển cơ sở"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={methods.control}
              defaultValue=""
              name="transferNote"
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

TransferTreatmentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    profile: PropTypes.shape({
      id: PropTypes.number,
    }),
  }).isRequired,
};

export default TransferTreatmentModal;
