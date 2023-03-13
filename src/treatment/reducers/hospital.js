import { treatmentPaging } from 'app/utils/helpers';
import types from 'treatment/actions/types';

const INITIAL_STATE = {
  hospitalData: treatmentPaging,
  getHospitalsLoading: false,
  createHospitalLoading: false,
  updateHospitalLoading: false,
  deleteHospitalLoading: false,
  hospitalByFacilityData: treatmentPaging,
  getHospitalsByFacilityLoading: false,
  addHospitalsLoading: false,
  removeHospitalsLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.TM_GET_HOSPITALS_REQUEST: {
      return {
        ...state,
        getHospitalsLoading: true,
      };
    }
    case types.TM_GET_HOSPITALS_SUCCESS: {
      return {
        ...state,
        getHospitalsLoading: false,
        hospitalData: action.payload,
      };
    }
    case types.TM_GET_HOSPITALS_FAILURE: {
      return {
        ...state,
        getHospitalsLoading: false,
      };
    }
    case types.TM_CREATE_HOSPITAL_REQUEST: {
      return {
        ...state,
        createHospitalLoading: true,
      };
    }
    case types.TM_CREATE_HOSPITAL_SUCCESS:
    case types.TM_CREATE_HOSPITAL_FAILURE: {
      return {
        ...state,
        createHospitalLoading: false,
      };
    }
    case types.TM_UPDATE_HOSPITAL_REQUEST: {
      return {
        ...state,
        updateHospitalLoading: true,
      };
    }
    case types.TM_UPDATE_HOSPITAL_SUCCESS:
    case types.TM_UPDATE_HOSPITAL_FAILURE: {
      return {
        ...state,
        updateHospitalLoading: false,
      };
    }
    case types.TM_DELETE_HOSPITAL_REQUEST: {
      return {
        ...state,
        deleteHospitalLoading: true,
      };
    }
    case types.TM_DELETE_HOSPITAL_SUCCESS:
    case types.TM_DELETE_HOSPITAL_FAILURE: {
      return {
        ...state,
        deleteHospitalLoading: false,
      };
    }
    case types.TM_GET_HOSPITALS_BY_FACILITY_REQUEST: {
      return {
        ...state,
        getHospitalsByFacilityLoading: true,
      };
    }
    case types.TM_GET_HOSPITALS_BY_FACILITY_SUCCESS: {
      return {
        ...state,
        getHospitalsByFacilityLoading: false,
        hospitalByFacilityData: action.payload,
      };
    }
    case types.TM_GET_HOSPITALS_BY_FACILITY_FAILURE: {
      return {
        ...state,
        getHospitalsByFacilityLoading: false,
      };
    }
    case types.TM_ADD_HOSPITALS_TO_FACILITY_REQUEST: {
      return {
        ...state,
        addHospitalsLoading: true,
      };
    }
    case types.TM_ADD_HOSPITALS_TO_FACILITY_SUCCESS:
    case types.TM_ADD_HOSPITALS_TO_FACILITY_FAILURE: {
      return {
        ...state,
        addHospitalsLoading: false,
      };
    }
    case types.TM_REMOVE_HOSPITALS_TO_FACILITY_REQUEST: {
      return {
        ...state,
        removeHospitalsLoading: true,
      };
    }
    case types.TM_REMOVE_HOSPITALS_TO_FACILITY_SUCCESS:
    case types.TM_REMOVE_HOSPITALS_TO_FACILITY_FAILURE: {
      return {
        ...state,
        removeHospitalsLoading: false,
      };
    }
    default: {
      return state;
    }
  }
}
