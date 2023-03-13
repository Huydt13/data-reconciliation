import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import {
  Form,
  Input,
  Card,
  Button,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import {
  GoogleMap,
  LoadScript,
  Marker,
} from '@react-google-maps/api';
import Geocode from 'react-geocode';
import { FiEdit3, FiTag } from 'react-icons/fi';

import locations from 'app/assets/mock/locations.json';

import AddressDetails from './ContactLocationAddress';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
Geocode.setLanguage('vi');
Geocode.setRegion('vn');
Geocode.enableDebug();

const ZOOM = 18;

const StyledDiv = styled.div`
  height: 500px;
  width: 100%;
  position: relative;
`;

const StyledCard = styled(Card)`
  padding: 20px !important;
  width: auto !important;
  margin-top: 0 !important;
`;

const StyledFormField = styled(Form.Field)`
  margin-top: 20px !important;
`;

const defaultCenter = { lat: 10.8021033, lng: 106.7360278 };

const StyledWrapper = styled.div`
  display: inline-block;
  & svg {
    vertical-align: text-bottom;
    font-size: 20px;
    margin-left: 8px;
  }
`;

const toggleButton = (label, isMinimize, setMinimize) => (
  <StyledWrapper>
    {label}
    {isMinimize
      ? <FiEdit3 onClick={() => setMinimize(false)} />
      : <FiTag onClick={() => setMinimize(true)} />}
  </StyledWrapper>
);

const ContactLocationForm = (props) => {
  const { initialData, onChange, onSubmit } = props;
  const [mapPosition, setMapPosition] = useState(defaultCenter);
  const [loading, setLoading] = useState(false);
  const [minimizeAddress, setMinimizeAddress] = useState(Boolean(initialData.id));
  const {
    reset,
    watch,
    register,
    setValue,
    getValues,
    handleSubmit,
  } = useForm(
    {
      defaultValues: initialData,
      reValidateMode: 'onChange',
    },
  );

  useEffect(() => {
    reset(initialData);
    // eslint-disable-next-line
  }, [reset, initialData.id]);

  useEffect(() => {
    register({ name: 'id' });
    register({ name: 'address' });
    register({ name: 'lat' });
    register({ name: 'lng' });
  }, [register]);

  const address = watch('address');

  useEffect(() => {
    if (
      address
      && address.streetHouseNumber
      && address.provinceValue
      && address.districtValue
      && address.wardValue
    ) {
      const province = locations.find((p) => p.value === address.provinceValue).label;
      const district = locations
        .find((p) => p.value === address.provinceValue).districts
        .find((d) => d.value === address.districtValue).label;
      const ward = locations
        .find((p) => p.value === address.provinceValue).districts
        .find((d) => d.value === address.districtValue).wards
        .find((w) => w.value === address.wardValue).label;
      const houseNumber = address.streetHouseNumber;

      const searchAddress = `${houseNumber} ${ward} ${district} ${province}`;

      setLoading(true);

      Geocode.fromAddress(searchAddress).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          setMapPosition({ lat, lng });
          setValue('lat', lat);
          setValue('lng', lng);
          setLoading(false);
        },
      );
    }
  }, [address, setValue]);

  const name = watch('name') || '';

  return (
    <StyledCard className="ContactLocationForm">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            label="Tên địa điểm tiếp xúc"
            name="name"
            input={{ ref: register }}
            onBlur={() => {
              onChange(getValues());
            }}
          />
          <Form.Field
            control={Input}
            label="Người liên hệ"
            name="contactName"
            input={{ ref: register }}
            onBlur={() => {
              onChange(getValues());
            }}
          />
          <Form.Field
            control={Input}
            label="Số điện thoại"
            name="contactPhoneNumber"
            input={{ ref: register }}
            onBlur={() => {
              onChange(getValues());
            }}
          />
        </Form.Group>
        <Form.Field
          label={toggleButton('Địa chỉ chi tiết', minimizeAddress, setMinimizeAddress)}
          name={name}
          control={AddressDetails}
          minimize={minimizeAddress}
          initialData={initialData.address}
          onChange={(d) => {
            setValue('address', { ...address, ...d });
            onChange(getValues());
          }}
        />
        <LoadScript
          id="script-loader"
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        >
          {!loading ? (
            <GoogleMap
              zoom={ZOOM}
              center={mapPosition}
              mapContainerStyle={{
                height: '500px',
                width: '100%',
              }}
            >
              <Marker draggable position={mapPosition} />
              <Marker />
            </GoogleMap>
          ) : (
            <StyledDiv>
              <Dimmer active inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>
            </StyledDiv>
          )}
        </LoadScript>
        <StyledFormField
          control={Input}
          label="Ghi chú"
          name="notes"
          input={{ ref: register }}
          onBlur={() => {
            onChange(getValues());
          }}
        />
        <Button primary>Xác nhận</Button>
      </Form>
    </StyledCard>
  );
};

ContactLocationForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    notes: PropTypes.string,
    address: PropTypes.shape({
      floor: PropTypes.string,
      block: PropTypes.string,
      streetHouseNumber: PropTypes.string,
      provinceValue: PropTypes.string,
      districtValue: PropTypes.string,
      wardValue: PropTypes.string,
    }),
  }),
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

ContactLocationForm.defaultProps = {
  initialData: {},
  onChange: () => {},
  onSubmit: () => {},
};

export default ContactLocationForm;
