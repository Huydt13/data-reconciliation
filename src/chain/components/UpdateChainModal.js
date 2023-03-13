import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Header, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { getChainDetail, updateChain } from 'chain/actions/chain';

import { KeyboardDatePicker } from 'app/components/shared';
import { LocationType } from 'infection-chain/utils/constants';

import LocationSection from './LocationSection';
import AirplaneSection from './AirplaneSection';
import OtherVehicleSection from './OtherVehicleSection';

const UpdateChainModal = ({
  isEnd,
  isUpdate,
  onClose,
  onRefresh,
  data: dataProp,
}) => {
  const dispatch = useDispatch();

  const getLoading = useSelector((s) => s.chain.getChainDetailLoading);

  const [data, setData] = useState({});
  const [readOnly, setReadOnly] = useState(false);
  const [locationType, setLocationType] = useState(0);
  const [diseaseOutbreakLocation, setDiseaseOutbreakLocation] = useState({});

  useEffect(() => {
    const getData = async () => {
      if (dataProp?.id) {
        const result = await dispatch(getChainDetail(dataProp.id));
        setData(result);
        setReadOnly(Boolean(result?.toTime));
        setLocationType(result.diseaseOutbreakLocationType);
        setDiseaseOutbreakLocation(result.diseaseOutbreakLocation);
      }
    };
    getData();
  }, [dispatch, dataProp]);

  const loading = useSelector((s) => s.chain.updateChainLoading);
  const { watch, control, reset, getValues, errors } = useForm({
    defaultValues: data,
  });
  useEffect(() => reset(data), [reset, data]);

  const handleSubmit = async () => {
    const {
      id,
      name,
      fromTime,
      hcM_Alias: hcmAlias,
      hcdC_Alias: hcdcAlias,
      byT_Alias: bytAlias,
    } = getValues();
    if (isUpdate) {
      await dispatch(
        updateChain({
          id,
          name,
          fromTime,
          hcM_Alias: hcmAlias,
          hcdC_Alias: hcdcAlias,
          byT_Alias: bytAlias,
          diseaseOutbreakLocationType: locationType,
          diseaseOutbreakLocation:
            locationType === LocationType.LOCATION
              ? {
                  id:
                    diseaseOutbreakLocation?.id ??
                    data?.diseaseOutbreakLocation?.id ??
                    undefined,
                  name: diseaseOutbreakLocation.name,
                  lat: diseaseOutbreakLocation?.lat ?? undefined,
                  lng: diseaseOutbreakLocation?.lng ?? undefined,
                  contactName:
                    diseaseOutbreakLocation?.contactName ?? undefined,
                  contactPhoneNumber:
                    diseaseOutbreakLocation?.contactPhoneNumber ?? undefined,
                  address: diseaseOutbreakLocation,
                  locationType,
                  existedLocationId: diseaseOutbreakLocation?.id ?? undefined,
                }
              : {
                  ...diseaseOutbreakLocation,
                  locationType,
                  id:
                    diseaseOutbreakLocation?.id ??
                    data?.diseaseOutbreakLocation?.id ??
                    undefined,
                  existedLocationId: diseaseOutbreakLocation?.id ?? undefined,
                },
        }),
      );
    }
    if (isEnd) {
      await dispatch(updateChain(getValues()));
    }
    onClose();
    onRefresh();
  };

  return (
    <Modal size="small" open={Boolean(dataProp?.id)} onClose={onClose}>
      <Modal.Header>Cập nhật chuỗi</Modal.Header>
      <Modal.Content>
        <Form loading={getLoading}>
          <Controller defaultValue="" name="id" control={control} />
          {isUpdate && (
            <>
              <Form.Group widths="equal">
                <Controller
                  control={control}
                  defaultValue=""
                  name="name"
                  render={({ onChange, onBlur, value }) => (
                    <Form.Input
                      required
                      readOnly={readOnly}
                      fluid
                      label="Tên chuỗi"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                <Controller
                  name="fromTime"
                  defaultValue=""
                  control={control}
                  render={({ onChange, value }) => (
                    <Form.Field
                      required
                      readOnly={readOnly}
                      label="Ngày bắt đầu chuỗi"
                      control={KeyboardDatePicker}
                      onChange={onChange}
                      value={value || ''}
                      // disabledDays={[{ after: new Date() }]}
                    />
                  )}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Controller
                  name="byT_Alias"
                  defaultValue=""
                  control={control}
                  rule={{
                    validate: () =>
                      !(
                        watch('byT_Alias') ||
                        watch('hcM_Alias') ||
                        watch('hcdC_Alias')
                      ),
                  }}
                  render={({ onChange, onBlur, value }) => (
                    <Form.Input
                      label="Bí danh Bộ Y Tế"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={errors.byT_Alias}
                    />
                  )}
                />
                <Controller
                  name="hcM_Alias"
                  defaultValue=""
                  control={control}
                  rule={{
                    validate: () =>
                      !(
                        watch('byT_Alias') ||
                        watch('hcM_Alias') ||
                        watch('hcdC_Alias')
                      ),
                  }}
                  render={({ onChange, onBlur, value }) => (
                    <Form.Input
                      label="Bí danh Hồ Chí Minh"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={errors.hcM_Alias}
                    />
                  )}
                />
                <Controller
                  name="hcdC_Alias"
                  defaultValue=""
                  control={control}
                  rule={{
                    validate: () =>
                      !(
                        watch('byT_Alias') ||
                        watch('hcM_Alias') ||
                        watch('hcdC_Alias')
                      ),
                  }}
                  render={({ onChange, onBlur, value }) => (
                    <Form.Input
                      label="Bí danh CDC"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={errors.hcdC_Alias}
                    />
                  )}
                />
              </Form.Group>

              <Header as="h3" content="Thông tin nơi phát bệnh" />

              {locationType === LocationType.LOCATION && (
                <LocationSection
                  required
                  data={data?.diseaseOutbreakLocation}
                  onChange={setDiseaseOutbreakLocation}
                />
              )}
              {locationType === LocationType.AIRPLANE && (
                <AirplaneSection
                  data={data?.diseaseOutbreakLocation}
                  onChange={setDiseaseOutbreakLocation}
                />
              )}
              {locationType === LocationType.VEHICLE && (
                <OtherVehicleSection
                  data={data?.diseaseOutbreakLocation}
                  onChange={setDiseaseOutbreakLocation}
                />
              )}
            </>
          )}

          {isEnd && (
            <Controller
              name="toTime"
              defaultValue=""
              control={control}
              render={({ onChange, value }) => (
                <Form.Field
                  required
                  readOnly={readOnly}
                  label="Ngày kết thúc chuỗi"
                  control={KeyboardDatePicker}
                  onChange={onChange}
                  value={value || ''}
                  // disabledDays={[
                  //   {
                  //     before: new Date(watch('fromTime')),
                  //     after: new Date(),
                  //   },
                  // ]}
                />
              )}
            />
          )}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        {!readOnly && (
          <>
            {isUpdate && (
              <Button
                color="violet"
                labelPosition="right"
                icon="sync"
                content="Cập nhật"
                loading={loading}
                disabled={loading}
                onClick={handleSubmit}
              />
            )}
            {isEnd && (
              <Button
                positive
                labelPosition="right"
                icon="checkmark"
                content="Kết thúc chuỗi"
                loading={loading}
                disabled={!watch('toTime') || loading}
                onClick={handleSubmit}
              />
            )}
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
};

UpdateChainModal.propTypes = {
  isEnd: PropTypes.bool,
  isUpdate: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

UpdateChainModal.defaultProps = {
  isEnd: false,
  isUpdate: false,
};

export default UpdateChainModal;
