import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { getExaminationError } from 'app/utils/helpers';
import types from './types';

const clearExaminationsExcel = () => ({ type: types.CLEAR_EXAMINATIONS_EXCEL });

const getTransportsRequest = () => ({ type: types.GET_TRANSPORTS_REQUEST });
const getTransportsSuccess = (response) => ({
  type: types.GET_TRANSPORTS_SUCCESS,
  payload: response,
});
const getTransportsFailure = (error) => ({
  type: types.GET_TRANSPORTS_FAILURE,
  payload: error,
});

const getTransports =
  ({
    pageIndex = 0,
    pageSize = 10,
    searchValue = '',
    from = '',
    to = '',
    fromReceive = '',
    toReceive = '',
    fromUnitId = '',
    toUnitId = '',
    transportStatus = '',
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getTransportsRequest());
        httpClient
          .callApi({
            url: apiLinks.transport.get,
            params: {
              pageIndex,
              pageSize,
              searchValue,
              from,
              to,
              fromReceive,
              toReceive,
              fromUnitId,
              toUnitId,
              transportStatus,
            },
          })
          .then((response) => {
            dispatch(getTransportsSuccess(response.data));
            resolve(response.data);
          })
          .catch((error) => {
            dispatch(getTransportsFailure(error));
            reject();
          });
      });

const getTransportDetailRequest = () => ({
  type: types.GET_TRANSPORT_DETAIL_REQUEST,
});
const getTransportDetailSuccess = (response) => ({
  type: types.GET_TRANSPORT_DETAIL_SUCCESS,
  payload: response,
});
const getTransportDetailFailure = (error) => ({
  type: types.GET_TRANSPORT_DETAIL_FAILURE,
  payload: error,
});

const getTransportDetail = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getTransportDetailRequest());
    httpClient
      .callApi({
        url: `${apiLinks.transport.get}/${id}`,
      })
      .then((response) => {
        dispatch(getTransportDetailSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getTransportDetailFailure(error));
        reject();
      });
  });

const createTransportRequest = () => ({ type: types.CREATE_TRANSPORT_REQUEST });
const createTransportSuccess = (response) => ({
  type: types.CREATE_TRANSPORT_SUCCESS,
  payload: response,
});
const createTransportFailure = (error) => ({
  type: types.CREATE_TRANSPORT_FAILURE,
  payload: error,
});

const createTransport = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createTransportRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.transport.create,
        data,
      })
      .then((response) => {
        toast.success('Tạo thành công');
        dispatch(createTransportSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(createTransportFailure(error));
        reject();
      });
  });

const updateTransportRequest = () => ({ type: types.UPDATE_TRANSPORT_REQUEST });
const updateTransportSuccess = (response) => ({
  type: types.UPDATE_TRANSPORT_SUCCESS,
  payload: response,
});
const updateTransportFailure = (error) => ({
  type: types.UPDATE_TRANSPORT_FAILURE,
  payload: error,
});

const updateTransport = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateTransportRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.transport.update,
        data,
      })
      .then((response) => {
        toast.success('Cập nhật thành công');
        dispatch(updateTransportSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateTransportFailure(error));
        reject();
      });
  });

const rejectSentTransport = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateTransportRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.transport.rejectSent,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(updateTransportSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data?.errorMessage));
        dispatch(updateTransportFailure(error));
        reject();
      });
  });

const rejectReceivedTransport = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateTransportRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.transport.rejectReceived,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(updateTransportSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateTransportFailure(error));
        reject();
      });
  });

const deleteTransportRequest = () => ({ type: types.DELETE_TRANSPORT_REQUEST });
const deleteTransportSuccess = (response) => ({
  type: types.DELETE_TRANSPORT_SUCCESS,
  payload: response,
});
const deleteTransportFailure = (error) => ({
  type: types.DELETE_TRANSPORT_FAILURE,
  payload: error,
});

const deleteTransport = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteTransportRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.transport.delete,
        params: { id },
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(deleteTransportSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(deleteTransportFailure(error));
        reject();
      });
  });

