import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import types from './types';

const selectQuarantine = (t) => ({ type: types.SELECT_QUARANTINE, payload: t });

const toggleCreateModal = () => ({ type: types.TOGGLE_CREATE_MODAL });
const toggleEditModal = () => ({ type: types.TOGGLE_EDIT_MODAL });

const getAllZonesRequest = () => ({ type: types.GET_ALL_QUARANTINE_ZONES_REQUEST });
const getAllZonesSuccess = (response) => ({ type: types.GET_ALL_QUARANTINE_ZONES_SUCCESS, payload: response });
const getAllZonesFailure = (error) => ({ type: types.GET_ALL_QUARANTINE_ZONES_FAILURE, payload: error });

const getAllZones = ({
  name = '',
  isTreatmentZone,
  provinceValue = '',
  districtValue = '',
  wardValue = '',
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getAllZonesRequest());
  httpClient.callApi({
    method: 'GET',
    url: apiLinks.getAllQuarantineZone,
    params: {
      name,
      isTreatmentZone,
      provinceValue,
      districtValue,
      wardValue,
      pageIndex,
      pageSize,
    },
  }).then((response) => {
    dispatch(getAllZonesSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getAllZonesFailure(error));
    reject();
  });
});

const getQuarantineSubjectsRequest = () => ({ type: types.GET_QUARANTINE_SUBJECTS_REQUEST });
const getQuarantineSubjectsSuccess = (response) => ({ type: types.GET_QUARANTINE_SUBJECTS_SUCCESS, payload: response });
const getQuarantineSubjectsFailure = (error) => ({ type: types.GET_QUARANTINE_SUBJECTS_FAILURE, payload: error });

const getQuarantineSubjects = ({
  name = '',
  isTreatmentZone,
  provinceValue = '',
  districtValue = '',
  wardValue = '',
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getQuarantineSubjectsRequest());
  httpClient.callApi({
    url: apiLinks.getQuarantineSubjects,
    params: {
      name,
      isTreatmentZone,
      provinceValue,
      districtValue,
      wardValue,
      pageIndex,
      pageSize,
    },
  }).then((response) => {
    dispatch(getQuarantineSubjectsSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getQuarantineSubjectsFailure(error));
    reject();
  });
});

const getQuarantineWaitingSubjectsRequest = () => ({ type: types.GET_QUARANTINE_WAITING_SUBJECTS_REQUEST });
const getQuarantineWaitingSubjectsSuccess = (response) => ({ type: types.GET_QUARANTINE_WAITING_SUBJECTS_SUCCESS, payload: response });
const getQuarantineWaitingSubjectsFailure = (error) => ({ type: types.GET_QUARANTINE_WAITING_SUBJECTS_FAILURE, payload: error });

const getQuarantineWaitingSubjects = ({
  name = '',
  isTreatmentZone,
  provinceValue = '',
  districtValue = '',
  wardValue = '',
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getQuarantineWaitingSubjectsRequest());
  httpClient.callApi({
    url: apiLinks.getQuarantineWaitingSubjects,
    params: {
      name,
      isTreatmentZone,
      provinceValue,
      districtValue,
      wardValue,
      pageIndex,
      pageSize,
    },
  }).then((response) => {
    dispatch(getQuarantineWaitingSubjectsSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getQuarantineWaitingSubjectsFailure(error));
    reject();
  });
});

const getQuarantinesRequest = () => ({ type: types.GET_QUARANTINES_REQUEST });
const getQuarantinesSuccess = (response) => ({ type: types.GET_QUARANTINES_SUCCESS, payload: response });
const getQuarantinesFailure = (error) => ({ type: types.GET_QUARANTINES_FAILURE, payload: error });

const getQuarantines = ({
  subjectName = '',
  onlyUnQuarantineedSubjects,
  pageSize = 10,
  pageIndex = 0,
}) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getQuarantinesRequest());
  httpClient.callApi({
    method: 'GET',
    url: apiLinks.quarantineLatest,
    params: {
      subjectName,
      onlyUnQuarantineedSubjects,
      pageSize,
      pageIndex,
    },
  }).then((response) => {
    dispatch(getQuarantinesSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getQuarantinesFailure(error));
    reject();
  });
});

