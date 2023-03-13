import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { getExaminationError } from 'app/utils/helpers';
import types from './types';

const selectExams = (exams, pageIndex) => ({
  type: types.SELECT_EXAMS,
  payload: { exams, pageIndex },
});
const clearExams = () => ({
  type: types.CLEAR_EXAMS,
});
const getSessionsRequest = () => ({ type: types.GET_SESSIONS_REQUEST });
const getSessionsSuccess = (response) => ({
  type: types.GET_SESSIONS_SUCCESS,
  payload: response,
});
const getSessionsFailure = (error) => ({
  type: types.GET_SESSIONS_FAILURE,
  payload: error,
});

const getSessions =
  ({
    pageIndex = 0,
    pageSize = 10,
    status = '',
    from = '',
    to = '',
    searchValue = '',
    isCodeSearch = false,
    unitId = '',
  }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getSessionsRequest());
      httpClient
        .callApi({
          url: `${apiLinks.session.get}`,
          params: {
            pageIndex,
            pageSize,
            status,
            from,
            to,
            searchValue,
            isCodeSearch,
            unitId,
          },
        })
        .then((response) => {
          dispatch(getSessionsSuccess(response.data));
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(getSessionsFailure(error));
          reject();
        });
    });

const getSessionDetailRequest = () => ({
  type: types.GET_SESSION_DETAIL_REQUEST,
});
const getSessionDetailSuccess = (response) => ({
  type: types.GET_SESSION_DETAIL_SUCCESS,
  payload: response,
});
const getSessionDetailFailure = (error) => ({
  type: types.GET_SESSION_DETAIL_FAILURE,
  payload: error,
});

const getSessionDetail = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getSessionDetailRequest());
    httpClient
      .callApi({
        url: `${apiLinks.session.get}/${id}`,
      })
      .then((response) => {
        dispatch(getSessionDetailSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getSessionDetailFailure(error));
        reject();
      });
  });

const createSessionRequest = () => ({ type: types.CREATE_SESSION_REQUEST });
const createSessionSuccess = (response) => ({
  type: types.CREATE_SESSION_SUCCESS,
  payload: response,
});
const createSessionFailure = (error) => ({
  type: types.CREATE_SESSION_FAILURE,
  payload: error,
});

const createSession = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createSessionRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.session.create,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(createSessionSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(createSessionFailure(error));
        reject();
      });
  });

const updateSessionRequest = () => ({ type: types.UPDATE_SESSION_REQUEST });
const updateSessionSuccess = (response) => ({
  type: types.UPDATE_SESSION_SUCCESS,
  payload: response,
});
const updateSessionFailure = (error) => ({
  type: types.UPDATE_SESSION_FAILURE,
  payload: error,
});

const updateSession = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateSessionRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.session.update,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(updateSessionSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateSessionFailure(error));
        reject();
      });
  });

const deleteSessionRequest = () => ({ type: types.DELETE_SESSION_REQUEST });
const deleteSessionSuccess = (response) => ({
  type: types.DELETE_SESSION_SUCCESS,
  payload: response,
});
const deleteSessionFailure = (error) => ({
  type: types.DELETE_SESSION_FAILURE,
  payload: error,
});

const deleteSession = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteSessionRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.session.delete,
        params: { id },
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(deleteSessionSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(deleteSessionFailure(error));
        reject();
      });
  });

const getPlateAutoFillRequest = () => ({
  type: types.GET_PLATE_AUTO_FILL_REQUEST,
});
const getPlateAutoFillSuccess = (response) => ({
  type: types.GET_PLATE_AUTO_FILL_SUCCESS,
  payload: response,
});
const getPlateAutoFillFailure = (error) => ({
  type: types.GET_PLATE_AUTO_FILL_FAILURE,
  payload: error,
});

const getPlateAutoFill = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getPlateAutoFillRequest());
    httpClient
      .callApi({
        url: apiLinks.session.getPlateAutoFill,
        params: {
          // set dơ -_-
          diseaseId:
            window.location.href.indexOf('beta') > -1 ||
            process.env.NODE_ENV === 'development'
              ? '93c8f24f-8b9e-4346-c7cb-08d847e8ea22'
              : 'd5f7d080-fcac-4214-bfc4-08d85550d7a4',
        },
      })
      .then((response) => {
        dispatch(getPlateAutoFillSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getPlateAutoFillFailure(error));
        reject();
      });
  });

const exportPlateRequest = () => ({ type: types.EXPORT_PLATE_REQUEST });
const exportPlateSuccess = (response) => ({
  type: types.EXPORT_PLATE_SUCCESS,
  payload: response,
});
const exportPlateFailure = (error) => ({
  type: types.EXPORT_PLATE_FAILURE,
  payload: error,
});

