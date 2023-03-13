import types, {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SET_TOKEN,
  SET_PERMISSIONS,
  GET_USER_INFO_REQUEST,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_FAILURE,
  LOG_OUT,
} from 'app/actions/types';

import axios from 'axios';
import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';
import { toast } from 'react-toastify';

const loginRequest = () => ({ type: LOG_IN_REQUEST });
const loginSuccess = (response) => ({
  type: LOG_IN_SUCCESS,
  payload: response,
});
const loginFailure = (error) => ({ type: LOG_IN_FAILURE, payload: error });

const login = (username, password) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(loginRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.login,
        data: { username, password },
      })
      .then((response) => {
        dispatch(loginSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(loginFailure(error));
        reject(error);
      });
  });

const setToken = (token, tokenExpiredTime, userInfo) => ({
  type: SET_TOKEN,
  payload: {
    token,
    tokenExpiredTime,
    userInfo,
  },
});

const getUserInfoRequest = () => ({ type: GET_USER_INFO_REQUEST });
const getUserInfoSuccess = (response) => ({
  type: GET_USER_INFO_SUCCESS,
  payload: response,
});
const getUserInfoFailure = (error) => ({
  type: GET_USER_INFO_FAILURE,
  payload: error,
});

function getUserInfo() {
  return (dispatch) => {
    dispatch(getUserInfoRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.userInfo,
      })
      .then((response) => dispatch(getUserInfoSuccess(response.data)))
      .catch((error) => dispatch(getUserInfoFailure(error)));
  };
}

const logout = () => ({ type: LOG_OUT });

const getPermission = (token) =>
  new Promise((resolve, reject) => {
    const headerToken = token ? { Authorization: `bearer ${token}` } : null;
    axios({
      url: apiLinks.getPermission,
      headers: { ...headerToken },
    })
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject(response));
  });

const setPermissions = (permissionList) => ({
  type: SET_PERMISSIONS,
  payload: permissionList,
});

const checkCredential = (token) =>
  new Promise((resolve, reject) => {
    const headerToken = token ? { Authorization: `bearer ${token}` } : null;
    axios({
      url: apiLinks.checkCredential,
      headers: { ...headerToken },
    })
      .then(resolve)
      .catch(reject);
  });

const changePasswordRequest = () => ({
  type: types.AUTH_CHANGE_PASSWORD_REQUEST,
});
const changePasswordSuccess = (response) => ({
  type: types.AUTH_CHANGE_PASSWORD_SUCCESS,
  payload: response,
});
const changePasswordFailure = (error) => ({
  type: types.AUTH_CHANGE_PASSWORD_FAILURE,
  payload: error,
});

const changePassword =
  ({ oldPassword = '', newPassword = '' }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(changePasswordRequest());
        httpClient
          .callApi({
            method: 'PUT',
            url: apiLinks.changePassword,
            data: {
              oldPassword,
              newPassword,
            },
          })
          .then((response) => {
            dispatch(changePasswordSuccess(response.data));
            toast.success('Đổi mật khẩu thành công, vui lòng đăng nhập lại!');
            resolve();
          })
          .catch((error) => {
            dispatch(changePasswordFailure(error));
            reject();
          });
      });

export {
  login,
  setToken,
  getUserInfo,
  logout,
  getPermission,
  setPermissions,
  checkCredential,
  changePassword,
};
