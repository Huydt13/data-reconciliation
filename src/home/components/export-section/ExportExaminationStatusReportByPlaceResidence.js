import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { Form, Button } from 'semantic-ui-react';
import { KeyboardDatePicker } from 'app/components/shared';

import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import apiLinks from 'app/utils/api-links';
import { exportExcel } from 'app/actions/global';
import {
  formatToLocalDate,
  getNameOfExcelByCode,
} from 'home/utils/helpers';

const ExportExaminationStatusReportByPlaceResidence = (props) => {
  const { code: excelCode } = props;

  const {
    watch,
    register,
    setValue,
    handleSubmit,
  } = useForm();

  const dispatch = useDispatch();
  const { exportLoading } = useSelector((s) => s.global);

  const onSubmit = async (d) => {
    try {
      const payload = {
        fromDate: formatToLocalDate(d.fromDate),
        toDate: formatToLocalDate(d.toDate),
      };

      await dispatch(
        exportExcel({
          method: 'POST',
          url: apiLinks.excel.exportExaminationStatusReportByPlaceResidence,
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

ExportExaminationStatusReportByPlaceResidence.defaultProps = {
  code: 'VNC002',
};

ExportExaminationStatusReportByPlaceResidence.propTypes = {
  code: PropTypes.string,
};

export default ExportExaminationStatusReportByPlaceResidence;
