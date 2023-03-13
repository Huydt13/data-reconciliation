import { toast } from 'react-toastify';
import moment from 'moment';

import store from 'app/store';
import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { getExaminationError } from 'app/utils/helpers';
import { QUICK_TEST_STATUSES } from 'medical-test/utils/constants';
import types from './types';

const setExaminationInputCache = (data) => ({
  type: types.SET_EXAMINATION_INPUT_CACHE,
  payload: data,
});

const selectMedicalTest = (t) => ({
  type: types.SELECT_MEDICAL_TEST,
  payload: t,
});

const toggleCreateModal = () => ({
  type: types.MEDICAL_TEST_TOGGLE_CREATE_MODAL,
});
const toggleEditModal = () => ({ type: types.TOGGLE_EDIT_MODAL });

const getUnitInfoRequest = () => ({ type: types.GET_UNIT_INFO_REQUEST });
const getUnitInfoSuccess = (response) => ({
  type: types.GET_UNIT_INFO_SUCCESS,
  payload: response,
});
const getUnitInfoFailure = (error) => ({
  type: types.GET_UNIT_INFO_FAILURE,
  payload: error,
});

const getUnitInfo = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getUnitInfoRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.unit.getInfo,
        // cancelToken: true,
      })
      .then((response) => {
        dispatch(getUnitInfoSuccess(response?.data ?? {}));
        resolve();
      })
      .catch((error) => {
        dispatch(getUnitInfoFailure(error));
        reject();
      });
  });

const getMedicalTestsRequest = () => ({
  type: types.GET_MEDICAL_TESTS_REQUEST,
});
const getMedicalTestsSuccess = (response) => ({
  type: types.GET_MEDICAL_TESTS_SUCCESS,
  payload: response,
});
const getMedicalTestsFailure = (error) => ({
  type: types.GET_MEDICAL_TESTS_FAILURE,
  payload: error,
});

const getMedicalTests =
  ({
    subjectName = '',
    subjectTypes = [0, 1, 2, 3],
    takeUnExaminedSubjects,
    takeOnlyPositiveSubjects,
    pageIndex = 0,
    pageSize = 10,
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getMedicalTestsRequest());
        httpClient
          .callApi({
            method: 'GET',
            url: `${apiLinks.medicalTestLatest}?${subjectTypes
              .map((t) => `types=${t}`)
              .join('&')}`,
            params: {
              subjectName,
              takeUnExaminedSubjects,
              takeOnlyPositiveSubjects,
              pageIndex,
              pageSize,
            },
          })
          .then((response) => {
            dispatch(getMedicalTestsSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getMedicalTestsFailure(error));
            reject();
          });
      });

const getMedicalTestRequest = () => ({ type: types.GET_MEDICAL_TEST_REQUEST });
const getMedicalTestSuccess = (response) => ({
  type: types.GET_MEDICAL_TEST_SUCCESS,
  payload: response,
});
const getMedicalTestFailure = (error) => ({
  type: types.GET_MEDICAL_TEST_FAILURE,
  payload: error,
});

const getMedicalTest =
  ({ subjectId, pageIndex = 0, pageSize = 10 }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getMedicalTestRequest());
        httpClient
          .callApi({
            method: 'GET',
            url: `${apiLinks.subjectMedicalTest(subjectId)}`,
            params: {
              pageIndex,
              pageSize,
            },
          })
          .then((response) => {
            dispatch(getMedicalTestSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getMedicalTestFailure(error));
            reject();
          });
      });

const createMedicalTestRequest = () => ({
  type: types.CREATE_MEDICAL_TEST_REQUEST,
});
const createMedicalTestSuccess = (response) => ({
  type: types.CREATE_MEDICAL_TEST_SUCCESS,
  payload: response,
});
const createMedicalTestFailure = (error) => ({
  type: types.CREATE_MEDICAL_TEST_FAILURE,
  payload: error,
});

const createMedicalTest = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createMedicalTestRequest());
    httpClient
      .callApi({
        method: 'POST',
        data,
        url: apiLinks.medicalTest,
      })
      .then((response) => {
        dispatch(createMedicalTestSuccess(response));
        toast.success('Thành công', { toastId: 'contact' });
        resolve();
      })
      .catch((error) => {
        toast.warn((error.response?.data));
        dispatch(createMedicalTestFailure(error));
        reject();
      });
  });

const getExaminationsRequest = () => ({ type: types.GET_EXAMINATIONS_REQUEST });
const getExaminationsSuccess = (response) => ({
  type: types.GET_EXAMINATIONS_SUCCESS,
  payload: response,
});
const getExaminationsFailure = (error) => ({
  type: types.GET_EXAMINATIONS_FAILURE,
  payload: error,
});

const getExaminations =
  ({ searchValue = '', pageSize = 10, pageIndex = 0 }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getExaminationsRequest());
        httpClient
          .callApi({
            url: apiLinks.examination.get,
            params: {
              searchValue,
              pageSize,
              pageIndex,
            },
          })
          .then((response) => {
            dispatch(getExaminationsSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getExaminationsFailure(error));
            reject();
          });
      });

const getExaminationByDetailRequest = () => ({
  type: types.GET_EXAMINATION_BY_DETAIL_REQUEST,
});
const getExaminationByDetailSuccess = (response) => ({
  type: types.GET_EXAMINATION_BY_DETAIL_SUCCESS,
  payload: response,
});
const getExaminationByDetailFailure = (error) => ({
  type: types.GET_EXAMINATION_BY_DETAIL_FAILURE,
  payload: error,
});

const getExaminationByDetail = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getExaminationByDetailRequest());
    httpClient
      .callApi({
        url: `${apiLinks.examination.get}/${id}`,
      })
      .then((response) => {
        dispatch(getExaminationByDetailSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getExaminationByDetailFailure(error));
        reject();
      });
  });

const getExaminationByPersonRequest = () => ({
  type: types.GET_EXAMINATION_BY_PERSON_REQUEST,
});
const getExaminationByPersonSuccess = (response) => ({
  type: types.GET_EXAMINATION_BY_PERSON_SUCCESS,
  payload: response,
});
const getExaminationByPersonFailure = (error) => ({
  type: types.GET_EXAMINATION_BY_PERSON_FAILURE,
  payload: error,
});

const getExaminationByPerson =
  ({ personId = '', pageIndex = 0, pageSize = 10 }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getExaminationByPersonRequest());
        httpClient
          .callApi({
            url: apiLinks.examination.getByPerson,
            params: {
              personId,
              pageSize,
              pageIndex,
            },
          })
          .then((response) => {
            dispatch(getExaminationByPersonSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getExaminationByPersonFailure(error));
            reject();
          });
      });

const getExaminationDetailsRequest = () => ({
  type: types.GET_EXAMINATION_DETAILS_REQUEST,
});
const getExaminationDetailsSuccess = (response) => ({
  type: types.GET_EXAMINATION_DETAILS_SUCCESS,
  payload: response,
});
const getExaminationDetailsFailure = (error) => ({
  type: types.GET_EXAMINATION_DETAILS_FAILURE,
  payload: error,
});

const getExaminationDetails =
  ({
    from = '',
    to = '',
    diseaseId = '',
    examTypeId = '',
    importantValue = 2,
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getExaminationDetailsRequest());
        httpClient
          .callApi({
            url: apiLinks.examination
              .getExaminationDetailsAvailableForTestSession,
            params: {
              from,
              to,
              diseaseId,
              examTypeId,
              importantValue,
            },
          })
          .then((response) => {
            dispatch(getExaminationDetailsSuccess(response.data.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getExaminationDetailsFailure(error));
            reject();
          });
      });

const getExaminationNormalDetailsRequest = () => ({
  type: types.GET_EXAMINATION_FOR_TRANSPORTS_NORMAL_REQUEST,
});
const getExaminationNormalDetailsSuccess = (response) => ({
  type: types.GET_EXAMINATION_FOR_TRANSPORTS_NORMAL_SUCCESS,
  payload: response,
});
const getExaminationNormalDetailsFailure = (error) => ({
  type: types.GET_EXAMINATION_FOR_TRANSPORTS_NORMAL_FAILURE,
  payload: error,
});

const getExaminationNormalDetails = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getExaminationNormalDetailsRequest());
    httpClient
      .callApi({
        url: apiLinks.examination.getNormalDetails,
      })
      .then((response) => {
        dispatch(getExaminationNormalDetailsSuccess(response.data.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getExaminationNormalDetailsFailure(error));
        reject();
      });
  });

const getExaminationUrgencyDetailsRequest = () => ({
  type: types.GET_EXAMINATION_FOR_TRANSPORTS_URGENCY_REQUEST,
});
const getExaminationUrgencyDetailsSuccess = (response) => ({
  type: types.GET_EXAMINATION_FOR_TRANSPORTS_URGENCY_SUCCESS,
  payload: response,
});
const getExaminationUrgencyDetailsFailure = (error) => ({
  type: types.GET_EXAMINATION_FOR_TRANSPORTS_URGENCY_FAILURE,
  payload: error,
});

const getExaminationUrgencyDetails = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getExaminationUrgencyDetailsRequest());
    httpClient
      .callApi({
        url: apiLinks.examination.getUrgencyDetails,
      })
      .then((response) => {
        dispatch(getExaminationUrgencyDetailsSuccess(response.data.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getExaminationUrgencyDetailsFailure(error));
        reject();
      });
  });

const getExaminationDetailRequest = () => ({
  type: types.GET_EXAMINATION_DETAIL_TEMPS_REQUEST,
});
const getExaminationDetailSuccess = (response) => ({
  type: types.GET_EXAMINATION_DETAIL_TEMPS_SUCCESS,
  payload: response,
});
const getExaminationDetailFailure = (error) => ({
  type: types.GET_EXAMINATION_DETAIL_TEMPS_FAILURE,
  payload: error,
});

const getExaminationDetail =
  ({
    apiV2 = false,
    unitTaken = '',
    unitTesting = '',
    unitTypeId = '',
    searchValue = '',
    from = '',
    to = '',
    diseaseId = '',
    examTypeId = '',
    importantValue = '',
    hasResult = '',
    resultType = '',
    resultDate = '',
    feeType = '',
    isGroup = '',
    pageSize = undefined,
    pageIndex = undefined,
    sampleFilterType = undefined,
    sampleSubFilter = undefined,
    samplingPlaceId = '',
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getExaminationDetailRequest());
        httpClient
          .callApi({
            url:
              apiV2
                ? apiLinks.examination.getExaminationDetailV2
                : apiLinks.examination.getExaminationDetail,
            params: {
              unitTaken,
              unitTesting,
              unitTypeId,
              searchValue,
              from,
              to,
              diseaseId,
              examTypeId,
              importantValue,
              hasResult,
              resultType,
              resultDate,
              feeType,
              isGroup,
              pageSize,
              pageIndex,
              sampleFilterType,
              sampleSubFilter,
              samplingPlaceId,
            },
          })
          .then((response) => {
            dispatch(getExaminationDetailSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getExaminationDetailFailure(error));
            reject();
          });
      });

const getPositiveExaminationDetailRequest = () => ({
  type: types.GET_POSITIVE_EXAMINATION_DETAIL_REQUEST,
});
const getPositiveExaminationDetailSuccess = (response) => ({
  type: types.GET_POSITIVE_EXAMINATION_DETAIL_SUCCESS,
  payload: response,
});
const getPositiveExaminationDetailFailure = (error) => ({
  type: types.GET_POSITIVE_EXAMINATION_DETAIL_FAILURE,
  payload: error,
});

const getPositiveExaminationDetail = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getPositiveExaminationDetailRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.examination.getPositiveExaminationDetail,
        data,
      })
      .then((response) => {
        dispatch(getPositiveExaminationDetailSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getPositiveExaminationDetailFailure(error));
        reject();
      });
  });

const createExaminationRequest = () => ({
  type: types.CREATE_EXAMINATION_REQUEST,
});
const createExaminationSuccess = (response) => ({
  type: types.CREATE_EXAMINATION_SUCCESS,
  payload: response,
});
const createExaminationFailure = (error) => ({
  type: types.CREATE_EXAMINATION_FAILURE,
  payload: error,
});

const createExamination = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createExaminationRequest());
    httpClient
      .callApi({
        method: 'POST',
        data,
        url: apiLinks.examination.create,
      })
      .then((response) => {
        dispatch(createExaminationSuccess(response));
        toast.success('Thành công', {
          toastId: 'assign-and-create-examination',
        });
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(createExaminationFailure(error));
        reject();
      });
  });

const updateExaminationRequest = () => ({
  type: types.UPDATE_EXAMINATION_REQUEST,
});
const updateExaminationSuccess = (response) => ({
  type: types.UPDATE_EXAMINATION_SUCCESS,
  payload: response,
});
const updateExaminationFailure = (error) => ({
  type: types.UPDATE_EXAMINATION_FAILURE,
  payload: error,
});

