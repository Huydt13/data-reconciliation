import apiLinks from 'app/utils/api-links';
import httpClient from 'app/utils/http-client';
import types from 'contact/actions/types';

const selectEstate = (estate) => ({
  type: types.SELECT_ESTATE,
  payload: estate,
});
const selectAirplane = (airplane) => ({
  type: types.SELECT_AIRPLANE,
  payload: airplane,
});
const selectVehicle = (vehicle) => ({
  type: types.SELECT_VEHICLE,
  payload: vehicle,
});

const getLocationVisitorsRequest = () => ({
  type: types.GET_LOCATION_VISITORS_REQUEST,
});
const getLocationVisitorsSuccess = (response) => ({
  type: types.GET_LOCATION_VISITORS_SUCCESS,
  payload: response,
});
const getLocationVisitorsFailure = () => ({
  type: types.GET_LOCATION_VISITORS_FAILURE,
});

const getLocationVisitors =
  ({ locationId, locationType, fromTime, pageIndex, pageSize }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getLocationVisitorsRequest());
      httpClient
        .callApi({
          url: apiLinks.contacts.getVisitors,
          params: { locationId, locationType, fromTime, pageIndex, pageSize },
        })
        .then(({ data }) => {
          dispatch(getLocationVisitorsSuccess(data));
          resolve(data);
        })
        .catch(() => {
          dispatch(getLocationVisitorsFailure());
          reject();
        });
    });

const addLocationVisitorsRequest = () => ({
  type: types.ADD_LOCATION_VISITORS_REQUEST,
});
const addLocationVisitorsSuccess = (response) => ({
  type: types.ADD_LOCATION_VISITORS_SUCCESS,
  payload: response,
});
const addLocationVisitorsFailure = () => ({
  type: types.ADD_LOCATION_VISITORS_FAILURE,
});

const addLocationVisitors = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(addLocationVisitorsRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.contacts.addVisitors,
        data,
      })
      .then((response) => {
        dispatch(addLocationVisitorsSuccess(response.data));
        resolve();
      })
      .catch(() => {
        dispatch(addLocationVisitorsFailure());
        reject();
      });
  });

const removeLocationVisitorRequest = () => ({
  type: types.REMOVE_LOCATION_VISITOR_REQUEST,
});
const removeLocationVisitorSuccess = (response) => ({
  type: types.REMOVE_LOCATION_VISITOR_SUCCESS,
  payload: response,
});
const removeLocationVisitorFailure = () => ({
  type: types.REMOVE_LOCATION_VISITOR_FAILURE,
});

const removeLocationVisitor = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(removeLocationVisitorRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.contacts.getVisitors,
        data,
      })
      .then((response) => {
        dispatch(removeLocationVisitorSuccess(response.data));
        resolve();
      })
      .catch(() => {
        dispatch(removeLocationVisitorFailure());
        reject();
      });
  });

const getProfileListRequest = () => ({ type: types.GET_PROFILE_LIST_REQUEST });
const getProfileListSuccess = (response) => ({
  type: types.GET_PROFILE_LIST_SUCCESS,
  payload: response,
});
const getProfileListFailure = () => ({ type: types.GET_PROFILE_LIST_FAILURE });

const getProfileList = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getProfileListRequest());
    httpClient
      .callApi({
        url: `${apiLinks.infectionChain.subjects.getProfileList}?${data
          .map((id) => `profileIds=${id}`)
          .join('&')}`,
      })
      .then((response) => {
        dispatch(getProfileListSuccess(response.data));
        resolve(response.data);
      })
      .catch(() => {
        dispatch(getProfileListFailure());
        reject();
      });
  });

const checkEstateName = (name) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        url: apiLinks.contacts.checkEstateName + name,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });
export {
  selectEstate,
  selectAirplane,
  selectVehicle,
  getLocationVisitors,
  addLocationVisitors,
  removeLocationVisitor,
  getProfileList,
  checkEstateName,
};
