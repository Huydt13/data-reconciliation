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

import FeeTypeSelect from './FeeTypeSelect';

const defaultOption = {
  key: -1,
  value: -1,
  text: 'Tất cả',
};

const dateTypeOptions = [
  { value: 0, text: 'Ngày lấy mẫu' },
  { value: 1, text: 'Ngày nhận mẫu' },
  { value: 2, text: 'Ngày trả kết quả' },
  { value: 3, text: 'Ngày hệ thống ghi nhận' },
];

const groupOptions = [
  { value: -1, text: 'Tất cả' },
  { value: 0, text: 'Mẫu đơn' },
  { value: 1, text: 'Mẫu gộp' },
];

const samplingFunctionOptions = [
  { value: -1, text: 'Tất cả' },
  {
    value: 'Tầm soát, giám sát, điều tra dịch, kiểm dịch, ....',
    text: 'Tầm soát, giám sát, điều tra dịch, kiểm dịch, ....',
  },
  { value: 'Điều trị F0 có triệu chứng', text: 'Điều trị F0 có triệu chứng' },
  {
    value: 'Điều trị F0 không triệu chứng',
    text: 'Điều trị F0 không triệu chứng',
  },
];

const testTechniqueOptions = [
  { value: -1, text: 'Tất cả' },
  // { value: 'REALTIME RT PCR', text: 'Realtime RT PCR' },
  // { value: 'TEST NHANH KHÁNG THỂ', text: 'Test nhanh kháng thể' },
  // { value: 'TEST NHANH KHÁNG NGUYÊN', text: 'Test nhanh kháng nguyên' },
  // { value: 'TEST MD KHÁNG THỂ', text: 'Test MD kháng thể' },
  // { value: 'TEST MD KHÁNG NGUYÊN', text: 'Test MD kháng nguyên' },
  // { value: 'TEST NHANH KN-KT', text: 'Test nhanh KN-KT' },
  // { value: 'TEST MD KN-KT', text: 'Test MD KN-KT' },
];

const resultOptions = [
  { value: -1, text: 'Tất cả' },
  { value: 'CHƯA CÓ KẾT QUẢ', text: 'Chưa có kết quả' },
  { value: 'CÓ KẾT QUẢ', text: 'Có kết quả' },
  { value: 'DƯƠNG TÍNH', text: 'Dương tính' },
  { value: 'ÂM TÍNH', text: 'Âm tính' },
  { value: 'KHÁC', text: 'Khác' },
];

