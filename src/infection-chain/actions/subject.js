import { toast } from 'react-toastify';
import moment from 'moment';

import store from 'app/store';
import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';
import types from './types';

const getSubjectRequest = () => ({ type: types.GET_SUBJECT_REQUEST });
const getSubjectSuccess = (response) => ({
  type: types.GET_SUBJECT_SUCCESS,
  payload: response,
});
const getSubjectFailure = () => ({ type: types.GET_SUBJECT_FAILURE });

const getSubject = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getSubjectRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.subject + id,
      })
      .then((response) => {
        dispatch(getSubjectSuccess(response.data));
        resolve(response.data);
      })
      .catch(() => {
        dispatch(getSubjectFailure());
        reject();
      });
  });

const searchSubjectRequest = () => ({ type: types.SEARCH_SUBJECT_REQUEST });
const searchSubjectSuccess = (response) => ({
  type: types.SEARCH_SUBJECT_SUCCESS,
  payload: response,
});
const searchSubjectFailure = (error) => ({
  type: types.SEARCH_SUBJECT_FAILURE,
  payload: error,
});

const searchSubject = (subjectName) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(searchSubjectRequest());
    httpClient
      .callApi({
        url: apiLinks.subjects.search,
        params: {
          subjectName,
          pageSize: 10,
          pageIndex: 0,
        },
      })
      .then((response) => {
        dispatch(searchSubjectSuccess(response.data.data));
        resolve(response.data.data);
      })
      .catch(() => {
        dispatch(searchSubjectFailure());
        reject();
      });
  });

const getSubjectDetail = (id) => () =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        url: `${apiLinks.subjects.get}/${id}`,
        // url: apiLinks.subject + id,
      })
      .then(({ data: { profile } }) => {
        resolve(profile);
      })
      .catch(reject);
  });

const getSubjectsRequest = () => ({ type: types.GET_SUBJECTS_REQUEST });
const getSubjectsSuccess = (response) => ({
  type: types.GET_SUBJECTS_SUCCESS,
  payload: response,
});
const getSubjectsFailure = (error) => ({
  type: types.GET_SUBJECTS_FAILURE,
  payload: error,
});

const getSubjects =
  ({
    name = '',
    provinceValue = '',
    districtValue = '',
    wardValue = '',
    streetHouseNumber = '',
    fromTime = '',
    toTime = '',
    cccd,
    cmnd,
    passportNumber,
    phoneNumber,
    infectionTypeIds = [],
    pageIndex = 0,
    pageSize = 10,
    isUnverified = false,
  }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getSubjectsRequest());
      httpClient
        .callApi({
          url: `${apiLinks.infectionChain.subjects.getPersonels}${
            !isUnverified
              ? `?${(infectionTypeIds.length === 0
                  ? store
                      .getState()
                      .general.infectionTypeData.data.map((it) => it.id)
                  : infectionTypeIds
                )
                  .map((t) => `infectionTypeIds=${t}`)
                  .join('&')}`
              : ''
          }`,
          params: {
            name,
            cccd,
            cmnd,
            passportNumber,
            phoneNumber,
            provinceValue,
            districtValue,
            wardValue,
            streetHouseNumber,
            pageIndex,
            pageSize,
            fromTime,
            toTime,
          },
        })
        .then((response) => {
          dispatch(getSubjectsSuccess(response.data));
          resolve();
        })
        .catch((error) => {
          dispatch(getSubjectsFailure(error));
          reject();
        });
    });

const createSubjectRequest = () => ({ type: types.CREATE_SUBJECT_REQUEST });
const createSubjectSuccess = (response) => ({
  type: types.CREATE_SUBJECT_SUCCESS,
  payload: response,
});
const createSubjectFailure = (error) => ({
  type: types.CREATE_SUBJECT_FAILURE,
  payload: error,
});

const createSubject = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createSubjectRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.subjects.create,
        data,
      })
      .then((response) => {
        dispatch(createSubjectSuccess(response.data.profileId));
        resolve(response.data.profileId);
        toast.success('Thành công', { toastId: 'contact' });
      })
      .catch(() => {
        dispatch(createSubjectFailure());
        reject();
      });
  });

const updateSubjectRequest = () => ({ type: types.UPDATE_SUBJECT_REQUEST });
const updateSubjectSuccess = (response) => ({
  type: types.UPDATE_SUBJECT_SUCCESS,
  payload: response,
});
const updateSubjectFailure = (error) => ({
  type: types.UPDATE_SUBJECT_FAILURE,
  payload: error,
});

