import types from 'quarantine-facilities/actions/types';

const INITIAL_STATE = {
  selectedFacility: undefined,
  selectedRoom: undefined,
  facilityInfo: [],
  getFacilityInfoLoading: false,
  facilityData: {},
  getFacilitiesLoading: false,
  createFacilityLoading: false,
  updateFacilityLoading: false,
  deleteFacilityLoading: false,
  waitingListData: {},
  getWaitingListLoading: false,
  waitingListByFacilityData: {},
  getWaitingListByFacilityLoading: false,
  inHomeData: {},
  getInHomeLoading: false,
  inHomeByFacilityData: {},
  getInHomeByFacilityLoading: false,
  inQuarantineData: {},
  getInQuarantineLoading: false,
  inQuarantineByFacilityData: {},
  getInQuarantineByFacilityLoading: false,
  completedData: {},
  getCompletedLoading: false,
  completedByFacilityData: {},
  getCompletedByFacilityLoading: false,
  setManagerLoading: false,
  roomData: {},
  availableRoomData: {},
  getAvailableRoomsLoading: false,
  getRoomsLoading: false,
  createRoomsLoading: false,
  updateRoomLoading: false,
  deleteRoomLoading: false,
  toggleRoomStatusLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SELECT_FACILITY: {
      return {
        ...state,
        selectedFacility: action.payload,
      };
    }
    case types.SELECT_ROOM: {
      return {
        ...state,
        selectedRoom: action.payload,
      };
    }
    case types.GET_FACILITY_INFO_REQUEST: {
      return {
        ...state,
        getFacilityInfoLoading: true,
      };
    }
    case types.GET_FACILITY_INFO_SUCCESS: {
      return {
        ...state,
        getFacilityInfoLoading: false,
        facilityInfo: action.payload,
      };
    }
    case types.GET_FACILITY_INFO_FAILURE: {
      return {
        ...state,
        getFacilityInfoLoading: true,
      };
    }
    case types.GET_FACILITIES_REQUEST: {
      return {
        ...state,
        getFacilitiesLoading: true,
      };
    }
    case types.GET_FACILITIES_SUCCESS: {
      return {
        ...state,
        getFacilitiesLoading: false,
        facilityData: action.payload,
      };
    }
    case types.GET_FACILITIES_FAILURE: {
      return {
        ...state,
        getFacilitiesLoading: false,
      };
    }
    case types.CREATE_FACILITY_REQUEST: {
      return {
        ...state,
        createFacilityLoading: true,
      };
    }
    case types.CREATE_FACILITY_SUCCESS:
    case types.CREATE_FACILITY_FAILURE: {
      return {
        ...state,
        createFacilityLoading: false,
      };
    }
    case types.UPDATE_FACILITY_REQUEST: {
      return {
        ...state,
        updateFacilityLoading: true,
      };
    }
    case types.UPDATE_FACILITY_SUCCESS:
    case types.UPDATE_FACILITY_FAILURE: {
      return {
        ...state,
        updateFacilityLoading: false,
      };
    }
    case types.DELETE_FACILITY_REQUEST: {
      return {
        ...state,
        deleteFacilityLoading: true,
      };
    }
    case types.DELETE_FACILITY_SUCCESS:
    case types.DELETE_FACILITY_FAILURE: {
      return {
        ...state,
        deleteFacilityLoading: false,
      };
    }
    case types.GET_ROOMS_REQUEST: {
      return {
        ...state,
        getRoomsLoading: true,
      };
    }
    case types.GET_ROOMS_SUCCESS: {
      return {
        ...state,
        getRoomsLoading: false,
        roomData: action.payload,
      };
    }
    case types.GET_ROOMS_FAILURE: {
      return {
        ...state,
        getRoomsLoading: false,
      };
    }
    case types.GET_AVAILABLE_ROOMS_REQUEST: {
      return {
        ...state,
        getAvailableRoomsLoading: true,
      };
    }
    case types.GET_AVAILABLE_ROOMS_SUCCESS: {
      return {
        ...state,
        getAvailableRoomsLoading: false,
        availableRoomData: action.payload,
      };
    }
    case types.GET_AVAILABLE_ROOMS_FAILURE: {
      return {
        ...state,
        getAvailableRoomsLoading: false,
      };
    }
    case types.CREATE_ROOMS_REQUEST: {
      return {
        ...state,
        createRoomsLoading: true,
      };
    }
    case types.CREATE_ROOMS_SUCCESS:
    case types.CREATE_ROOMS_FAILURE: {
      return {
        ...state,
        createRoomsLoading: false,
      };
    }
    case types.UPDATE_ROOM_REQUEST: {
      return {
        ...state,
        updateRoomLoading: true,
      };
    }
    case types.UPDATE_ROOM_SUCCESS:
    case types.UPDATE_ROOM_FAILURE: {
      return {
        ...state,
        updateRoomLoading: false,
      };
    }
    case types.DELETE_ROOM_REQUEST: {
      return {
        ...state,
        deleteRoomLoading: true,
      };
    }
    case types.DELETE_ROOM_SUCCESS:
    case types.DELETE_ROOM_FAILURE: {
      return {
        ...state,
        deleteRoomLoading: false,
      };
    }
    case types.GET_WAITING_LIST_REQUEST: {
      return {
        ...state,
        getWaitingListLoading: true,
      };
    }
    case types.GET_WAITING_LIST_SUCCESS: {
      return {
        ...state,
        waitingListData: action.payload,
        getWaitingListLoading: false,
      };
    }
    case types.GET_WAITING_LIST_FAILURE: {
      return {
        ...state,
        getWaitingListLoading: false,
      };
    }
    case types.GET_WAITING_LIST_BY_FACILITY_REQUEST: {
      return {
        ...state,
        getWaitingListByFacilityLoading: true,
      };
    }
    case types.GET_WAITING_LIST_BY_FACILITY_SUCCESS: {
      return {
        ...state,
        waitingListByFacilityData: action.payload,
        getWaitingListByFacilityLoading: false,
      };
    }
    case types.GET_WAITING_LIST_BY_FACILITY_FAILURE: {
      return {
        ...state,
        getWaitingListByFacilityLoading: false,
      };
    }
    case types.GET_IN_QUARANTINE_REQUEST: {
      return {
        ...state,
        getInQuarantineLoading: true,
      };
    }
    case types.GET_IN_QUARANTINE_SUCCESS: {
      return {
        ...state,
        inQuarantineData: action.payload,
        getInQuarantineLoading: false,
      };
    }
    case types.GET_IN_QUARANTINE_FAILURE: {
      return {
        ...state,
        getInQuarantineLoading: false,
      };
    }
    case types.GET_IN_QUARANTINE_BY_FACILITY_REQUEST: {
      return {
        ...state,
        getInQuarantineByFacilityLoading: true,
      };
    }
    case types.GET_IN_QUARANTINE_BY_FACILITY_SUCCESS: {
      return {
        ...state,
        inQuarantineByFacilityData: action.payload,
        getInQuarantineByFacilityLoading: false,
      };
    }
    case types.GET_IN_QUARANTINE_BY_FACILITY_FAILURE: {
      return {
        ...state,
        getInQuarantineByFacilityLoading: false,
      };
    }
    case types.GET_IN_HOME_REQUEST: {
      return {
        ...state,
        getInHomeLoading: true,
      };
    }
    case types.GET_IN_HOME_SUCCESS: {
      return {
        ...state,
        inHomeData: action.payload,
        getInHomeLoading: false,
      };
    }
    case types.GET_IN_HOME_FAILURE: {
      return {
        ...state,
        getInHomeLoading: false,
      };
    }
    case types.GET_IN_HOME_BY_FACILITY_REQUEST: {
      return {
        ...state,
        getInHomeByFacilityLoading: true,
      };
    }
    case types.GET_IN_HOME_BY_FACILITY_SUCCESS: {
      return {
        ...state,
        inHomeByFacilityData: action.payload,
        getInHomeByFacilityLoading: false,
      };
    }
    case types.GET_IN_HOME_BY_FACILITY_FAILURE: {
      return {
        ...state,
        getInHomeByFacilityLoading: false,
      };
    }
    case types.GET_COMPLETED_REQUEST: {
      return {
        ...state,
        getCompletedLoading: true,
      };
    }
    case types.GET_COMPLETED_SUCCESS: {
      return {
        ...state,
        completedData: action.payload,
        getCompletedLoading: false,
      };
    }
    case types.GET_COMPLETED_FAILURE: {
      return {
        ...state,
        getCompletedLoading: false,
      };
    }
    case types.GET_COMPLETED_BY_FACILITY_REQUEST: {
      return {
        ...state,
        getCompletedByFacilityLoading: true,
      };
    }
    case types.GET_COMPLETED_BY_FACILITY_SUCCESS: {
      return {
        ...state,
        completedByFacilityData: action.payload,
        getCompletedByFacilityLoading: false,
      };
    }
    case types.GET_COMPLETED_BY_FACILITY_FAILURE: {
      return {
        ...state,
        getCompletedByFacilityLoading: false,
      };
    }
    case types.SET_MANAGER_REQUEST: {
      return {
        ...state,
        setManagerLoading: true,
      };
    }
    case types.SET_MANAGER_SUCCESS:
    case types.SET_MANAGER_FAILURE: {
      return {
        ...state,
        setManagerLoading: false,
      };
    }
    case types.TOGGLE_ROOM_STATUS_REQUEST: {
      return {
        ...state,
        toggleRoomStatusLoading: true,
      };
    }
    case types.TOGGLE_ROOM_STATUS_SUCCESS:
    case types.TOGGLE_ROOM_STATUS_FAILURE: {
      return {
        ...state,
        toggleRoomStatusLoading: false,
      };
    }
    default: {
      return state;
    }
  }
}
