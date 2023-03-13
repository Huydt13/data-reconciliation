/* eslint-disable no-nested-ternary */
/* eslint-disable no-case-declarations */
import types from '../actions/types';

const INITIAL_STATE = {
  selectedRows: [],
  sessionData: {},
  getSessionsLoading: false,
  createSessionLoading: false,
  updateSessionLoading: false,
  deleteSessionLoading: false,
  plateAutoFill: [],
  getPlateAutoFillLoading: false,
  exportPlateLoading: false,
  uploadPlateResultLoading: false,
  uploadPlateResultProgress: 0,
  sessionDetail: null,
  getSessionDetailLoading: false,
  updateSessionResultLoading: false,
  sessionTestingLoading: false,
  createAndUpdateResultLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SELECT_EXAMS:
      const { pageIndex } = action.payload;
      let result = [];
      if (
        state.selectedRows.filter((r) => r.pageIndex === pageIndex).length !== 0
      ) {
        result = state.selectedRows.map((r) =>
          r.pageIndex === pageIndex ? action.payload : r,
        );
      } else {
        result = [...state.selectedRows, action.payload];
      }
      return {
        ...state,
        selectedRows: result,
      };
    case types.CLEAR_EXAMS:
      return {
        ...state,
        selectedRows: [],
      };
    case types.GET_SESSIONS_REQUEST:
      return {
        ...state,
        getSessionsLoading: true,
      };
    case types.GET_SESSIONS_SUCCESS:
      return {
        ...state,
        sessionData: action.payload,
        getSessionsLoading: false,
      };
    case types.GET_SESSIONS_FAILURE:
      return {
        ...state,
        getSessionsLoading: false,
      };
    case types.CREATE_SESSION_REQUEST:
      return {
        ...state,
        createSessionLoading: true,
      };
    case types.CREATE_SESSION_SUCCESS:
    case types.CREATE_SESSION_FAILURE:
      return {
        ...state,
        createSessionLoading: false,
      };
    case types.UPDATE_SESSION_REQUEST:
      return {
        ...state,
        updateSessionLoading: true,
      };
    case types.UPDATE_SESSION_SUCCESS:
    case types.UPDATE_SESSION_FAILURE:
      return {
        ...state,
        updateSessionLoading: false,
      };
    case types.DELETE_SESSION_REQUEST:
      return {
        ...state,
        deleteSessionLoading: true,
      };
    case types.DELETE_SESSION_SUCCESS:
    case types.DELETE_SESSION_FAILURE:
      return {
        ...state,
        deleteSessionLoading: false,
      };
    case types.GET_PLATE_AUTO_FILL_REQUEST:
      return {
        ...state,
        getPlateAutoFillLoading: true,
      };
    case types.GET_PLATE_AUTO_FILL_SUCCESS:
      return {
        ...state,
        plateAutoFill: action.payload,
        getPlateAutoFillLoading: false,
      };
    case types.GET_PLATE_AUTO_FILL_FAILURE:
      return {
        ...state,
        getPlateAutoFillLoading: false,
      };
    case types.GET_SESSION_DETAIL_REQUEST:
      return {
        ...state,
        getSessionDetailLoading: true,
      };
    case types.GET_SESSION_DETAIL_SUCCESS:
      return {
        ...state,
        sessionDetail: action.payload,
        getSessionDetailLoading: false,
      };
    case types.GET_SESSION_DETAIL_FAILURE:
      return {
        ...state,
        getSessionDetailLoading: false,
      };
    case types.EXPORT_PLATE_REQUEST: {
      return {
        ...state,
        exportPlateLoading: true,
      };
    }
    case types.EXPORT_PLATE_SUCCESS:
    case types.EXPORT_PLATE_FAILURE:
      return {
        ...state,
        exportPlateLoading: false,
      };
    case types.EXPORT_PLATE_RESULT_REQUEST: {
      return {
        ...state,
        exportPlateResultLoading: true,
      };
    }
    case types.EXPORT_PLATE_RESULT_SUCCESS:
    case types.EXPORT_PLATE_RESULT_FAILURE:
      return {
        ...state,
        exportPlateResultLoading: false,
      };
    case types.SET_UPLOAD_PLATE_RESULT_PROGRESS: {
      return {
        ...state,
        uploadPlateResultProgress: action.payload,
      };
    }
    case types.UPLOAD_PLATE_RESULT_REQUEST:
      return {
        ...state,
        uploadPlateResultLoading: true,
        uploadPlateResultProgress: 0,
      };
    case types.UPLOAD_PLATE_RESULT_SUCCESS:
    case types.UPLOAD_PLATE_RESULT_FAILURE:
      return {
        ...state,
        uploadPlateResultLoading: false,
      };
    case types.UPDATE_SESSION_RESULT_REQUEST:
      return {
        ...state,
        updateSessionResultLoading: true,
      };
    case types.UPDATE_SESSION_RESULT_SUCCESS:
    case types.UPDATE_SESSION_RESULT_FAILURE:
      return {
        ...state,
        updateSessionResultLoading: false,
      };
    case types.SESSION_TESTING_REQUEST:
      return {
        ...state,
        sessionTestingLoading: true,
      };
    case types.SESSION_TESTING_SUCCESS:
    case types.SESSION_TESTING_FAILURE:
      return {
        ...state,
        sessionTestingLoading: false,
      };
    case types.CREATE_AND_UPDATE_RESULT_REQUEST:
      return {
        ...state,
        createAndUpdateResultLoading: true,
      };
    case types.CREATE_AND_UPDATE_RESULT_SUCCESS:
    case types.CREATE_AND_UPDATE_RESULT_FAILURE:
      return {
        ...state,
        createAndUpdateResultLoading: false,
      };
    default:
      return state;
  }
}
