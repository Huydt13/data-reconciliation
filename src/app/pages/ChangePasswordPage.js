import React, { useState } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';

import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { changePassword, logout } from 'app/actions/auth';

const ChangePasswordPage = () => {
  const { watch, errors, register, setValue, setError, trigger, clearErrors } =
    useForm();

  const oldPassword = watch('oldPassword');
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  const history = useHistory();
  const dispatch = useDispatch();
  const [changePasswordFailed, setChangePasswordFailed] = useState(false);
  const onSubmit = () => {
    dispatch(changePassword({ oldPassword, newPassword }))
      .then(() => {
        logout();
        history.push('/login');
      })
      .catch(() => {
        setChangePasswordFailed(true);
      });
  };

  const loading = useSelector((state) => state.auth.changePasswordLoading);

  return (
    <Form
      loading={loading}
      error={confirmPassword !== newPassword || changePasswordFailed}
      onSubmit={onSubmit}
    >
      <h4>Đổi mật khẩu tài khoản</h4>
      <Form.Group widths="equal">
        <Form.Field
          name="oldPassword"
          input={{ ref: register }}
          label="Mật khẩu cũ"
          required
          disabled={loading}
          control={Input}
          type="password"
          onError={(e) => setError('oldPassword', e)}
          error={Boolean(errors.oldPassword)}
          onChange={(e, { value }) => {
            trigger('oldPassword');
            setValue('oldPassword', value);
            clearErrors('oldPassword');
            setChangePasswordFailed(false);
          }}
        />
        <Form.Field
          name="newPassword"
          input={{ ref: register }}
          label="Mật khẩu mới"
          required
          disabled={loading}
          control={Input}
          type="password"
          onError={(e) => setError('newPassword', e)}
          error={Boolean(errors.newPassword)}
          onChange={(e, { value }) => {
            trigger('newPassword');
            setValue('newPassword', value);
            clearErrors('newPassword');
            setChangePasswordFailed(false);
          }}
        />
        <Form.Field
          name="confirmPassword"
          input={{ ref: register }}
          label="Xác nhận mật khẩu mới"
          required
          disabled={loading}
          control={Input}
          type="password"
          onError={(e) => setError('confirmPassword', e)}
          error={Boolean(errors.confirmPassword)}
          onChange={(e, { value }) => {
            trigger('confirmPassword');
            setValue('confirmPassword', value);
            clearErrors('confirmPassword');
            setChangePasswordFailed(false);
          }}
        />
      </Form.Group>

      {newPassword && confirmPassword && newPassword !== confirmPassword && (
        <Message error content="Mật khẩu mới chưa khớp" />
      )}
      {changePasswordFailed && (
        <Message error content="Mật khẩu cũ không đúng" />
      )}
      <Form.Group widths="equal">
        <Form.Field
          primary
          disabled={!oldPassword || newPassword !== confirmPassword || loading}
          control={Button}
          content="Xác nhận"
        />
      </Form.Group>
    </Form>
  );
};

export default ChangePasswordPage;
