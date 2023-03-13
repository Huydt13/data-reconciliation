import types from 'quarantine-facilities/actions/types';

const INITIAL_STATE = {
  quarantineStatistic1Data: [],
  getQuarantineStatistic1Loading: false,
  quarantineStatistic2Data: [],
  getQuarantineStatistic2: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_QUARANTINE_STATISTIC_1_REQUEST: {
      return {
        ...state,
        getQuarantineStatistic1Loading: true,
      };
    }
    case types.GET_QUARANTINE_STATISTIC_1_SUCCESS: {
      return {
        ...state,
        quarantineStatistic1Data: action.payload,
        getQuarantineStatistic1Loading: false,
      };
    }
    case types.GET_QUARANTINE_STATISTIC_1_FAILURE: {
      return {
        ...state,
        getQuarantineStatistic1Loading: false,
      };
    }
    case types.GET_QUARANTINE_STATISTIC_2_REQUEST: {
      return {
        ...state,
        getQuarantineStatistic2Loading: true,
      };
    }
    case types.GET_QUARANTINE_STATISTIC_2_SUCCESS: {
      return {
        ...state,
        quarantineStatistic2Data: action.payload,
        getQuarantineStatistic2Loading: false,
      };
    }
    case types.GET_QUARANTINE_STATISTIC_2_FAILURE: {
      return {
        ...state,
        getQuarantineStatistic2Loading: false,
      };
    }
    default: {
      return state;
    }
  }
}
