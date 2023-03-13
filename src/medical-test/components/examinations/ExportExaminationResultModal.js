import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { toast } from 'react-toastify';

import { Button, Checkbox, Form, Modal, Select } from 'semantic-ui-react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAvailableDayByUnitForExportExamination,
  getAvailableDayByUnitForExportExaminationHCDC,
} from 'medical-test/actions/medical-test';

import { KeyboardDatePicker } from 'app/components/shared';
import FeeTypeSelect from './FeeTypeSelect';

const ExportExaminationResultModal = ({
  open,
  onClose,
  onSubmit,
  isExportOneUnit,
  isAdmin,
}) => {
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    errors,
    setError,
    clearErrors,
  } = useForm();
  const dispatch = useDispatch();

  const { hasResultOnly, feeType, unitId, resultDate } = watch();

  const unitInfo = useSelector((state) => state.medicalTest.unitInfo);

  const hasPermission = isAdmin || unitInfo?.isJoiningExam;

  useEffect(() => {
    register({ name: 'unitId' });
    register({ name: 'resultDate' });
    register({ name: 'hasResultOnly' });
    register({ name: 'feeType' });
    setValue('hasResultOnly', false);
    if (hasPermission && !isExportOneUnit) {
      dispatch(
        getAvailableDayByUnitForExportExaminationHCDC(hasResultOnly, feeType),
      );
    }
    if (!hasPermission && open) {
      setValue('unitId', unitInfo?.id);
      dispatch(
        getAvailableDayByUnitForExportExamination(
          unitInfo?.id,
          hasResultOnly,
          feeType,
        ),
      );
    }
    // eslint-disable-next-line
  }, [
    register,
    open,
    dispatch,
    hasPermission,
    isExportOneUnit,
    unitInfo,
    setValue,
  ]);

  const {
    availableDayForExport,
    loadingAvailableDayForExport,
    prefixList,
    exportExaminationExcelLoading,
  } = useSelector((s) => s.medicalTest);

  const disabled = useMemo(() => {
    if (hasPermission && !isExportOneUnit) {
      return !resultDate;
    }
    return !(unitId && resultDate);
  }, [hasPermission, isExportOneUnit, unitId, resultDate]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {isExportOneUnit
          ? 'Xuất danh sách kết quả của cơ sở'
          : 'Xuất danh sách kết quả TỔNG'}
      </Modal.Header>
      <Modal.Content>
        <Form
          loading={loadingAvailableDayForExport}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Group widths="equal">
            <FeeTypeSelect
              clearable
              value={watch('feeType')}
              onChange={(v) => {
                setValue('feeType', v);
                setValue('resultDate', undefined);
                if (unitId) {
                  dispatch(
                    getAvailableDayByUnitForExportExamination(
                      unitId,
                      hasResultOnly,
                      v,
                    ),
                  );
                  if (resultDate) {
                    toast.info('Chọn lại ngày');
                  }
                }
              }}
            />
            {hasPermission && isExportOneUnit && (
              <Form.Field
                required
                search
                deburr
                label="Cơ sở lấy mẫu"
                control={Select}
                options={prefixList.map((z) => ({
                  key: z.id,
                  text: z.name,
                  value: z.id,
                }))}
                onChange={(_, { value }) => {
                  setValue('unitId', value);
                  setValue('resultDate', undefined);
                  dispatch(
                    getAvailableDayByUnitForExportExamination(
                      value,
                      hasResultOnly,
                      feeType,
                    ),
                  );
                  if (resultDate) {
                    toast.info('Chọn lại ngày');
                  }
                }}
              />
            )}
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              popupOnTop
              label="Ngày nhận mẫu"
              readOnly={isExportOneUnit && !watch('unitId')}
              control={KeyboardDatePicker}
              disabledDays={(d) =>
                !(
                  availableDayForExport.length === 0
                    ? []
                    : availableDayForExport
                )
                  .map((ad) => moment(ad).format('YYYY-MM-DD'))
                  .includes(moment(d).format('YYYY-MM-DD'))
              }
              onChange={(date) => {
                clearErrors('resultDate');
                setValue('resultDate', date);
              }}
              onError={(e) => setError('resultDate', e)}
              error={Boolean(errors.resultDate)}
            />
            <Form.Field
              style={{ paddingTop: '35px' }}
              control={Checkbox}
              label="Chỉ xuất mẫu có kết quả"
              onChange={(e, { checked }) => setValue('hasResultOnly', checked)}
            />
          </Form.Group>
          <Button
            primary
            content="Xác nhận"
            loading={exportExaminationExcelLoading}
            disabled={disabled || exportExaminationExcelLoading}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

ExportExaminationResultModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isExportOneUnit: PropTypes.bool.isRequired,
};

export default ExportExaminationResultModal;
