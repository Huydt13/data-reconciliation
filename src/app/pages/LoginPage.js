import React, { useState, useEffect } from 'react';
import { Card, Button, Message, Form, Label } from 'semantic-ui-react';
import { FiLogIn, FiInfo } from 'react-icons/fi';
import styled from 'styled-components';

import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useAuth } from 'app/hooks';
import ResetPasswordModal from 'app/components/core/ResetPasswordModal';

import packageJson from '../../../package.json';

const StyledCard = styled(Card)`
  width: 450px !important;
  position: absolute !important;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const StyledFormField = styled(Form.Field)`
  text-align: left;
`;
const IconWrapper = styled.span`
  margin-right: 8px;
  vertical-align: middle;
`;

const LoginPage = () => {
  const {
    watch,
    errors,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    trigger,
  } = useForm();

  useEffect(() => {
    register({ name: 'username' }, { required: true });
    register({ name: 'password' }, { required: true });
    register({ name: 'remember' });
  }, [register]);

  const username = watch('username');
  const password = watch('password');

  const [loginLoading, setLoginLoading] = useState(false);
  const [resetPassword, setResetPassword] = useState(undefined);
  const history = useHistory();
  const { login } = useAuth();
  const handleLogin = (data) => {
    setLoginLoading(true);
    const { username: u, password: p, remember } = data;
    login(u, p, remember)
      .then(() => setTimeout(() => history.push('/auth'), 300))
      .catch((error) => {
        if (error.response?.status === 426) {
          setResetPassword({
            // eslint-disable-next-line camelcase
            token: error.response.data?.access_token ?? '',
            oldPassword: password,
          });
        } else {
          const responseError = error.response?.data ?? '';
          if (responseError.includes('disabled')) {
            setError('invalid', { type: 'Không có quyền truy cập!', message: 'Tài khoản của bạn đã bị vô hiệu hoá' });
          } else {
            setError('invalid', error ?? { type: '', message: '' });
          }
        }
      })
      .finally(() => {
        setValue('username', '');
        setValue('password', '');
        setLoginLoading(false);
      });
  };

  return (
    <>
      <StyledCard>
        <Card.Content>
          <Form onSubmit={handleSubmit(handleLogin)}>
            <StyledFormField error={Boolean(errors.username || errors.invalid)}>
              <input
                placeholder="Username"
                value={username || ''}
                disabled={loginLoading}
                onChange={(e) => {
                  setValue('username', e.target.value);
                  trigger('username');
                  clearErrors('invalid');
                }}
              />
              {errors.username && (
                <Label basic color="red" pointing>
                  Bắt buộc nhập tài khoản
                </Label>
              )}
            </StyledFormField>
            <StyledFormField error={Boolean(errors.password || errors.invalid)}>
              <input
                type="password"
                placeholder="Password"
                value={password || ''}
                disabled={loginLoading}
                onChange={(e) => {
                  setValue('password', e.target.value);
                  trigger('password');
                  clearErrors('invalid');
                }}
              />
              {errors.password && (
                <Label basic color="red" pointing>
                  Bắt buộc nhập mật khẩu
                </Label>
              )}
            </StyledFormField>
            <Button
              primary
              icon={
                <IconWrapper>
                  <FiLogIn />
                </IconWrapper>
              }
              content="Đăng nhập"
              loading={loginLoading}
              disabled={loginLoading}
            />
          </Form>
          {errors.invalid && (
            <Message
              error
              header={errors.invalid.type || 'Đăng nhập thất bại!'}
              content={
                errors.invalid.message || 'Tài khoản hoặc mặt khẩu không đúng'
              }
            />
          )}
        </Card.Content>
        <Card.Content extra>
          <IconWrapper>
            <FiInfo />
          </IconWrapper>
          {packageJson.version}
        </Card.Content>
      </StyledCard>

      <ResetPasswordModal
        data={resetPassword}
        onRefresh={() => clearErrors('invalid')}
        onClose={() => setResetPassword(undefined)}
      />
    </>
  );
};

export default LoginPage;