const getQuarantineRequest = () => ({ type: types.GET_QUARANTINE_REQUEST });
const getQuarantineSuccess = (response) => ({ type: types.GET_QUARANTINE_SUCCESS, payload: response });
const getQuarantineFailure = (error) => ({ type: types.GET_QUARANTINE_FAILURE, payload: error });

const getQuarantine = ({
  subjectId = '',
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getQuarantineRequest());
  httpClient.callApi({
    method: 'GET',
    url: `${apiLinks.subjectQuarantine(subjectId)}`,
    params: {
      pageIndex,
      pageSize,
    },
  }).then((response) => {
    dispatch(getQuarantineSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getQuarantineFailure(error));
    reject();
  });
});

const createQuarantineRequest = () => ({ type: types.CREATE_QUARANTINE_REQUEST });
const createQuarantineSuccess = (response) => ({ type: types.CREATE_QUARANTINE_SUCCESS, payload: response });
const createQuarantineFailure = (error) => ({ type: types.CREATE_QUARANTINE_FAILURE, payload: error });

const createQuarantine = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(createQuarantineRequest());
  httpClient.callApi({
    method: 'POST',
    data,
    url: apiLinks.quarantine,
  }).then((response) => {
    dispatch(createQuarantineSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(createQuarantineFailure(error));
    reject();
  });
});

const updateQuarantineRequest = () => ({ type: types.UPDATE_QUARANTINE_REQUEST });
const updateQuarantineSuccess = (response) => ({ type: types.UPDATE_QUARANTINE_SUCCESS, payload: response });
const updateQuarantineFailure = (error) => ({ type: types.UPDATE_QUARANTINE_FAILURE, payload: error });

const updateQuarantine = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(updateQuarantineRequest());
  httpClient.callApi({
    method: 'PUT',
    data,
    url: apiLinks.quarantine,
  }).then((response) => {
    dispatch(updateQuarantineSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(updateQuarantineFailure(error));
    reject();
  });
});

const deleteQuarantineRequest = () => ({ type: types.DELETE_QUARANTINE_REQUEST });
const deleteQuarantineSuccess = () => ({ type: types.DELETE_QUARANTINE_SUCCESS });
const deleteQuarantineFailure = () => ({ type: types.DELETE_QUARANTINE_FAILURE });

const deleteQuarantine = (quarantineId) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(deleteQuarantineRequest());
  httpClient.callApi({
    method: 'DELETE',
    url: apiLinks.quarantine + quarantineId,
  }).then((response) => {
    dispatch(deleteQuarantineSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(deleteQuarantineFailure(error));
    reject();
  });
});

const selectZone = (zone) => ({ type: types.SELECT_ZONE, payload: zone });
const openZoneDetail = (bool) => ({ type: types.OPEN_ZONE_DETAIL, payload: bool });
const selectRoom = (room) => ({ type: types.SELECT_ROOM, payload: room });
const openRoomDetail = (bool) => ({ type: types.OPEN_ROOM_DETAIL, payload: bool });
const openWaitingList = (bool) => ({ type: types.OPEN_WAITING_SUBJECT, payload: bool });

const getZoneRequest = () => ({ type: types.GET_ZONES_REQUEST });
const getZoneSuccess = (response) => ({ type: types.GET_ZONES_SUCCESS, payload: response });
const getZoneFailure = (error) => ({ type: types.GET_ZONES_FAILURE, payload: error });

const getZones = () => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getZoneRequest());
  httpClient.callApi({
    method: 'GET',
    url: apiLinks.quarantineZone(),
  }).then((response) => {
    dispatch(getZoneSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getZoneFailure(error));
    reject();
  });
});

const getWaitingListRequest = () => ({ type: types.GET_WAITING_LIST_REQUEST });
const getWaitingListSuccess = (response) => ({ type: types.GET_WAITING_LIST_SUCCESS, payload: response });
const getWaitingListFailure = (error) => ({ type: types.GET_WAITING_LIST_FAILURE, payload: error });

const getWaitingList = (zoneId) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getWaitingListRequest());
  httpClient.callApi({
    method: 'GET',
    url: `${apiLinks.quarantineZone(zoneId)}/WaitingList`,
  }).then((response) => {
    dispatch(getWaitingListSuccess(response.data));
    resolve(response.data);
  }).catch((error) => {
    dispatch(getWaitingListFailure(error));
    reject();
  });
});

