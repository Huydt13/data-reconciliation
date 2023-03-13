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

const AddressDetails = (props) => {
  const { initialData, addressName, readOnly, onChange, loading, minimize } =
    props;

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
    "Cách ly dự phòng tập trung",
    "Cách ly điều trị",
    "Bệnh viện",
     
  ].map((e) => ({ key: e, text: e, value: e }));

  useEffect(() => {
    fields.forEach((name) => {
      register({ name });
    });
    // eslint-disable-next-line
  }, [register]);

  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);

  const provinceV = watch('provinceValue');
  const districtV = watch('districtValue');
  const wardV = watch('wardValue');
  const locationTypeValue = watch('locationType');
  const roomValue = watch('room');
  const floorValue = watch('floor');
  const blockValue = watch('block');
  const quarterValue = watch('quarter');
  const quarterGroupValue = watch('quarterGroup');
  const streetHouseNumberValue = watch('streetHouseNumber');
  const nameValue = watch('name');

  useEffect(() => {
    setProvince(locations.find((p) => p.value === provinceV));
    setDistrict(null);
  }, [provinceV]);

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

  const detailsWard = wardV && wardObject ? `${wardObject.text}` : '';
  const detailsDistrict =
    districtV && districtObject ? `${districtObject.text}` : '';
  const detailsProvince =
    provinceV && provinceObject ? `${provinceObject.text}` : '';
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
          <Form.Group widths="equal">
            <Form.Field
              deburr
              clearable
              search={!readOnly}
              label="Loại hình"
              control={Select}
              value={locationTypeValue || ''}
              options={locationTypes}
              onChange={(e, { value }) => {
                setValue('locationType', value);
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              label="Tên địa điểm"
              disabled={Boolean(addressName)}
              readOnly={readOnly}
              value={addressName || nameValue || ''}
              onChange={(e, { value }) => {
                setValue('name', value);
                onChange(getValues());
              }}
            />
          </Form.Group>
        <fieldset>
          <legend>Địa Chỉ</legend>
        
          <Form.Group widths="equal">
            <Form.Field
              deburr
              search={!readOnly}
              label="Tỉnh/Thành"
              control={Select}
              value={provinceV || ''}
              options={provinceOptions}
              onChange={(el, { value }) => {
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
              search={!readOnly}
              label="Quận/Huyện"
              control={Select}
              value={districtV || ''}
              options={districtOptions}
              onChange={(el, { value }) => {
                if (!readOnly) {
                  setValue('districtValue', value);
                  setValue('wardValue', '');
                  onChange(getValues());
                }
              }}
            />
            <Form.Field
              deburr
              search={!readOnly}
              label="Phường/Xã"
              control={Select}
              value={wardV || ''}
              options={wardOptions}
              onChange={(el, { value }) => {
                if (!readOnly) {
                  setValue('wardValue', value);
                  onChange(getValues());
                }
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              label="Thôn/Ấp/Khu Phố"
              readOnly={readOnly}
              value={quarterValue || ''}
              onChange={(e, { value }) => {
                setValue('quarter', value);
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              label="Tổ dân phố"
              readOnly={readOnly}
              value={quarterGroupValue || ''}
              onChange={(e, { value }) => {
                setValue('quarterGroup', value);
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              label="Địa chỉ (số nhà/đường)"
              name="streetHouseNumber"
              readOnly={readOnly}
              value={streetHouseNumberValue || ''}
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
              value={blockValue || ''}
              onChange={(e, { value }) => {
                setValue('block', value);
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              label="Tầng"
              readOnly={readOnly}
              value={floorValue || ''}
              onChange={(e, { value }) => {
                setValue('floor', value);
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              label="Phòng"
              readOnly={readOnly}
              value={roomValue || ''}
              onChange={(e, { value }) => {
                setValue('room', value);
                onChange(getValues());
              }}
            />
          </Form.Group>
          </fieldset>
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
  initialData: PropTypes.shape({
    floor: PropTypes.string,
    block: PropTypes.string,
    streetHouseNumber: PropTypes.string,
    provinceValue: PropTypes.string,
    districtValue: PropTypes.string,
    wardValue: PropTypes.string,
  }),
  addressName: PropTypes.string,
  readOnly: PropTypes.bool,
  loading: PropTypes.bool,
  minimize: PropTypes.bool,
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
  addressName: '',
  readOnly: false,
  loading: false,
  minimize: false,
  onChange: () => {},
};

export default AddressDetails;
