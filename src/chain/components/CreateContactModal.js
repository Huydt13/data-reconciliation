import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import Geocode from 'react-geocode';
import locations from 'app/assets/mock/locations.json';

import { Button, Form, Header, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { createContact } from 'chain/actions/chain';

import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';
import SearchProfileField from 'app/components/shared/SearchProfileField';

import { LocationType } from 'infection-chain/utils/constants';
import LocationSection from './LocationSection';
import AirplaneSection from './AirplaneSection';
import OtherVehicleSection from './OtherVehicleSection';

const StyledLocationVehicleButtonWrapper = styled.div`
  margin-bottom: 10px;
`;

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
Geocode.setLanguage('vi');
Geocode.setRegion('vn');
Geocode.enableDebug();

const CreateContactModal = (props) => {
  const dispatch = useDispatch();
  const {
    open,
    onClose,
    onRefresh,
    onLoad,
    chainId,
    subjectId,
    profileId,
    profileName,
    profileDob,
    loading,
  } = props;

  const [locationType, setLocationType] = useState(0);
  const { register, watch, control, setValue, getValues } = useForm();
  useEffect(() => register('location'), [register]);

  const { selectedChain } = useSelector((s) => s.chain);
  const disabled = useMemo(
    () => !watch('fromTime') || !watch('toTime') || !watch('location'),
    [watch],
  );
  const handleSubmit = async () => {
    onLoad(true);
    let lat;
    let lng;
    const { fromTime, toTime, location, informantProfileId } = getValues();
    // get lat lng from google-apis
    if (
      locationType === LocationType.LOCATION &&
      location.provinceValue &&
      location.wardValue &&
      location.districtValue &&
      location.streetHouseNumber
    ) {
      const provinceLabel = locations.find(
        (p) => p.value === location.provinceValue,
      ).label;
      const districtLabel = locations
        .find((p) => p.value === location.provinceValue)
        .districts.find((d) => d.value === location.districtValue).label;
      const wardLabel = locations
        .find((p) => p.value === location.provinceValue)
        .districts.find((d) => d.value === location.districtValue)
        .wards.find((w) => w.value === location.wardValue).label;
      const house = location.streetHouseNumber;
      const searchAddress = `${house}, ${wardLabel}, ${districtLabel}, ${provinceLabel}`;
      try {
        const result = await Geocode.fromAddress(searchAddress);
        lat = result.results[0].geometry.location.lat;
        lng = result.results[0].geometry.location.lng;
      } catch (e) {
        toast.warn(e);
      }
    }

    const data = {
      subjectFromId: subjectId,
      newContact: {
        fromTime,
        toTime,
        location:
          locationType === LocationType.LOCATION
            ? {
                name: location.name,
                contactName: location?.contactName ?? undefined,
                contactPhoneNumber: location?.contactPhoneNumber ?? undefined,
                address: location,
                lat,
                lng,
                locationType,
                existedLocationId: location?.id ?? undefined,
              }
            : {
                ...location,
                existedLocationId: location?.id ?? undefined,
                locationType,
                departureTime: fromTime,
                arrivalTime: toTime,
              },
        informantProfileId,
      },
      chainId: selectedChain?.id ?? chainId,
    };
    try {
      await dispatch(createContact(data));
    } catch (e) {
      toast.warn(e);
    } finally {
      onLoad(false);
      onClose();
      onRefresh();
    }
  };
  return (
    <Modal open={open}>
      <Modal.Header>Thêm mốc dịch tễ</Modal.Header>
      <Modal.Content>
        <Form>
          <Header as="h3" content="Thông tin chỉ điểm" />
          <Controller
            name="informantProfileId"
            defaultValue=""
            control={control}
            render={({ onChange, value }) => (
              <Form.Field
                required
                initialProfileId={profileId}
                initialProfileName={profileName}
                initialProfileDob={profileDob}
                label="Người chỉ điểm"
                control={SearchProfileField}
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Header as="h3" content="Thông tin địa điểm/phương tiện" />
          <StyledLocationVehicleButtonWrapper>
            <Button.Group>
              <Button
                primary
                basic={locationType !== LocationType.LOCATION}
                content="Địa điểm"
                onClick={() => setLocationType(LocationType.LOCATION)}
              />
              <Button
                primary
                basic={locationType !== LocationType.AIRPLANE}
                content="Máy bay"
                onClick={() => setLocationType(LocationType.AIRPLANE)}
              />
              <Button
                primary
                basic={locationType !== LocationType.VEHICLE}
                content="Phương tiện khác"
                onClick={() => setLocationType(LocationType.VEHICLE)}
              />
            </Button.Group>
          </StyledLocationVehicleButtonWrapper>
          <Form.Group widths="equal">
            <Controller
              name="fromTime"
              defaultValue=""
              control={control}
              render={({ onChange, value }) => (
                <Form.Field
                  required
                  isHavingTime
                  label="Từ thời gian (Mốc dịch tễ)"
                  control={KeyboardDateTimePicker}
                  onChange={onChange}
                  value={value}
                  disabledDays={[{ after: new Date() }]}
                />
              )}
            />
            <Controller
              name="toTime"
              defaultValue=""
              control={control}
              render={({ onChange, value }) => (
                <Form.Field
                  required
                  isHavingTime
                  label="Đến thời gian (Mốc dịch tễ)"
                  control={KeyboardDateTimePicker}
                  onChange={onChange}
                  value={value}
                  disabledDays={[
                    {
                      after: new Date(),
                      before: new Date(watch('fromTime')),
                    },
                  ]}
                />
              )}
            />
          </Form.Group>

          {locationType === LocationType.LOCATION && (
            <LocationSection onChange={(d) => setValue('location', d)} />
          )}
          {locationType === LocationType.AIRPLANE && (
            <AirplaneSection
              hideTime
              onChange={(d) => setValue('location', d)}
            />
          )}
          {locationType === LocationType.VEHICLE && (
            <OtherVehicleSection onChange={(d) => setValue('location', d)} />
          )}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Huỷ" onClick={onClose} />
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          loading={loading}
          disabled={disabled || loading}
          onClick={handleSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
};

CreateContactModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired,
  chainId: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  subjectId: PropTypes.string.isRequired,
  profileId: PropTypes.number.isRequired,
  profileName: PropTypes.string.isRequired,
  profileDob: PropTypes.string.isRequired,
};

CreateContactModal.defaultProps = {
  chainId: '',
};

export default CreateContactModal;
