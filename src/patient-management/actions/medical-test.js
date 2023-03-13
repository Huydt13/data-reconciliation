import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import { QUICK_TEST_STATUSES } from 'medical-test/utils/constants';
import types from './types';

const setExaminationInputCache = (data) => ({
  type: types.SET_EXAMINATION_INPUT_CACHE,
  payload: data,
});

const selectMedicalTest = (t) => ({
  type: types.SELECT_MEDICAL_TEST,
  payload: t,
});


const getUnitInfoRequest = () => ({ type: types.GET_UNIT_INFO_REQUEST });
const getUnitInfoSuccess = (response) => ({
  type: types.GET_UNIT_INFO_SUCCESS,
  payload: response,
});
const getUnitInfoFailure = (error) => ({
  type: types.GET_UNIT_INFO_FAILURE,
  payload: error,
});

const getUnitInfo = () => (dispatch) => new Promise((resolve, reject) => {
    dispatch(getUnitInfoRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.unit.getInfo,
        // cancelToken: true,
      })
      .then((response) => {
        dispatch(getUnitInfoSuccess(response?.data ?? {}));
        resolve();
      })
      .catch((error) => {
        dispatch(getUnitInfoFailure(error));
        reject();
      });
  });

const getInfectedPatientDetailRequest = () => ({ type: types.GET_INFECTED_PATIENT_DETAIL_REQUEST });
const getInfectedPatientDetailSuccess = (response) => ({
  type: types.GET_INFECTED_PATIENT_DETAIL_SUCCESS,
  payload: response,
});
const getInfectedPatientDetailFailure = (error) => ({
  type: types.GET_INFECTED_PATIENT_DETAIL_FAILURE,
  payload: error,
});

const getInfectedPatientDetail = (id) => (dispatch) => new Promise((resolve, reject) => {
    dispatch(getInfectedPatientDetailRequest());
    httpClient
      .callApi({
        url: `${apiLinks.injectedPatient.getById}/${id}`,
      })
      .then((response) => {
        dispatch(getInfectedPatientDetailSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getInfectedPatientDetailFailure(error));
        reject();
      });
  });

const deleteInfectedPatientRequest = () => ({ type: types.DELETE_INFECTED_PATIENT_REQUEST });
const deleteInfectedPatientSuccess = () => ({ type: types.DELETE_INFECTED_PATIENT_SUCCESS });
const deleteInfectedPatientFailure = () => ({ type: types.DELETE_INFECTED_PATIENT_FAILURE });

const deleteInfectedPatient = (id) => (dispatch) => new Promise((resolve, reject) => {
    dispatch(deleteInfectedPatientRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: `${apiLinks.injectedPatient.delete}/${id}`,
      })
      .then((response) => {
        dispatch(deleteInfectedPatientSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        dispatch(deleteInfectedPatientFailure(error));
        reject();
      });
  });
const getInfectedPatientRequest = () => ({
  type: types.GET_INFECTED_PATIENTS_REQUEST,
});
const getInfectedPatientSuccess = (response) => ({
  type: types.GET_INFECTED_PATIENTS_SUCCESS,
  payload: response,
});
const getInfectedPatientFailure = (error) => ({
  type: types.GET_INFECTED_PATIENTS_FAILURE,
  payload: error,
});
const getInfectedPatients = ({
  FromDate = '',
  ToDate = '',
  FullName = '',
  PhoneNumber = '',
  StreetHouseNumber = '',
  ProvinceValue = '',
  DistrictValue = '',
  WardValue = '',
  StreetHouseNumberDCCL = '',
  ProvinceDCCLValue = '',
  DistrictDCCLValue = '',
  WardDCCLValue = '',
  NameDCCL = '',
  Unit = '',
  SamplingPlace = '',
  ExaminationType = '',
  Result = '',
  DataSource = undefined,
  DateType = undefined,
  PageIndex = undefined,
  PageSize = undefined,
  HasDuplicateId = undefined,
  ChainType = undefined,
  RemoveCDSDuplicateData = undefined,
}) => (dispatch) => new Promise((resolve, reject) => {
      dispatch(getInfectedPatientRequest());
      httpClient
        .callApi({
          method: 'GET',
          url: apiLinks.injectedPatient.get,
          params: {
            FromDate,
            ToDate,
            FullName,
            PhoneNumber,
            StreetHouseNumber,
            ProvinceValue,
            DistrictValue,
            WardValue,
            StreetHouseNumberDCCL,
            ProvinceDCCLValue,
            DistrictDCCLValue,
            WardDCCLValue,
            NameDCCL,
            Unit,
            SamplingPlace,
            ExaminationType,
            Result,
            DataSource,
            DateType,
            PageIndex,
            PageSize,
            HasDuplicateId,
            ChainType,
            RemoveCDSDuplicateData,
          },
        })
        .then((response) => {
          dispatch(getInfectedPatientSuccess(response?.data ?? {}));
          resolve(response?.data ?? {});
        })
        .catch((error) => {
          dispatch(getInfectedPatientFailure(error));
          reject();
        });
    });

