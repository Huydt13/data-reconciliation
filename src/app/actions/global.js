import { toast } from 'react-toastify';

import {
  formatToDate,
  getExaminationError,
  getQuarantineError,
} from 'app/utils/helpers';
import httpClient from 'app/utils/http-client';

import types, {
  SHOW_CONFIRM_MODAL,
  SHOW_FORWARD_MODAL,
  SHOW_INFO_MODAL,
  SHOW_ERROR_MODAL,
  TRIGGER_SIDEBAR_OPEN,
  TRIGGER_TREE_FOLDER_OPEN,
} from './types';

const triggerSidebarOpen = () => ({ type: TRIGGER_SIDEBAR_OPEN });
const showConfirmModal = (message, confirmCallback) => ({
  type: SHOW_CONFIRM_MODAL,
  payload: { message, confirmCallback },
});
const showInfoModal = (header, content, infoCallback) => ({
  type: SHOW_INFO_MODAL,
  payload: { header, content, infoCallback },
});
const showErrorModal = (header, successList, failLogs) => ({
  type: SHOW_ERROR_MODAL,
  payload: { header, successList, failLogs },
});
const showForwardModal = (message, confirmCallback) => ({
  type: SHOW_FORWARD_MODAL,
  payload: { message, confirmCallback },
});
const triggerTreeFolderOpen = () => ({
  type: TRIGGER_TREE_FOLDER_OPEN,
});

const importRequest = () => ({
  type: types.IMPORT_REQUEST,
});
const importSuccess = (response) => ({
  type: types.IMPORT_SUCCESS,
  payload: response,
});
const importFailure = (error) => ({
  type: types.IMPORT_FAILURE,
  payload: error,
});
const importExcel =
  ({ method = 'PUT', url, formData, params, isExamination, isQuarantine }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(importRequest());
      httpClient
        .callApi({
          method,
          contentType: 'application/x-www-form-urlencoded',
          url,
          data: formData,
          params,
        })
        .then((response) => {
          if (isExamination) {
            if (response.data?.failed.length > 0) {
              dispatch(
                showErrorModal(
                  'Import logs',
                  response.data?.completed ?? [],
                  response.data?.failed ?? [],
                ),
              );
            }
          }
          dispatch(importSuccess(response.data));
          resolve(response.data);
        })
        .catch((error) => {
          if (isExamination) {
            toast.warn(getExaminationError(error.response?.data));
          }
          if (isQuarantine) {
            toast.warn(getQuarantineError(error.response?.data));
          } else {
            toast.warn('Import không thành công');
          }
          dispatch(importFailure(error));
          reject();
        });
    });

const exportRequest = () => ({
  type: types.EXPORT_REQUEST,
});
const exportSuccess = (response) => ({
  type: types.EXPORT_SUCCESS,
  payload: response,
});
const exportFailure = (error) => ({
  type: types.EXPORT_FAILURE,
  payload: error,
});
const exportExcel =
  ({ method, url, data, params, fileName = '', isExamination, isQuarantine }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(exportRequest());
      httpClient
        .callApi({
          method,
          responseType: 'blob',
          url,
          data,
          params,
        })
        .then((response) => {
          dispatch(exportSuccess(response.data));
          const tempUrl = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = tempUrl;
          link.setAttribute(
            'download',
            `${fileName} ${formatToDate(new Date())}.xlsx`,
          );
          document.body.appendChild(link);
          link.click();
          resolve(response.data);
        })
        .catch((error) => {
          if (isExamination) {
            toast.warn(getExaminationError(error.response?.data));
          }
          if (isQuarantine) {
            toast.warn(getQuarantineError(error.response?.data));
          } else {
            toast.warn('Export không thành công');
          }
          dispatch(exportFailure(error));
          reject();
        });
    });

export {
  showConfirmModal,
  showInfoModal,
  showForwardModal,
  showErrorModal,
  triggerSidebarOpen,
  triggerTreeFolderOpen,
  importExcel,
  exportExcel,
};
