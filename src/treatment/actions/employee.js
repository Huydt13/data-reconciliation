import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { announceTreatmentError } from 'treatment/utils/helpers';
import types from './types';

const getEmployeesRequest = () => ({
  type: types.GET_EMPLOYEE_LIST_REQUEST,
});
const getEmployeesSuccess = (response) => ({
  type: types.GET_EMPLOYEE_LIST_SUCCESS,
  payload: response,
});
const getEmployeesFailure = (error) => ({
  type: types.GET_EMPLOYEE_LIST_FAILURE,
  payload: error,
});

const getEmployees = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getEmployeesRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.employee.getAll,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(getEmployeesSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getEmployeesFailure(error));
        reject();
      });
  });

const getEmployeeByTokenRequest = () => ({
  type: types.GET_EMPLOYEE_BY_TOKEN_REQUEST,
});
const getEmployeeByTokenSuccess = (response) => ({
  type: types.GET_EMPLOYEE_BY_TOKEN_SUCCESS,
  payload: response,
});
const getEmployeeByTokenFailure = (error) => ({
  type: types.GET_EMPLOYEE_BY_TOKEN_FAILURE,
  payload: error,
});

const getEmployeeByToken = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getEmployeeByTokenRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.employee.get,
      })
      .then((response) => {
        dispatch(getEmployeeByTokenSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getEmployeeByTokenFailure(error));
        reject();
      });
  });

const createEmployeeRequest = () => ({
  type: types.CREATE_EMPLOYEE_REQUEST,
});
const createEmployeeSuccess = (response) => ({
  type: types.CREATE_EMPLOYEE_SUCCESS,
  payload: response,
});
const createEmployeeFailure = (error) => ({
  type: types.CREATE_EMPLOYEE_FAILURE,
  payload: error,
});

const createEmployee = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createEmployeeRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.treatment.employee.create,
        data,
      })
      .then((response) => {
        dispatch(createEmployeeSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(createEmployeeFailure(error));
        reject();
      });
  });

const updateEmployeeByIdRequest = () => ({
  type: types.UPDATE_EMPLOYEE_BY_ID_REQUEST,
});
const updateEmployeeByIdSuccess = (response) => ({
  type: types.UPDATE_EMPLOYEE_BY_ID_SUCCESS,
  payload: response,
});
const updateEmployeeByIdFailure = (error) => ({
  type: types.UPDATE_EMPLOYEE_BY_ID_FAILURE,
  payload: error,
});

const updateEmployeeById = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateEmployeeByIdRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.treatment.employee.updateById + data.id,
        data,
      })
      .then((response) => {
        dispatch(updateEmployeeByIdSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(updateEmployeeByIdFailure(error));
        reject();
      });
  });

const updateEmployeeByTokenRequest = () => ({
  type: types.UPDATE_EMPLOYEE_BY_TOKEN_REQUEST,
});
const updateEmployeeByTokenSuccess = (response) => ({
  type: types.UPDATE_EMPLOYEE_BY_TOKEN_SUCCESS,
  payload: response,
});
const updateEmployeeByTokenFailure = (error) => ({
  type: types.UPDATE_EMPLOYEE_BY_TOKEN_FAILURE,
  payload: error,
});

const updateEmployeeByToken = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateEmployeeByTokenRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.treatment.employee.updateByToken,
        data,
      })
      .then((response) => {
        dispatch(updateEmployeeByTokenSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(updateEmployeeByTokenFailure(error));
        reject();
      });
  });
const deleteEmployeeRequest = () => ({
  type: types.DELETE_EMPLOYEE_REQUEST,
});
const deleteEmployeeSuccess = (response) => ({
  type: types.DELETE_EMPLOYEE_SUCCESS,
  payload: response,
});
const deleteEmployeeFailure = (error) => ({
  type: types.DELETE_EMPLOYEE_FAILURE,
  payload: error,
});

const deleteEmployee = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteEmployeeRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.treatment.employee.delete + id,
      })
      .then((response) => {
        dispatch(deleteEmployeeSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(deleteEmployeeFailure(error));
        reject();
      });
  });

export {
  getEmployees,
  getEmployeeByToken,
  createEmployee,
  updateEmployeeById,
  updateEmployeeByToken,
  deleteEmployee,
};
