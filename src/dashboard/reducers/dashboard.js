import types, {
  GET_SUBJECT_SUMMARIES_REQUEST,
  GET_SUBJECT_SUMMARIES_SUCCESS,
  GET_SUBJECT_SUMMARIES_FAILURE,
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
} from 'dashboard/actions/types';
import moment from 'moment';

const defaultSummary = {
  diseaseTypeId: '',
  summaryDate: '',
  summaryDetails: [],
};

const INITIAL_STATE = {
  selectedSubjectType: 0,
  selectedLocationType: 0,
  isSubject: true,
  subjectSummaries: null,
  loadingGetSubjectSummaries: false,
  selectedSubjectSummariesList: [],
  loadingGetSubjectSummariesByRange: false,
  subjectSummariesByRange: [],
  loadingGetExaminationSummary: false,
  examinationSummary: [],
  loadingGetExaminationSummaryByRange: false,
  examinationSummaryByRange: [],
  getPeopleExaminationStatisticLoading: false,
  peopleExaminationStatistic: [],
  getExaminationDetailStatisticLoading: false,
  examinationDetailStatistic: [],
  getGroupedExamDetailLoading: false,
  groupedExamDetail: [],
  getDashboardByDateLoading: false,
  dashboardByDate: {},

  chainsSummariesData: defaultSummary,
  getChainsSummariesLoading: false,
  getChainsSummariesByRangeLoading: false,
  chainsSummariesByRangeData: [],
  reloadSummariesLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_SUBJECT_SUMMARIES_REQUEST: {
      return {
        ...state,
        loadingGetSubjectSummaries: true,
      };
    }
    case GET_SUBJECT_SUMMARIES_SUCCESS: {
      return {
        ...state,
        loadingGetSubjectSummaries: false,
        subjectSummaries: action.payload,
      };
    }
    case GET_SUBJECT_SUMMARIES_FAILURE: {
      return {
        ...state,
        loadingGetSubjectSummaries: false,
      };
    }
    case GET_SUBJECT_SUMMARY_BY_RANGE_REQUEST: {
      return {
        ...state,
        loadingGetSubjectSummariesByRange: true,
      };
    }
    case GET_SUBJECT_SUMMARY_BY_RANGE_SUCCESS: {
      return {
        ...state,
        loadingGetSubjectSummariesByRange: false,
        subjectSummariesByRange: action.payload,
      };
    }
    case GET_SUBJECT_SUMMARY_BY_RANGE_FAILURE: {
      return {
        ...state,
        loadingGetSubjectSummariesByRange: false,
      };
    }
    case GET_EXAMINATION_SUMMARY_REQUEST: {
      return {
        ...state,
        loadingGetExaminationSummary: true,
      };
    }
    case GET_EXAMINATION_SUMMARY_SUCCESS: {
      return {
        ...state,
        loadingGetExaminationSummary: false,
        examinationSummary: action.payload,
      };
    }
    case GET_EXAMINATION_SUMMARY_FAILURE: {
      return {
        ...state,
        loadingGetExaminationSummary: false,
      };
    }
    case GET_EXAMINATION_SUMMARY_BY_RANGE_REQUEST: {
      return {
        ...state,
        loadingGetExaminationSummaryByRange: true,
      };
    }
    case GET_EXAMINATION_SUMMARY_BY_RANGE_SUCCESS: {
      return {
        ...state,
        loadingGetExaminationSummaryByRange: false,
        examinationSummaryByRange: action.payload,
      };
    }
    case GET_EXAMINATION_SUMMARY_BY_RANGE_FAILURE: {
      return {
        ...state,
        loadingGetExaminationSummaryByRange: false,
      };
    }
    case SELECT_SUBJECT_SUMMARIES_LIST: {
      return {
        ...state,
        selectedSubjectSummariesList: action.payload,
      };
    }
    case SELECT_SUBJECT_TYPE: {
      return {
        ...state,
        selectedSubjectType: action.payload,
      };
    }
    case SELECT_LOCATION_TYPE: {
      return {
        ...state,
        selectedLocationType: action.payload,
      };
    }
    case SELECT_SUBJECT_LOCATION: {
      return {
        ...state,
        isSubject: action.payload,
      };
    }
    case types.EXAMINATION_GET_TAKEN_EXAMINATION_COUNT_BY_DATE_REQUEST: {
      return {
        ...state,
        getTakenExaminationCountLoading: true,
      };
    }
    case types.EXAMINATION_GET_TAKEN_EXAMINATION_COUNT_BY_DATE_SUCCESS: {
      return {
        ...state,
        getTakenExaminationCountLoading: false,
        takenExaminationCountList: action.payload,
      };
    }
    case types.EXAMINATION_GET_TAKEN_EXAMINATION_COUNT_BY_DATE_FAILURE: {
      return {
        ...state,
        getTakenExaminationCountLoading: false,
      };
    }
    case types.EXAMINATION_GET_RESULT_EXAMINATION_COUNT_REQUEST: {
      return {
        ...state,
        getResultExaminationCountLoading: true,
      };
    }
    case types.EXAMINATION_GET_RESULT_EXAMINATION_COUNT_SUCCESS: {
      return {
        ...state,
        getResultExaminationCountLoading: false,
        resultExaminationCountList: action.payload,
      };
    }
    case types.EXAMINATION_GET_RESULT_EXAMINATION_COUNT_FAILURE: {
      return {
        ...state,
        getResultExaminationCountLoading: false,
      };
    }
    case types.EXAMINATION_GET_PEOPLE_ASSIGNED_COUNT_REQUEST: {
      return {
        ...state,
        getPeopleAssignedCountLoading: true,
      };
    }
    case types.EXAMINATION_GET_PEOPLE_ASSIGNED_COUNT_SUCCESS: {
      return {
        ...state,
        getPeopleAssignedCountLoading: false,
        peopleAssignedCountList: action.payload,
      };
    }
    case types.EXAMINATION_GET_PEOPLE_ASSIGNED_COUNT_FAILURE: {
      return {
        ...state,
        getPeopleAssignedCountLoading: false,
      };
    }
    case types.EXAMINATION_GET_PEOPLE_TAKEN_EXAM_COUNT_REQUEST: {
      return {
        ...state,
        getPeopleTakenExamCountLoading: true,
      };
    }
    case types.EXAMINATION_GET_PEOPLE_TAKEN_EXAM_COUNT_SUCCESS: {
      return {
        ...state,
        getPeopleTakenExamCountLoading: false,
        peopleTakenExamCountList: action.payload,
      };
    }
    case types.EXAMINATION_GET_PEOPLE_TAKEN_EXAM_COUNT_FAILURE: {
      return {
        ...state,
        getPeopleTakenExamCountLoading: false,
      };
    }
    case types.EXAMINATION_GET_PEOPLE_HAS_RESULT_EXAM_COUNT_REQUEST: {
      return {
        ...state,
        getPeopleHasResultExamCountLoading: true,
      };
    }
    case types.EXAMINATION_GET_PEOPLE_HAS_RESULT_EXAM_COUNT_SUCCESS: {
      return {
        ...state,
        getPeopleHasResultExamCountLoading: false,
        peopleHasResultExamList: action.payload,
      };
    }
    case types.EXAMINATION_GET_PEOPLE_HAS_RESULT_EXAM_COUNT_FAILURE: {
      return {
        ...state,
        getPeopleHasResultExamCountLoading: false,
      };
    }
    case types.EXAMINATION_GET_EXAM_WAITING_RESULT_COUNT_REQUEST: {
      return {
        ...state,
        getExamWaitingResultCountLoading: true,
      };
    }
    case types.EXAMINATION_GET_EXAM_WAITING_RESULT_COUNT_SUCCESS: {
      return {
        ...state,
        getExamWaitingResultCountLoading: false,
        examWaitingResultCountList: action.payload,
      };
    }
    case types.EXAMINATION_GET_EXAM_WAITING_RESULT_COUNT_FAILURE: {
      return {
        ...state,
        getExamWaitingResultCountLoading: false,
      };
    }
    case types.GET_PEOPLE_EXAMINATION_STATISTIC_REQUEST: {
      return {
        ...state,
        getPeopleExaminationStatisticLoading: true,
      };
    }
    case types.GET_PEOPLE_EXAMINATION_STATISTIC_SUCCESS: {
      return {
        ...state,
        getPeopleExaminationStatisticLoading: false,
        peopleExaminationStatistic: action.payload,
      };
    }
    case types.GET_PEOPLE_EXAMINATION_STATISTIC_FAILURE: {
      return {
        ...state,
        getPeopleExaminationStatisticLoading: false,
      };
    }
    case types.GET_EXAMINATION_DETAIL_STATISTIC_REQUEST: {
      return {
        ...state,
        getExaminationDetailStatisticLoading: true,
      };
    }
    case types.GET_EXAMINATION_DETAIL_STATISTIC_SUCCESS: {
      return {
        ...state,
        getExaminationDetailStatisticLoading: false,
        examinationDetailStatistic: action.payload,
      };
    }
    case types.GET_EXAMINATION_DETAIL_STATISTIC_FAILURE: {
      return {
        ...state,
        getExaminationDetailStatisticLoading: false,
      };
    }
    case types.GET_GROUPED_EXAM_DETAIL_STATISTIC_REQUEST: {
      return {
        ...state,
        getGroupedExamDetailLoading: true,
      };
    }
    case types.GET_GROUPED_EXAM_DETAIL_STATISTIC_SUCCESS: {
      return {
        ...state,
        getGroupedExamDetailLoading: false,
        groupedExamDetail: action.payload,
      };
    }
    case types.GET_GROUPED_EXAM_DETAIL_STATISTIC_FAILURE: {
      return {
        ...state,
        getGroupedExamDetailLoading: false,
      };
    }
    case types.GET_DASHBOARD_BY_DATE_REQUEST: {
      return {
        ...state,
        getDashboardByDateLoading: true,
      };
    }
    case types.GET_DASHBOARD_BY_DATE_SUCCESS: {
      return {
        ...state,
        getDashboardByDateLoading: false,
        dashboardByDate: action.payload,
      };
    }
    case types.GET_DASHBOARD_BY_DATE_FAILURE: {
      return {
        ...state,
        getDashboardByDateLoading: false,
      };
    }
    case types.GET_CHAINS_SUMMARIES_REQUEST: {
      const { isRange } = action.payload;
      return {
        ...state,
        getChainsSummariesLoading: !isRange
          ? true
          : state.getChainsSummariesLoading,
        getChainsSummariesByRangeLoading: isRange
          ? true
          : state.getChainsSummariesByRangeLoading,
      };
    }
    case types.GET_CHAINS_SUMMARIES_SUCCESS: {
      const { response, isRange } = action.payload;
      return {
        ...state,
        chainsSummariesData: !isRange
          ? response.find(
              (res) =>
                res.diseaseTypeId === 'b597cc8f-74b6-434d-8b9d-52b74595a1de',
            ) || state.chainsSummariesData
          : state.chainsSummariesData,
        chainsSummariesByRangeData: isRange
          ? [
              ...response
                .map((res) => ({
                  ...res,
                  date: moment(res.summaryDate).format('DD-MM-YYYY'),
                }))
                .sort((a, b) =>
                  moment(a.date, 'DD-MM-YYYY').diff(
                    moment(b.date, 'DD-MM-YYYY'),
                  ),
                ),
            ].sort((a, b) =>
              moment(a.date, 'DD-MM-YYYY').diff(moment(b.date, 'DD-MM-YYYY')),
            )
          : state.chainsSummariesByRangeData,
        getChainsSummariesLoading: !isRange
          ? false
          : state.getChainsSummariesLoading,
        getChainsSummariesByRangeLoading: isRange
          ? false
          : state.getChainsSummariesByRangeLoading,
      };
    }
    case types.GET_CHAINS_SUMMARIES_FAILURE: {
      const { isRange } = action.payload;
      return {
        ...state,
        getChainsSummariesLoading: !isRange
          ? false
          : state.getChainsSummariesLoading,
        getChainsSummariesByRangeLoading: isRange
          ? false
          : state.getChainsSummariesByRangeLoading,
      };
    }
    case types.RELOAD_SUMMARIES_REQUEST: {
      return {
        ...state,
        reloadSummariesLoading: true,
      };
    }
    case types.RELOAD_SUMMARIES_SUCCESS: {
      return {
        ...state,
        reloadSummariesLoading: false,
        chainsSummariesData: {
          ...state.chainsSummariesData,
          summaryDetails: state.chainsSummariesData.summaryDetails.map((s) => ({
            ...s,
            total: action.payload.summaryDetails.find(
              (reloadSummary) =>
                reloadSummary.infectionTypeId === s.infectionTypeId,
            ).total,
            diff:
              s.total -
              action.payload.summaryDetails.find(
                (reloadSummary) =>
                  reloadSummary.infectionTypeId === s.infectionTypeId,
              ).total,
          })),
        },
      };
    }
    case types.RELOAD_SUMMARIES_FAILURE: {
      return {
        ...state,
        reloadSummariesLoading: false,
      };
    }
    default:
      return state;
  }
}