const updateSubject = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateSubjectRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.subject,
        data,
      })
      .then((response) => {
        dispatch(updateSubjectSuccess(response.data));
        toast.success('Thành công', { toastId: data.id });
        resolve();
      })
      .catch(() => {
        dispatch(updateSubjectFailure());
        reject();
      });
  });

const verifySubjectRequest = () => ({ type: types.VERIFY_SUBJECT_REQUEST });
const verifySubjectSuccess = (response) => ({
  type: types.VERIFY_SUBJECT_SUCCESS,
  payload: response,
});
const verifySubjectFailure = (error) => ({
  type: types.VERIFY_SUBJECT_FAILURE,
  payload: error,
});

const verifySubject = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(verifySubjectRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.verifySubject,
        data: {
          id: data.id,
        },
      })
      .then((response) => {
        dispatch(verifySubjectSuccess(response.data));
        toast.success('Thành công', { toastId: data.id });
        resolve();
      })
      .catch(() => {
        dispatch(verifySubjectFailure());
        reject();
      });
  });

const processSubjectRequest = () => ({ type: types.PROCESS_SUBJECT_REQUEST });
const processSubjectSuccess = (response) => ({
  type: types.PROCESS_SUBJECT_SUCCESS,
  payload: response,
});
const processSubjectFailure = () => ({ type: types.PROCESS_SUBJECT_FAILURE });

const processSubject = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(processSubjectRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.processSubject,
        data,
      })
      .then((response) => {
        dispatch(processSubjectSuccess(response.data));
        toast.success('Thành công', { toastId: 'contact' });
        resolve();
      })
      .catch(() => {
        dispatch(processSubjectFailure());
        reject();
      });
  });

const deleteSubjectRequest = () => ({ type: types.DELETE_SUBJECT_REQUEST });
const deleteSubjectSuccess = (response) => ({
  type: types.DELETE_SUBJECT_SUCCESS,
  payload: response,
});
const deleteSubjectFailure = (error) => ({
  type: types.DELETE_SUBJECT_FAILURE,
  payload: error,
});

const deleteSubject = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteSubjectRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.subject + id,
      })
      .then((response) => {
        dispatch(deleteSubjectSuccess(response.data));
        toast.success('Thành công');
        resolve();
      })
      .catch(() => {
        dispatch(deleteSubjectFailure());
        reject();
      });
  });

const exportUnTypedRequest = () => ({ type: types.EXPORT_SUBJECTS_REQUEST });
const exportUnTypedSuccess = (response) => ({
  type: types.EXPORT_SUBJECTS_SUCCESS,
  payload: response,
});
const exportUnTypedFailure = (error) => ({
  type: types.EXPORT_SUBJECTS_FAILURE,
  payload: error,
});

const exportUnTyped =
  ({
    name = '',
    provinceValue = '',
    districtValue = '',
    wardValue = '',
    streetHouseNumber = '',
    subjectTypes = [null, 0, 1, 2, 3],
    isVerified,
    isAskingCompleted,
    hasFromSubjectAskingResult,
  }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(exportUnTypedRequest());
      httpClient
        .callApi({
          responseType: 'blob',
          url: apiLinks.exportUnTyped,
          params: {
            name,
            provinceValue,
            districtValue,
            wardValue,
            streetHouseNumber,
            isVerified,
            IsAskingCompleted: isAskingCompleted,
            hasFromSubjectAskingResult,
            hasUnTypedSubjects: subjectTypes.includes(null),
          },
        })
        .then((response) => {
          dispatch(exportUnTypedSuccess(response.data));
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            `Danh sách F?-${moment().format('DD-MM-YYYY')}.xlsx`,
          );
          document.body.appendChild(link);
          link.click();
          resolve();
        })
        .catch(() => {
          dispatch(exportUnTypedFailure());
          reject();
        });
    });

const exportSubjectListRequest = () => ({
  type: types.EXPORT_SUBJECTS_REQUEST,
});
const exportSubjectListSuccess = (response) => ({
  type: types.EXPORT_SUBJECTS_SUCCESS,
  payload: response,
});
const exportSubjectListFailure = (error) => ({
  type: types.EXPORT_SUBJECTS_FAILURE,
  payload: error,
});

