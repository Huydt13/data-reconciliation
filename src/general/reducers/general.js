import types from 'general/actions/types';

const defaultGeneral = { data: [], totalPages: 0 };
const INITIAL_STATE = {
  selectedGeneral: undefined,
  diseaseTypeData: defaultGeneral,
  getDiseaseTypesLoading: false,
  createDiseaseTypeLoading: false,
  updateDiseaseTypeLoading: false,
  deleteDiseaseTypeLoading: false,
  infectionTypeData: defaultGeneral,
  getInfectionTypesLoading: false,
  createInfectionTypeLoading: false,
  updateInfectionTypeLoading: false,
  deleteInfectionTypeLoading: false,
  criteriaData: [],
  getCriteriasLoading: false,
  createCriteriaLoading: false,
  updateCriteriaLoading: false,
  deleteCriteriaLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SELECT_GENERAL:
      return {
        ...state,
        selectedGeneral: action.payload,
      };
    case types.GET_DISEASE_TYPES_REQUEST:
      return {
        ...state,
        getDiseaseTypesLoading: true,
      };
    case types.GET_DISEASE_TYPES_SUCCESS:
      return {
        ...state,
        getDiseaseTypesLoading: false,
        diseaseTypeData: action.payload,
      };
    case types.GET_DISEASE_TYPES_FAILURE:
      return {
        ...state,
        getDiseaseTypesLoading: false,
      };
    case types.CREATE_DISEASE_TYPE_REQUEST:
      return {
        ...state,
        createDiseaseTypeLoading: true,
      };
    case types.CREATE_DISEASE_TYPE_SUCCESS:
    case types.CREATE_DISEASE_TYPE_FAILURE:
      return {
        ...state,
        createDiseaseTypeLoading: false,
      };
    case types.UPDATE_DISEASE_TYPE_REQUEST:
      return {
        ...state,
        updateDiseaseTypeLoading: true,
      };
    case types.UPDATE_DISEASE_TYPE_SUCCESS:
    case types.UPDATE_DISEASE_TYPE_FAILURE:
      return {
        ...state,
        updateDiseaseTypeLoading: false,
      };
    case types.DELETE_DISEASE_TYPE_REQUEST:
      return {
        ...state,
        deleteDiseaseTypeLoading: true,
      };
    case types.DELETE_DISEASE_TYPE_SUCCESS:
    case types.DELETE_DISEASE_TYPE_FAILURE:
      return {
        ...state,
        deleteDiseaseTypeLoading: false,
      };
    case types.GET_INFECTION_TYPES_REQUEST:
      return {
        ...state,
        getInfectionTypesLoading: true,
      };
    case types.GET_INFECTION_TYPES_SUCCESS:
      return {
        ...state,
        getInfectionTypesLoading: false,
        infectionTypeData: action.payload,
      };
    case types.GET_INFECTION_TYPES_FAILURE:
      return {
        ...state,
        getInfectionTypesLoading: false,
      };
    case types.CREATE_INFECTION_TYPE_REQUEST:
      return {
        ...state,
        createInfectionTypeLoading: true,
      };
    case types.CREATE_INFECTION_TYPE_SUCCESS:
    case types.CREATE_INFECTION_TYPE_FAILURE:
      return {
        ...state,
        createInfectionTypeLoading: false,
      };
    case types.UPDATE_INFECTION_TYPE_REQUEST:
      return {
        ...state,
        updateInfectionTypeLoading: true,
      };
    case types.UPDATE_INFECTION_TYPE_SUCCESS:
    case types.UPDATE_INFECTION_TYPE_FAILURE:
      return {
        ...state,
        updateInfectionTypeLoading: false,
      };
    case types.DELETE_INFECTION_TYPE_REQUEST:
      return {
        ...state,
        deleteInfectionTypeLoading: true,
      };
    case types.DELETE_INFECTION_TYPE_SUCCESS:
    case types.DELETE_INFECTION_TYPE_FAILURE:
      return {
        ...state,
        deleteInfectionTypeLoading: false,
      };
    case types.GET_INVESTIGATION_CRITERIAS_REQUEST:
      return {
        ...state,
        getCriteriasLoading: true,
      };
    case types.GET_INVESTIGATION_CRITERIAS_SUCCESS:
      return {
        ...state,
        getCriteriasLoading: false,
        criteriaData: action.payload,
      };
    case types.GET_INVESTIGATION_CRITERIAS_FAILURE:
      return {
        ...state,
        getCriteriasLoading: false,
      };
    case types.CREATE_CRITERIA_REQUEST:
      return {
        ...state,
        createCriteriaLoading: true,
      };
    case types.CREATE_CRITERIA_SUCCESS:
    case types.CREATE_CRITERIA_FAILURE:
      return {
        ...state,
        createCriteriaLoading: false,
      };
    case types.UPDATE_CRITERIA_REQUEST:
      return {
        ...state,
        updateCriteriaLoading: true,
      };
    case types.UPDATE_CRITERIA_SUCCESS:
    case types.UPDATE_CRITERIA_FAILURE:
      return {
        ...state,
        updateCriteriaLoading: false,
      };
    case types.DELETE_CRITERIA_REQUEST:
      return {
        ...state,
        deleteCriteriaLoading: true,
      };
    case types.DELETE_CRITERIA_SUCCESS:
    case types.DELETE_CRITERIA_FAILURE:
      return {
        ...state,
        deleteCriteriaLoading: false,
      };
    default:
      return state;
  }
}
