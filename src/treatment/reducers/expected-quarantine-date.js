import types from '../actions/types';

const INITIAL_STATE = {
  expectedQuarantineDateData: undefined,
  getExpectedQuarantineDateLoading: false,
  updateExpectedQuarantineDateLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_EXPECTED_QUARANTINE_DATE_REQUEST:
      return {
        ...state,
        getExpectedQuarantineDateLoading: true,
      };
    case types.GET_EXPECTED_QUARANTINE_DATE_SUCCESS:
      return {
        ...state,
        getExpectedQuarantineDateLoading: false,
        expectedQuarantineDateData: action.payload,
      };
    case types.GET_EXPECTED_QUARANTINE_DATE_FAILURE:
      return {
        ...state,
        getExpectedQuarantineDateLoading: false,
      };
    case types.UPDATE_EXPECTED_QUARANTINE_DATE_REQUEST:
      return {
        ...state,
        updateExpectedQuarantineDateLoading: true,
      };
    case types.UPDATE_EXPECTED_QUARANTINE_DATE_SUCCESS:
    case types.UPDATE_EXPECTED_QUARANTINE_DATE_FAILURE:
      return {
        ...state,
        updateExpectedQuarantineDateLoading: false,
      };
    default:
      return state;
  }
};
