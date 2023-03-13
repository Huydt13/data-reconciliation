import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { announceTreatmentError } from 'treatment/utils/helpers';

import types from './types';

const getProfileListRequest = () => ({
  type: types.GET_PROFILE_LIST_REQUEST,
});
const getProfileListSuccess = (response) => ({
  type: types.GET_PROFILE_LIST_SUCCESS,
  payload: response,
});
const getProfileListFailure = (error) => ({
  type: types.GET_PROFILE_LIST_FAILURE,
  payload: error,
});

const getProfileList = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getProfileListRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.profileList.get,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(getProfileListSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getProfileListFailure(error));
        reject();
      });
  });

const createProfileListRequest = () => ({
  type: types.CREATE_PROFILE_LIST_REQUEST,
});
const createProfileListSuccess = (response) => ({
  type: types.CREATE_PROFILE_LIST_SUCCESS,
  payload: response,
});
const createProfileListFailure = (error) => ({
  type: types.CREATE_PROFILE_LIST_FAILURE,
  payload: error,
});

const createProfileList = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createProfileListRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.treatment.profile,
        data,
      })
      .then((response) => {
        dispatch(createProfileListSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(createProfileListFailure(error));
        reject();
      });
  });
const createNewProfileRequest = () => ({
  type: types.TM_CREATE_NEW_PROFILE_REQUEST,
});
const createNewProfileSuccess = (response) => ({
  type: types.TM_CREATE_NEW_PROFILE_SUCCESS,
  payload: response,
});
const createNewProfileFailure = (error) => ({
  type: types.TM_CREATE_NEW_PROFILE_FAILURE,
  payload: error,
});

const createNewProfile = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createNewProfileRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.treatment.profileList.createNewProfile,
        data,
      })
      .then((response) => {
        dispatch(createNewProfileSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        announceTreatmentError(error);
        dispatch(createNewProfileFailure(error));
        reject();
      });
  });

export { getProfileList, createProfileList, createNewProfile };
