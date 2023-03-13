/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Modal, Form, Select, Button, Message } from 'semantic-ui-react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardDateTimePicker } from 'app/components/shared';

import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';
import { showConfirmModal, exportExcel } from 'app/actions/global';
import apiLinks from 'app/utils/api-links';
import {
  getQuickTestsWithoutDispatch,
  updateQuickTest,
  updateQuickTestByAdmin,
} from 'medical-test/actions/medical-test';
import { QUICK_TEST_STATUSES } from 'medical-test/utils/constants';

const resultTypeOptions = [
  'Dương tính',
  'Âm tính',
  'Nghi ngờ',
  'Chưa xác định',
].map((e) => ({
  text: e,
  value: e.toUpperCase(),
}));

const UpdateQuickTestModal = (props) => {
  const { isCreateExam, data, onClose, onRefresh } = props;
  const [exportForm, setExportForm] = useState(false);

  const {
    reset,
    errors,
    control,
    handleSubmit,
  } = useForm();
  const { isUsername } = useAuth();
  const dispatch = useDispatch();
  const { exportLoading } = useSelector((state) => state.global);
  const { updateQuickTestLoading } = useSelector((state) => state.medicalTest);

  const isUpdate = Boolean(data?.result);
  const isDisable =
    !isCreateExam && data?.dateCreated
    ? moment() - moment(data.dateCreated) > 86400000
    : false;

  const onSubmit = async (d) => {
    const payload = {
      ...d,
      id: data?.id,
      personId: data?.personId,
      unitId: data?.unit?.id,
      examinationTypeId: data?.examinationTypeId,
      date: moment(d.date).format('YYYY-MM-DDT07:00:00+07:00'),
    };

    try {
      await dispatch(
        isUsername('hcdc')
        ? updateQuickTestByAdmin(payload)
        : updateQuickTest(payload),
      );
      setExportForm(true);
    // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  const confirm = async (d) => {
    let flag = false;
    try {
      if (!isUpdate) {
        const response = await getQuickTestsWithoutDispatch({
          from: moment(d.date).format('YYYY-MM-DDT00:00:00+07:00'),
          to: moment(d.date).format('YYYY-MM-DDT23:59:59+07:00'),
          status: QUICK_TEST_STATUSES.DONE,
          personName: data?.person?.name ?? '',
          phoneNumber: data?.person?.phone ?? '',
          resultType: d?.result,
        });

        if (response?.data && response.data.length > 0) {
          flag = true;
        }
      }

      if (flag) {
        dispatch(
          showConfirmModal(
            'Ca xét nghiệm nhanh đã có trong hệ thống, xác nhận tạo mới?',
            () => {
              onSubmit(d);
            }),
          );
      } else {
        onSubmit(d);
      }
    // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  const exportResultForm = async () => {
    await dispatch(
      exportExcel({
        method: 'GET',
        url: apiLinks.excel.exportQuickTestResultAnswerForm,
        params: {
          qtid: data?.id,
        },
        fileName: `Phiếu kết quả test nhanh (${data?.code})`,
        isExamination: true,
      }),
    );
  };

  useEffect(() => {
    if (data?.id && (data?.status ?? 0) !== 0) {
      reset(data);
    }
    // eslint-disable-next-line
  }, [reset, data]);

  return (
    <Modal open={Boolean(data?.id)} onClose={onClose}>
      <Modal.Header>
        {data?.person?.name ?? ''}
      </Modal.Header>
      <Modal.Content>
        {isDisable && (
          <Message warning>
            <Message.Header>Không thể sửa mẫu xét nghiệm nhanh</Message.Header>
            <p>
              Do đã vượt quá 24h (ngày tạo
              {' '}
              {moment(data.dateCreated).format('DD/MM/YYYY')}
              )
            </p>
          </Message>
        )}
        <Form loading={updateQuickTestLoading || exportLoading}>
          <Form.Group widths="equal">
            <Controller
              name="date"
              control={control}
              rules={{ required: true }}
              defaultValue={new Date()}
              render={({ onChange, value }) => (
                <Form.Field
                  required
                  isHavingTime
                  readOnly={isDisable}
                  disabledDays={[{
                    before: new Date(2021, 10, 1),
                    after: new Date(),
                  }]}
                  error={errors.date && 'Bắt buộc phải nhập thời gian lấy mẫu (có kết quả)'}
                  label="Thời gian lấy mẫu (có kết quả)"
                  control={KeyboardDateTimePicker}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              name="result"
              control={control}
              rules={{ required: true }}
              defaultValue={undefined}
              render={({ onChange, value }) => (
                <Form.Field
                  required
                  disabled={isDisable}
                  error={errors.result && 'Bắt buộc phải chọn kết quả'}
                  label="Kết quả"
                  control={Select}
                  options={resultTypeOptions}
                  value={value}
                  onChange={(_, { value: v }) => onChange(v)}
                />
                )}
            />
            <Controller
              name="hasSymptom"
              control={control}
              defaultValue={undefined}
              render={({ onChange, onBlur, value }) => (
                <Form.Checkbox
                  disabled={isDisable}
                  style={{ paddingTop: '35px' }}
                  label="Triệu chứng"
                  checked={value === true}
                  onChange={(_, { checked }) => onChange(checked)}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        {exportForm ? (
          <>
            <Button
              positive
              labelPosition="right"
              icon="download"
              content="Xuất phiếu kết quả"
              disabled={exportLoading}
              onClick={() => exportResultForm()}
            />
            <Button
              negative
              labelPosition="right"
              icon="close"
              content="Đóng"
              disabled={exportLoading}
              onClick={() => {
                onClose();
                onRefresh();
                setExportForm(false);
              }}
            />
          </>
        ) : (
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content="Xác nhận"
            disabled={isDisable || updateQuickTestLoading}
            onClick={handleSubmit((d) => confirm(d))}
          />
        )}
      </Modal.Actions>
    </Modal>
  );
};

UpdateQuickTestModal.defaultProps = {
  isCreateExam: false,
  data: {},
  onClose: () => {},
  onRefresh: () => {},
};

UpdateQuickTestModal.propTypes = {
  isCreateExam: PropTypes.bool,
  data: PropTypes.shape({}),
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default UpdateQuickTestModal;
