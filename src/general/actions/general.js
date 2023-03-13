import apiLinks from 'app/utils/api-links';
import httpClient from 'app/utils/http-client';
import types from './types';

const selectGeneral = (general) => ({
  type: types.SELECT_GENERAL,
  payload: general,
});

const getDiseaseTypesRequest = () => ({
  type: types.GET_DISEASE_TYPES_REQUEST,
});
const getDiseaseTypesSuccess = (response) => ({
  type: types.GET_DISEASE_TYPES_SUCCESS,
  payload: response,
});
const getDiseaseTypesFailure = (error) => ({
  type: types.GET_DISEASE_TYPES_FAILURE,
  payload: error,
});

const getDiseaseTypes = ({ pageIndex = 0, pageSize = 10 }) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getDiseaseTypesRequest());
    httpClient
      .callApi({
        url: apiLinks.general.diseaseTypes.get,
        params: {
          pageIndex,
          pageSize,
        },
      })
      .then((res) => {
        dispatch(getDiseaseTypesSuccess(res.data));
        resolve();
      })
      .catch((err) => {
        dispatch(getDiseaseTypesFailure(err));
        reject();
      });
  });

const createDiseaseTypeRequest = () => ({
  type: types.CREATE_DISEASE_TYPE_REQUEST,
});
const createDiseaseTypeSuccess = (response) => ({
  type: types.CREATE_DISEASE_TYPE_SUCCESS,
  payload: response,
});
const createDiseaseTypeFailure = (error) => ({
  type: types.CREATE_DISEASE_TYPE_FAILURE,
  payload: error,
});

const createDiseaseType = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createDiseaseTypeRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.general.diseaseTypes.create,
        data,
      })
      .then((res) => {
        dispatch(createDiseaseTypeSuccess(res));
        resolve();
      })
      .catch((err) => {
        dispatch(createDiseaseTypeFailure(err));
        reject();
      });
  });

const updateDiseaseTypeRequest = () => ({
  type: types.UPDATE_DISEASE_TYPE_REQUEST,
});
const updateDiseaseTypeSuccess = (response) => ({
  type: types.UPDATE_DISEASE_TYPE_SUCCESS,
  payload: response,
});
const updateDiseaseTypeFailure = (error) => ({
  type: types.UPDATE_DISEASE_TYPE_FAILURE,
  payload: error,
});

const updateDiseaseType = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateDiseaseTypeRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.general.diseaseTypes.update,
        data,
      })
      .then((res) => {
        dispatch(updateDiseaseTypeSuccess(res));
        resolve();
      })
      .catch((err) => {
        dispatch(updateDiseaseTypeFailure(err));
        reject();
      });
  });

const deleteDiseaseTypeRequest = () => ({
  type: types.DELETE_DISEASE_TYPE_REQUEST,
});
const deleteDiseaseTypeSuccess = (response) => ({
  type: types.DELETE_DISEASE_TYPE_SUCCESS,
  payload: response,
});
const deleteDiseaseTypeFailure = (error) => ({
  type: types.DELETE_DISEASE_TYPE_FAILURE,
  payload: error,
});

const deleteDiseaseType = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteDiseaseTypeRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.general.diseaseTypes.delete + id,
        params: { id },
      })
      .then((res) => {
        dispatch(deleteDiseaseTypeSuccess(res));
        resolve();
      })
      .catch((err) => {
        dispatch(deleteDiseaseTypeFailure(err));
        reject();
      });
  });

const getInfectionTypesRequest = () => ({
  type: types.GET_INFECTION_TYPES_REQUEST,
});
const getInfectionTypesSuccess = (response) => ({
  type: types.GET_INFECTION_TYPES_SUCCESS,
  payload: response,
});
const getInfectionTypesFailure = (error) => ({
  type: types.GET_INFECTION_TYPES_FAILURE,
  payload: error,
});

const getInfectionTypes = ({
  diseaseTypeId = undefined,
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) =>
  new Promise((resolve, reject) => {
    const url = diseaseTypeId
      ? `${apiLinks.general.diseaseTypes.get}/${diseaseTypeId}/InfectionTypes`
      : apiLinks.general.infectionTypes.get;
    dispatch(getInfectionTypesRequest());
    httpClient
      .callApi({
        url,
        params: { pageSize, pageIndex },
      })
      .then((res) => {
        dispatch(getInfectionTypesSuccess(res.data));
        resolve();
      })
      .catch((err) => {
        dispatch(getInfectionTypesFailure(err));
        reject();
      });
  });

const createInfectionTypeRequest = () => ({
  type: types.CREATE_INFECTION_TYPE_REQUEST,
});
const createInfectionTypeSuccess = (response) => ({
  type: types.CREATE_INFECTION_TYPE_SUCCESS,
  payload: response,
});
const createInfectionTypeFailure = (error) => ({
  type: types.CREATE_INFECTION_TYPE_FAILURE,
  payload: error,
});

const createInfectionType = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createInfectionTypeRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.general.infectionTypes.create,
        data,
      })
      .then((res) => {
        dispatch(createInfectionTypeSuccess(res));
        resolve();
      })
      .catch((err) => {
        dispatch(createInfectionTypeFailure(err));
        reject();
      });
  });

