/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button } from 'semantic-ui-react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { createVisit } from 'treatment/actions/visit';

import { AddressDetails, KeyboardDateTimePicker } from 'app/components/shared';

const VisitModal = ({ open, onClose, data, getData }) => {
  const dispatch = useDispatch();
  const methods = useForm();

  const accountInfo = useSelector((s) => s.treatment.account.accountInfo);

  const loading = useSelector((s) => s.treatment.visit.createVisitLoading);

  useEffect(() => {
    methods.reset(data);
    // eslint-disable-next-line
  }, [methods.reset, data]);

  const onSubmit = async (d) => {
    await dispatch(
      createVisit({
        ...d,
        profileId: data.profile.id,
        facilityId: data.facility.id,
        doctorId: accountInfo.doctor.id,
      }),
    );
    onClose();
    getData();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Thăm khám</Modal.Header>
      <Modal.Content>
        <FormProvider {...methods}>
          <Form widths="equal">
            <Controller
              control={methods.control}
              defaultValue={new Date()}
              name="visitTime"
              rules={{ required: true }}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  required
                  isHavingTime
                  control={KeyboardDateTimePicker}
                  disabledDays={[{ after: new Date() }]}
                  label="Thời gian thăm khám"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              name="place"
              defaultValue={data?.profile?.addressesInVietnam[0] ?? {}}
              control={methods.control}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  control={AddressDetails}
                  label="Nơi thăm khám"
                  initialData={
                    value || {
                      floor: '',
                      block: '',
                      streetHouseNumber: '',
                      provinceValue: '',
                      districtValue: '',
                      wardValue: '',
                    }
                  }
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={methods.control}
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

VisitModal.propTypes = {
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

VisitModal.defaultProps = {
  data: {
    profile: {
      addressesInVietnam: [],
    },
  },
};

export default VisitModal;
