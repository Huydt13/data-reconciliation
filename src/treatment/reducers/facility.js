import { treatmentPaging } from 'app/utils/helpers';
import types from '../actions/types';

const INITIAL_STATE = {
  facilityInfo: undefined,
  getFacilityInfoLoading: false,

  facilityData: treatmentPaging,
  getFacilityListLoading: false,

  facilityDetailData: undefined,
  getFacilityDetailLoading: false,

  createFacilityLoading: false,

  updateFacilityLoading: false,

  deleteFacilityLoading: false,

  completedData: treatmentPaging,
  getCompletedLoading: false,
  transitedData: treatmentPaging,
  getTransitedLoading: false,
  outOfProcessData: treatmentPaging,
  getOutOfProcessLoading: false,

  getTransferLoading: false,
  transferData: treatmentPaging,
  approveTransferLoading: false,

  undoTreatmentLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.TM_GET_FACILITY_INFO_REQUEST:
      return {
        ...state,
        getFacilityInfoLoading: true,
      };
    case types.TM_GET_FACILITY_INFO_SUCCESS:
      return {
        ...state,
        getFacilityInfoLoading: false,
        facilityInfo: action.payload,
      };
    case types.TM_GET_FACILITY_INFO_FAILURE:
      return {
        ...state,
        getFacilityInfoLoading: false,
      };
    case types.GET_FACILITY_LIST_REQUEST:
      return {
        ...state,
        getFacilityListLoading: true,
      };
    case types.GET_FACILITY_LIST_SUCCESS:
      return {
        ...state,
        facilityData: action.payload,
        getFacilityListLoading: false,
      };
    case types.GET_FACILITY_LIST_FAILURE:
      return {
        ...state,
        getFacilityInfoLoading: false,
      };
    case types.GET_FACILITY_DETAIL_REQUEST:
      return {
        ...state,
        getFacilityDetailLoading: true,
      };
    case types.GET_FACILITY_DETAIL_SUCCESS:
      return {
        ...state,
        facilityDetailData: action.payload,
        getFacilityDetailLoading: false,
      };
    case types.GET_FACILITY_DETAIL_FAILURE:
      return {
        ...state,
        getFacilityDetailLoading: false,
      };
    case types.CREATE_FACILITY_REQUEST:
      return {
        ...state,
        createFacilityLoading: true,
      };
    case types.CREATE_FACILITY_SUCCESS:
    case types.CREATE_FACILITY_FAILURE:
      return {
        ...state,
        createFacilityLoading: false,
      };
    case types.UPDATE_FACILITY_REQUEST:
      return {
        ...state,
        updateFacilityLoading: true,
      };
    case types.UPDATE_FACILITY_SUCCESS:
    case types.UPDATE_FACILITY_FAILURE:
      return {
        ...state,
        updateFacilityLoading: false,
      };
    case types.DELETE_FACILITY_REQUEST:
      return {
        ...state,
        deleteFacilityLoading: true,
      };
    case types.DELETE_FACILITY_SUCCESS:
    case types.DELETE_FACILITY_FAILURE:
      return {
        ...state,
        deleteFacilityLoading: true,
      };
    case types.TM_GET_COMPLETED_REQUEST:
      return {
        ...state,
        getCompletedLoading: true,
      };
    case types.TM_GET_COMPLETED_SUCCESS:
      return {
        ...state,
        completedData: action.payload,
        getCompletedLoading: false,
      };
    case types.TM_GET_COMPLETED_FAILURE:
      return {
        ...state,
        getCompletedLoading: false,
      };
    case types.TM_GET_OUT_OF_PROCESS_REQUEST:
      return {
        ...state,
        getOutOfProcessLoading: true,
      };
    case types.TM_GET_OUT_OF_PROCESS_SUCCESS:
      return {
        ...state,
        outOfProcessData: action.payload,
        getOutOfProcessLoading: false,
      };
    case types.TM_GET_OUT_OF_PROCESS_FAILURE:
      return {
        ...state,
        getOutOfProcessLoading: false,
      };
    case types.TM_GET_TRANSITED_REQUEST:
      return {
        ...state,
        getTransitedLoading: true,
      };
    case types.TM_GET_TRANSITED_SUCCESS:
      return {
        ...state,
        transitedData: action.payload,
        getTransitedLoading: false,
      };
    case types.TM_GET_TRANSITED_FAILURE:
      return {
        ...state,
        getTransitedLoading: false,
      };
    case types.TM_GET_TRANSFER_REQUEST: {
      return {
        ...state,
        getTransferLoading: true,
      };
    }
    case types.TM_GET_TRANSFER_SUCCESS: {
      return {
        ...state,
        getTransferLoading: false,
        transferData: action.payload,
      };
    }
    case types.TM_GET_TRANSFER_FAILURE: {
      return {
        ...state,
        getTransferLoading: false,
      };
    }
    case types.TM_APPROVE_TRANSFER_REQUEST: {
      return {
        ...state,
        approveTransferLoading: false,
      };
    }
    case types.TM_APPROVE_TRANSFER_SUCCESS:
    case types.TM_APPROVE_TRANSFER_FAILURE: {
      return {
        ...state,
        approveTransferLoading: false,
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
    default:
      return state;
  }
};