const sendTransportRequest = () => ({ type: types.SEND_TRANSPORT_REQUEST });
const sendTransportSuccess = (response) => ({
  type: types.SEND_TRANSPORT_SUCCESS,
  payload: response,
});
const sendTransportFailure = (error) => ({
  type: types.SEND_TRANSPORT_FAILURE,
  payload: error,
});

const sendTransport = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(sendTransportRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.transport.send,
        data,
      })
      .then((response) => {
        toast.success('Chuyển thành công');
        dispatch(sendTransportSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(sendTransportFailure(error));
        reject();
      });
  });

const receiveTransportRequest = () => ({
  type: types.RECEIVE_TRANSPORT_REQUEST,
});
const receiveTransportSuccess = (response) => ({
  type: types.RECEIVE_TRANSPORT_SUCCESS,
  payload: response,
});
const receiveTransportFailure = (error) => ({
  type: types.RECEIVE_TRANSPORT_FAILURE,
  payload: error,
});

const receiveTransport = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(receiveTransportRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.transport.receive,
        data,
      })
      .then((response) => {
        toast.success('Nhận thành công');
        dispatch(receiveTransportSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        // toast.error(error.response.data);
        dispatch(receiveTransportFailure(error));
        reject();
      });
  });

const getUnitsAvailableRequest = () => ({
  type: types.GET_UNITS_AVAILABLE_REQUEST,
});
const getUnitsAvailableSuccess = (response) => ({
  type: types.GET_UNITS_AVAILABLE_SUCCESS,
  payload: response,
});
const getUnitsAvailableFailure = (error) => ({
  type: types.GET_UNITS_AVAILABLE_FAILURE,
  payload: error,
});

const getUnitsAvailable = (date) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getUnitsAvailableRequest());
    httpClient
      .callApi({
        url: apiLinks.transport.getUnitAvailable,
        params: { date },
      })
      .then((response) => {
        dispatch(getUnitsAvailableSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getUnitsAvailableFailure(error));
        reject();
      });
  });

const uploadTransportFileRequest = () => ({
  type: types.UPLOAD_TRANSPORT_FILE_REQUEST,
});
const uploadTransportFileSuccess = (response) => ({
  type: types.UPLOAD_TRANSPORT_FILE_SUCCESS,
  payload: response,
});
const uploadTransportFileFailure = (error) => ({
  type: types.UPLOAD_TRANSPORT_FILE_FAILURE,
  payload: error,
});
const setUploadTransportProgress = (progress) => ({
  type: types.SET_UPLOAD_TRANSPORT_FILE_PROGRESS,
  payload: progress,
});

const uploadTransportFile = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(uploadTransportFileRequest());
    httpClient
      .callApi({
        method: 'PUT',
        contentType: 'application/x-www-form-urlencoded',
        url: apiLinks.transport.importExcel,
        data,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          dispatch(setUploadTransportProgress(percentCompleted));
        },
      })
      .then((response) => {
        dispatch(uploadTransportFileSuccess(response.data));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(uploadTransportFileFailure(error));
        reject();
      });
  });

const uploadTransportExcelRequest = () => ({
  type: types.UPLOAD_TRANSPORT_EXCEL_REQUEST,
});
const uploadTransportExcelSuccess = (response) => ({
  type: types.UPLOAD_TRANSPORT_EXCEL_SUCCESS,
  payload: response,
});
const uploadTransportExcelFailure = (error) => ({
  type: types.UPLOAD_TRANSPORT_EXCEL_FAILURE,
  payload: error,
});

const uploadTransportExcel = (data, importantValue) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(uploadTransportExcelRequest());
    httpClient
      .callApi({
        method: 'PUT',
        contentType: 'application/x-www-form-urlencoded',
        url: apiLinks.transport.uploadTransportExcel,
        data,
        params: { importantValue },
      })
      .then((response) => {
        dispatch(uploadTransportExcelSuccess(response.data));
        const result = response.data;
        if (result.length === 0) {
          toast.warn('Không tìm thấy mẫu phù hợp, vui lòng chọn file khác');
        }
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(uploadTransportExcelFailure(error));
        reject();
      });
  });

