import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { transferTreatment } from 'quarantine-facilities/actions/quarantine';

const TreatmentTransferModal = (props) => {
  const { open, onClose, onSubmit, data } = props;
  const { watch, control } = useForm();

  const dispatch = useDispatch();
  const {
    getFacilitiesLoading,
    facilityData: { data: facilityList },
  } = useSelector((s) => s.quarantineFacility);
  const { transferTreatmentLoading } = useSelector((s) => s.quarantine);
  const handleTransfer = async () => {
    await dispatch(
      transferTreatment({
        treatmentFacilityId: watch('treatmentFacilityId'),
        quarantineFormId: data.quarantineForm.id,
      }),
    );
    onClose();
    onSubmit();
  };
  const disabled = useMemo(
    () => Boolean(!watch('treatmentFacilityId')),
    [watch],
  );
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Chuyển sang cách ly điều trị</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleTransfer}>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="treatmentFacilityId"
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  fluid
                  search
                  deburr
                  required
                  clearable
                  loading={getFacilitiesLoading}
                  label="Khu cách ly điều trị"
                  value={value}
                  onChange={(e, { value: v }) => onChange(v)}
                  onBlur={onBlur}
                  options={facilityList
                    .filter((f) => f.isTreatmentZone)
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
            loading={transferTreatmentLoading}
            disabled={disabled || transferTreatmentLoading}
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
