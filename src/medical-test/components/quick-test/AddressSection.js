import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Form, Input, Select } from 'semantic-ui-react';

import { Controller, useForm } from 'react-hook-form';

import locations from 'app/assets/mock/locations.json';

const locationTypes = [
  'Nhà riêng',
  'Chung cư',
  'Ký túc xá',
  'Nhà trọ',
  'Resort/Khu nghỉ dưỡng,Khách sạn',
  'Khách sạn',
  'Nhà nghỉ',
  'Quán ăn uống',
  'Cửa hàng thời trang',
  'Ngân hàng/quỹ tín dụng',
  'Cơ sở khám chữa bệnh',
  'Nhà thuốc',
  'Nhà hộ sinh/Nhà bảo sinh',
  'Phòng xét nghiệm',
  'Khu cách ly',
  'Nhà hàng',
  'Chợ',
  'Siêu thị',
  'Cửa hàng tiện lợi',
  'Karaoke',
  'Bar',
  'Club/Bub/Lounge',
  'Văn phòng',
  'Cơ sở sản xuất',
  'Trụ sở cơ quan nhà nước',
  'Cơ sở giáo dục',
  'Trung tâm bảo trợ xã hội',
  'Cơ sở giải trí, nghệ thuật',
  'Trung tâm thể thao',
  'Điểm du lịch',
  'Cơ sở tôn giáo',
  'Cơ sở giam giữ',
  'Dịch vụ làm đẹp',
  'Cơ sở luyện tập',
  'Cơ sở chăm sóc vật nuôi',
  'Sân bay',
  'Bến xe',
  'Nhà ga',
].map((e) => ({ key: e, text: e, value: e }));

const AddressSection = (props) => {
  const {
    initialData,
    required,
    readOnly,
    isWorkAddress,
    errorText,
    onChange: onChangeProps,
  } = props;

  const [provinceList] = useState(locations);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const { reset, watch, control, setValue, getValues } = useForm({
    defaultValues: initialData,
  });

  const provinceValue = watch('provinceValue');
  const districtValue = watch('districtValue');
  const wardValue = watch('wardValue');

  useEffect(() => {
    reset(initialData);
  }, [reset, initialData]);

  useEffect(() => {
    const tmpProvince = provinceValue && locations.find((p) => p.value === provinceValue);
    const tmpDistrict = districtValue && tmpProvince.districts.find((d) => d.value === districtValue);
    setDistrictList(tmpProvince?.districts ?? []);
    setWardList(tmpDistrict?.wards ?? []);
  }, [provinceValue, districtValue, wardValue]);

  return (
    <div className="ui form">
      <Form.Group widths="equal">
        <Controller
          control={control}
          defaultValue=""
          name="locationType"
          render={({ onChange, value }) => (
            <Form.Field
              fluid
              search
              deburr
              disabled={readOnly}
              label="Loại hình"
              control={Select}
              options={locationTypes}
              value={value}
              onChange={(_, { value: v }) => {
                onChange(v);
                onChangeProps(getValues());
              }}
            />
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="name"
          render={({ onChange, onBlur, value }) => (
            <Form.Field
              required={required && isWorkAddress}
              disabled={readOnly}
              error={errorText.includes('name') && 'Bắt buộc'}
              label="Tên địa điểm"
              control={Input}
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={() => {
                onBlur();
                onChangeProps(getValues());
              }}
            />
          )}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Controller
          control={control}
          defaultValue=""
          name="provinceValue"
          render={({ onChange, value }) => (
            <Form.Field
              fluid
              search
              deburr
              required={required}
              disabled={readOnly}
              error={errorText.includes('provinceValue') && 'Bắt buộc'}
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
                setValue('districtValue', '');
                setValue('wardValue', '');
                onChangeProps(getValues());
              }}
            />
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="districtValue"
          render={({ onChange, value }) => (
            <Form.Field
              fluid
              search
              deburr
              required={required}
              disabled={readOnly}
              error={errorText.includes('districtValue') && 'Bắt buộc'}
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
                setValue('wardValue', '');
                onChangeProps(getValues());
              }}
            />
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="wardValue"
          rules={{ required: true }}
          render={({ onChange, value }) => (
            <Form.Field
              fluid
              search
              deburr
              required={required}
              disabled={readOnly}
              error={errorText.includes('wardValue') && 'Bắt buộc'}
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
                onChangeProps(getValues());
              }}
            />
          )}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Controller
          control={control}
          defaultValue=""
          name="quarter"
          render={({ onChange, onBlur, value }) => (
            <Form.Field
              required={required && !isWorkAddress}
              disabled={readOnly}
              error={errorText.includes('quarter') && 'Bắt buộc'}
              label="Thôn/Ấp/Khu Phố"
              control={Input}
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={() => {
                onBlur();
                onChangeProps(getValues());
              }}
            />
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="quarterGroup"
          render={({ onChange, onBlur, value }) => (
            <Form.Field
              required={required && !isWorkAddress}
              disabled={readOnly}
              error={errorText.includes('quarterGroup') && 'Bắt buộc'}
              label="Tổ dân phố"
              control={Input}
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={() => {
                onBlur();
                onChangeProps(getValues());
              }}
            />
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="streetHouseNumber"
          render={({ onChange, onBlur, value }) => (
            <Form.Field
              required={required}
              disabled={readOnly}
              error={errorText.includes('streetHouseNumber') && 'Bắt buộc'}
              label="Địa chỉ (số nhà/đường)"
              control={Input}
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={() => {
                onBlur();
                onChangeProps(getValues());
              }}
            />
          )}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Controller
          control={control}
          defaultValue=""
          name="block"
          render={({ onChange, onBlur, value }) => (
            <Form.Field
              disabled={readOnly}
              label="Khu, Lô"
              control={Input}
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={() => {
                onBlur();
                onChangeProps(getValues());
              }}
            />
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="floor"
          render={({ onChange, onBlur, value }) => (
            <Form.Field
              disabled={readOnly}
              label="Tầng"
              control={Input}
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={() => {
                onBlur();
                onChangeProps(getValues());
              }}
            />
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="room"
          render={({ onChange, onBlur, value }) => (
            <Form.Field
              disabled={readOnly}
              label="Phòng"
              control={Input}
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={() => {
                onBlur();
                onChangeProps(getValues());
              }}
            />
          )}
        />
      </Form.Group>
    </div>
  );
};

AddressSection.propTypes = {
  initialData: PropTypes.shape({}),
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  isWorkAddress: PropTypes.bool,
  errorText: PropTypes.string,
  onChange: PropTypes.func,
};

AddressSection.defaultProps = {
  initialData: {},
  required: true,
  readOnly: false,
  isWorkAddress: false,
  errorText: '',
  onChange: () => { },
};

export default AddressSection;
