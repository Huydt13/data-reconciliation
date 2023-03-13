import { treatmentPaging } from 'app/utils/helpers';
import types from '../actions/types';

const INITIAL_STATE = {
  getAlreadyInWaitingListLoading: false,
  alreadyInWaitingListData: undefined,
  waitingListByFacilityData: treatmentPaging,
  getWaitingListByFacilityLoading: false,
  addProfilesLoading: false,
  approveLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_ALREADY_IN_WAITINGLIST_REQUEST:
      return {
        ...state,
        getAlreadyInWaitingListLoading: true,
      };
    case types.GET_ALREADY_IN_WAITINGLIST_SUCCESS:
      return {
        ...state,
        getAlreadyInWaitingListLoading: false,
        alreadyInWaitingListData: action.payload,
      };
    case types.GET_ALREADY_IN_WAITINGLIST_FAILURE:
      return {
        ...state,
        getAlreadyInWaitingListLoading: false,
      };
    case types.GET_WAITINGLIST_BY_FACILITY_REQUEST:
      return {
        ...state,
        getWaitingListByFacilityLoading: true,
      };
    case types.GET_WAITINGLIST_BY_FACILITY_SUCCESS:
      return {
        ...state,
        waitingListByFacilityData: action.payload,
        getWaitingListByFacilityLoading: false,
      };
    case types.GET_WAITINGLIST_BY_FACILITY_FAILURE:
      return {
        ...state,
        getWaitingListByFacilityLoading: false,
      };
    case types.WAITING_LIST_ADD_PROFILES_REQUEST:
      return {
        ...state,
        addProfilesLoading: true,
      };
    case types.WAITING_LIST_ADD_PROFILES_SUCCESS:
    case types.WAITING_LIST_ADD_PROFILES_FAILURE:
      return {
        ...state,
        addProfilesLoading: false,
      };
    case types.WAITINGLIST_APPROVE_REQUEST:
      return {
        ...state,
        approveLoading: true,
      };
    case types.WAITINGLIST_APPROVE_SUCCESS:
    case types.WAITINGLIST_APPROVE_FAILURE:
      return {
        ...state,
        approveLoading: false,
      };
    default:
      return state;
  }
};
