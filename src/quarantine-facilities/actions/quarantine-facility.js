import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { toast } from 'react-toastify';

import types from './types';

const selectFacility = (facility) => ({
  type: types.SELECT_FACILITY,
  payload: facility,
});
const selectRoom = (room) => ({ type: types.SELECT_ROOM, payload: room });

const getFacilityInfoRequest = () => ({
  type: types.GET_FACILITY_INFO_REQUEST,
});
const getFacilityInfoSuccess = (response) => ({
  type: types.GET_FACILITY_INFO_SUCCESS,
  payload: response,
});
const getFacilityInfoFailure = (error) => ({
  type: types.GET_FACILITY_INFO_FAILURE,
  payload: error,
});

const getFacilityInfo = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getFacilityInfoRequest());
    httpClient
      .callApi({
        url: apiLinks.facilities.quarantineFacilities.getInfo,
      })
      .then((response) => {
        dispatch(getFacilityInfoSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getFacilityInfoFailure(error));
        reject();
      });
  });

const getFacilitiesRequest = () => ({ type: types.GET_FACILITIES_REQUEST });
const getFacilitiesSuccess = (response) => ({
  type: types.GET_FACILITIES_SUCCESS,
  payload: response,
});
const getFacilitiesFailure = (error) => ({
  type: types.GET_FACILITIES_FAILURE,
  payload: error,
});

const getFacilities = ({
  searchValue,
  districtValue,
  type,
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getFacilitiesRequest());
    httpClient
      .callApi({
        url: apiLinks.facilities.quarantineFacilities.get,
        params: {
          searchValue: searchValue || undefined,
          districtValue: districtValue || undefined,
          type: type === '' ? undefined : type,
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getFacilitiesSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getFacilitiesFailure(error));
        reject();
      });
  });

const createFacilityRequest = () => ({ type: types.CREATE_FACILITY_REQUEST });
const createFacilitySuccess = (response) => ({
  type: types.CREATE_FACILITY_SUCCESS,
  payload: response,
});
const createFacilityFailure = (error) => ({
  type: types.CREATE_FACILITY_FAILURE,
  payload: error,
});

const createFacility = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createFacilityRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.facilities.quarantineFacilities.create,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(createFacilitySuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(createFacilityFailure(error));
        reject(error.response.data);
      });
  });

const updateFacilityRequest = () => ({ type: types.UPDATE_FACILITY_REQUEST });
const updateFacilitySuccess = (response) => ({
  type: types.UPDATE_FACILITY_SUCCESS,
  payload: response,
});
const updateFacilityFailure = (error) => ({
  type: types.UPDATE_FACILITY_FAILURE,
  payload: error,
});

const updateFacility = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateFacilityRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.facilities.quarantineFacilities.update + data.id,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(updateFacilitySuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(updateFacilityFailure(error));
        reject();
      });
  });

const deleteFacilityRequest = () => ({ type: types.DELETE_FACILITY_REQUEST });
const deleteFacilitySuccess = (response) => ({
  type: types.DELETE_FACILITY_SUCCESS,
  payload: response,
});
const deleteFacilityFailure = (error) => ({
  type: types.DELETE_FACILITY_FAILURE,
  payload: error,
});

const deleteFacility = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteFacilityRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.facilities.quarantineFacilities.delete + id,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(deleteFacilitySuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(deleteFacilityFailure(error));
        reject();
      });
  });

const getRoomsRequest = () => ({ type: types.GET_ROOMS_REQUEST });
const getRoomsSuccess = (response) => ({
  type: types.GET_ROOMS_SUCCESS,
  payload: response,
});
const getRoomsFailure = (error) => ({
  type: types.GET_ROOMS_FAILURE,
  payload: error,
});

const getRooms = ({ id = '', pageIndex = 0, pageSize = 10 }) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getRoomsRequest());
    httpClient
      .callApi({
        url: `${apiLinks.facilities.quarantineFacilities.getRooms}/${id}/Rooms`,
        params: {
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getRoomsSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getRoomsFailure(error));
        reject();
      });
  });