const updateExamination = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateExaminationRequest());
    httpClient
      .callApi({
        method: 'PUT',
        data,
        url: apiLinks.examination.update,
      })
      .then((response) => {
        dispatch(updateExaminationSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateExaminationFailure(error));
        reject();
      });
  });
const deleteExaminationRequest = () => ({
  type: types.DELETE_EXAMINATION_REQUEST,
});
const deleteExaminationSuccess = (response) => ({
  type: types.DELETE_EXAMINATION_SUCCESS,
  payload: response,
});
const deleteExaminationFailure = (error) => ({
  type: types.DELETE_EXAMINATION_FAILURE,
  payload: error,
});

const deleteExamination = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteExaminationRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.examination.delete,
        params: {
          id,
        },
      })
      .then((response) => {
        dispatch(deleteExaminationSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(deleteExaminationFailure(error));
        reject();
      });
  });

const updateMedicalTestRequest = () => ({
  type: types.UPDATE_MEDICAL_TEST_REQUEST,
});
const updateMedicalTestSuccess = (response) => ({
  type: types.UPDATE_MEDICAL_TEST_SUCCESS,
  payload: response,
});
const updateMedicalTestFailure = (error) => ({
  type: types.UPDATE_MEDICAL_TEST_FAILURE,
  payload: error,
});

const updateMedicalTest = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateMedicalTestRequest());
    httpClient
      .callApi({
        method: 'PUT',
        data,
        url: apiLinks.medicalTest,
      })
      .then((response) => {
        dispatch(updateMedicalTestSuccess(response));
        toast.success('Thành công', { toastId: 'contact' });
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateMedicalTestFailure(error));
        reject();
      });
  });

const deleteMedicalTestRequest = () => ({
  type: types.DELETE_MEDICAL_TEST_REQUEST,
});
const deleteMedicalTestSuccess = () => ({
  type: types.DELETE_MEDICAL_TEST_SUCCESS,
});
const deleteMedicalTestFailure = () => ({
  type: types.DELETE_MEDICAL_TEST_FAILURE,
});

const deleteMedicalTest = (medicalTestId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteMedicalTestRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: `${apiLinks.medicalTest}${medicalTestId}`,
      })
      .then((response) => {
        dispatch(deleteMedicalTestSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(deleteMedicalTestFailure(error));
        reject();
      });
  });

const getMedicalTestZonesRequest = () => ({
  type: types.GET_MEDICAL_TEST_ZONES_REQUEST,
});
const getMedicalTestZonesSuccess = (response) => ({
  type: types.GET_MEDICAL_TEST_ZONES_SUCCESS,
  payload: response,
});
const getMedicalTestZonesFailure = (error) => ({
  type: types.GET_MEDICAL_TEST_ZONES_FAILURE,
  payload: error,
});

const getMedicalTestZones =
  ({
    name = '',
    type,
    provinceValue = '',
    districtValue = '',
    wardValue = '',
    pageIndex = 0,
    pageSize = 10,
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getMedicalTestZonesRequest());
        httpClient
          .callApi({
            method: 'GET',
            url: apiLinks.examinationZones,
            params: {
              name,
              type,
              provinceValue,
              districtValue,
              wardValue,
              pageIndex,
              pageSize,
            },
          })
          .then((response) => {
            dispatch(getMedicalTestZonesSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getMedicalTestZonesFailure(error));
            reject();
          });
      });

const createMedicalTestZoneRequest = () => ({
  type: types.CREATE_MEDICAL_TEST_ZONE_REQUEST,
});
const createMedicalTestZoneSuccess = (response) => ({
  type: types.CREATE_MEDICAL_TEST_ZONE_SUCCESS,
  payload: response,
});
const createMedicalTestZoneFailure = (error) => ({
  type: types.CREATE_MEDICAL_TEST_ZONE_FAILURE,
  payload: error,
});

const createMedicalTestZone = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createMedicalTestZoneRequest());
    httpClient
      .callApi({
        method: 'POST',
        data,
        url: apiLinks.examinationZones,
      })
      .then((response) => {
        dispatch(createMedicalTestZoneSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        const err = error.response.data;
        dispatch(createMedicalTestZoneFailure(err));
        reject();
      });
  });

const updateMedicalTestZoneRequest = () => ({
  type: types.UPDATE_MEDICAL_TEST_ZONE_REQUEST,
});
const updateMedicalTestZoneSuccess = (response) => ({
  type: types.UPDATE_MEDICAL_TEST_ZONE_SUCCESS,
  payload: response,
});
const updateMedicalTestZoneFailure = (error) => ({
  type: types.UPDATE_MEDICAL_TEST_ZONE_FAILURE,
  payload: error,
});

const updateMedicalTestZone = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateMedicalTestZoneRequest());
    httpClient
      .callApi({
        method: 'PUT',
        data,
        url: apiLinks.examinationZones,
      })
      .then((response) => {
        dispatch(updateMedicalTestZoneSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateMedicalTestZoneFailure(error));
        reject();
      });
  });

const deleteMedicalTestZoneRequest = () => ({
  type: types.DELETE_MEDICAL_TEST_ZONE_REQUEST,
});
const deleteMedicalTestZoneSuccess = () => ({
  type: types.DELETE_MEDICAL_TEST_ZONE_SUCCESS,
});
const deleteMedicalTestZoneFailure = () => ({
  type: types.DELETE_MEDICAL_TEST_ZONE_FAILURE,
});

const deleteMedicalTestZone = (zoneId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteMedicalTestZoneRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: `${apiLinks.examinationZones}/${zoneId}`,
      })
      .then((response) => {
        dispatch(deleteMedicalTestZoneSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(deleteMedicalTestZoneFailure(error));
        reject();
      });
  });

const getMedicalTestCodesRequest = () => ({
  type: types.GET_MEDICAL_TEST_CODES_REQUEST,
});
const getMedicalTestCodesSuccess = (response) => ({
  type: types.GET_MEDICAL_TEST_CODES_SUCCESS,
  payload: response,
});
const getMedicalTestCodesFailure = (error) => ({
  type: types.GET_MEDICAL_TEST_CODES_FAILURE,
  payload: error,
});

const getMedicalTestCodes =
  ({
    zonePrefix,
    iCDCode,
    searchValue,
    isPrinted,
    isUsed,
    isPublished,
    pageIndex,
    pageSize,
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getMedicalTestCodesRequest());
        httpClient
          .callApi({
            method: 'GET',
            url: apiLinks.examinationCodes,
            params: {
              zonePrefix,
              iCDCode,
              searchValue,
              isPrinted,
              isUsed,
              isPublished,
              pageIndex,
              pageSize,
            },
          })
          .then((response) => {
            dispatch(getMedicalTestCodesSuccess(response.data));
            resolve(response.data);
          })
          .catch((error) => {
            dispatch(getMedicalTestCodesFailure(error));
            reject();
          });
      });

const createMedicalTestCodeRequest = () => ({
  type: types.CREATE_MEDICAL_TEST_CODE_REQUEST,
});
const createMedicalTestCodeSuccess = (response) => ({
  type: types.CREATE_MEDICAL_TEST_CODE_SUCCESS,
  payload: response,
});
const createMedicalTestCodeFailure = (error) => ({
  type: types.CREATE_MEDICAL_TEST_CODE_FAILURE,
  payload: error,
});

const createMedicalTestCode = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createMedicalTestCodeRequest());
    httpClient
      .callApi({
        method: 'POST',
        data,
        url: apiLinks.examinationCode.create,
      })
      .then((response) => {
        dispatch(createMedicalTestCodeSuccess(response));
        toast.success('Thành công', { toastId: data.subjectId });
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(createMedicalTestCodeFailure(error));
        reject();
      });
  });

const getMedicalTestZonesPrefixRequest = () => ({
  type: types.GET_MEDICAL_TEST_ZONES_PREFIX_REQUEST,
});
const getMedicalTestZonesPrefixSuccess = (response) => ({
  type: types.GET_MEDICAL_TEST_ZONES_PREFIX_SUCCESS,
  payload: response,
});
const getMedicalTestZonesPrefixFailure = (error) => ({
  type: types.GET_MEDICAL_TEST_ZONES_PREFIX_FAILURE,
  payload: error,
});

const getMedicalTestZonesPrefix = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getMedicalTestZonesPrefixRequest());
    httpClient
      .callApi({
        url: `${apiLinks.examinationZones}/Prefixes`,
      })
      .then((response) => {
        dispatch(getMedicalTestZonesPrefixSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getMedicalTestZonesPrefixFailure(error));
        reject();
      });
  });

const getPrintedCodeRequest = () => ({
  type: types.GET_MEDICAL_TEST_PRINTED_CODE_REQUEST,
});
const getPrintedCodeSuccess = (response) => ({
  type: types.GET_MEDICAL_TEST_PRINTED_CODE_SUCCESS,
  payload: response,
});
const getPrintedCodeFailure = (error) => ({
  type: types.GET_MEDICAL_TEST_PRINTED_CODE_FAILURE,
  payload: error,
});

const getPrintedCode = (zonePrefix, iCDCode) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getPrintedCodeRequest());
    httpClient
      .callApi({
        url: `${apiLinks.examinationCodes}/GetByZonePrintedCodes`,
        params: {
          zonePrefix,
          iCDCode,
        },
      })
      .then((response) => {
        dispatch(getPrintedCodeSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getPrintedCodeFailure(error));
        reject();
      });
  });

const getAllZonesRequest = () => ({
  type: types.GET_MEDICAL_TEST_ALL_ZONES_REQUEST,
});
const getAllZonesSuccess = (response) => ({
  type: types.GET_MEDICAL_TEST_ALL_ZONES_SUCCESS,
  payload: response,
});
const getAllZonesFailure = (error) => ({
  type: types.GET_MEDICAL_TEST_ALL_ZONES_FAILURE,
  payload: error,
});

const getAllZones = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAllZonesRequest());
    httpClient
      .callApi({
        url: apiLinks.unit.getPrefixes,
        // cancelToken: true,
      })
      .then((response) => {
        dispatch(getAllZonesSuccess(response?.data ?? []));
        resolve();
      })
      .catch((error) => {
        dispatch(getAllZonesFailure(error));
        reject();
      });
  });

const publishCodeRequest = () => ({ type: types.PUBLISH_CODE_REQUEST });
const publishCodeSuccess = (response) => ({
  type: types.PUBLISH_CODE_SUCCESS,
  payload: response,
});
const publishCodeFailure = (error) => ({
  type: types.PUBLISH_CODE_FAILURE,
  payload: error,
});

const publishCode = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(publishCodeRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.examinationCode.publish,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(publishCodeSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(publishCodeFailure(error));
        reject();
      });
  });

const printCodeRequest = () => ({ type: types.PRINT_CODE_REQUEST });
const printCodeSuccess = (response) => ({
  type: types.PRINT_CODE_SUCCESS,
  payload: response,
});
const printCodeFailure = (error) => ({
  type: types.PRINT_CODE_FAILURE,
  payload: error,
});

const printCode = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(printCodeRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.examinationCode.print,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(printCodeSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(printCodeFailure(error));
        reject();
      });
  });

const publishCodeByZoneRequest = () => ({
  type: types.PUBLISH_CODE_BY_ZONE_REQUEST,
});
const publishCodeByZoneSuccess = (response) => ({
  type: types.PUBLISH_CODE_BY_ZONE_SUCCESS,
  payload: response,
});
const publishCodeByZoneFailure = (error) => ({
  type: types.PUBLISH_CODE_BY_ZONE_FAILURE,
  payload: error,
});

const publishCodeByZone = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(publishCodeByZoneRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.examinationCode.publish,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(publishCodeByZoneSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(publishCodeByZoneFailure(error));
        reject();
      });
  });

const printCodeByZoneRequest = () => ({
  type: types.PRINT_CODE_BY_ZONE_REQUEST,
});
const printCodeByZoneSuccess = (response) => ({
  type: types.PRINT_CODE_BY_ZONE_SUCCESS,
  payload: response,
});
const printCodeByZoneFailure = (error) => ({
  type: types.PRINT_CODE_BY_ZONE_FAILURE,
  payload: error,
});

const printCodeByZone = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(printCodeByZoneRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.examinationCode.print,
        data,
        responseType: 'blob',
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(printCodeByZoneSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.xlsx');
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(printCodeByZoneFailure(error));
        reject();
      });
  });

const rePrintCodeByZoneRequest = () => ({
  type: types.REPRINT_CODE_BY_ZONE_REQUEST,
});
const rePrintCodeByZoneSuccess = (response) => ({
  type: types.REPRINT_CODE_BY_ZONE_SUCCESS,
  payload: response,
});
const rePrintCodeByZoneFailure = (error) => ({
  type: types.REPRINT_CODE_BY_ZONE_FAILURE,
  payload: error,
});

const rePrintCodeByZone = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(rePrintCodeByZoneRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.examinationCode.rePrint,
        data,
        responseType: 'blob',
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(rePrintCodeByZoneSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.xlsx');
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(rePrintCodeByZoneFailure(error));
        reject();
      });
  });

