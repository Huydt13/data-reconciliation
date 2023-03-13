import { examinationPaging } from 'app/utils/helpers';
import types from '../actions/types';

const INITIAL_STATE = {
  collectingSessionData: examinationPaging,
  getCollectingSessionLoading: false,
  collectingSessionDetailData: undefined,
  getCollectingSessionDetailLoading: false,
  createCollectingSessionLoading: false,
  updateCollectingSessionLoading: false,
  deleteCollectingSessionLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_COLLECTING_SESSIONS_REQUEST:
      return {
        ...state,
        getCollectingSessionLoading: true,
      };
    case types.GET_COLLECTING_SESSIONS_SUCCESS:
      return {
        ...state,
        getCollectingSessionLoading: false,
        collectingSessionData: action.payload,
      };
    case types.GET_COLLECTING_SESSIONS_FAILURE:
      return {
        ...state,
        getCollectingSessionLoading: false,
      };
    case types.GET_COLLECTING_SESSION_DETAIL_REQUEST:
      return {
        ...state,
        getCollectingSessionDetailLoading: true,
      };
    case types.GET_COLLECTING_SESSION_DETAIL_SUCCESS:
      return {
        ...state,
        collectingSessionDetailData: action.payload,
        getCollectingSessionDetailLoading: false,
      };
    case types.GET_COLLECTING_SESSION_DETAIL_FAILURE:
      return {
        ...state,
        getCollectingSessionDetailLoading: false,
      };
    case types.CREATE_COLLECTING_SESSION_REQUEST:
      return {
        ...state,
        createCollectingSessionLoading: true,
      };
    case types.CREATE_COLLECTING_SESSION_SUCCESS:
      return {
        ...state,
        createCollectingSessionLoading: false,
      };
    case types.CREATE_COLLECTING_SESSION_FAILURE:
      return {
        ...state,
        createCollectingSessionLoading: false,
      };
    case types.UPDATE_COLLECTING_SESSION_REQUEST:
      return {
        ...state,
        updateCollectingSessionLoading: true,
      };
    case types.UPDATE_COLLECTING_SESSION_SUCCESS:
      return {
        ...state,
        updateCollectingSessionLoading: false,
      };
    case types.UPDATE_COLLECTING_SESSION_FAILURE:
      return {
        ...state,
        updateCollectingSessionLoading: false,
      };
    case types.DELETE_COLLECTING_SESSION_REQUEST:
      return {
        ...state,
        deleteCollectingSessionLoading: true,
      };
    case types.DELETE_COLLECTING_SESSION_SUCCESS:
      return {
        ...state,
        deleteCollectingSessionLoading: false,
      };
    case types.DELETE_COLLECTING_SESSION_FAILURE:
      return {
        ...state,
        deleteCollectingSessionLoading: false,
      };
    default:
      return state;
  }
};
