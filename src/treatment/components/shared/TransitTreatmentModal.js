import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { transitTreatment } from 'treatment/actions/quarantine-list';
import { KeyboardDateTimePicker } from 'app/components/shared';
import { getHospitals } from 'treatment/actions/hospital';

const TransitTreatmentModal = ({ open, onClose, data, getData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      dispatch(getHospitals({ pageSize: 1000, pageIndex: 0 }));
    }
  }, [dispatch, open, data]);

  const { control, handleSubmit } = useForm();

  const { data: hospitalOptions } = useSelector(
    (s) => s.treatment.hospital.hospitalData,
  );
  const getHospitalsLoading = useSelector(
    (s) => s.treatment.hospital.getHospitalsLoading,
  );

  const loading = useSelector(
    (s) => s.treatment.quarantineList.transitTreatmentLoading,
  );
  const onSubmit = async (d) => {
    await dispatch(
      transitTreatment({
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
      <Modal.Header>Chuyển tuyến trên</Modal.Header>
      <Modal.Content>
        <Form widths="equal">
          <Controller
            control={control}
            defaultValue=""
            name="hospitalName"
            rules={{ required: true }}
            render={({ onChange, onBlur, value }) => (
              <Form.Select
                fluid
                search
                deburr
                clearable
                required
                loading={getHospitalsLoading}
                label="Bệnh viện tuyến trên"
                value={value}
                options={hospitalOptions.map((h) => ({
                  text: h.description,
                  value: h.description,
                }))}
                onChange={(_, { value: v }) => onChange(v)}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            control={control}
            defaultValue=""
            name="transitDate"
            rules={{ required: true }}
            render={({ onChange, onBlur, value }) => (
              <Form.Field
                fluid
                required
                isHavingTime
                control={KeyboardDateTimePicker}
                disabledDays={[{ after: new Date() }]}
                label="Thời gian chuyển tuyến"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            control={control}
            defaultValue=""
            name="transitNote"
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

TransitTreatmentModal.propTypes = {
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
    facilityId: PropTypes.string,
  }).isRequired,
};

export default TransitTreatmentModal;
