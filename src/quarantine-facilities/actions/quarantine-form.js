import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { toast } from 'react-toastify';

import types from './types';

const getQuarantineFormsRequest = () => ({ type: types.GET_QUARANTINE_FORM_REQUEST });
const getQuarantineFormsSuccess = (response) => ({ type: types.GET_QUARANTINE_FORM_SUCCESS, payload: response });
const getQuarantineFormsFailure = (error) => ({ type: types.GET_QUARANTINE_FORM_FAILURE, payload: error });

const getQuarantineForms = ({
  manager = '',
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getQuarantineFormsRequest());
  httpClient.callApi({
    url: apiLinks.facilities.quarantineForms.get,
    params: {
      manager: manager || undefined,
      pageIndex,
      pageSize,
    },
  }).then((response) => {
    dispatch(getQuarantineFormsSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getQuarantineFormsFailure(error));
    reject();
  });
});

const getQuarantineFormsByFacilityRequest = () => ({ type: types.GET_QUARANTINE_FORM_BY_FACILITY_REQUEST });
const getQuarantineFormsByFacilitySuccess = (response) => ({ type: types.GET_QUARANTINE_FORM_BY_FACILITY_SUCCESS, payload: response });
const getQuarantineFormsByFacilityFailure = (error) => ({ type: types.GET_QUARANTINE_FORM_BY_FACILITY_FAILURE, payload: error });

const getQuarantineFormsByFacility = ({
  pageIndex = 0,
  pageSize = 10,
}) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getQuarantineFormsByFacilityRequest());
  httpClient.callApi({
    url: apiLinks.facilities.quarantineForms.get,
    params: {
      pageIndex,
      pageSize,
    },
  }).then((response) => {
    dispatch(getQuarantineFormsByFacilitySuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getQuarantineFormsByFacilityFailure(error));
    reject();
  });
});

const getQuarantineFormDetailRequest = () => ({ type: types.GET_QUARANTINE_FORM_DETAIL_REQUEST });
const getQuarantineFormDetailSuccess = (response) => ({ type: types.GET_QUARANTINE_FORM_DETAIL_SUCCESS, payload: response });
const getQuarantineFormDetailFailure = (error) => ({ type: types.GET_QUARANTINE_FORM_DETAIL_FAILURE, payload: error });

const getQuarantineFormDetail = (id) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getQuarantineFormDetailRequest());
  httpClient.callApi({
    url: apiLinks.facilities.quarantineForms.getDetail + id,
  }).then((response) => {
    dispatch(getQuarantineFormDetailSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(getQuarantineFormDetailFailure(error));
    reject();
  });
});

const createQuarantineFormRequest = () => ({ type: types.CREATE_QUARANTINE_FORM_REQUEST });
const createQuarantineFormSuccess = (response) => ({ type: types.CREATE_QUARANTINE_FORM_SUCCESS, payload: response });
const createQuarantineFormFailure = (error) => ({ type: types.CREATE_QUARANTINE_FORM_FAILURE, payload: error });

const createQuarantineForm = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(createQuarantineFormRequest());
  httpClient.callApi({
    method: 'POST',
    url: apiLinks.facilities.quarantineForms.create,
    data,
  }).then((response) => {
    toast.success('Thành công');
    dispatch(createQuarantineFormSuccess(response.data));
    resolve();
  }).catch((error) => {
    dispatch(createQuarantineFormFailure(error));
    reject();
  });
});

export {
  getQuarantineForms,
  getQuarantineFormsByFacility,
  getQuarantineFormDetail,
  createQuarantineForm,
};
