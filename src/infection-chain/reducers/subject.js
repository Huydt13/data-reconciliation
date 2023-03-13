import types from '../actions/types';

const initialState = {
  subject: null,
  getSubjectLoading: false,
  report: null,
  getReportLoading: false,
  subjectList: {},
  getSubjectsLoading: false,
  createSubjectLoading: false,
  updateSubjectLoading: false,
  deleteSubjectLoading: false,
  verifySubjectLoading: false,
  processSubjectLoading: false,
  fromContactData: null,
  toContactData: null,
  getFromContactsLoading: false,
  getToContactsLoading: false,
  createContactLoading: false,
  updateContactLoading: false,
  deleteContactLoading: false,
  contactLocations: [],
  getContactLocationsLoading: false,
  createContactLocationLoading: false,
  updateContactLocationLoading: false,
  deleteContactLocationLoading: false,
  symptomList: [],
  getSymptomsLoading: false,
  createSymptomLoading: false,
  underlyingDiseaseList: [],
  getUnderlyingDiseasesLoading: false,
  createUnderlyingDiseaseLoading: false,
  contactLocationSuggestionList: [],
  reportList: [],
  getReportsLoading: false,
  uploadProgress: 0,
  uploadProgressLoading: false,
  searchSubjectList: [],
  getSearchSubjectLoading: false,
  exportLoading: false,
  relatedProfileId: 0,
  isF0: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.GET_SUBJECT_REQUEST:
      return {
        ...state,
        getSubjectLoading: true,
      };
    case types.GET_SUBJECT_SUCCESS:
      return {
        ...state,
        subject: action.payload,
        getSubjectLoading: false,
      };
    case types.GET_SUBJECT_FAILURE:
      return {
        ...state,
        getSubjectLoading: false,
      };
    case types.GET_SUBJECTS_REQUEST:
      return {
        ...state,
        subjectList: [],
        getSubjectsLoading: true,
      };
    case types.GET_SUBJECTS_SUCCESS:
      return {
        ...state,
        subjectList: action.payload,
        getSubjectsLoading: false,
      };
    case types.GET_SUBJECTS_FAILURE: {
      return {
        ...state,
        getSubjectsLoading: Boolean(action.payload?.message),
      };
    }
    case types.CREATE_SUBJECT_REQUEST:
      return {
        ...state,
        createSubjectLoading: true,
      };
    case types.CREATE_SUBJECT_SUCCESS:
    case types.CREATE_SUBJECT_FAILURE:
      return {
        ...state,
        createSubjectLoading: false,
      };
    case types.UPDATE_SUBJECT_REQUEST:
      return {
        ...state,
        updateSubjectLoading: true,
      };
    case types.UPDATE_SUBJECT_SUCCESS:
    case types.UPDATE_SUBJECT_FAILURE:
      return {
        ...state,
        updateSubjectLoading: false,
      };
    case types.DELETE_SUBJECT_REQUEST:
      return {
        ...state,
        deleteSubjectLoading: true,
      };
    case types.DELETE_SUBJECT_SUCCESS:
    case types.DELETE_SUBJECT_FAILURE:
      return {
        ...state,
        deleteSubjectLoading: false,
      };
    case types.VERIFY_SUBJECT_REQUEST:
      return {
        ...state,
        verifySubjectLoading: true,
      };
    case types.VERIFY_SUBJECT_SUCCESS:
    case types.VERIFY_SUBJECT_FAILURE:
      return {
        ...state,
        verifySubjectLoading: false,
      };
    case types.PROCESS_SUBJECT_REQUEST:
      return {
        ...state,
        processSubjectLoading: true,
      };
    case types.PROCESS_SUBJECT_SUCCESS:
    case types.PROCESS_SUBJECT_FAILURE:
      return {
        ...state,
        processSubjectLoading: false,
      };
    case types.GET_CONTACTS_REQUEST: {
      const isSubjectFrom = action.payload;
      return {
        ...state,
        getFromContactsLoading: !isSubjectFrom
          ? true
          : state.getFromContactsLoading,
        getToContactsLoading: isSubjectFrom ? true : state.getToContactsLoading,
      };
    }
    case types.GET_CONTACTS_SUCCESS: {
      const { response, isSubjectFrom } = action.payload;
      return {
        ...state,
        toContactData: isSubjectFrom ? response : state.toContactData,
        fromContactData: !isSubjectFrom ? response : state.fromContactData,
        getFromContactsLoading: false,
        getToContactsLoading: false,
      };
    }
    case types.GET_CONTACTS_FAILURE:
      return {
        ...state,
        getFromContactsLoading: false,
        getToContactsLoading: false,
      };
    case types.CREATE_CONTACT_REQUEST:
      return {
        ...state,
        createContactLoading: true,
      };
    case types.CREATE_CONTACT_SUCCESS:
    case types.CREATE_CONTACT_FAILURE:
      return {
        ...state,
        createContactLoading: false,
      };
    case types.UPDATE_CONTACT_REQUEST:
      return {
        ...state,
        updateContactLoading: true,
      };
    case types.UPDATE_CONTACT_SUCCESS:
    case types.UPDATE_CONTACT_FAILURE:
      return {
        ...state,
        updateContactLoading: false,
      };
    case types.DELETE_CONTACT_REQUEST:
      return {
        ...state,
        deleteContactLoading: true,
      };
    case types.DELETE_CONTACT_SUCCESS:
    case types.DELETE_CONTACT_FAILURE:
      return {
        ...state,
        deleteContactLoading: false,
      };
    case types.GET_CONTACT_LOCATIONS_REQUEST:
      return {
        ...state,
        getContactLocationsLoading: true,
      };
    case types.GET_CONTACT_LOCATIONS_SUCCESS:
      return {
        ...state,
        getContactLocationsLoading: false,
      };
    case types.GET_CONTACT_LOCATIONS_FAILURE:
      return {
        ...state,
        getContactLocationsLoading: false,
      };
    case types.CREATE_CONTACT_LOCATION_REQUEST:
      return {
        ...state,
        createContactLocationLoading: true,
      };
    case types.CREATE_CONTACT_LOCATION_SUCCESS:
    case types.CREATE_CONTACT_LOCATION_FAILURE:
      return {
        ...state,
        createContactLocationLoading: false,
      };
    case types.UPDATE_CONTACT_LOCATION_REQUEST:
      return {
        ...state,
        updateContactLocationLoading: true,
      };
    case types.UPDATE_CONTACT_LOCATION_SUCCESS:
    case types.UPDATE_CONTACT_LOCATION_FAILURE:
      return {
        ...state,
        updateContactLocationLoading: false,
      };
    case types.DELETE_CONTACT_LOCATION_REQUEST:
      return {
        ...state,
        deleteContactLocationLoading: true,
      };
    case types.DELETE_CONTACT_LOCATION_SUCCESS:
    case types.DELETE_CONTACT_LOCATION_FAILURE:
      return {
        ...state,
        deleteContactLocationLoading: false,
      };
    case types.GET_SYMPTOMS_REQUEST:
      return {
        ...state,
        getSymptomsLoading: true,
      };
    case types.GET_SYMPTOMS_SUCCESS:
      return {
        ...state,
        symptomList: action.payload,
        getSymptomsLoading: false,
      };
    case types.GET_SYMPTOMS_FAILURE:
      return {
        ...state,
        getSymptomsLoading: false,
      };
    case types.CREATE_SYMPTOM_REQUEST:
      return {
        ...state,
        createSymptomLoading: true,
      };
    case types.CREATE_SYMPTOM_SUCCESS:
    case types.CREATE_SYMPTOM_FAILURE:
      return {
        ...state,
        createSymptomLoading: false,
      };
    case types.GET_UNDERLYING_DISEASES_REQUEST:
      return {
        ...state,
        getUnderlyingDiseasesLoading: true,
      };
    case types.GET_UNDERLYING_DISEASES_SUCCESS:
      return {
        ...state,
        underlyingDiseaseList: action.payload,
        getUnderlyingDiseasesLoading: false,
      };
    case types.GET_UNDERLYING_DISEASES_FAILURE:
      return {
        ...state,
        getUnderlyingDiseasesLoading: false,
      };
    case types.GET_REPORT_REQUEST:
      return {
        ...state,
        getReportLoading: true,
      };
    case types.GET_REPORT_SUCCESS:
      return {
        ...state,
        report: action.payload,
        getReportLoading: false,
      };
    case types.GET_REPORT_FAILURE:
      return {
        ...state,
        getReportLoading: false,
      };
    case types.GET_SUMMARY_REPORTS_REQUEST:
      return {
        ...state,
        getReportsLoading: true,
      };
    case types.GET_SUMMARY_REPORTS_SUCCESS:
      return {
        ...state,
        reportList: action.payload,
        getReportsLoading: false,
      };
    case types.GET_SUMMARY_REPORTS_FAILURE:
      return {
        ...state,
        getReportsLoading: false,
      };
    case types.CREATE_UNDERLYING_DISEASE_REQUEST:
      return {
        ...state,
        createUnderlyingDiseaseLoading: true,
      };
    case types.CREATE_UNDERLYING_DISEASE_SUCCESS:
    case types.CREATE_UNDERLYING_DISEASE_FAILURE:
      return {
        ...state,
        createUnderlyingDiseaseLoading: false,
      };
    case types.SET_UPLOAD_SUBJECT_FILE_PROGRESS: {
      return {
        ...state,
        uploadProgress: action.payload,
      };
    }
    case types.UPLOAD_SUBJECT_FILE_REQUEST:
      return {
        ...state,
        uploadProgressLoading: true,
      };
    case types.UPLOAD_SUBJECT_FILE_SUCCESS:
    case types.UPLOAD_SUBJECT_FILE_FAILURE:
      return {
        ...state,
        uploadProgressLoading: false,
      };
    case types.EXPORT_SUBJECTS_REQUEST:
      return {
        ...state,
        exportLoading: true,
      };
    case types.EXPORT_SUBJECTS_SUCCESS:
    case types.EXPORT_SUBJECTS_FAILURE:
      return {
        ...state,
        exportLoading: false,
      };
    case types.GET_SUBJECT_RELATED_REQUEST:
      return {
        ...state,
        getSubjectRelatedLoading: true,
      };
    case types.GET_SUBJECT_RELATED_SUCCESS:
      return {
        ...state,
        subjectRelated: action.payload,
        getSubjectRelatedLoading: false,
      };
    case types.GET_SUBJECT_RELATED_FAILURE:
      return {
        ...state,
        getSubjectRelatedLoading: false,
      };
    case types.SEARCH_SUBJECT_REQUEST:
      return {
        ...state,
        getSearchSubjectLoading: true,
      };
    case types.SEARCH_SUBJECT_SUCCESS:
      return {
        ...state,
        searchSubjectList: action.payload,
        getSearchSubjectLoading: false,
      };
    case types.SEARCH_SUBJECT_FAILURE:
      return {
        ...state,
        getSearchSubjectLoading: false,
      };
    case types.SELECT_F0_ON_CREATING_PROFILE:
      return {
        ...state,
        relatedProfileId: action.payload.profileId,
        isF0: action.payload.isF0,
      };
    default:
      return state;
  }
}
