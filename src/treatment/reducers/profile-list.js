import { treatmentPaging } from 'app/utils/helpers';
import types from '../actions/types';

const INITIAL_STATE = {
  profileListData: treatmentPaging,
  getProfileListListLoading: false,
  createProfileListLoading: false,
  createNewProfileLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_PROFILE_LIST_LIST_REQUEST: {
      return {
        ...state,
        getProfileListListLoading: true,
      };
    }
    case types.GET_PROFILE_LIST_LIST_SUCCESS: {
      return {
        ...state,
        profileListData: action.payload,
        getProfileListListLoading: false,
      };
    }
    case types.GET_PROFILE_LIST_LIST_FAILURE: {
      return {
        ...state,
        getProfileListListLoading: false,
      };
    }
    case types.CREATE_PROFILE_LIST_REQUEST: {
      return {
        ...state,
        createProfileListLoading: true,
      };
    }
    case types.CREATE_PROFILE_LIST_SUCCESS:
    case types.CREATE_PROFILE_LIST_FAILURE: {
      return {
        ...state,
        createProfileListLoading: false,
      };
    }
    case types.TM_CREATE_NEW_PROFILE_REQUEST: {
      return {
        ...state,
        createNewProfileLoading: true,
      };
    }
    case types.TM_CREATE_NEW_PROFILE_SUCCESS:
    case types.TM_CREATE_NEW_PROFILE_FAILURE: {
      return {
        ...state,
        createNewProfileLoading: false,
      };
    }
    default:
      return state;
  }
};
