import { treatmentPaging } from 'app/utils/helpers';
import types from '../actions/types';

const INITIAL_STATE = {
  visitData: treatmentPaging,
  getVisitsLoading: false,
  createVisitLoading: false,
  updateVisitLoading: false,
  completeVisitLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_VISITS_REQUEST:
      return {
        ...state,
        getVisitsLoading: true,
      };
    case types.GET_VISITS_SUCCESS:
      return {
        ...state,
        getVisitsLoading: false,
        visitData: action.payload,
      };
    case types.GET_VISITS_FAILURE:
      return {
        ...state,
        getVisitsLoading: false,
      };
    case types.CREATE_VISIT_REQUEST:
      return {
        ...state,
        createVisitLoading: true,
      };
    case types.CREATE_VISIT_SUCCESS:
    case types.CREATE_VISIT_FAILURE:
      return {
        ...state,
        createVisitLoading: false,
      };
    case types.UPDATE_VISIT_REQUEST:
      return {
        ...state,
        updateVisitLoading: true,
      };
    case types.UPDATE_VISIT_SUCCESS:
    case types.UPDATE_VISIT_FAILURE:
      return {
        ...state,
        updateVisitLoading: false,
      };
    case types.COMPLETE_VISIT_REQUEST:
      return {
        ...state,
        completeVisitLoading: true,
      };
    case types.COMPLETE_VISIT_SUCCESS:
    case types.COMPLETE_VISIT_FAILURE:
      return {
        ...state,
        completeVisitLoading: false,
      };
    default:
      return state;
  }
};