const updateInfectionTypeRequest = () => ({
  type: types.UPDATE_INFECTION_TYPE_REQUEST,
});
const updateInfectionTypeSuccess = (response) => ({
  type: types.UPDATE_INFECTION_TYPE_SUCCESS,
  payload: response,
});
const updateInfectionTypeFailure = (error) => ({
  type: types.UPDATE_INFECTION_TYPE_FAILURE,
  payload: error,
});

const updateInfectionType = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateInfectionTypeRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: `${apiLinks.general.infectionTypes.update}/${data.id}`,
        data,
      })
      .then((res) => {
        dispatch(updateInfectionTypeSuccess(res));
        resolve();
      })
      .catch((err) => {
        dispatch(updateInfectionTypeFailure(err));
        reject();
      });
  });

const deleteInfectionTypeRequest = () => ({
  type: types.DELETE_INFECTION_TYPE_REQUEST,
});
const deleteInfectionTypeSuccess = (response) => ({
  type: types.DELETE_INFECTION_TYPE_SUCCESS,
  payload: response,
});
const deleteInfectionTypeFailure = (error) => ({
  type: types.DELETE_INFECTION_TYPE_FAILURE,
  payload: error,
});

const deleteInfectionType = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteInfectionTypeRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.general.infectionTypes.delete + id,
        params: { id },
      })
      .then((res) => {
        dispatch(deleteInfectionTypeSuccess(res));
        resolve();
      })
      .catch((err) => {
        dispatch(deleteInfectionTypeFailure(err));
        reject();
      });
  });

const getCriteriasRequest = () => ({
  type: types.GET_INVESTIGATION_CRITERIAS_REQUEST,
});
const getCriteriasSuccess = (response) => ({
  type: types.GET_INVESTIGATION_CRITERIAS_SUCCESS,
  payload: response,
});
const getCriteriasFailure = (error) => ({
  type: types.GET_INVESTIGATION_CRITERIAS_FAILURE,
  payload: error,
});

const getCriterias = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getCriteriasRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.investigationCrtieriaCategories.get,
      })
      .then((response) => {
        dispatch(getCriteriasSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getCriteriasFailure(error));
        reject();
      });
  });

const createCriteriaRequest = () => ({ type: types.CREATE_CRITERIA_REQUEST });
const createCriteriaSuccess = (response) => ({
  type: types.CREATE_CRITERIA_SUCCESS,
  payload: response,
});
const createCriteriaFailure = (error) => ({
  type: types.CREATE_CRITERIA_FAILURE,
  payload: error,
});

const createCriteria = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createCriteriaRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.investigationCrtieriaCategories.create,
        data,
      })
      .then((response) => {
        dispatch(createCriteriaSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(createCriteriaFailure(error));
        reject();
      });
  });

const updateCriteriaRequest = () => ({ type: types.UPDATE_CRITERIA_REQUEST });
const updateCriteriaSuccess = (response) => ({
  type: types.UPDATE_CRITERIA_SUCCESS,
  payload: response,
});
const updateCriteriaFailure = (error) => ({
  type: types.UPDATE_CRITERIA_FAILURE,
  payload: error,
});

const updateCriteria = (categoryId, data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateCriteriaRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: `${apiLinks.investigationCrtieriaCategories.update}/${categoryId}/Criterias`,
        data: [data],
      })
      .then((response) => {
        dispatch(updateCriteriaSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(updateCriteriaFailure(error));
        reject();
      });
  });

const deleteCriteriaRequest = () => ({ type: types.DELETE_CRITERIA_REQUEST });
const deleteCriteriaSuccess = (response) => ({
  type: types.DELETE_CRITERIA_SUCCESS,
  payload: response,
});
const deleteCriteriaFailure = (error) => ({
  type: types.DELETE_CRITERIA_FAILURE,
  payload: error,
});

const deleteCriteria = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteCriteriaRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.investigationCrtieriaCategories.delete + id,
      })
      .then((response) => {
        dispatch(deleteCriteriaSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(deleteCriteriaFailure(error));
        reject();
      });
  });

export {
  selectGeneral,
  getDiseaseTypes,
  createDiseaseType,
  updateDiseaseType,
  deleteDiseaseType,
  getInfectionTypes,
  createInfectionType,
  updateInfectionType,
  deleteInfectionType,
  getCriterias,
  createCriteria,
  updateCriteria,
  deleteCriteria,
};