const exportSubjectList = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(exportSubjectListRequest());
    httpClient
      .callApi({
        responseType: 'blob',
        url: apiLinks.infectionChain.subjects.exportSubjects,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(exportSubjectListSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Danh sách đối tượng.xlsx');
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch(() => {
        dispatch(exportSubjectListFailure());
        reject();
      });
  });

const getContactsRequest = (isSubjectFrom) => ({
  type: types.GET_CONTACTS_REQUEST,
  payload: isSubjectFrom,
});
const getContactsSuccess = (response, isSubjectFrom) => ({
  type: types.GET_CONTACTS_SUCCESS,
  payload: { response, isSubjectFrom },
});
const getContactsFailure = (error) => ({
  type: types.GET_CONTACTS_FAILURE,
  payload: error,
});

const getContacts =
  ({ subjectId, isSubjectFrom = true, pageSize = 10, pageIndex = 0 }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      if (subjectId) {
        dispatch(getContactsRequest(isSubjectFrom));
        httpClient
          .callApi({
            method: 'GET',
            url: apiLinks.subjectContact(subjectId),
            params: {
              isSubjectFrom,
              pageSize,
              pageIndex,
            },
          })
          .then((response) => {
            dispatch(getContactsSuccess(response.data, isSubjectFrom));
            resolve(response.data);
          })
          .catch(() => {
            dispatch(getContactsFailure());
            reject();
          });
      } else {
        getContactsSuccess([], isSubjectFrom);
      }
    });

const createContactRequest = () => ({ type: types.CREATE_CONTACT_REQUEST });
const createContactSuccess = (response) => ({
  type: types.CREATE_CONTACT_SUCCESS,
  payload: response,
});
const createContactFailure = (error) => ({
  type: types.CREATE_CONTACT_FAILURE,
  payload: error,
});

const createContact = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createContactRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.contact,
        data,
      })
      .then((response) => {
        dispatch(createContactSuccess(response.data));
        toast.success('Thành công', { toastId: 'contact' });
        resolve(response.data);
      })
      .catch(() => {
        dispatch(createContactFailure());
        reject();
      });
  });

const updateContactRequest = () => ({ type: types.UPDATE_CONTACT_REQUEST });
const updateContactSuccess = (response) => ({
  type: types.UPDATE_CONTACT_SUCCESS,
  payload: response,
});
const updateContactFailure = (error) => ({
  type: types.UPDATE_CONTACT_FAILURE,
  payload: error,
});

const updateContact = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateContactRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.contact,
        data,
      })
      .then((response) => {
        dispatch(updateContactSuccess(response.data));
        toast.success('Thành công', { toastId: 'contact' });
        resolve();
      })
      .catch(() => {
        dispatch(updateContactFailure());
        reject();
      });
  });

const deleteContactRequest = () => ({ type: types.DELETE_CONTACT_REQUEST });
const deleteContactSuccess = (response) => ({
  type: types.DELETE_CONTACT_SUCCESS,
  payload: response,
});
const deleteContactFailure = (error) => ({
  type: types.DELETE_CONTACT_FAILURE,
  payload: error,
});

const deleteContact = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteContactRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.contact + id,
      })
      .then((response) => {
        dispatch(deleteContactSuccess(response.data));
        toast.success('Thành công');
        resolve();
      })
      .catch(() => {
        dispatch(deleteContactFailure());
        reject();
      });
  });

const getContactLocationsRequest = () => ({
  type: types.GET_CONTACT_LOCATIONS_REQUEST,
});
const getContactLocationsSuccess = (response) => ({
  type: types.GET_CONTACT_LOCATIONS_SUCCESS,
  payload: response,
});
const getContactLocationsFailure = (error) => ({
  type: types.GET_CONTACT_LOCATIONS_FAILURE,
  payload: error,
});

const getContactLocations = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getContactLocationsRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.contactLocation + id,
      })
      .then((response) => {
        dispatch(getContactLocationsSuccess(response.data));
        resolve(response.data);
      })
      .catch(() => {
        dispatch(getContactLocationsFailure());
        reject();
      });
  });

const createContactLocationRequest = () => ({
  type: types.CREATE_CONTACT_LOCATION_REQUEST,
});
const createContactLocationSuccess = (response) => ({
  type: types.CREATE_CONTACT_LOCATION_SUCCESS,
  payload: response,
});
const createContactLocationFailure = (error) => ({
  type: types.CREATE_CONTACT_LOCATION_FAILURE,
  payload: error,
});

