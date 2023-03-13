import { toast } from 'react-toastify';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import types from './types';

const getProfileRequest = () => ({ type: types.GET_PROFILE_REQUEST });
const getProfileSuccess = (response) => ({
  type: types.GET_PROFILE_SUCCESS,
  payload: response,
});
const getProfileFailure = (error) => ({
  type: types.GET_PROFILE_FAILURE,
  payload: error,
});

const getProfile = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getProfileRequest());
    httpClient
      .callApi({
        url: `${apiLinks.profiles.get}/${id}`,
      })
      .then((response) => {
        dispatch(getProfileSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getProfileFailure(error));
        reject();
      });
  });

const getProfileWithouDispatch = (id) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        url: `${apiLinks.profiles.get}/${id}`,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

const getProfilesRequest = () => ({ type: types.GET_PROFILES_REQUEST });
const getProfilesSuccess = (response) => ({
  type: types.GET_PROFILES_SUCCESS,
  payload: response,
});
const getProfilesFailure = (error) => ({
  type: types.GET_PROFILES_FAILURE,
  payload: error,
});

const getProfiles =
  ({
    name = '',
    cccd = '',
    cmnd = '',
    phoneNumber = '',
    passportNumber = '',
    healthInsurranceNumber = '',
    provinceValue = '',
    districtValue = '',
    wardValue = '',
    pageSize = undefined,
    pageIndex = undefined,
    reason = '',
    reasonType = '',
    realtedPositiveProfileId = 0,
    hasOnUsingProfiles = undefined,
    hasGroupProfiles = undefined,
    hasInfectionChainHistories = undefined,
    hasExaminationHistories = undefined,
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getProfilesRequest());
        httpClient
          .callApi({
            url: apiLinks.profiles.get,
            params: {
              name,
              cccd,
              cmnd,
              phoneNumber,
              passportNumber,
              healthInsurranceNumber,
              provinceValue,
              districtValue,
              wardValue,
              pageSize,
              pageIndex,
              reason,
              reasonType,
              realtedPositiveProfileId: realtedPositiveProfileId || undefined,
              hasOnUsingProfiles,
              hasGroupProfiles,
              hasInfectionChainHistories,
              hasExaminationHistories,
            },
            cancelToken: true,
          })
          .then((response) => {
            dispatch(getProfilesSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getProfilesFailure(error));
            reject();
          });
      });

const getProfilesWithouDispatch = ({
  name = '',
  cccd = '',
  cmnd = '',
  phoneNumber = '',
  passportNumber = '',
  healthInsurranceNumber = '',
  provinceValue = '',
  districtValue = '',
  wardValue = '',
  pageSize = 10,
  pageIndex = 0,
  reason = '',
  reasonType = '',
  realtedPositiveProfileId = 0,
  hasGroupProfiles = false,
  isSensitiveCase = false,
}) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        url: apiLinks.profiles.get,
        params: {
          name,
          cccd,
          cmnd,
          phoneNumber,
          passportNumber,
          healthInsurranceNumber,
          provinceValue,
          districtValue,
          wardValue,
          pageSize,
          pageIndex,
          reason,
          reasonType,
          realtedPositiveProfileId: realtedPositiveProfileId || undefined,
          hasGroupProfiles,
          isSensitiveCase,
        },
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });

const getDuplicateProfilesWithouDispatch = ({
  name = '',
  phoneNumber = '',
}) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        url: apiLinks.profiles.getDuplicateProfile,
        params: {
          name,
          phoneNumber,
        },
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });

const createProfileRequest = () => ({ type: types.CREATE_PROFILE_REQUEST });
const createProfileSuccess = (response) => ({
  type: types.CREATE_PROFILE_SUCCESS,
  payload: response,
});
const createProfileFailure = (error) => ({
  type: types.CREATE_PROFILE_FAILURE,
  payload: error,
});

