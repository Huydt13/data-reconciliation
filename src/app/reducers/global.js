import types, {
  TRIGGER_SIDEBAR_OPEN,
  TRIGGER_TREE_FOLDER_OPEN,
  SHOW_CONFIRM_MODAL,
  SHOW_FORWARD_MODAL,
  SHOW_INFO_MODAL,
  SHOW_ERROR_MODAL,
} from '../actions/types';

const INITIAL_STATE = {
  sidebarOpen: false,
  treeFolderOpen: false,
  confirmMessage: '',
  confirmCallback: null,
  forwardMessage: '',
  forwardCallback: null,
  infoHeader: '',
  infoContent: '',
  infoCallback: null,
  errorHeader: '',
  errorSuccess: '',
  errorFailLogs: [],
  importLoading: false,
  exportLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case TRIGGER_SIDEBAR_OPEN:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    case TRIGGER_TREE_FOLDER_OPEN:
      return {
        ...state,
        treeFolderOpen: !state.treeFolderOpen,
      };
    case SHOW_CONFIRM_MODAL:
      return {
        ...state,
        confirmMessage: action.payload.message,
        confirmCallback: action.payload.confirmCallback,
      };
    case SHOW_ERROR_MODAL:
      return {
        ...state,
        errorHeader: action.payload.header,
        errorSuccessList: action.payload.successList,
        errorFailLogs: action.payload.failLogs,
      };
    case SHOW_FORWARD_MODAL:
      return {
        ...state,
        forwardMessage: action.payload.message,
        forwardCallback: action.payload.confirmCallback,
      };
    case SHOW_INFO_MODAL:
      return {
        ...state,
        infoHeader: action.payload.header,
        infoContent: action.payload.content,
        infoCallback: action.payload.infoCallback,
      };
    case types.IMPORT_REQUEST:
      return {
        ...state,
        importLoading: true,
      };
    case types.IMPORT_SUCCESS:
    case types.IMPORT_FAILURE:
      return {
        ...state,
        importLoading: false,
      };
    case types.EXPORT_REQUEST:
      return {
        ...state,
        exportLoading: true,
      };
    case types.EXPORT_SUCCESS:
    case types.EXPORT_FAILURE:
      return {
        ...state,
        exportLoading: false,
      };
    default:
      return state;
  }
}
