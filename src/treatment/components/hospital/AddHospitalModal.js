import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import {
  addHospitalsToFacility,
  getHospitals,
} from 'treatment/actions/hospital';

const AddHospitalModal = ({ open, onClose, data, getData }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm({ defaultValues: data });
  useEffect(() => reset(data), [reset, data]);

  useEffect(() => {
    if (open) {
      dispatch(getHospitals({ pageSize: 1000, pageIndex: 0 }));
    }
  }, [dispatch, open, data]);

  const { data: hospitalOptions } = useSelector(
    (s) => s.treatment.hospital.hospitalData,
  );
  const getLoading = useSelector(
    (s) => s.treatment.hospital.getHospitalsLoading,
  );
  const addLoading = useSelector(
    (s) => s.treatment.hospital.addHospitalsLoading,
  );
  const onSubmit = async (d) => {
    await dispatch(
      addHospitalsToFacility({
        facilityId: data.id,
        hospitalIds: d.hospitalIds,
      }),
    );
    onClose();
    getData();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Thêm bệnh viện điều phối</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue={[]}
              name="hospitalIds"
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  fluid
                  search
                  deburr
                  required
                  multiple
                  clearable
                  loading={getLoading}
                  label="Bệnh viện tuyến trên"
                  value={value}
                  options={hospitalOptions.map((h) => ({
                    text: h.description,
                    value: h.id,
                  }))}
                  onChange={(_, { value: v }) => onChange(v)}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          loading={addLoading}
          disabled={addLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

AddHospitalModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

export default AddHospitalModal;
