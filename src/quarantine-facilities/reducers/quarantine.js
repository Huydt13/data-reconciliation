import types from 'quarantine-facilities/actions/types';

const INITIAL_STATE = {
  appointLoading: false,
  createAppointLoading: false,
  takeInLoading: false,
  completeLoading: false,
  transferTreatmentLoading: false,
  transferFacilityLoading: false,
  transferRoomLoading: false,
  extendLoading: false,
  historyData: {},
  getHistoriesLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.APPOINT_REQUEST: {
      return {
        ...state,
        appointLoading: true,
      };
    }
    case types.APPOINT_SUCCESS:
    case types.APPOINT_FAILURE: {
      return {
        ...state,
        appointLoading: false,
      };
    }
    case types.CREATE_APPOINT_REQUEST: {
      return {
        ...state,
        createAppointLoading: true,
      };
    }
    case types.CREATE_APPOINT_SUCCESS:
    case types.CREATE_APPOINT_FAILURE: {
      return {
        ...state,
        createAppointLoading: false,
      };
    }
    case types.TAKE_IN_REQUEST: {
      return {
        ...state,
        takeInLoading: true,
      };
    }
    case types.TAKE_IN_SUCCESS:
    case types.TAKE_IN_FAILURE: {
      return {
        ...state,
        takeInLoading: false,
      };
    }
    case types.COMPLETE_FACILITY_REQUEST: {
      return {
        ...state,
        completeLoading: true,
      };
    }
    case types.COMPLETE_FACILITY_SUCCESS:
    case types.COMPLETE_FACILITY_FAILURE: {
      return {
        ...state,
        completeLoading: false,
      };
    }
    case types.TRANSFER_TREATMENT_REQUEST: {
      return {
        ...state,
        transferTreatmentLoading: true,
      };
    }
    case types.TRANSFER_TREATMENT_SUCCESS:
    case types.TRANSFER_TREATMENT_FAILURE: {
      return {
        ...state,
        transferTreatmentLoading: false,
      };
    }
    case types.TRANSFER_ROOM_REQUEST: {
      return {
        ...state,
        transferRoomLoading: true,
      };
    }
    case types.TRANSFER_ROOM_SUCCESS:
    case types.TRANSFER_ROOM_FAILURE: {
      return {
        ...state,
        transferRoomLoading: false,
      };
    }
    case types.TRANSFER_FACILITY_REQUEST: {
      return {
        ...state,
        transferFacilityLoading: true,
      };
    }
    case types.TRANSFER_FACILITY_SUCCESS:
    case types.TRANSFER_FACILITY_FAILURE: {
      return {
        ...state,
        transferFacilityLoading: false,
      };
    }
    case types.EXTEND_FACILITY_REQUEST: {
      return {
        ...state,
        extendLoading: true,
      };
    }
    case types.EXTEND_FACILITY_SUCCESS:
    case types.EXTEND_FACILITY_FAILURE: {
      return {
        ...state,
        extendLoading: false,
      };
    }
    case types.GET_HISTORIES_REQUEST: {
      return {
        ...state,
        getHistoriesLoading: true,
      };
    }
    case types.GET_HISTORIES_SUCCESS: {
      return {
        ...state,
        historyData: action.payload,
        getHistoriesLoading: false,
      };
    }
    case types.GET_HISTORIES_FAILURE: {
      return {
        ...state,
        getHistoriesLoading: false,
      };
    }
    default: {
      return state;
    }
  }
}
