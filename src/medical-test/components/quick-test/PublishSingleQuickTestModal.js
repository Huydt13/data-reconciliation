import React from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Modal, Form, Button } from 'semantic-ui-react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardDatePicker } from 'app/components/shared';

import { useDispatch, useSelector } from 'react-redux';
import { publishQuickTest } from 'medical-test/actions/medical-test';
import { getExaminationError } from 'app/utils/helpers';

const PublishSingleQuickTestModal = (props) => {
  const { data, onClose, onRefresh } = props;

  const {
    errors,
    control,
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();
  const { publishQuickTestLoading } = useSelector((state) => state.medicalTest);

  const onSubmit = async (d) => {
    try {
      const response = await dispatch(publishQuickTest([{
        code: data?.code ?? '',
        publishDate: moment(d.publishDate).format('YYYY-MM-DDT00:00:00+07:00'),
      }]));

      if ((response?.errors ?? []).length > 0) {
        toast.warn(response.errors[0]);
      }
    // eslint-disable-next-line no-empty
    } catch (error) {
      toast.warn(getExaminationError(error?.response?.data ?? {}));
    } finally {
      onClose();
      onRefresh();
    }
  };

  return (
    <Modal open={Boolean(data?.id)} onClose={onClose}>
      <Modal.Header>
        {data?.person?.name ?? ''}
      </Modal.Header>
      <Modal.Content>
        <Form loading={publishQuickTestLoading}>
          <Form.Group widths="equal">
            <Controller
              name="publishDate"
              control={control}
              rules={{ required: true }}
              render={({ onChange, value }) => (
                <Form.Field
                  isHavingTime
                  disabledDays={[{ after: new Date() }]}
                  errors={errors.publishDate && 'Bắt buộc phải nhập ngày công bố'}
                  label="Ngày công bố"
                  control={KeyboardDatePicker}
                  value={value}
                  onChange={onChange}
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
          disabled={publishQuickTestLoading}
          onClick={handleSubmit((d) => onSubmit(d))}
        />
      </Modal.Actions>
    </Modal>
  );
};

PublishSingleQuickTestModal.defaultProps = {
  data: {},
  onClose: () => {},
  onRefresh: () => {},
};

PublishSingleQuickTestModal.propTypes = {
  data: PropTypes.shape({}),
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default PublishSingleQuickTestModal;
