import types from 'quarantine/actions/types';

const INITIAL_STATE = {
  quarantineRequestData: {},
  getQuarantineRequestLoading: false,
  quarantineRequestDetail: {},
  getQuarantineRequestDetailLoading: false,
  createQuarantineRequestLoading: false,
  updateQuarantineRequestLoading: false,
  deleteQuarantineRequestLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_QUARANTINE_REQUEST_REQUEST: {
      return {
        ...state,
        getQuarantineRequestLoading: true,
      };
    }
    case types.GET_QUARANTINE_REQUEST_SUCCESS: {
      return {
        ...state,
        getQuarantineRequestLoading: false,
        quarantineRequestData: action.payload,
      };
    }
    case types.GET_QUARANTINE_REQUEST_FAILURE: {
      return {
        ...state,
        getQuarantineRequestLoading: false,
      };
    }
    case types.CREATE_QUARANTINE_REQUEST_REQUEST: {
      return {
        ...state,
        createQuarantineRequestLoading: true,
      };
    }
    case types.CREATE_QUARANTINE_REQUEST_SUCCESS: {
      return {
        ...state,
        createQuarantineRequestLoading: false,
      };
    }
    case types.CREATE_QUARANTINE_REQUEST_FAILURE: {
      return {
        ...state,
        createQuarantineRequestLoading: false,
      };
    }
    case types.UPDATE_QUARANTINE_REQUEST_REQUEST: {
      return {
        ...state,
        updateQuarantineRequestLoading: true,
      };
    }
    case types.UPDATE_QUARANTINE_REQUEST_SUCCESS: {
      return {
        ...state,
        updateQuarantineRequestLoading: false,
      };
    }
    case types.UPDATE_QUARANTINE_REQUEST_FAILURE: {
      return {
        ...state,
        updateQuarantineRequestLoading: false,
      };
    }
    case types.DELETE_QUARANTINE_REQUEST_REQUEST: {
      return {
        ...state,
        deleteQuarantineRequestLoading: true,
      };
    }
    case types.DELETE_QUARANTINE_REQUEST_SUCCESS: {
      return {
        ...state,
        deleteQuarantineRequestLoading: false,
      };
    }
    case types.DELETE_QUARANTINE_REQUEST_FAILURE: {
      return {
        ...state,
        deleteQuarantineRequestLoading: false,
      };
    }
    case types.GET_QUARANTINE_REQUEST_DETAIL_REQUEST: {
      return {
        ...state,
        getQuarantineRequestDetailLoading: true,
      };
    }
    case types.GET_QUARANTINE_REQUEST_DETAIL_SUCCESS: {
      return {
        ...state,
        quarantineRequestDetail: action.payload,
        getQuarantineRequestDetailLoading: false,
      };
    }
    case types.GET_QUARANTINE_REQUEST_DETAIL_FAILURE: {
      return {
        ...state,
        getQuarantineRequestDetailLoading: false,
      };
    }
    default: {
      return state;
    }
  }
}
