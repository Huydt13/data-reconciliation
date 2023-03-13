import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

// import { LocationType } from 'infection-chain/utils/constants';
import types from './types';

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

const getContactLocations =
  ({
    name = '',
    type,
    provinceValue = '',
    districtValue = '',
    wardValue = '',
    isHotpost,
    pageSize = 0,
    pageIndex = 0,
  }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getContactLocationsRequest());
      httpClient
        .callApi({
          method: 'GET',
          url: `${apiLinks.contactLocation()}Search`,
          params: {
            name,
            type,
            provinceValue,
            districtValue,
            wardValue,
            isHotpost,
            pageSize,
            pageIndex,
          },
        })
        .then((response) => {
          dispatch(getContactLocationsSuccess(response.data));
          resolve();
        })
        .catch((error) => {
          dispatch(getContactLocationsFailure(error));
          reject();
        });
    });

const getOutbreakLocationRequest = () => ({
  type: types.GET_OUTBREAK_LOCATION_REQUEST,
});
const getOutbreakLocationSuccess = (response) => ({
  type: types.GET_OUTBREAK_LOCATION_SUCCESS,
  payload: response,
});
const getOutbreakLocationFailure = (error) => ({
  type: types.GET_OUTBREAK_LOCATION_FAILURE,
  payload: error,
});

const getOutbreakLocation = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getOutbreakLocationRequest());
    httpClient
      .callApi({
        url: apiLinks.contacts.outbreakSearch,
      })
      .then((response) => {
        dispatch(getOutbreakLocationSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getOutbreakLocationFailure(error));
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
        data,
        url: apiLinks.contactLocation(),
      })
      .then((response) => {
        dispatch(updateContactLocationSuccess(response.data));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        dispatch(updateContactLocationFailure(error));
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
        data,
        url: apiLinks.contactLocation(),
      })
      .then((response) => {
        dispatch(createContactLocationSuccess(response.data));
        toast.success('Thành công');
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(createContactLocationFailure(error));
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

const deleteContactLocation = (contactLocationId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteContactLocationRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.contactLocation(contactLocationId),
      })
      .then((response) => {
        dispatch(deleteContactLocationSuccess(response.data));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        dispatch(deleteContactLocationFailure(error));
        reject();
      });
  });

const getContactVehiclesRequest = () => ({
  type: types.GET_CONTACT_VEHICLES_REQUEST,
});
const getContactVehiclesSuccess = (response) => ({
  type: types.GET_CONTACT_VEHICLES_SUCCESS,
  payload: response,
});
const getContactVehiclesFailure = (error) => ({
  type: types.GET_CONTACT_VEHICLES_FAILURE,
  payload: error,
});

const getContactVehicles = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getContactVehiclesRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.contactVehicle(),
      })
      .then((response) => {
        dispatch(getContactVehiclesSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getContactVehiclesFailure(error));
        reject();
      });
  });

const updateContactVehicleRequest = () => ({
  type: types.UPDATE_CONTACT_VEHICLE_REQUEST,
});
const updateContactVehicleSuccess = (response) => ({
  type: types.UPDATE_CONTACT_VEHICLE_SUCCESS,
  payload: response,
});
const updateContactVehicleFailure = (error) => ({
  type: types.UPDATE_CONTACT_VEHICLE_FAILURE,
  payload: error,
});

const updateContactVehicle = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateContactVehicleRequest());
    httpClient
      .callApi({
        method: 'PUT',
        data,
        url: apiLinks.contactVehicle(),
      })
      .then((response) => {
        dispatch(updateContactVehicleSuccess(response.data));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        dispatch(updateContactVehicleFailure(error));
        reject();
      });
  });

const createContactVehicleRequest = () => ({
  type: types.CREATE_CONTACT_VEHICLE_REQUEST,
});
const createContactVehicleSuccess = (response) => ({
  type: types.CREATE_CONTACT_VEHICLE_SUCCESS,
  payload: response,
});
const createContactVehicleFailure = (error) => ({
  type: types.CREATE_CONTACT_VEHICLE_FAILURE,
  payload: error,
});

const createContactVehicle = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createContactVehicleRequest());
    httpClient
      .callApi({
        method: 'POST',
        data,
        url: apiLinks.contactVehicle(),
      })
      .then((response) => {
        dispatch(createContactVehicleSuccess(response.data));
        toast.success('Thành công');
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(createContactVehicleFailure(error));
        reject();
      });
  });

const deleteContactVehicleRequest = () => ({
  type: types.DELETE_CONTACT_VEHICLE_REQUEST,
});
const deleteContactVehicleSuccess = (response) => ({
  type: types.DELETE_CONTACT_VEHICLE_SUCCESS,
  payload: response,
});
const deleteContactVehicleFailure = (error) => ({
  type: types.DELETE_CONTACT_VEHICLE_FAILURE,
  payload: error,
});

