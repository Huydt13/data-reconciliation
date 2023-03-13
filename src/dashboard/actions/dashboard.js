import apiLinks from 'app/utils/api-links';
import httpClient from 'app/utils/http-client';
import moment from 'moment';
import types, {
  GET_SUBJECT_TYPE_NUMBER_REQUEST,
  GET_SUBJECT_TYPE_NUMBER_SUCCESS,
  GET_SUBJECT_TYPE_NUMBER_FAILURE,
  GET_SUBJECT_TYPES_NUMBER_REQUEST,
  GET_SUBJECT_TYPES_NUMBER_SUCCESS,
  GET_SUBJECT_TYPES_NUMBER_FAILURE,
  SELECT_SUBJECT_SUMMARIES_LIST,
  SELECT_SUBJECT_TYPE,
  SELECT_SUBJECT_LOCATION,
  SELECT_LOCATION_TYPE,
  GET_SUBJECT_SUMMARY_BY_RANGE_REQUEST,
  GET_SUBJECT_SUMMARY_BY_RANGE_SUCCESS,
  GET_SUBJECT_SUMMARY_BY_RANGE_FAILURE,
  GET_EXAMINATION_SUMMARY_REQUEST,
  GET_EXAMINATION_SUMMARY_SUCCESS,
  GET_EXAMINATION_SUMMARY_FAILURE,
  GET_EXAMINATION_SUMMARY_BY_RANGE_REQUEST,
  GET_EXAMINATION_SUMMARY_BY_RANGE_SUCCESS,
  GET_EXAMINATION_SUMMARY_BY_RANGE_FAILURE,
} from './types';

const selectSubjectType = (type) => ({
  type: SELECT_SUBJECT_TYPE,
  payload: type,
});
const selectLocationType = (type) => ({
  type: SELECT_LOCATION_TYPE,
  payload: type,
});
const selectSubjectLocation = (type) => ({
  type: SELECT_SUBJECT_LOCATION,
  payload: type,
});

const getSubjectTypesNumberRequest = () => ({
  type: GET_SUBJECT_TYPES_NUMBER_REQUEST,
});
const getSubjectTypesNumberSuccess = (response) => ({
  type: GET_SUBJECT_TYPES_NUMBER_SUCCESS,
  payload: response,
});
const getSubjectTypesNumberFailure = (error) => ({
  type: GET_SUBJECT_TYPES_NUMBER_FAILURE,
  payload: error,
});

const getSubjectTypesNumber = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getSubjectTypesNumberRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.getSubjectTypesNumber,
      })
      .then((response) => {
        dispatch(getSubjectTypesNumberSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getSubjectTypesNumberFailure(error));
        reject();
      });
  });

const getSubjectTypeNumberRequest = () => ({
  type: GET_SUBJECT_TYPE_NUMBER_REQUEST,
});
const getSubjectTypeNumberSuccess = (response, type) => ({
  type: GET_SUBJECT_TYPE_NUMBER_SUCCESS,
  payload: { response, type },
});
const getSubjectTypeNumberFailure = (error) => ({
  type: GET_SUBJECT_TYPE_NUMBER_FAILURE,
  payload: error,
});

const getSubjectTypeNumber = (from, to, type) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getSubjectTypeNumberRequest());
    httpClient
      .callApi({
        method: 'GET',
        url: apiLinks.getSubjectTypeNumber,
        params: {
          from,
          to,
          type,
        },
      })
      .then((response) => {
        dispatch(getSubjectTypeNumberSuccess(response.data, type));
        resolve();
      })
      .catch((error) => {
        dispatch(getSubjectTypeNumberFailure(error));
        reject();
      });
  });

const getChainsSummariesRequest = (isRange) => ({
  type: types.GET_CHAINS_SUMMARIES_REQUEST,
  payload: { isRange },
});
const getChainsSummariesSuccess = (response, isRange) => ({
  type: types.GET_CHAINS_SUMMARIES_SUCCESS,
  payload: { response, isRange },
});
const getChainsSummariesFailure = (error, isRange) => ({
  type: types.GET_CHAINS_SUMMARIES_FAILURE,
  payload: { error, isRange },
});

const getChainsSummaries =
  ({ fromDate = undefined, toDate = undefined }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      const isRange = Boolean(toDate);
      dispatch(getChainsSummariesRequest(isRange));
      httpClient
        .callApi({
          url: apiLinks.general.infectionTypes.getSummaries,
          params: {
            fromDate,
            toDate,
          },
        })
        .then((response) => {
          dispatch(getChainsSummariesSuccess(response.data, isRange));
          resolve();
        })
        .catch((error) => {
          dispatch(getChainsSummariesFailure(error, isRange));
          reject();
        });
    });

