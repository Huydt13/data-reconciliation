import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import types from './types';

const getEmployeeTypesRequest = () => ({
  type: types.GET_EMPLOYEE_TYPES_REQUEST,
});
const getEmployeeTypesSuccess = (response) => ({
  type: types.GET_EMPLOYEE_TYPES_SUCCESS,
  payload: response,
});
const getEmployeeTypesFailure = (error) => ({
  type: types.GET_EMPLOYEE_TYPES_FAILURE,
  payload: error,
});

const getEmployeeTypes = (arg) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getEmployeeTypesRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.employeeType.get,
        params: { ...arg },
      })
      .then((response) => {
        dispatch(getEmployeeTypesSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getEmployeeTypesFailure(error));
        reject();
      });
  });

export { getEmployeeTypes };
