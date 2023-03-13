import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { transferFacility } from 'quarantine-facilities/actions/quarantine';

const TreatmentTransferModal = (props) => {
  const { open, onClose, onSubmit, data } = props;
  const { watch, control, getValues } = useForm();

  const dispatch = useDispatch();
  const {
    facilityInfo,
    selectedFacility,
    getFacilitiesLoading,
    facilityData: { data: facilityList },
  } = useSelector((s) => s.quarantineFacility);
  const { transferFacilityLoading } = useSelector((s) => s.quarantine);
  const handleTransfer = async () => {
    await dispatch(transferFacility(data.quarantineForm.id, getValues()));
    onClose();
    onSubmit();
  };
  const disabled = useMemo(() => Boolean(!watch('newFacilityId')), [watch]);
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Chuyển khu cách ly</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleTransfer}>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="newFacilityId"
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  fluid
                  search
                  deburr
                  required
                  clearable
                  loading={getFacilitiesLoading}
                  label="Khu cách ly mới"
                  value={value}
                  onChange={(e, { value: v }) => onChange(v)}
                  onBlur={onBlur}
                  options={facilityList
                    .filter((f) => !f.isTreatmentZone)
                    .filter(
                      (f) =>
                        f.id !== (selectedFacility?.id ?? facilityInfo[0]?.id),
                    )
                    .map((f) => ({
                      value: f.id,
                      text: f.name,
                    }))}
                />
              )}
            />
          </Form.Group>
          <Form.Button
            primary
            loading={transferFacilityLoading}
            disabled={disabled || transferFacilityLoading}
            content="Xác nhận"
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

TreatmentTransferModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.shape({
    quarantineForm: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default TreatmentTransferModal;
