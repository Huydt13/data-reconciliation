import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Modal, Form, Button } from 'semantic-ui-react';
import { KeyboardDatePicker } from 'app/components/shared';

import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { exportExcel } from 'app/actions/global';
import apiLinks from 'app/utils/api-links';

const profileTypeOptions = [
  { value: 0, text: 'Tất cả' },
  { value: 1, text: 'Hồ sơ đơn' },
  { value: 2, text: 'Hồ sơ gộp' },
];

const ExportProfileModal = (props) => {
  const { open, onClose } = props;

  const {
    watch,
    register,
    setValue,
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();
  const { exportLoading } = useSelector((s) => s.global);

  const onSubmit = async (d) => {
    await dispatch(
      exportExcel({
        method: 'GET',
        url: apiLinks.excel.exportProfileHasExamination,
        params: {
          fromDate: d?.fromDate ?? moment().format('YYYY-DD-MM'),
          toDate: d?.toDate ?? moment().format('YYYY-DD-MM'),
          onlyGroupProfiles:
          d?.onlyGroupProfiles
            ?
              d.onlyGroupProfiles === 1
              ? false
              : d.onlyGroupProfiles === 2
                ? true
                : null
            : null,
        },
        fileName: 'Xuất hồ sơ có lịch sử xét nghiệm',
      }),
    );
  };

  useEffect(() => {
    register('fromDate');
    register('toDate');
    register('onlyGroupProfiles');
  }, [register]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        Xuất hồ sơ có lịch sử xét nghiệm
      </Modal.Header>
      <Modal.Content>
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
              label="Loại hồ sơ"
              value={watch('onlyGroupProfiles') || 0}
              options={profileTypeOptions}
              onChange={(_, { value }) => setValue('onlyGroupProfiles', value)}
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
      </Modal.Content>
    </Modal>
  );
};

ExportProfileModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

ExportProfileModal.defaultProps = {
  open: false,
  onClose: () => {},
};

export default ExportProfileModal;
