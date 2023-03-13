import apiLinks from "app/utils/api-links";
import httpClient from "app/utils/http-client";
import { reject } from "lodash";
import { toast } from "react-toastify";
import types from "./types";

//lấy tất cả danh sách
const getProfilesRequest = () => ({ type: types.GET_PROFILES_REQUEST });
const getProfilesSuccess = (res) => ({
  type: types.GET_PROFILES_SUCCESS,
  payload: res,
});
const getProfilesFailure = (err) => ({
  type: types.GET_PROFILES_FAILURE,
  payload: err,
});

const getProfiles =
  ({
    name = "",
    cccd = "",
    cmnd = "",
    phoneNumber = "",
    passportNumber = "",
    healthInsurranceNumber = "",
    provinceValue = "",
    districtValue = "",
    wardValue = "",
    pageSize = undefined,
    pageIndex = undefined,
    reason = "",
    reasonType = "",
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
        .then((res) => {
          dispatch(getProfilesSuccess(res.data));
          resolve();
        })
        .catch((err) => {
          dispatch(getProfilesFailure(err));
          reject();
        });
    });

// lấy id
const getProfileRequest = () => ({ type: types.GET_PROFILE_REQUEST });
const getProfileSuccess = (res) => ({
  type: types.GET_PROFILE_SUCCESS,
  payload: res,
});
const getProfileFailure = (err) => ({
  type: types.GET_PROFILE_FAILURE,
  payload: err,
});

const getProfile = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getProfileRequest());
    httpClient
      .callApi({
        url: `${apiLinks.profile.get}/${id}`,
      })
      .then((res) => {
        dispatch(getProfileSuccess(res.data));
        resolve(res.data);
      })
      .catch((err) => {
        dispatch(getProfileFailure(err));
        reject();
      });
  });

const createProfileRequest = () => ({ type: types.CREATE_PROFILE_REQUEST });
const createProfileSuccess = (res) => ({
  type: types.CREATE_PROFILE_SUCCESS,
  payload: res,
});
const createProfileFailure = (err) => ({
  type: types.CREATE_PROFILE_FAILURE,
  payload: err,
});
const createProfile =
  (data, notify = true) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      const url = window.location.href;
      const mqExchangeName =
        url.indexOf("abc") > -1 || process.env.NODE_ENV === "development"
          ? "NewProfileQueue1"
          : "NewProfileQueue";
      dispatch(createProfileRequest());
      httpClient
        .callApi({
          method: "POST",
          data,
          url: apiLinks.profiles.create,
          params: { mqExchangeName },
        })
        .then((res) => {
          dispatch(createProfileSuccess(res.data));
          if (notify) {
            toast.success("oke");
          }
          resolve(res.data);
        })
        .catch((err) => {
          dispatch(createProfileFailure(err));
          reject();
        });
    });
export { getProfiles, getProfile, createProfile };
