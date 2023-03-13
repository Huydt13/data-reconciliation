import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import moment from 'moment';

import { Button, Form, Modal } from 'semantic-ui-react';
import { KeyboardDateTimePicker } from 'app/components/shared';

import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { useAuth } from 'app/hooks';
import { exportExcel } from 'app/actions/global';
import apiLinks from 'app/utils/api-links';
import { naturalCompare } from 'app/utils/helpers';
import {
  getUnitInfo,
  getPrefixes,
  getExaminationTypes,
  getSamplingPlaces,
} from 'medical-test/actions/medical-test';

const defaultOption = {
  key: -1,
  value: -1,
  text: 'Tất cả',
};

const childUnitOption = {
  key: -2,
  value: -2,
  text: 'Tất cả các cơ sở cấp dưới',
};

const dateTypeOptions = [
  { value: 1, text: 'Ngày xét nghiệm' },
  { value: 3, text: 'Ngày hệ thống ghi nhận' },
  { value: 4, text: 'Ngày xác minh' },
];

const resultTypeOptions = [
  'Dương tính',
  'Âm tính',
  'Nghi ngờ',
  'Chưa xác định',
].reduce((r, e) => ([...r, {
  text: e.toUpperCase(),
  value: e.toUpperCase(),
}]), [defaultOption]);

