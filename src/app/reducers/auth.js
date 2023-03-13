import types, {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SET_TOKEN,
  SET_PERMISSIONS,
  GET_PERMISSION_REQUEST,
  GET_PERMISSION_SUCCESS,
  GET_PERMISSION_FAILURE,
  GET_USER_INFO_REQUEST,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_FAILURE,
  LOG_OUT,
} from 'app/actions/types';

const INITIAL_STATE = {
  token: null,
  tokenExpiredTime: null,
  loginLoading: false,
  userInfo: null,
  getUserInfoLoading: false,
  getPermissionLoading: false,
  permissionList: [],
  changePasswordLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOG_IN_REQUEST:
      return {
        ...state,
        loginLoading: true,
      };
    case LOG_IN_SUCCESS: {
      const token = action.payload;
      return {
        ...state,
        token,
        tokenExpiredTime: new Date(
          new Date().getTime() + token.expires_in * 1000,
        ),
        loginLoading: false,
      };
    }
    case LOG_IN_FAILURE:
      return {
        ...state,
        loginLoading: false,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload.token,
        tokenExpiredTime: action.payload.tokenExpiredTime,
        userInfo: action.payload.userInfo,
      };
    case SET_PERMISSIONS:
      return {
        ...state,
        permissionList: action.payload,
      };
    case types.AUTH_CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        changePasswordLoading: true,
      };
    case types.AUTH_CHANGE_PASSWORD_SUCCESS:
    case types.AUTH_CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        changePasswordLoading: false,
      };
    case GET_USER_INFO_REQUEST:
      return {
        ...state,
        getUserInfoLoading: true,
      };
    case GET_USER_INFO_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        getUserInfoLoading: false,
      };
    case GET_USER_INFO_FAILURE:
      return {
        ...state,
        getUserInfoLoading: false,
      };
    case GET_PERMISSION_REQUEST:
      return {
        ...state,
        getPermissionLoading: true,
      };
    case GET_PERMISSION_SUCCESS:
      return {
        ...state,
        permissionList: action.payload,
        getPermissionLoading: false,
      };
    case GET_PERMISSION_FAILURE:
      return {
        ...state,
        getPermissionLoading: false,
      };
    case LOG_OUT:
      return {
        ...state,
        token: null,
        tokenExpiredTime: null,
        userInfo: null,
      };
    default:
      return state;
  }
}
