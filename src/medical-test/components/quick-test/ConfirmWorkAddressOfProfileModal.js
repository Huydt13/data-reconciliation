/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Modal, Form, Select, Input, Button } from 'semantic-ui-react';
import { Controller, useForm } from 'react-hook-form';

import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';

import locations from 'app/assets/mock/locations.json';

const ConfirmWorkAddressOfProfileModal = (props) => {
  const {
    data,
    onClose,
    onChange: onChangeProps,
  } = props;

  const [provinceList] = useState(locations);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const {
    errors,
    watch,
    reset,
    control,
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();

  const provinceValue = watch('provinceCode');
  const districtValue = watch('districtCode');
  const wardValue = watch('wardCode');

  const onSubmit = (d) => onChangeProps({ ...data, ...d });

  useEffect(() => {
    if (data?.id && (data?.profile?.workAddresses ?? []).length > 0) {
      const provinceCode = data.profile.workAddresses[0]?.provinceValue ?? data?.provinceCode ?? '';
      const districtCode = data.profile.workAddresses[0]?.districtValue ?? data?.districtCode ?? '';
      const wardCode = data.profile.workAddresses[0]?.wardValue ?? data?.wardCode ?? '';
      const streetHouseNumber = data.profile.workAddresses[0]?.streetHouseNumber ?? data?.streetHouseNumber ?? '';
      const name = data.profile.workAddresses[0]?.name ?? data?.name ?? '';

      reset({
        provinceCode,
        districtCode,
        wardCode,
        streetHouseNumber,
        name,
      });
    } else {
      reset(data);
    }
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    const tmpProvince = provinceValue && locations.find((p) => p.value === provinceValue);
    const tmpDistrict = districtValue && tmpProvince.districts.find((d) => d.value === districtValue);
    setDistrictList(tmpProvince?.districts ?? []);
    setWardList(tmpDistrict?.wards ?? []);
  }, [provinceValue, districtValue, wardValue]);

  return (
    <Modal
      open={Boolean(data?.id)}
      onClose={() =>
        dispatch(
          showConfirmModal(
            'Dữ liệu chưa được lưu, bạn có muốn đóng?',
            onClose,
          ),
        )
      }
    >
      <Modal.Header>
        Địa chỉ làm việc - học tập của
        {data?.fullName}
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="provinceCode"
              rules={{ required: true }}
              render={({ onChange, value }) => (
                <Form.Field
                  fluid
                  search
                  deburr
                  required
                  error={errors.provinceCode && 'Bắt buộc phải chọn tỉnh/thành'}
                  label="Tỉnh/Thành"
                  control={Select}
                  options={provinceList.map((p) => ({
                    key: p.value,
                    value: p.value,
                    text: p.label,
                  }))}
                  value={value}
                  onChange={(_, { value: v }) => {
                    onChange(v);
                  }}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="districtCode"
              rules={{ required: true }}
              render={({ onChange, value }) => (
                <Form.Field
                  fluid
                  search
                  deburr
                  required
                  error={errors.districtCode && 'Bắt buộc phải chọn quận/huyện'}
                  label="Quận/Huyện"
                  control={Select}
                  options={districtList.map((p) => ({
                    key: p.value,
                    value: p.value,
                    text: p.label,
                  }))}
                  value={value}
                  onChange={(_, { value: v }) => {
                    onChange(v);
                  }}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="wardCode"
              rules={{ required: true }}
              render={({ onChange, value }) => (
                <Form.Field
                  fluid
                  search
                  deburr
                  required
                  error={errors.wardCode && 'Bắt buộc phải chọn quận/huyện'}
                  label="Phường/Xã"
                  control={Select}
                  options={wardList.map((p) => ({
                    key: p.value,
                    value: p.value,
                    text: p.label,
                  }))}
                  value={value}
                  onChange={(_, { value: v }) => {
                    onChange(v);
                  }}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="name"
              rules={{ required: true }}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  required
                  error={errors.name && 'Bắt buộc phải nhập tên nơi làm việc - học tập'}
                  label="Tên nơi làm việc - học tập"
                  control={Input}
                  value={value}
                  onChange={(_, { value: v }) => onChange(v)}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="streetHouseNumber"
              rules={{ required: true }}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  required
                  error={errors.streetHouseNumber && 'Bắt buộc phải nhập địa chỉ nơi làm việc - học tập'}
                  label="Địa chỉ làm việc - học tập"
                  control={Input}
                  value={value}
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
          onClick={handleSubmit((d) => onSubmit(d))}
        />
      </Modal.Actions>
    </Modal>
  );
};

ConfirmWorkAddressOfProfileModal.defaultProps = {
  data: {},
  onChange: () => {},
  onClose: () => {},
};

ConfirmWorkAddressOfProfileModal.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
  }),
  onChange: PropTypes.func,
  onClose: PropTypes.func,
};

export default ConfirmWorkAddressOfProfileModal;
