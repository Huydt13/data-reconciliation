import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import types from './types';

const getChainMapRequest = () => ({ type: types.GET_CHAIN_MAP_REQUEST });
const getChainMapSuccess = (response) => ({
  type: types.GET_CHAIN_MAP_SUCCESS,
  payload: response,
});
const getChainMapFailure = () => ({ type: types.GET_CHAIN_MAP_FAILURE });

const getChainMap = ({
  diseaseTypeId = '',
  infectionTypeLevelId = '',
  hasNodeName = false,
}) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getChainMapRequest());
    httpClient
      .callApi({
        url: apiLinks.chainMap.get,
        params: {
          diseaseTypeId,
          infectionTypeLevelId,
          hasNodeName,
        },
      })
      .then((response) => {
        dispatch(getChainMapSuccess(response.data));
        resolve(response.data);
      })
      .catch(() => {
        dispatch(getChainMapFailure());
        reject();
      });
  });

const getChainMapDetailRequest = () => ({
  type: types.GET_CHAIN_MAP_BY_ID_REQUEST,
});
const getChainMapDetailSuccess = (response) => ({
  type: types.GET_CHAIN_MAP_BY_ID_SUCCESS,
  payload: response,
});
const getChainMapDetailFailure = () => ({
  type: types.GET_CHAIN_MAP_BY_ID_FAILURE,
});

const getChainMapDetail = ({
  chainId = '',
  infectionTypeLevelId = '',
  hasNodeName = false,
}) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getChainMapDetailRequest());
    httpClient
      .callApi({
        url: apiLinks.chainMap.getDetail + chainId,
        params: {
          infectionTypeLevelId,
          hasNodeName,
        },
      })
      .then((response) => {
        dispatch(getChainMapDetailSuccess(response.data));
        resolve(response.data);
      })
      .catch(() => {
        dispatch(getChainMapDetailFailure());
        reject();
      });
  });

export { getChainMap, getChainMapDetail };