const deleteContactVehicle = (contactVehicleId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteContactVehicleRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.contactVehicle(contactVehicleId),
      })
      .then((response) => {
        dispatch(deleteContactVehicleSuccess(response.data));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        dispatch(deleteContactVehicleFailure(error));
        reject();
      });
  });

const getCriteriasRequest = () => ({ type: types.GET_CRITERIAS_REQUEST });
const getCriteriasSuccess = (response) => ({
  type: types.GET_CRITERIAS_SUCCESS,
  payload: response,
});
const getCriteriasFailure = (error) => ({
  type: types.GET_CRITERIAS_FAILURE,
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

const getCriteriasByInfectionTypeRequest = () => ({
  type: types.GET_CRITERIAS_BY_INFECTION_TYPE_REQUEST,
});
const getCriteriasByInfectionTypeSuccess = (response) => ({
  type: types.GET_CRITERIAS_BY_INFECTION_TYPE_SUCCESS,
  payload: response,
});
const getCriteriasByInfectionTypeFailure = (error) => ({
  type: types.GET_CRITERIAS_BY_INFECTION_TYPE_FAILURE,
  payload: error,
});

const getCriteriasByInfectionType = (infectionTypeId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getCriteriasByInfectionTypeRequest());
    httpClient
      .callApi({
        url: `${apiLinks.investigationCrtieriaCategories.getNextLevel}${infectionTypeId}/NextLevel`,
      })
      .then((response) => {
        dispatch(getCriteriasByInfectionTypeSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getCriteriasByInfectionTypeFailure(error));
        reject();
      });
  });

const getAskingRequest = (isAskingSubjectFrom) => ({
  type: types.GET_ASKING_REQUEST,
  payload: isAskingSubjectFrom,
});
const getAskingSuccess = (response, isAskingSubjectFrom) => ({
  type: types.GET_ASKING_SUCCESS,
  payload: { response, isAskingSubjectFrom },
});
const getAskingFailure = (error) => ({
  type: types.GET_ASKING_FAILURE,
  payload: error,
});

const getAsking =
  (contactId, subjectId, askingsIsOfFromSubject) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getAskingRequest(askingsIsOfFromSubject));
      httpClient
        .callApi({
          method: 'GET',
          url: apiLinks.getAsking(contactId, subjectId),
          params: {
            askingsIsOfFromSubject,
          },
        })
        .then((response) => {
          dispatch(getAskingSuccess(response.data, askingsIsOfFromSubject));
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(getAskingFailure(error));
          reject();
        });
    });

const getAskingResultRequest = () => ({
  type: types.GET_ASKING_RESULT_REQUEST,
});
const getAskingResultSuccess = (response) => ({
  type: types.GET_ASKING_RESULT_SUCCESS,
  payload: response,
});
const getAskingResultFailure = (error) => ({
  type: types.GET_ASKING_RESULT_FAILURE,
  payload: error,
});

const getAskingResult = (criterias) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAskingResultRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.investigationCrtieriaCategories.assertResult,
        data: { investigationCriteriaIds: criterias.map((c) => c.categoryId) },
      })
      .then((response) => {
        dispatch(getAskingResultSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getAskingResultFailure(error));
        reject();
      });
  });

const updateAskingRequest = () => ({ type: types.UPDATE_ASKING_REQUEST });
const updateAskingSuccess = (response) => ({
  type: types.UPDATE_ASKING_SUCCESS,
  payload: response,
});
const updateAskingFailure = (error) => ({
  type: types.UPDATE_ASKING_FAILURE,
  payload: error,
});

const updateAsking =
  (contactId, subjectId, criterias, askingsIsOfFromSubject) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(updateAskingRequest());
      httpClient
        .callApi({
          method: 'PUT',
          url: apiLinks.putAsking(contactId, subjectId),
          params: { askingsIsOfFromSubject },
          data: criterias,
        })
        .then((response) => {
          dispatch(updateAskingSuccess(response.data));
          // toast.success('Thành công', { toastId: 'contact' });
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(updateAskingFailure(error));
          reject();
        });
    });

const concludeAskingRequest = () => ({ type: types.CONCLUDE_ASKING_REQUEST });
const concludeAskingSuccess = (response) => ({
  type: types.CONCLUDE_ASKING_SUCCESS,
  payload: response,
});
const concludeAskingFailure = (error) => ({
  type: types.CONCLUDE_ASKING_FAILURE,
  payload: error,
});

const concludeAsking = (contactId, subjectId, type) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(concludeAskingRequest());
    httpClient
      .callApi({
        method: 'PUT',
        contentType: 'text/plain',
        url: `${apiLinks.putAsking(contactId, subjectId)}/Conclude`,
        data: {
          subjectType: type,
        },
      })
      .then((response) => {
        dispatch(concludeAskingSuccess(response.data));
        toast.success('Thành công');
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(concludeAskingFailure(error));
        reject();
      });
  });

