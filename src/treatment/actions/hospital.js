import apiLinks from 'app/utils/api-links';
import httpClient from 'app/utils/http-client';

import { announceTreatmentError } from 'treatment/utils/helpers';

import types from './types';

const getHospitalsRequest = () => ({ type: types.TM_GET_HOSPITALS_REQUEST });
const getHospitalsSuccess = (response) => ({
  type: types.TM_GET_HOSPITALS_SUCCESS,
  payload: response,
});
const getHospitalsFailure = (error) => ({
  type: types.TM_GET_HOSPITALS_FAILURE,
  payload: error,
});

const getHospitals = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getHospitalsRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.hospital.getAll,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(getHospitalsSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getHospitalsFailure(error));
        reject();
      });
  });

const createHospitalRequest = () => ({
  type: types.TM_CREATE_HOSPITAL_REQUEST,
});
const createHospitalSuccess = (response) => ({
  type: types.TM_CREATE_HOSPITAL_SUCCESS,
  payload: response,
});
const createHospitalFailure = (error) => ({
  type: types.TM_CREATE_HOSPITAL_FAILURE,
  payload: error,
});
const createHospital = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createHospitalRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.treatment.hospital.create,
        data,
      })
      .then((response) => {
        dispatch(createHospitalSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(createHospitalFailure(error));
        reject();
      });
  });
const updateHospitalRequest = () => ({
  type: types.TM_UPDATE_HOSPITAL_REQUEST,
});
const updateHospitalSuccess = (response) => ({
  type: types.TM_UPDATE_HOSPITAL_SUCCESS,
  payload: response,
});
const updateHospitalFailure = (error) => ({
  type: types.TM_UPDATE_HOSPITAL_FAILURE,
  payload: error,
});
const updateHospital = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateHospitalRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.treatment.hospital.update + data.id,
        data,
      })
      .then((response) => {
        dispatch(updateHospitalSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(updateHospitalFailure(error));
        reject();
      });
  });
const deleteHospitalRequest = () => ({
  type: types.TM_DELETE_HOSPITAL_REQUEST,
});
const deleteHospitalSuccess = (response) => ({
  type: types.TM_DELETE_HOSPITAL_SUCCESS,
  payload: response,
});
const deleteHospitalFailure = (error) => ({
  type: types.TM_DELETE_HOSPITAL_FAILURE,
  payload: error,
});
const deleteHospital = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteHospitalRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.treatment.hospital.delete + id,
      })
      .then((response) => {
        dispatch(deleteHospitalSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(deleteHospitalFailure(error));
        reject();
      });
  });
const getHospitalsByFacilityRequest = () => ({
  type: types.TM_GET_HOSPITALS_BY_FACILITY_REQUEST,
});
const getHospitalsByFacilitySuccess = (response) => ({
  type: types.TM_GET_HOSPITALS_BY_FACILITY_SUCCESS,
  payload: response,
});
const getHospitalsByFacilityFailure = (error) => ({
  type: types.TM_GET_HOSPITALS_BY_FACILITY_FAILURE,
  payload: error,
});
const getHospitalsByFacility = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getHospitalsByFacilityRequest());
    httpClient
      .callApi({
        url: `${
          apiLinks.treatment.hospital.getByFacility + arg?.facilityId
        }/Hospitals`,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(getHospitalsByFacilitySuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getHospitalsByFacilityFailure(error));
        reject();
      });
  });
const addHospitalsToFacilityRequest = () => ({
  type: types.TM_ADD_HOSPITALS_TO_FACILITY_REQUEST,
});
const addHospitalsToFacilitySuccess = (response) => ({
  type: types.TM_ADD_HOSPITALS_TO_FACILITY_SUCCESS,
  payload: response,
});
const addHospitalsToFacilityFailure = (error) => ({
  type: types.TM_ADD_HOSPITALS_TO_FACILITY_FAILURE,
  payload: error,
});
const addHospitalsToFacility =
  ({ facilityId, hospitalIds }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(addHospitalsToFacilityRequest());
      httpClient
        .callApi({
          method: 'POST',
          url: `${
            apiLinks.treatment.hospital.createByFacility + facilityId
          }/Hospitals`,
          data: hospitalIds.map((id) => ({ hospitalId: id })),
        })
        .then((response) => {
          dispatch(addHospitalsToFacilitySuccess(response.data));
          resolve();
        })
        .catch((error) => {
          announceTreatmentError(error);
          dispatch(addHospitalsToFacilityFailure(error));
          reject();
        });
    });
const removeHospitalsToFacilityRequest = () => ({
  type: types.TM_REMOVE_HOSPITALS_TO_FACILITY_REQUEST,
});
const removeHospitalsToFacilitySuccess = (response) => ({
  type: types.TM_REMOVE_HOSPITALS_TO_FACILITY_SUCCESS,
  payload: response,
});
const removeHospitalsToFacilityFailure = (error) => ({
  type: types.TM_REMOVE_HOSPITALS_TO_FACILITY_FAILURE,
  payload: error,
});
const removeHospitalsToFacility =
  ({ facilityId, hospitalIds }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(removeHospitalsToFacilityRequest());
      httpClient
        .callApi({
          method: 'DELETE',
          url: `${
            apiLinks.treatment.hospital.deleteByFacility + facilityId
          }/Hospitals`,
          data: hospitalIds.map((id) => ({ hospitalId: id })),
        })
        .then((response) => {
          dispatch(removeHospitalsToFacilitySuccess(response.data));
          resolve();
        })
        .catch((error) => {
          announceTreatmentError(error);
          dispatch(removeHospitalsToFacilityFailure(error));
          reject();
        });
    });

export {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
  getHospitalsByFacility,
  addHospitalsToFacility,
  removeHospitalsToFacility,
};