const rePrintCodeFromRequest = () => ({
  type: types.REPRINT_CODE_FROM_REQUEST,
});
const rePrintCodeFromSuccess = (response) => ({
  type: types.REPRINT_CODE_FROM_SUCCESS,
  payload: response,
});
const rePrintCodeFromFailure = (error) => ({
  type: types.REPRINT_CODE_FROM_FAILURE,
  payload: error,
});

const rePrintCodeFrom = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(rePrintCodeFromRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.examinationCode.rePrintFrom,
        data,
        responseType: 'blob',
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(rePrintCodeFromSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.xlsx');
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(rePrintCodeFromFailure(error));
        reject();
      });
  });

const getRePrintDiseaseRequest = () => ({
  type: types.GET_REPRINT_DISEASE_REQUEST,
});
const getRePrintDiseaseSuccess = (response) => ({
  type: types.GET_REPRINT_DISEASE_SUCCESS,
  payload: response,
});
const getRePrintDiseaseFailure = (error) => ({
  type: types.GET_REPRINT_DISEASE_FAILURE,
  payload: error,
});

const getRePrintDisease = (unitCode, year) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getRePrintDiseaseRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationCode.getAvailableDiseasesToRePrint,
        params: { unitCode, year: year || moment().format('YYYY') },
      })
      .then((response) => {
        dispatch(getRePrintDiseaseSuccess(response.data.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getRePrintDiseaseFailure(error));
        reject();
      });
  });

const getRePrintCodeRequest = () => ({ type: types.GET_REPRINT_CODE_REQUEST });
const getRePrintCodeSuccess = (response) => ({
  type: types.GET_REPRINT_CODE_SUCCESS,
  payload: response,
});
const getRePrintCodeFailure = (error) => ({
  type: types.GET_REPRINT_CODE_FAILURE,
  payload: error,
});

const getRePrintCode = (unitCode, diseaseCode, isDetail, year) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getRePrintCodeRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationCode.getAvailableCodesToRePrint,
        params: {
          unitCode,
          diseaseCode,
          isDetail,
          year: year || moment().format('YYYY'),
        },
      })
      .then((response) => {
        dispatch(getRePrintCodeSuccess(response.data.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getRePrintCodeFailure(error));
        reject();
      });
  });

const getAvailableCodesToUseRequest = () => ({
  type: types.GET_AVAILABLE_CODES_TO_USE_REQUEST,
});
const getAvailableCodesToUseSuccess = (response) => ({
  type: types.GET_AVAILABLE_CODES_TO_USE_SUCCESS,
  payload: response,
});
const getAvailableCodesToUseFailure = (error) => ({
  type: types.GET_AVAILABLE_CODES_TO_USE_FAILURE,
  payload: error,
});

const getAvailableCodesToUse = (unitId, diseaseCode, year) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAvailableCodesToUseRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationCode.getAvailableCodesToUse,
        params: {
          unitId,
          diseaseCode,
          year: year || moment().format('YYYY'),
        },
      })
      .then((response) => {
        dispatch(getAvailableCodesToUseSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getAvailableCodesToUseFailure(error));
        reject();
      });
  });

const getDiseasesRequest = () => ({ type: types.GET_DISEASES_REQUEST });
const getDiseasesSuccess = (response) => ({
  type: types.GET_DISEASES_SUCCESS,
  payload: response,
});
const getDiseasesFailure = (error) => ({
  type: types.GET_DISEASES_FAILURE,
  payload: error,
});

const getDiseases = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getDiseasesRequest());
    httpClient
      .callApi({
        url: apiLinks.diseases.get,
      })
      .then((response) => {
        dispatch(getDiseasesSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getDiseasesFailure(error));
        reject();
      });
  });

const getDiseaseSamplesRequest = () => ({
  type: types.GET_DISEASE_SAMPLES_REQUEST,
});
const getDiseaseSamplesSuccess = (response) => ({
  type: types.GET_DISEASE_SAMPLES_SUCCESS,
  payload: response,
});
const getDiseaseSamplesFailure = (error) => ({
  type: types.GET_DISEASE_SAMPLES_FAILURE,
  payload: error,
});

const getDiseaseSamples = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getDiseaseSamplesRequest());
    httpClient
      .callApi({
        url: apiLinks.diseaseSample.get,
      })
      .then((response) => {
        dispatch(getDiseaseSamplesSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getDiseaseSamplesFailure(error));
        reject();
      });
  });

const getUnavailableCodesRequest = () => ({
  type: types.GET_UNAVAILABLE_CODES_REQUEST,
});
const getUnavailableCodesSuccess = (response) => ({
  type: types.GET_UNAVAILABLE_CODES_SUCCESS,
  payload: response,
});
const getUnavailableCodesFailure = (error) => ({
  type: types.GET_UNAVAILABLE_CODES_FAILURE,
  payload: error,
});

const getUnavailableCodes =
  ({
    isPrinted,
    isPublished,
    isUsed,
    unitPrefix,
    diseaseCode,
    year,
    pageSize,
    pageIndex,
    searchValue,
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getUnavailableCodesRequest());
        httpClient
          .callApi({
            url: apiLinks.examinationCode.getUnAvailableCodes,
            params: {
              isPrinted,
              isPublished,
              isUsed,
              unitPrefix,
              diseaseCode,
              year,
              pageSize,
              pageIndex,
              searchValue,
            },
          })
          .then((response) => {
            dispatch(getUnavailableCodesSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getUnavailableCodesFailure(error));
            reject();
          });
      });

const getAvailableCodesRequest = () => ({
  type: types.GET_AVAILABLE_CODES_REQUEST,
});
const getAvailableCodesSuccess = (response) => ({
  type: types.GET_AVAILABLE_CODES_SUCCESS,
  payload: response,
});
const getAvailableCodesFailure = (error) => ({
  type: types.GET_AVAILABLE_CODES_FAILURE,
  payload: error,
});

const getAvailableCodes =
  ({
    unitPrefix,
    diseaseCode,
    year,
    lastPrintFrom,
    lastPrintTo,
    printedCount,
    pageSize,
    pageIndex,
    searchValue,
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getAvailableCodesRequest());
        httpClient
          .callApi({
            url: apiLinks.examinationCode.getAvailableCodes,
            params: {
              unitPrefix,
              diseaseCode,
              year,
              pageSize,
              pageIndex,
              searchValue,
              lastPrintFrom,
              lastPrintTo,
              printedCount,
            },
          })
          .then((response) => {
            dispatch(getAvailableCodesSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getAvailableCodesFailure(error));
            reject();
          });
      });

const createCodeRequest = () => ({
  type: types.CREATE_EXAMINATION_CODES_REQUEST,
});
const createCodeSuccess = (response) => ({
  type: types.CREATE_EXAMINATION_CODES_SUCCESS,
  payload: response,
});
const createCodeFailure = (error) => ({
  type: types.CREATE_EXAMINATION_CODES_FAILURE,
  payload: error,
});

const createCode = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createCodeRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.examinationCode.create,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(createCodeSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(createCodeFailure(error));
        reject();
      });
  });

const createUnitRequest = () => ({ type: types.CREATE_UNIT_REQUEST });
const createUnitSuccess = (response) => ({
  type: types.CREATE_UNIT_SUCCESS,
  payload: response,
});
const createUnitFailure = (error) => ({
  type: types.CREATE_UNIT_FAILURE,
  payload: error,
});

const createUnit = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createUnitRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.unit.create,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(createUnitSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(createUnitFailure(error));
        reject();
      });
  });

const updateUnitRequest = () => ({ type: types.UPDATE_UNIT_REQUEST });
const updateUnitSuccess = (response) => ({
  type: types.UPDATE_UNIT_SUCCESS,
  payload: response,
});
const updateUnitFailure = (error) => ({
  type: types.UPDATE_UNIT_FAILURE,
  payload: error,
});

const updateUnit = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateUnitRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.unit.update,
        data,
      })
      .then((response) => {
        toast.success('Thành công', { toastId: 'updateUnit' });
        dispatch(updateUnitSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateUnitFailure(error));
        reject();
      });
  });

const deleteUnitRequest = () => ({ type: types.DELETE_UNIT_REQUEST });
const deleteUnitSuccess = (response) => ({
  type: types.DELETE_UNIT_SUCCESS,
  payload: response,
});
const deleteUnitFailure = (error) => ({
  type: types.DELETE_UNIT_FAILURE,
  payload: error,
});

const deleteUnit = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteUnitRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.unit.delete,
        params: { id },
      })
      .then((response) => {
        dispatch(deleteUnitSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(deleteUnitFailure(error));
        reject();
      });
  });

const getUnitsRequest = () => ({ type: types.GET_UNITS_REQUEST });
const getUnitsSuccess = (response) => ({
  type: types.GET_UNITS_SUCCESS,
  payload: response,
});
const getUnitsFailure = (error) => ({
  type: types.GET_UNITS_FAILURE,
  payload: error,
});

const getUnits =
  ({
    collectAvailable = '',
    receiveAvailable = '',
    testAvailable = '',
    searchValue = '',
    isCollector = '',
    isReceiver = '',
    isTester = '',
    provinceValue = '',
    districtValue = '',
    wardValue = '',
    pageIndex = 0,
    pageSize = 10,
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getUnitsRequest());
        httpClient
          .callApi({
            url: apiLinks.unit.get,
            params: {
              collectAvailable,
              receiveAvailable,
              testAvailable,
              searchValue,
              isCollector,
              isReceiver,
              isTester,
              provinceValue,
              districtValue,
              wardValue,
              pageIndex,
              pageSize,
            },
          })
          .then((response) => {
            dispatch(getUnitsSuccess(response.data));
            resolve(response.data || []);
          })
          .catch((error) => {
            dispatch(getUnitsFailure(error));
            reject();
          });
      });

const getPrefixesRequest = () => ({ type: types.GET_PREFIXES_REQUEST });
const getPrefixesSuccess = (response) => ({
  type: types.GET_PREFIXES_SUCCESS,
  payload: response,
});
const getPrefixesFailure = (error) => ({
  type: types.GET_PREFIXES_FAILURE,
  payload: error,
});

const getPrefixes = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getPrefixesRequest());
    httpClient
      .callApi({
        url: apiLinks.unit.getPrefixes,
      })
      .then((response) => {
        dispatch(getPrefixesSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getPrefixesFailure(error));
        reject();
      });
  });

const getUnitTypesRequest = () => ({ type: types.GET_UNIT_TYPES_REQUEST });
const getUnitTypesSuccess = (response) => ({
  type: types.GET_UNIT_TYPES_SUCCESS,
  payload: response,
});
const getUnitTypesFailure = (error) => ({
  type: types.GET_UNIT_TYPES_FAILURE,
  payload: error,
});

const getUnitTypes = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getUnitTypesRequest());
    httpClient
      .callApi({
        url: apiLinks.unitType.get,
      })
      .then((response) => {
        dispatch(getUnitTypesSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getUnitTypesFailure(error));
        reject();
      });
  });

const createUnitTypeRequest = () => ({ type: types.CREATE_UNIT_TYPE_REQUEST });
const createUnitTypeSuccess = (response) => ({
  type: types.CREATE_UNIT_TYPE_SUCCESS,
  payload: response,
});
const createUnitTypeFailure = (error) => ({
  type: types.CREATE_UNIT_TYPE_FAILURE,
  payload: error,
});

const createUnitType = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createUnitTypeRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.unitType.create,
        data,
      })
      .then((response) => {
        dispatch(createUnitTypeSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(createUnitTypeFailure(error));
        reject();
      });
  });

const getExaminationTypesRequest = () => ({
  type: types.GET_EXAMINATION_TYPES_REQUEST,
});
const getExaminationTypesSuccess = (response) => ({
  type: types.GET_EXAMINATION_TYPES_SUCCESS,
  payload: response,
});
const getExaminationTypesFailure = (error) => ({
  type: types.GET_EXAMINATION_TYPES_FAILURE,
  payload: error,
});

const getExaminationTypes = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getExaminationTypesRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationType.get,
      })
      .then((response) => {
        dispatch(getExaminationTypesSuccess(response.data?.data ?? []));
        resolve();
      })
      .catch((error) => {
        dispatch(getExaminationTypesFailure(error));
        reject();
      });
  });

const getAssigneesRequest = () => ({ type: types.GET_ASSIGNEES_REQUEST });
const getAssigneesSuccess = (response) => ({
  type: types.GET_ASSIGNEES_SUCCESS,
  payload: response,
});
const getAssigneesFailure = (error) => ({
  type: types.GET_ASSIGNEES_FAILURE,
  payload: error,
});

const getAssignees =
  ({
    searchValue = '',
    unitId = '',
    source = '',
    status = '',
    isUnknown = false,
    isAvailable = true,
    isOther = false,
    assignDateFrom = '',
    assignDateTo = '',
    pageIndex = 0,
    pageSize = 10,
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getAssigneesRequest());
        httpClient
          .callApi({
            url: apiLinks.assign.get,
            params: {
              searchValue,
              unitId,
              source,
              status,
              isUnknown,
              isOther,
              isAvailable,
              assignDateFrom,
              assignDateTo,
              pageIndex,
              pageSize,
            },
          })
          .then((response) => {
            dispatch(getAssigneesSuccess(response.data));
            resolve(response.data);
          })
          .catch((error) => {
            dispatch(getAssigneesFailure(error));
            reject();
          });
      });

