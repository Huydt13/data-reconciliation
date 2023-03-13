import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { toast } from 'react-toastify';

import { Button, Form, Modal, Select } from 'semantic-ui-react';

import { useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { getAvailableDatesForTakenExamList } from 'medical-test/actions/medical-test';

import { KeyboardDatePicker } from 'app/components/shared';
import FeeTypeSelect from './FeeTypeSelect';

const ExportExaminationResultModal = (props) => {
  const { open, onClose, onSubmit, isAdmin } = props;
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    errors,
    setError,
    clearErrors,
  } = useForm();
  const { unitId, feeType, takenDate } = watch();

  const dispatch = useDispatch();

  const unitInfo = useSelector((state) => state.medicalTest.unitInfo);
  useEffect(() => {
    register({ name: 'unitId' });
    register({ name: 'takenDate' });
    register({ name: 'feeType' });
    if (!isAdmin && unitInfo?.id) {
      setValue('unitId', unitInfo?.id);
    }
    // eslint-disable-next-line
  }, [register, dispatch, isAdmin, setValue, unitInfo]);
  const {
    availableDayForExport,
    loadingAvailableDayForExport,
    prefixList,
    exportExaminationExcelLoading,
  } = useSelector((s) => s.medicalTest);

  const disabled = useMemo(() => {
    if (isAdmin) {
      return !takenDate;
    }
    return !(unitId && takenDate);
  }, [isAdmin, unitId, takenDate]);

  useEffect(() => {
    if (open && unitId) {
      dispatch(getAvailableDatesForTakenExamList(unitId, feeType));
    }
    // eslint-disable-next-line
  }, [dispatch, open, unitId]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Xuất danh sách kết quả theo ngày lấy mẫu</Modal.Header>
      <Modal.Content>
        <Form
          loading={loadingAvailableDayForExport}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Group widths="equal">
            {isAdmin && (
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
                onChange={(e, { value }) => {
                  setValue('unitId', value);
                  setValue('takenDate', undefined);
                  if (takenDate) {
                    toast.info('Chọn lại ngày');
                  }
                }}
              />
            )}

            <FeeTypeSelect
              clearable
              value={watch('feeType')}
              onChange={(v) => {
                setValue('feeType', v);
                setValue('takenDate', undefined);
                if (unitId) {
                  dispatch(getAvailableDatesForTakenExamList(unitId, v));
                  if (takenDate) {
                    toast.info('Chọn lại ngày');
                  }
                }
              }}
            />

            <Form.Field
              required
              label="Ngày lấy mẫu"
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
                clearErrors('takenDate');
                setValue('takenDate', date);
              }}
              onError={(e) => setError('takenDate', e)}
              error={Boolean(errors.takenDate)}
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
};

export default ExportExaminationResultModal;