const getAvailableRoomsRequest = () => ({
  type: types.GET_AVAILABLE_ROOMS_REQUEST,
});
const getAvailableRoomsSuccess = (response) => ({
  type: types.GET_AVAILABLE_ROOMS_SUCCESS,
  payload: response,
});
const getAvailableRoomsFailure = (error) => ({
  type: types.GET_AVAILABLE_ROOMS_FAILURE,
  payload: error,
});

const getAvailableRooms = ({ id = '', pageIndex = 0, pageSize = 10 }) => (
  dispatch,
) =>
  new Promise((resolve, reject) => {
    dispatch(getAvailableRoomsRequest());
    httpClient
      .callApi({
        url: `${apiLinks.facilities.quarantineFacilities.getAvailableRooms}/${id}/AvailableRooms`,
        params: {
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getAvailableRoomsSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getAvailableRoomsFailure(error));
        reject();
      });
  });

const createRoomsRequest = () => ({ type: types.CREATE_ROOMS_REQUEST });
const createRoomsSuccess = (response) => ({
  type: types.CREATE_ROOMS_SUCCESS,
  payload: response,
});
const createRoomsFailure = (error) => ({
  type: types.CREATE_ROOMS_FAILURE,
  payload: error,
});

const createRooms = (facilityId, data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createRoomsRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: `${apiLinks.facilities.quarantineFacilities.createRooms}/${facilityId}/Rooms/`,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(createRoomsSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(createRoomsFailure(error));
        reject();
      });
  });

const updateRoomRequest = () => ({ type: types.UPDATE_ROOM_REQUEST });
const updateRoomSuccess = (response) => ({
  type: types.UPDATE_ROOM_SUCCESS,
  payload: response,
});
const updateRoomFailure = (error) => ({
  type: types.UPDATE_ROOM_FAILURE,
  payload: error,
});

const updateRoom = (facilityId, data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateRoomRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: `${apiLinks.facilities.quarantineFacilities.updateRoom}/${facilityId}/Rooms/${data.id}`,
        data,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(updateRoomSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(updateRoomFailure(error));
        reject();
      });
  });

const deleteRoomRequest = () => ({ type: types.DELETE_ROOM_REQUEST });
const deleteRoomSuccess = (response) => ({
  type: types.DELETE_ROOM_SUCCESS,
  payload: response,
});
const deleteRoomFailure = (error) => ({
  type: types.DELETE_ROOM_FAILURE,
  payload: error,
});

const deleteRoom = (facilityId, id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteRoomRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: `${apiLinks.facilities.quarantineFacilities.deleteRoom}/${facilityId}/Rooms/${id}`,
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(deleteRoomSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(deleteRoomFailure(error));
        reject();
      });
  });

const getWaitingListRequest = () => ({ type: types.GET_WAITING_LIST_REQUEST });
const getWaitingListSuccess = (response) => ({
  type: types.GET_WAITING_LIST_SUCCESS,
  payload: response,
});
const getWaitingListFailure = (error) => ({
  type: types.GET_WAITING_LIST_FAILURE,
  payload: error,
});

const getWaitingList = ({ facilityId, pageIndex = 0, pageSize = 10 }) => (
  dispatch,
) =>
  new Promise((resolve, reject) => {
    dispatch(getWaitingListRequest());
    httpClient
      .callApi({
        url: apiLinks.facilities.quarantineFacilities.getWaitingList,
        params: {
          facilityId: facilityId || undefined,
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getWaitingListSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getWaitingListFailure(error));
        reject();
      });
  });

const getWaitingListByFacilityRequest = () => ({
  type: types.GET_WAITING_LIST_BY_FACILITY_REQUEST,
});
const getWaitingListByFacilitySuccess = (response) => ({
  type: types.GET_WAITING_LIST_BY_FACILITY_SUCCESS,
  payload: response,
});
const getWaitingListByFacilityFailure = (error) => ({
  type: types.GET_WAITING_LIST_BY_FACILITY_FAILURE,
  payload: error,
});

