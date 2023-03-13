import axios from 'axios';

import store from '../store';

let cancelToken;

const httpClient = {
  callApi: async ({
    method = 'GET',
    contentType = 'application/json',
    url,
    data,
    params,
    onUploadProgress,
    responseType,
    cancelToken: isCancel,
  }) => {
    const { token } = store.getState().auth; // token
    const headerToken = token ? { Authorization: `bearer ${token}` } : null;
    if (typeof cancelToken !== typeof undefined) {
      cancelToken.cancel('Operation canceled due to new request.');
    }
    cancelToken = axios.CancelToken.source();

    return axios({
      method,
      contentType,
      url,
      headers: { ...headerToken },
      data,
      params,
      onUploadProgress,
      responseType,
      cancelToken: isCancel && cancelToken.token,
    });
  },
};

export default httpClient;