const getAssigneesByUnitRequest = () => ({
  type: types.GET_ASSIGNEES_BY_UNIT_REQUEST,
});
const getAssigneesByUnitSuccess = (response) => ({
  type: types.GET_ASSIGNEES_BY_UNIT_SUCCESS,
  payload: response,
});
const getAssigneesByUnitFailure = (error) => ({
  type: types.GET_ASSIGNEES_BY_UNIT_FAILURE,
  payload: error,
});

const getAssigneesByUnit = (unitId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAssigneesByUnitRequest());
    httpClient
      .callApi({
        url: `${apiLinks.assign.getByUnitId}/${unitId}/assigns`,
      })
      .then((response) => {
        dispatch(getAssigneesByUnitSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getAssigneesByUnitFailure(error));
        reject();
      });
  });

const createAssignRequest = () => ({ type: types.CREATE_ASSIGN_REQUEST });
const createAssignSuccess = (response) => ({
  type: types.CREATE_ASSIGN_SUCCESS,
  payload: response,
});
const createAssignFailure = (error) => ({
  type: types.CREATE_ASSIGN_FAILURE,
  payload: error,
});

const createAssignWithDate = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createAssignRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.assign.assignWithDate,
        data,
      })
      .then((response) => {
        toast.success('Thành công', {
          toastId: 'assign-and-create-examination',
        });
        dispatch(createAssignSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(createAssignFailure(error));
        reject();
      });
  });

const createAssignWithProfile = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createAssignRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.assign.create,
        data,
      })
      .then((response) => {
        toast.success('Thành công', {
          toastId: 'assign-and-create-examination',
        });
        dispatch(createAssignSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(createAssignFailure(error));
        reject();
      });
  });

const updateAssignRequest = () => ({ type: types.UPDATE_ASSIGN_REQUEST });
const updateAssignSuccess = (response) => ({
  type: types.UPDATE_ASSIGN_SUCCESS,
  payload: response,
});
const updateAssignFailure = (error) => ({
  type: types.UPDATE_ASSIGN_FAILURE,
  payload: error,
});

const updateAssign = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateAssignRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.assign.update,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(updateAssignSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateAssignFailure(error));
        reject();
      });
  });

const cancelAssignRequest = () => ({ type: types.CANCEL_ASSIGN_REQUEST });
const cancelAssignSuccess = (response) => ({
  type: types.CANCEL_ASSIGN_SUCCESS,
  payload: response,
});
const cancelAssignFailure = (error) => ({
  type: types.CANCEL_ASSIGN_FAILURE,
  payload: error,
});

const cancelAssign = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(cancelAssignRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.assign.cancel,
        params: { id },
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(cancelAssignSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(cancelAssignFailure(error));
        reject();
      });
  });

const assignWithCodeOnlyRequest = () => ({
  type: types.ASSIGN_WITH_CODE_ONLY_REQUEST,
});
const assignWithCodeOnlySuccess = (response) => ({
  type: types.ASSIGN_WITH_CODE_ONLY_SUCCESS,
  payload: response,
});
const assignWithCodeOnlyFailure = (error) => ({
  type: types.ASSIGN_WITH_CODE_ONLY_FAILURE,
  payload: error,
});

const assignWithCodeOnly = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(assignWithCodeOnlyRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.assign.assignWithCodeOnly,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(assignWithCodeOnlySuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(assignWithCodeOnlyFailure(error));
        reject();
      });
  });

const updateExamDetailRequest = () => ({
  type: types.UPDATE_EXAM_DETAIL_REQUEST,
});
const updateExamDetailSuccess = (response) => ({
  type: types.UPDATE_EXAM_DETAIL_SUCCESS,
  payload: response,
});
const updateExamDetailFailure = (error) => ({
  type: types.UPDATE_EXAM_DETAIL_FAILURE,
  payload: error,
});

const updateExamDetail = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateExamDetailRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.examination.updateExaminationDetail,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(updateExamDetailSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateExamDetailFailure(error));
        reject();
      });
  });

const getAvailableDiseaseToPrintRequest = () => ({
  type: types.GET_AVAILABLE_DISEASE_TO_PRINT_REQUEST,
});
const getAvailableDiseaseToPrintSuccess = (response) => ({
  type: types.GET_AVAILABLE_DISEASE_TO_PRINT_SUCCESS,
  payload: response,
});
const getAvailableDiseaseToPrintFailure = (error) => ({
  type: types.GET_AVAILABLE_DISEASE_TO_PRINT_FAILURE,
  payload: error,
});

const getAvailableDiseaseToPrint = (unitCode, year) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAvailableDiseaseToPrintRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationCode.getAvailableDiseasesToPrint,
        params: { unitCode, year: year || moment().format('YYYY') },
      })
      .then((response) => {
        dispatch(getAvailableDiseaseToPrintSuccess(response.data.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getAvailableDiseaseToPrintFailure(error));
        reject();
      });
  });

const getAvailableDiseaseToPublishRequest = () => ({
  type: types.GET_AVAILABLE_DISEASE_TO_PUBLISH_REQUEST,
});
const getAvailableDiseaseToPublishSuccess = (response) => ({
  type: types.GET_AVAILABLE_DISEASE_TO_PUBLISH_SUCCESS,
  payload: response,
});
const getAvailableDiseaseToPublishFailure = (error) => ({
  type: types.GET_AVAILABLE_DISEASE_TO_PUBLISH_FAILURE,
  payload: error,
});

const getAvailableDiseaseToPublish = (unitCode, year) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAvailableDiseaseToPublishRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationCode.getAvailableDiseasesToPublish,
        params: { unitCode, year: year || moment().format('YYYY') },
      })
      .then((response) => {
        dispatch(getAvailableDiseaseToPublishSuccess(response.data.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getAvailableDiseaseToPublishFailure(error));
        reject();
      });
  });

const getAvailableCodeToPrintRequest = () => ({
  type: types.GET_AVAILABLE_CODE_TO_PRINT_REQUEST,
});
const getAvailableCodeToPrintSuccess = (response) => ({
  type: types.GET_AVAILABLE_CODE_TO_PRINT_SUCCESS,
  payload: response,
});
const getAvailableCodeToPrintFailure = (error) => ({
  type: types.GET_AVAILABLE_CODE_TO_PRINT_FAILURE,
  payload: error,
});

const getAvailableCodeToPrint = (unitCode, diseaseCode, year) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAvailableCodeToPrintRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationCode.getAvailableCodesToPrint,
        params: {
          unitCode,
          diseaseCode,
          year: year || moment().format('YYYY'),
        },
      })
      .then((response) => {
        dispatch(getAvailableCodeToPrintSuccess(response.data.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getAvailableCodeToPrintFailure(error));
        reject();
      });
  });

const getAvailableCodeToPublishRequest = () => ({
  type: types.GET_AVAILABLE_CODE_TO_PUBLISH_REQUEST,
});
const getAvailableCodeToPublishSuccess = (response) => ({
  type: types.GET_AVAILABLE_CODE_TO_PUBLISH_SUCCESS,
  payload: response,
});
const getAvailableCodeToPublishFailure = (error) => ({
  type: types.GET_AVAILABLE_CODE_TO_PUBLISH_FAILURE,
  payload: error,
});

const getAvailableCodeToPublish = (unitCode, diseaseCode, year) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAvailableCodeToPublishRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationCode.getAvailableCodesToPublish,
        params: {
          unitCode,
          diseaseCode,
          year: year || moment().format('YYYY'),
        },
      })
      .then((response) => {
        dispatch(getAvailableCodeToPublishSuccess(response.data.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getAvailableCodeToPublishFailure(error));
        reject();
      });
  });
const createBatchUnitRequest = () => ({
  type: types.CREATE_BATCH_UNIT_REQUEST,
});
const createBatchUnitSuccess = (response) => ({
  type: types.CREATE_BATCH_UNIT_SUCCESS,
  payload: response,
});
const createBatchUnitFailure = (error) => ({
  type: types.CREATE_BATCH_UNIT_FAILURE,
  payload: error,
});

const createBatchUnit = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createBatchUnitRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.examinationCode.createBatchUnit,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(createBatchUnitSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(createBatchUnitFailure(error));
        reject();
      });
  });

const getAvailableUnitsToPublishRequest = () => ({
  type: types.GET_AVAILABLE_UNITS_TO_PUBLISH_REQUEST,
});
const getAvailableUnitsToPublishSuccess = (response) => ({
  type: types.GET_AVAILABLE_UNITS_TO_PUBLISH_SUCCESS,
  payload: response,
});
const getAvailableUnitsToPublishFailure = (error) => ({
  type: types.GET_AVAILABLE_UNITS_TO_PUBLISH_FAILURE,
  payload: error,
});

const getAvailableUnitsToPublish = (diseaseCode, year) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAvailableUnitsToPublishRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationCode.getAvailableUnitsToPublish,
        params: { diseaseCode, year: year || moment().format('YYYY') },
      })
      .then((response) => {
        dispatch(getAvailableUnitsToPublishSuccess(response.data.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getAvailableUnitsToPublishFailure(error));
        reject();
      });
  });

const publishBatchUnitRequest = () => ({
  type: types.PUBLISH_BATCH_UNIT_REQUEST,
});
const publishBatchUnitSuccess = (response) => ({
  type: types.PUBLISH_BATCH_UNIT_SUCCESS,
  payload: response,
});
const publishBatchUnitFailure = (error) => ({
  type: types.PUBLISH_BATCH_UNIT_FAILURE,
  payload: error,
});

const publishBatchUnit = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(publishBatchUnitRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.examinationCode.publishBatchUnit,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(publishBatchUnitSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(publishBatchUnitFailure(error));
        reject();
      });
  });

const getUsedCodeRequest = () => ({ type: types.GET_USED_CODE_REQUEST });
const getUsedCodeSuccess = (response) => ({
  type: types.GET_USED_CODE_SUCCESS,
  payload: response,
});
const getUsedCodeFailure = (error) => ({
  type: types.GET_USED_CODE_FAILURE,
  payload: error,
});

const getUsedCode =
  ({
    unitPrefix = '',
    diseaseCode = '',
    year = '',
    lastPrintFrom = '',
    lastPrintTo = '',
    printedCount = '',
    usedFrom = '',
    usedTo = '',
    pageSize = 0,
    pageIndex = 10,
    searchValue = '',
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getUsedCodeRequest());
        httpClient
          .callApi({
            url: apiLinks.examinationCode.getUsedCodes,
            params: {
              unitPrefix,
              diseaseCode,
              year,
              lastPrintFrom,
              lastPrintTo,
              printedCount,
              usedFrom,
              usedTo,
              pageSize,
              pageIndex,
              searchValue,
            },
          })
          .then((response) => {
            dispatch(getUsedCodeSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getUsedCodeFailure(error));
            reject();
          });
      });

const getOtherCodeRequest = () => ({ type: types.GET_OTHER_CODE_REQUEST });
const getOtherCodeSuccess = (response) => ({
  type: types.GET_OTHER_CODE_SUCCESS,
  payload: response,
});
const getOtherCodeFailure = (error) => ({
  type: types.GET_OTHER_CODE_FAILURE,
  payload: error,
});

const getOtherCode =
  ({
    unitPrefix = '',
    diseaseCode = '',
    year = '',
    lastPublishedFrom = '',
    lastPublishedTo = '',
    isPublished,
    pageSize = 0,
    pageIndex = 10,
    searchValue = '',
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getOtherCodeRequest());
        httpClient
          .callApi({
            url: apiLinks.examinationCode.getOtherCodes,
            params: {
              unitPrefix,
              diseaseCode,
              year,
              lastPublishedFrom,
              lastPublishedTo,
              isPublished,
              pageSize,
              pageIndex,
              searchValue,
            },
          })
          .then((response) => {
            dispatch(getOtherCodeSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getOtherCodeFailure(error));
            reject();
          });
      });

const uploadExaminationFileRequest = () => ({
  type: types.UPLOAD_EXAMINATION_FILE_REQUEST,
});
const uploadExaminationFileSuccess = (response) => ({
  type: types.UPLOAD_EXAMINATION_FILE_SUCCESS,
  payload: response,
});
const uploadExaminationFileFailure = (error) => ({
  type: types.UPLOAD_EXAMINATION_FILE_FAILURE,
  payload: error,
});
const setUploadExaminationProgress = (progress) => ({
  type: types.SET_UPLOAD_EXAMINATION_FILE_PROGRESS,
  payload: progress,
});

