import { treatmentPaging } from 'app/utils/helpers';
import types from '../actions/types';

const INITIAL_STATE = {
  quarantineListByFacilityData: treatmentPaging,
  getQuarantineListByFacilityLoading: false,

  facilityDetailData: undefined,
  getFacilityDetailLoading: false,

  completeTreatmentLoading: false,

  transitTreatmentLoading: false,

  outOfProcessTreatmentLoading: false,

  createTransferLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_QUARANTINE_LIST_BY_FACILITY_REQUEST:
      return {
        ...state,
        getQuarantineListByFacilityLoading: true,
      };
    case types.GET_QUARANTINE_LIST_BY_FACILITY_SUCCESS:
      return {
        ...state,
        getQuarantineListByFacilityLoading: false,
        quarantineListByFacilityData: action.payload,
      };
    case types.GET_QUARANTINE_LIST_BY_FACILITY_FAILURE:
      return {
        ...state,
        getQuarantineListByFacilityLoading: false,
      };
    case types.TM_COMPLETE_REQUEST:
      return {
        ...state,
        completeTreatmentLoading: true,
      };
    case types.TM_COMPLETE_SUCCESS:
    case types.TM_COMPLETE_FAILURE:
      return {
        ...state,
        completeTreatmentLoading: false,
      };
    case types.TM_TRANSIT_REQUEST:
      return {
        ...state,
        transitTreatmentLoading: true,
      };
    case types.TM_TRANSIT_SUCCESS:
    case types.TM_TRANSIT_FAILURE:
      return {
        ...state,
        transitTreatmentLoading: false,
      };
    case types.TM_OUT_OF_PROCESS_REQUEST:
      return {
        ...state,
        outOfProcessTreatmentLoading: true,
      };
    case types.TM_OUT_OF_PROCESS_SUCCESS:
    case types.TM_OUT_OF_PROCESS_FAILURE:
      return {
        ...state,
        outOfProcessTreatmentLoading: true,
      };
    case types.TM_TRANSFER_REQUEST:
      return {
        ...state,
        createTransferLoading: true,
      };
    case types.TM_TRANSFER_SUCCESS:
    case types.TM_TRANSFER_FAILURE:
      return {
        ...state,
        createTransferLoading: true,
      };
    default:
      return state;
  }
};
