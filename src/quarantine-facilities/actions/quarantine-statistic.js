import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import types from './types';

const getQuarantineStatistic1Request = () => ({ type: types.GET_QUARANTINE_STATISTIC_1_REQUEST });
const getQuarantineStatistic1Success = (response) => ({ type: types.GET_QUARANTINE_STATISTIC_1_SUCCESS, payload: response });
const getQuarantineStatistic1Failure = (error) => ({ type: types.GET_QUARANTINE_STATISTIC_1_FAILURE, payload: error });

const getQuarantineStatistic1 = () => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getQuarantineStatistic1Request());
  httpClient.callApi({
    url: apiLinks.facilities.quarantineFacilities.statistic1,
  }).then((response) => {
    dispatch(getQuarantineStatistic1Success(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getQuarantineStatistic1Failure(error));
    reject();
  });
});

const getQuarantineStatistic2Request = () => ({ type: types.GET_QUARANTINE_STATISTIC_2_REQUEST });
const getQuarantineStatistic2Success = (response) => ({ type: types.GET_QUARANTINE_STATISTIC_2_SUCCESS, payload: response });
const getQuarantineStatistic2Failure = (error) => ({ type: types.GET_QUARANTINE_STATISTIC_2_FAILURE, payload: error });

const getQuarantineStatistic2 = () => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getQuarantineStatistic2Request());
  httpClient.callApi({
    url: apiLinks.facilities.quarantineFacilities.statistic2,
  }).then((response) => {
    dispatch(getQuarantineStatistic2Success(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getQuarantineStatistic2Failure(error));
    reject();
  });
});

export {
  getQuarantineStatistic1,
  getQuarantineStatistic2,
};