const createContactLocation = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createContactLocationRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.contactLocation,
        data,
      })
      .then((response) => {
        dispatch(createContactLocationSuccess(response.data));
        toast.success('Thành công');
        resolve(response.data);
      })
      .catch(() => {
        dispatch(createContactLocationFailure());
        reject();
      });
  });

const updateContactLocationRequest = () => ({
  type: types.UPDATE_CONTACT_LOCATION_REQUEST,
});
const updateContactLocationSuccess = (response) => ({
  type: types.UPDATE_CONTACT_LOCATION_SUCCESS,
  payload: response,
});
const updateContactLocationFailure = (error) => ({
  type: types.UPDATE_CONTACT_LOCATION_FAILURE,
  payload: error,
});

const updateContactLocation = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateContactLocationRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.contactLocation,
        data,
      })
      .then((response) => {
        dispatch(updateContactLocationSuccess(response.data));
        toast.success('Thành công');
        resolve();
      })
      .catch(() => {
        dispatch(updateContactLocationFailure());
        reject();
      });
  });

const deleteContactLocationRequest = () => ({
  type: types.DELETE_CONTACT_LOCATION_REQUEST,
});
const deleteContactLocationSuccess = (response) => ({
  type: types.DELETE_CONTACT_LOCATION_SUCCESS,
  payload: response,
});
const deleteContactLocationFailure = (error) => ({
  type: types.DELETE_CONTACT_LOCATION_FAILURE,
  payload: error,
});

const deleteContactLocation = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteContactLocationRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.contactLocation + id,
      })
      .then((response) => {
        dispatch(deleteContactLocationSuccess(response.data));
        toast.success('Thành công');
        resolve();
      })
      .catch(() => {
        dispatch(deleteContactLocationFailure());
        reject();
      });
  });

const getSymptomsRequest = () => ({ type: types.GET_SYMPTOMS_REQUEST });
const getSymptomsSuccess = (response) => ({
  type: types.GET_SYMPTOMS_SUCCESS,
  payload: response,
});
const getSymptomsFailure = (error) => ({
  type: types.GET_SYMPTOMS_FAILURE,
  payload: error,
});

const getSymptoms = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getSymptomsRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.getSymptoms,
      })
      .then(({ data: { data } }) => {
        dispatch(getSymptomsSuccess(data));
        resolve();
      })
      .catch(() => {
        dispatch(getSymptomsFailure());
        reject();
      });
  });

const createSymptomRequest = () => ({ type: types.CREATE_SYMPTOM_REQUEST });
const createSymptomSuccess = (response) => ({
  type: types.CREATE_SYMPTOM_SUCCESS,
  payload: response,
});
const createSymptomFailure = (error) => ({
  type: types.CREATE_SYMPTOM_FAILURE,
  payload: error,
});

const createSymptom = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createSymptomRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.symptoms,
        data,
      })
      .then((response) => {
        dispatch(createSymptomSuccess(response.data));
        resolve(response.data);
      })
      .catch(() => {
        dispatch(createSymptomFailure());
        reject();
      });
  });

const getUnderlyingDiseasesRequest = () => ({
  type: types.GET_UNDERLYING_DISEASES_REQUEST,
});
const getUnderlyingDiseasesSuccess = (response) => ({
  type: types.GET_UNDERLYING_DISEASES_SUCCESS,
  payload: response,
});
const getUnderlyingDiseasesFailure = (error) => ({
  type: types.GET_UNDERLYING_DISEASES_FAILURE,
  payload: error,
});

const getUnderlyingDiseases = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getUnderlyingDiseasesRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.getDiseases,
      })
      .then(({ data: { data } }) => {
        dispatch(getUnderlyingDiseasesSuccess(data));
        resolve();
      })
      .catch(() => {
        dispatch(getUnderlyingDiseasesFailure());
        reject();
      });
  });

const getReportRequest = () => ({ type: types.GET_REPORT_REQUEST });
const getReportSuccess = (response) => ({
  type: types.GET_REPORT_SUCCESS,
  payload: response,
});
const getReportFailure = (error) => ({
  type: types.GET_REPORT_FAILURE,
  payload: error,
});

const getReport = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getReportRequest());
    httpClient
      .callApi({
        url: `${apiLinks.subject + id}/Report`,
      })
      .then((response) => {
        dispatch(getReportSuccess(response.data));
        resolve();
      })
      .catch(() => {
        dispatch(getReportFailure());
        reject();
      });
  });

