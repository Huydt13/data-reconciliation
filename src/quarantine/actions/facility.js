import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import types from './types';

const getFacilityRequest = () => ({ type: types.GET_FACILITY_REQUEST });
const getFacilitySuccess = (response) => ({ type: types.GET_FACILITY_SUCCESS, payload: response });
const getFacilityFailure = (error) => ({ type: types.GET_FACILITY_FAILURE, payload: error });

const getFacilities = ({
  managerId = '',
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getFacilityRequest());
  httpClient.callApi({
    url: apiLinks.quarantineFacilities.get,
    params: {
      managerId,
      pageIndex,
      pageSize,
    },
  }).then((response) => {
    dispatch(getFacilitySuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getFacilityFailure(error));
    reject();
  });
});

const createFacilityRequest = () => ({ type: types.CREATE_FACILITY_REQUEST });
const createFacilitySuccess = (response) => ({ type: types.CREATE_FACILITY_SUCCESS, payload: response });
const createFacilityFailure = (error) => ({ type: types.CREATE_FACILITY_FAILURE, payload: error });

const createFacility = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(createFacilityRequest());
  httpClient.callApi({
    method: 'POST',
    data,
    url: apiLinks.quarantineFacilities.create,
  }).then((response) => {
    dispatch(createFacilitySuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(createFacilityFailure(error));
    reject();
  });
});

const updateFacilityRequest = () => ({ type: types.UPDATE_FACILITY_REQUEST });
const updateFacilitySuccess = (response) => ({ type: types.UPDATE_FACILITY_SUCCESS, payload: response });
const updateFacilityFailure = (error) => ({ type: types.UPDATE_FACILITY_FAILURE, payload: error });

const updateFacility = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(updateFacilityRequest());
  httpClient.callApi({
    method: 'PUT',
    url: `${apiLinks.quarantineFacilities.update}/${data.id}`,
    data,
  }).then((response) => {
    dispatch(updateFacilitySuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(updateFacilityFailure(error));
    reject();
  });
});

const deleteFacilityRequest = () => ({ type: types.DELETE_FACILITY_REQUEST });
const deleteFacilitySuccess = () => ({ type: types.DELETE_FACILITY_SUCCESS });
const deleteFacilityFailure = () => ({ type: types.DELETE_FACILITY_FAILURE });

const deleteFacility = (id) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(deleteFacilityRequest());
  httpClient.callApi({
    method: 'DELETE',
    url: `${apiLinks.quarantineFacilities.delete}/${id}`,
  }).then((response) => {
    dispatch(deleteFacilitySuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(deleteFacilityFailure(error));
    reject();
  });
});

const setManagerRequest = () => ({ type: types.SET_FACILITY_MANAGER_REQUEST });
const setManagerSuccess = () => ({ type: types.SET_FACILITY_MANAGER_SUCCESS });
const setManagerFailure = () => ({ type: types.SET_FACILITY_MANAGER_FAILURE });

const setManager = (id, managerId) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(setManagerRequest());
  httpClient.callApi({
    method: 'PUT',
    url: `${apiLinks.quarantineFacilities.setManager}/${id}/SetManager/${managerId}`,
  }).then((response) => {
    dispatch(setManagerSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(setManagerFailure(error));
    reject();
  });
});

export {
  getFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
  setManager,
};