const createProfile = (data, notify = true) => (dispatch) =>
  new Promise((resolve, reject) => {
    const url = window.location.href;
    const mqExchangeName =
      url.indexOf('abcde') > -1 || process.env.NODE_ENV === 'development'
        ? 'NewProfileQueue1'
        : 'NewProfileQueue';
    dispatch(createProfileRequest());
    httpClient
      .callApi({
        method: 'POST',
        data,
        url: apiLinks.profiles.create,
        params: { mqExchangeName },
      })
      .then((response) => {
        dispatch(createProfileSuccess(response.data));
        if (notify) {
          toast.success('Thành công');
        }
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(createProfileFailure(error));
        reject();
      });
  });

const updateProfileRequest = () => ({ type: types.UPDATE_PROFILE_REQUEST });
const updateProfileSuccess = (response) => ({
  type: types.UPDATE_PROFILE_SUCCESS,
  payload: response,
});
const updateProfileFailure = (error) => ({
  type: types.UPDATE_PROFILE_FAILURE,
  payload: error,
});

const updateProfile = (data, notify = true) => (dispatch) =>
  new Promise((resolve, reject) => {
    const url = window.location.href;
    const mqExchangeName =
      url.indexOf('abcde') > -1 || process.env.NODE_ENV === 'development'
        ? 'UpdateProfile1'
        : 'UpdateProfile';
    dispatch(updateProfileRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: `${apiLinks.profiles.update}/${data.id}`,
        data,
        params: { mqExchangeName },
      })
      .then((response) => {
        dispatch(updateProfileSuccess(response));
        if (notify) {
          toast.success('Thành công');
        }
        resolve();
      })
      .catch((error) => {
        dispatch(updateProfileFailure(error));
        reject(error.response.data);
      });
  });

const deleteProfileRequest = () => ({ type: types.DELETE_PROFILE_REQUEST });
const deleteProfileSuccess = () => ({ type: types.DELETE_PROFILE_SUCCESS });
const deleteProfileFailure = () => ({ type: types.DELETE_PROFILE_FAILURE });

const deleteProfile = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteProfileRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: `${apiLinks.profiles.delete}/${id}`,
      })
      .then((response) => {
        dispatch(deleteProfileSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        dispatch(deleteProfileFailure(error));
        reject();
      });
  });

const verifyProfileRequest = () => ({ type: types.VERIFY_PROFILE_REQUEST });
const verifyProfileSuccess = () => ({ type: types.VERIFY_PROFILE_SUCCESS });
const verifyProfileFailure = () => ({ type: types.VERIFY_PROFILE_FAILURE });

const verifyProfile = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(verifyProfileRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: `${apiLinks.profiles.verify}/${id}/Verify`,
      })
      .then((response) => {
        dispatch(verifyProfileSuccess(response));
        toast.success('Thành công');
        resolve();
      })
      .catch((error) => {
        dispatch(verifyProfileFailure(error));
        reject();
      });
  });

const getRelatedRequest = () => ({ type: types.GET_RELATED_REQUEST });
const getRelatedSuccess = (response) => ({
  type: types.GET_RELATED_SUCCESS,
  payload: response,
});
const getRelatedFailure = (error) => ({
  type: types.GET_RELATED_FAILURE,
  payload: error,
});

const getRelated =
  ({
    fullName = '',
    dateOfBirth = '',
    hasYearOfBirthOnly = '',
    key = '',
    keyType = '',
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getRelatedRequest());
        httpClient
          .callApi({
            url: apiLinks.profiles.getRelated,
            params: {
              fullName,
              dateOfBirth,
              hasYearOfBirthOnly,
              key,
              keyType,
            },
          })
          .then((response) => {
            dispatch(getRelatedSuccess(response.data));
            resolve();
          })
          .catch((error) => {
            dispatch(getRelatedFailure(error));
            reject();
          });
      });

const getChildProfileRequest = () => ({
  type: types.GET_CHILD_PROFILE_REQUEST,
});
const getChildProfileSuccess = (response) => ({
  type: types.GET_CHILD_PROFILE_SUCCESS,
  payload: response,
});
const getChildProfileFailure = (error) => ({
  type: types.GET_CHILD_PROFILE_FAILURE,
  payload: error,
});

const getChildProfile = (profileId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getChildProfileRequest());
    httpClient
      .callApi({
        url: `${apiLinks.profiles.getChildProfile + profileId}/Items`,
      })
      .then((response) => {
        dispatch(getChildProfileSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getChildProfileFailure(error));
        reject();
      });
  });

