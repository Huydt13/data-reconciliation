/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  // useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Button, Form, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import moment from 'moment';
import { toast } from 'react-toastify';

import { LocationType } from 'infection-chain/utils/constants';

import { useSelector, useDispatch } from 'react-redux';
import { createChain } from 'chain/actions/chain';

// import { showConfirmModal } from 'app/actions/global';
import { KeyboardDatePicker } from 'app/components/shared';

import { ChainTypeOptions } from 'chain/utils/constants';
import { Controller, useForm } from 'react-hook-form';
import LocationSection from './LocationSection';
import AirplaneSection from './AirplaneSection';
import OtherVehicleSection from './OtherVehicleSection';
// import ContactSubjectTable from './ContactSubjectTable';

const StyledLocationVehicleButtonWrapper = styled.div`
  margin-bottom: 10px;
`;

const CreateChainModal = (props) => {
  const { open, onClose, profileId, onRefresh } = props;

  const dispatch = useDispatch();
  const { profile } = useSelector((s) => s.profile);
  const {
    diseaseTypeData: { data: diseaseTypeOptions },
  } = useSelector((s) => s.general);
  const { createChainLoading } = useSelector((state) => state.chain);

  const [locationType, setLocationType] = useState(0);
  const [diseaseOutbreakLocation, setDiseaseOutbreakLocation] = useState(null);

  const { watch, control, setValue, getValues } = useForm();
  const disabled = useMemo(
    () =>
      !watch('name') ||
      !watch('fromTimeOfChain') ||
      !(watch('byT_Alias') || watch('hcM_Alias') || watch('hcdC_Alias')) ||
      !diseaseOutbreakLocation ||
      createChainLoading,
    [watch, diseaseOutbreakLocation, createChainLoading],
  );
  const enableAliasError = useMemo(
    () => !(watch('byT_Alias') || watch('hcM_Alias') || watch('hcdC_Alias')),
    [watch],
  );
  const handleChangeName = () => {
    const alias =
      watch('byT_Alias') || watch('hcM_Alias') || watch('hcdC_Alias');
    setValue('name', alias ? `BN${alias}` : '');
  };

  const onSubmit = async () => {
    const {
      name,
      diseaseTypeId,
      chainType,
      fromTimeOfChain,
      hcM_Alias: hcmAlias,
      hcdC_Alias: hcdcAlias,
      byT_Alias: bytAlias,
    } = getValues();
    if (moment(fromTimeOfChain, 'YYYY-MM-DD').format('YYYY') < 2020) {
      toast.warn('Thời gian bắt đầu chuỗi phải từ năm 2020!');
    } else {
      const data = {
        chain: {
          name: `Chuỗi ${profile.fullName} - ${name}`,
          fromTime: fromTimeOfChain,
          diseaseTypeId,
          hcM_Alias: hcmAlias,
          hcdC_Alias: hcdcAlias,
          byT_Alias: bytAlias,
          chainType,
          diseaseOutbreakLocation:
            locationType === LocationType.LOCATION
              ? {
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
                  existedLocationId: diseaseOutbreakLocation?.id ?? undefined,
                  locationType,
                },
        },
        profileId,
      };
      await dispatch(createChain(data));
      onClose();
      onRefresh();
    }
  };

  return (
    <>
      <Modal open={open}>
        <Modal.Header content="Xác nhận F0 và tạo chuỗi" />
        <Modal.Content>
          <Header as="h3" content="Thông tin chuỗi" />
          <div className="ui form">
            <Form.Group widths="equal">
              <Controller
                name="name"
                defaultValue=""
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Field>
                    <label>
                      Tên chuỗi
                      <Input
                        required
                        readOnly
                        placeholder="Bí danh"
                        label={`Chuỗi ${profile.fullName} - `}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </label>
                  </Form.Field>
                )}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Controller
                name="diseaseTypeId"
                defaultValue={
                  diseaseTypeOptions.find((dt) => dt.name.includes('19'))?.id ??
                  ''
                }
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    required
                    label="Loại bệnh"
                    options={(diseaseTypeOptions || []).map((dt) => ({
                      value: dt.id,
                      text: dt.name,
                    }))}
                    value={value}
                    onChange={(_, { value: v }) => onChange(v)}
                    onBlur={onBlur}
                  />
                )}
              />
              <Controller
                name="chainType"
                defaultValue={0}
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    required
                    label="Loại chuỗi"
                    options={ChainTypeOptions}
                    value={value}
                    onChange={(_, { value: v }) => onChange(v)}
                    onBlur={onBlur}
                  />
                )}
              />
              <Controller
                name="fromTimeOfChain"
                defaultValue=""
                control={control}
                render={({ onChange, value }) => (
                  <Form.Field
                    required
                    label="Ngày bắt đầu chuỗi"
                    control={KeyboardDatePicker}
                    onChange={onChange}
                    value={value}
                    disabledDays={[{ after: new Date() }]}
                  />
                )}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Controller
                name="byT_Alias"
                defaultValue=""
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Input
                    label="Bí danh Bộ Y Tế"
                    value={value}
                    onChange={(_, { value: v }) => {
                      onChange(v);
                      handleChangeName();
                    }}
                    onBlur={onBlur}
                    error={enableAliasError}
                  />
                )}
              />
              <Controller
                name="hcM_Alias"
                defaultValue=""
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Input
                    label="Bí danh Hồ Chí Minh"
                    value={value}
                    onChange={(_, { value: v }) => {
                      onChange(v);
                      handleChangeName();
                    }}
                    onBlur={onBlur}
                    error={enableAliasError}
                  />
                )}
              />
              <Controller
                name="hcdC_Alias"
                defaultValue=""
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Input
                    label="Bí danh CDC"
                    value={value}
                    onChange={(_, { value: v }) => {
                      onChange(v);
                      handleChangeName();
                    }}
                    onBlur={onBlur}
                    error={enableAliasError}
                  />
                )}
              />
            </Form.Group>
          </div>

          <Header as="h3" content="Thông tin nơi phát bệnh" />
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

          {locationType === LocationType.LOCATION && (
            <LocationSection required onChange={setDiseaseOutbreakLocation} />
          )}
          {locationType === LocationType.AIRPLANE && (
            <AirplaneSection onChange={setDiseaseOutbreakLocation} />
          )}
          {locationType === LocationType.VEHICLE && (
            <OtherVehicleSection onChange={setDiseaseOutbreakLocation} />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button content="Huỷ" onClick={onClose} />
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content="Xác nhận"
            loading={createChainLoading}
            disabled={disabled}
            onClick={onSubmit}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

CreateChainModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profileId: PropTypes.number.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default CreateChainModal;
