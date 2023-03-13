import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'semantic-ui-react';

import { Controller, useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { searchLocation, getLocationDetail } from 'contact/actions/contact';

import locations from 'app/assets/mock/locations.json';
import { getIndexes } from 'app/utils/helpers';
import { LocationType } from 'infection-chain/utils/constants';
// import { checkEstateName } from 'contact/actions/location';
// import { showForwardModal } from 'app/actions/global';

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
  'Khác',
].map((e) => ({ key: e, text: e, value: e }));

const LocationSection = (props) => {
  const {
    required,
    data: dataProp,
    onChange: onChangeProp,
    // onSelect: onSelectProp,
  } = props;
  const dispatch = useDispatch();
  const {
    searchContactLocationList: { data: searchContactLocationList },
    getSearchContactLocationLoading,
  } = useSelector((state) => state.contact);

  const { watch, control, getValues, setValue, reset, register } = useForm();

  useEffect(() => {
    ['name'].map(register);
  }, [register]);

  const triggerOnChange = useCallback(() => {
    const s = getValues();
    onChangeProp(s);
  }, [getValues, onChangeProp]);

  const [contactLocationOptions, setContactLocationOptions] = useState([]);
  useEffect(() => {
    setContactLocationOptions(() =>
      (searchContactLocationList || [])
        .filter((s) => s.name)
        .map((s) => ({
          text: s.name,
          value: s.id,
        })),
    );
  }, [searchContactLocationList]);

  const [selectedContactLocationId, setSelectedContactLocationId] =
    useState('');
  const onSelectContactLocation = useCallback(
    (locationId, locationName) => {
      if (locationId !== '-1') {
        const getLocationDetails = async () => {
          if (locationId) {
            const location = await dispatch(
              getLocationDetail(locationId, LocationType.LOCATION),
            );
            if (location) {
              setValue('name', location.name);
              setValue('contactPhoneNumer', location.contactPhoneNumber);
              setValue('contactName', location.contactName);
              setValue('room', location.address.room);
              setValue('floor', location.address.floor);
              setValue('block', location.address.block);
              setValue('provinceValue', location.address.provinceValue);
              setValue('districtValue', location.address.districtValue);
              setValue('wardValue', location.address.wardValue);
              setValue('quarter', location.address.quarter);
              setValue('quarterGroup', location.address.quarterGroup);
              setValue('streetHouseNumber', location.address.streetHouseNumber);
              setValue('locationType', location.address.locationType);
            }
            onChangeProp(location);
          }
        };
        getLocationDetails();
      } else {
        reset({
          description: '',
          name: locationName,
          room: '',
          floor: '',
          block: '',
          provinceValue: '',
          districtValue: '',
          wardValue: '',
          quarter: '',
          quarterGroup: '',
          streetHouseNumber: '',
          locationType: '',
        });
      }
    },
    [dispatch, setValue, reset, onChangeProp],
  );

  // if initialData !== null
  useEffect(() => {
    reset({ ...dataProp, ...dataProp?.address, name: dataProp?.name });
  }, [reset, dataProp]);
  // useEffect(() => {
  //   if (!dataProp?.id && !notFetchApi) {
  //     dispatch(searchLocation({ pageSize: 0, pageIndex: 20 }));
  //   }
  // }, [dispatch, dataProp, notFetchApi]);

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

  const provinceOptions = locations.map((p) => ({
    value: p.value,
    text: p.label,
  }));

  const districtOptions = province
    ? province.districts.map((d) => ({
        value: d.value,
        text: d.label,
      }))
    : [];

  const wardOptions = district
    ? district.wards.map((w) => ({
        value: w.value,
        text: w.label,
      }))
    : [];

  const handleSearch = useCallback(
    (_, { searchQuery: name }) => {
      if (name.length > 2) {
        dispatch(searchLocation({ name, pageSize: 20, pageIndex: 0 }));
      }
    },
    [dispatch],
  );

  const contactLocationSelectNode = useMemo(() => {
    if (dataProp) {
      return (
        <Controller
          name="name"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              required={required}
              label="Tên địa điểm"
              value={value}
              onChange={onChange}
              onBlur={async () => {
                // if (onSelectProp) {
                //   const result = await checkEstateName(value);
                //   if (result) {
                //     dispatch(
                //       showForwardModal(
                //         'Địa điểm đã tồn tại, chuyển đến trang địa điểm sau:  ',
                //         () => {
                //           onSelectProp(result);
                //         },
                //       ),
                //     );
                //   }
                // }
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
      );
    }
    return (
      <Form.Select
        fluid
        search
        required={required}
        label="Tên địa điểm"
        allowAdditions
        additionLabel="Thêm mới: "
        loading={getSearchContactLocationLoading}
        options={contactLocationOptions}
        value={selectedContactLocationId}
        onAddItem={(_, { value }) => {
          setContactLocationOptions((so) => [
            ...so.filter((s) => s.value !== '-1'),
            { text: value, value: '-1' },
          ]);
        }}
        onChange={(_, { value }) => {
          if (getIndexes([...value], '-').length === 4) {
            setSelectedContactLocationId(value);
            onSelectContactLocation(value);
          } else {
            setSelectedContactLocationId('-1');
            onSelectContactLocation('-1', value);
          }
        }}
        onSearchChange={handleSearch}
      />
    );
  }, [
    // dispatch,
    // onSelectProp,
    control,
    required,
    dataProp,
    triggerOnChange,
    getSearchContactLocationLoading,
    onSelectContactLocation,
    selectedContactLocationId,
    contactLocationOptions,
    handleSearch,
  ]);

  const disabledInfoFields = useMemo(
    () =>
      Boolean(selectedContactLocationId && selectedContactLocationId !== '-1'),
    [selectedContactLocationId],
  );

  return (
    <div className="ui form">
      <Form.Group widths="equal">
        {contactLocationSelectNode}
        <Controller
          name="contactName"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Người liên hệ"
              disabled={disabledInfoFields}
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
        <Controller
          name="contactPhoneNumber"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              type="number"
              label="SĐT liên hệ"
              disabled={disabledInfoFields}
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Controller
          name="locationType"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Select
              fluid
              deburr
              clearable
              search
              required={required}
              label="Loại hình"
              disabled={disabledInfoFields}
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
              options={locationTypes}
            />
          )}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Controller
          name="provinceValue"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Select
              fluid
              deburr
              clearable
              search
              required={required}
              label="Tỉnh/Thành"
              disabled={disabledInfoFields}
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
              options={provinceOptions}
            />
          )}
        />
        <Controller
          name="districtValue"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Select
              fluid
              deburr
              clearable
              search
              required={required}
              label="Quận/Huyện"
              disabled={disabledInfoFields}
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
              options={districtOptions}
            />
          )}
        />
        <Controller
          name="wardValue"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Select
              fluid
              deburr
              clearable
              search
              required={required}
              label="Phường/Xã"
              disabled={disabledInfoFields}
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
              options={wardOptions}
            />
          )}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Controller
          name="quarter"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Thôn/Ấp/Khu Phố"
              disabled={disabledInfoFields}
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
        <Controller
          name="quarterGroup"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Tổ dân phố"
              disabled={disabledInfoFields}
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
        <Controller
          name="streetHouseNumber"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              required={required}
              label="Địa chỉ (số nhà/đường)"
              disabled={disabledInfoFields}
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
        <Controller
          name="block"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Khu, Lô"
              disabled={disabledInfoFields}
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
      </Form.Group>
    </div>
  );
};

LocationSection.propTypes = {
  data: PropTypes.shape({}),
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  // onSelect: PropTypes.func,
};

LocationSection.defaultProps = {
  data: null,
  required: false,
  // onSelect: () => {},
};

export default LocationSection;
