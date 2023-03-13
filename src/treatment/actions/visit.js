import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { announceTreatmentError } from 'treatment/utils/helpers';

import types from './types';

const getVisitsRequest = () => ({
  type: types.GET_VISITS_REQUEST,
});
const getVisitsSuccess = (response) => ({
  type: types.GET_VISITS_SUCCESS,
  payload: response,
});
const getVisitsFailure = (error) => ({
  type: types.GET_VISITS_FAILURE,
  payload: error,
});

const getVisits =
  ({ facilityId, profileId, pageSize, pageIndex }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getVisitsRequest());
      httpClient
        .callApi({
          url: apiLinks.treatment.visit.get + profileId,
          params: { facilityId, pageSize, pageIndex },
        })
        .then((response) => {
          dispatch(getVisitsSuccess(response.data));
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(getVisitsFailure(error));
          reject();
        });
    });

const createVisitRequest = () => ({
  type: types.CREATE_VISIT_REQUEST,
});
const createVisitSuccess = (response) => ({
  type: types.CREATE_VISIT_SUCCESS,
  payload: response,
});
const createVisitFailure = (error) => ({
  type: types.CREATE_VISIT_FAILURE,
  payload: error,
});

const createVisit = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createVisitRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.treatment.visit.create,
        data,
      })
      .then((response) => {
        dispatch(createVisitSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(createVisitFailure(error));
        reject();
      });
  });

const updateVisitRequest = () => ({
  type: types.UPDATE_VISIT_REQUEST,
});
const updateVisitSuccess = (response) => ({
  type: types.UPDATE_VISIT_SUCCESS,
  payload: response,
});
const updateVisitFailure = (error) => ({
  type: types.UPDATE_VISIT_FAILURE,
  payload: error,
});

const updateVisit = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateVisitRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.treatment.visit.update,
        data,
      })
      .then((response) => {
        dispatch(updateVisitSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(updateVisitFailure(error));
        reject();
      });
  });

const completeVisitRequest = () => ({
  type: types.COMPLETE_VISIT_REQUEST,
});
const completeVisitSuccess = (response) => ({
  type: types.COMPLETE_VISIT_SUCCESS,
  payload: response,
});
const completeVisitFailure = (error) => ({
  type: types.COMPLETE_VISIT_FAILURE,
  payload: error,
});

const completeVisit = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(completeVisitRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.treatment.visit.complete,
        data,
      })
      .then((response) => {
        dispatch(completeVisitSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(completeVisitFailure(error));
        reject();
      });
  });

export { getVisits, createVisit, updateVisit, completeVisit };
