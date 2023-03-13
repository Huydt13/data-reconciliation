import types from 'quarantine-facilities/actions/types';

const INITIAL_STATE = {
  quarantineFormData: {},
  getQuarantineFormLoading: false,
  quarantineFormDetail: {},
  getQuarantineFormDetailLoading: false,
  createQuarantineFormLoading: false,
  updateQuarantineFormLoading: false,
  deleteQuarantineFormLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_QUARANTINE_FORM_REQUEST: {
      return {
        ...state,
        getQuarantineFormLoading: true,
      };
    }
    case types.GET_QUARANTINE_FORM_SUCCESS: {
      return {
        ...state,
        getQuarantineFormLoading: false,
        quarantineFormData: action.payload,
      };
    }
    case types.GET_QUARANTINE_FORM_FAILURE: {
      return {
        ...state,
        getQuarantineFormLoading: false,
      };
    }
    case types.CREATE_QUARANTINE_FORM_REQUEST: {
      return {
        ...state,
        createQuarantineFormLoading: true,
      };
    }
    case types.CREATE_QUARANTINE_FORM_SUCCESS: {
      return {
        ...state,
        createQuarantineFormLoading: false,
      };
    }
    case types.CREATE_QUARANTINE_FORM_FAILURE: {
      return {
        ...state,
        createQuarantineFormLoading: false,
      };
    }
    case types.UPDATE_QUARANTINE_FORM_REQUEST: {
      return {
        ...state,
        updateQuarantineFormLoading: true,
      };
    }
    case types.UPDATE_QUARANTINE_FORM_SUCCESS: {
      return {
        ...state,
        updateQuarantineFormLoading: false,
      };
    }
    case types.UPDATE_QUARANTINE_FORM_FAILURE: {
      return {
        ...state,
        updateQuarantineFormLoading: false,
      };
    }
    case types.DELETE_QUARANTINE_FORM_REQUEST: {
      return {
        ...state,
        deleteQuarantineFormLoading: true,
      };
    }
    case types.DELETE_QUARANTINE_FORM_SUCCESS: {
      return {
        ...state,
        deleteQuarantineFormLoading: false,
      };
    }
    case types.DELETE_QUARANTINE_FORM_FAILURE: {
      return {
        ...state,
        deleteQuarantineFormLoading: false,
      };
    }
    case types.GET_QUARANTINE_FORM_DETAIL_REQUEST: {
      return {
        ...state,
        getQuarantineFormDetailLoading: true,
      };
    }
    case types.GET_QUARANTINE_FORM_DETAIL_SUCCESS: {
      return {
        ...state,
        quarantineFormDetail: action.payload,
        getQuarantineFormDetailLoading: false,
      };
    }
    case types.GET_QUARANTINE_FORM_DETAIL_FAILURE: {
      return {
        ...state,
        getQuarantineFormDetailLoading: false,
      };
    }
    default: {
      return state;
    }
  }
}
