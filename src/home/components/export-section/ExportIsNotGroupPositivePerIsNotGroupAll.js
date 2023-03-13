import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { Form, Button } from 'semantic-ui-react';
import { KeyboardDatePicker } from 'app/components/shared';

import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { getSamplingPlaces } from 'medical-test/actions/medical-test';
import { exportExcel } from 'app/actions/global';
import apiLinks from 'app/utils/api-links';
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

const ExportIsNotGroupPositivePerIsNotGroupAll = (props) => {
  const { code: excelCode } = props;

  const {
    watch,
    register,
    setValue,
    handleSubmit,
  } = useForm();

  const dispatch = useDispatch();
  const {
    samplingPlaceList,
    getSamplingPlaceLoading,
  } = useSelector((state) => state.medicalTest);
  const { exportLoading } = useSelector((s) => s.global);

  const samplingPlaceOptions = useMemo(() => {
    const places =
      samplingPlaceList
        .reduce((array, place) => ([
          ...array, {
            key: place.name,
            value: place.name,
            text: place.name,
          },
        ]), [defaultOption]);
    return places.sort((a, b) => naturalCompare(a.value.toString(), b.value.toString()));
  }, [samplingPlaceList]);

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
        fromDate: formatToLocalDate(d.fromDate),
        toDate: formatToLocalDate(d.toDate),
      };

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
          url: apiLinks.excel.exportIsNotGroupPositivePerIsNotGroupAll,
          data: payload,
          fileName: getNameOfExcelByCode(excelCode),
        }),
      );
    } catch {
      toast.warn('Không có dữ liệu');
    }
  };

  useEffect(() => {
    register('fromDate');
    register('toDate');
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
        <Form.Group widths="equal">
          <Form.Field
            fluid
            required
            label="Từ ngày"
            control={KeyboardDatePicker}
            disabledDays={[{ after: new Date() }]}
            value={watch('fromDate') || new Date()}
            onChange={(value) => setValue('fromDate', value)}
          />
          <Form.Field
            fluid
            required
            label="Đến ngày"
            control={KeyboardDatePicker}
            disabledDays={[
              {
                after: new Date(),
                before: new Date(watch('fromDate')),
              },
            ]}
            value={watch('toDate') || new Date()}
            onChange={(value) => setValue('toDate', value)}
          />
        </Form.Group>
        <Form.Group widths="equal">
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

ExportIsNotGroupPositivePerIsNotGroupAll.defaultProps = {
  code: 'TLD002',
};

ExportIsNotGroupPositivePerIsNotGroupAll.propTypes = {
  code: PropTypes.string,
};

export default ExportIsNotGroupPositivePerIsNotGroupAll;
