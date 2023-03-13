import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import types from './types';

const getQuarantineRequestRequest = () => ({ type: types.GET_QUARANTINE_REQUEST_REQUEST });
const getQuarantineRequestSuccess = (response) => ({ type: types.GET_QUARANTINE_REQUEST_SUCCESS, payload: response });
const getQuarantineRequestFailure = (error) => ({ type: types.GET_QUARANTINE_REQUEST_FAILURE, payload: error });

const getQuarantineRequests = ({
  // managerId = '',
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getQuarantineRequestRequest());
  httpClient.callApi({
    url: apiLinks.quarantineRequests.get,
    params: {
      // managerId,
      pageIndex,
      pageSize,
    },
  }).then((response) => {
    dispatch(getQuarantineRequestSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getQuarantineRequestFailure(error));
    reject();
  });
});

const createQuarantineRequestRequest = () => ({ type: types.CREATE_QUARANTINE_REQUEST_REQUEST });
const createQuarantineRequestSuccess = (response) => ({ type: types.CREATE_QUARANTINE_REQUEST_SUCCESS, payload: response });
const createQuarantineRequestFailure = (error) => ({ type: types.CREATE_QUARANTINE_REQUEST_FAILURE, payload: error });

const createQuarantineRequest = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(createQuarantineRequestRequest());
  httpClient.callApi({
    method: 'POST',
    data,
    url: apiLinks.quarantineRequests.create,
  }).then((response) => {
    dispatch(createQuarantineRequestSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(createQuarantineRequestFailure(error));
    reject();
  });
});

const updateQuarantineRequestRequest = () => ({ type: types.UPDATE_QUARANTINE_REQUEST_REQUEST });
const updateQuarantineRequestSuccess = (response) => ({ type: types.UPDATE_QUARANTINE_REQUEST_SUCCESS, payload: response });
const updateQuarantineRequestFailure = (error) => ({ type: types.UPDATE_QUARANTINE_REQUEST_FAILURE, payload: error });

const updateQuarantineRequest = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(updateQuarantineRequestRequest());
  httpClient.callApi({
    method: 'PUT',
    url: `${apiLinks.quarantineRequests.update}/${data.id}`,
    data,
  }).then((response) => {
    dispatch(updateQuarantineRequestSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(updateQuarantineRequestFailure(error));
    reject();
  });
});

const deleteQuarantineRequestRequest = () => ({ type: types.DELETE_QUARANTINE_REQUEST_REQUEST });
const deleteQuarantineRequestSuccess = () => ({ type: types.DELETE_QUARANTINE_REQUEST_SUCCESS });
const deleteQuarantineRequestFailure = () => ({ type: types.DELETE_QUARANTINE_REQUEST_FAILURE });

const deleteQuarantineRequest = (id) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(deleteQuarantineRequestRequest());
  httpClient.callApi({
    method: 'DELETE',
    url: `${apiLinks.quarantineRequests.delete}/${id}`,
  }).then((response) => {
    dispatch(deleteQuarantineRequestSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(deleteQuarantineRequestFailure(error));
    reject();
  });
});

const getQuarantineRequestDetailRequest = () => ({ type: types.GET_QUARANTINE_REQUEST_DETAIL_REQUEST });
const getQuarantineRequestDetailSuccess = (response) => ({ type: types.GET_QUARANTINE_REQUEST_DETAIL_SUCCESS, payload: response });
const getQuarantineRequestDetailFailure = (error) => ({ type: types.GET_QUARANTINE_REQUEST_DETAIL_FAILURE, payload: error });

const getQuarantineRequestDetail = (id) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getQuarantineRequestDetailRequest());
  httpClient.callApi({
    url: `${apiLinks.quarantineRequests.get}/${id}`,
  }).then((response) => {
    dispatch(getQuarantineRequestDetailSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getQuarantineRequestDetailFailure(error));
    reject();
  });
});
export {
  getQuarantineRequests,
  createQuarantineRequest,
  updateQuarantineRequest,
  deleteQuarantineRequest,
  getQuarantineRequestDetail,
};
