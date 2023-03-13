import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { Button, Form, Modal } from 'semantic-ui-react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import locations from 'app/assets/mock/locations.json';
import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';
// import ProfileReasonSection from 'profile/components/ProfileReasonSection';
import { getImportantType } from 'infection-chain/utils/helpers';

import { useDispatch, useSelector } from 'react-redux';
import {
  createCollectingSession,
  updateCollectingSession,
} from '../actions/collecting-session';

const CollectingSessionModal = ({ open, onClose, getData, data }) => {
  const dispatch = useDispatch();
  const unitInfo = useSelector((s) => s.medicalTest.unitInfo);
  const updateCollectingSessionLoading = useSelector(
    (s) => s.collectingSession.updateCollectingSessionLoading,
  );
  const createCollectingSessionLoading = useSelector(
    (s) => s.collectingSession.createCollectingSessionLoading,
  );
  const getDiseasesLoading = useSelector(
    (state) => state.medicalTest.getDiseasesLoading,
  );
  const diseaseList = useSelector((state) => state.medicalTest.diseaseList);
  const examinationTypeList = useSelector(
    (state) => state.medicalTest.examinationTypeList,
  );
  const getExaminationTypesLoading = useSelector(
    (state) => state.medicalTest.getExaminationTypesLoading,
  );

  const {
    watch,
    control,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data || {},
  });
  useEffect(() => reset(data), [reset, data]);

  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const provinceV = watch('province');
  useEffect(() => {
    setProvince(locations.find((p) => p.value === provinceV));
    setDistrict(null);
  }, [provinceV]);

  const districtV = watch('district');
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

  const onSubmit = async () => {
    const values = getValues();
    const d = {
      ...getValues(),
      endTime: values.endTime || undefined,
      reasonLv1: values.reason,
      reasonLv2: values.reasonType,
      reasonLv3:
        values.fromCountry || values.fromProvince || values.relatedProfileId,
    };
    await dispatch(
      d?.id ? updateCollectingSession(d) : createCollectingSession(d),
    );
    onClose();
    getData();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {!data?.id ? 'Tạo buổi lấy mẫu' : 'Sửa thông tin buổi lấy mẫu'}
      </Modal.Header>
      <Modal.Content>
        <FormProvider
          control={control}
          watch={watch}
          setValue={setValue}
          formState={{ errors }}
        >
          <Form>
            <Form.Group widths="equal">
              <Controller name="id" defaultValue="" control={control} />
              <Controller
                name="unitId"
                defaultValue={unitInfo?.id}
                control={control}
              />
              <Controller
                name="name"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ onChange, onBlur, value }) => (
                  <Form.Input
                    fluid
                    required
                    label="Tên buổi lấy mẫu"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.name)}
                  />
                )}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Controller
                name="province"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    fluid
                    deburr
                    clearable
                    search
                    required
                    label="Tỉnh/Thành"
                    value={value}
                    onChange={(__, { value: v }) => onChange(v)}
                    onBlur={onBlur}
                    options={provinceOptions}
                    error={Boolean(errors.province)}
                  />
                )}
              />
              <Controller
                name="district"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    fluid
                    deburr
                    clearable
                    search
                    required
                    label="Quận/Huyện"
                    value={value}
                    onChange={(__, { value: v }) => onChange(v)}
                    onBlur={onBlur}
                    options={districtOptions}
                    error={Boolean(errors.district)}
                  />
                )}
              />
              <Controller
                name="ward"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    fluid
                    deburr
                    clearable
                    search
                    required
                    label="Phường/Xã"
                    value={value}
                    onChange={(__, { value: v }) => onChange(v)}
                    onBlur={onBlur}
                    options={wardOptions}
                    error={Boolean(errors.ward)}
                  />
                )}
              />
              <Controller
                name="address"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ onChange, onBlur, value }) => (
                  <Form.Input
                    fluid
                    required
                    label="Địa chỉ (số nhà/đường)"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.address)}
                  />
                )}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Controller
                name="startTime"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ onChange, value }) => (
                  <Form.Field
                    fluid
                    isHavingTime
                    required
                    control={KeyboardDateTimePicker}
                    label="Thời gian bắt đầu"
                    value={value}
                    onChange={onChange}
                    disabledDays={[
                      {
                        after: new Date(),
                      },
                    ]}
                    error={Boolean(errors.startTime)}
                  />
                )}
              />
              <Controller
                name="endTime"
                defaultValue=""
                control={control}
                render={({ onChange, value }) => (
                  <Form.Field
                    fluid
                    isHavingTime
                    control={KeyboardDateTimePicker}
                    label="Thời gian kết thúc"
                    value={value}
                    onChange={onChange}
                    disabledDays={[
                      {
                        after: new Date(),
                        before: new Date(watch('startTime')),
                      },
                    ]}
                  />
                )}
              />
            </Form.Group>

            {/* <ProfileReasonSection data={data} /> */}

            <Form.Group widths="equal">
              <Controller
                name="diseaseId"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    required
                    search
                    deburr
                    clearable
                    label="Loại bệnh"
                    loading={getDiseasesLoading}
                    options={_.sortBy(diseaseList, ({ code }) =>
                      code === 'U07' ? 0 : 1,
                    ).map((c) => ({
                      key: c.id,
                      value: c.id,
                      text: `${c.name} - Mã bệnh: ${c.code}`,
                    }))}
                    value={value}
                    onBlur={onBlur}
                    onChange={(__, { value: v }) => onChange(v)}
                    error={Boolean(errors.diseaseId)}
                  />
                )}
              />
              <Controller
                name="examinationTypeId"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    required
                    search
                    deburr
                    clearable
                    label="Loại mẫu xét nghiệm"
                    loading={getExaminationTypesLoading}
                    options={examinationTypeList.map((c) => ({
                      key: c.id,
                      value: c.id,
                      text: `${c.name} - Độ ưu tiên: ${
                        getImportantType(c.importantValue)?.label
                      }`,
                      label: {
                        empty: true,
                        circular: true,
                        color: `${getImportantType(c.importantValue)?.color}`,
                      },
                    }))}
                    value={value}
                    onBlur={onBlur}
                    onChange={(__, { value: v }) => onChange(v)}
                    error={Boolean(errors.examinationTypeId)}
                  />
                )}
              />
            </Form.Group>

            <Form.Group widths="equal">
              <Controller
                name="note"
                defaultValue=""
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.TextArea
                    label="Ghi chú"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </Form.Group>
          </Form>
        </FormProvider>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          loading={
            createCollectingSessionLoading || updateCollectingSessionLoading
          }
          disabled={
            createCollectingSessionLoading || updateCollectingSessionLoading
          }
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

CollectingSessionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
  }),
};

CollectingSessionModal.defaultProps = {
  data: undefined,
};

export default CollectingSessionModal;
