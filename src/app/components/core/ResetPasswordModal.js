import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { Modal, Form, Label, Button } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import apiLinks from 'app/utils/api-links';

const ResetPasswordModal = (props) => {
  const { data, onRefresh, onClose } = props;

  const { watch, errors, register, setValue, handleSubmit, trigger } =
    useForm();

  const disabled = !!errors.password || !!errors.confirmPassword;

  const [resetLoading, setResetLoading] = useState(false);
  const handleReset = (payload) => {
    setResetLoading(true);
    axios({
      method: 'PUT',
      url: apiLinks.changePassword,
      headers: {
        Authorization: `bearer ${data.token}`,
      },
      data: {
        oldPassword: data.oldPassword,
        newPassword: payload.password,
      },
    })
      .then(() => {
        toast.success('Đổi mật khẩu thành công');
      })
      .catch((error) => {
        toast.warn(error.response.data);
      })
      .finally(() => {
        onClose();
        onRefresh();
        setValue('password', '');
        setValue('confirmPassword', '');
        setResetLoading(false);
      });
  };

  useEffect(() => {
    register({ name: 'password' }, { required: true });
    register(
      { name: 'confirmPassword' },
      { required: true, validate: (p) => p === watch('password') },
    );
  }, [register, watch]);

  return (
    <Modal size="small" open={Boolean(data.token)}>
      <Modal.Header>Thay đổi mật khẩu lần đầu để tiếp tục sử dụng</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field required error={Boolean(errors.password)}>
            <label>Mật khẩu mới</label>
            <input
              type="password"
              value={watch('password') || ''}
              disabled={resetLoading}
              onChange={(e) => {
                setValue('password', e.target.value);
                trigger('password');
              }}
            />
            {errors.password && (
              <Label basic color="red" pointing>
                Bắt buộc nhập mật khẩu mới
              </Label>
            )}
          </Form.Field>
          <Form.Field required error={Boolean(errors.confirmPassword)}>
            <label>Xác nhận lại mật khẩu mới</label>
            <input
              type="password"
              value={watch('confirmPassword') || ''}
              disabled={resetLoading}
              onChange={(e) => {
                setValue('confirmPassword', e.target.value);
                trigger('confirmPassword');
              }}
            />
            {(errors?.confirmPassword?.type ?? '') === 'required' && (
              <Label basic color="red" pointing>
                Bắt buộc nhập xác nhận lại mật khẩu
              </Label>
            )}
            {(errors?.confirmPassword?.type ?? '') === 'validate' && (
              <Label basic color="red" pointing>
                Mật khẩu không khớp
              </Label>
            )}
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          loading={resetLoading}
          disabled={Boolean(resetLoading || disabled)}
          onClick={handleSubmit(handleReset)}
        />
      </Modal.Actions>
    </Modal>
  );
};

ResetPasswordModal.defaultProps = {
  data: {},
  onRefresh: () => {},
  onClose: () => {},
};

ResetPasswordModal.propTypes = {
  data: PropTypes.shape({
    token: PropTypes.string,
    oldPassword: PropTypes.string,
  }),
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

export default ResetPasswordModal;