const getWaitingListByFacility = ({
  id = '',
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getWaitingListByFacilityRequest());
    httpClient
      .callApi({
        url: `${apiLinks.facilities.quarantineFacilities.getWaitingListByFacility}/${id}/WaitingList`,
        params: {
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getWaitingListByFacilitySuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getWaitingListByFacilityFailure(error));
        reject();
      });
  });

const getInHomeRequest = () => ({ type: types.GET_IN_HOME_REQUEST });
const getInHomeSuccess = (response) => ({
  type: types.GET_IN_HOME_SUCCESS,
  payload: response,
});
const getInHomeFailure = (error) => ({
  type: types.GET_IN_HOME_FAILURE,
  payload: error,
});

const getInHome = ({ facilityId, pageIndex = 0, pageSize = 10 }) => (
  dispatch,
) =>
  new Promise((resolve, reject) => {
    dispatch(getInHomeRequest());
    httpClient
      .callApi({
        url: apiLinks.facilities.quarantineFacilities.getInHome,
        params: {
          facilityId: facilityId || undefined,
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getInHomeSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getInHomeFailure(error));
        reject();
      });
  });

const getInHomeByFacilityRequest = () => ({
  type: types.GET_IN_HOME_BY_FACILITY_REQUEST,
});
const getInHomeByFacilitySuccess = (response) => ({
  type: types.GET_IN_HOME_BY_FACILITY_SUCCESS,
  payload: response,
});
const getInHomeByFacilityFailure = (error) => ({
  type: types.GET_IN_HOME_BY_FACILITY_FAILURE,
  payload: error,
});

const getInHomeByFacility = ({ id = '', pageIndex = 0, pageSize = 10 }) => (
  dispatch,
) =>
  new Promise((resolve, reject) => {
    dispatch(getInHomeByFacilityRequest());
    httpClient
      .callApi({
        url: `${apiLinks.facilities.quarantineFacilities.getInHomeByFacility}/${id}/InHomeQuarantine`,
        params: {
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getInHomeByFacilitySuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getInHomeByFacilityFailure(error));
        reject();
      });
  });

const getInQuarantineRequest = () => ({
  type: types.GET_IN_QUARANTINE_REQUEST,
});
const getInQuarantineSuccess = (response) => ({
  type: types.GET_IN_QUARANTINE_SUCCESS,
  payload: response,
});
const getInQuarantineFailure = (error) => ({
  type: types.GET_IN_QUARANTINE_FAILURE,
  payload: error,
});

const getInQuarantine = ({ facilityId, pageIndex = 0, pageSize = 10 }) => (
  dispatch,
) =>
  new Promise((resolve, reject) => {
    dispatch(getInQuarantineRequest());
    httpClient
      .callApi({
        url: apiLinks.facilities.quarantineFacilities.getInQuarantine,
        params: {
          facilityId: facilityId || undefined,
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getInQuarantineSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getInQuarantineFailure(error));
        reject();
      });
  });

const getInQuarantineByFacilityRequest = () => ({
  type: types.GET_IN_QUARANTINE_BY_FACILITY_REQUEST,
});
const getInQuarantineByFacilitySuccess = (response) => ({
  type: types.GET_IN_QUARANTINE_BY_FACILITY_SUCCESS,
  payload: response,
});
const getInQuarantineByFacilityFailure = (error) => ({
  type: types.GET_IN_QUARANTINE_BY_FACILITY_FAILURE,
  payload: error,
});

const getInQuarantineByFacility = ({
  id = '',
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getInQuarantineByFacilityRequest());
    httpClient
      .callApi({
        url: `${apiLinks.facilities.quarantineFacilities.getInQuarantineByFalicity}/${id}/InQuarantine`,
        params: {
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getInQuarantineByFacilitySuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getInQuarantineByFacilityFailure(error));
        reject();
      });
  });