const resetRelated = () => ({ type: types.RESET_RELATED });

const mergeDuplicateProfileRequest = () => ({
  type: types.GET_DUPLICATE_PROFILE_REQUEST,
});
const mergeDuplicateProfileSuccess = (response) => ({
  type: types.GET_DUPLICATE_PROFILE_SUCCESS,
  payload: response,
});
const mergeDuplicateProfileFailure = (error) => ({
  type: types.GET_DUPLICATE_PROFILE_FAILURE,
  payload: error,
});
const mergeDuplicateProfile = (profileIdList) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(mergeDuplicateProfileRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.profiles.mergeDuplicateProfile,
        data: profileIdList,
      })
      .then((response) => {
        dispatch(mergeDuplicateProfileSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(mergeDuplicateProfileFailure(error));
        reject();
      });
  });

const createImmunizationForProfileRequest = () => ({
  type: types.CREATE_IMMUNIZATION_FOR_PROFILE_REQUEST,
});
const createImmunizationForProfileSuccess = (response) => ({
  type: types.CREATE_IMMUNIZATION_FOR_PROFILE_SUCCESS,
  payload: response,
});
const createImmunizationForProfileFailure = (error) => ({
  type: types.CREATE_IMMUNIZATION_FOR_PROFILE_FAILURE,
  payload: error,
});

const createImmunizationForProfile = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createImmunizationForProfileRequest());
    httpClient
      .callApi({
        method: 'POST',
        data,
        url: apiLinks.immunization.create,
      })
      .then((response) => {
        dispatch(createImmunizationForProfileSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(createImmunizationForProfileFailure(error));
        reject(error);
      });
  });

const updateImmunizationForProfileRequest = () => ({
  type: types.UPDATE_IMMUNIZATION_FOR_PROFILE_REQUEST,
});
const updateImmunizationForProfileSuccess = (response) => ({
  type: types.UPDATE_IMMUNIZATION_FOR_PROFILE_SUCCESS,
  payload: response,
});
const updateImmunizationForProfileFailure = (error) => ({
  type: types.UPDATE_IMMUNIZATION_FOR_PROFILE_FAILURE,
  payload: error,
});

const updateImmunizationForProfile = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateImmunizationForProfileRequest());
    httpClient
      .callApi({
        method: 'PUT',
        data,
        url: `${apiLinks.immunization.update}/${data?.id}`,
      })
      .then((response) => {
        dispatch(updateImmunizationForProfileSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(updateImmunizationForProfileFailure(error));
        reject(error);
      });
  });

const getUnderlyingDiseasesRequest = () => ({
  type: types.GET_UNDERLYING_DISEASES_REQUEST,
});
const getUnderlyingDiseasesSuccess = (response) => ({
  type: types.GET_UNDERLYING_DISEASES_SUCCESS,
  payload: response,
});
const getUnderlyingDiseasesFailure = (error) => ({
  type: types.GET_UNDERLYING_DISEASES_FAILURE,
  payload: error,
});

const getUnderlyingDiseases = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getUnderlyingDiseasesRequest());
    httpClient
      .callApi({
        url: `${apiLinks.getDiseases}`,
      })
      .then((response) => {
        dispatch(getUnderlyingDiseasesSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getUnderlyingDiseasesFailure(error));
        reject(error);
      });
  });

const getSymptomsRequest = () => ({
  type: types.GET_SYMPTOMS_REQUEST,
});
const getSymptomsSuccess = (response) => ({
  type: types.GET_SYMPTOMS_SUCCESS,
  payload: response,
});
const getSymptomsFailure = (error) => ({
  type: types.GET_SYMPTOMS_FAILURE,
  payload: error,
});

const getSymptoms = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getSymptomsRequest());
    httpClient
      .callApi({
        url: `${apiLinks.getSymptoms}`,
      })
      .then((response) => {
        dispatch(getSymptomsSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getSymptomsFailure(error));
        reject(error);
      });
  });

const getProfileByQRWithouDispatch = (qrCode) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        url: apiLinks.profiles.getProfileByQRCode,
        params: {
          qrCode,
        },
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });

const createProfileWithImmunizationRequest = () => ({
  type: types.CREATE_PROFILE_WITH_IMMUNIZATION_REQUEST,
});
const createProfileWithImmunizationSuccess = (response) => ({
  type: types.CREATE_PROFILE_WITH_IMMUNIZATION_SUCCESS,
  payload: response,
});
const createProfileWithImmunizationFailure = (error) => ({
  type: types.CREATE_PROFILE_WITH_IMMUNIZATION_FAILURE,
  payload: error,
});

const createProfileWithImmunization = (data) => (dispatch) => {
  const url = window.location.href;
  const mqExchangeName =
    url.indexOf('abcde') > -1 || process.env.NODE_ENV === 'development'
      ? 'NewProfileQueue1'
      : 'NewProfileQueue';
  return new Promise((resolve, reject) => {
    dispatch(createProfileWithImmunizationRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.profiles.create,
        params: { mqExchangeName },
        data,
      })
      .then((response) => {
        if (response?.data) {
          const { profileId } = response.data;
          if (data?.immunizations && data.immunizations.length > 0) {
            const immunization = data.immunizations[0];
            if (immunization?.guid) {
              httpClient
                .callApi({
                  method: 'POST',
                  url: apiLinks.immunization.create,
                  data: {
                    ...immunization,
                    profileId,
                    id: immunization.guid,
                    disease: 'Covid-19',
                  },
                })
                .then(() => {
                  toast.success('Thành công');
                  dispatch(createProfileWithImmunizationSuccess(profileId));
                  resolve(profileId);
                })
                .catch((error) => {
                  dispatch(createProfileWithImmunizationFailure(error));
                  reject(error);
                });
            } else {
              httpClient
                .callApi({
                  method: 'POST',
                  url: apiLinks.immunization.create,
                  data: {
                    ...immunization,
                    profileId,
                    disease: 'Covid-19',
                  },
                })
                .then(() => {
                  toast.success('Thành công');
                  dispatch(createProfileWithImmunizationSuccess(profileId));
                  resolve(profileId);
                })
                .catch((error) => {
                  dispatch(createProfileWithImmunizationFailure(error));
                  reject(error);
                });
            }
          }
        }
      })
      .catch((error) => {
        dispatch(createProfileWithImmunizationFailure(error));
        reject(error);
      });
  });
};

const updateProfileWithImmunizationRequest = () => ({
  type: types.UPDATE_PROFILE_WITH_IMMUNIZATION_REQUEST,
});
const updateProfileWithImmunizationSuccess = (response) => ({
  type: types.UPDATE_PROFILE_WITH_IMMUNIZATION_SUCCESS,
  payload: response,
});
const updateProfileWithImmunizationFailure = (error) => ({
  type: types.UPDATE_PROFILE_WITH_IMMUNIZATION_FAILURE,
  payload: error,
});

const updateProfileWithImmunization = (data) => (dispatch) => {
  const url = window.location.href;
  const mqExchangeName =
    url.indexOf('abcde') > -1 || process.env.NODE_ENV === 'development'
      ? 'UpdateProfile1'
      : 'UpdateProfile';
  return new Promise((resolve, reject) => {
    dispatch(updateProfileWithImmunizationRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: `${apiLinks.profiles.update}/${data.id}`,
        params: { mqExchangeName },
        data,
      })
      .then((response) => {
        if (response?.data) {
          const profileId = response.data;
          if (data?.immunizations && data.immunizations.length > 0) {
            const immunization = data.immunizations[0];
            if (immunization?.guid) {
              httpClient
                .callApi({
                  method: 'POST',
                  url: apiLinks.immunization.create,
                  data: {
                    ...immunization,
                    profileId,
                    id: immunization.guid,
                    disease: 'Covid-19',
                  },
                })
                .then(() => {
                  toast.success('Thành công');
                  dispatch(updateProfileWithImmunizationSuccess(profileId));
                  resolve(profileId);
                })
                .catch((error) => {
                  toast.warn(error?.response?.data ?? 'Lỗi');
                  dispatch(updateProfileWithImmunizationFailure(error));
                  reject(error);
                });
            } else {
              httpClient
                .callApi({
                  method: 'POST',
                  url: apiLinks.immunization.create,
                  data: {
                    ...immunization,
                    profileId,
                    disease: 'Covid-19',
                  },
                })
                .then(() => {
                  toast.success('Thành công');
                  dispatch(updateProfileWithImmunizationSuccess(profileId));
                  resolve(profileId);
                })
                .catch((error) => {
                  toast.warn(error?.response?.data ?? 'Lỗi');
                  dispatch(updateProfileWithImmunizationFailure(error));
                  reject(error);
                });
            }
          }
        }
      })
      .catch((error) => {
        toast.warn(error?.response?.data ?? 'Lỗi');
        dispatch(updateProfileWithImmunizationFailure(error));
        reject(error);
      });
  });
};