const getSummaryReportsRequest = () => ({
  type: types.GET_SUMMARY_REPORTS_REQUEST,
});
const getSummaryReportsSuccess = (response) => ({
  type: types.GET_SUMMARY_REPORTS_SUCCESS,
  payload: response,
});
const getSummaryReportsFailure = (error) => ({
  type: types.GET_SUMMARY_REPORTS_FAILURE,
  payload: error,
});

const getSummaryReports =
  ({ pageIndex = 0, pageSize = 10 }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getSummaryReportsRequest());
      httpClient
        .callApi({
          url: `${apiLinks.subject}Report/Excel/Data`,
          params: {
            pageIndex,
            pageSize,
          },
        })
        .then((response) => {
          dispatch(getSummaryReportsSuccess(response.data));
          resolve();
        })
        .catch(() => {
          dispatch(getSummaryReportsFailure());
          reject();
        });
    });

const createUnderlyingDiseaseRequest = () => ({
  type: types.CREATE_UNDERLYING_DISEASE_REQUEST,
});
const createUnderlyingDiseaseSuccess = (response) => ({
  type: types.CREATE_UNDERLYING_DISEASE_SUCCESS,
  payload: response,
});
const createUnderlyingDiseaseFailure = (error) => ({
  type: types.CREATE_UNDERLYING_DISEASE_FAILURE,
  payload: error,
});

const createUnderlyingDisease = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createUnderlyingDiseaseRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.disease,
        data,
      })
      .then((response) => {
        dispatch(createUnderlyingDiseaseSuccess(response.data));
        resolve(response.data);
      })
      .catch(() => {
        dispatch(createUnderlyingDiseaseFailure());
        reject();
      });
  });

const uploadSubjectFileRequest = () => ({
  type: types.UPLOAD_SUBJECT_FILE_REQUEST,
});
const uploadSubjectFileSuccess = (response) => ({
  type: types.UPLOAD_SUBJECT_FILE_SUCCESS,
  payload: response,
});
const uploadSubjectFileFailure = (error) => ({
  type: types.UPLOAD_SUBJECT_FILE_FAILURE,
  payload: error,
});
const setUploadSubjectProgress = (progress) => ({
  type: types.SET_UPLOAD_SUBJECT_FILE_PROGRESS,
  payload: progress,
});

const uploadSubjectFile = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(uploadSubjectFileRequest());
    dispatch(setUploadSubjectProgress(0));
    httpClient
      .callApi({
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        url: apiLinks.importSubjectExcel,
        data,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          dispatch(setUploadSubjectProgress(percentCompleted));
        },
      })
      .then((response) => {
        dispatch(uploadSubjectFileSuccess(response.data));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        dispatch(uploadSubjectFileFailure(error));
        reject();
      });
  });

const getSubjectRelatedRequest = () => ({
  type: types.GET_SUBJECT_RELATED_REQUEST,
});
const getSubjectRelatedSuccess = (response) => ({
  type: types.GET_SUBJECT_RELATED_SUCCESS,
  payload: response,
});
const getSubjectRelatedFailure = (error) => ({
  type: types.GET_SUBJECT_RELATED_FAILURE,
  payload: error,
});

const getSubjectRelated = (profileId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getSubjectRelatedRequest());
    httpClient
      .callApi({
        url: apiLinks.subject + profileId,
        params: {
          byProfile: true,
        },
      })
      .then((response) => {
        dispatch(getSubjectRelatedSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getSubjectRelatedFailure(error));
        reject();
      });
  });

const selectF0OnCreatingProfile = (profileId) => ({
  type: types.SELECT_F0_ON_CREATING_PROFILE,
  payload: profileId,
});
const resetSubjectRelated = () => ({ type: types.RESET_SUBJECT_RELATED });
const selectSubjectOnCreatingProfile = (profileId, isF0) => ({
  type: types.SELECT_F0_ON_CREATING_PROFILE,
  payload: { profileId, isF0 },
});

export {
  getSubject,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  verifySubject,
  processSubject,
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getContactLocations,
  createContactLocation,
  updateContactLocation,
  deleteContactLocation,
  getSymptoms,
  createSymptom,
  getReport,
  getSummaryReports,
  getUnderlyingDiseases,
  createUnderlyingDisease,
  uploadSubjectFile,
  getSubjectRelated,
  getSubjectDetail,
  searchSubject,
  exportUnTyped,
  selectF0OnCreatingProfile,
  resetSubjectRelated,
  selectSubjectOnCreatingProfile,
  exportSubjectList,
};
