import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Geocode from 'react-geocode';

import locations from 'app/assets/mock/locations';

import { createContactLocation } from 'contact/actions/contact';
import ContactLocationAddressDetail from './ContactLocationAddressDetail';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
Geocode.setLanguage('vi');
Geocode.setRegion('vn');
Geocode.enableDebug();

const ContactLocationSection = (props) => {
  const { contactId, initialData, loading, onChange, onLoad, minimize } = props;

  const { reset, watch, register, setValue, getValues } = useForm({
    defaultValues: initialData,
    reValidateMode: 'onChange',
  });
  useEffect(() => {
    reset(initialData);
    // eslint-disable-next-line
  }, [reset, initialData.id]);

  useEffect(() => {
    register({ name: 'id' });
    register({ name: 'name' });
    register({ name: 'address' });
  }, [register]);

  const address = watch('address') || {};
  const [existedAddress, setExistedAddress] = useState(Boolean(address.id));

  useEffect(() => {
    setExistedAddress(Boolean(address.id));
  }, [address]);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    onLoad(isLoading);
  }, [isLoading, onLoad]);

  const dispatch = useDispatch();
  const handleSubmit = (d) => {
    if (!d.id) {
      const {
        block,
        districtValue,
        floor,
        locationType,
        name,
        provinceValue,
        quarter,
        quarterGroup,
        room,
        streetHouseNumber,
        wardValue,
        contactName,
        contactPhoneNumber,
      } = d;
      if (streetHouseNumber && provinceValue && districtValue && wardValue) {
        const province = locations.find(
          (p) => p.value === address.provinceValue,
        ).label;
        const district = locations
          .find((p) => p.value === address.provinceValue)
          .districts.find((dt) => dt.value === address.districtValue).label;
        const ward = locations
          .find((p) => p.value === address.provinceValue)
          .districts.find((dt) => dt.value === address.districtValue)
          .wards.find((w) => w.value === address.wardValue).label;
        const houseNumber = address.streetHouseNumber;
        const searchAddress = `${houseNumber} ${ward} ${district} ${province}`;
        setIsLoading(true);
        Geocode.fromAddress(searchAddress).then((response) => {
          setIsLoading(false);
          const { lat, lng } = response.results[0].geometry.location;
          const creatingData = {
            name,
            locationType,
            contactName,
            contactPhoneNumber,
            lat,
            lng,
            address: {
              block,
              districtValue,
              floor,
              provinceValue,
              quarter,
              quarterGroup,
              room,
              streetHouseNumber,
              wardValue,
            },
          };
          dispatch(createContactLocation(creatingData)).then((res) => {
            const { address: addr } = creatingData;
            setValue('address', {
              id: res,
              ...addr,
              ...creatingData,
            });
            setExistedAddress(true);
            onChange(getValues());
          });
        });
      }
    }
  };

  return (
    <>
      <div className={`ui form ${loading ? 'loading' : ''}`}>
        <Form.Field
          loading={loading}
          contactId={contactId}
          control={ContactLocationAddressDetail}
          minimize={minimize || existedAddress}
          initialData={address}
          locationType={initialData.locationType}
          name={initialData.name}
          onChange={(d) => {
            setValue('address', { ...address, ...d });
            onChange(getValues());
          }}
          onSubmit={handleSubmit}
          onCancel={() => setExistedAddress(false)}
        />
      </div>
    </>
  );
};

ContactLocationSection.propTypes = {
  contactId: PropTypes.string,
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    address: PropTypes.shape({
      floor: PropTypes.string,
      block: PropTypes.string,
      streetHouseNumber: PropTypes.string,
      provinceValue: PropTypes.string,
      districtValue: PropTypes.string,
      wardValue: PropTypes.string,
    }),
    locationType: PropTypes.string,
  }),
  loading: PropTypes.bool,
  minimize: PropTypes.bool,
  onChange: PropTypes.func,
  onLoad: PropTypes.func,
};

ContactLocationSection.defaultProps = {
  contactId: '',
  initialData: {
    id: '',
    name: '',
    address: {
      floor: '',
      block: '',
      streetHouseNumber: '',
      provinceValue: '',
      districtValue: '',
      wardValue: '',
    },
    locationType: '',
  },
  loading: false,
  minimize: false,
  onChange: () => {},
  onLoad: () => {},
};

export default ContactLocationSection;
