import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { toast } from 'react-toastify';

import types from './types';

const createAppointRequest = () => ({ type: types.CREATE_APPOINT_REQUEST });
const createAppointSuccess = (response) => ({ type: types.CREATE_APPOINT_SUCCESS, payload: response });
const createAppointFailure = (error) => ({ type: types.CREATE_APPOINT_FAILURE, payload: error });

const createAppoint = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(createAppointRequest());
  httpClient.callApi({
    method: 'POST',
    url: apiLinks.facilities.quarantine.createAppoint,
    data,
  }).then((response) => {
    toast.success('Thành công');
    dispatch(createAppointSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(createAppointFailure(error));
    reject();
  });
});

const appointRequest = () => ({ type: types.APPOINT_REQUEST });
const appointSuccess = (response) => ({ type: types.APPOINT_SUCCESS, payload: response });
const appointFailure = (error) => ({ type: types.APPOINT_FAILURE, payload: error });

const appoint = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(appointRequest());
  httpClient.callApi({
    method: 'POST',
    url: apiLinks.facilities.quarantine.appoint,
    data,
  }).then((response) => {
    toast.success('Thành công');
    dispatch(appointSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(appointFailure(error));
    reject();
  });
});

const takeInRequest = () => ({ type: types.TAKE_IN_REQUEST });
const takeInSuccess = (response) => ({ type: types.TAKE_IN_SUCCESS, payload: response });
const takeInFailure = (error) => ({ type: types.TAKE_IN_FAILURE, payload: error });

const takeIn = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(takeInRequest());
  httpClient.callApi({
    method: 'PUT',
    url: apiLinks.facilities.quarantine.takeIn,
    data,
  }).then((response) => {
    toast.success('Thành công');
    dispatch(takeInSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(takeInFailure(error));
    reject();
  });
});

const completeFacilityRequest = () => ({ type: types.COMPLETE_FACILITY_REQUEST });
const completeFacilitySuccess = (response) => ({ type: types.COMPLETE_FACILITY_SUCCESS, payload: response });
const completeFacilityFailure = (error) => ({ type: types.COMPLETE_FACILITY_FAILURE, payload: error });

const completeFacility = (id) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(completeFacilityRequest());
  httpClient.callApi({
    method: 'PUT',
    url: apiLinks.facilities.quarantine.complete + id,
  }).then((response) => {
    toast.success('Thành công');
    dispatch(completeFacilitySuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(completeFacilityFailure(error));
    reject();
  });
});

const transferFacilityRequest = () => ({ type: types.TRANSFER_FACILITY_REQUEST });
const transferFacilitySuccess = (response) => ({ type: types.TRANSFER_FACILITY_SUCCESS, payload: response });
const transferFacilityFailure = (error) => ({ type: types.TRANSFER_FACILITY_FAILURE, payload: error });

const transferFacility = (id, data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(transferFacilityRequest());
  httpClient.callApi({
    method: 'PUT',
    url: apiLinks.facilities.quarantine.transferFacility + id,
    data,
  }).then((response) => {
    toast.success('Thành công');
    dispatch(transferFacilitySuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(transferFacilityFailure(error));
    reject();
  });
});

const transferTreatmentRequest = () => ({ type: types.TRANSFER_TREATMENT_REQUEST });
const transferTreatmentSuccess = (response) => ({ type: types.TRANSFER_TREATMENT_SUCCESS, payload: response });
const transferTreatmentFailure = (error) => ({ type: types.TRANSFER_TREATMENT_FAILURE, payload: error });

const transferTreatment = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(transferTreatmentRequest());
  httpClient.callApi({
    method: 'PUT',
    url: apiLinks.facilities.quarantine.transfer,
    data,
  }).then((response) => {
    toast.success('Thành công');
    dispatch(transferTreatmentSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(transferTreatmentFailure(error));
    reject();
  });
});

const transferRoomRequest = () => ({ type: types.TRANSFER_ROOM_REQUEST });
const transferRoomSuccess = (response) => ({ type: types.TRANSFER_ROOM_SUCCESS, payload: response });
const transferRoomFailure = (error) => ({ type: types.TRANSFER_ROOM_FAILURE, payload: error });

const transferRoom = (id, data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(transferRoomRequest());
  httpClient.callApi({
    method: 'PUT',
    url: apiLinks.facilities.quarantine.transferRoom + id,
    data,
  }).then((response) => {
    toast.success('Thành công');
    dispatch(transferRoomSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(transferRoomFailure(error));
    reject();
  });
});

const extendFacilityRequest = () => ({ type: types.EXTEND_FACILITY_REQUEST });
const extendFacilitySuccess = (response) => ({ type: types.EXTEND_FACILITY_SUCCESS, payload: response });
const extendFacilityFailure = (error) => ({ type: types.EXTEND_FACILITY_FAILURE, payload: error });

const extendFacility = (id, data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(extendFacilityRequest());
  httpClient.callApi({
    method: 'PUT',
    url: apiLinks.facilities.quarantine.extend + id,
    data,
  }).then((response) => {
    toast.success('Thành công');
    dispatch(extendFacilitySuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(extendFacilityFailure(error));
    reject();
  });
});

const getHistoriesRequest = () => ({ type: types.GET_HISTORIES_REQUEST });
const getHistoriesSuccess = (response) => ({ type: types.GET_HISTORIES_SUCCESS, payload: response });
const getHistoriesFailure = (error) => ({ type: types.GET_HISTORIES_FAILURE, payload: error });

const getHistories = ({
  id = '',
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getHistoriesRequest());
  httpClient.callApi({
    url: `${apiLinks.facilities.quarantine.getHistory}/${id}/Histories`,
    params: {
      pageSize,
      pageIndex,
    },
  }).then((response) => {
    dispatch(getHistoriesSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getHistoriesFailure(error));
    reject();
  });
});

export {
  createAppoint,
  appoint,
  takeIn,
  completeFacility,
  transferFacility,
  transferTreatment,
  transferRoom,
  extendFacility,
  getHistories,
};
