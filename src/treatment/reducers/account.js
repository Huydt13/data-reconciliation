import types from '../actions/types';

const INITIAL_STATE = {
  accountInfo: null,
  getAccountInfoLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.TM_GET_ACCOUNT_INFO_REQUEST:
      return {
        ...state,
        getAccountInfoLoading: true,
      };
    case types.TM_GET_ACCOUNT_INFO_SUCCESS:
      return {
        ...state,
        accountInfo: action.payload,
        getAccountInfoLoading: false,
      };
    case types.TM_GET_ACCOUNT_INFO_FAILURE:
      return {
        ...state,
        getAccountInfoLoading: false,
      };
    default:
      return state;
  }
};