const updateQuarantineAddressRequest = () => ({
  type: types.PUT_QUARANTINE_ADDRESS_REQUEST,
});
const updateQuarantineAddressSuccess = (response) => ({
  type: types.PUT_QUARANTINE_ADDRESS_SUCCESS,
  payload: response,
});
const updateQuarantineAddressFailure = (error) => ({
  type: types.PUT_QUARANTINE_ADDRESS_FAILURE,
  payload: error,
});
const updateQuarantineAddress = (data) => (dispatch) => new Promise((resolve, reject) => {
    dispatch(updateQuarantineAddressRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.injectedPatient.updateQuarantineAddress,
        data,
      })
      .then((response) => {
        toast.success('Cập nhật địa chỉ cách ly thành công');
        dispatch(updateQuarantineAddressSuccess(response?.data ?? {}));
        resolve();
      })
      .catch((error) => {
        toast.warn(error?.response?.data ?? '');
        dispatch(updateQuarantineAddressFailure(error));
        reject();
      });
  });


const getQuickTestsByUnitTypeRequest = () => ({
  type: types.GET_QUICK_TESTS_BY_UNIT_TYPE_REQUEST,
});
const getQuickTestsByUnitTypeSuccess = (response) => ({
  type: types.GET_QUICK_TESTS_BY_UNIT_TYPE_SUCCESS,
  payload: response,
});
const getQuickTestsByUnitTypeFailure = (error) => ({
  type: types.GET_QUICK_TESTS_BY_UNIT_TYPE_FAILURE,
  payload: error,
});
const getQuickTestsByUnitType = ({
  from = '',
  to = '',
  personName = '',
  phoneNumber = '',
  houseNumber = '',
  provinceCode = '',
  districtCode = '',
  wardCode = '',
  unitId = '',
  samplingPlaceId = '',
  examinationTypeId = '',
  resultType = '',
  status = QUICK_TEST_STATUSES.DONE,
  pageIndex = undefined,
  pageSize = undefined,
}) => (dispatch) => new Promise((resolve, reject) => {
      dispatch(getQuickTestsByUnitTypeRequest());
      httpClient
        .callApi({
          method: 'GET',
          url: apiLinks.quickTest.getQuickTestsByUnitType,
          params: {
            from,
            to,
            personName,
            phoneNumber,
            houseNumber,
            provinceCode,
            districtCode,
            wardCode,
            unitId,
            samplingPlaceId,
            examinationTypeId,
            resultType,
            status,
            pageIndex,
            pageSize,
          },
        })
        .then((response) => {
          dispatch(getQuickTestsByUnitTypeSuccess(response?.data ?? {}));
          resolve();
        })
        .catch((error) => {
          dispatch(getQuickTestsByUnitTypeFailure(error));
          reject();
        });
    });

const getQuickTestsByManagementUnitRequest = () => ({
  type: types.GET_QUICK_TESTS_BY_MANAGEMENT_UNIT_REQUEST,
});
const getQuickTestsByManagementUnitSuccess = (response) => ({
  type: types.GET_QUICK_TESTS_BY_MANAGEMENT_UNIT_SUCCESS,
  payload: response,
});
const getQuickTestsByManagementUnitFailure = (error) => ({
  type: types.GET_QUICK_TESTS_BY_MANAGEMENT_UNIT_FAILURE,
  payload: error,
});
const getQuickTestsByManagementUnit = ({
  from = '',
  to = '',
  personName = '',
  phoneNumber = '',
  houseNumber = '',
  provinceCode = '',
  districtCode = '',
  wardCode = '',
  unitId = '',
  samplingPlaceId = '',
  examinationTypeId = '',
  resultType = '',
  status = QUICK_TEST_STATUSES.DONE,
  pageIndex = undefined,
  pageSize = undefined,
}) => (dispatch) => new Promise((resolve, reject) => {
      dispatch(getQuickTestsByManagementUnitRequest());
      httpClient
        .callApi({
          method: 'GET',
          url: apiLinks.quickTest.getQuickTestsByManagementUnit,
          params: {
            from,
            to,
            personName,
            phoneNumber,
            houseNumber,
            provinceCode,
            districtCode,
            wardCode,
            unitId,
            samplingPlaceId,
            examinationTypeId,
            resultType,
            status,
            pageIndex,
            pageSize,
          },
        })
        .then((response) => {
          dispatch(getQuickTestsByManagementUnitSuccess(response?.data ?? {}));
          resolve();
        })
        .catch((error) => {
          dispatch(getQuickTestsByManagementUnitFailure(error));
          reject();
        });
    });

const getQuickTestsWithoutDispatch = ({
  from = '',
  to = '',
  personName = '',
  phoneNumber = '',
  houseNumber = '',
  provinceCode = '',
  districtCode = '',
  wardCode = '',
  unitId = '',
  samplingPlaceId = '',
  examinationTypeId = '',
  resultType = '',
  status = QUICK_TEST_STATUSES.DONE,
  pageIndex = undefined,
  pageSize = undefined,
}) => new Promise((resolve, reject) => {
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.quickTest.get(),
        params: {
          from,
          to,
          personName,
          phoneNumber,
          houseNumber,
          provinceCode,
          districtCode,
          wardCode,
          unitId,
          samplingPlaceId,
          examinationTypeId,
          resultType,
          status,
          pageIndex,
          pageSize,
        },
      })
      .then((response) => {
        resolve(response?.data ?? {});
      })
      .catch((error) => {
        reject(error);
      });
  });

export {
  setExaminationInputCache,
  getUnitInfo,
  selectMedicalTest,
  getInfectedPatients,
  getInfectedPatientDetail,
  getQuickTestsByUnitType,
  getQuickTestsByManagementUnit,
  getQuickTestsWithoutDispatch,
  deleteInfectedPatient,
  updateQuarantineAddress,
};
