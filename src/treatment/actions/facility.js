import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { announceTreatmentError } from 'treatment/utils/helpers';
import types from './types';

const getFacilityInfoRequest = () => ({
  type: types.TM_GET_FACILITY_INFO_REQUEST,
});
const getFacilityInfoSuccess = (response) => ({
  type: types.TM_GET_FACILITY_INFO_SUCCESS,
  payload: response,
});
const getFacilityInfoFailure = (error) => ({
  type: types.TM_GET_FACILITY_INFO_FAILURE,
  payload: error,
});

const getFacilityInfo = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getFacilityInfoRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.facility.get,
      })
      .then((response) => {
        dispatch(getFacilityInfoSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getFacilityInfoFailure(error));
        reject();
      });
  });

const getFacilitiesRequest = () => ({
  type: types.GET_FACILITY_LIST_REQUEST,
});
const getFacilitiesSuccess = (response) => ({
  type: types.GET_FACILITY_LIST_SUCCESS,
  payload: response,
});
const getFacilitiesFailure = (error) => ({
  type: types.GET_FACILITY_LIST_FAILURE,
  payload: error,
});

const getFacilities = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getFacilitiesRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.facility.getFacilities,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(getFacilitiesSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getFacilitiesFailure(error));
        reject();
      });
  });

const getFacilityByIdRequest = () => ({
  type: types.GET_FACILITY_DETAIL_REQUEST,
});
const getFacilityByIdSuccess = (response) => ({
  type: types.GET_FACILITY_DETAIL_SUCCESS,
  payload: response,
});
const getFacilityByIdFailure = (error) => ({
  type: types.GET_FACILITY_DETAIL_FAILURE,
  payload: error,
});

const getFacilityById = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getFacilityByIdRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.facility.getDetail + id,
      })
      .then((response) => {
        dispatch(getFacilityByIdSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getFacilityByIdFailure(error));
        reject();
      });
  });

const createFacilityRequest = () => ({
  type: types.CREATE_FACILITY_REQUEST,
});
const createFacilitySuccess = (response) => ({
  type: types.CREATE_FACILITY_SUCCESS,
  payload: response,
});
const createFacilityFailure = (error) => ({
  type: types.CREATE_FACILITY_FAILURE,
  payload: error,
});

const createFacility = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createFacilityRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.treatment.facility.create + data.id,
        data,
      })
      .then((response) => {
        dispatch(createFacilitySuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(createFacilityFailure(error));
        reject();
      });
  });

const updateFacilityRequest = () => ({
  type: types.UPDATE_FACILITY_REQUEST,
});
const updateFacilitySuccess = (response) => ({
  type: types.UPDATE_FACILITY_SUCCESS,
  payload: response,
});
const updateFacilityFailure = (error) => ({
  type: types.UPDATE_FACILITY_FAILURE,
  payload: error,
});

const updateFacility = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateFacilityRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.treatment.facility.update + data.id,
        data,
      })
      .then((response) => {
        dispatch(updateFacilitySuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(updateFacilityFailure(error));
        reject();
      });
  });
const deleteFacilityRequest = () => ({
  type: types.DELETE_FACILITY_REQUEST,
});
const deleteFacilitySuccess = (response) => ({
  type: types.DELETE_FACILITY_SUCCESS,
  payload: response,
});
const deleteFacilityFailure = (error) => ({
  type: types.DELETE_FACILITY_FAILURE,
  payload: error,
});

const deleteFacility = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteFacilityRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.treatment.facility.delete + id,
      })
      .then((response) => {
        dispatch(deleteFacilitySuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(deleteFacilityFailure(error));
        reject();
      });
  });

const getCompletedRequest = () => ({
  type: types.TM_GET_COMPLETED_REQUEST,
});
const getCompletedSuccess = (response) => ({
  type: types.TM_GET_COMPLETED_SUCCESS,
  payload: response,
});
const getCompletedFailure = (error) => ({
  type: types.TM_GET_COMPLETED_FAILURE,
  payload: error,
});

const getCompleted = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getCompletedRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.facility.getCompleted,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(getCompletedSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getCompletedFailure(error));
        reject();
      });
  });

const getTransitedRequest = () => ({
  type: types.TM_GET_TRANSITED_REQUEST,
});
const getTransitedSuccess = (response) => ({
  type: types.TM_GET_TRANSITED_SUCCESS,
  payload: response,
});
const getTransitedFailure = (error) => ({
  type: types.TM_GET_TRANSITED_FAILURE,
  payload: error,
});

const getTransited = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getTransitedRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.facility.getTransited,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(getTransitedSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getTransitedFailure(error));
        reject();
      });
  });

const getOutOfProcessRequest = () => ({
  type: types.TM_GET_OUT_OF_PROCESS_REQUEST,
});
const getOutOfProcessSuccess = (response) => ({
  type: types.TM_GET_OUT_OF_PROCESS_SUCCESS,
  payload: response,
});
const getOutOfProcessFailure = (error) => ({
  type: types.TM_GET_OUT_OF_PROCESS_FAILURE,
  payload: error,
});

const getOutOfProcess = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getOutOfProcessRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.facility.getOutOfProcess,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(getOutOfProcessSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getOutOfProcessFailure(error));
        reject();
      });
  });

const getTransferRequest = () => ({
  type: types.TM_GET_TRANSFER_REQUEST,
});
const getTransferSuccess = (response) => ({
  type: types.TM_GET_TRANSFER_SUCCESS,
  payload: response,
});
const getTransferFailure = (error) => ({
  type: types.TM_GET_TRANSFER_FAILURE,
  payload: error,
});

const getTransfer = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getTransferRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.facility.getTransfer,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(getTransferSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getTransferFailure(error));
        reject();
      });
  });

const approveTransferRequest = () => ({
  type: types.TM_APPROVE_TRANSFER_REQUEST,
});
const approveTransferSuccess = (response) => ({
  type: types.TM_APPROVE_TRANSFER_SUCCESS,
  payload: response,
});
const approveTransferFailure = (error) => ({
  type: types.TM_APPROVE_TRANSFER_FAILURE,
  payload: error,
});

const approveTransfer = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(approveTransferRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.treatment.facility.approveTransfer,
        data,
      })
      .then((response) => {
        dispatch(approveTransferSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(approveTransferFailure(error));
        reject();
      });
  });

const undoTreatmentRequest = () => ({
  type: types.TM_UNDO_REQUEST,
});
const undoTreatmentSuccess = (response) => ({
  type: types.TM_UNDO_SUCCESS,
  payload: response,
});
const undoTreatmentFailure = (error) => ({
  type: types.TM_UNDO_FAILURE,
  payload: error,
});

const undoTreatment = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(undoTreatmentRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.treatment.facility.undo,
        data,
      })
      .then((response) => {
        dispatch(undoTreatmentSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(undoTreatmentFailure(error));
        reject();
      });
  });

export {
  getFacilityInfo,
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
  getCompleted,
  getTransited,
  getOutOfProcess,
  getTransfer,
  approveTransfer,
  undoTreatment,
};