const getCompletedRequest = () => ({
  type: types.GET_COMPLETED_BY_FACILITY_REQUEST,
});
const getCompletedSuccess = (response) => ({
  type: types.GET_COMPLETED_BY_FACILITY_SUCCESS,
  payload: response,
});
const getCompletedFailure = (error) => ({
  type: types.GET_COMPLETED_BY_FACILITY_FAILURE,
  payload: error,
});

const getCompleted = ({ facilityId, pageIndex = 0, pageSize = 10 }) => (
  dispatch,
) =>
  new Promise((resolve, reject) => {
    dispatch(getCompletedRequest());
    httpClient
      .callApi({
        url: apiLinks.facilities.quarantineFacilities.getCompleted,
        params: {
          facilityId: facilityId || undefined,
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getCompletedSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getCompletedFailure(error));
        reject();
      });
  });

const getCompletedByFacilityRequest = () => ({
  type: types.GET_COMPLETED_BY_FACILITY_REQUEST,
});
const getCompletedByFacilitySuccess = (response) => ({
  type: types.GET_COMPLETED_BY_FACILITY_SUCCESS,
  payload: response,
});
const getCompletedByFacilityFailure = (error) => ({
  type: types.GET_COMPLETED_BY_FACILITY_FAILURE,
  payload: error,
});

const getCompletedByFacility = ({ id = '', pageIndex = 0, pageSize = 10 }) => (
  dispatch,
) =>
  new Promise((resolve, reject) => {
    dispatch(getCompletedByFacilityRequest());
    httpClient
      .callApi({
        url: `${apiLinks.facilities.quarantineFacilities.getCompletedByFacility}/${id}/Completed`,
        params: {
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(getCompletedByFacilitySuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getCompletedByFacilityFailure(error));
        reject();
      });
  });

const setManagerRequest = () => ({ type: types.SET_MANAGER_REQUEST });
const setManagerSuccess = (response) => ({
  type: types.SET_MANAGER_SUCCESS,
  payload: response,
});
const setManagerFailure = (error) => ({
  type: types.SET_MANAGER_FAILURE,
  payload: error,
});

const setManager = ({ pageIndex = 0, pageSize = 10 }) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(setManagerRequest());
    httpClient
      .callApi({
        url: apiLinks.facilities.quarantineFacilities.setManager,
        params: {
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        dispatch(setManagerSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(setManagerFailure(error));
        reject();
      });
  });

const toggleRoomStatusRequest = () => ({
  type: types.TOGGLE_ROOM_STATUS_REQUEST,
});
const toggleRoomStatusSuccess = (res) => ({
  type: types.TOGGLE_ROOM_STATUS_SUCCESS,
  payload: res,
});
const toggleRoomStatusFailure = (err) => ({
  type: types.TOGGLE_ROOM_STATUS_FAILURE,
  payload: err,
});
const disableRoom = ({ facilityId, roomId }) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(toggleRoomStatusRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: `${apiLinks.facilities.quarantineFacilities.disableRoom}/${facilityId}/DisableRooms/${roomId}`,
      })
      .then((response) => {
        dispatch(toggleRoomStatusSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(toggleRoomStatusFailure(error));
        reject();
      });
  });

const enableRoom = ({ facilityId, roomId }) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(toggleRoomStatusRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: `${apiLinks.facilities.quarantineFacilities.disableRoom}/${facilityId}/EnableRooms/${roomId}`,
      })
      .then((response) => {
        dispatch(toggleRoomStatusSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(toggleRoomStatusFailure(error));
        reject();
      });
  });
export {
  selectFacility,
  selectRoom,
  getFacilityInfo,
  getFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
  getRooms,
  getAvailableRooms,
  createRooms,
  updateRoom,
  deleteRoom,
  getWaitingList,
  getWaitingListByFacility,
  getInHome,
  getInHomeByFacility,
  getInQuarantine,
  getInQuarantineByFacility,
  getCompleted,
  getCompletedByFacility,
  setManager,
  disableRoom,
  enableRoom,
};
