import { treatmentPaging } from 'app/utils/helpers';
import types from '../actions/types';

const INITIAL_STATE = {
  employeeList: [],
  getEmployeeListLoading: false,
  employeeByToken: treatmentPaging,
  getEmployeeTokenLoading: false,
  createEmployeeLoading: false,
  updateEmployeeByIdLoading: false,
  updateEmployeeByTokenLoading: false,
  deleteEmployeeLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_EMPLOYEE_LIST_REQUEST: {
      return {
        ...state,
        getEmployeeListLoading: true,
      };
    }
    case types.GET_EMPLOYEE_LIST_SUCCESS: {
      return {
        ...state,
        employeeList: action.payload,
        getEmployeeListLoading: false,
      };
    }
    case types.GET_EMPLOYEE_LIST_FAILURE: {
      return {
        ...state,
        getEmployeeListLoading: false,
      };
    }
    case types.GET_EMPLOYEE_BY_TOKEN_REQUEST: {
      return {
        ...state,
        getEmployeeTokenLoading: true,
      };
    }
    case types.GET_EMPLOYEE_BY_TOKEN_SUCCESS: {
      return {
        ...state,
        employeeByToken: action.payload,
        getEmployeeTokenLoading: false,
      };
    }
    case types.GET_EMPLOYEE_BY_TOKEN_FAILURE: {
      return {
        ...state,
        getEmployeeTokenLoading: false,
      };
    }
    case types.CREATE_EMPLOYEE_REQUEST: {
      return {
        ...state,
        createEmployeeLoading: true,
      };
    }
    case types.CREATE_EMPLOYEE_SUCCESS:
    case types.CREATE_EMPLOYEE_FAILURE: {
      return {
        ...state,
        createEmployeeLoading: false,
      };
    }
    case types.UPDATE_EMPLOYEE_BY_ID_REQUEST: {
      return {
        ...state,
        updateEmployeeByIdLoading: true,
      };
    }
    case types.UPDATE_EMPLOYEE_BY_ID_SUCCESS:
    case types.UPDATE_EMPLOYEE_BY_ID_FAILURE: {
      return {
        ...state,
        updateEmployeeByIdLoading: false,
      };
    }
    case types.UPDATE_EMPLOYEE_BY_TOKEN_REQUEST: {
      return {
        ...state,
        updateEmployeeByTokenLoading: true,
      };
    }
    case types.UPDATE_EMPLOYEE_BY_TOKEN_SUCCESS:
    case types.UPDATE_EMPLOYEE_BY_TOKEN_FAILURE: {
      return {
        ...state,
        updateEmployeeByTokenLoading: false,
      };
    }
    case types.DELETE_EMPLOYEE_REQUEST: {
      return {
        ...state,
        deleteEmployeeLoading: true,
      };
    }
    case types.DELETE_EMPLOYEE_SUCCESS:
    case types.DELETE_EMPLOYEE_FAILURE: {
      return {
        ...state,
        deleteEmployeeLoading: false,
      };
    }
    default:
      return state;
  }
};
