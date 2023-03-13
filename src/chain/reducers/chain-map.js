import types from 'chain/actions/types';

const INITIAL_STATE = {
  chainMap: undefined,
  getChainMapLoading: false,
  chainMapDetail: undefined,
  getChainMapDetailLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_CHAIN_MAP_BY_ID_REQUEST:
      return {
        ...state,
        getChainMapDetailLoading: true,
      };
    case types.GET_CHAIN_MAP_BY_ID_SUCCESS:
      return {
        ...state,
        chainMapDetail: action.payload,
        getChainMapDetailLoading: false,
      };
    case types.GET_CHAIN_MAP_BY_ID_FAILURE:
      return {
        ...state,
        getChainMapDetailLoading: false,
      };
    case types.GET_CHAIN_MAP_REQUEST:
      return {
        ...state,
        getChainMapLoading: true,
      };
    case types.GET_CHAIN_MAP_SUCCESS:
      return {
        ...state,
        chainMap: action.payload,
        getChainMapLoading: false,
      };
    case types.GET_CHAIN_MAP_FAILURE:
      return {
        ...state,
        getChainMapLoading: false,
      };
    default:
      return state;
  }
}