const getSubjectSummariesByRangeRequest = () => ({
  type: GET_SUBJECT_SUMMARY_BY_RANGE_REQUEST,
});
const getSubjectSummariesByRangeSuccess = (response) => ({
  type: GET_SUBJECT_SUMMARY_BY_RANGE_SUCCESS,
  payload: response,
});
const getSubjectSummariesByRangeFailure = (error) => ({
  type: GET_SUBJECT_SUMMARY_BY_RANGE_FAILURE,
  payload: error,
});

const getSubjectSummariesByRange =
  ({
    datefrom = moment().format('YYYY-MM-DD'),
    dateTo = moment().format('YYYY-MM-DD'),
  }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getSubjectSummariesByRangeRequest());
      httpClient
        .callApi({
          method: 'GET',
          url: `${apiLinks.subjectSummaries}/Range`,
          params: {
            datefrom,
            dateTo,
          },
        })
        .then((response) => {
          dispatch(getSubjectSummariesByRangeSuccess(response.data));
          resolve();
        })
        .catch((error) => {
          dispatch(getSubjectSummariesByRangeFailure(error));
          reject();
        });
    });

const getExaminationSummaryRequest = () => ({
  type: GET_EXAMINATION_SUMMARY_REQUEST,
});
const getExaminationSummarySuccess = (response) => ({
  type: GET_EXAMINATION_SUMMARY_SUCCESS,
  payload: response,
});
const getExaminationSummaryFailure = (error) => ({
  type: GET_EXAMINATION_SUMMARY_FAILURE,
  payload: error,
});

const getExaminationSummary = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getExaminationSummaryRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationSummary.get,
      })
      .then((response) => {
        dispatch(getExaminationSummarySuccess(response.data.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getExaminationSummaryFailure(error));
        reject();
      });
  });

const getExaminationSummaryByRangeRequest = () => ({
  type: GET_EXAMINATION_SUMMARY_BY_RANGE_REQUEST,
});
const getExaminationSummaryByRangeSuccess = (response) => ({
  type: GET_EXAMINATION_SUMMARY_BY_RANGE_SUCCESS,
  payload: response,
});
const getExaminationSummaryByRangeFailure = (error) => ({
  type: GET_EXAMINATION_SUMMARY_BY_RANGE_FAILURE,
  payload: error,
});

const getExaminationSummaryByRange = (from, to) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getExaminationSummaryByRangeRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationSummary.getByTime,
        params: { from, to },
      })
      .then((response) => {
        dispatch(getExaminationSummaryByRangeSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getExaminationSummaryByRangeFailure(error));
        reject();
      });
  });

const selectSubjectSummariesList = (data) => ({
  type: SELECT_SUBJECT_SUMMARIES_LIST,
  payload: data,
});

