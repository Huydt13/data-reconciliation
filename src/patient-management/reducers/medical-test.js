import types from '../actions/types';

const INITIAL_STATE = {
  infectedPatients: {},
  getInfectedPatientsLoading: false,
  infectedPatientDetail: {},
  getInfectedPatientDetailLoading: false,
  // deletedQuickTestData: {},
  // getDeletedQuickTestLoading: false,
  // quickTestsByManagementUnitData: {},
  // getQuickTestsManagementUnitLoading: false,
  // quickTestsByUnitTypeData: {},
  // getQuickTestsByUnitTypeLoading: false,
  // positiveQuickTestData: {},
  // getPositiveQuickTestLoading: false,
  // personalQuickTestHistoryList: [],
  // getPersonalQuickTestHistoryLoading: false,

};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_INFECTED_PATIENTS_REQUEST: {
      return {
        ...state,
        getInfectedPatientsLoading: true,
      };
    }
    case types.GET_INFECTED_PATIENTS_SUCCESS: {
      return {
        ...state,
        getInfectedPatientsLoading: false,
        infectedPatients: action.payload,
      };
    }
    case types.GET_INFECTED_PATIENTS_FAILURE: {
      return {
        ...state,
        getInfectedPatientsLoading: false,
      };
    }
    case types.GET_INFECTED_PATIENT_DETAIL_REQUEST: {
      return {
        ...state,
        getInfectedPatientDetailLoading: true,
      };
    }
    case types.GET_INFECTED_PATIENT_DETAIL_SUCCESS: {
      return {
        ...state,
        getInfectedPatientDetailLoading: false,
        infectedPatientDetail: action.payload,
      };
    }
    case types.GET_INFECTED_PATIENT_DETAIL_FAILURE: {
      return {
        ...state,
        getInfectedPatientDetailLoading: false,
      };
    }
    default: {
      return state;
    }
  }
}
