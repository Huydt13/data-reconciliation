import types from 'treatment/actions/types';

const INITIAL_STATE = {
  facilityData: {},
  getFacilitiesLoading: false,
  createFacilityLoading: false,
  updateFacilityLoading: false,
  deleteFacilityLoading: false,
  setManagerLoading: false,
  undoTreatmentLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_FACILITY_REQUEST: {
      return {
        ...state,
        getFacilitiesLoading: true,
      };
    }
    case types.GET_FACILITY_SUCCESS: {
      return {
        ...state,
        getFacilitiesLoading: false,
        facilityData: action.payload,
      };
    }
    case types.GET_FACILITY_FAILURE: {
      return {
        ...state,
        getFacilitiesLoading: false,
      };
    }
    case types.CREATE_FACILITY_REQUEST: {
      return {
        ...state,
        createFacilityLoading: true,
      };
    }
    case types.CREATE_FACILITY_SUCCESS: {
      return {
        ...state,
        createFacilityLoading: false,
      };
    }
    case types.CREATE_FACILITY_FAILURE: {
      return {
        ...state,
        createFacilityLoading: false,
      };
    }
    case types.UPDATE_FACILITY_REQUEST: {
      return {
        ...state,
        updateFacilityLoading: true,
      };
    }
    case types.UPDATE_FACILITY_SUCCESS: {
      return {
        ...state,
        updateFacilityLoading: false,
      };
    }
    case types.UPDATE_FACILITY_FAILURE: {
      return {
        ...state,
        updateFacilityLoading: false,
      };
    }
    case types.DELETE_FACILITY_REQUEST: {
      return {
        ...state,
        deleteFacilityLoading: true,
      };
    }
    case types.DELETE_FACILITY_SUCCESS: {
      return {
        ...state,
        deleteFacilityLoading: false,
      };
    }
    case types.DELETE_FACILITY_FAILURE: {
      return {
        ...state,
        deleteFacilityLoading: false,
      };
    }
    case types.TM_UNDO_REQUEST: {
      return {
        ...state,
        undoTreatmentLoading: true,
      };
    }
    case types.TM_UNDO_SUCCESS:
    case types.TM_UNDO_FAILURE: {
      return {
        ...state,
        undoTreatmentLoading: false,
      };
    }
    default: {
      return state;
    }
  }
}
