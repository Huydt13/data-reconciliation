import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import types from './types';

const getAccountInfoRequest = () => ({
  type: types.TM_GET_ACCOUNT_INFO_REQUEST,
});
const getAccountInfoSuccess = (response) => ({
  type: types.TM_GET_ACCOUNT_INFO_SUCCESS,
  payload: response,
});
const getAccountInfoFailure = (error) => ({
  type: types.TM_GET_ACCOUNT_INFO_FAILURE,
  payload: error,
});

const getAccountInfo = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAccountInfoRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.account.getInfo,
      })
      .then((response) => {
        dispatch(getAccountInfoSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getAccountInfoFailure(error));
        reject();
      });
  });

export { getAccountInfo };