const searchLocationRequest = () => ({ type: types.SEARCH_LOCATION_REQUEST });
const searchLocationSuccess = (response) => ({
  type: types.SEARCH_LOCATION_SUCCESS,
  payload: response,
});
const searchLocationFailure = (error) => ({
  type: types.SEARCH_LOCATION_FAILURE,
  payload: error,
});

const searchLocation =
  ({
    name = '',
    type,
    provinceValue,
    districtValue,
    wardValue,
    pageSize,
    pageIndex,
  }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(searchLocationRequest());
      httpClient
        .callApi({
          url: apiLinks.contacts.estateSearch,
          params: {
            name,
            locationType: type,
            provinceValue,
            districtValue,
            wardValue,
            pageSize: pageSize || 0,
            pageIndex,
          },
        })
        .then((response) => {
          dispatch(searchLocationSuccess(response.data));
          resolve();
        })
        .catch((error) => {
          dispatch(searchLocationFailure(error));
          reject();
        });
    });

const getLocationDetail = (id, locationType) => () =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        url: apiLinks.contacts.getLocationDetail + id,
        params: { locationType },
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch(reject);
  });

const searchAirplaneRequest = () => ({ type: types.SEARCH_AIRPLANE_REQUEST });
const searchAirplaneSuccess = (response) => ({
  type: types.SEARCH_AIRPLANE_SUCCESS,
  payload: response,
});
const searchAirplaneFailure = (error) => ({
  type: types.SEARCH_AIRPLANE_FAILURE,
  payload: error,
});

// api cũ
const searchAirplane =
  ({ flightNumber, fromTime, pageIndex, pageSize }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(searchAirplaneRequest());
      httpClient
        .callApi({
          url: apiLinks.contacts.airplaneSearch,
          params: {
            flightNumber,
            fromTime,
            pageIndex,
            pageSize: pageSize || 0,
          },
        })
        .then((response) => {
          dispatch(searchAirplaneSuccess(response.data));
          resolve();
        })
        .catch((error) => {
          dispatch(searchAirplaneFailure(error));
          reject();
        });
    });

const searchOtherVehicleRequest = () => ({
  type: types.SEARCH_OTHER_VEHICLE_REQUEST,
});
const searchOtherVehicleSuccess = (response) => ({
  type: types.SEARCH_OTHER_VEHICLE_SUCCESS,
  payload: response,
});
const searchOtherVehicleFailure = (error) => ({
  type: types.SEARCH_OTHER_VEHICLE_FAILURE,
  payload: error,
});

const searchOtherVehicle =
  ({ name, liscencePlateNumber, vehicleType, pageSize, pageIndex }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(searchOtherVehicleRequest());
      httpClient
        .callApi({
          url: apiLinks.contacts.vehicleSearch,
          params: {
            name,
            liscencePlateNumber,
            vehicleType,
            pageSize: pageSize || 0,
            pageIndex,
          },
        })
        .then((response) => {
          dispatch(searchOtherVehicleSuccess(response.data));
          resolve();
        })
        .catch((error) => {
          dispatch(searchOtherVehicleFailure(error));
          reject();
        });
    });

const updateEstateRequest = () => ({
  type: types.UPDATE_ESTATE_REQUEST,
});
const updateEstateSuccess = (response) => ({
  type: types.UPDATE_ESTATE_SUCCESS,
  payload: response,
});
const updateEstateFailure = (error) => ({
  type: types.UPDATE_ESTATE_FAILURE,
  payload: error,
});

const updateEstate = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateEstateRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.contacts.updateEstate + data.id,
        data,
      })
      .then((response) => {
        dispatch(updateEstateSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(updateEstateFailure(error));
        reject();
      });
  });

const createLocationRequest = () => ({
  type: types.CREATE_LOCATION_REQUEST,
});
const createLocationSuccess = (response) => ({
  type: types.CREATE_LOCATION_SUCCESS,
  payload: response,
});
const createLocationFailure = (error) => ({
  type: types.CREATE_LOCATION_FAILURE,
  payload: error,
});

const createLocation = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createLocationRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.contacts.createLocation,
        data,
      })
      .then((response) => {
        dispatch(createLocationSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(createLocationFailure(error));
        reject();
      });
  });

const clearAsking = () => ({ type: types.CLEAR_ASKING });

export {
  getContactLocations,
  getOutbreakLocation,
  updateContactLocation,
  createContactLocation,
  deleteContactLocation,
  getContactVehicles,
  getCriterias,
  getCriteriasByInfectionType,
  getAsking,
  updateAsking,
  concludeAsking,
  updateContactVehicle,
  createContactVehicle,
  deleteContactVehicle,
  getAskingResult,
  clearAsking,
  searchLocation,
  getLocationDetail,
  searchAirplane,
  searchOtherVehicle,
  updateEstate,
  createLocation,
};
