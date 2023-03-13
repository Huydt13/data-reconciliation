import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { announceTreatmentError } from 'treatment/utils/helpers';

import types from './types';

const getAlreadyInWaitingListRequest = () => ({
  type: types.GET_ALREADY_IN_WAITINGLIST_REQUEST,
});
const getAlreadyInWaitingListSuccess = (response) => ({
  type: types.GET_ALREADY_IN_WAITINGLIST_SUCCESS,
  payload: response,
});
const getAlreadyInWaitingListFailure = (error) => ({
  type: types.GET_ALREADY_IN_WAITINGLIST_FAILURE,
  payload: error,
});

const getAlreadyInWaitingList =
  ({ profileIds }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getAlreadyInWaitingListRequest());
      httpClient
        .callApi({
          url: `${apiLinks.treatment.waitingList.get}${profileIds
            .map((id) => `profileIds${id}`)
            .join('&')}`,
        })
        .then((response) => {
          dispatch(getAlreadyInWaitingListSuccess(response.data));
          resolve();
        })
        .catch((error) => {
          dispatch(getAlreadyInWaitingListFailure(error));
          reject();
        });
    });

const getWaitingListByFacilityRequest = () => ({
  type: types.GET_WAITINGLIST_BY_FACILITY_REQUEST,
});
const getWaitingListByFacilitySuccess = (response) => ({
  type: types.GET_WAITINGLIST_BY_FACILITY_SUCCESS,
  payload: response,
});
const getWaitingListByFacilityFailure = (error) => ({
  type: types.GET_WAITINGLIST_BY_FACILITY_FAILURE,
  payload: error,
});

const getWaitingListByFacility = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getWaitingListByFacilityRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.waitingList.getByFacility,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(getWaitingListByFacilitySuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getWaitingListByFacilityFailure(error));
        reject();
      });
  });

const addProfileToWaitingListRequest = () => ({
  type: types.WAITING_LIST_ADD_PROFILES_REQUEST,
});
const addProfileToWaitingListSuccess = (response) => ({
  type: types.WAITING_LIST_ADD_PROFILES_SUCCESS,
  payload: response,
});
const addProfileToWaitingListFailure = (error) => ({
  type: types.WAITING_LIST_ADD_PROFILES_FAILURE,
  payload: error,
});

const addProfileToWaitingList = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(addProfileToWaitingListRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.treatment.waitingList.create,
        data,
      })
      .then((response) => {
        dispatch(addProfileToWaitingListSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(addProfileToWaitingListFailure(error));
        reject();
      });
  });

const approveWaitingListRequest = () => ({
  type: types.WAITINGLIST_APPROVE_REQUEST,
});
const approveWaitingListSuccess = (response) => ({
  type: types.WAITINGLIST_APPROVE_SUCCESS,
  payload: response,
});
const approveWaitingListFailure = (error) => ({
  type: types.WAITINGLIST_APPROVE_FAILURE,
  payload: error,
});

const approveWaitingList = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(approveWaitingListRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.treatment.waitingList.approve,
        data,
      })
      .then((response) => {
        dispatch(approveWaitingListSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(approveWaitingListFailure(error));
        reject();
      });
  });

export {
  getAlreadyInWaitingList,
  getWaitingListByFacility,
  addProfileToWaitingList,
  approveWaitingList,
};
