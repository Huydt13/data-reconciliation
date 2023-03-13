import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import types from './types';

const getExcelCategoryRequest = () => ({ type: types.GET_EXCEL_CATEGORY_REQUEST });
const getExcelCategorySuccess = (response) => ({
  type: types.GET_EXCEL_CATEGORY_SUCCESS,
  payload: response,
});
const getExcelCategoryFailure = (error) => ({
  type: types.GET_EXCEL_CATEGORY_FAILURE,
  payload: error,
});

const getExcelCategories = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getExcelCategoryRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.excelCategories.get,
      })
      .then((response) => {
        dispatch(getExcelCategorySuccess(response.data?.data ?? []));
        resolve();
      })
      .catch((error) => {
        dispatch(getExcelCategoryFailure(error));
        reject();
      });
  });

export { getExcelCategories };
