import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
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

import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { updateContactLocation } from 'contact/actions/contact';

import AddressDetails from '../components/contact-location/ContactLocationAddress';

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

const ContactLocationForm = () => {
  const { id } = useParams();
  const [mapPosition, setMapPosition] = useState(defaultCenter);
  const [loading, setLoading] = useState(false);

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [contactLocation, setContactLocation] = useState(null);
  const [minimizeAddress, setMinimizeAddress] = useState(Boolean(contactLocation?.id));

  const getContactLocation = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(setTimeout(() => {
      setSearchLoading(true);
      httpClient.callApi({
        method: 'GET',
        url: apiLinks.contactLocation(id),
      }).then((response) => {
        setContactLocation(response.data);
      }).finally(() => {
        setSearchLoading(false);
      });
    }, 300));
  };

  const dispatch = useDispatch();

  const handleRefresh = useCallback(() => {
    getContactLocation();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [dispatch, id]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const { address } = contactLocation || { address: {} };
  const [data, setData] = useState(null);

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
          setData({
            ...contactLocation,
            lat,
            lng,
          });
          setLoading(false);
        },
      );
    }
    // eslint-disable-next-line
  }, [address]);

  const handleUpdate = () => {
    dispatch(updateContactLocation(data)).then(() => {
      handleRefresh();
    });
  };

  return (
    <StyledCard className="ContactLocationForm">
      <Form onSubmit={handleUpdate} loading={searchLoading}>
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            label="Tên địa điểm tiếp xúc"
            value={data?.name ?? ''}
            onChange={(event) => setData({
              ...data,
              name: event.target.value,
            })}
          />
          <Form.Field
            control={Input}
            label="Người liên hệ"
            value={data?.contactName ?? ''}
            onChange={(event) => setData({
              ...data,
              contactName: event.target.value,
            })}
          />
          <Form.Field
            control={Input}
            label="Số điện thoại"
            value={data?.contactPhoneNumber ?? ''}
            onChange={(event) => setData({
              ...data,
              contactPhoneNumber: event.target.value,
            })}
          />
        </Form.Group>
        <Form.Field
          label={toggleButton('Địa chỉ chi tiết', minimizeAddress, setMinimizeAddress)}
          control={AddressDetails}
          minimize={minimizeAddress}
          initialData={contactLocation?.address}
          onChange={(d) => setData({
            ...data,
            address: { ...address, ...d },
          })}
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
          onChange={(event) => setData({
            ...data,
            notes: event.target.value,
          })}
        />
        <Button primary>Xác nhận</Button>
      </Form>
    </StyledCard>
  );
};

export default ContactLocationForm;
