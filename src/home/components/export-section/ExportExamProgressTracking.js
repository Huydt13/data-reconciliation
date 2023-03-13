import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { Form, Select, Button } from 'semantic-ui-react';
import { KeyboardDatePicker } from 'app/components/shared';

import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useSelectLocations } from 'app/hooks';
import apiLinks from 'app/utils/api-links';
import { exportExcel } from 'app/actions/global';
import { getSamplingPlaces } from 'medical-test/actions/medical-test';
import { naturalCompare } from 'app/utils/helpers';
import {
  formatToLocalDate,
  getNameOfExcelByCode,
} from 'home/utils/helpers';

const defaultOption = {
  key: -1,
  value: -1,
  text: 'Tất cả',
};

const PROVINCE_DEFAULT = '79';
const DISTRICT_DEFAULT = '760';
const SAMPLING_PLACES = ['XANH', 'CẬN XANH', 'VÀNG', 'CAM', 'ĐỎ'];

const ExportExamProgressTracking = (props) => {
  const { code: excelCode } = props;

  const {
    watch,
    register,
    setValue,
    handleSubmit,
  } = useForm();
  const {
    province,
    district,
    provinceList,
    districtList,
    setProvinceValue,
    setDistrictValue,
  } = useSelectLocations({
    provinceValue: PROVINCE_DEFAULT,
    districtValue: DISTRICT_DEFAULT,
  });

  const dispatch = useDispatch();
  const {
    samplingPlaceList,
    getSamplingPlaceLoading,
  } = useSelector((state) => state.medicalTest);
  const { exportLoading } = useSelector((s) => s.global);

  const samplingPlaceOptions = useMemo(() => {
    const places =
      samplingPlaceList
      .reduce((array, place) => {
        const found = SAMPLING_PLACES.find((p) => place.name.includes(p));
        if (found) {
          return [
            ...array, {
              key: place.name,
              value: place.name,
              text: place.name,
            },
          ];
        }

        return array;
      }, [defaultOption]);
    return places.sort((a, b) => naturalCompare(a.value.toString(), b.value.toString()));
  }, [samplingPlaceList]);

  const refresh = () => {
    setProvinceValue(PROVINCE_DEFAULT);
    setDistrictValue(DISTRICT_DEFAULT);
  };

  const handleMulipleSelect = (type = '', value) => {
    switch (type) {
      default:
        if (type !== '') {
          let newValue = value || [];
          const lastValue = newValue.slice().pop();
          if (newValue.length === 0 || (newValue.length > 1 && lastValue === -1)) {
            newValue = [-1];
          }
          if (newValue.length > 1 && newValue.includes(-1)) {
            newValue = newValue.filter((v) => v !== -1);
          }
          setValue(type, newValue);
        }
        break;
    }
  };

  const onSubmit = async (d) => {
    try {
      const payload = {
        date: formatToLocalDate(d.date),
        province: province?.label ?? provinceList.find((p) => p.value === PROVINCE_DEFAULT).label,
      };

      if (district?.label) {
        payload.district = district.label;
      }

      if (d?.samplingPlaces && !d.samplingPlaces.includes(-1)) {
        payload.samplingPlaces = d.samplingPlaces;
      } else {
        payload.samplingPlaces =
          samplingPlaceOptions.reduce((array, place) => {
            if (place.value !== -1) {
              return [...array, place.value];
            }
            return array;
          }, []);
      }

      await dispatch(
        exportExcel({
          method: 'POST',
          url: apiLinks.excel.exportProgressExamiantionTracking,
          data: payload,
          fileName: getNameOfExcelByCode(excelCode),
        }),
      );
      refresh();
    } catch {
      toast.warn('Không có dữ liệu');
    }
  };

  useEffect(() => {
    register('date');
    register('samplingPlaces');
  }, [register]);

  useEffect(() => {
    if (samplingPlaceList.length === 0) {
      dispatch(getSamplingPlaces());
    }
  }, [dispatch, samplingPlaceList]);

  return (
    <>
      <Form loading={exportLoading}>
        <Form.Group>
          <Form.Field
            fluid
            required
            width={4}
            label="Ngày"
            control={KeyboardDatePicker}
            disabledDays={[{ after: new Date() }]}
            value={watch('date') || new Date()}
            onChange={(value) => setValue('date', value)}
          />
          <Form.Select
            multiple
            width={12}
            loading={getSamplingPlaceLoading}
            label="Nơi lấy mẫu (vùng)"
            value={watch('samplingPlaces') || [-1]}
            options={samplingPlaceOptions}
            onChange={(__, { value: v }) => handleMulipleSelect('samplingPlaces', v)}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            search
            deburr
            required
            label="Tỉnh/Thành"
            control={Select}
            value={province?.value ?? PROVINCE_DEFAULT}
            options={provinceList.map((p) => ({
              key: p.value,
              value: p.value,
              text: p.label,
            }))}
            onChange={(__, { value }) => {
              setProvinceValue(value);
            }}
          />
          <Form.Field
            search
            deburr
            required
            label="Quận/Huyện"
            control={Select}
            value={district?.value ?? -1}
            options={districtList.reduce((array, _district) => ([
              ...array,
              {
                key: _district.value,
                value: _district.value,
                text: _district.label,
              },
            ]), [defaultOption])}
            onChange={(__, { value }) => {
              setDistrictValue(value);
            }}
          />
        </Form.Group>
        <Button
          labelPosition="right"
          icon="download"
          color="twitter"
          content="Xuất báo cáo"
          disabled={exportLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Form>
    </>
  );
};

ExportExamProgressTracking.defaultProps = {
  code: 'VNC001',
};

ExportExamProgressTracking.propTypes = {
  code: PropTypes.string,
};

export default ExportExamProgressTracking;
