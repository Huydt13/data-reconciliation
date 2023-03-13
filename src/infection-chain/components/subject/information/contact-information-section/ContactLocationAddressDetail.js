import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Label, Button } from 'semantic-ui-react';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';

import locations from 'app/assets/mock/locations.json';
import { useSelector } from 'react-redux';
import SearchContactLocation from '../SearchContactLocation';

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

const MarginLeftButton = styled(Button)`
  margin-left: 10px !important;
`;

const ButtonGroupWrapper = styled.div`
  margin-bottom: 10px;
  text-align: right;
  & .buttons {
    margin-top: 16px;
    margin-right: 4px;
  }
`;

const ContactLocationAddressDetail = (props) => {
  const {
    contactId,
    initialData,
    onChange,
    onSubmit,
    onCancel,
    loading,
    minimize,
    locationType,
    name,
  } = props;
  const [contactLocation, setContactLocation] = useState({});

  const {
    floor,
    block,
    streetHouseNumber,
    provinceValue,
    districtValue,
    wardValue,
    contactName,
    contactPhoneNumber,
  } = contactLocation?.id ? contactLocation : initialData;

  const { reset, watch, register, setValue, getValues } = useForm({
    defaultValues: contactLocation?.id ? contactLocation : initialData,
  });
  useEffect(() => {
    reset(contactLocation?.id ? contactLocation : initialData);
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

  useEffect(() => {
    register('id');
    register('name');
    register('locationType');
    register('provinceValue');
    register('districtValue');
    register('wardValue');
    register('contactName');
    register('contactPhoneNumber');
    setValue('contactName', contactName);
    setValue('contactPhoneNumber', contactPhoneNumber);
    // eslint-disable-next-line
  }, [register, setValue]);

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

  const readOnly = Boolean(contactLocation?.id);

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
  // const contactNameValue = watch('contactName');
  // const contactPhoneNumberValue = watch('contactPhoneNumber');
  const floorValue = watch('floor');
  const blockValue = watch('block');
  const quarterValue = watch('quarter');
  const quarterGroupValue = watch('quarterGroup');
  const streetHouseNumberValue = watch('streetHouseNumber');
  const nameValue = contactLocation?.name ?? watch('name');
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
        { key: 'nameValue', label: 'Tên địa điểm:', value: nameValue || name },
        {
          key: 'locationTypeValue',
          label: 'Loại hình:',
          value: locationTypeValue || locationType,
        },
      ],
    },
    // {
    //   rowIndex: 2,
    //   col: [
    //     { key: 'contactName', label: 'Người liên hệ:', value: contactNameValue },
    //     { key: 'contactPhoneNumber', label: 'Số điện thoại:', value: contactPhoneNumberValue },
    //   ],
    // },
    {
      rowIndex: 3,
      col: [
        { key: 'roomValue', label: 'Phòng:', value: roomValue },
        { key: 'floorValue', label: 'Tầng:', value: floorValue },
        { key: 'blockValue', label: 'Khu, lô:', value: blockValue },
      ],
    },
    {
      rowIndex: 4,
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
      rowIndex: 5,
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

  const createButton = (
    <MarginLeftButton
      basic
      color="green"
      disabled={!streetHouseNumberValue}
      content="Tạo địa điểm tiếp xúc"
      onClick={() => onSubmit(getValues())}
    />
  );

  const cancelButton = (
    <MarginLeftButton
      basic
      color="grey"
      content="Huỷ"
      onClick={() => {
        onCancel();
        setContactLocation({ id: -1 });
      }}
    />
  );

  const [isLoading, setIsLoading] = useState(false);
  const { loadingCreateContactLocation } = useSelector(
    (state) => state.contact,
  );

  return (
    <div
      className={`ui form ${
        loading || isLoading || loadingCreateContactLocation ? 'loading' : ''
      }`}
    >
      {!minimize && (
        <>
          <Form.Group widths="equal">
            <Form.Field
              label="Tên địa điểm"
              control={SearchContactLocation}
              onLoad={setIsLoading}
              initialContactLocationId={
                contactLocation?.id || initialData?.id || -1
              }
              initialContactLocationName={
                contactLocation?.name || initialData?.name || ''
              }
              onContactLocationChange={(ct) => {
                setValue('id', ct?.id ?? 0);
                setValue('name', ct?.name ?? '');
                const formattedCT = {
                  id: ct?.id,
                  block: ct?.address?.block,
                  districtValue: ct?.address?.districtValue,
                  floor: ct?.address?.floor,
                  locationType: ct?.locationType,
                  name: ct?.name,
                  provinceValue: ct?.address?.provinceValue,
                  quarter: ct?.address?.quarter,
                  quarterGroup: ct?.address?.quarterGroup,
                  room: ct?.address?.room,
                  streetHouseNumber: ct?.address?.streetHouseNumber,
                  wardValue: ct?.address?.wardValue,
                  contactName: ct?.contactName,
                  contactPhoneNumber: ct?.contactPhoneNumber,
                };
                setContactLocation(formattedCT);
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              label="Người liên hệ"
              name="contactName"
              readOnly={readOnly}
              value={watch('contactName') || ''}
              input={{ ref: register }}
              onBlur={() => {
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              label="Số điện thoại"
              name="contactPhoneNumber"
              readOnly={readOnly}
              value={watch('contactPhoneNumber') || ''}
              input={{ ref: register }}
              onBlur={() => {
                onChange(getValues());
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              search={!readOnly}
              deburr
              clearable
              label="Loại hình"
              control={Select}
              readOnly={readOnly}
              value={watch('locationType') || ''}
              options={locationTypes}
              onChange={(e, { value }) => {
                setValue('locationType', value);
                onChange(getValues());
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              search={!readOnly}
              deburr
              label="Tỉnh/Thành"
              control={Select}
              readOnly={readOnly}
              value={watch('provinceValue') || ''}
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
              search={!readOnly}
              deburr
              label="Quận/Huyện"
              control={Select}
              readOnly={readOnly}
              value={watch('districtValue') || ''}
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
              search={!readOnly}
              deburr
              label="Phường/Xã"
              control={Select}
              readOnly={readOnly}
              value={watch('wardValue') || ''}
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
              readOnly={readOnly}
              label="Thôn/Ấp/Khu Phố"
              name="quarter"
              input={{ ref: register }}
              value={watch('quarter') || ''}
              onBlur={() => {
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              readOnly={readOnly}
              label="Tổ dân phố"
              name="quarterGroup"
              input={{ ref: register }}
              value={watch('quarterGroup') || ''}
              onBlur={() => {
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              label="Địa chỉ (số nhà/đường)"
              name="streetHouseNumber"
              readOnly={readOnly}
              input={{ ref: register }}
              value={watch('streetHouseNumber') || ''}
              onBlur={() => {
                onChange(getValues());
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              label="Khu, Lô"
              name="block"
              readOnly={readOnly}
              input={{ ref: register }}
              value={watch('block') || ''}
              onBlur={() => {
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              label="Tầng"
              name="floor"
              readOnly={readOnly}
              input={{ ref: register }}
              value={watch('floor') || ''}
              onBlur={() => {
                onChange(getValues());
              }}
            />
            <Form.Field
              control={Input}
              label="Phòng"
              readOnly={readOnly}
              name="room"
              input={{ ref: register }}
              value={watch('room') || ''}
              onBlur={() => {
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
      <ButtonGroupWrapper>
        {!minimize && createButton}
        {!contactId && minimize && cancelButton}
      </ButtonGroupWrapper>
    </div>
  );
};

ContactLocationAddressDetail.propTypes = {
  contactId: PropTypes.string,
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    floor: PropTypes.string,
    block: PropTypes.string,
    streetHouseNumber: PropTypes.string,
    provinceValue: PropTypes.string,
    districtValue: PropTypes.string,
    wardValue: PropTypes.string,
  }),
  loading: PropTypes.bool,
  minimize: PropTypes.bool,
  name: PropTypes.string,
  locationType: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

ContactLocationAddressDetail.defaultProps = {
  contactId: '',
  initialData: {
    id: '',
    floor: '',
    block: '',
    streetHouseNumber: '',
    provinceValue: '',
    districtValue: '',
    wardValue: '',
  },
  loading: false,
  minimize: false,
  name: '',
  locationType: '',
  onChange: () => {},
  onSubmit: () => {},
  onCancel: () => {},
};

export default ContactLocationAddressDetail;