const getInfectiousDiseaseHistoriesRequest = () => ({
  type: types.GET_INFECTIOUS_DISEASE_HISTORIES_REQUEST,
});
const getInfectiousDiseaseHistoriesSuccess = (response) => ({
  type: types.GET_INFECTIOUS_DISEASE_HISTORIES_SUCCESS,
  payload: response,
});
const getInfectiousDiseaseHistoriesFailure = (error) => ({
  type: types.GET_INFECTIOUS_DISEASE_HISTORIES_FAILURE,
  payload: error,
});

const getInfectiousDiseaseHistories = ({
  ProfileId = undefined,
  Name = '',
  PhoneNumber = undefined,
  Cccd = undefined,
  Cmnd = undefined,
  PassportNumber = undefined,
  ProvinceValue = undefined,
  DistrictValue = undefined,
  WardValue = undefined,
  IsPositive = undefined,
  NumberOfPositiveTimes = undefined,
  Disease = undefined,
  FromDate = undefined,
  ToDate = undefined,
  FromAge = undefined,
  ToAge = undefined,
  UnderlyingDiseases = undefined,
  Symtoms = undefined,
  HasSymtoms = undefined,
  HealthInsurranceNumber = undefined,
  HasUnderlyingDiseases = undefined,
  PageIndex = undefined,
  PageSize = undefined,
}) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getInfectiousDiseaseHistoriesRequest());
      httpClient
        .callApi({
          url: `${apiLinks.infectiousDiseaseHistories.get}`,
          params: {
            ProfileId,
            Name,
            PhoneNumber,
            Cccd,
            Cmnd,
            PassportNumber,
            ProvinceValue,
            DistrictValue,
            WardValue,
            IsPositive,
            NumberOfPositiveTimes,
            Disease,
            FromDate,
            ToDate,
            UnderlyingDiseases,
            Symtoms,
            HasSymtoms,
            HasUnderlyingDiseases,
            HealthInsurranceNumber,
            FromAge,
            ToAge,
            PageIndex,
            PageSize,
          },
        })
        .then((response) => {
          dispatch(getInfectiousDiseaseHistoriesSuccess(response.data));
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(getInfectiousDiseaseHistoriesFailure(error));
          reject(error);
        });
    });

const getInfectiousDiseaseHistoriesByProfileRequest = () => ({
  type: types.GET_INFECTIOUS_DISEASE_HISTORIES_BY_PROFILE_REQUEST,
});
const getInfectiousDiseaseHistoriesByProfileSuccess = (response) => ({
  type: types.GET_INFECTIOUS_DISEASE_HISTORIES_BY_PROFILE_SUCCESS,
  payload: response,
});
const getInfectiousDiseaseHistoriesByProfileFailure = (error) => ({
  type: types.GET_INFECTIOUS_DISEASE_HISTORIES_BY_PROFILE_FAILURE,
  payload: error,
});

const getInfectiousDiseaseHistoriesByProfile = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getInfectiousDiseaseHistoriesByProfileRequest());
    httpClient
      .callApi({
        url: `${apiLinks.infectiousDiseaseHistories.getLog}`,
        params: params,
      })
      .then((response) => {
        dispatch(getInfectiousDiseaseHistoriesByProfileSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getInfectiousDiseaseHistoriesByProfileFailure(error));
        reject(error);
      });
  });