// const getTakenExamCountRequest = () => ({ type: types.EXAMINATION_GET_TAKEN_EXAMINATION_COUNT_BY_DATE_REQUEST });
// const getTakenExamCountSuccess = () => ({ type: types.EXAMINATION_GET_TAKEN_EXAMINATION_COUNT_BY_DATE_SUCCESS });
// const getTakenExamCountFailure = () => ({ type: types.EXAMINATION_GET_TAKEN_EXAMINATION_COUNT_BY_DATE_FAILURE });
// const getTakenExamCount3 = (from, to) => (dispatch) => new Promise((resolve, reject) => {
//   dispatch(getTakenExamCountRequest());
//   httpClient
//     .callApi({
//       url: apiLinks.examinationSummary.getTakenExaminationCountByDates3,
//       params: { from, to },
//     })
//     .then((response) => {
//       dispatch(getTakenExamCountSuccess(response.data));
//       resolve();
//     })
//     .catch((error) => {
//       dispatch(getTakenExamCountFailure(error));
//       reject();
//     });
// });
// const getResultExamCountRequest = () => ({ type: types.EXAMINATION_GET_RESULT_EXAMINATION_COUNT_REQUEST });
// const getResultExamCountSuccess = () => ({ type: types.EXAMINATION_GET_RESULT_EXAMINATION_COUNT_SUCCESS });
// const getResultExamCountFailure = () => ({ type: types.EXAMINATION_GET_RESULT_EXAMINATION_COUNT_FAILURE });
// const getResultExamCount4 = (from, to) => (dispatch) => new Promise((resolve, reject) => {
//   dispatch(getResultExamCountRequest());
//   httpClient
//     .callApi({
//       url: apiLinks.examinationSummary.getResultedExaminationCount4,
//       params: { from, to },
//     })
//     .then((response) => {
//       dispatch(getResultExamCountSuccess(response.data));
//       resolve();
//     })
//     .catch((error) => {
//       dispatch(getResultExamCountFailure(error));
//       reject();
//     });
// });
// const getAssignedCountRequest = () => ({ type: types.EXAMINATION_GET_PEOPLE_ASSIGNED_COUNT_REQUEST });
// const getAssignedCountSuccess = () => ({ type: types.EXAMINATION_GET_PEOPLE_ASSIGNED_COUNT_SUCCESS });
// const getAssignedCountFailure = () => ({ type: types.EXAMINATION_GET_PEOPLE_ASSIGNED_COUNT_FAILURE });
// const getAssignedCount1 = (from, to) => (dispatch) => new Promise((resolve, reject) => {
//   dispatch(getAssignedCountRequest());
//   httpClient
//     .callApi({
//       url: apiLinks.examinationSummary.getPeopleAssignedCount1,
//       params: { from, to },
//     })
//     .then((response) => {
//       dispatch(getAssignedCountSuccess(response.data));
//       resolve();
//     })
//     .catch((error) => {
//       dispatch(getAssignedCountFailure(error));
//       reject();
//     });
// });
// const getTakenCountRequest = () => ({ type: types.EXAMINATION_GET_PEOPLE_TAKEN_EXAM_COUNT_REQUEST });
// const getTakenCountSuccess = () => ({ type: types.EXAMINATION_GET_PEOPLE_TAKEN_EXAM_COUNT_SUCCESS });
// const getTakenCountFailure = () => ({ type: types.EXAMINATION_GET_PEOPLE_TAKEN_EXAM_COUNT_FAILURE });
// const getTakenCount2 = (from, to) => (dispatch) => new Promise((resolve, reject) => {
//   dispatch(getTakenCountRequest());
//   httpClient
//     .callApi({
//       url: apiLinks.examinationSummary.getPeopleTakenExamCount2,
//       params: { from, to },
//     })
//     .then((response) => {
//       dispatch(getTakenCountSuccess(response.data));
//       resolve();
//     })
//     .catch((error) => {
//       dispatch(getTakenCountFailure(error));
//       reject();
//     });
// });
// const getHasResultExamCountRequest = () => ({ type: types.EXAMINATION_GET_PEOPLE_HAS_RESULT_EXAM_COUNT_REQUEST });
// const getHasResultExamCountSuccess = () => ({ type: types.EXAMINATION_GET_PEOPLE_HAS_RESULT_EXAM_COUNT_SUCCESS });
// const getHasResultExamCountFailure = () => ({ type: types.EXAMINATION_GET_PEOPLE_HAS_RESULT_EXAM_COUNT_FAILURE });
// const getHasResultExamCount = (from, to) => (dispatch) => new Promise((resolve, reject) => {
//   dispatch(getHasResultExamCountRequest());
//   httpClient
//     .callApi({
//       url: apiLinks.examinationSummary.getPeopleHasResultedExamCount,
//       params: { from, to },
//     })
//     .then((response) => {
//       dispatch(getHasResultExamCountSuccess(response.data));
//       resolve();
//     })
//     .catch((error) => {
//       dispatch(getHasResultExamCountFailure(error));
//       reject();
//     });
// });
// const getExamWaitingResultCountRequest = () => ({ type: types.EXAMINATION_GET_EXAM_WAITING_RESULT_COUNT_REQUEST });
// const getExamWaitingResultCountSuccess = () => ({ type: types.EXAMINATION_GET_EXAM_WAITING_RESULT_COUNT_SUCCESS });
// const getExamWaitingResultCountFailure = () => ({ type: types.EXAMINATION_GET_EXAM_WAITING_RESULT_COUNT_FAILURE });
// const getExamWaitingResultCount5 = (from, to) => (dispatch) => new Promise((resolve, reject) => {
//   dispatch(getExamWaitingResultCountRequest());
//   httpClient
//     .callApi({
//       url: apiLinks.examinationSummary.getExaminationWaitingResultCount5,
//       params: { from, to },
//     })
//     .then((response) => {
//       dispatch(getExamWaitingResultCountSuccess(response.data));
//       resolve();
//     })
//     .catch((error) => {
//       dispatch(getExamWaitingResultCountFailure(error));
//       reject();
//     });
// });

