import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { createHospital, updateHospital } from 'treatment/actions/hospital';

import { AddressDetails } from 'app/components/shared';

const HospitalModal = ({ open, onClose, data, getData }) => {
  const dispatch = useDispatch();
  const { watch, control, handleSubmit, reset } = useForm({
    defaultValues: data,
  });
  useEffect(() => reset(data), [reset, data]);

  const createLoading = useSelector(
    (s) => s.treatment.hospital.createHospitalLoading,
  );
  const updateLoading = useSelector(
    (s) => s.treatment.hospital.updateHospitalLoading,
  );

  const onSubmit = async (d) => {
    await dispatch(!data.id ? createHospital(d) : updateHospital(d));
    onClose();
    getData();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {data?.id ? 'Tạo bệnh viện' : 'Cập nhật thông tin bệnh viện'}
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Controller control={control} defaultValue="" name="id" />
          <Form.Group widths="equal">
            <Controller
              name="description"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  required
                  label="Tên bệnh viện"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              name="address"
              defaultValue={{}}
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  addressName={watch('description')}
                  control={AddressDetails}
                  label="Địa chỉ"
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
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          loading={createLoading || updateLoading}
          disabled={createLoading || updateLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

HospitalModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

export default HospitalModal;