const checkPositiveRequest = () => ({
  type: types.CHECK_POSITIVE_REQUEST,
});
const checkPositiveSuccess = (response) => ({
  type: types.CHECK_POSITIVE_SUCCESS,
  payload: response,
});
const checkPositiveFailure = (error) => ({
  type: types.CHECK_POSITIVE_FAILURE,
  payload: error,
});

const checkPositive = (profileId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(checkPositiveRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: `${apiLinks.infectiousDiseaseHistories.checkPositive}`,
        params: {
          profileId,
        },
      })
      .then((response) => {
        toast.success('Thành công');
        dispatch(checkPositiveSuccess(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        toast.warn(error.response?.data ?? 'Lỗi');
        dispatch(checkPositiveFailure(error));
        reject(error);
      });
  });

const dongBoXetNghiemProfile = (idProfile) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteProfileRequest());
    httpClient
      .callApi({
        method: "POST",
        params: {
          profileId: idProfile,
        },
        url: `${apiLinks.infectiousDiseases.GetPHRAndCheckPositive}`,
      })
      .then((response) => {
        dispatch(deleteProfileSuccess(response));
        toast.success("Thành công");
        resolve();
      })
      .catch((error) => {
        dispatch(deleteProfileFailure(error));
        reject();
      });
  });

const getInfectiousDiseasesRequest = () => ({
  type: types.GET_INFECTIOUS_DISEASES_REQUEST,
});
const getInfectiousDiseasesSuccess = (response) => ({
  type: types.GET_INFECTIOUS_DISEASES_SUCCESS,
  payload: response,
});
const getInfectiousDiseasesFailure = (error) => ({
  type: types.GET_INFECTIOUS_DISEASES_FAILURE,
  payload: error,
});

const getInfectiousDiseases =
  ({
    ProfileId = undefined,
    IsPositive = undefined,
    NumberOfPositiveTimes = undefined,
    Cccd = undefined,
    Cmnd = undefined,
    PassportNumber = undefined,
    Disease = undefined,
    FromDate = undefined,
    ToDate = undefined,
    FromAge = undefined,
    ToAge = undefined,
    ImmunizationStatus = undefined,
    Symtoms = undefined,
    UnderlyingDiseases = undefined,
    HasUnderlyingDiseases = undefined,
    HasSymtoms = undefined,
    ProvinceValue = undefined,
    DistrictValue = undefined,
    WardValue = undefined,
    PageIndex = 0,
    PageSize = 10,
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getInfectiousDiseasesRequest());
        httpClient
          .callApi({
            url: `${apiLinks.infectiousDiseases.get}`,
            params: {
              ProfileId,
              IsPositive,
              Cccd,
              Cmnd,
              PassportNumber,
              NumberOfPositiveTimes,
              Symtoms,
              HasSymtoms,
              UnderlyingDiseases,
              HasUnderlyingDiseases,
              Disease,
              FromDate,
              ToDate,
              FromAge,
              ToAge,
              ProvinceValue,
              DistrictValue,
              WardValue,
              PageIndex,
              PageSize,
              ImmunizationStatus,
            },
          })
          .then((response) => {
            dispatch(getInfectiousDiseasesSuccess(response.data));
            resolve(response.data);
          })
          .catch((error) => {
            dispatch(getInfectiousDiseasesFailure(error));
            reject(error);
          });
      });


export {
  getProfile,
  getProfileWithouDispatch,
  getProfileByQRWithouDispatch,
  getProfiles,
  getProfilesWithouDispatch,
  getDuplicateProfilesWithouDispatch,
  createProfile,
  updateProfile,
  deleteProfile,
  verifyProfile,
  getRelated,
  resetRelated,
  getChildProfile,
  mergeDuplicateProfile,
  createImmunizationForProfile,
  updateImmunizationForProfile,
  getUnderlyingDiseases,
  getSymptoms,
  createProfileWithImmunization,
  updateProfileWithImmunization,
  getInfectiousDiseaseHistories,
  getInfectiousDiseaseHistoriesByProfile,
  checkPositive,
  dongBoXetNghiemProfile,
  getInfectiousDiseases,
};
