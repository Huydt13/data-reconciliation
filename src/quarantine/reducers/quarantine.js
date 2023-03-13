import types from 'quarantine/actions/types';

const INITIAL_STATE = {
  selectedQuarantine: null,
  createModal: false,
  editModal: false,
  quarantineList: [],
  getQuarantineLoading: false,
  quarantineData: {},
  getQuarantinesLoading: false,
  createQuarantineLoading: false,
  updateQuarantineLoading: false,
  deleteQuarantineLoading: false,
  zoneList: [],
  selectedZone: null,
  openZoneDetail: false,
  getZonesLoading: false,
  createZoneLoading: false,
  updateZoneLoading: false,
  deleteZoneLoading: false,
  roomList: [],
  getRoomsLoading: false,
  createRoomLoading: false,
  updateRoomLoading: false,
  deleteRoomLoading: false,
  moveQuarantineLoading: false,
  completeQuarantineLoading: false,
  extendDurationLoading: false,
  getAvailableRoomsLoading: false,
  openWaitingSubject: false,
  openRoomDetail: false,
  selectedRoom: null,
  getWaitingListLoading: false,
  waitingList: [],
  availableRoomsList: [],
  subjectsInRoom: [],
  getSubjectsInRoomLoading: false,
  editHistoryLoading: false,
  getAllZonesLoading: false,
  allZonesData: {},
  getQuarantineSubjectsLoading: false,
  quarantineSubjectList: [],
  getQuarantineWaitingSubjectsLoading: false,
  quarantineWaitingSubjectList: [],
  createProfileFromQuarantineLoading: false,
  getCompletedSubjectsLoading: false,
  completedSubjectData: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SELECT_QUARANTINE: {
      return {
        ...state,
        selectedQuarantine: action.payload,
      };
    }
    case types.TOGGLE_CREATE_MODAL: {
      return {
        ...state,
        createModal: !state.createModal,
      };
    }
    case types.TOGGLE_EDIT_MODAL: {
      return {
        ...state,
        editModal: !state.editModal,
      };
    }
    case types.GET_QUARANTINE_REQUEST: {
      return {
        ...state,
        getQuarantineLoading: true,
      };
    }
    case types.GET_QUARANTINE_SUCCESS: {
      return {
        ...state,
        getQuarantineLoading: false,
        quarantineList: action.payload,
      };
    }
    case types.GET_QUARANTINE_FAILURE: {
      return {
        ...state,
        getQuarantineLoading: false,
      };
    }
    case types.GET_QUARANTINE_SUBJECTS_REQUEST: {
      return {
        ...state,
        getQuarantineSubjectsLoading: true,
      };
    }
    case types.GET_QUARANTINE_SUBJECTS_SUCCESS: {
      return {
        ...state,
        getQuarantineSubjectsLoading: false,
        quarantineSubjectList: action.payload,
      };
    }
    case types.GET_QUARANTINE_SUBJECTS_FAILURE: {
      return {
        ...state,
        getQuarantineSubjectsLoading: false,
      };
    }
    case types.GET_QUARANTINE_WAITING_SUBJECTS_REQUEST: {
      return {
        ...state,
        getQuarantineWaitingSubjectsLoading: true,
      };
    }
    case types.GET_QUARANTINE_WAITING_SUBJECTS_SUCCESS: {
      return {
        ...state,
        getQuarantineWaitingSubjectsLoading: false,
        quarantineWaitingSubjectList: action.payload,
      };
    }
    case types.GET_QUARANTINE_WAITING_SUBJECTS_FAILURE: {
      return {
        ...state,
        getQuarantineWaitingSubjectsLoading: false,
      };
    }
    case types.GET_QUARANTINES_REQUEST: {
      return {
        ...state,
        getQuarantinesLoading: true,
      };
    }
    case types.GET_QUARANTINES_SUCCESS: {
      return {
        ...state,
        getQuarantinesLoading: false,
        quarantineData: action.payload,
      };
    }
    case types.GET_QUARANTINES_FAILURE: {
      return {
        ...state,
        getQuarantinesLoading: false,
      };
    }
    case types.GET_ALL_QUARANTINE_ZONES_REQUEST: {
      return {
        ...state,
        getAllZonesLoading: true,
      };
    }
    case types.GET_ALL_QUARANTINE_ZONES_SUCCESS: {
      return {
        ...state,
        getAllZonesLoading: false,
        allZonesData: action.payload,
      };
    }
    case types.GET_ALL_QUARANTINE_ZONES_FAILURE: {
      return {
        ...state,
        getAllZonesLoading: false,
      };
    }
    case types.CREATE_QUARANTINE_REQUEST: {
      return {
        ...state,
        createQuarantineLoading: true,
      };
    }
    case types.CREATE_QUARANTINE_SUCCESS: {
      return {
        ...state,
        createQuarantineLoading: false,
      };
    }
    case types.CREATE_QUARANTINE_FAILURE: {
      return {
        ...state,
        createQuarantineLoading: false,
      };
    }
    case types.UPDATE_QUARANTINE_REQUEST: {
      return {
        ...state,
        updateQuarantineLoading: true,
      };
    }
    case types.UPDATE_QUARANTINE_SUCCESS: {
      return {
        ...state,
        updateQuarantineLoading: false,
      };
    }
    case types.UPDATE_QUARANTINE_FAILURE: {
      return {
        ...state,
        updateQuarantineLoading: false,
      };
    }
    case types.DELETE_QUARANTINE_REQUEST: {
      return {
        ...state,
        deleteQuarantineLoading: true,
      };
    }
    case types.DELETE_QUARANTINE_SUCCESS: {
      return {
        ...state,
        deleteQuarantineLoading: false,
      };
    }
    case types.DELETE_QUARANTINE_FAILURE: {
      return {
        ...state,
        deleteQuarantineLoading: false,
      };
    }
    case types.SELECT_ZONE: {
      return {
        ...state,
        selectedZone: action.payload,
      };
    }
    case types.OPEN_ZONE_DETAIL: {
      return {
        ...state,
        openZoneDetail: action.payload,
      };
    }
    case types.SELECT_ROOM: {
      return {
        ...state,
        selectedRoom: action.payload,
      };
    }
    case types.OPEN_ROOM_DETAIL: {
      return {
        ...state,
        openRoomDetail: action.payload,
      };
    }
    case types.OPEN_WAITING_SUBJECT: {
      return {
        ...state,
        openWaitingSubject: action.payload,
      };
    }
    case types.GET_ZONES_REQUEST: {
      return {
        ...state,
        getZonesLoading: true,
      };
    }
    case types.GET_ZONES_SUCCESS: {
      return {
        ...state,
        getZonesLoading: false,
        zoneList: action.payload,
      };
    }
    case types.GET_ZONES_FAILURE: {
      return {
        ...state,
        getZonesLoading: false,
      };
    }
    case types.CREATE_ZONE_REQUEST: {
      return {
        ...state,
        createZoneLoading: true,
      };
    }
    case types.CREATE_ZONE_SUCCESS: {
      return {
        ...state,
        createZoneLoading: false,
      };
    }
    case types.CREATE_ZONE_FAILURE: {
      return {
        ...state,
        createZoneLoading: false,
      };
    }
    case types.UPDATE_ZONE_REQUEST: {
      return {
        ...state,
        updateZoneLoading: true,
      };
    }
    case types.UPDATE_ZONE_SUCCESS: {
      return {
        ...state,
        updateZoneLoading: false,
      };
    }
    case types.UPDATE_ZONE_FAILURE: {
      return {
        ...state,
        updateZoneLoading: false,
      };
    }
    case types.DELETE_ZONE_REQUEST: {
      return {
        ...state,
        deleteZoneLoading: true,
      };
    }
    case types.DELETE_ZONE_SUCCESS: {
      return {
        ...state,
        deleteZoneLoading: false,
      };
    }
    case types.DELETE_ZONE_FAILURE: {
      return {
        ...state,
        deleteZoneLoading: false,
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
        roomList: action.payload,
      };
    }
    case types.GET_ROOMS_FAILURE: {
      return {
        ...state,
        getRoomsLoading: false,
      };
    }
    case types.CREATE_ROOM_REQUEST: {
      return {
        ...state,
        createRoomLoading: true,
      };
    }
    case types.CREATE_ROOM_SUCCESS: {
      return {
        ...state,
        createRoomLoading: false,
      };
    }
    case types.CREATE_ROOM_FAILURE: {
      return {
        ...state,
        createRoomLoading: false,
      };
    }
    case types.UPDATE_ROOM_REQUEST: {
      return {
        ...state,
        updateRoomLoading: true,
      };
    }
    case types.UPDATE_ROOM_SUCCESS: {
      return {
        ...state,
        updateRoomLoading: false,
      };
    }
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
    case types.DELETE_ROOM_SUCCESS: {
      return {
        ...state,
        deleteRoomLoading: false,
      };
    }
    case types.DELETE_ROOM_FAILURE: {
      return {
        ...state,
        deleteRoomLoading: false,
      };
    }
    case types.MOVE_QUARANTINE_REQUEST: {
      return {
        ...state,
        moveQuarantineLoading: true,
      };
    }
    case types.MOVE_QUARANTINE_SUCCESS: {
      return {
        ...state,
        moveQuarantineLoading: false,
      };
    }
    case types.MOVE_QUARANTINE_FAILURE: {
      return {
        ...state,
        moveQuarantineLoading: false,
      };
    }
    case types.MOVE_ROOM_REQUEST: {
      return {
        ...state,
        moveRoomLoading: true,
      };
    }
    case types.MOVE_ROOM_SUCCESS:
    case types.MOVE_ROOM_FAILURE: {
      return {
        ...state,
        moveRoomLoading: false,
      };
    }
    case types.COMPLETE_QUARANTINE_REQUEST: {
      return {
        ...state,
        completeQuarantineLoading: true,
      };
    }
    case types.COMPLETE_QUARANTINE_SUCCESS: {
      return {
        ...state,
        completeQuarantineLoading: false,
      };
    }
    case types.COMPLETE_QUARANTINE_FAILURE: {
      return {
        ...state,
        completeQuarantineLoading: false,
      };
    }
    case types.EXTEND_DURATION_REQUEST: {
      return {
        ...state,
        extendDurationLoading: true,
      };
    }
    case types.EXTEND_DURATION_SUCCESS: {
      return {
        ...state,
        extendDurationLoading: false,
      };
    }
    case types.EXTEND_DURATION_FAILURE: {
      return {
        ...state,
        extendDurationLoading: false,
      };
    }
    case types.EDIT_HISTORY_REQUEST: {
      return {
        ...state,
        editHistoryLoading: true,
      };
    }
    case types.EDIT_HISTORY_SUCCESS:
    case types.EDIT_HISTORY_FAILURE: {
      return {
        ...state,
        editHistoryLoading: false,
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
        availableRoomsList: action.payload,
      };
    }
    case types.GET_AVAILABLE_ROOMS_FAILURE: {
      return {
        ...state,
        getAvailableRoomsLoading: false,
      };
    }
    // case types.GET_WAITING_LIST_REQUEST: {
    //   return {
    //     ...state,
    //     getWaitingListLoading: true,
    //   };
    // }
    // case types.GET_WAITING_LIST_SUCCESS: {
    //   return {
    //     ...state,
    //     getWaitingListLoading: false,
    //     waitingList: action.payload,
    //   };
    // }
    case types.GET_WAITING_LIST_FAILURE: {
      return {
        ...state,
        getWaitingListLoading: false,
      };
    }
    case types.GET_SUBJECT_IN_ROOM_REQUEST: {
      return {
        ...state,
        getSubjectsInRoomLoading: true,
      };
    }
    case types.GET_SUBJECT_IN_ROOM_SUCCESS: {
      return {
        ...state,
        getSubjectsInRoomLoading: false,
        subjectsInRoom: action.payload,
      };
    }
    case types.GET_SUBJECT_IN_ROOM_FAILURE: {
      return {
        ...state,
        getSubjectsInRoomLoading: false,
      };
    }
    case types.GET_COMPLETED_SUBJECTS_REQUEST: {
      return {
        ...state,
        getCompletedSubjectsLoading: true,
      };
    }
    case types.GET_COMPLETED_SUBJECTS_SUCCESS: {
      return {
        ...state,
        getCompletedSubjectsLoading: false,
        completedSubjectData: action.payload,
      };
    }
    case types.GET_COMPLETED_SUBJECTS_FAILURE: {
      return {
        ...state,
        getCompletedSubjectsLoading: false,
      };
    }
    case types.CREATE_PROFILE_FROM_QUARANTINE_REQUEST: {
      return {
        ...state,
        createProfileFromQuarantineLoading: true,
      };
    }
    case types.CREATE_PROFILE_FROM_QUARANTINE_SUCCESS:
    case types.CREATE_PROFILE_FROM_QUARANTINE_FAILURE: {
      return {
        ...state,
        createProfileFromQuarantineLoading: false,
      };
    }
    default: {
      return state;
    }
  }
}
