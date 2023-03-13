/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { Button, Form, Modal } from 'semantic-ui-react';

import { Controller, useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { updateFacility } from 'treatment/actions/facility';

import AddressDetails from 'app/components/shared/AddressDetails';

const FacilityModal = (props) => {
  const { open, onClose, getData, data } = props;
  const { register, handleSubmit, watch, reset, control, getValues } = useForm({
    defaultValues: data,
  });
  useEffect(() => {
    register('username');
  }, [register]);
  useEffect(() => reset(data), [reset, data]);

  const dispatch = useDispatch();

  const { createFacilityLoading, updateFacilityLoading } = useSelector(
    (s) => s.quarantineFacility,
  );
  const loading = useMemo(
    () => Boolean(createFacilityLoading || updateFacilityLoading),
    [createFacilityLoading, updateFacilityLoading],
  );

  const onSubmit = async () => {
    const values = getValues();
    if (!data?.id) {
      try {
        // await dispatch(
        //   createFacility({
        //     ...values,
        //     owner: {
        //       userId: selectedUserId !== '-1' ? selectedUserId : undefined,
        //       username: selectedUserId === '-1' ? values.username : undefined,
        //       password: selectedUserId === '-1' ? values.password : undefined,
        //     },
        //   }),
        // );
      } catch (e) {
        toast.warn(e);
      }
    } else {
      try {
        await dispatch(updateFacility(values));
      } catch (e) {
        toast.warn(e);
      }
    }
    onClose();
    getData();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {data?.id ? 'Cập nhật thông tin' : 'Tạo'} cơ sở điều trị
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Controller name="id" control={control} defaultValue="" />
          <Form.Group widths="equal">
            <Controller
              name="name"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  required
                  fluid
                  label="Tên cơ sở điều trị"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              name="contactName"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  label="Người liên hệ"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              name="contactPhone"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  label="SĐT liên hệ"
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
              rules={{
                validate: () => {
                  let error = '';
                  if (!getValues('address')?.provinceValue) {
                    error += 'provinceValue/';
                  }
                  if (!getValues('address')?.districtValue) {
                    error += 'districtValue/';
                  }
                  if (!getValues('address')?.wardValue) {
                    error += 'wardValue/';
                  }
                  if (!getValues('address')?.streetHouseNumber) {
                    error += 'streetHouseNumber';
                  }
                  return error || true;
                },
              }}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  required
                  control={AddressDetails}
                  addressName={watch('name')}
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
          loading={loading}
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

FacilityModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

export default FacilityModal;
