import types from 'chain/actions/types';

const defaultPaging = {
  totalPages: 0,
  data: [],
};
const INITIAL_STATE = {
  selectedChain: undefined,
  selectedContact: undefined,
  getChainsLoading: false,
  chainData: defaultPaging,
  getChainDetailLoading: false,
  chainDetail: {},
  getContactsByChainLoading: false,
  contactsByChainData: defaultPaging,
  getContactsBySubjectLoading: false,
  contactsBySubjectData: defaultPaging,
  createChainLoading: false,
  updateChainLoading: false,
  deleteChainLoading: false,
  addContactLoading: false,
  getContactsLoading: false,
  contactData: defaultPaging,
  addSubjectsLoading: false,
  createContactLoading: false,
  subjectDetail: {},
  getSubjectDetailLoading: false,
  updateInvestigationLoading: false,
  contactFromData: defaultPaging,
  checkingList: [],
  checkPositiveLoading: false,
  concludeContactLoading: false,
  chainMap: undefined,
  chainMapDetail: undefined,
  chainMapWithLocations: undefined,
  chainMapDetailWithLocations: undefined,
  getChainMapsLoading: false,
  getChainMapDetailLoading: false,
  getChainMapsWithLocationLoading: false,
  getChainMapDetailWithLocationsLoading: false,
  chainSubjectsData: defaultPaging,
  getChainSubjectsLoading: false,
  exportContactsByChainLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SELECT_CHAIN:
      return {
        ...state,
        selectedChain: action.payload,
      };
    case types.SELECT_CONTACT:
      return {
        ...state,
        selectedContact: action.payload,
      };
    case types.GET_CHAINS_REQUEST:
      return {
        ...state,
        getChainsLoading: true,
      };
    case types.GET_CHAINS_SUCCESS:
      return {
        ...state,
        chainData: action.payload,
        getChainsLoading: false,
      };
    case types.GET_CHAINS_FAILURE:
      return {
        ...state,
        getChainsLoading: false,
      };
    case types.GET_CHAIN_DETAIL_REQUEST:
      return {
        ...state,
        getChainDetailLoading: true,
      };
    case types.GET_CHAIN_DETAIL_SUCCESS:
      return {
        ...state,
        chainDetail: action.payload,
        getChainDetailLoading: false,
      };
    case types.GET_CHAIN_DETAIL_FAILURE:
      return {
        ...state,
        getChainDetailLoading: false,
      };
    case types.CREATE_CHAIN_REQUEST:
      return {
        ...state,
        createChainLoading: true,
      };
    case types.CREATE_CHAIN_SUCCESS:
    case types.CREATE_CHAIN_FAILURE:
      return {
        ...state,
        createChainLoading: false,
      };
    // case types.CREATE_CONTACT_ON_CHAIN_REQUEST:
    //   return {
    //     ...state,
    //     createContactLoading: true,
    //   };
    // case types.CREATE_CONTACT_ON_CHAIN_SUCCESS:
    // case types.CREATE_CONTACT_ON_CHAIN_FAILURE:
    //   return {
    //     ...state,
    //     createContactLoading: false,
    //   };
    case types.UPDATE_CHAIN_REQUEST:
      return {
        ...state,
        updateChainLoading: true,
      };
    case types.UPDATE_CHAIN_SUCCESS:
    case types.UPDATE_CHAIN_FAILURE:
      return {
        ...state,
        updateChainLoading: false,
      };
    case types.DELETE_CHAIN_REQUEST:
      return {
        ...state,
        deleteChainLoading: true,
      };
    case types.DELETE_CHAIN_SUCCESS:
    case types.DELETE_CHAIN_FAILURE:
      return {
        ...state,
        deleteChainLoading: false,
      };
    case types.ADD_SUBJECTS_REQUEST:
      return {
        ...state,
        addSubjectsLoading: true,
      };
    case types.ADD_SUBJECTS_SUCCESS:
    case types.ADD_SUBJECTS_FAILURE:
      return {
        ...state,
        addSubjectsLoading: false,
      };
    case types.ADD_CONTACT_REQUEST:
      return {
        ...state,
        addContactLoading: true,
      };
    case types.ADD_CONTACT_SUCCESS:
    case types.ADD_CONTACT_FAILURE:
      return {
        ...state,
        addContactLoading: false,
      };
    case types.UPDATE_INVESTIGATION_REQUEST:
      return {
        ...state,
        updateInvestigationLoading: true,
      };
    case types.UPDATE_INVESTIGATION_SUCCESS:
    case types.UPDATE_INVESTIGATION_FAILURE:
      return {
        ...state,
        updateInvestigationLoading: false,
      };
    case types.CONCLUDE_CONTACT_REQUEST:
      return {
        ...state,
        concludeContactLoading: true,
      };
    case types.CONCLUDE_CONTACT_SUCCESS:
    case types.CONCLUDE_CONTACT_FAILURE:
      return {
        ...state,
        concludeContactLoading: false,
      };
    case types.GET_CONTACTS_REQUEST:
      return {
        ...state,
        getContactsLoading: true,
      };
    case types.GET_CONTACTS_SUCCESS:
      return {
        ...state,
        chainData: action.payload,
        getContactsLoading: false,
      };
    case types.GET_CONTACTS_FAILURE:
      return {
        ...state,
        getContactsLoading: false,
      };
    case types.GET_CONTACTS_BY_CHAIN_REQUEST:
      return {
        ...state,
        getContactsByChainLoading: true,
      };
    case types.GET_CONTACTS_BY_CHAIN_SUCCESS:
      return {
        ...state,
        contactsByChainData: action.payload,
        getContactsByChainLoading: false,
      };
    case types.GET_CONTACTS_BY_CHAIN_FAILURE:
      return {
        ...state,
        getContactsByChainLoading: false,
      };
    case types.GET_CONTACTS_BY_SUBJECT_REQUEST:
      return {
        ...state,
        getContactsBySubjectLoading: true,
      };
    case types.GET_CONTACTS_BY_SUBJECT_SUCCESS: {
      const { isFromContact, data } = action.payload;
      return {
        ...state,
        contactFromData: isFromContact ? data : state.contactFromData,
        contactData: !isFromContact ? data : state.contactData,
        getContactsBySubjectLoading: false,
      };
    }
    case types.GET_CONTACTS_BY_SUBJECT_FAILURE:
      return {
        ...state,
        getContactsBySubjectLoading: false,
      };
    case types.GET_SUBJECT_DETAIL_REQUEST:
      return {
        ...state,
        getSubjectDetailLoading: true,
      };
    case types.GET_SUBJECT_DETAIL_SUCCESS:
      return {
        ...state,
        subjectDetail: action.payload,
        getSubjectDetailLoading: false,
      };
    case types.GET_SUBJECT_DETAIL_FAILURE:
      return {
        ...state,
        getSubjectDetailLoading: false,
      };
    case types.CHECK_POSITIVE_REQUEST:
      return {
        ...state,
        checkPositiveLoading: true,
      };
    case types.CHECK_POSITIVE_SUCCESS:
      return {
        ...state,
        checkingList: action.payload,
        checkPositiveLoading: false,
      };
    case types.CHECK_POSITIVE_FAILURE:
      return {
        ...state,
        checkPositiveLoading: false,
      };
    case types.GET_CHAIN_MAPS_REQUEST:
      return {
        ...state,
        getChainMapsLoading: true,
      };
    case types.GET_CHAIN_MAPS_SUCCESS:
      return {
        ...state,
        chainMap: action.payload,
        getChainMapsLoading: false,
      };
    case types.GET_CHAIN_MAPS_FAILURE:
      return {
        ...state,
        getChainMapsLoading: false,
      };
    case types.GET_CHAIN_MAP_DETAIL_REQUEST:
      return {
        ...state,
        getChainMapDetailLoading: true,
      };
    case types.GET_CHAIN_MAP_DETAIL_SUCCESS:
      return {
        ...state,
        chainMapDetail: action.payload,
        getChainMapDetailLoading: false,
      };
    case types.GET_CHAIN_MAP_DETAIL_FAILURE:
      return {
        ...state,
        getChainMapDetailLoading: false,
      };
    case types.GET_CHAIN_MAPS_WITH_LOCATIONS_REQUEST:
      return {
        ...state,
        getChainMapsWithLocationLoading: true,
      };
    case types.GET_CHAIN_MAPS_WITH_LOCATIONS_SUCCESS:
      return {
        ...state,
        chainMapWithLocations: action.payload,
        getChainMapsWithLocationLoading: false,
      };
    case types.GET_CHAIN_MAPS_WITH_LOCATIONS_FAILURE:
      return {
        ...state,
        getChainMapsWithLocationLoading: false,
      };
    case types.GET_CHAIN_MAP_DETAIL_WITH_LOCATIONS_REQUEST:
      return {
        ...state,
        getChainMapDetailWithLocationsLoading: true,
      };
    case types.GET_CHAIN_MAP_DETAIL_WITH_LOCATIONS_SUCCESS:
      return {
        ...state,
        chainMapDetailWithLocations: action.payload,
        getChainMapDetailWithLocationsLoading: false,
      };
    case types.GET_CHAIN_MAP_DETAIL_WITH_LOCATIONS_FAILURE:
      return {
        ...state,
        getChainMapDetailWithLocationsLoading: false,
      };
    case types.GET_CHAIN_SUBJECTS_REQUEST:
      return {
        ...state,
        getChainSubjectsLoading: true,
      };
    case types.GET_CHAIN_SUBJECTS_SUCCESS:
      return {
        ...state,
        chainSubjectsData: action.payload,
        getChainSubjectsLoading: false,
      };
    case types.GET_CHAIN_SUBJECTS_FAILURE:
      return {
        ...state,
        getChainSubjectsLoading: false,
      };
    case types.EXPORT_CONTACTS_BY_CHAIN_REQUEST:
      return {
        ...state,
        exportContactsByChainLoading: true,
      };
    case types.EXPORT_CONTACTS_BY_CHAIN_SUCCESS:
    case types.EXPORT_CONTACTS_BY_CHAIN_FAILURE:
      return {
        ...state,
        exportContactsByChainLoading: false,
      };
    default:
      return state;
  }
}