const createZoneRequest = () => ({ type: types.CREATE_ZONE_REQUEST });
const createZoneSuccess = (response) => ({ type: types.CREATE_ZONE_SUCCESS, payload: response });
const createZoneFailure = (error) => ({ type: types.CREATE_ZONE_FAILURE, payload: error });

const createZone = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(createZoneRequest());
  httpClient.callApi({
    method: 'POST',
    data,
    url: apiLinks.quarantineZone(),
  }).then((response) => {
    dispatch(createZoneSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(createZoneFailure(error));
    reject();
  });
});

const updateZoneRequest = () => ({ type: types.UPDATE_ZONE_REQUEST });
const updateZoneSuccess = (response) => ({ type: types.UPDATE_ZONE_SUCCESS, payload: response });
const updateZoneFailure = (error) => ({ type: types.UPDATE_ZONE_FAILURE, payload: error });

const updateZone = (zone) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(updateZoneRequest());
  httpClient.callApi({
    method: 'PUT',
    data: zone,
    url: apiLinks.quarantineZone(),
  }).then((response) => {
    dispatch(updateZoneSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(updateZoneFailure(error));
    reject();
  });
});

const deleteZoneRequest = () => ({ type: types.DELETE_ZONE_REQUEST });
const deleteZoneSuccess = () => ({ type: types.DELETE_ZONE_SUCCESS });
const deleteZoneFailure = () => ({ type: types.DELETE_ZONE_FAILURE });

const deleteZone = (id) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(deleteZoneRequest());
  httpClient.callApi({
    method: 'DELETE',
    url: apiLinks.quarantineZone(id),
  }).then((response) => {
    dispatch(deleteZoneSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(deleteZoneFailure(error));
    reject();
  });
});

const getRoomRequest = () => ({ type: types.GET_ROOMS_REQUEST });
const getRoomSuccess = (response) => ({ type: types.GET_ROOMS_SUCCESS, payload: response });
const getRoomFailure = (error) => ({ type: types.GET_ROOMS_FAILURE, payload: error });

const getRooms = (zoneId) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getRoomRequest());
  httpClient.callApi({
    method: 'GET',
    url: apiLinks.quarantineRooms(zoneId),
  }).then((response) => {
    dispatch(getRoomSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getRoomFailure(error));
    reject();
  });
});

const createRoomRequest = () => ({ type: types.CREATE_ROOM_REQUEST });
const createRoomSuccess = (response) => ({ type: types.CREATE_ROOM_SUCCESS, payload: response });
const createRoomFailure = (error) => ({ type: types.CREATE_ROOM_FAILURE, payload: error });

const createRoom = (zoneId, rooms) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(createRoomRequest());
  httpClient.callApi({
    method: 'POST',
    data: {
      quarantineZoneId: zoneId,
      quarantineRooms: [rooms],
    },
    url: apiLinks.quarantineRoom(),
  }).then((response) => {
    dispatch(createRoomSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(createRoomFailure(error));
    reject();
  });
});

const updateRoomRequest = () => ({ type: types.UPDATE_ROOM_REQUEST });
const updateRoomSuccess = (response) => ({ type: types.UPDATE_ROOM_SUCCESS, payload: response });
const updateRoomFailure = (error) => ({ type: types.UPDATE_ROOM_FAILURE, payload: error });

const updateRoom = (zoneId, room) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(updateRoomRequest());
  httpClient.callApi({
    method: 'PUT',
    data: room,
    url: apiLinks.quarantineRoom(zoneId),
  }).then((response) => {
    dispatch(updateRoomSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(updateRoomFailure(error));
    reject();
  });
});

const deleteRoomRequest = () => ({ type: types.DELETE_ROOM_REQUEST });
const deleteRoomSuccess = () => ({ type: types.DELETE_ROOM_SUCCESS });
const deleteRoomFailure = () => ({ type: types.DELETE_ROOM_FAILURE });

const deleteRoom = (zoneId, roomId) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(deleteRoomRequest());
  httpClient.callApi({
    method: 'DELETE',
    url: apiLinks.quarantineRoom(zoneId, roomId),
  }).then((response) => {
    dispatch(deleteRoomSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(deleteRoomFailure(error));
    reject();
  });
});

