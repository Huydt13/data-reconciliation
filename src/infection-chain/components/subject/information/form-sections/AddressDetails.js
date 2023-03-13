import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Label } from 'semantic-ui-react';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';

import locations from 'app/assets/mock/locations.json';

const fields = [
  'name',
  'locationType',
  'provinceValue',
  'districtValue',
  'wardValue',
  'room',
  'floor',
  'block',
  'quarter',
  'quarterGroup',
  'streetHouseNumber',
];

const StyledMinimizeWrapper = styled.div`
  & .ui.label {
    margin-left: 3px !important;
    margin-right: 0 !important;
    margin-bottom: 3px;
    font-weight: normal !important;
    font-size: 0.9em !important;
  }
  & .detail {
    margin-left: 3px !important;
  }
`;

const AddressDetails = ({
  initialData,
  readOnly,
  onChange,
  loading,
  minimize,
  disabled,
  required,
  errorText,
}) => {
  const {
    floor,
    block,
    streetHouseNumber,
    provinceValue,
    districtValue,
    wardValue,
  } = initialData;

  const { reset, watch, register, setValue, getValues } = useForm({
    defaultValues: initialData,
  });
  useEffect(() => {
    reset(initialData);
    // eslint-disable-next-line
  }, [
    reset,
    floor,
    block,
    streetHouseNumber,
    provinceValue,
    districtValue,
    wardValue,
  ]);

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

  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const provinceV = watch('provinceValue');
  useEffect(() => {
    setProvince(locations.find((p) => p.value === provinceV));
    setDistrict(null);
  }, [provinceV]);

  const districtV = watch('districtValue');
  useEffect(() => {
    if (province) {
      setDistrict(province.districts.find((d) => d.value === districtV));
    }
  }, [districtV, province]);

  let provinceOptions = locations.map((p) => ({
    value: p.value,
    text: p.label,
  }));

  let districtOptions = province
    ? province.districts.map((d) => ({
        value: d.value,
        text: d.label,
      }))
    : [];

  let wardOptions = district
    ? district.wards.map((w) => ({
        value: w.value,
        text: w.label,
      }))
    : [];

  useEffect(() => {
    fields.forEach((name) => {
      register({ name });
    });
    // eslint-disable-next-line
  }, [register]);

  if (readOnly) {
    provinceOptions = provinceOptions.filter((p) => p.value === provinceValue);
    districtOptions = districtOptions.filter((d) => d.value === districtValue);
    wardOptions = wardOptions.filter((w) => w.value === wardValue);
  }

  const districtObject = districtValue
    ? districtOptions.find((d) => d.value === districtValue)
    : '';
  const provinceObject = provinceValue
    ? provinceOptions.find((p) => p.value === provinceValue)
    : '';
  const wardObject = wardValue
    ? wardOptions.find((w) => w.value === wardValue)
    : '';

  const locationTypeValue = watch('locationType');
  const roomValue = watch('room');
  const floorValue = watch('floor');
  const blockValue = watch('block');
  const quarterValue = watch('quarter');
  const quarterGroupValue = watch('quarterGroup');
  const streetHouseNumberValue = watch('streetHouseNumber');
  const nameValue = watch('name');
  const detailsWard =
    watch('wardValue') && wardObject ? `${wardObject.text}` : '';
  const detailsDistrict =
    watch('districtValue') && districtObject ? `${districtObject.text}` : '';
  const detailsProvince =
    watch('provinceValue') && provinceObject ? `${provinceObject.text}` : '';
  const d = [
    {
      rowIndex: 1,
      col: [
        {
          key: 'locationTypeValue',
          label: 'Loại hình:',
          value: locationTypeValue,
        },
        { key: 'nameValue', label: 'Tên địa điểm:', value: nameValue },
      ],
    },
    {
      rowIndex: 2,
      col: [
        { key: 'roomValue', label: 'Phòng:', value: roomValue },
        { key: 'floorValue', label: 'Tầng:', value: floorValue },
        { key: 'blockValue', label: 'Khu, lô:', value: blockValue },
      ],
    },
    {
      rowIndex: 3,
      col: [
        { key: 'quarterValue', label: 'Thôn/Ấp/Khu phố:', value: quarterValue },
        {
          key: 'quarterGroupValue',
          label: 'Tổ dân phố:',
          value: quarterGroupValue,
        },
        {
          key: 'streetHouseNumberValue',
          label: 'Địa chỉ (số nhà/đường):',
          value: streetHouseNumberValue,
        },
      ],
    },
    {
      rowIndex: 4,
      col: [
        { key: 'detailsWard', label: 'Phường/Xã:', value: detailsWard },
        {
          key: 'detailsDistrict',
          label: 'Quận/Huyện:',
          value: detailsDistrict,
        },
        {
          key: 'detailsProvince',
          label: 'Tỉnh/Thành:',
          value: detailsProvince,
        },
      ],
    },
  ];

  return (
    <div className={`ui form ${loading ? 'loading' : ''}`}>
      {!minimize && (
        <>
          <Form.Group widths="equal" className={disabled ? 'disabled' : ''}>
            <Form.Field
              deburr
              clearable
              search={!readOnly}
              label="Loại hình"
              control={Select}
              value={watch('locationType') || ''}
              options={locationTypes}
              onChange={(e, { value }) => {
                setValue('locationType', value);
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              label="Tên địa điểm"
              readOnly={readOnly}
              value={watch('name') || ''}
              onChange={(e, { value }) => {
                setValue('name', value);
                onChange(getValues());
              }}
            />
          </Form.Group>
          <Form.Group widths="equal" className={disabled ? 'disabled' : ''}>
            <Form.Field
              deburr
              required={required}
              search={!readOnly}
              label="Tỉnh/Thành"
              control={Select}
              value={watch('provinceValue')}
              options={provinceOptions}
              onChange={(_, { value }) => {
                if (!readOnly) {
                  setValue('provinceValue', value);
                  setValue('districtValue', '');
                  setValue('wardValue', '');
                  onChange(getValues());
                }
              }}
            />
            <Form.Field
              deburr
              required={required}
              error={errorText.includes('districtValue') && 'Bắt buộc'}
              search={!readOnly}
              label="Quận/Huyện"
              control={Select}
              value={watch('districtValue')}
              options={districtOptions}
              onChange={(_, { value }) => {
                if (!readOnly) {
                  setValue('districtValue', value);
                  setValue('wardValue', '');
                  onChange(getValues());
                }
              }}
            />
            <Form.Field
              deburr
              required={required}
              error={errorText.includes('wardValue') && 'Bắt buộc'}
              search={!readOnly}
              label="Phường/Xã"
              control={Select}
              value={watch('wardValue')}
              options={wardOptions}
              onChange={(_, { value }) => {
                if (!readOnly) {
                  setValue('wardValue', value);
                  onChange(getValues());
                }
              }}
            />
          </Form.Group>
          <Form.Group widths="equal" className={disabled ? 'disabled' : ''}>
            <Form.Field
              control={Input}
              required={required}
              error={errorText.includes('quarter') && 'Bắt buộc'}
              label="Thôn/Ấp/Khu Phố"
              readOnly={readOnly}
              value={watch('quarter') || ''}
              onChange={(e, { value }) => {
                setValue('quarter', value);
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              required={required}
              error={errorText.includes('quarterGroup') && 'Bắt buộc'}
              label="Tổ dân phố"
              readOnly={readOnly}
              value={watch('quarterGroup') || ''}
              onChange={(e, { value }) => {
                setValue('quarterGroup', value);
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              required={required}
              error={errorText.includes('streetHouseNumber') && 'Bắt buộc'}
              label="Địa chỉ (số nhà/đường)"
              name="streetHouseNumber"
              readOnly={readOnly}
              value={watch('streetHouseNumber') || ''}
              onChange={(e, { value }) => {
                setValue('streetHouseNumber', value);
                onChange(getValues());
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              label="Khu, Lô"
              readOnly={readOnly}
              value={watch('block') || ''}
              onChange={(e, { value }) => {
                setValue('block', value);
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              label="Tầng"
              readOnly={readOnly}
              value={watch('floor') || ''}
              onChange={(e, { value }) => {
                setValue('floor', value);
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              label="Phòng"
              readOnly={readOnly}
              value={watch('room') || ''}
              onChange={(e, { value }) => {
                setValue('room', value);
                onChange(getValues());
              }}
            />
          </Form.Group>
        </>
      )}
      {minimize && (
        <StyledMinimizeWrapper>
          {d.map((r) => (
            <div key={r.rowIndex}>
              {r.col.map((f) => (
                <Label key={f.key} basic content={f.label} detail={f.value} />
              ))}
            </div>
          ))}
        </StyledMinimizeWrapper>
      )}
    </div>
  );
};

AddressDetails.propTypes = {
  initialData: PropTypes.oneOfType([
    PropTypes.shape({
      floor: PropTypes.string,
      block: PropTypes.string,
      streetHouseNumber: PropTypes.string,
      provinceValue: PropTypes.string,
      districtValue: PropTypes.string,
      wardValue: PropTypes.string,
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        floor: PropTypes.string,
        block: PropTypes.string,
        streetHouseNumber: PropTypes.string,
        provinceValue: PropTypes.string,
        districtValue: PropTypes.string,
        wardValue: PropTypes.string,
      }),
    ),
  ]),
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  errorText: PropTypes.string,
  loading: PropTypes.bool,
  minimize: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

AddressDetails.defaultProps = {
  initialData: {
    floor: '',
    block: '',
    streetHouseNumber: '',
    provinceValue: '',
    districtValue: '',
    wardValue: '',
  },
  readOnly: false,
  required: false,
  errorText: '',
  loading: false,
  minimize: false,
  disabled: false,
  onChange: () => {},
};

export default AddressDetails;
