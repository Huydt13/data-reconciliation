import types from 'contact/actions/types';

const INITIAL_STATE = {
  contactLocationList: [],
  loadingGetContactLocation: false,
  loadingCreateContactLocation: false,
  loadingUpdateContactLocation: false,
  loadingDeleteContactLocation: false,

  contactVehicleList: [],
  loadingGetContactVehicle: false,
  loadingCreateContactVehicle: false,
  loadingUpdateContactVehicle: false,
  loadingDeleteContactVehicle: false,

  criteriaList: [],
  criteriaListByInfectionType: [],
  loadingGetCriteria: false,

  fromAskingData: {},
  toAskingData: {},
  loadingGetFromAsking: false,
  loadingGetToAsking: false,
  loadingUpdateAsking: false,

  askingResult: {},
  loadingGetAskingResult: false,

  searchContactLocationList: [],
  getSearchContactLocationLoading: false,
  searchAirplaneList: [],
  getSearchAirplaneLoading: false,
  searchOtherVehicleList: [],
  getSearchOtherVehicleLoading: false,
  outbreakLocationList: [],
  getOutbreakLocationLoading: false,
  updateEstateLoading: false,

  createLocationLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_CONTACT_LOCATIONS_REQUEST:
      return {
        ...state,
        loadingGetContactLocation: true,
      };
    case types.GET_CONTACT_LOCATIONS_SUCCESS:
      return {
        ...state,
        contactLocationList: action.payload,
        loadingGetContactLocation: false,
      };
    case types.GET_CONTACT_LOCATIONS_FAILURE:
      return {
        ...state,
        loadingGetContactLocation: false,
      };
    case types.CREATE_CONTACT_LOCATION_REQUEST:
      return {
        ...state,
        loadingCreateContactLocation: true,
      };
    case types.CREATE_CONTACT_LOCATION_SUCCESS:
    case types.CREATE_CONTACT_LOCATION_FAILURE:
      return {
        ...state,
        loadingCreateContactLocation: false,
      };
    case types.UPDATE_CONTACT_LOCATION_REQUEST:
      return {
        ...state,
        loadingUpdateContactLocation: true,
      };
    case types.UPDATE_CONTACT_LOCATION_SUCCESS:
    case types.UPDATE_CONTACT_LOCATION_FAILURE:
      return {
        ...state,
        loadingUpdateContactLocation: false,
      };
    case types.DELETE_CONTACT_LOCATION_REQUEST:
      return {
        ...state,
        loadingDeleteContactLocation: true,
      };
    case types.DELETE_CONTACT_LOCATION_SUCCESS:
    case types.DELETE_CONTACT_LOCATION_FAILURE:
      return {
        ...state,
        loadingDeleteContactLocation: false,
      };

    case types.GET_CONTACT_VEHICLES_REQUEST:
      return {
        ...state,
        loadingGetContactVehicle: true,
      };
    case types.GET_CONTACT_VEHICLES_SUCCESS:
      return {
        ...state,
        contactVehicleList: action.payload,
        loadingGetContactVehicle: false,
      };
    case types.GET_CONTACT_VEHICLES_FAILURE:
      return {
        ...state,
        loadingGetContactVehicle: false,
      };
    case types.GET_ASKING_RESULT_REQUEST:
      return {
        ...state,
        loadingGetAskingResult: true,
      };
    case types.GET_ASKING_RESULT_SUCCESS:
      return {
        ...state,
        askingResult: action.payload,
        loadingGetAskingResult: false,
      };
    case types.GET_ASKING_RESULT_FAILURE:
      return {
        ...state,
        loadingGetAskingResult: false,
      };
    case types.GET_CRITERIAS_REQUEST:
      return {
        ...state,
        loadingGetCriteria: true,
      };
    case types.GET_CRITERIAS_SUCCESS: {
      const response = action.payload;
      const criteriaList = [];
      response.forEach((element) => {
        const { criterias } = element;
        criterias.forEach((e) => {
          e.id = `${e.id}/${element.id}`;
        });
        criteriaList.push(...criterias);
      });
      return {
        ...state,
        criteriaList,
        loadingGetCriteria: false,
      };
    }
    case types.GET_CRITERIAS_FAILURE:
      return {
        ...state,
        loadingGetCriteria: false,
      };
    case types.GET_CRITERIAS_BY_INFECTION_TYPE_REQUEST:
      return {
        ...state,
        loadingGetCriteria: true,
      };
    case types.GET_CRITERIAS_BY_INFECTION_TYPE_SUCCESS: {
      const response = action.payload;
      const criteriaListByInfectionType = [];
      response.forEach((element) => {
        const { criterias } = element;
        criterias.forEach((e) => {
          e.id = `${e.id}/${element.id}`;
        });
        criteriaListByInfectionType.push(...criterias);
      });
      return {
        ...state,
        criteriaListByInfectionType,
        loadingGetCriteria: false,
      };
    }
    case types.GET_CRITERIAS_BY_INFECTION_TYPE_FAILURE:
      return {
        ...state,
        loadingGetCriteria: false,
      };
    case types.GET_ASKING_REQUEST: {
      const isAskingSubjectFrom = action.payload;
      return {
        ...state,
        loadingGetFromAsking: isAskingSubjectFrom
          ? true
          : state.loadingGetFromAsking,
        loadingGetToAsking: !isAskingSubjectFrom
          ? true
          : state.loadingGetToAsking,
        fromAskingData: isAskingSubjectFrom ? {} : state.fromAskingData,
        toAskingData: !isAskingSubjectFrom ? {} : state.toAskingData,
      };
    }
    case types.GET_ASKING_SUCCESS: {
      const { response, isAskingSubjectFrom } = action.payload;
      return {
        ...state,
        fromAskingData: isAskingSubjectFrom ? response : state.fromAskingData,
        toAskingData: !isAskingSubjectFrom ? response : state.toAskingData,
        loadingGetFromAsking: false,
        loadingGetToAsking: false,
      };
    }
    case types.GET_ASKING_FAILURE:
      return {
        ...state,
        loadingGetFromAsking: false,
        loadingGetToAsking: false,
      };
    case types.UPDATE_ASKING_REQUEST:
      return {
        ...state,
        loadingUpdateAsking: true,
      };
    case types.UPDATE_ASKING_SUCCESS:
    case types.UPDATE_ASKING_FAILURE:
      return {
        ...state,
        loadingUpdateAsking: false,
      };
    case types.CREATE_CONTACT_VEHICLE_REQUEST:
      return {
        ...state,
        loadingCreateContactVehicle: true,
      };
    case types.CREATE_CONTACT_VEHICLE_SUCCESS:
    case types.CREATE_CONTACT_VEHICLE_FAILURE:
      return {
        ...state,
        loadingCreateContactVehicle: false,
      };
    case types.UPDATE_CONTACT_VEHICLE_REQUEST:
      return {
        ...state,
        loadingUpdateContactVehicle: true,
      };
    case types.UPDATE_CONTACT_VEHICLE_SUCCESS:
    case types.UPDATE_CONTACT_VEHICLE_FAILURE:
      return {
        ...state,
        loadingUpdateContactVehicle: false,
      };
    case types.DELETE_CONTACT_VEHICLE_REQUEST:
      return {
        ...state,
        loadingDeleteContactVehicle: true,
      };
    case types.DELETE_CONTACT_VEHICLE_SUCCESS:
    case types.DELETE_CONTACT_VEHICLE_FAILURE:
      return {
        ...state,
        loadingDeleteContactVehicle: false,
      };
    case types.UPDATE_ESTATE_REQUEST:
      return {
        ...state,
        updateEstateLoading: true,
      };
    case types.UPDATE_ESTATE_SUCCESS:
    case types.UPDATE_ESTATE_FAILURE:
      return {
        ...state,
        updateEstateLoading: false,
      };
    case types.SEARCH_LOCATION_REQUEST:
      return {
        ...state,
        getSearchContactLocationLoading: true,
      };
    case types.SEARCH_LOCATION_SUCCESS:
      return {
        ...state,
        searchContactLocationList: action.payload,
        getSearchContactLocationLoading: false,
      };
    case types.SEARCH_LOCATION_FAILURE:
      return {
        ...state,
        getSearchContactLocationLoading: false,
      };
    case types.SEARCH_AIRPLANE_REQUEST:
      return {
        ...state,
        getSearchAirplaneLoading: true,
      };
    case types.SEARCH_AIRPLANE_SUCCESS:
      return {
        ...state,
        searchAirplaneList: action.payload,
        getSearchAirplaneLoading: false,
      };
    case types.SEARCH_AIRPLANE_FAILURE:
      return {
        ...state,
        getSearchAirplaneLoading: false,
      };
    case types.SEARCH_OTHER_VEHICLE_REQUEST:
      return {
        ...state,
        getSearchOtherVehicleLoading: true,
      };
    case types.SEARCH_OTHER_VEHICLE_SUCCESS:
      return {
        ...state,
        searchOtherVehicleList: action.payload,
        getSearchOtherVehicleLoading: false,
      };
    case types.SEARCH_OTHER_VEHICLE_FAILURE:
      return {
        ...state,
        getSearchOtherVehicleLoading: false,
      };
    case types.GET_OUTBREAK_LOCATION_REQUEST:
      return {
        ...state,
        getOutbreakLocationLoading: true,
      };
    case types.GET_OUTBREAK_LOCATION_SUCCESS:
      return {
        ...state,
        outbreakLocationList: action.payload,
        getOutbreakLocationLoading: false,
      };
    case types.GET_OUTBREAK_LOCATION_FAILURE:
      return {
        ...state,
        getOutbreakLocationLoading: false,
      };
    case types.CREATE_LOCATION_REQUEST:
      return {
        ...state,
        createLocationLoading: true,
      };
    case types.CREATE_LOCATION_SUCCESS:
    case types.CREATE_LOCATION_FAILURE:
      return {
        ...state,
        createLocationLoading: false,
      };
    case types.CLEAR_ASKING: {
      return {
        ...state,
        fromAskingData: {},
      };
    }
    default:
      return state;
  }
}