const uploadExaminationFile = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(uploadExaminationFileRequest());
    httpClient
      .callApi({
        method: 'PUT',
        contentType: 'application/x-www-form-urlencoded',
        url: apiLinks.examination.uploadResultExcel,
        data,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          dispatch(setUploadExaminationProgress(percentCompleted));
        },
      })
      .then((response) => {
        dispatch(uploadExaminationFileSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(uploadExaminationFileFailure(error));
        reject();
      });
  });

const exportExamFileRequest = () => ({ type: types.EXPORT_EXAM_FILE_REQUEST });
const exportExamFileSuccess = (response) => ({
  type: types.EXPORT_EXAM_FILE_SUCCESS,
  payload: response,
});
const exportExamFileFailure = (error) => ({
  type: types.EXPORT_EXAM_FILE_FAILURE,
  payload: error,
});

const exportExamFile = (examDetailId, code) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(exportExamFileRequest());
    httpClient
      .callApi({
        url: apiLinks.excel.exportExam,
        responseType: 'blob',
        params: {
          examDetailId,
        },
      })
      .then((response) => {
        dispatch(exportExamFileSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${code}.xlsx`);
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch((error) => {
        dispatch(exportExamFileFailure(error));
        reject();
      });
  });

const exportExamBookRequest = () => ({ type: types.EXPORT_EXAM_BOOK_REQUEST });
const exportExamBookSuccess = (response) => ({
  type: types.EXPORT_EXAM_BOOK_SUCCESS,
  payload: response,
});
const exportExamBookFailure = (error) => ({
  type: types.EXPORT_EXAM_BOOK_FAILURE,
  payload: error,
});

const exportExamBook = (month, year) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(exportExamBookRequest());
    httpClient
      .callApi({
        url: apiLinks.excel.exportExamBook,
        responseType: 'blob',
        params: {
          month,
          year,
        },
      })
      .then((response) => {
        dispatch(exportExamBookSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${month}-${year}.xlsx`);
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(exportExamBookFailure(error));
        reject();
      });
  });

const getExaminationDetailsAvailableForTestSessionRequest = () => ({
  type: types.GET_EXAMINATION_DETAILS_AVAILABLE_FOR_TEST_SESSION_REQUEST,
});
const getExaminationDetailsAvailableForTestSessionSuccess = (response) => ({
  type: types.GET_EXAMINATION_DETAILS_AVAILABLE_FOR_TEST_SESSION_SUCCESS,
  payload: response,
});
const getExaminationDetailsAvailableForTestSessionFailure = (error) => ({
  type: types.GET_EXAMINATION_DETAILS_AVAILABLE_FOR_TEST_SESSION_FAILURE,
  payload: error,
});

const getExaminationDetailsAvailableForTestSession =
  ({
    unitId = '',
    unitTypeId = '',
    searchValue = '',
    from = '',
    to = '',
    diseaseId = '',
    examTypeId = '',
    importantValue = '',
    hasResult = '',
    pageIndex = undefined,
    pageSize = undefined,
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getExaminationDetailsAvailableForTestSessionRequest());
        httpClient
          .callApi({
            url: apiLinks.examination
              .getExaminationDetailsAvailableForTestSession,
            params: {
              unitId,
              unitTypeId,
              searchValue,
              from,
              to,
              diseaseId,
              examTypeId,
              importantValue,
              hasResult,
              pageIndex,
              pageSize,
            },
            cancelToken: true,
          })
          .then((response) => {
            dispatch(
              getExaminationDetailsAvailableForTestSessionSuccess(response.data),
            );
            resolve(response.data.data);
          })
          .catch((error) => {
            dispatch(getExaminationDetailsAvailableForTestSessionFailure(error));
            reject();
          });
      });

const getAvailableDayByUnitForExportExaminationRequest = () => ({
  type: types.GET_AVAILABLE_DAY_BY_UNIT_FOR_EXPORT_EXAMINATION_REQUEST,
});
const getAvailableDayByUnitForExportExaminationSuccess = (response) => ({
  type: types.GET_AVAILABLE_DAY_BY_UNIT_FOR_EXPORT_EXAMINATION_SUCCESS,
  payload: response,
});
const getAvailableDayByUnitForExportExaminationFailure = (error) => ({
  type: types.GET_AVAILABLE_DAY_BY_UNIT_FOR_EXPORT_EXAMINATION_FAILURE,
  payload: error,
});

const getAvailableDayByUnitForExportExamination =
  (unitId, hasResultOnly, feeType) => (dispatch) =>
    new Promise((resolve, reject) => {
      const { unitInfo } = store.getState().medicalTest;
      dispatch(getAvailableDayByUnitForExportExaminationRequest());
      httpClient
        .callApi({
          url: apiLinks.excel.getAvailableDatesForResultList,
          params: {
            unitTaken: unitId,
            unitReceived: unitInfo?.isJoiningExam ? unitInfo.id : undefined,
            hasResultOnly,
            feeType,
          },
        })
        .then((response) => {
          dispatch(
            getAvailableDayByUnitForExportExaminationSuccess(
              response.data.data,
            ),
          );
          resolve();
        })
        .catch((error) => {
          dispatch(getAvailableDayByUnitForExportExaminationFailure(error));
          reject();
        });
    });

const getAvailableDayByUnitForExportExaminationHCDCRequest = () => ({
  type: types.GET_AVAILABLE_DAY_BY_UNIT_FOR_EXPORT_EXAMINATION_REQUEST,
});
const getAvailableDayByUnitForExportExaminationHCDCSuccess = (response) => ({
  type: types.GET_AVAILABLE_DAY_BY_UNIT_FOR_EXPORT_EXAMINATION_SUCCESS,
  payload: response,
});
const getAvailableDayByUnitForExportExaminationHCDCFailure = (error) => ({
  type: types.GET_AVAILABLE_DAY_BY_UNIT_FOR_EXPORT_EXAMINATION_FAILURE,
  payload: error,
});

const getAvailableDayByUnitForExportExaminationHCDC =
  (hasResultOnly, feeType) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getAvailableDayByUnitForExportExaminationHCDCRequest());
      httpClient
        .callApi({
          url: apiLinks.excel.getAvailableDatesForResultListHCDC,
          params: { hasResultOnly, feeType },
        })
        .then((response) => {
          dispatch(
            getAvailableDayByUnitForExportExaminationHCDCSuccess(
              response.data.data,
            ),
          );
          resolve();
        })
        .catch((error) => {
          dispatch(getAvailableDayByUnitForExportExaminationHCDCFailure(error));
          reject();
        });
    });

const getAvailableDatesForTakenExamList = (unitId, feeType) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAvailableDayByUnitForExportExaminationHCDCRequest());
    httpClient
      .callApi({
        url: apiLinks.excel.availableDatesForTakenExamList,
        params: { unitId, feeType },
      })
      .then((response) => {
        dispatch(
          getAvailableDayByUnitForExportExaminationHCDCSuccess(
            response.data.data,
          ),
        );
        resolve();
      })
      .catch((error) => {
        dispatch(getAvailableDayByUnitForExportExaminationHCDCFailure(error));
        reject();
      });
  });

const exportExaminationResultRequest = () => ({
  type: types.EXPORT_EXAMIANATION_RESULT_REQUEST,
});
const exportExaminationResultSuccess = (response) => ({
  type: types.EXPORT_EXAMIANATION_RESULT_SUCCESS,
  payload: response,
});
const exportExaminationResultFailure = (error) => ({
  type: types.EXPORT_EXAMIANATION_RESULT_FAILURE,
  payload: error,
});

const exportExaminationResult =
  (unitId, resultDate, hasResultOnly, feeType) => (dispatch) =>
    new Promise((resolve, reject) => {
      const { unitInfo } = store.getState().medicalTest;
      dispatch(exportExaminationResultRequest());
      httpClient
        .callApi({
          url: apiLinks.excel.examResultList,
          responseType: 'blob',
          params: {
            unitTaken: unitId,
            receivedDate: resultDate,
            unitReceived: unitInfo?.isJoiningExam ? unitInfo.id : undefined,
            hasResultOnly,
            feeType,
          },
        })
        .then((response) => {
          dispatch(exportExaminationResultSuccess(response.data));
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'exam-result.xlsx');
          document.body.appendChild(link);
          link.click();
          resolve();
        })
        .catch((error) => {
          toast.warn(getExaminationError(error.response?.data));
          dispatch(exportExaminationResultFailure(error));
          reject();
        });
    });

const exportExaminationResultHCDCRequest = () => ({
  type: types.EXPORT_EXAMIANATION_RESULT_REQUEST,
});
const exportExaminationResultHCDCSuccess = (response) => ({
  type: types.EXPORT_EXAMIANATION_RESULT_SUCCESS,
  payload: response,
});
const exportExaminationResultHCDCFailure = (error) => ({
  type: types.EXPORT_EXAMIANATION_RESULT_FAILURE,
  payload: error,
});

const exportExaminationResultHCDC =
  (resultDate, hasResultOnly, feeType) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(exportExaminationResultHCDCRequest());
      httpClient
        .callApi({
          url: apiLinks.excel.examResultListHCDC,
          responseType: 'blob',
          params: {
            resultDate,
            hasResultOnly,
            feeType,
          },
        })
        .then((response) => {
          dispatch(exportExaminationResultHCDCSuccess(response.data));
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'exam-result.xlsx');
          document.body.appendChild(link);
          link.click();
          resolve();
        })
        .catch((error) => {
          toast.warn(getExaminationError(error.response?.data));
          dispatch(exportExaminationResultHCDCFailure(error));
          reject();
        });
    });

const exportByTaken = (unitId, takenDate, feeType) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(exportExaminationResultHCDCRequest());
    httpClient
      .callApi({
        url: apiLinks.excel.takenExamList,
        responseType: 'blob',
        params: {
          unitId,
          takenDate,
          feeType,
        },
      })
      .then((response) => {
        dispatch(exportExaminationResultHCDCSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'exam-result.xlsx');
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(exportExaminationResultHCDCFailure(error));
        reject();
      });
  });

const exportByDateReceived = (dateReceived) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(exportExaminationResultHCDCRequest());
    httpClient
      .callApi({
        url: apiLinks.excel.receivedStatistic,
        responseType: 'blob',
        params: { dateReceived },
      })
      .then((response) => {
        dispatch(exportExaminationResultHCDCSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'statistics.xlsx');
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(exportExaminationResultHCDCFailure(error));
        reject();
      });
  });

const exportExaminationFileRequest = () => ({
  type: types.EXPORT_EXAMINATION_RESULT_REQUEST,
});
const exportExaminationFileSuccess = (response) => ({
  type: types.EXPORT_EXAMINATION_RESULT_SUCCESS,
  payload: response,
});
const exportExaminationFileFailure = (error) => ({
  type: types.EXPORT_EXAMINATION_RESULT_FAILURE,
  payload: error,
});