const extendDurationRequest = () => ({ type: types.EXTEND_DURATION_REQUEST });
const extendDurationSuccess = (response) => ({ type: types.EXTEND_DURATION_SUCCESS, payload: response });
const extendDurationFailure = (error) => ({ type: types.EXTEND_DURATION_FAILURE, payload: error });

const extendDuration = (subjectId, newEndDate) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(extendDurationRequest());
  httpClient.callApi({
    method: 'PUT',
    url: `${apiLinks.quarantine}Subject/${subjectId}/Duration`,
    params: newEndDate,
  }).then((response) => {
    dispatch(extendDurationSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(extendDurationFailure(error));
    reject();
  });
});

const editHistoryRequest = () => ({ type: types.EDIT_HISTORY_REQUEST });
const editHistorySuccess = (response) => ({ type: types.EDIT_HISTORY_SUCCESS, payload: response });
const editHistoryFailure = (error) => ({ type: types.EDIT_HISTORY_FAILURE, payload: error });

const editHistory = (subjectId, data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(editHistoryRequest());
  httpClient.callApi({
    method: 'PUT',
    url: apiLinks.subjectQuarantine(subjectId),
    data,
  }).then((response) => {
    dispatch(editHistorySuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(editHistoryFailure(error));
    reject();
  });
});

const completeQuarantineRequest = () => ({ type: types.COMPLETE_QUARANTINE_REQUEST });
const completeQuarantineSuccess = (response) => ({ type: types.COMPLETE_QUARANTINE_SUCCESS, payload: response });
const completeQuarantineFailure = (error) => ({ type: types.COMPLETE_QUARANTINE_FAILURE, payload: error });

const completeQuarantine = (subjectId, data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(completeQuarantineRequest());
  httpClient.callApi({
    method: 'PUT',
    url: `${apiLinks.quarantine}Subject/${subjectId}/Complete`,
    data,
  }).then((response) => {
    dispatch(completeQuarantineSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(completeQuarantineFailure(error));
    reject();
  });
});

const moveQuarantineRequest = () => ({ type: types.MOVE_QUARANTINE_REQUEST });
const moveQuarantineSuccess = (response) => ({ type: types.MOVE_QUARANTINE_SUCCESS, payload: response });
const moveQuarantineFailure = (error) => ({ type: types.MOVE_QUARANTINE_FAILURE, payload: error });

const moveQuarantine = (subjectId, newZoneId, dateStartedToWait, startTime, endTime) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(moveQuarantineRequest());
  httpClient.callApi({
    method: 'PUT',
    url: `${apiLinks.quarantine}Subject/${subjectId}/Zone`,
    params: {
      subjectId,
      newZoneId,
      dateStartedToWait,
      startTime,
      endTime,
    },
  }).then((response) => {
    dispatch(moveQuarantineSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(moveQuarantineFailure(error));
    reject();
  });
});

const moveRoomRequest = () => ({ type: types.MOVE_ROOM_REQUEST });
const moveRoomSuccess = (response) => ({ type: types.MOVE_ROOM_SUCCESS, payload: response });
const moveRoomFailure = (error) => ({ type: types.MOVE_ROOM_FAILURE, payload: error });

const moveRoom = (subjectId, zoneId, newRoomId) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(moveRoomRequest());
  httpClient.callApi({
    method: 'PUT',
    url: apiLinks.moveRoom(subjectId, zoneId, newRoomId),
  }).then((response) => {
    dispatch(moveRoomSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(moveRoomFailure(error));
    reject();
  });
});

const getAvailableRoomsRequest = () => ({ type: types.GET_AVAILABLE_ROOMS_REQUEST });
const getAvailableRoomsSuccess = (response) => ({ type: types.GET_AVAILABLE_ROOMS_SUCCESS, payload: response });
const getAvailableRoomsFailure = (error) => ({ type: types.GET_AVAILABLE_ROOMS_FAILURE, payload: error });

