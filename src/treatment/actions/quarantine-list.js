import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { announceTreatmentError } from 'treatment/utils/helpers';

import types from './types';

const getQuarantineListByFacilityRequest = () => ({
  type: types.GET_QUARANTINE_LIST_BY_FACILITY_REQUEST,
});
const getQuarantineListByFacilitySuccess = (response) => ({
  type: types.GET_QUARANTINE_LIST_BY_FACILITY_SUCCESS,
  payload: response,
});
const getQuarantineListByFacilityFailure = (error) => ({
  type: types.GET_QUARANTINE_LIST_BY_FACILITY_FAILURE,
  payload: error,
});

const getQuarantineListByFacility = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getQuarantineListByFacilityRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.quarantineList.get,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(getQuarantineListByFacilitySuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getQuarantineListByFacilityFailure(error));
        reject();
      });
  });

const completeTreatmentRequest = () => ({
  type: types.TM_COMPLETE_REQUEST,
});
const completeTreatmentSuccess = (response) => ({
  type: types.TM_COMPLETE_SUCCESS,
  payload: response,
});
const completeTreatmentFailure = (error) => ({
  type: types.TM_COMPLETE_FAILURE,
  payload: error,
});

const completeTreatment = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(completeTreatmentRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.treatment.quarantineList.complete,
        data,
      })
      .then((response) => {
        dispatch(completeTreatmentSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(completeTreatmentFailure(error));
        reject();
      });
  });

const transitTreatmentRequest = () => ({
  type: types.TM_TRANSIT_REQUEST,
});
const transitTreatmentSuccess = (response) => ({
  type: types.TM_TRANSIT_SUCCESS,
  payload: response,
});
const transitTreatmentFailure = (error) => ({
  type: types.TM_TRANSIT_FAILURE,
  payload: error,
});

const transitTreatment = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(transitTreatmentRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.treatment.quarantineList.transit,
        data,
      })
      .then((response) => {
        dispatch(transitTreatmentSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(transitTreatmentFailure(error));
        reject();
      });
  });

const outOfProcessTreatmentRequest = () => ({
  type: types.TM_OUT_OF_PROCESS_REQUEST,
});
const outOfProcessTreatmentSuccess = (response) => ({
  type: types.TM_OUT_OF_PROCESS_SUCCESS,
  payload: response,
});
const outOfProcessTreatmentFailure = (error) => ({
  type: types.TM_OUT_OF_PROCESS_FAILURE,
  payload: error,
});

const outOfProcessTreatment = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(outOfProcessTreatmentRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.treatment.quarantineList.outOfProcess,
        data,
      })
      .then((response) => {
        dispatch(outOfProcessTreatmentSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(outOfProcessTreatmentFailure(error));
        reject();
      });
  });

const transferTreatmentRequest = () => ({
  type: types.TM_TRANSFER_REQUEST,
});
const transferTreatmentSuccess = (response) => ({
  type: types.TM_TRANSFER_SUCCESS,
  payload: response,
});
const transferTreatmentFailure = (error) => ({
  type: types.TM_TRANSFER_FAILURE,
  payload: error,
});

const transferTreatment = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(transferTreatmentRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.treatment.facility.transfer,
        data,
      })
      .then((response) => {
        dispatch(transferTreatmentSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(transferTreatmentFailure(error));
        reject();
      });
  });

export {
  getQuarantineListByFacility,
  completeTreatment,
  transitTreatment,
  outOfProcessTreatment,
  transferTreatment,
};
