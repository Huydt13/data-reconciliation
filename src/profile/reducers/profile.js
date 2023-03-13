import types from 'profile/actions/types';

const INITIAL_STATE = {
  profileList: [],
  getProfilesLoading: false,
  createProfileLoading: false,
  updateProfileLoading: false,
  deleteProfileLoading: false,
  relatedId: '',
  getRelatedLoading: false,
  profile: null,
  getProfileLoading: false,
  childProfileList: [],
  getChildProfileLoading: false,
  mergeDuplicateProfileResult: null,
  mergeDuplicateProfileLoading: false,
  createImmunizationForProfileLoading: false,
  updateImmunizationForProfileLoading: false,

  symptomData: {},
  getSymptomsLoading: false,
  underlyingDiseaseData: {
    data: [],
  },
  getUnderlyingDiseasesLoading: false,

  createProfileWithImmunizationLoading: false,
  updateProfileWithImmunizationLoading: false,

  infectiousDiseaseHistoriesData: {},
  getInfectiousDiseaseHistoriesLoading: false,
  infectiousDiseaseData: [],
  getInfectiousDiseasesLoading: false,
  infectiousDiseaseHistoriesByProfile: {},
  getInfectiousDiseaseHistoriesByProfileLoading: false,


};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_PROFILE_REQUEST:
      return {
        ...state,
        getProfileLoading: true,
      };
    case types.GET_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.payload,
        getProfileLoading: false,
      };
    case types.GET_PROFILE_FAILURE:
      return {
        ...state,
        getProfileLoading: false,
      };
    case types.GET_PROFILES_REQUEST:
      return {
        ...state,
        getProfilesLoading: true,
      };
    case types.GET_PROFILES_SUCCESS:
      return {
        ...state,
        profileList: action.payload,
        getProfilesLoading: false,
      };
    case types.GET_PROFILES_FAILURE:
      return {
        ...state,
        getProfilesLoading: Boolean(action.payload?.message),
      };
    case types.CREATE_PROFILE_REQUEST: {
      return {
        ...state,
        createProfileLoading: true,
      };
    }
    case types.CREATE_PROFILE_SUCCESS: {
      return {
        ...state,
        createProfileLoading: false,
      };
    }
    case types.CREATE_PROFILE_FAILURE: {
      return {
        ...state,
        createProfileLoading: false,
      };
    }
    case types.UPDATE_PROFILE_REQUEST: {
      return {
        ...state,
        updateProfileLoading: true,
      };
    }
    case types.UPDATE_PROFILE_SUCCESS: {
      return {
        ...state,
        updateProfileLoading: false,
      };
    }
    case types.UPDATE_PROFILE_FAILURE: {
      return {
        ...state,
        updateProfileLoading: false,
      };
    }
    case types.DELETE_PROFILE_REQUEST: {
      return {
        ...state,
        deleteProfileLoading: true,
      };
    }
    case types.DELETE_PROFILE_SUCCESS: {
      return {
        ...state,
        deleteProfileLoading: false,
      };
    }
    case types.DELETE_PROFILE_FAILURE: {
      return {
        ...state,
        deleteProfileLoading: false,
      };
    }
    case types.GET_RELATED_REQUEST: {
      return {
        ...state,
        getRelatedLoading: true,
      };
    }
    case types.GET_RELATED_SUCCESS: {
      return {
        ...state,
        relatedId: action.payload,
        getRelatedLoading: false,
      };
    }
    case types.GET_RELATED_FAILURE: {
      return {
        ...state,
        getRelatedLoading: false,
      };
    }
    case types.GET_CHILD_PROFILE_REQUEST: {
      return {
        ...state,
        getChildProfileLoading: true,
      };
    }
    case types.GET_CHILD_PROFILE_SUCCESS: {
      return {
        ...state,
        childProfileList: action.payload,
        getChildProfileLoading: false,
      };
    }
    case types.GET_CHILD_PROFILE_FAILURE: {
      return {
        ...state,
        getChildProfileLoading: false,
      };
    }
    case types.RESET_RELATED: {
      return {
        ...state,
        relatedId: '',
      };
    }
    case types.GET_DUPLICATE_PROFILE_REQUEST: {
      return {
        ...state,
        mergeDuplicateProfileLoading: true,
      };
    }
    case types.GET_DUPLICATE_PROFILE_SUCCESS: {
      return {
        ...state,
        childProfileList: action.payload,
        mergeDuplicateProfileLoading: false,
      };
    }
    case types.GET_DUPLICATE_PROFILE_FAILURE: {
      return {
        ...state,
        mergeDuplicateProfileLoading: false,
      };
    }
    case types.CREATE_IMMUNIZATION_FOR_PROFILE_REQUEST: {
      return {
        ...state,
        createImmunizationForProfileLoading: true,
      };
    }
    case types.CREATE_IMMUNIZATION_FOR_PROFILE_SUCCESS: {
      return {
        ...state,
        createImmunizationForProfileLoading: false,
      };
    }
    case types.CREATE_IMMUNIZATION_FOR_PROFILE_FAILURE: {
      return {
        ...state,
        createImmunizationForProfileLoading: false,
      };
    }
    case types.UPDATE_IMMUNIZATION_FOR_PROFILE_REQUEST: {
      return {
        ...state,
        updateImmunizationForProfileLoading: true,
      };
    }
    case types.UPDATE_IMMUNIZATION_FOR_PROFILE_SUCCESS: {
      return {
        ...state,
        updateImmunizationForProfileLoading: false,
      };
    }
    case types.UPDATE_IMMUNIZATION_FOR_PROFILE_FAILURE: {
      return {
        ...state,
        updateImmunizationForProfileLoading: false,
      };
    }

    case types.GET_SYMPTOMS_REQUEST: {
      return {
        ...state,
        getSymptomsLoading: true,
      };
    }
    case types.GET_SYMPTOMS_SUCCESS: {
      return {
        ...state,
        symptomData: action.payload,
        getSymptomsLoading: false,
      };
    }
    case types.GET_SYMPTOMS_FAILURE: {
      return {
        ...state,
        getSymptomsLoading: false,
      };
    }
    case types.GET_UNDERLYING_DISEASES_REQUEST: {
      return {
        ...state,
        getUnderlyingDiseasesLoading: true,
      };
    }
    case types.GET_UNDERLYING_DISEASES_SUCCESS: {
      return {
        ...state,
        underlyingDiseaseData: action.payload,
        getUnderlyingDiseasesLoading: false,
      };
    }
    case types.GET_UNDERLYING_DISEASES_FAILURE: {
      return {
        ...state,
        getUnderlyingDiseasesLoading: false,
      };
    }
    case types.CREATE_PROFILE_WITH_IMMUNIZATION_REQUEST: {
      return {
        ...state,
        createProfileWithImmunizationLoading: true,
      };
    }
    case types.CREATE_PROFILE_WITH_IMMUNIZATION_SUCCESS: {
      return {
        ...state,
        createProfileWithImmunizationLoading: false,
      };
    }
    case types.CREATE_PROFILE_WITH_IMMUNIZATION_FAILURE: {
      return {
        ...state,
        createProfileWithImmunizationLoading: false,
      };
    }
    case types.UPDATE_PROFILE_WITH_IMMUNIZATION_REQUEST: {
      return {
        ...state,
        updateProfileWithImmunizationLoading: true,
      };
    }
    case types.UPDATE_PROFILE_WITH_IMMUNIZATION_SUCCESS: {
      return {
        ...state,
        updateProfileWithImmunizationLoading: false,
      };
    }
    case types.UPDATE_PROFILE_WITH_IMMUNIZATION_FAILURE: {
      return {
        ...state,
        updateProfileWithImmunizationLoading: false,
      };
    }
    case types.GET_INFECTIOUS_DISEASES_REQUEST: {
      return {
        ...state,
        getInfectiousDiseasesLoading: true,
      };
    }
    case types.GET_INFECTIOUS_DISEASES_SUCCESS: {
      return {
        ...state,
        infectiousDiseaseData: action.payload,
        getInfectiousDiseasesLoading: false,
      };
    }
    case types.GET_INFECTIOUS_DISEASES_FAILURE: {
      return {
        ...state,
        getInfectiousDiseasesLoading: false,
      };
    }
    case types.GET_INFECTIOUS_DISEASE_HISTORIES_REQUEST: {
      return {
        ...state,
        getInfectiousDiseaseHistoriesLoading: true,
      };
    }
    case types.GET_INFECTIOUS_DISEASE_HISTORIES_SUCCESS: {
      return {
        ...state,
        infectiousDiseaseHistoriesData: action.payload,
        getInfectiousDiseaseHistoriesLoading: false,
      };
    }
    case types.GET_INFECTIOUS_DISEASE_HISTORIES_FAILURE: {
      return {
        ...state,
        getInfectiousDiseaseHistoriesLoading: false,
      };
    }
    case types.GET_INFECTIOUS_DISEASE_HISTORIES_BY_PROFILE_REQUEST: {
      return {
        ...state,
        getInfectiousDiseaseHistoriesByProfileLoading: true,
      };
    }
    case types.GET_INFECTIOUS_DISEASE_HISTORIES_BY_PROFILE_SUCCESS: {
      return {
        ...state,
        infectiousDiseaseHistoriesByProfile: action.payload,
        getInfectiousDiseaseHistoriesByProfileLoading: false,
      };
    }
    case types.GET_INFECTIOUS_DISEASE_HISTORIES_BY_PROFILE_FAILURE: {
      return {
        ...state,
        getInfectiousDiseaseHistoriesByProfileLoading: false,
      };
    }

    default:
      return state;
  }
}