const ExportInfectedPatientModal = (props) => {
  const { open, onClose } = props;

  const dispatch = useDispatch();
  const { isAdmin } = useAuth();
  const { watch, errors, control, setValue, handleSubmit } = useForm();
  const {
    unitInfo,
    prefixList,
    examinationTypeList,
    samplingPlaceList,
    getPrefixesLoading,
    getExaminationTypesLoading,
    getSamplingPlacesLoading,
  } = useSelector((state) => state.medicalTest);
  const { exportLoading } = useSelector((s) => s.global);

  const isMultipleUnit = useMemo(() =>
    isAdmin || (unitInfo?.name ?? '').includes('TRUNG TÂM Y TẾ'),
    [isAdmin, unitInfo]);

  const prefixOptions = useMemo(() => {
    if (isAdmin) {
      return prefixList.reduce((result, unit) => [...result, {
        key: unit.id,
        value: unit.name,
        text: unit.name.toUpperCase(),
      }], [defaultOption]);
    }

    if (unitInfo?.name && unitInfo.name.toUpperCase().includes('TRUNG TÂM Y TẾ')) {
      const unitInfoName = unitInfo.name.substr(20).trim();

      return prefixList
        .filter((unit) => {
          if (unitInfo.id === unit.id) {
            return true;
          }

          const unitName = unit.name.toUpperCase().trim();
          if (unitName.includes('HUYỆN')) {
            const cutString = unitName.substr(unitName.indexOf(`- HUYỆN ${unitInfoName}`));
            if (cutString.length === `- HUYỆN ${unitInfoName}`.length) {
              return true;
            }
          }

          if (unitName.includes('QUẬN')) {
            const cutString = unitName.substr(unitName.indexOf(`- QUẬN ${unitInfoName}`));
            if (cutString.length === `- QUẬN ${unitInfoName}`.length) {
              return true;
            }
          }

          if (unitName.includes('TP')) {
            const cutString = unitName.substr(unitName.indexOf(`- TP ${unitInfoName}`));
            if (cutString.length === `- TP ${unitInfoName}`.length) {
              return true;
            }
          }

          return false;
        })
        .reduce(
          (result, unit) => [...result, {
            key: unit.id,
            value: unit.id,
            text: unit.name.toUpperCase(),
          },
          ], [defaultOption, childUnitOption]);
    }

    return defaultOption;
  }, [isAdmin, unitInfo, prefixList]);

  const samplingPlaceOptions = useMemo(() => {
    const places = samplingPlaceList.reduce(
      (array, place) => [
        ...array,
        {
          key: place.id,
          value: /(\d+.\s+)(.*)/i.exec(place.name.toLowerCase().trim())[2],
          text: place.name.toUpperCase(),
        },
      ],
      [defaultOption],
    );
    return places.sort((a, b) =>
      naturalCompare((a?.value ?? '').toString(), (b?.value ?? '').toString()),
    );
  }, [samplingPlaceList]);

  const examinationTypeOptions = useMemo(() =>
    examinationTypeList.reduce((result, type) => [...result, {
      key: type.id,
      value: type.name.toUpperCase(),
      text: type.name.toUpperCase(),
    }], [defaultOption]),
    [examinationTypeList]);

  const handleMulipleSelect = (type = '', value) => {
    if (type !== '') {
      let newValue = value || [];
      const lastValue = newValue.slice().pop();
      if (
        newValue.length === 0 ||
        (newValue.length > 1 && (lastValue === -1 || lastValue === -2))
      ) {
        newValue = [lastValue];
      }
      if (newValue.length > 1 && (newValue.includes(-1) || newValue.includes(-2))) {
        newValue = newValue.filter((v) => v !== -1 && v !== -2);
      }

      setValue(type, newValue);
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      FromDate: data.fromDate,
      ToDate: data.toDate,
      DataSource: 2,
    };
    // if (data?.unitIds) {
    //   if (data.unitIds.includes(-1)) {
    //     if ((unitInfo?.name ?? '').includes('TRUNG TÂM Y TẾ')) {
    //       const unitInfoName = unitInfo.name.substr(20).trim();
    //       payload.unitIds =
    //         prefixList
    //           .filter((unit) => {
    //             if (unitInfo.id === unit.id) {
    //               return true;
    //             }

    //             const unitName = unit.name.toUpperCase().trim();
    //             if (unitName.includes('HUYỆN')) {
    //               const cutString = unitName.substr(unitName.indexOf(`- HUYỆN ${unitInfoName}`));
    //               if (cutString.length === `- HUYỆN ${unitInfoName}`.length) {
    //                 return true;
    //               }
    //             }

    //             if (unitName.includes('QUẬN')) {
    //               const cutString = unitName.substr(unitName.indexOf(`- QUẬN ${unitInfoName}`));
    //               if (cutString.length === `- QUẬN ${unitInfoName}`.length) {
    //                 return true;
    //               }
    //             }

    //             if (unitName.includes('TP')) {
    //               const cutString = unitName.substr(unitName.indexOf(`- TP ${unitInfoName}`));
    //               if (cutString.length === `- TP ${unitInfoName}`.length) {
    //                 return true;
    //               }
    //             }

    //             return false;
    //           })
    //           .map((unit) => unit.id);
    //     }
    //   } else if (data.unitIds.includes(-2)) {
    //     const unitInfoName = unitInfo.name.substr(20).trim();
    //     payload.unitIds =
    //       prefixList
    //         .filter((unit) => {
    //           if (unitInfo.id === unit.id) {
    //             return false;
    //           }

    //           const unitName = unit.name.toUpperCase().trim();
    //           if (unitName.includes('HUYỆN')) {
    //             const cutString = unitName.substr(unitName.indexOf(`- HUYỆN ${unitInfoName}`));
    //             if (cutString.length === `- HUYỆN ${unitInfoName}`.length) {
    //               return true;
    //             }
    //           }

    //           if (unitName.includes('QUẬN')) {
    //             const cutString = unitName.substr(unitName.indexOf(`- QUẬN ${unitInfoName}`));
    //             if (cutString.length === `- QUẬN ${unitInfoName}`.length) {
    //               return true;
    //             }
    //           }

    //           if (unitName.includes('TP')) {
    //             const cutString = unitName.substr(unitName.indexOf(`- TP ${unitInfoName}`));
    //             if (cutString.length === `- TP ${unitInfoName}`.length) {
    //               return true;
    //             }
    //           }

    //           return false;
    //         })
    //         .map((unit) => unit.id);
    //   } else {
    //     payload.unitIds = data.unitIds;
    //   }
    // }

    if (data?.samplingPlaces && !data.samplingPlaces.includes(-1)) {
      payload.SamplingPlace = data.samplingPlaces;
    }

    if (data?.examinationTypes && !data.examinationTypes.includes(-1)) {
      payload.ExaminationType = data.examinationTypes;
    }

    if (data?.dateType) {
      payload.DateType = data.dateType;
    }

    if (data?.results && !data.results.includes(-1)) {
      payload.Result = data.results;
    }
    if (data?.unitIds && !data.unitIds.includes(-1)) {
      payload.Unit = data.unitIds;
    }
    if (!isMultipleUnit) {
      payload.Unit = [unitInfo?.id];
    }

    try {
      await dispatch(
        exportExcel({
          method: 'GET',
          url: apiLinks.injectedPatient.exportExcel,
          params: payload,
          fileName: 'Xuất dữ liệu khai báo f0',
        }),
      );
      onClose();
    } catch {
      toast.warn('Không có mẫu');
    }
  };

  useEffect(() => {
    if (!unitInfo?.id) {
      dispatch(getUnitInfo());
    }
    if (prefixList.length === 0) {
      dispatch(getPrefixes());
    }
    if (examinationTypeList.length === 0) {
      dispatch(getExaminationTypes());
    }
    if (samplingPlaceList.length === 0) {
      dispatch(getSamplingPlaces());
    }
    // eslint-disable-next-line
  }, [dispatch]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Xuất dữ liệu khai báo f0</Modal.Header>
      <Modal.Content>
        <Form loading={exportLoading}>
          <Form.Group widths="equal">
            {isMultipleUnit && (
              <Controller
                control={control}
                name="unitIds"
                defaultValue={[-1]}
                render={({ value }) => (
                  <Form.Select
                    deburr
                    search
                    multiple
                    loading={getPrefixesLoading}
                    label="Đơn vị xác minh"
                    value={value}
                    options={prefixOptions}
                    onChange={(_, { value: v }) => handleMulipleSelect('unitIds', v)}
                  />
                )}
              />
            )}
            <Controller
              control={control}
              name="samplingPlaces"
              defaultValue={[-1]}
              render={({ value }) => (
                <Form.Select
                  deburr
                  search
                  multiple
                  loading={getSamplingPlacesLoading}
                  label="Nơi lấy mẫu"
                  value={value}
                  options={samplingPlaceOptions}
                  onChange={(_, { value: v }) => handleMulipleSelect('samplingPlaces', v)}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              control={control}
              name="examinationTypes"
              defaultValue={[-1]}
              render={({ value }) => (
                <Form.Select
                  deburr
                  search
                  multiple
                  loading={getExaminationTypesLoading}
                  label="Lý do - đối tượng"
                  value={value}
                  options={examinationTypeOptions}
                  onChange={(e, { value: v }) => handleMulipleSelect('examinationTypes', v)}
                />
              )}
            />
            {/* <Controller
              control={control}
              name="results"
              defaultValue={[-1]}
              render={({ value }) => (
                <Form.Select
                  multiple
                  label="Kết quả"
                  value={value}
                  options={resultTypeOptions}
                  onChange={(_, { value: v }) => handleMulipleSelect('results', v)}
                />
              )}
            /> */}
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              control={control}
              name="dateType"
              rule={{
                required: 'Bắt buộc phải chọn thống kê ngày',
              }}
              defaultValue={4}
              render={({ onChange, onBlur }) => (
                <Form.Select
                  required
                  label="Thống kê theo"
                  defaultValue={4}
                  options={dateTypeOptions}
                  onBlur={onBlur}
                  onChange={(e, { value }) => onChange(value)}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              control={control}
              name="fromDate"
              defaultValue={moment().format('YYYY-MM-DDT00:00')}
              rules={{ required: true }}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  required
                  isHavingTime
                  error={errors.fromDate && 'Bắt buộc phải chọn ngày bắt đầu'}
                  label="Từ ngày"
                  control={KeyboardDateTimePicker}
                  disabledDays={[{ before: new Date('2022-04-01'), after: new Date() }]}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={control}
              name="toDate"
              defaultValue={moment().format('YYYY-MM-DDT00:00')}
              rules={{ required: true }}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  required
                  isHavingTime
                  error={errors.fromDate && 'Bắt buộc phải chọn ngày kết thúc'}
                  label="Đến ngày"
                  control={KeyboardDateTimePicker}
                  disabledDays={[
                    {
                      after: new Date(),
                      before: new Date(watch('fromDate')),
                    },
                  ]}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          disabled={exportLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

ExportInfectedPatientModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExportInfectedPatientModal;
