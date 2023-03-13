import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { announceTreatmentError } from 'treatment/utils/helpers';

import types from './types';

const getExpectedQuarantineDateRequest = () => ({
  type: types.GET_EXPECTED_QUARANTINE_DATE_REQUEST,
});
const getExpectedQuarantineDateSuccess = (response) => ({
  type: types.GET_EXPECTED_QUARANTINE_DATE_SUCCESS,
  payload: response,
});
const getExpectedQuarantineDateFailure = (error) => ({
  type: types.GET_EXPECTED_QUARANTINE_DATE_FAILURE,
  payload: error,
});

const getExpectedQuarantineDates = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getExpectedQuarantineDateRequest());
    httpClient
      .callApi({
        url: apiLinks.treatment.expectedQuarantineDate.get,
      })
      .then((response) => {
        dispatch(getExpectedQuarantineDateSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getExpectedQuarantineDateFailure(error));
        reject();
      });
  });

const updateExpectedQuarantineDateRequest = () => ({
  type: types.UPDATE_COLLECTING_SESSION_REQUEST,
});
const updateExpectedQuarantineDateSuccess = (response) => ({
  type: types.UPDATE_COLLECTING_SESSION_SUCCESS,
  payload: response,
});
const updateExpectedQuarantineDateFailure = (error) => ({
  type: types.UPDATE_COLLECTING_SESSION_FAILURE,
  payload: error,
});

const updateExpectedQuarantineDate =
  ({ day }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(updateExpectedQuarantineDateRequest());
      httpClient
        .callApi({
          method: 'PUT',
          url: apiLinks.treatment.expectedQuarantineDate.update,
          params: { day },
        })
        .then((response) => {
          dispatch(updateExpectedQuarantineDateSuccess(response));
          toast.success('Thành công');
          resolve();
        })
        .catch((error) => {
          announceTreatmentError(error);
          dispatch(updateExpectedQuarantineDateFailure(error));
          reject();
        });
    });

export { getExpectedQuarantineDates, updateExpectedQuarantineDate };
