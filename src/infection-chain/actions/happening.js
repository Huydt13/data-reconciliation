import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import types, {
  GET_ALL_HAPPENINGS_REQUEST,
  GET_ALL_HAPPENINGS_SUCCESS,
  GET_ALL_HAPPENINGS_FAILURE,
  GET_HAPPENINGS_REQUEST,
  GET_HAPPENINGS_SUCCESS,
  GET_HAPPENINGS_FAILURE,
  CREATE_HAPPENING_REQUEST,
  CREATE_HAPPENING_SUCCESS,
  CREATE_HAPPENING_FAILURE,
  UPDATE_HAPPENING_REQUEST,
  UPDATE_HAPPENING_SUCCESS,
  UPDATE_HAPPENING_FAILURE,
  DELETE_HAPPENING_REQUEST,
  DELETE_HAPPENING_SUCCESS,
  DELETE_HAPPENING_FAILURE,
} from './types';


const getAllHappeningRequest = () => ({ type: GET_ALL_HAPPENINGS_REQUEST });
const getAllHappeningSuccess = (response) => ({ type: GET_ALL_HAPPENINGS_SUCCESS, payload: response });
const getAllHappeningFailure = (error) => ({ type: GET_ALL_HAPPENINGS_FAILURE, payload: error });

const getAllHappenings = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getAllHappeningRequest());
  httpClient.callApi({
    method: 'GET',
    url: apiLinks.happening(),
    data,
  }).then((response) => {
    dispatch(getAllHappeningSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getAllHappeningFailure(error));
    reject();
  });
});

const getHappeningRequest = () => ({ type: GET_HAPPENINGS_REQUEST });
const getHappeningSuccess = (response) => ({ type: GET_HAPPENINGS_SUCCESS, payload: response });
const getHappeningFailure = (error) => ({ type: GET_HAPPENINGS_FAILURE, payload: error });

const getHappenings = (subjectId) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getHappeningRequest());
  httpClient.callApi({
    method: 'GET',
    url: apiLinks.happening(subjectId),
  }).then((response) => {
    dispatch(getHappeningSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getHappeningFailure(error));
    reject();
  });
});

const createHappeningRequest = () => ({ type: CREATE_HAPPENING_REQUEST });
const createHappeningSuccess = (response) => ({ type: CREATE_HAPPENING_SUCCESS, payload: response });
const createHappeningFailure = (error) => ({ type: CREATE_HAPPENING_FAILURE, payload: error });

const createHappening = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(createHappeningRequest());
  httpClient.callApi({
    method: 'POST',
    data,
    url: apiLinks.happening(),
  }).then((response) => {
    dispatch(createHappeningSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(createHappeningFailure(error));
    reject();
  });
});

const updateHappeningRequest = () => ({ type: UPDATE_HAPPENING_REQUEST });
const updateHappeningSuccess = (response) => ({ type: UPDATE_HAPPENING_SUCCESS, payload: response });
const updateHappeningFailure = (error) => ({ type: UPDATE_HAPPENING_FAILURE, payload: error });

const updateHappening = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(updateHappeningRequest());
  httpClient.callApi({
    method: 'PUT',
    data,
    url: apiLinks.happening(),
  }).then((response) => {
    dispatch(updateHappeningSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(updateHappeningFailure(error));
    reject();
  });
});

const deleteHappeningRequest = () => ({ type: DELETE_HAPPENING_REQUEST });
const deleteHappeningSuccess = () => ({ type: DELETE_HAPPENING_SUCCESS });
const deleteHappeningFailure = () => ({ type: DELETE_HAPPENING_FAILURE });

const deleteHappening = (subjectId, happeningId) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(deleteHappeningRequest());
  httpClient.callApi({
    method: 'DELETE',
    url: apiLinks.happening(subjectId, happeningId),
  }).then((response) => {
    dispatch(deleteHappeningSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(deleteHappeningFailure(error));
    reject();
  });
});

const getSymptomRequest = () => ({ type: types.GET_SYMPTOMS_REQUEST });
const getSymptomSuccess = (response) => ({ type: types.GET_SYMPTOMS_SUCCESS, payload: response });
const getSymptomFailure = (error) => ({ type: types.GET_SYMPTOMS_FAILURE, payload: error });

const getSymptoms = () => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getSymptomRequest());
  httpClient.callApi({
    method: 'GET',
    url: apiLinks.symptom(),
  }).then((response) => {
    dispatch(getSymptomSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getSymptomFailure(error));
    reject();
  });
});

export {
  getAllHappenings,
  getHappenings,
  createHappening,
  updateHappening,
  deleteHappening,
  getSymptoms,
};