const getAvailableRooms = (zoneId) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getAvailableRoomsRequest());
  httpClient.callApi({
    method: 'GET',
    url: `${apiLinks.quarantineZone(zoneId)}/Rooms/Available`,
  }).then((response) => {
    dispatch(getAvailableRoomsSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getAvailableRoomsFailure(error));
    reject();
  });
});

const getSubjectInRoomRequest = () => ({ type: types.GET_SUBJECT_IN_ROOM_REQUEST });
const getSubjectInRoomSuccess = (response) => ({ type: types.GET_SUBJECT_IN_ROOM_SUCCESS, payload: response });
const getSubjectInRoomFailure = (error) => ({ type: types.GET_SUBJECT_IN_ROOM_FAILURE, payload: error });

const getSubjectInRoom = (zoneId, roomId) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getSubjectInRoomRequest());
  httpClient.callApi({
    method: 'GET',
    url: `${apiLinks.quarantineZone(zoneId)}/Room/${roomId}/Subjects`,
  }).then((response) => {
    dispatch(getSubjectInRoomSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getSubjectInRoomFailure(error));
    reject();
  });
});

const takeInRequest = () => ({ type: types.TAKE_IN_REQUEST });
const takeInSuccess = (response) => ({ type: types.TAKE_IN_SUCCESS, payload: response });
const takeInFailure = (error) => ({ type: types.TAKE_IN_FAILURE, payload: error });

const takeIn = (subjectId, roomId, enterRoomDate, useCurrentTime) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(takeInRequest());
  httpClient.callApi({
    method: 'POST',
    url: `${apiLinks.quarantineZone()}TakeIn/${subjectId}/Room/${roomId}`,
    params: {
      subjectId,
      roomId,
      enterRoomDate,
      useCurrentTime,
    },
  }).then((response) => {
    dispatch(takeInSuccess(response));
    resolve();
  }).catch((error) => {
    dispatch(takeInFailure(error));
    reject();
  });
});

const createProfileFromQuarantineRequest = () => ({ type: types.CREATE_PROFILE_FROM_QUARANTINE_REQUEST });
const createProfileFromQuarantineSuccess = (response) => ({ type: types.CREATE_PROFILE_FROM_QUARANTINE_SUCCESS, payload: response });
const createProfileFromQuarantineFailure = (error) => ({ type: types.CREATE_PROFILE_FROM_QUARANTINE_FAILURE, payload: error });

const createProfileFromQuarantine = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(createProfileFromQuarantineRequest());
  httpClient.callApi({
    method: 'POST',
    url: apiLinks.createProfileFromQuarantine,
    data,
  }).then((response) => {
    dispatch(createProfileFromQuarantineSuccess(response));
    toast.success('Thành công');
    resolve();
  }).catch((error) => {
    dispatch(createProfileFromQuarantineFailure(error));
    reject();
  });
});

const getCompletedSubjectsRequest = () => ({ type: types.GET_COMPLETED_SUBJECTS_REQUEST });
const getCompletedSubjectsSuccess = (response) => ({ type: types.GET_COMPLETED_SUBJECTS_SUCCESS, payload: response });
const getCompletedSubjectsFailure = (error) => ({ type: types.GET_COMPLETED_SUBJECTS_FAILURE, payload: error });

const getCompletedSubjects = ({
  name = '',
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getCompletedSubjectsRequest());
  httpClient.callApi({
    url: apiLinks.getCompletedSubjects,
    params: {
      name,
      pageIndex,
      pageSize,
    },
  }).then((response) => {
    dispatch(getCompletedSubjectsSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getCompletedSubjectsFailure(error));
    reject();
  });
});

export {
  selectQuarantine,
  toggleCreateModal,
  toggleEditModal,
  getQuarantine,
  getQuarantines,
  createQuarantine,
  updateQuarantine,
  deleteQuarantine,
  selectZone,
  openZoneDetail,
  selectRoom,
  openRoomDetail,
  openWaitingList,
  getZones,
  createZone,
  updateZone,
  deleteZone,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  extendDuration,
  editHistory,
  completeQuarantine,
  moveQuarantine,
  moveRoom,
  getAvailableRooms,
  getSubjectInRoom,
  takeIn,
  getWaitingList,
  getAllZones,
  getQuarantineSubjects,
  getQuarantineWaitingSubjects,
  createProfileFromQuarantine,
  getCompletedSubjects,
};
