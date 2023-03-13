import types from '../actions/types';

const INITIAL_STATE = {
  excelCategoryList: [],
  getExcelCategoryLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_EXCEL_CATEGORY_REQUEST: {
      return {
        ...state,
        getExcelCategoryLoading: true,
      };
    }
    case types.GET_EXCEL_CATEGORY_SUCCESS: {
      return {
        ...state,
        excelCategoryList: action.payload,
        getExcelCategoryLoading: false,
      };
    }
    case types.GET_EXCEL_CATEGORY_FAILURE: {
      return {
        ...state,
        getExcelCategoryLoading: false,
      };
    }
    default:
      return state;
  }
}
