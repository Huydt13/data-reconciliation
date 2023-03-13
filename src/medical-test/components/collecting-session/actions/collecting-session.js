import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { getExaminationError } from 'app/utils/helpers';
import types from './types';

const getCollectingSessionRequest = () => ({
  type: types.GET_COLLECTING_SESSIONS_REQUEST,
});
const getCollectingSessionSuccess = (response) => ({
  type: types.GET_COLLECTING_SESSIONS_SUCCESS,
  payload: response,
});
const getCollectingSessionFailure = (error) => ({
  type: types.GET_COLLECTING_SESSIONS_FAILURE,
  payload: error,
});

const getCollectingSessions =
  ({
    searchValue = '',
    unitId = '',
    startFrom = '',
    startTo = '',
    pageSize = undefined,
    pageIndex = undefined,
  }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getCollectingSessionRequest());
      httpClient
        .callApi({
          url: apiLinks.collectingSession.get,
          params: {
            unitId,
            searchValue,
            startFrom,
            startTo,
            pageSize,
            pageIndex,
          },
        })
        .then((response) => {
          dispatch(getCollectingSessionSuccess(response.data));
          resolve();
        })
        .catch((error) => {
          dispatch(getCollectingSessionFailure(error));
          reject();
        });
    });

const getCollectingSessionByIdRequest = () => ({
  type: types.GET_COLLECTING_SESSION_DETAIL_REQUEST,
});
const getCollectingSessionByIdSuccess = (response) => ({
  type: types.GET_COLLECTING_SESSION_DETAIL_SUCCESS,
  payload: response,
});
const getCollectingSessionByIdFailure = (error) => ({
  type: types.GET_COLLECTING_SESSION_DETAIL_FAILURE,
  payload: error,
});

const getCollectingSessionById = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getCollectingSessionByIdRequest());
    httpClient
      .callApi({
        url: apiLinks.collectingSession.getDetail + id,
      })
      .then((response) => {
        dispatch(getCollectingSessionByIdSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getCollectingSessionByIdFailure(error));
        reject();
      });
  });

const createCollectingSessionRequest = () => ({
  type: types.CREATE_COLLECTING_SESSION_REQUEST,
});
const createCollectingSessionSuccess = (response) => ({
  type: types.CREATE_COLLECTING_SESSION_SUCCESS,
  payload: response,
});
const createCollectingSessionFailure = (error) => ({
  type: types.CREATE_COLLECTING_SESSION_FAILURE,
  payload: error,
});

const createCollectingSession = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createCollectingSessionRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.collectingSession.create,
        data,
      })
      .then((response) => {
        dispatch(createCollectingSessionSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(createCollectingSessionFailure(error));
        reject();
      });
  });

const updateCollectingSessionRequest = () => ({
  type: types.UPDATE_COLLECTING_SESSION_REQUEST,
});
const updateCollectingSessionSuccess = (response) => ({
  type: types.UPDATE_COLLECTING_SESSION_SUCCESS,
  payload: response,
});
const updateCollectingSessionFailure = (error) => ({
  type: types.UPDATE_COLLECTING_SESSION_FAILURE,
  payload: error,
});

const updateCollectingSession = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateCollectingSessionRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.collectingSession.update,
        data,
      })
      .then((response) => {
        dispatch(updateCollectingSessionSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateCollectingSessionFailure(error));
        reject();
      });
  });
const deleteCollectingSessionRequest = () => ({
  type: types.DELETE_COLLECTING_SESSION_REQUEST,
});
const deleteCollectingSessionSuccess = (response) => ({
  type: types.DELETE_COLLECTING_SESSION_SUCCESS,
  payload: response,
});
const deleteCollectingSessionFailure = (error) => ({
  type: types.DELETE_COLLECTING_SESSION_FAILURE,
  payload: error,
});

const deleteCollectingSession = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteCollectingSessionRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.collectingSession.delete + id,
      })
      .then((response) => {
        dispatch(deleteCollectingSessionSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(deleteCollectingSessionFailure(error));
        reject();
      });
  });

export {
  getCollectingSessions,
  getCollectingSessionById,
  createCollectingSession,
  updateCollectingSession,
  deleteCollectingSession,
};