const exportPlate = (testSessionId, testSessionName) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(exportPlateRequest());
    httpClient
      .callApi({
        url: apiLinks.excel.exportPlate,
        responseType: 'blob',
        params: {
          testSessionId,
        },
      })
      .then((response) => {
        dispatch(exportPlateSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${testSessionName}.xlsx`);
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(exportPlateFailure(error));
        reject();
      });
  });

const exportPlateResultRequest = () => ({
  type: types.EXPORT_PLATE_RESULT_REQUEST,
});
const exportPlateResultSuccess = (response) => ({
  type: types.EXPORT_PLATE_RESULT_SUCCESS,
  payload: response,
});
const exportPlateResultFailure = (error) => ({
  type: types.EXPORT_PLATE_RESULT_FAILURE,
  payload: error,
});

const exportPlateResult = (testSessionId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(exportPlateResultRequest());
    httpClient
      .callApi({
        url: apiLinks.excel.exportPlateResult,
        responseType: 'blob',
        params: {
          testSessionId,
        },
      })
      .then((response) => {
        dispatch(exportPlateResultSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'plate-result.xlsx');
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(exportPlateResultFailure(error));
        reject();
      });
  });

const uploadPlateResultRequest = () => ({
  type: types.UPLOAD_PLATE_RESULT_REQUEST,
});
const uploadPlateResultSuccess = (response) => ({
  type: types.UPLOAD_PLATE_RESULT_SUCCESS,
  payload: response,
});
const uploadPlateResultFailure = (error) => ({
  type: types.UPLOAD_PLATE_RESULT_FAILURE,
  payload: error,
});
const setUploadPlateResultProgress = (progress) => ({
  type: types.SET_UPLOAD_PLATE_RESULT_PROGRESS,
  payload: progress,
});

const uploadPlateResult = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(uploadPlateResultRequest());
    httpClient
      .callApi({
        method: 'PUT',
        contentType: 'application/x-www-form-urlencoded',
        url: apiLinks.excel.importTestSessionResult,
        data,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          dispatch(setUploadPlateResultProgress(percentCompleted));
        },
      })
      .then((response) => {
        dispatch(uploadPlateResultSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(uploadPlateResultFailure(error));
        reject(error.response.data);
      });
  });

const updateSessionResultRequest = () => ({
  type: types.UPDATE_SESSION_RESULT_REQUEST,
});
const updateSessionResultSuccess = (response) => ({
  type: types.UPDATE_SESSION_RESULT_SUCCESS,
  payload: response,
});
const updateSessionResultFailure = (error) => ({
  type: types.UPDATE_SESSION_RESULT_FAILURE,
  payload: error,
});
const updateSessionResult = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateSessionResultRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.session.updateResult,
        data,
      })
      .then((response) => {
        dispatch(updateSessionResultSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateSessionResultFailure(error));
        reject(error.response.data);
      });
  });

const sessionTestingRequest = () => ({ type: types.SESSION_TESTING_REQUEST });
const sessionTestingSuccess = (response) => ({
  type: types.SESSION_TESTING_SUCCESS,
  payload: response,
});
const sessionTestingFailure = (error) => ({
  type: types.SESSION_TESTING_FAILURE,
  payload: error,
});
const sessionTesting = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(sessionTestingRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.session.testing,
        params: { id },
      })
      .then((response) => {
        dispatch(sessionTestingSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(sessionTestingFailure(error));
        reject(error.response.data);
      });
  });

const createAndUpdateResultRequest = () => ({
  type: types.CREATE_AND_UPDATE_RESULT_REQUEST,
});
const createAndUpdateResultSuccess = (response) => ({
  type: types.CREATE_AND_UPDATE_RESULT_SUCCESS,
  payload: response,
});
const createAndUpdateResultFailure = (error) => ({
  type: types.CREATE_AND_UPDATE_RESULT_FAILURE,
  payload: error,
});
const createAndUpdateResult = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createAndUpdateResultRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.session.createAndUpdateResult,
        data,
      })
      .then((response) => {
        dispatch(createAndUpdateResultSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error));
        dispatch(createAndUpdateResultFailure(error));
        reject(error.response.data);
      });
  });

export {
  selectExams,
  clearExams,
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  getPlateAutoFill,
  exportPlate,
  exportPlateResult,
  uploadPlateResult,
  getSessionDetail,
  updateSessionResult,
  sessionTesting,
  createAndUpdateResult,
};