const exportTransportFileRequest = () => ({
  type: types.EXPORT_TRANSPORT_FILE_REQUEST,
});
const exportTransportFileSuccess = (response) => ({
  type: types.EXPORT_TRANSPORT_FILE_SUCCESS,
  payload: response,
});
const exportTransportFileFailure = (error) => ({
  type: types.EXPORT_TRANSPORT_FILE_FAILURE,
  payload: error,
});

const exportTransportFile = (transportId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(exportTransportFileRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.transport.exportExcel,
        responseType: 'blob',
        params: {
          transportId,
        },
      })
      .then((response) => {
        dispatch(exportTransportFileSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'transport.xlsx');
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(exportTransportFileFailure(error));
        reject();
      });
  });

const getAvailableExamForTransportRequest = () => ({
  type: types.GET_AVAILABLE_EXAM_FOR_TRANSPORT_REQUEST,
});
const getAvailableExamForTransportSuccess = (response) => ({
  type: types.GET_AVAILABLE_EXAM_FOR_TRANSPORT_SUCCESS,
  payload: response,
});
const getAvailableExamForTransportFailure = (error) => ({
  type: types.GET_AVAILABLE_EXAM_FOR_TRANSPORT_FAILURE,
  payload: error,
});

const getAvailableExamForTransport = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAvailableExamForTransportRequest());
    httpClient
      .callApi({
        url: apiLinks.examination.getAvailableExamForTransport,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(getAvailableExamForTransportSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(getAvailableExamForTransportFailure(error));
        reject();
      });
  });
const getTransportByIdRequest = () => ({
  type: types.GET_TRANSPORT_BY_ID_REQUEST,
});
const getTransportByIdSuccess = (response) => ({
  type: types.GET_TRANSPORT_BY_ID_SUCCESS,
  payload: response,
});
const getTransportByIdFailure = (error) => ({
  type: types.GET_TRANSPORT_BY_ID_FAILURE,
  payload: error,
});

const getTransportById = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getTransportByIdRequest());
    httpClient
      .callApi({
        url: apiLinks.transport.getById + id,
      })
      .then((response) => {
        dispatch(getTransportByIdSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(getTransportByIdFailure(error));
        reject();
      });
  });

const quickReceiveRequest = () => ({
  type: types.QUICK_RECEIVE_TRANSPORT_REQUEST,
});
const quickReceiveSuccess = (response) => ({
  type: types.QUICK_RECEIVE_TRANSPORT_SUCCESS,
  payload: response,
});
const quickReceiveFailure = (error) => ({
  type: types.QUICK_RECEIVE_TRANSPORT_FAILURE,
  payload: error,
});

const quickReceive = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(quickReceiveRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.transport.quickReceive,
        data,
      })
      .then((response) => {
        dispatch(quickReceiveSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(quickReceiveFailure(error));
        toast.warn(getExaminationError(error.response?.data));
        reject();
      });
  });

const createPcrExaminationRequest = () => ({
  type: types.CREATE_PCR_EXAMINATION_REQUEST,
});
const createPcrExaminationSuccess = (response) => ({
  type: types.CREATE_PCR_EXAMINATION_SUCCESS,
  payload: response,
});
const createPcrExaminationFailure = (error) => ({
  type: types.CREATE_PCR_EXAMINATION_FAILURE,
  payload: error,
});
const createPcrExamination = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createPcrExaminationRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.importPcrExamination.create,
        data,
      })
      .then((response) => {
        // toast.success('Tạo mẫu thành công');
        dispatch(createPcrExaminationSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        // toast.warn(error?.response?.data ?? '');
        dispatch(createPcrExaminationFailure(error));
        reject(error);
      });
  });

export {
  clearExaminationsExcel,
  getTransports,
  getTransportDetail,
  createTransport,
  updateTransport,
  deleteTransport,
  sendTransport,
  receiveTransport,
  getUnitsAvailable,
  setUploadTransportProgress,
  uploadTransportFile,
  uploadTransportExcel,
  exportTransportFile,
  rejectSentTransport,
  rejectReceivedTransport,
  getAvailableExamForTransport,
  getTransportById,
  quickReceive,
  createPcrExamination,
};
