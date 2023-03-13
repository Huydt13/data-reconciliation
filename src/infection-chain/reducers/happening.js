import types, {
  GET_ALL_HAPPENINGS_REQUEST,
  GET_ALL_HAPPENINGS_SUCCESS,
  GET_ALL_HAPPENINGS_FAILURE,
  GET_HAPPENINGS_REQUEST,
  GET_HAPPENINGS_SUCCESS,
  GET_HAPPENINGS_FAILURE,
  CREATE_HAPPENING_REQUEST,
  CREATE_HAPPENING_SUCCESS,
  CREATE_HAPPENING_FAILURE,
  UPDATE_HAPPENING_REQUEST,
  UPDATE_HAPPENING_SUCCESS,
  UPDATE_HAPPENING_FAILURE,
  DELETE_HAPPENING_REQUEST,
  DELETE_HAPPENING_SUCCESS,
  DELETE_HAPPENING_FAILURE,
} from '../actions/types';

const INITIAL_STATE = {
  happeningList: [],
  getHappeningsLoading: false,
  allHappeningList: [],
  getAllHappeningsLoading: false,
  createHappeningLoading: false,
  updateHappeningLoading: false,
  deleteHappeningLoading: false,
  symptomList: [],
  getSymptomsLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_ALL_HAPPENINGS_REQUEST: {
      return {
        ...state,
        getAllHappeningsLoading: true,
      };
    }
    case GET_ALL_HAPPENINGS_SUCCESS: {
      return {
        ...state,
        getAllHappeningsLoading: false,
        allHappeningList: action.payload,
      };
    }
    case GET_ALL_HAPPENINGS_FAILURE: {
      return {
        ...state,
        getAllHappeningsLoading: false,
      };
    }
    case GET_HAPPENINGS_REQUEST: {
      return {
        ...state,
        getHappeningsLoading: true,
      };
    }
    case GET_HAPPENINGS_SUCCESS: {
      return {
        ...state,
        getHappeningsLoading: false,
        happeningList: action.payload,
      };
    }
    case GET_HAPPENINGS_FAILURE: {
      return {
        ...state,
        getHappeningsLoading: false,
      };
    }
    case CREATE_HAPPENING_REQUEST: {
      return {
        ...state,
        createHappeningLoading: true,
      };
    }
    case CREATE_HAPPENING_SUCCESS: {
      return {
        ...state,
        createHappeningLoading: false,
      };
    }
    case CREATE_HAPPENING_FAILURE: {
      return {
        ...state,
        createHappeningLoading: false,
      };
    }
    case UPDATE_HAPPENING_REQUEST: {
      return {
        ...state,
        updateHappeningLoading: true,
      };
    }
    case UPDATE_HAPPENING_SUCCESS: {
      return {
        ...state,
        updateHappeningLoading: false,
      };
    }
    case UPDATE_HAPPENING_FAILURE: {
      return {
        ...state,
        updateHappeningLoading: false,
      };
    }
    case DELETE_HAPPENING_REQUEST: {
      return {
        ...state,
        deleteHappeningLoading: true,
      };
    }
    case DELETE_HAPPENING_SUCCESS: {
      return {
        ...state,
        deleteHappeningLoading: false,
      };
    }
    case DELETE_HAPPENING_FAILURE: {
      return {
        ...state,
        deleteHappeningLoading: false,
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
        getSymptomsLoading: false,
        symptomList: action.payload,
      };
    }
    case types.GET_SYMPTOMS_FAILURE: {
      return {
        ...state,
        getSymptomsLoading: false,
      };
    }
    default: {
      return state;
    }
  }
}
