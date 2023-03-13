import types from 'contact/actions/types';

const defaultPaging = {
  totalPages: 0,
  data: [],
};

const INITIAL_STATE = {
  selectedEstate: undefined,
  selectedAirplane: undefined,
  selectedLocation: undefined,
  locationVisitorsData: defaultPaging,
  getLocationVisitorsLoading: false,
  addLocationVisitorsLoading: false,
  removeLocationVisitorLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SELECT_ESTATE:
      return {
        ...state,
        selectedEstate: action.payload,
      };
    case types.SELECT_AIRPLANE:
      return {
        ...state,
        selectedAirplane: action.payload,
      };
    case types.SELECT_VEHICLE:
      return {
        ...state,
        selectedLocation: action.payload,
      };
    case types.GET_LOCATION_VISITORS_REQUEST:
      return {
        ...state,
        getLocationVisitorsLoading: true,
      };
    case types.GET_LOCATION_VISITORS_SUCCESS:
      return {
        ...state,
        locationVisitorsData: action.payload,
        getLocationVisitorsLoading: false,
      };
    case types.GET_LOCATION_VISITORS_FAILURE:
      return {
        ...state,
        getLocationVisitorsLoading: false,
      };
    case types.ADD_LOCATION_VISITORS_REQUEST:
      return {
        ...state,
        addLocationVisitorsLoading: true,
      };
    case types.ADD_LOCATION_VISITORS_SUCCESS:
    case types.ADD_LOCATION_VISITORS_FAILURE:
      return {
        ...state,
        addLocationVisitorsLoading: false,
      };
    case types.REMOVE_LOCATION_VISITOR_REQUEST:
      return {
        ...state,
        removeLocationVisitorLoading: true,
      };
    case types.REMOVE_LOCATION_VISITOR_SUCCESS:
    case types.REMOVE_LOCATION_VISITOR_FAILURE:
      return {
        ...state,
        removeLocationVisitorLoading: false,
      };
    case types.GET_PROFILE_LIST_REQUEST:
      return {
        ...state,
        getProfileListLoading: true,
      };
    case types.GET_PROFILE_LIST_SUCCESS:
    case types.GET_PROFILE_LIST_FAILURE:
      return {
        ...state,
        getProfileListLoading: false,
      };
    default:
      return state;
  }
};
