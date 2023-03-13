import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { Form, Select, Button } from 'semantic-ui-react';
import { KeyboardDatePicker } from 'app/components/shared';

import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useSelectLocations } from 'app/hooks';
import apiLinks from 'app/utils/api-links';
import { exportExcel } from 'app/actions/global';
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

const ExportExamStatistic = (props) => {
  // eslint-disable-next-line
  const { code: excelCode, byTakenDate, byResultDate } = props;

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
  const { exportLoading } = useSelector((s) => s.global);

  const refresh = () => {
    setProvinceValue(PROVINCE_DEFAULT);
    setDistrictValue(DISTRICT_DEFAULT);
  };

  const onSubmit = async (d) => {
    try {
      const payload = {
        fromDate: formatToLocalDate(d.fromDate),
        toDate: formatToLocalDate(d.toDate),
        province: province?.label ?? provinceList.find((p) => p.value === PROVINCE_DEFAULT).label,
      };

      if (district?.label) {
        payload.district = district.label;
      }

      await dispatch(
        exportExcel({
          method: 'POST',
          url:
            byResultDate
            ? apiLinks.excel.exportExaminationStatisticByResultDate
            : apiLinks.excel.exportExaminationStatisticByTakenDate,
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
    register('fromDate');
    register('toDate');
  }, [register]);

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

ExportExamStatistic.defaultProps = {
  code: 'THP001',
  byTakenDate: true,
  byResultDate: false,
};

ExportExamStatistic.propTypes = {
  code: PropTypes.string,
  byTakenDate: PropTypes.bool,
  byResultDate: PropTypes.bool,
};

export default ExportExamStatistic;