const getPeopleExaminationStatisticRequest = () => ({
  type: types.GET_PEOPLE_EXAMINATION_STATISTIC_REQUEST,
});
const getPeopleExaminationStatisticSuccess = (response) => ({
  type: types.GET_PEOPLE_EXAMINATION_STATISTIC_SUCCESS,
  payload: response,
});
const getPeopleExaminationStatisticFailure = (error) => ({
  type: types.GET_PEOPLE_EXAMINATION_STATISTIC_FAILURE,
  payload: error,
});
const getPeopleExaminationStatistic = (from, to) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getPeopleExaminationStatisticRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationSummary.getPeopleExaminationStatistic,
        params: { from, to },
      })
      .then((response) => {
        dispatch(getPeopleExaminationStatisticSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getPeopleExaminationStatisticFailure(error));
        reject();
      });
  });

const getExaminationDetailStatisticRequest = () => ({
  type: types.GET_EXAMINATION_DETAIL_STATISTIC_REQUEST,
});
const getExaminationDetailStatisticSuccess = (response) => ({
  type: types.GET_EXAMINATION_DETAIL_STATISTIC_SUCCESS,
  payload: response,
});
const getExaminationDetailStatisticFailure = (error) => ({
  type: types.GET_EXAMINATION_DETAIL_STATISTIC_FAILURE,
  payload: error,
});
const getExaminationDetailStatistic = (from, to) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getExaminationDetailStatisticRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationSummary.getExaminationDetailStatistic,
        params: { from, to },
      })
      .then((response) => {
        dispatch(getExaminationDetailStatisticSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getExaminationDetailStatisticFailure(error));
        reject();
      });
  });

const getGroupedExamDetailStatisticRequest = () => ({
  type: types.GET_GROUPED_EXAM_DETAIL_STATISTIC_REQUEST,
});
const getGroupedExamDetailStatisticSuccess = (response) => ({
  type: types.GET_GROUPED_EXAM_DETAIL_STATISTIC_SUCCESS,
  payload: response,
});
const getGroupedExamDetailStatisticFailure = (error) => ({
  type: types.GET_GROUPED_EXAM_DETAIL_STATISTIC_FAILURE,
  payload: error,
});
const getGroupedExamDetailStatistic = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getGroupedExamDetailStatisticRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationSummary.getGroupedExamDetailStatistic,
      })
      .then((response) => {
        dispatch(getGroupedExamDetailStatisticSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getGroupedExamDetailStatisticFailure(error));
        reject();
      });
  });

const getDashboardByDateRequest = () => ({
  type: types.GET_DASHBOARD_BY_DATE_REQUEST,
});
const getDashboardByDateSuccess = (response) => ({
  type: types.GET_DASHBOARD_BY_DATE_SUCCESS,
  payload: response,
});
const getDashboardByDateFailure = (error) => ({
  type: types.GET_DASHBOARD_BY_DATE_FAILURE,
  payload: error,
});
const getDashboardByDate = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getDashboardByDateRequest());
    httpClient
      .callApi({
        url: apiLinks.examinationSummary.getDashboardByDate,
        params: { date: moment().format('YYYY-MM-DD') },
      })
      .then((response) => {
        dispatch(getDashboardByDateSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(getDashboardByDateFailure(error));
        reject();
      });
  });

const reloadSummariesRequest = () => ({
  type: types.RELOAD_SUMMARIES_REQUEST,
});
const reloadSummariesSuccess = (response) => ({
  type: types.RELOAD_SUMMARIES_SUCCESS,
  payload: response,
});
const reloadSummariesFailure = (error) => ({
  type: types.RELOAD_SUMMARIES_FAILURE,
  payload: error,
});
const reloadSummaries = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(reloadSummariesRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.general.infectionTypes.reloadSummaries,
      })
      .then((response) => {
        dispatch(reloadSummariesSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(reloadSummariesFailure(error));
        reject();
      });
  });

export {
  selectSubjectType,
  selectLocationType,
  selectSubjectLocation,
  getSubjectTypesNumber,
  getSubjectTypeNumber,
  getSubjectSummariesByRange,
  getExaminationSummary,
  getExaminationSummaryByRange,
  selectSubjectSummariesList,
  getPeopleExaminationStatistic,
  getDashboardByDate,
  getGroupedExamDetailStatistic,
  getExaminationDetailStatistic,
  getChainsSummaries,
  reloadSummaries,
};