const ExportStatisticExaminationModal = (props) => {
  const { open, onClose } = props;

  const dispatch = useDispatch();
  const { isAdmin: isAdminHook, isUsername } = useAuth();
  const { watch, setValue, control, handleSubmit } = useForm();
  const {
    unitInfo,
    prefixList,
    examinationTypeList,
    samplingPlaceList,
    getUnitInfoLoading,
    getPrefixesLoading,
  } = useSelector((state) => state.medicalTest);
  const { exportLoading } = useSelector((s) => s.global);

  const isAdmin = isAdminHook || isUsername('master.xng');
  const loading = getUnitInfoLoading || getPrefixesLoading;

  const isTakenUnit = useMemo(
    () => unitInfo?.isCollector && !unitInfo?.isTester,
    [unitInfo],
  );
  const isExecutedSelfUnit = useMemo(
    () => !unitInfo?.isCollector && unitInfo?.isTester,
    [unitInfo],
  );
  const isExcutedParticipatingUnit = useMemo(
    () => unitInfo?.isCollector && unitInfo?.isTester,
    [unitInfo],
  );

  const takenUnitOptions = useMemo(() => {
    if (isTakenUnit) {
      return prefixList
        .filter((unit) => unit.id === (unitInfo?.id ?? ''))
        .map((unit) => ({
          key: unit.id,
          value: unit.id,
          text: unit.name,
        }));
    }
    if (isAdmin || isExecutedSelfUnit || isExcutedParticipatingUnit) {
      return prefixList
        .filter((unit) => unit?.isCollector)
        .reduce(
          (array, unit) => [
            ...array,
            {
              key: unit.id,
              value: unit.id,
              text: unit.name,
            },
          ],
          [defaultOption],
        );
    }
    return [];
  }, [
    isAdmin,
    isTakenUnit,
    isExecutedSelfUnit,
    isExcutedParticipatingUnit,
    unitInfo,
    prefixList,
  ]);
  const executedUnitOptions = useMemo(() => {
    if (isAdmin || isTakenUnit || isExcutedParticipatingUnit) {
      return prefixList
        .filter((unit) => unit?.isTester)
        .reduce(
          (array, unit) => [
            ...array,
            {
              key: unit.id,
              value: unit.id,
              text: unit.name,
            },
          ],
          [defaultOption],
        );
    }
    if (isExecutedSelfUnit) {
      return prefixList
        .filter((unit) => unit.id === (unitInfo?.id ?? ''))
        .map((unit) => ({
          key: unit.id,
          value: unit.id,
          text: unit.name,
        }));
    }
    return [];
  }, [
    isAdmin,
    isTakenUnit,
    isExecutedSelfUnit,
    isExcutedParticipatingUnit,
    unitInfo,
    prefixList,
  ]);

  const samplingPlaceOptions = useMemo(() => {
    const places =
      samplingPlaceList.reduce((array, place) => ([
        ...array,
        {
          key: place.name,
          value: place.name,
          text: place.name,
        },
      ]), [defaultOption]);
    return places.sort((a, b) => naturalCompare(a.value.toString(), b.value.toString()));
  }, [samplingPlaceList]);

  const examinationTypeOptions = useMemo(
    () =>
      examinationTypeList.reduce(
        (array, type) => [
          ...array,
          {
            key: type.id,
            value: type.name.toUpperCase(),
            text: type.name,
          },
        ],
        [defaultOption],
      ),
    [examinationTypeList],
  );

  const handleMulipleSelect = (type = '', value) => {
    switch (type) {
      case 'takenUnitIds':
        if (isExecutedSelfUnit) {
          // eslint-disable-next-line
          let newValue = value || [];
          const lastValue = newValue.slice().pop();
          if (
            newValue.length === 0 ||
            (newValue.length > 1 && lastValue === -1)
          ) {
            newValue = [-1];
          }
          if (newValue.length > 1 && newValue.includes(-1)) {
            newValue = newValue.filter((v) => v !== -1);
          }
          setValue(type, newValue);
        }
        if (isAdmin || isExcutedParticipatingUnit) {
          // eslint-disable-next-line
          let newValue = value || [];
          const lastValue = newValue.slice().pop();
          if (
            newValue.length === 0 ||
            (newValue.length > 1 && lastValue === -1)
          ) {
            newValue = [-1];
          }
          if (newValue.length > 1 && newValue.includes(-1)) {
            newValue = newValue.filter((v) => v !== -1);
          }
          setValue(type, newValue);
          if (!isAdmin) {
            setValue('receivedUnitIds', [unitInfo?.id ?? '']);
          }
        }
        break;
      case 'receivedUnitIds':
        if (isTakenUnit) {
          // eslint-disable-next-line
          let newValue = value || [];
          const lastValue = newValue.slice().pop();
          if (
            newValue.length === 0 ||
            (newValue.length > 1 && lastValue === -1)
          ) {
            newValue = [-1];
          }
          if (newValue.length > 1 && newValue.includes(-1)) {
            newValue = newValue.filter((v) => v !== -1);
          }
          setValue(type, newValue);
        }
        if (isAdmin || isExcutedParticipatingUnit) {
          // eslint-disable-next-line
          let newValue = value || [];
          const lastValue = newValue.slice().pop();
          if (
            newValue.length === 0 ||
            (newValue.length > 1 && lastValue === -1)
          ) {
            newValue = [-1];
          }
          if (newValue.length > 1 && newValue.includes(-1)) {
            newValue = newValue.filter((v) => v !== -1);
          }
          setValue(type, newValue);
          if (!isAdmin) {
            setValue('takenUnitIds', [unitInfo?.id ?? '']);
          }
        }
        break;
      default:
        if (type !== '') {
          let newValue = value || [];
          const lastValue = newValue.slice().pop();
          if (
            newValue.length === 0 ||
            (newValue.length > 1 && lastValue === -1)
          ) {
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
        fromDate: d.fromDate,
        toDate: d.toDate,
        dateType: d.dateType,
      };
      if (d?.samplingFunctionType && !d.samplingFunctionType.includes(-1)) {
        payload.samplingFunctionType = d.samplingFunctionType;
      }
      if (d?.examinationTypes && !d.examinationTypes.includes(-1)) {
        payload.examinationTypes = d.examinationTypes;
      }
      if (d?.samplingPlaces && !d.samplingPlaces.includes(-1)) {
        payload.samplingPlaces = d.samplingPlaces;
      }
      if (d?.takenUnitIds && !d.takenUnitIds.includes(-1)) {
        payload.takenUnitIds = d.takenUnitIds;
      }
      if (d?.receivedUnitIds && !d.receivedUnitIds.includes(-1)) {
        payload.receivedUnitIds = d.receivedUnitIds;
      }
      if (typeof d.isGroup === 'number' && d.isGroup !== -1) {
        payload.isGroup = Boolean(d.isGroup);
      }
      if (d?.feeType && d.feeType !== -1) {
        payload.feeType = d.feeType;
      }
      if (d?.testTechnique && d.testTechnique !== -1) {
        payload.testTechnique = d.testTechnique;
      }
      if (d?.results && !d.results.includes(-1)) {
        payload.results = d.results;
      }

      await dispatch(
        exportExcel({
          method: 'POST',
          url: apiLinks.excel.exportStatisticExamination,
          data: payload,
          fileName: 'Xuất dữ liệu xét nghiệm chi tiết',
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
      <Modal.Header>Xuất dữ liệu xét nghiệm chi tiết</Modal.Header>
      <Modal.Content>
        <Form loading={exportLoading}>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue={0}
              name="dateType"
              rule={{
                required: 'Bắt buộc phải chọn thống kê ngày',
              }}
              render={({ onChange, onBlur }) => (
                <Form.Select
                  required
                  label="Thống kê theo"
                  defaultValue={0}
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
              rules={{
                required: 'Bắt buộc phải chọn ngày bắt đầu',
              }}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  required
                  isHavingTime
                  label="Từ ngày"
                  control={KeyboardDateTimePicker}
                  disabledDays={[{ after: new Date() }]}
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
              rules={{
                required: 'Bắt buộc phải chọn ngày kết thúc',
              }}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  required
                  isHavingTime
                  label="Đến ngày"
                  control={KeyboardDateTimePicker}
                  disabledDays={[
                    {
                      after: new Date(),
                      before: new Date(watch('from')),
                    },
                  ]}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              control={control}
              name="takenUnitIds"
              defaultValue={
                isAdmin
                  ? [-1]
                  : isExcutedParticipatingUnit
                  ? [unitInfo?.id ?? '']
                  : takenUnitOptions[0]?.value
                  ? [takenUnitOptions[0].value]
                  : []
              }
              render={({ value }) => (
                <Form.Select
                  fluid
                  deburr
                  search
                  multiple
                  loading={loading}
                  label="Cơ sở lấy mẫu"
                  value={value}
                  options={takenUnitOptions}
                  onChange={(e, { value: v }) =>
                    handleMulipleSelect('takenUnitIds', v)
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="receivedUnitIds"
              defaultValue={
                executedUnitOptions[0]?.value
                  ? [executedUnitOptions[0].value]
                  : []
              }
              render={({ value }) => (
                <Form.Select
                  fluid
                  deburr
                  search
                  multiple
                  loading={loading}
                  label="Cơ sở xét nghiệm"
                  value={value}
                  options={executedUnitOptions}
                  onChange={(e, { value: v }) =>
                    handleMulipleSelect('receivedUnitIds', v)
                  }
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              control={control}
              name="samplingPlaces"
              defaultValue={[-1]}
              render={({ value }) => (
                <Form.Select
                  multiple
                  label="Nơi lấy mẫu"
                  value={value}
                  options={samplingPlaceOptions}
                  onChange={(e, { value: v }) =>
                    handleMulipleSelect('samplingPlaces', v)
                  }
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
                  multiple
                  label="Lý do xét nghiệm"
                  value={value}
                  options={examinationTypeOptions}
                  onChange={(e, { value: v }) =>
                    handleMulipleSelect('examinationTypes', v)
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="samplingFunctionType"
              defaultValue={[-1]}
              render={({ value }) => (
                <Form.Select
                  multiple
                  label="Chức năng lấy mẫu"
                  value={value}
                  options={samplingFunctionOptions}
                  onChange={(e, { value: v }) =>
                    handleMulipleSelect('samplingFunctionType', v)
                  }
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue={groupOptions[0].value}
              name="isGroup"
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  label="Loại mẫu"
                  value={value}
                  options={groupOptions}
                  onBlur={onBlur}
                  onChange={(e, { value: v }) => onChange(v)}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue={-1}
              name="feeType"
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  control={FeeTypeSelect}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue={-1}
              name="testTechnique"
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  label="Kỹ thuật XN"
                  value={value}
                  options={testTechniqueOptions}
                  onBlur={onBlur}
                  onChange={(e, { value: v }) => onChange(v)}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue={[-1]}
              name="results"
              render={({ value }) => (
                <Form.Select
                  multiple
                  label="Kết quả"
                  value={value}
                  options={resultOptions}
                  onChange={(e, { value: v }) =>
                    handleMulipleSelect('results', v)
                  }
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

ExportStatisticExaminationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExportStatisticExaminationModal;
