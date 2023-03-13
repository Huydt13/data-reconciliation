import types from '../actions/types';

const INITIAL_STATE = {
  employeeTypeList: [],
  getEmployeeTypesLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_EMPLOYEE_TYPES_REQUEST: {
      return {
        ...state,
        getEmployeeTypesLoading: true,
      };
    }
    case types.GET_EMPLOYEE_TYPES_SUCCESS: {
      return {
        ...state,
        employeeTypeList: action.payload,
        getEmployeeTypesLoading: false,
      };
    }
    case types.GET_EMPLOYEE_TYPES_FAILURE: {
      return {
        ...state,
        getEmployeeTypesLoading: false,
      };
    }
    default:
      return state;
  }
};
