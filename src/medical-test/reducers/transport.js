import { examinationPaging } from 'app/utils/helpers';
import types from '../actions/types';

const INITIAL_STATE = {
  transportData: [],
  getTransportsLoading: false,
  createTransportLoading: false,
  updateTransportLoading: false,
  deleteTransportLoading: false,
  sendTransportLoading: false,
  receiveTransportLoading: false,
  unitAvailableList: [],
  getUnitsAvailableLoading: false,
  uploadProgress: 0,
  uploadProgressLoading: false,
  exportTransportLoading: false,
  availableExamForTransportList: examinationPaging,
  getAvailableExamForTransportLoading: false,
  importTransportExcelData: [],
  transportById: undefined,
  getTransportByIdLoading: false,
  quickReceiveLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.CLEAR_EXAMINATIONS_EXCEL:
      return {
        ...state,
        importTransportExcelData: [],
      };
    case types.GET_TRANSPORTS_REQUEST:
      return {
        ...state,
        getTransportsLoading: true,
      };
    case types.GET_TRANSPORTS_SUCCESS:
      return {
        ...state,
        transportData: action.payload,
        getTransportsLoading: false,
      };
    case types.GET_TRANSPORTS_FAILURE:
      return {
        ...state,
        getTransportsLoading: false,
      };
    case types.CREATE_TRANSPORT_REQUEST:
      return {
        ...state,
        createTransportLoading: true,
      };
    case types.CREATE_TRANSPORT_SUCCESS:
    case types.CREATE_TRANSPORT_FAILURE:
      return {
        ...state,
        createTransportLoading: false,
      };
    case types.UPDATE_TRANSPORT_REQUEST:
      return {
        ...state,
        updateTransportLoading: true,
      };
    case types.UPDATE_TRANSPORT_SUCCESS:
    case types.UPDATE_TRANSPORT_FAILURE:
      return {
        ...state,
        updateTransportLoading: false,
      };
    case types.DELETE_TRANSPORT_REQUEST:
      return {
        ...state,
        deleteTransportLoading: true,
      };
    case types.DELETE_TRANSPORT_SUCCESS:
    case types.DELETE_TRANSPORT_FAILURE:
      return {
        ...state,
        deleteTransportLoading: false,
      };
    case types.SEND_TRANSPORT_REQUEST:
      return {
        ...state,
        sendTransportLoading: true,
      };
    case types.SEND_TRANSPORT_SUCCESS:
    case types.SEND_TRANSPORT_FAILURE:
      return {
        ...state,
        sendTransportLoading: false,
      };
    case types.RECEIVE_TRANSPORT_REQUEST:
      return {
        ...state,
        receiveTransportLoading: true,
      };
    case types.RECEIVE_TRANSPORT_SUCCESS:
    case types.RECEIVE_TRANSPORT_FAILURE:
      return {
        ...state,
        receiveTransportLoading: false,
      };
    case types.GET_UNITS_AVAILABLE_REQUEST: {
      return {
        ...state,
        getUnitsAvailableLoading: true,
      };
    }
    case types.GET_UNITS_AVAILABLE_SUCCESS: {
      return {
        ...state,
        unitAvailableList: action.payload,
        getUnitsAvailableLoading: false,
      };
    }
    case types.GET_UNITS_AVAILABLE_FAILURE: {
      return {
        ...state,
        getUnitsAvailableLoading: false,
      };
    }
    case types.SET_UPLOAD_TRANSPORT_FILE_PROGRESS: {
      return {
        ...state,
        uploadProgress: action.payload,
      };
    }
    case types.UPLOAD_TRANSPORT_FILE_REQUEST:
    case types.UPLOAD_TRANSPORT_EXCEL_REQUEST:
      return {
        ...state,
        uploadProgressLoading: true,
      };
    case types.UPLOAD_TRANSPORT_EXCEL_SUCCESS:
      return {
        ...state,
        uploadProgressLoading: false,
        importTransportExcelData: action.payload,
      };
    case types.UPLOAD_TRANSPORT_FILE_SUCCESS:
    case types.UPLOAD_TRANSPORT_FILE_FAILURE:
    case types.UPLOAD_TRANSPORT_EXCEL_FAILURE:
      return {
        ...state,
        uploadProgressLoading: false,
      };
    case types.EXPORT_TRANSPORT_FILE_REQUEST:
      return {
        ...state,
        exportTransportLoading: true,
      };
    case types.EXPORT_TRANSPORT_FILE_SUCCESS:
    case types.EXPORT_TRANSPORT_FILE_FAILURE:
      return {
        ...state,
        exportTransportLoading: false,
      };
    case types.GET_AVAILABLE_EXAM_FOR_TRANSPORT_REQUEST:
      return {
        ...state,
        getAvailableExamForTransportLoading: true,
      };
    case types.GET_AVAILABLE_EXAM_FOR_TRANSPORT_SUCCESS:
      return {
        ...state,
        availableExamForTransportList: action.payload,
        getAvailableExamForTransportLoading: false,
      };
    case types.GET_AVAILABLE_EXAM_FOR_TRANSPORT_FAILURE:
      return {
        ...state,
        getAvailableExamForTransportLoading: false,
      };
    case types.GET_TRANSPORT_BY_ID_REQUEST:
      return {
        ...state,
        getTransportByIdLoading: true,
      };
    case types.GET_TRANSPORT_BY_ID_SUCCESS:
      return {
        ...state,
        transportDetail: action.payload,
        getTransportByIdLoading: false,
      };
    case types.GET_TRANSPORT_BY_ID_FAILURE:
      return {
        ...state,
        getTransportByIdLoading: false,
      };
    case types.QUICK_RECEIVE_TRANSPORT_REQUEST:
      return {
        ...state,
        quickReceiveLoading: true,
      };
    case types.QUICK_RECEIVE_TRANSPORT_SUCCESS:
    case types.QUICK_RECEIVE_TRANSPORT_FAILURE:
      return {
        ...state,
        quickReceiveLoading: false,
      };
    default:
      return state;
  }
}