const exportExaminationFile = (code) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(exportExaminationFileRequest());
    httpClient
      .callApi({
        url: apiLinks.excel.exportExaminationResult,
        responseType: 'blob',
        params: { code },
      })
      .then((response) => {
        dispatch(exportExaminationFileSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${code}.xlsx`);
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(exportExaminationFileFailure(error));
        reject();
      });
  });

const exportByRangeRequest = () => ({
  type: types.EXPORT_EXAMINATION_RESULT_REQUEST,
});
const exportByRangeSuccess = (response) => ({
  type: types.EXPORT_EXAMINATION_RESULT_SUCCESS,
  payload: response,
});
const exportByRangeFailure = (error) => ({
  type: types.EXPORT_EXAMINATION_RESULT_FAILURE,
  payload: error,
});

const exportByRange = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(exportByRangeRequest());
    httpClient
      .callApi({
        url: apiLinks.excel.exportByRange,
        responseType: 'blob',
        params,
      })
      .then((response) => {
        dispatch(exportByRangeSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'result.xlsx');
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch((error) => {
        dispatch(exportByRangeFailure(error));
        reject();
      });
  });

const exportResultFromExcelRequest = () => ({
  type: types.EXPORT_RESULT_FROM_EXCEL_REQUEST,
});
const exportResultFromExcelSuccess = (response) => ({
  type: types.EXPORT_RESULT_FROM_EXCEL_SUCCESS,
  payload: response,
});
const exportResultFromExcelFailure = (error) => ({
  type: types.EXPORT_RESULT_FROM_EXCEL_FAILURE,
  payload: error,
});

const exportResultFromExcel =
  ({ formData, hasResultOnly, feeType, unitId }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(exportResultFromExcelRequest());
        httpClient
          .callApi({
            method: 'PUT',
            url: apiLinks.excel.exportResultFromExcel,
            responseType: 'blob',
            params: { hasResultOnly, feeType, unitId },
            data: formData,
          })
          .then((response) => {
            dispatch(exportResultFromExcelSuccess(response.data));
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'result.xlsx');
            document.body.appendChild(link);
            link.click();
            resolve();
          })
          .catch((error) => {
            dispatch(exportResultFromExcelFailure(error));
            reject();
          });
      });

// load in app, not show
const getAllExaminationDetailsAvailableForTestSessionListRequest = () => ({
  type: types.GET_ALL_EXAMINATION_DETAILS_AVAILABLE_FOR_TEST_SESSION_REQUEST,
});
const getAllExaminationDetailsAvailableForTestSessionListSuccess = (
  response,
) => ({
  type: types.GET_ALL_EXAMINATION_DETAILS_AVAILABLE_FOR_TEST_SESSION_SUCCESS,
  payload: response,
});
const getAllExaminationDetailsAvailableForTestSessionListFailure = (error) => ({
  type: types.GET_ALL_EXAMINATION_DETAILS_AVAILABLE_FOR_TEST_SESSION_FAILURE,
  payload: error,
});
const getAllExaminationDetailsAvailableForTestSessionList = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAllExaminationDetailsAvailableForTestSessionListRequest());
    httpClient
      .callApi({
        url: apiLinks.examination.getExaminationDetailsAvailableForTestSession,
      })
      .then((response) => {
        dispatch(
          getAllExaminationDetailsAvailableForTestSessionListSuccess(
            response.data.data,
          ),
        );
        resolve();
      })
      .catch((error) => {
        getAllExaminationDetailsAvailableForTestSessionListFailure(error);
        reject();
      });
  });

const getByProfileIdRequest = () => ({ type: types.GET_BY_PROFILE_ID_REQUEST });
const getByProfileIdSuccess = (response) => ({
  type: types.GET_BY_PROFILE_ID_SUCCESS,
  payload: response,
});
const getByProfileIdFailure = (error) => ({
  type: types.GET_BY_PROFILE_ID_FAILURE,
  payload: error,
});

const getByProfileId = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getByProfileIdRequest());
    httpClient
      .callApi({
        url: apiLinks.people.get,
        params: { id },
      })
      .then((response) => {
        dispatch(getByProfileIdSuccess(response.data.data));
        resolve(response.data.data);
      })
      .catch((error) => {
        dispatch(getByProfileIdFailure(error));
        reject();
      });
  });

const mergeProfileRequest = () => ({ type: types.MERGE_PROFILE_REQUEST });
const mergeProfileSuccess = (response) => ({
  type: types.MERGE_PROFILE_SUCCESS,
  payload: response,
});
const mergeProfileFailure = (error) => ({
  type: types.MERGE_PROFILE_FAILURE,
  payload: error,
});

const mergeProfile = (id, profileId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(mergeProfileRequest());
    httpClient
      .callApi({
        url: apiLinks.people.merge,
        params: { id, profileId },
      })
      .then((response) => {
        dispatch(mergeProfileSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(mergeProfileFailure(error));
        reject();
      });
  });

const changeProfileRequest = () => ({ type: types.CHANGE_PROFILE_REQUEST });
const changeProfileSuccess = (response) => ({
  type: types.CHANGE_PROFILE_SUCCESS,
  payload: response,
});
const changeProfileFailure = (error) => ({
  type: types.CHANGE_PROFILE_FAILURE,
  payload: error,
});

const changeProfile =
  ({ examId, profileId }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(changeProfileRequest());
        httpClient
          .callApi({
            method: 'PUT',
            url: apiLinks.examination.changeProfile,
            params: { examId, profileId },
          })
          .then((response) => {
            dispatch(changeProfileSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(changeProfileFailure(error.response.data));
            reject(getExaminationError(error.response.data));
          });
      });

const createProfileFromExaminationRequest = () => ({
  type: types.CREATE_PROFILE_FROM_EXAMINATION_REQUEST,
});
const createProfileFromExaminationSuccess = (response) => ({
  type: types.CREATE_PROFILE_FROM_EXAMINATION_SUCCESS,
  payload: response,
});
const createProfileFromExaminationFailure = (error) => ({
  type: types.CREATE_PROFILE_FROM_EXAMINATION_FAILURE,
  payload: error,
});

const createProfileFromExamination = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createProfileFromExaminationRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.people.create,
        data,
      })
      .then((response) => {
        dispatch(createProfileFromExaminationSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(createProfileFromExaminationFailure(error));
        reject();
      });
  });

const importInformationRequest = () => ({
  type: types.IMPORT_INFORMATION_REQUEST,
});
const importInformationSuccess = (response) => ({
  type: types.IMPORT_INFORMATION_SUCCESS,
  payload: response,
});
const importInformationFailure = (error) => ({
  type: types.IMPORT_INFORMATION_FAILURE,
  payload: error,
});

const importInformation = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(importInformationRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.excel.importInformation,
        data,
      })
      .then((response) => {
        dispatch(importInformationSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(importInformationFailure(error));
        reject();
      });
  });

const updateProfileRequest = () => ({ type: types.UPDATE_PROFILE_REQUEST });
const updateProfileSuccess = (response) => ({
  type: types.UPDATE_PROFILE_SUCCESS,
  payload: response,
});
const updateProfileFailure = (error) => ({
  type: types.UPDATE_PROFILE_FAILURE,
  payload: error,
});

const updateProfile = (profileId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateProfileRequest());
    httpClient
      .callApi({
        url: apiLinks.people.update,
        params: { profileId },
      })
      .then((response) => {
        dispatch(updateProfileSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateProfileFailure(error));
        reject();
      });
  });

const getUnitConfigs = (unitId) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        url: apiLinks.unit.getUnitConfigs,
        params: { unitId },
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });

const createUnitConfigRequest = () => ({
  type: types.CREATE_UNIT_CONFIG_REQUEST,
});
const createUnitConfigSuccess = (response) => ({
  type: types.CREATE_UNIT_CONFIG_SUCCESS,
  payload: response,
});
const createUnitConfigFailure = (error) => ({
  type: types.CREATE_UNIT_CONFIG_FAILURE,
  payload: error,
});

const createUnitConfig = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createUnitConfigRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.unit.createUnitConfig,
        data,
      })
      .then((response) => {
        dispatch(createUnitConfigSuccess(response?.data ?? {}));
        resolve();
      })
      .catch(({ response: { data: d } }) => {
        toast.warn(d.substring(0, d.indexOf(' at ')));
        dispatch(createUnitConfigFailure(d));
        reject();
      });
  });

const updateUnitConfigRequest = () => ({
  type: types.UPDATE_UNIT_CONFIG_REQUEST,
});
const updateUnitConfigSuccess = (response) => ({
  type: types.UPDATE_UNIT_CONFIG_SUCCESS,
  payload: response,
});
const updateUnitConfigFailure = (error) => ({
  type: types.UPDATE_UNIT_CONFIG_FAILURE,
  payload: error,
});

const updateUnitConfig = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateUnitConfigRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.unit.updateUnitConfig,
        data,
      })
      .then((response) => {
        dispatch(updateUnitConfigSuccess(response?.data ?? {}));
        resolve();
      })
      .catch(({ response: { data: d } }) => {
        toast.warn(d.substring(0, d.indexOf(' at ')));
        dispatch(updateUnitConfigFailure(d));
        reject();
      });
  });

const deleteUnitConfigRequest = () => ({
  type: types.DELETE_UNIT_CONFIG_REQUEST,
});
const deleteUnitConfigSuccess = (response) => ({
  type: types.DELETE_UNIT_CONFIG_SUCCESS,
  payload: response,
});
const deleteUnitConfigFailure = (error) => ({
  type: types.DELETE_UNIT_CONFIG_FAILURE,
  payload: error,
});

const deleteUnitConfig = (configId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteUnitConfigRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.unit.deleteUnitConfig,
        params: { configId },
        // cancelToken: true,
      })
      .then((response) => {
        dispatch(deleteUnitConfigSuccess(response?.data ?? {}));
        resolve();
      })
      .catch(({ response: { data: d } }) => {
        toast.warn(d.substring(0, d.indexOf(' at ')));
        dispatch(deleteUnitConfigFailure(d));
        reject();
      });
  });

const updateCode = (data) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.unit.updateCode,
        data,
      })
      .then(() => {
        resolve();
      })
      .catch(({ response: { data: d } }) => {
        toast.warn(d.substring(0, d.indexOf(' at ')));
        reject();
      });
  });

const getPersonalExamHistoryRequest = () => ({
  type: types.GET_PERSONAL_EXAM_HISTORY_REQUEST,
});
const getPersonalExamHistorySuccess = (response) => ({
  type: types.GET_PERSONAL_EXAM_HISTORY_SUCCESS,
  payload: response,
});
const getPersonalExamHistoryFailure = (error) => ({
  type: types.GET_PERSONAL_EXAM_HISTORY_FAILURE,
  payload: error,
});

const getPersonalExamHistory =
  ({ profileId, pageIndex, pageSize }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getPersonalExamHistoryRequest());
        httpClient
          .callApi({
            url: apiLinks.people.getPersonExamHistory,
            params: { profileId, pageIndex, pageSize },
          })
          .then((response) => {
            dispatch(getPersonalExamHistorySuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getPersonalExamHistoryFailure(error));
            reject();
          });
      });

const uploadProfilesFromExcelRequest = () => ({
  type: types.UPLOAD_PROFILES_FROM_EXCEL_REQUEST,
});
const uploadProfilesFromExcelSuccess = (response) => ({
  type: types.UPLOAD_PROFILES_FROM_EXCEL_SUCCESS,
  payload: response,
});
const uploadProfilesFromExcelFailure = (error) => ({
  type: types.UPLOAD_PROFILES_FROM_EXCEL_FAILURE,
  payload: error,
});

const uploadProfilesFromExcel = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(uploadProfilesFromExcelRequest());
    httpClient
      .callApi({
        method: 'PUT',
        contentType: 'application/x-www-form-urlencoded',
        url: apiLinks.excel.uploadProfilesFromExcel,
        data,
      })
      .then((response) => {
        dispatch(uploadProfilesFromExcelSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(uploadProfilesFromExcelFailure(error));
        reject();
      });
  });

const importAssignsRequest = () => ({
  type: types.IMPORT_ASSIGNS_REQUEST,
});
const importAssignsSuccess = (response) => ({
  type: types.IMPORT_ASSIGNS_SUCCESS,
  payload: response,
});
const importAssignsFailure = (error) => ({
  type: types.IMPORT_ASSIGNS_FAILURE,
  payload: error,
});

const importAssigns = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(importAssignsRequest());
    httpClient
      .callApi({
        method: 'PUT',
        contentType: 'application/x-www-form-urlencoded',
        url: apiLinks.excel.importAssigns,
        data,
      })
      .then((response) => {
        dispatch(importAssignsSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(importAssignsFailure(error));
        reject();
      });
  });

const changeProfileBatchRequest = () => ({
  type: types.CHANGE_PROFILE_PATCH_REQUEST,
});
const changeProfileBatchSuccess = (response) => ({
  type: types.CHANGE_PROFILE_PATCH_SUCCESS,
  payload: response,
});
const changeProfileBatchFailure = (error) => ({
  type: types.CHANGE_PROFILE_PATCH_FAILURE,
  payload: error,
});

const changeProfileBatch = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(changeProfileBatchRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.examination.changeProfileBatch,
        data,
      })
      .then((response) => {
        dispatch(changeProfileBatchSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(changeProfileBatchFailure());
        reject();
      });
  });

const createGroupProfileRequest = () => ({
  type: types.CREATE_GROUP_PROFILE_REQUEST,
});
const createGroupProfileSuccess = (response) => ({
  type: types.CREATE_GROUP_PROFILE_SUCCESS,
  payload: response,
});
const createGroupProfileFailure = (error) => ({
  type: types.CREATE_GROUP_PROFILE_FAILURE,
  payload: error,
});

const createGroupProfile = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createGroupProfileRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.people.createGroupProfile,
        data,
      })
      .then((response) => {
        dispatch(createGroupProfileSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(createGroupProfileFailure());
        reject();
      });
  });

const getSamplingPlacesRequest = () => ({
  type: types.GET_SAMPLING_PLACES_REQUEST,
});
const getSamplingPlacesSuccess = (response) => ({
  type: types.GET_SAMPLING_PLACES_SUCCESS,
  payload: response,
});
const getSamplingPlacesFailure = (error) => ({
  type: types.GET_SAMPLING_PLACES_FAILURE,
  payload: error,
});

const getSamplingPlaces = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getSamplingPlacesRequest());
    httpClient
      .callApi({
        url: apiLinks.samplingPlaces.get,
      })
      .then((response) => {
        dispatch(getSamplingPlacesSuccess(response.data?.data ?? []));
        resolve();
      })
      .catch((error) => {
        dispatch(getSamplingPlacesFailure(error));
        reject();
      });
  });

const exportStatisticExaminationByCodesRequest = () => ({
  type: types.EXPORT_STATISTIC_EXAMINATION_BY_CODE_REQUEST,
});
const exportStatisticExaminationByCodesSuccess = (response) => ({
  type: types.EXPORT_STATISTIC_EXAMINATION_BY_CODE_SUCCESS,
  payload: response,
});
const exportStatisticExaminationByCodesFailure = (error) => ({
  type: types.EXPORT_STATISTIC_EXAMINATION_BY_CODE_FAILURE,
  payload: error,
});

const exportStatisticExaminationByCodes = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(exportStatisticExaminationByCodesRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.excel.exportStatisticExaminationByCodes,
        responseType: 'blob',
        data,
      })
      .then((response) => {
        dispatch(
          exportStatisticExaminationByCodesSuccess(response.data),
        );
        const tempUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = tempUrl;
        link.setAttribute(
          'download',
          'Xuất dữ liệu chi tiết theo mã xét nghiệm.xlsx',
        );
        document.body.appendChild(link);
        link.click();
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(
          exportStatisticExaminationByCodesFailure(error),
        );
        reject();
      });
  });

const markAsUnsatisfactorySampleRequest = () => ({
  type: types.MASK_AS_UNSATISFACTORY_SAMPLE_REQUEST,
});
const markAsUnsatisfactorySampleSuccess = (response) => ({
  type: types.MASK_AS_UNSATISFACTORY_SAMPLE_SUCCESS,
  payload: response,
});
const markAsUnsatisfactorySampleFailure = (error) => ({
  type: types.MASK_AS_UNSATISFACTORY_SAMPLE_FAILURE,
  payload: error,
});

const markAsUnsatisfactorySample = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(markAsUnsatisfactorySampleRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.examination.markAsUnsatisfactorySample,
        data,
      })
      .then((response) => {
        dispatch(markAsUnsatisfactorySampleSuccess(response?.data ?? {}));
        resolve(response?.data ?? {});
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(markAsUnsatisfactorySampleFailure(error));
        reject();
      });
  });

const unMarkAsUnsatisfactorySampleRequest = () => ({
  type: types.UN_MASK_AS_UNSATISFACTORY_SAMPLE_REQUEST,
});
const unMarkAsUnsatisfactorySampleSuccess = (response) => ({
  type: types.UN_MASK_AS_UNSATISFACTORY_SAMPLE_SUCCESS,
  payload: response,
});
const unMarkAsUnsatisfactorySampleFailure = (error) => ({
  type: types.UN_MASK_AS_UNSATISFACTORY_SAMPLE_FAILURE,
  payload: error,
});

const unMarkAsUnsatisfactorySample = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(unMarkAsUnsatisfactorySampleRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.examination.unMarkAsUnsatisfactorySample,
        data,
      })
      .then((response) => {
        dispatch(unMarkAsUnsatisfactorySampleSuccess(response?.data ?? {}));
        resolve(response?.data ?? {});
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(unMarkAsUnsatisfactorySampleFailure(error));
        reject();
      });
  });

const clearExaminationDetailFilter = (payload) =>
  ({ type: types.CLEAR_EXAMINATION_DETAIL_FILTER, payload });

const getQuickTestsRequest = () => ({
  type: types.GET_QUICK_TESTS_REQUEST,
});
const getQuickTestsSuccess = (response) => ({
  type: types.GET_QUICK_TESTS_SUCCESS,
  payload: response,
});
const getQuickTestsFailure = (error) => ({
  type: types.GET_QUICK_TESTS_FAILURE,
  payload: error,
});
const getQuickTests = ({
  from = '',
  to = '',
  personName = '',
  phoneNumber = '',
  houseNumber = '',
  provinceCode = '',
  districtCode = '',
  wardCode = '',
  unitId = '',
  samplingPlaceId = '',
  examinationTypeId = '',
  resultType = '',
  hasSymptom = null,
  status = 0,
  pageIndex = undefined,
  pageSize = undefined,
}) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getQuickTestsRequest());
      httpClient
        .callApi({
          method: 'GET',
          url: apiLinks.quickTest.get(),
          params: {
            from,
            to,
            personName,
            phoneNumber,
            houseNumber,
            provinceCode,
            districtCode,
            wardCode,
            unitId,
            samplingPlaceId,
            examinationTypeId,
            resultType,
            hasSymptom,
            status,
            pageIndex,
            pageSize,
          },
        })
        .then((response) => {
          dispatch(getQuickTestsSuccess(response?.data ?? {}));
          resolve(response?.data ?? {});
        })
        .catch((error) => {
          dispatch(getQuickTestsFailure(error));
          reject();
        });
    });

const getDeletedQuickTestsRequest = () => ({
  type: types.GET_DELETED_QUICK_TESTS_REQUEST,
});
const getDeletedQuickTestsSuccess = (response) => ({
  type: types.GET_DELETED_QUICK_TESTS_SUCCESS,
  payload: response,
});
const getDeletedQuickTestsFailure = (error) => ({
  type: types.GET_DELETED_QUICK_TESTS_FAILURE,
  payload: error,
});
const getDeletedQuickTests = ({
  from = '',
  to = '',
  personName = '',
  phoneNumber = '',
  houseNumber = '',
  provinceCode = '',
  districtCode = '',
  wardCode = '',
  unitId = '',
  samplingPlaceId = '',
  examinationTypeId = '',
  resultType = '',
  // status = 0,
  pageIndex = undefined,
  pageSize = undefined,
}) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getDeletedQuickTestsRequest());
      httpClient
        .callApi({
          method: 'GET',
          url: apiLinks.quickTest.getDeleted,
          params: {
            from,
            to,
            personName,
            phoneNumber,
            houseNumber,
            provinceCode,
            districtCode,
            wardCode,
            unitId,
            samplingPlaceId,
            examinationTypeId,
            resultType,
            // status,
            pageIndex,
            pageSize,
          },
        })
        .then((response) => {
          dispatch(getDeletedQuickTestsSuccess(response?.data ?? {}));
          resolve();
        })
        .catch((error) => {
          dispatch(getDeletedQuickTestsFailure(error));
          reject();
        });
    });

const getQuickTestsByUnitTypeRequest = () => ({
  type: types.GET_QUICK_TESTS_BY_UNIT_TYPE_REQUEST,
});
const getQuickTestsByUnitTypeSuccess = (response) => ({
  type: types.GET_QUICK_TESTS_BY_UNIT_TYPE_SUCCESS,
  payload: response,
});
const getQuickTestsByUnitTypeFailure = (error) => ({
  type: types.GET_QUICK_TESTS_BY_UNIT_TYPE_FAILURE,
  payload: error,
});
const getQuickTestsByUnitType = ({
  from = '',
  to = '',
  personName = '',
  phoneNumber = '',
  houseNumber = '',
  provinceCode = '',
  districtCode = '',
  wardCode = '',
  unitId = '',
  samplingPlaceId = '',
  examinationTypeId = '',
  resultType = '',
  hasSymptom = null,
  status = QUICK_TEST_STATUSES.DONE,
  pageIndex = undefined,
  pageSize = undefined,
}) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getQuickTestsByUnitTypeRequest());
      httpClient
        .callApi({
          method: 'GET',
          url: apiLinks.quickTest.getQuickTestsByUnitType,
          params: {
            from,
            to,
            personName,
            phoneNumber,
            houseNumber,
            provinceCode,
            districtCode,
            wardCode,
            unitId,
            samplingPlaceId,
            examinationTypeId,
            resultType,
            hasSymptom,
            status,
            pageIndex,
            pageSize,
          },
        })
        .then((response) => {
          dispatch(getQuickTestsByUnitTypeSuccess(response?.data ?? {}));
          resolve();
        })
        .catch((error) => {
          dispatch(getQuickTestsByUnitTypeFailure(error));
          reject();
        });
    });

const getQuickTestsByManagementUnitRequest = () => ({
  type: types.GET_QUICK_TESTS_BY_MANAGEMENT_UNIT_REQUEST,
});
const getQuickTestsByManagementUnitSuccess = (response) => ({
  type: types.GET_QUICK_TESTS_BY_MANAGEMENT_UNIT_SUCCESS,
  payload: response,
});
const getQuickTestsByManagementUnitFailure = (error) => ({
  type: types.GET_QUICK_TESTS_BY_MANAGEMENT_UNIT_FAILURE,
  payload: error,
});
const getQuickTestsByManagementUnit = ({
  from = '',
  to = '',
  personName = '',
  phoneNumber = '',
  houseNumber = '',
  provinceCode = '',
  districtCode = '',
  wardCode = '',
  unitId = '',
  samplingPlaceId = '',
  examinationTypeId = '',
  resultType = '',
  hasSymptom = null,
  status = QUICK_TEST_STATUSES.DONE,
  pageIndex = undefined,
  pageSize = undefined,
}) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getQuickTestsByManagementUnitRequest());
      httpClient
        .callApi({
          method: 'GET',
          url: apiLinks.quickTest.getQuickTestsByManagementUnit,
          params: {
            from,
            to,
            personName,
            phoneNumber,
            houseNumber,
            provinceCode,
            districtCode,
            wardCode,
            unitId,
            samplingPlaceId,
            examinationTypeId,
            resultType,
            hasSymptom,
            status,
            pageIndex,
            pageSize,
          },
        })
        .then((response) => {
          dispatch(getQuickTestsByManagementUnitSuccess(response?.data ?? {}));
          resolve();
        })
        .catch((error) => {
          dispatch(getQuickTestsByManagementUnitFailure(error));
          reject();
        });
    });

const getPersonalQuickTestHistoryRequest = () => ({
  type: types.GET_PERSONAL_QUICK_TEST_HISTORY_REQUEST,
});
const getPersonalQuickTestHistorySuccess = (response) => ({
  type: types.GET_PERSONAL_QUICK_TEST_HISTORY_SUCCESS,
  payload: response,
});
const getPersonalQuickTestHistoryFailure = (error) => ({
  type: types.GET_PERSONAL_QUICK_TEST_HISTORY_FAILURE,
  payload: error,
});
const getPersonalQuickTestHistory = ({
  profileId = '',
  pageIndex = undefined,
  pageSize = undefined,
}) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getPersonalQuickTestHistoryRequest());
      httpClient
        .callApi({
          method: 'GET',
          url: apiLinks.people.getPersonalQuickTestHistory,
          params: {
            profileId,
            pageIndex,
            pageSize,
          },
        })
        .then((response) => {
          dispatch(getPersonalQuickTestHistorySuccess(response?.data ?? {}));
          resolve();
        })
        .catch((error) => {
          dispatch(getPersonalQuickTestHistoryFailure(error));
          reject();
        });
    });

const getQuickTestsWithoutDispatch = ({
  from = '',
  to = '',
  personName = '',
  phoneNumber = '',
  houseNumber = '',
  provinceCode = '',
  districtCode = '',
  wardCode = '',
  unitId = '',
  samplingPlaceId = '',
  examinationTypeId = '',
  resultType = '',
  status = QUICK_TEST_STATUSES.DONE,
  pageIndex = undefined,
  pageSize = undefined,
}) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.quickTest.get(),
        params: {
          from,
          to,
          personName,
          phoneNumber,
          houseNumber,
          provinceCode,
          districtCode,
          wardCode,
          unitId,
          samplingPlaceId,
          examinationTypeId,
          resultType,
          status,
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        resolve(response?.data ?? {});
      })
      .catch((error) => {
        reject(error);
      });
  });

const getPositiveQuickTestsRequest = () => ({
  type: types.GET_POSITIVE_QUICK_TESTS_REQUEST,
});
const getPositiveQuickTestsSuccess = (response) => ({
  type: types.GET_POSITIVE_QUICK_TESTS_SUCCESS,
  payload: response,
});
const getPositiveQuickTestsFailure = (error) => ({
  type: types.GET_POSITIVE_QUICK_TESTS_FAILURE,
  payload: error,
});
const getPositiveQuickTests = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getPositiveQuickTestsRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.quickTest.getPositiveQuickTests,
        data,
      })
      .then((response) => {
        dispatch(getPositiveQuickTestsSuccess(response?.data ?? {}));
        resolve();
      })
      .catch((error) => {
        dispatch(getPositiveQuickTestsFailure(error));
        reject();
      });
  });


const createQuickTestRequest = () => ({
  type: types.CREATE_QUICK_TEST_REQUEST,
});
const createQuickTestSuccess = (response) => ({
  type: types.CREATE_QUICK_TEST_SUCCESS,
  payload: response,
});
const createQuickTestFailure = (error) => ({
  type: types.CREATE_QUICK_TEST_FAILURE,
  payload: error,
});
const createQuickTest = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createQuickTestRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.quickTest.create,
        data,
      })
      .then((response) => {
        // toast.success('Tạo mẫu thành công');
        dispatch(createQuickTestSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        // toast.warn(error?.response?.data ?? '');
        dispatch(createQuickTestFailure(error));
        reject(error);
      });
  });

const createQuickTestWithProfileRequest = () => ({
  type: types.CREATE_QUICK_TEST_WITH_PROFILE_REQUEST,
});
const createQuickTestWithProfileSuccess = (response) => ({
  type: types.CREATE_QUICK_TEST_WITH_PROFILE_SUCCESS,
  payload: response,
});
const createQuickTestWithProfileFailure = (error) => ({
  type: types.CREATE_QUICK_TEST_WITH_PROFILE_FAILURE,
  payload: error,
});
const createQuickTestWithProfile = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createQuickTestWithProfileRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.quickTest.createWithProfile,
        data,
      })
      .then((response) => {
        // toast.success('Tạo mẫu thành công');
        dispatch(createQuickTestWithProfileSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        // toast.warn(error?.response?.data ?? '');
        dispatch(createQuickTestWithProfileFailure(error));
        reject(error);
      });
  });

const createBatchQuickTestRequest = () => ({
  type: types.CREATE_BATCH_QUICK_TEST_REQUEST,
});
const createBatchQuickTestSuccess = (response) => ({
  type: types.CREATE_BATCH_QUICK_TEST_SUCCESS,
  payload: response,
});
const createBatchQuickTestFailure = (error) => ({
  type: types.CREATE_BATCH_QUICK_TEST_FAILURE,
  payload: error,
});
const createBatchQuickTest = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createBatchQuickTestRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.quickTest.createBatch,
        data,
      })
      .then((response) => {
        toast.success('Tạo mẫu thành công');
        dispatch(createBatchQuickTestSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(error?.response?.data ?? '');
        dispatch(createBatchQuickTestFailure(error));
        reject();
      });
  });

const createBatchQuickTestWithProfileRequest = () => ({
  type: types.CREATE_BATCH_QUICK_TEST_REQUEST,
});
const createBatchQuickTestWithProfileSuccess = (response) => ({
  type: types.CREATE_BATCH_QUICK_TEST_SUCCESS,
  payload: response,
});
const createBatchQuickTestWithProfileFailure = (error) => ({
  type: types.CREATE_BATCH_QUICK_TEST_FAILURE,
  payload: error,
});
const createBatchQuickTestWithProfile = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createBatchQuickTestWithProfileRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.quickTest.createBatchWithProfile,
        data,
      })
      .then((response) => {
        const responseData = response?.data?.data;
        toast.success(`Tạo mẫu thành công${responseData ? `: ${responseData?.success}/${responseData?.total}` : ''}`);
        dispatch(createBatchQuickTestWithProfileSuccess(responseData));
        resolve(response.data);
      })
      .catch((error) => {
        const responseData = error?.response?.data?.data;
        toast.warn(responseData?.errorMessage ?? 'Lỗi không xác định');
        dispatch(createBatchQuickTestWithProfileFailure(error));
        reject();
      });
  });

const createAssignQuickTestRequest = () => ({
  type: types.CREATE_ASSIGN_QUICK_TEST_REQUEST,
});
const createAssignQuickTestSuccess = (response) => ({
  type: types.CREATE_ASSIGN_QUICK_TEST_SUCCESS,
  payload: response,
});
const createAssignQuickTestFailure = (error) => ({
  type: types.CREATE_ASSIGN_QUICK_TEST_FAILURE,
  payload: error,
});
const createAssignQuickTest = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createAssignQuickTestRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.quickTest.assign,
        data,
      })
      .then((response) => {
        toast.success('Tạo chỉ định thành công');
        dispatch(createAssignQuickTestSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(error?.response?.data ?? 'Lỗi không xác định');
        dispatch(createAssignQuickTestFailure(error));
        reject();
      });
  });

const updateQuickTestRequest = () => ({
  type: types.UPDATE_QUICK_TEST_REQUEST,
});
const updateQuickTestSuccess = (response) => ({
  type: types.UPDATE_QUICK_TEST_SUCCESS,
  payload: response,
});
const updateQuickTestFailure = (error) => ({
  type: types.UPDATE_QUICK_TEST_FAILURE,
  payload: error,
});
const updateQuickTest = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateQuickTestRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.quickTest.update,
        data,
      })
      .then((response) => {
        toast.warn('Đã cập nhật thành công');
        dispatch(updateQuickTestSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateQuickTestFailure(error));
        reject(error);
      });
  });

const updateQuickTestByAdminRequest = () => ({
  type: types.UPDATE_QUICK_TEST_BY_ADMIN_REQUEST,
});
const updateQuickTestByAdminSuccess = (response) => ({
  type: types.UPDATE_QUICK_TEST_BY_ADMIN_SUCCESS,
  payload: response,
});
const updateQuickTestByAdminFailure = (error) => ({
  type: types.UPDATE_QUICK_TEST_BY_ADMIN_FAILURE,
  payload: error,
});
const updateQuickTestByAdmin = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateQuickTestByAdminRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.quickTest.updateByAdmin,
        data,
      })
      .then((response) => {
        toast.warn('Đã cập nhật thành công');
        dispatch(updateQuickTestByAdminSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(updateQuickTestByAdminFailure(error));
        reject(error);
      });
  });

const deleteQuickTestRequest = () => ({
  type: types.DELETE_QUICK_TEST_REQUEST,
});
const deleteQuickTestSuccess = (response) => ({
  type: types.DELETE_QUICK_TEST_SUCCESS,
  payload: response,
});
const deleteQuickTestFailure = (error) => ({
  type: types.DELETE_QUICK_TEST_FAILURE,
  payload: error,
});
const deleteQuickTest = (quickTestId, forceDelete = false) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteQuickTestRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.quickTest.delete(quickTestId),
        params: {
          forceDelete,
        },
      })
      .then((response) => {
        toast.success(`Đã xoá thành công test nhanh ${quickTestId}`);
        dispatch(deleteQuickTestSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(deleteQuickTestFailure(error));
        reject(error);
      });
  });

const deleteQuickTestByAdminRequest = () => ({
  type: types.DELETE_QUICK_TEST_BY_ADMIN_REQUEST,
});
const deleteQuickTestByAdminSuccess = (response) => ({
  type: types.DELETE_QUICK_TEST_BY_ADMIN_SUCCESS,
  payload: response,
});
const deleteQuickTestByAdminFailure = (error) => ({
  type: types.DELETE_QUICK_TEST_BY_ADMIN_FAILURE,
  payload: error,
});
const deleteQuickTestByAdmin = (quickTestId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteQuickTestByAdminRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.quickTest.deleteByAdmin(quickTestId),
      })
      .then((response) => {
        toast.success(`Đã xoá thành công test nhanh ${quickTestId}`);
        dispatch(deleteQuickTestByAdminSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(deleteQuickTestByAdminFailure(error));
        reject(error);
      });
  });

const recoveryQuickTestRequest = () => ({
  type: types.RECOVERY_QUICK_TEST_REQUEST,
});
const recoveryQuickTestSuccess = (response) => ({
  type: types.RECOVERY_QUICK_TEST_SUCCESS,
  payload: response,
});
const recoveryQuickTestFailure = (error) => ({
  type: types.RECOVERY_QUICK_TEST_FAILURE,
  payload: error,
});
const recoveryQuickTest = (quickTestId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(recoveryQuickTestRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.quickTest.recovery(quickTestId),
      })
      .then((response) => {
        toast.success(`Đã khôi phục test nhanh ${quickTestId}`);
        dispatch(recoveryQuickTestSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(getExaminationError(error.response?.data));
        dispatch(recoveryQuickTestFailure(error));
        reject(error);
      });
  });


const setAssignQuickTestSession = (payload) => ({ type: types.ASSIGN_QUICK_TEST_SESSION, payload });

const publishQuickTestRequest = () => ({
  type: types.PUBLISH_QUICK_TEST_REQUEST,
});
const publishQuickTestSuccess = (response) => ({
  type: types.PUBLISH_QUICK_TEST_SUCCESS,
  payload: response,
});
const publishQuickTestFailure = (error) => ({
  type: types.PUBLISH_QUICK_TEST_FAILURE,
  payload: error,
});
const publishQuickTest = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(publishQuickTestRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.quickTest.publish,
        data,
      })
      .then((response) => {
        dispatch(publishQuickTestSuccess(response?.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(publishQuickTestFailure(error));
        reject();
      });
  });

const changeProfileQuickTestRequest = () => ({ type: types.CHANGE_PROFILE_QUICK_TEST_REQUEST });
const changeProfileQuickTestSuccess = (response) => ({
  type: types.CHANGE_PROFILE_QUICK_TEST_SUCCESS,
  payload: response,
});
const changeProfileQuickTestFailure = (error) => ({
  type: types.CHANGE_PROFILE_QUICK_TEST_FAILURE,
  payload: error,
});

const changeProfileQuickTest =
  ({ quickTestId, profileId }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(changeProfileQuickTestRequest());
        httpClient
          .callApi({
            method: 'PUT',
            url: apiLinks.quickTest.changeProfile,
            params: { quickTestId, profileId },
          })
          .then((response) => {
            toast.success('Đổi hồ sơ thành công');
            dispatch(changeProfileQuickTestSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            toast.warn(getExaminationError(error.response.data));
            dispatch(changeProfileQuickTestFailure(error.response.data));
            reject(getExaminationError(error.response.data));
          });
      });

const importQuickTestJsonRequest = () => ({ type: types.IMPORT_QUICK_TEST_JSON_REQUEST });
const importQuickTestJsonSuccess = (response) => ({
  type: types.IMPORT_QUICK_TEST_JSON_SUCCESS,
  payload: response,
});
const importQuickTestJsonFailure = (error) => ({
  type: types.IMPORT_QUICK_TEST_JSON_FAILURE,
  payload: error,
});

const importQuickTestJson = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(importQuickTestJsonRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.quickTest.importJson,
        data,
      })
      .then((response) => {
        dispatch(importQuickTestJsonSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(importQuickTestJsonFailure(error));
        reject(error);
      });
  });

export {
  setExaminationInputCache,
  getUnitInfo,
  selectMedicalTest,
  toggleCreateModal,
  toggleEditModal,
  getMedicalTest,
  getMedicalTests,
  createMedicalTest,
  updateMedicalTest,
  deleteMedicalTest,
  getMedicalTestZones,
  getMedicalTestZonesPrefix,
  updateMedicalTestZone,
  deleteMedicalTestZone,
  createMedicalTestZone,
  getMedicalTestCodes,
  createMedicalTestCode,
  getPrintedCode,
  getAllZones,
  publishCode,
  printCode,
  publishCodeByZone,
  printCodeByZone,
  rePrintCodeByZone,
  rePrintCodeFrom,
  getDiseases,
  getDiseaseSamples,
  getExaminationTypes,
  getAssigneesByUnit,
  createExamination,
  getUnavailableCodes,
  getAvailableCodes,
  getUnits,
  getPrefixes,
  createCode,
  createUnit,
  updateUnit,
  deleteUnit,
  getUnitTypes,
  createUnitType,
  updateAssign,
  getAssignees,
  getExaminations,
  getExaminationByPerson,
  getExaminationDetails,
  getExaminationNormalDetails,
  getExaminationUrgencyDetails,
  updateExamination,
  deleteExamination,
  getAvailableDiseaseToPrint,
  getAvailableDiseaseToPublish,
  getAvailableCodeToPrint,
  getAvailableCodeToPublish,
  getAvailableCodesToUse,
  getRePrintDisease,
  getRePrintCode,
  cancelAssign,
  updateExamDetail,
  getExaminationDetail,
  getPositiveExaminationDetail,
  getUsedCode,
  getOtherCode,
  uploadExaminationFile,
  setUploadExaminationProgress,
  createBatchUnit,
  getAvailableUnitsToPublish,
  publishBatchUnit,
  assignWithCodeOnly,
  exportExamFile,
  getExaminationDetailsAvailableForTestSession,
  getAllExaminationDetailsAvailableForTestSessionList,
  getAvailableDayByUnitForExportExamination,
  exportExaminationResult,
  getByProfileId,
  createProfileFromExamination,
  mergeProfile,
  changeProfile,
  importInformation,
  getAvailableDayByUnitForExportExaminationHCDC,
  exportExaminationResultHCDC,
  createAssignWithProfile,
  createAssignWithDate,
  exportExamBook,
  getExaminationByDetail,
  updateProfile,
  exportExaminationFile,
  getAvailableDatesForTakenExamList,
  exportByTaken,
  getUnitConfigs,
  createUnitConfig,
  updateUnitConfig,
  deleteUnitConfig,
  updateCode,
  exportByRange,
  exportResultFromExcel,
  exportByDateReceived,
  getPersonalExamHistory,
  uploadProfilesFromExcel,
  importAssigns,
  changeProfileBatch,
  createGroupProfile,
  getSamplingPlaces,
  markAsUnsatisfactorySample,
  unMarkAsUnsatisfactorySample,
  exportStatisticExaminationByCodes,
  clearExaminationDetailFilter,
  getQuickTests,
  getQuickTestsByUnitType,
  getQuickTestsByManagementUnit,
  getQuickTestsWithoutDispatch,
  getPersonalQuickTestHistory,
  getPositiveQuickTests,
  createQuickTest,
  createQuickTestWithProfile,
  createBatchQuickTest,
  createBatchQuickTestWithProfile,
  createAssignQuickTest,
  updateQuickTest,
  updateQuickTestByAdmin,
  deleteQuickTest,
  deleteQuickTestByAdmin,
  recoveryQuickTest,
  setAssignQuickTestSession,
  publishQuickTest,
  getDeletedQuickTests,
  changeProfileQuickTest,
  importQuickTestJson,
};
