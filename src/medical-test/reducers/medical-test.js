import types from '../actions/types';

const INITIAL_STATE = {
  inputCache: {},
  unitInfo: null,
  selectedMedicalTest: null,
  createModal: false,
  editModal: false,
  medicalTest: {},
  getMedicalTestLoading: false,
  medicalTestData: {},
  getMedicalTestsLoading: false,
  createMedicalTestLoading: false,
  updateMedicalTestLoading: false,
  deleteMedicalTestLoading: false,

  medicalTestZoneData: {},
  getMedicalTestZonesLoading: false,
  createMedicalTestZoneLoading: false,
  updateMedicalTestZoneLoading: false,
  deleteMedicalTestZoneLoading: false,

  medicalTestCodeData: {},
  getMedicalTestCodesLoading: false,
  createMedicalTestCodeLoading: false,

  getMedicalTestZonesPrefixLoading: false,
  medicalTestZonePrefixList: [],

  getPrintedCodeLoading: false,
  getAllZonesLoading: false,
  publishCodeLoading: false,
  printCodeLoading: false,

  getPrintDiseaseLoading: false,
  printDiseaseList: [],

  getPrintCodeLoading: false,
  printCodeList: [],

  availableCodesToUse: [],
  getAvailableCodesToUseLoading: false,

  printedCodeList: [],
  zoneList: [],

  createErrorMessage: '',
  updateErrorMessage: '',

  publishAndPrintErrorMessage: '',

  getDiseasesLoading: false,
  diseaseList: [],

  getDiseaseSamplesLoading: false,
  diseaseSampleList: [],

  examinationTypeList: [],
  getExaminationTypesLoading: false,

  unAvailableCodeList: {},
  getUnAvailableCodesLoading: false,
  availableCodeList: {},
  getAvailableCodesLoading: false,
  createCodeLoading: false,
  createUnitLoading: false,
  updateUnitLoading: false,
  deleteUnitLoading: false,
  unitList: {},
  getUnitsLoading: false,
  prefixList: [],
  getPrefixesLoading: false,
  unitTypeList: [],
  getUnitTypesLoading: false,
  createUnitTypeLoading: false,
  createAssignLoading: false,
  updateAssignLoading: false,
  cancelAssignLoading: false,
  assignWithCodeOnlyLoading: false,
  assigneeList: [],
  getAssigneesLoading: false,
  examinationData: {},
  getExaminationsLoading: false,
  updateExaminationLoading: false,
  deleteExaminationLoading: false,
  getExaminationByPersonLoading: false,
  examinationByPersonData: {},
  getExaminationDetailsLoading: false,
  examinationDetailData: [],
  getAvailableCodesToPrintLoading: false,
  getAvailableCodesToPublishLoading: false,
  getAvailableDiseasesToPrintLoading: false,
  availableDiseaseToPrintList: [],
  getAvailableDiseasesToPublishLoading: false,
  availableDiseaseToPublishList: [],
  getExaminationDetailLoading: false,
  examinationDetailTempData: {},
  positiveExaminationDetailData: {},
  getPositiveExaminationDetailLoading: false,
  updateExamDetailLoading: false,
  getUsedCodesLoading: false,
  usedCodeData: {},
  getOtherCodesLoading: false,
  otherCodeData: {},
  availableCodeToPrint: 0,
  availableCodeToPrintList: [],
  availableCodeToPublish: 0,
  availableCodeToPublishList: [],
  examinationNormalDetailList: [],
  examinationUrgencyDetailList: [],

  createBatchUnitLoading: false,
  getAvailableUnitToPublishLoading: false,
  availableUnitToPublishList: [],
  publishBatchUnitLoading: false,

  availableDiseaseExamBox: [],
  loadingGetAvailableDiseaseExamBox: false,
  availableDiseaseAmount: 0,
  loadingGetAvailableDisease: false,
  exportResult: [],
  loadingExportNoneResultExcelDetails: false,
  exportExamLoading: false,

  allExaminationDetailsAvailableForTestSessionList: [],
  getAllExaminationDetailsAvailableForTestSessionLoading: false,
  examinationDetailsAvailableForTestSessionList: [],
  getExaminationDetailsAvailableForTestSessionLoading: false,

  exportExaminationExcelLoading: false,

  availableDayForExport: [],
  loadingAvailableDayForExport: false,

  getPeopleByProfileIdLoading: false,
  peopleByProfile: null,

  mergeProfileLoading: false,
  mergeProfileData: null,

  createProfileFromExaminationLoading: false,

  exportExamBookLoading: false,
  examinationDetail: null,
  updateProfileLoading: false,
  exportExaminationResultLoading: false,

  unitConfigsList: [],
  getUnitConfigsLoading: false,
  createUnitConfigLoading: false,
  updateUnitConfigLoading: false,
  deleteUnitConfigLoading: false,

  changeProfileLoading: false,
  personalExamHistoryList: [],
  getPersonalExamHistoryLoading: false,

  uploadProfilefromExcelData: [],
  uploadProfilefromExcelLoading: false,
  changeProfileBatchData: [],
  changeProfileBatchLoading: false,

  samplingPlaceList: [],
  getSamplingPlacesLoading: false,

  exportResultFromExcelLoading: false,
  importAssignsLoading: false,

  createGroupProfileLoading: false,

  markAsUnsatisfactorySampleLoading: false,
  unMarkAsUnsatisfactorySampleLoading: false,

  exportStatisticExaminationByCodeLoading: false,

  clearExaminationDetailFilter: false,

  quickTestData: {},
  getQuickTestLoading: false,
  deletedQuickTestData: {},
  getDeletedQuickTestLoading: false,
  quickTestsByManagementUnitData: {},
  getQuickTestsManagementUnitLoading: false,
  quickTestsByUnitTypeData: {},
  getQuickTestsByUnitTypeLoading: false,
  positiveQuickTestData: {},
  getPositiveQuickTestLoading: false,
  personalQuickTestHistoryList: [],
  getPersonalQuickTestHistoryLoading: false,

  createQuickTestLoading: false,
  createQuickTestWithProfileLoading: false,
  createBatchQuickTestLoading: false,
  createBatchQuickTestWithProfileLoading: false,
  updateQuickTestLoading: false,
  deleteQuickTestLoading: false,
  recoveryQuickTestLoading: false,

  assignQuickTestSession: {},
  publishQuickTestLoading: false,

  importQuickTestJsonLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SET_EXAMINATION_INPUT_CACHE: {
      return {
        ...state,
        inputCache: {
          ...state.inputCache,
          ...action.payload,
        },
      };
    }
    case types.SELECT_MEDICAL_TEST: {
      return {
        ...state,
        selectedMedicalTest: action.payload,
      };
    }
    case types.MEDICAL_TEST_TOGGLE_CREATE_MODAL: {
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
    case types.GET_MEDICAL_TESTS_REQUEST: {
      return {
        ...state,
        getMedicalTestsLoading: true,
      };
    }
    case types.GET_MEDICAL_TESTS_SUCCESS: {
      return {
        ...state,
        getMedicalTestsLoading: false,
        medicalTestData: action.payload,
      };
    }
    case types.GET_MEDICAL_TESTS_FAILURE: {
      return {
        ...state,
        getMedicalTestsLoading: false,
      };
    }
    case types.GET_UNIT_INFO_REQUEST: {
      return {
        ...state,
        getUnitInfoLoading: true,
      };
    }
    case types.GET_UNIT_INFO_SUCCESS: {
      const result = action.payload;
      return {
        ...state,
        getUnitInfoLoading: false,
        unitInfo: {
          ...result,
          isJoiningExam:
            result.isTester && result.isReceiver && result.isCollector,
          isSelfTest:
            result.isTester && !result.isReceiver && result.isCollector,
        },
      };
    }
    case types.GET_UNIT_INFO_FAILURE: {
      return {
        ...state,
        getUnitInfoLoading: false,
      };
    }
    case types.GET_MEDICAL_TEST_REQUEST: {
      return {
        ...state,
        getMedicalTestLoading: true,
      };
    }
    case types.GET_MEDICAL_TEST_SUCCESS: {
      return {
        ...state,
        getMedicalTestLoading: false,
        medicalTest: action.payload,
      };
    }
    case types.GET_MEDICAL_TEST_FAILURE: {
      return {
        ...state,
        getMedicalTestLoading: false,
      };
    }
    case types.CREATE_MEDICAL_TEST_REQUEST: {
      return {
        ...state,
        createMedicalTestLoading: true,
      };
    }
    case types.CREATE_MEDICAL_TEST_SUCCESS: {
      return {
        ...state,
        createMedicalTestLoading: false,
      };
    }
    case types.CREATE_MEDICAL_TEST_FAILURE: {
      return {
        ...state,
        createMedicalTestLoading: false,
      };
    }
    case types.UPDATE_MEDICAL_TEST_REQUEST: {
      return {
        ...state,
        updateMedicalTestLoading: true,
      };
    }
    case types.UPDATE_MEDICAL_TEST_SUCCESS: {
      return {
        ...state,
        updateMedicalTestLoading: false,
      };
    }
    case types.UPDATE_MEDICAL_TEST_FAILURE: {
      return {
        ...state,
        updateMedicalTestLoading: false,
      };
    }
    case types.DELETE_MEDICAL_TEST_REQUEST: {
      return {
        ...state,
        deleteMedicalTestLoading: true,
      };
    }
    case types.DELETE_MEDICAL_TEST_SUCCESS: {
      return {
        ...state,
        deleteMedicalTestLoading: false,
      };
    }
    case types.DELETE_MEDICAL_TEST_FAILURE: {
      return {
        ...state,
        deleteMedicalTestLoading: false,
      };
    }
    // case types.CREATE_UNIT_CONFIG_REQUEST: {
    //   return {
    //     ...state,
    //     createUnitConfigLoading: true,
    //   };
    // }
    // case types.CREATE_UNIT_CONFIG_SUCCESS:
    // case types.CREATE_UNIT_CONFIG_FAILURE: {
    //   return {
    //     ...state,
    //     createUnitConfigLoading: false,
    //   };
    // }
    // case types.UPDATE_UNIT_CONFIG_REQUEST: {
    //   return {
    //     ...state,
    //     updateUnitConfigLoading: true,
    //   };
    // }
    // case types.UPDATE_UNIT_CONFIG_SUCCESS:
    // case types.UPDATE_UNIT_CONFIG_FAILURE: {
    //   return {
    //     ...state,
    //     updateUnitConfigLoading: false,
    //   };
    // }
    // case types.DELETE_UNIT_CONFIG_REQUEST: {
    //   return {
    //     ...state,
    //     deleteUnitConfigLoading: true,
    //   };
    // }
    // case types.DELETE_UNIT_CONFIG_SUCCESS:
    // case types.DELETE_UNIT_CONFIG_FAILURE: {
    //   return {
    //     ...state,
    //     deleteUnitConfigLoading: false,
    //   };
    // }
    case types.GET_MEDICAL_TEST_ZONES_REQUEST: {
      return {
        ...state,
        getMedicalTestZonesLoading: true,
      };
    }
    case types.GET_MEDICAL_TEST_ZONES_SUCCESS: {
      return {
        ...state,
        getMedicalTestZonesLoading: false,
        medicalTestZoneData: action.payload,
      };
    }
    case types.GET_MEDICAL_TEST_ZONES_FAILURE: {
      return {
        ...state,
        getMedicalTestZonesLoading: false,
      };
    }
    case types.GET_MEDICAL_TEST_ZONES_PREFIX_REQUEST: {
      return {
        ...state,
        getMedicalTestZonesPrefixLoading: true,
      };
    }
    case types.GET_MEDICAL_TEST_ZONES_PREFIX_SUCCESS: {
      return {
        ...state,
        getMedicalTestZonesPrefixLoading: false,
        medicalTestZonePrefixList: action.payload,
      };
    }
    case types.GET_MEDICAL_TEST_ZONES_PREFIX_FAILURE: {
      return {
        ...state,
        getMedicalTestZonesPrefixLoading: false,
      };
    }
    case types.GET_DISEASES_REQUEST: {
      return {
        ...state,
        getDiseasesLoading: true,
      };
    }
    case types.GET_DISEASES_SUCCESS: {
      return {
        ...state,
        getDiseasesLoading: false,
        diseaseList: action.payload,
      };
    }
    case types.GET_DISEASES_FAILURE: {
      return {
        ...state,
        getDiseasesLoading: false,
      };
    }
    case types.GET_DISEASE_SAMPLES_REQUEST: {
      return {
        ...state,
        getDiseaseSamplesLoading: true,
      };
    }
    case types.GET_DISEASE_SAMPLES_SUCCESS: {
      return {
        ...state,
        getDiseaseSamplesLoading: false,
        diseaseSampleList: action.payload,
      };
    }
    case types.GET_DISEASE_SAMPLES_FAILURE: {
      return {
        ...state,
        getDiseaseSamplesLoading: false,
      };
    }
    case types.GET_EXAMINATION_TYPES_REQUEST: {
      return {
        ...state,
        getExaminationTypesLoading: true,
      };
    }
    case types.GET_EXAMINATION_TYPES_SUCCESS: {
      return {
        ...state,
        getExaminationTypesLoading: false,
        examinationTypeList: action.payload,
      };
    }
    case types.GET_EXAMINATION_TYPES_FAILURE: {
      return {
        ...state,
        getExaminationTypesLoading: false,
      };
    }
    case types.CREATE_MEDICAL_TEST_ZONE_REQUEST: {
      return {
        ...state,
        createErrorMessage: '',
        createMedicalTestZoneLoading: true,
      };
    }
    case types.CREATE_MEDICAL_TEST_ZONE_SUCCESS: {
      return {
        ...state,
        createMedicalTestZoneLoading: false,
      };
    }
    case types.CREATE_MEDICAL_TEST_ZONE_FAILURE: {
      const error = action.payload;
      let createErrorMessage = '';
      const duplicateText = error.substring(
        error.indexOf('"') + 1,
        error.lastIndexOf('"'),
      );
      if (error.indexOf('Username') > -1) {
        createErrorMessage =
          'Username đã tồn tại trong hệ thống, vui lòng thử lại';
      } else if (error.indexOf('Email') > -1) {
        createErrorMessage =
          'Email đã tồn tại trong hệ thống, vui lòng thử lại';
      } else if (error.indexOf('Phone') > -1) {
        createErrorMessage =
          'Số điện thoại đã tồn tại trong hệ thống, vui lòng thử lại';
      } else if (error.indexOf('Prefix') > -1) {
        createErrorMessage = `Mã cơ sở ${duplicateText} đã tồn tại trong hệ thống, vui lòng thử lại`;
      } else if (error.indexOf('Name') > -1) {
        createErrorMessage = `Tên cơ sở ${duplicateText} đã tồn tại trong hệ thống, vui lòng thử lại`;
      }
      return {
        ...state,
        createErrorMessage,
        createMedicalTestZoneLoading: false,
      };
    }
    case types.UPDATE_MEDICAL_TEST_ZONE_REQUEST: {
      return {
        ...state,
        updateErrorMessage: '',
        updateMedicalTestZoneLoading: true,
      };
    }
    case types.UPDATE_MEDICAL_TEST_ZONE_SUCCESS: {
      return {
        ...state,
        updateMedicalTestZoneLoading: false,
      };
    }
    case types.UPDATE_MEDICAL_TEST_ZONE_FAILURE: {
      return {
        ...state,
        updateErrorMessage: action.payload,
        updateMedicalTestZoneLoading: false,
      };
    }
    case types.DELETE_MEDICAL_TEST_ZONE_REQUEST: {
      return {
        ...state,
        deleteMedicalTestZoneLoading: true,
      };
    }
    case types.DELETE_MEDICAL_TEST_ZONE_SUCCESS:
    case types.DELETE_MEDICAL_TEST_ZONE_FAILURE: {
      return {
        ...state,
        deleteMedicalTestZoneLoading: false,
      };
    }
    // case types.GET_MEDICAL_TEST_CODES_REQUEST: {
    //   return {
    //     ...state,
    //     getMedicalTestCodesLoading: true,
    //   };
    // }
    // case types.GET_MEDICAL_TEST_CODES_SUCCESS: {
    //   return {
    //     ...state,
    //     getMedicalTestCodesLoading: false,
    //     medicalTestCodeData: action.payload,
    //   };
    // }
    case types.GET_MEDICAL_TEST_CODES_FAILURE: {
      return {
        ...state,
        getMedicalTestCodesLoading: false,
      };
    }
    case types.CREATE_MEDICAL_TEST_CODE_REQUEST: {
      return {
        ...state,
        createMedicalTestCodeLoading: true,
      };
    }
    case types.CREATE_MEDICAL_TEST_CODE_SUCCESS:
    case types.CREATE_MEDICAL_TEST_CODE_FAILURE: {
      return {
        ...state,
        createMedicalTestCodeLoading: false,
      };
    }
    case types.GET_MEDICAL_TEST_PRINTED_CODE_REQUEST: {
      return {
        ...state,
        getPrintedCodeLoading: true,
      };
    }
    case types.GET_MEDICAL_TEST_PRINTED_CODE_SUCCESS: {
      return {
        ...state,
        getPrintedCodeLoading: false,
        printedCodeList: action.payload,
      };
    }
    case types.GET_MEDICAL_TEST_PRINTED_CODE_FAILURE: {
      return {
        ...state,
        getPrintedCodeLoading: false,
      };
    }
    case types.GET_MEDICAL_TEST_ALL_ZONES_REQUEST: {
      return {
        ...state,
        getAllZonesLoading: true,
      };
    }
    case types.GET_MEDICAL_TEST_ALL_ZONES_SUCCESS: {
      return {
        ...state,
        getAllZonesLoading: false,
        zoneList: action.payload,
      };
    }
    case types.GET_MEDICAL_TEST_ALL_ZONES_FAILURE: {
      return {
        ...state,
        getAllZonesLoading: false,
      };
    }
    case types.PUBLISH_CODE_REQUEST: {
      return {
        ...state,
        publishCodeLoading: true,
      };
    }
    case types.PUBLISH_CODE_SUCCESS:
    case types.PUBLISH_CODE_FAILURE: {
      return {
        ...state,
        publishCodeLoading: false,
      };
    }
    case types.PRINT_CODE_BY_ZONE_REQUEST: {
      return {
        ...state,
        printCodeLoading: true,
      };
    }
    case types.PRINT_CODE_BY_ZONE_SUCCESS:
    case types.PRINT_CODE_BY_ZONE_FAILURE: {
      return {
        ...state,
        printCodeLoading: false,
      };
    }
    case types.PRINT_CODE_REQUEST: {
      return {
        ...state,
        printCodeLoading: true,
      };
    }
    case types.PRINT_CODE_SUCCESS:
    case types.PRINT_CODE_FAILURE: {
      return {
        ...state,
        printCodeLoading: false,
      };
    }
    case types.PUBLISH_CODE_BY_ZONE_REQUEST: {
      return {
        ...state,
        publishCodeLoading: true,
      };
    }
    case types.PUBLISH_CODE_BY_ZONE_SUCCESS:
    case types.PUBLISH_CODE_BY_ZONE_FAILURE: {
      return {
        ...state,
        publishCodeLoading: false,
      };
    }
    case types.REPRINT_CODE_BY_ZONE_REQUEST: {
      return {
        ...state,
        rePrintCodeLoading: true,
      };
    }
    case types.REPRINT_CODE_BY_ZONE_SUCCESS:
    case types.REPRINT_CODE_BY_ZONE_FAILURE: {
      return {
        ...state,
        rePrintCodeLoading: false,
      };
    }
    case types.REPRINT_CODE_FROM_REQUEST: {
      return {
        ...state,
        rePrintCodeLoading: true,
      };
    }
    case types.REPRINT_CODE_FROM_SUCCESS:
    case types.REPRINT_CODE_FROM_FAILURE: {
      return {
        ...state,
        rePrintCodeLoading: false,
      };
    }
    case types.GET_UNAVAILABLE_CODES_REQUEST: {
      return {
        ...state,
        getUnAvailableCodesLoading: true,
      };
    }
    case types.GET_UNAVAILABLE_CODES_SUCCESS: {
      return {
        ...state,
        unAvailableCodeList: action.payload,
        getUnAvailableCodesLoading: false,
      };
    }
    case types.GET_UNAVAILABLE_CODES_FAILURE: {
      return {
        ...state,
        getUnAvailableCodesLoading: false,
      };
    }
    case types.GET_AVAILABLE_CODES_REQUEST: {
      return {
        ...state,
        getAvailableCodesLoading: true,
      };
    }
    case types.GET_AVAILABLE_CODES_SUCCESS: {
      return {
        ...state,
        getAvailableCodesLoading: false,
        availableCodeList: action.payload,
      };
    }
    case types.GET_AVAILABLE_CODES_FAILURE: {
      return {
        ...state,
        getAvailableCodesLoading: false,
      };
    }
    case types.GET_AVAILABLE_CODE_TO_PRINT_REQUEST: {
      return {
        ...state,
        getAvailableCodesToPrintLoading: true,
      };
    }
    case types.GET_AVAILABLE_CODE_TO_PRINT_SUCCESS: {
      return {
        ...state,
        getAvailableCodesToPrintLoading: false,
        availableCodeToPrint: Number.isInteger(action.payload)
          ? action.payload
          : INITIAL_STATE.availableCodeToPrint,
        availableCodeToPrintList: !Number.isInteger(action.payload)
          ? action.payload
          : INITIAL_STATE.availableCodeToPrintList,
      };
    }
    case types.GET_AVAILABLE_CODE_TO_PRINT_FAILURE: {
      return {
        ...state,
        getAvailableCodesToPrintLoading: false,
      };
    }
    case types.GET_AVAILABLE_CODE_TO_PUBLISH_REQUEST: {
      return {
        ...state,
        getAvailableCodesToPublishLoading: true,
      };
    }
    case types.GET_AVAILABLE_CODE_TO_PUBLISH_SUCCESS: {
      return {
        ...state,
        getAvailableCodesToPublishLoading: false,
        availableCodeToPublish: action.payload,
      };
    }
    case types.GET_AVAILABLE_CODE_TO_PUBLISH_FAILURE: {
      return {
        ...state,
        getAvailableCodesToPublishLoading: false,
      };
    }
    case types.GET_AVAILABLE_DISEASE_TO_PRINT_REQUEST: {
      return {
        ...state,
        getAvailableDiseasesToPrintLoading: true,
      };
    }
    case types.GET_AVAILABLE_DISEASE_TO_PRINT_SUCCESS: {
      return {
        ...state,
        getAvailableDiseasesToPrintLoading: false,
        availableDiseaseToPrintList: action.payload,
      };
    }
    case types.GET_AVAILABLE_DISEASE_TO_PRINT_FAILURE: {
      return {
        ...state,
        getAvailableDiseasesToPrintLoading: false,
      };
    }
    case types.GET_AVAILABLE_DISEASE_TO_PUBLISH_REQUEST: {
      return {
        ...state,
        getAvailableDiseasesToPublishLoading: true,
      };
    }
    case types.GET_AVAILABLE_DISEASE_TO_PUBLISH_SUCCESS: {
      return {
        ...state,
        getAvailableDiseasesToPublishLoading: false,
        availableDiseaseToPublishList: action.payload,
      };
    }
    case types.GET_AVAILABLE_DISEASE_TO_PUBLISH_FAILURE: {
      return {
        ...state,
        getAvailableDiseasesToPublishLoading: false,
      };
    }
    case types.CREATE_EXAMINATION_CODES_REQUEST: {
      return {
        ...state,
        createCodeLoading: true,
      };
    }
    case types.CREATE_EXAMINATION_CODES_SUCCESS:
    case types.CREATE_EXAMINATION_CODES_FAILURE: {
      return {
        ...state,
        createCodeLoading: false,
      };
    }
    case types.CREATE_EXAMINATION_REQUEST: {
      return {
        ...state,
        createExaminationLoading: true,
      };
    }
    case types.CREATE_EXAMINATION_SUCCESS:
    case types.CREATE_EXAMINATION_FAILURE: {
      return {
        ...state,
        createExaminationLoading: false,
      };
    }
    case types.CREATE_UNIT_REQUEST: {
      return {
        ...state,
        createUnitLoading: true,
      };
    }
    case types.CREATE_UNIT_SUCCESS:
    case types.CREATE_UNIT_FAILURE: {
      return {
        ...state,
        createUnitLoading: false,
      };
    }
    case types.UPDATE_UNIT_REQUEST: {
      return {
        ...state,
        updateUnitLoading: true,
      };
    }
    case types.UPDATE_UNIT_SUCCESS:
    case types.UPDATE_UNIT_FAILURE: {
      return {
        ...state,
        updateUnitLoading: false,
      };
    }
    case types.DELETE_UNIT_REQUEST: {
      return {
        ...state,
        deleteUnitLoading: true,
      };
    }
    case types.DELETE_UNIT_SUCCESS:
    case types.DELETE_UNIT_FAILURE: {
      return {
        ...state,
        deleteUnitLoading: false,
      };
    }
    case types.GET_UNITS_REQUEST: {
      return {
        ...state,
        getUnitsLoading: true,
      };
    }
    case types.GET_UNITS_SUCCESS: {
      return {
        ...state,
        getUnitsLoading: false,
        unitList: action.payload,
      };
    }
    case types.GET_UNITS_FAILURE: {
      return {
        ...state,
        getUnitsLoading: false,
      };
    }
    case types.GET_ASSIGNEES_REQUEST: {
      return {
        ...state,
        getAssigneesLoading: true,
        assigneeList: [],
      };
    }
    case types.GET_ASSIGNEES_SUCCESS: {
      return {
        ...state,
        getAssigneesLoading: false,
        assigneeList: action.payload,
      };
    }
    case types.GET_ASSIGNEES_FAILURE: {
      return {
        ...state,
        getAssigneesLoading: false,
      };
    }
    case types.GET_PREFIXES_REQUEST: {
      return {
        ...state,
        getPrefixesLoading: true,
      };
    }
    case types.GET_PREFIXES_SUCCESS: {
      return {
        ...state,
        getPrefixesLoading: false,
        prefixList: action.payload,
      };
    }
    case types.GET_PREFIXES_FAILURE: {
      return {
        ...state,
        getPrefixesLoading: false,
      };
    }
    case types.GET_UNIT_TYPES_REQUEST: {
      return {
        ...state,
        getUnitTypesLoading: true,
      };
    }
    case types.GET_UNIT_TYPES_SUCCESS: {
      return {
        ...state,
        unitTypeList: action.payload,
        getUnitTypesLoading: false,
      };
    }
    case types.GET_UNIT_TYPES_FAILURE: {
      return {
        ...state,
        getUnitTypesLoading: false,
      };
    }
    case types.CREATE_ASSIGN_REQUEST: {
      return {
        ...state,
        createAssignLoading: true,
      };
    }
    case types.CREATE_ASSIGN_SUCCESS:
    case types.CREATE_ASSIGN_FAILURE: {
      return {
        ...state,
        createAssignLoading: false,
      };
    }
    case types.UPDATE_ASSIGN_REQUEST: {
      return {
        ...state,
        updateAssignLoading: true,
      };
    }
    case types.UPDATE_ASSIGN_SUCCESS:
    case types.UPDATE_ASSIGN_FAILURE: {
      return {
        ...state,
        updateAssignLoading: false,
      };
    }
    case types.CREATE_UNIT_TYPE_REQUEST: {
      return {
        ...state,
        createUnitTypeLoading: true,
      };
    }
    case types.CREATE_UNIT_TYPE_SUCCESS:
    case types.CREATE_UNIT_TYPE_FAILURE: {
      return {
        ...state,
        createUnitTypeLoading: false,
      };
    }
    case types.GET_EXAMINATIONS_REQUEST: {
      return {
        ...state,
        getExaminationsLoading: true,
      };
    }
    case types.GET_EXAMINATIONS_SUCCESS: {
      return {
        ...state,
        examinationData: action.payload,
        getExaminationsLoading: false,
      };
    }
    case types.GET_EXAMINATIONS_FAILURE: {
      return {
        ...state,
        getExaminationsLoading: false,
      };
    }
    case types.UPDATE_EXAMINATION_REQUEST: {
      return {
        ...state,
        updateExaminationLoading: true,
      };
    }
    case types.UPDATE_EXAMINATION_SUCCESS:
    case types.UPDATE_EXAMINATION_FAILURE: {
      return {
        ...state,
        updateExaminationLoading: false,
      };
    }
    case types.DELETE_EXAMINATION_REQUEST: {
      return {
        ...state,
        deleteExaminationLoading: true,
      };
    }
    case types.DELETE_EXAMINATION_SUCCESS:
    case types.DELETE_EXAMINATION_FAILURE: {
      return {
        ...state,
        deleteExaminationLoading: false,
      };
    }
    case types.GET_EXAMINATION_BY_PERSON_REQUEST: {
      return {
        ...state,
        getExaminationByPersonLoading: true,
      };
    }
    case types.GET_EXAMINATION_BY_PERSON_SUCCESS: {
      return {
        ...state,
        getExaminationByPersonLoading: false,
        examinationByPersonData: action.payload,
      };
    }
    case types.GET_EXAMINATION_BY_PERSON_FAILURE: {
      return {
        ...state,
        getExaminationByPersonLoading: false,
      };
    }
    case types.GET_EXAMINATION_DETAILS_REQUEST: {
      return {
        ...state,
        getExaminationDetailsLoading: true,
      };
    }
    case types.GET_EXAMINATION_DETAILS_SUCCESS: {
      return {
        ...state,
        getExaminationDetailsLoading: false,
        examinationDetailData: action.payload,
      };
    }
    case types.GET_EXAMINATION_DETAILS_FAILURE: {
      return {
        ...state,
        getExaminationDetailsLoading: false,
      };
    }
    case types.GET_EXAMINATION_FOR_TRANSPORTS_NORMAL_REQUEST: {
      return {
        ...state,
        getExaminationDetailsLoading: true,
      };
    }
    case types.GET_EXAMINATION_FOR_TRANSPORTS_NORMAL_SUCCESS: {
      return {
        ...state,
        getExaminationDetailsLoading: false,
        examinationNormalDetailList: action.payload,
      };
    }
    case types.GET_EXAMINATION_FOR_TRANSPORTS_NORMAL_FAILURE: {
      return {
        ...state,
        getExaminationDetailsLoading: false,
      };
    }
    case types.GET_EXAMINATION_FOR_TRANSPORTS_URGENCY_REQUEST: {
      return {
        ...state,
        getExaminationDetailsLoading: true,
      };
    }
    case types.GET_EXAMINATION_FOR_TRANSPORTS_URGENCY_SUCCESS: {
      return {
        ...state,
        getExaminationDetailsLoading: false,
        examinationUrgencyDetailList: action.payload,
      };
    }
    case types.GET_EXAMINATION_FOR_TRANSPORTS_URGENCY_FAILURE: {
      return {
        ...state,
        getExaminationDetailsLoading: false,
      };
    }
    case types.GET_REPRINT_CODE_REQUEST: {
      return {
        ...state,
        getPrintCodeLoading: true,
      };
    }
    case types.GET_REPRINT_CODE_SUCCESS: {
      return {
        ...state,
        getPrintCodeLoading: false,
        availableCodeToPrint: Number.isInteger(action.payload)
          ? action.payload
          : INITIAL_STATE.availableCodeToPrint,
        availableCodeToPrintList: !Number.isInteger(action.payload)
          ? action.payload
          : INITIAL_STATE.availableCodeToPrintList,
      };
    }
    case types.GET_REPRINT_CODE_FAILURE: {
      return {
        ...state,
        getPrintCodeLoading: false,
      };
    }
    case types.GET_REPRINT_DISEASE_REQUEST: {
      return {
        ...state,
        getPrintDiseaseLoading: true,
      };
    }
    case types.GET_REPRINT_DISEASE_SUCCESS: {
      return {
        ...state,
        getPrintDiseaseLoading: false,
        availableDiseaseToPrintList: action.payload,
      };
    }
    case types.GET_REPRINT_DISEASE_FAILURE: {
      return {
        ...state,
        getPrintDiseaseLoading: false,
      };
    }
    case types.GET_EXAMINATION_DETAIL_TEMPS_REQUEST: {
      return {
        ...state,
        getExaminationDetailLoading: true,
      };
    }
    case types.GET_EXAMINATION_DETAIL_TEMPS_SUCCESS: {
      return {
        ...state,
        getExaminationDetailLoading: false,
        examinationDetailTempData: action.payload,
      };
    }
    case types.GET_EXAMINATION_DETAIL_TEMPS_FAILURE: {
      return {
        ...state,
        getExaminationDetailLoading: false,
      };
    }
    case types.GET_POSITIVE_EXAMINATION_DETAIL_REQUEST: {
      return {
        ...state,
        getPositiveExaminationDetailLoading: true,
      };
    }
    case types.GET_POSITIVE_EXAMINATION_DETAIL_SUCCESS: {
      return {
        ...state,
        getPositiveExaminationDetailLoading: false,
        positiveExaminationDetailData: action.payload,
      };
    }
    case types.GET_POSITIVE_EXAMINATION_DETAIL_FAILURE: {
      return {
        ...state,
        getPositiveExaminationDetailLoading: false,
      };
    }
    case types.GET_USED_CODE_REQUEST: {
      return {
        ...state,
        getUsedCodesLoading: true,
      };
    }
    case types.GET_USED_CODE_SUCCESS: {
      return {
        ...state,
        getUsedCodesLoading: false,
        usedCodeData: action.payload,
      };
    }
    case types.GET_USED_CODE_FAILURE: {
      return {
        ...state,
        getUsedCodesLoading: false,
      };
    }
    case types.GET_OTHER_CODE_REQUEST: {
      return {
        ...state,
        getOtherCodesLoading: true,
      };
    }
    case types.GET_OTHER_CODE_SUCCESS: {
      return {
        ...state,
        getOtherCodesLoading: false,
        otherCodeData: action.payload,
      };
    }
    case types.GET_OTHER_CODE_FAILURE: {
      return {
        ...state,
        getOtherCodesLoading: false,
      };
    }
    case types.CANCEL_ASSIGN_REQUEST: {
      return {
        ...state,
        cancelAssignLoading: true,
      };
    }
    case types.CANCEL_ASSIGN_SUCCESS:
    case types.CANCEL_ASSIGN_FAILURE: {
      return {
        ...state,
        cancelAssignLoading: false,
      };
    }
    case types.ASSIGN_WITH_CODE_ONLY_REQUEST: {
      return {
        ...state,
        assignWithCodeOnlyLoading: true,
      };
    }
    case types.ASSIGN_WITH_CODE_ONLY_SUCCESS:
    case types.ASSIGN_WITH_CODE_ONLY_FAILURE: {
      return {
        ...state,
        assignWithCodeOnlyLoading: false,
      };
    }
    case types.UPDATE_EXAM_DETAIL_REQUEST: {
      return {
        ...state,
        updateExamDetailLoading: true,
      };
    }
    case types.UPDATE_EXAM_DETAIL_SUCCESS:
    case types.UPDATE_EXAM_DETAIL_FAILURE: {
      return {
        ...state,
        updateExamDetailLoading: false,
      };
    }
    case types.SET_UPLOAD_EXAMINATION_FILE_PROGRESS: {
      return {
        ...state,
        uploadExaminationProgress: action.payload,
      };
    }
    case types.UPLOAD_EXAMINATION_FILE_REQUEST:
      return {
        ...state,
        uploadExaminationLoading: true,
        uploadExaminationProgress: 0,
      };
    case types.UPLOAD_EXAMINATION_FILE_SUCCESS:
    case types.UPLOAD_EXAMINATION_FILE_FAILURE:
      return {
        ...state,
        uploadExaminationLoading: false,
      };
    case types.CREATE_BATCH_UNIT_REQUEST:
      return {
        ...state,
        createBatchUnitLoading: true,
      };
    case types.CREATE_BATCH_UNIT_SUCCESS:
    case types.CREATE_BATCH_UNIT_FAILURE:
      return {
        ...state,
        createBatchUnitLoading: false,
      };
    case types.GET_AVAILABLE_UNITS_TO_PUBLISH_REQUEST:
      return {
        ...state,
        getAvailableUnitToPublishLoading: true,
      };
    case types.GET_AVAILABLE_UNITS_TO_PUBLISH_SUCCESS:
      return {
        ...state,
        getAvailableUnitToPublishLoading: false,
        availableUnitToPublishList: action.payload,
      };
    case types.GET_AVAILABLE_UNITS_TO_PUBLISH_FAILURE:
      return {
        ...state,
        getAvailableUnitToPublishLoading: false,
      };
    case types.PUBLISH_BATCH_UNIT_REQUEST:
      return {
        ...state,
        publishBatchUnitLoading: true,
      };
    case types.PUBLISH_BATCH_UNIT_SUCCESS:
    case types.PUBLISH_BATCH_UNIT_FAILURE:
      return {
        ...state,
        publishBatchUnitLoading: false,
      };
    case types.GET_AVAILABLE_DISEASE_EXAMBOX_REQUEST:
      return {
        ...state,
        loadingGetAvailableDiseaseExamBox: true,
      };
    case types.GET_AVAILABLE_DISEASE_EXAMBOX_SUCCESS:
      return {
        ...state,
        availableDiseaseExamBox: action.payload,
        loadingGetAvailableDiseaseExamBox: false,
      };
    case types.GET_AVAILABLE_DISEASE_EXAMBOX_FAILURE:
      return {
        ...state,
        loadingGetAvailableDiseaseExamBox: false,
      };
    case types.GET_AVAILABLE_EXAMBOX_REQUEST:
      return {
        ...state,
        loadingGetAvailableDisease: true,
      };
    case types.GET_AVAILABLE_EXAMBOX_SUCCESS:
      return {
        ...state,
        availableDiseaseAmount: action.payload,
        loadingGetAvailableDisease: false,
      };
    case types.GET_AVAILABLE_EXAMBOX_FAILURE:
      return {
        ...state,
        loadingGetAvailableDisease: false,
      };
    case types.EXPORT_NONE_RESULT_EXCEL_DETAILS_REQUEST:
      return {
        ...state,
        loadingExportNoneResultExcelDetails: true,
      };
    case types.EXPORT_NONE_RESULT_EXCEL_DETAILS_SUCCESS:
      return {
        ...state,
        exportResult: action.payload,
        loadingExportNoneResultExcelDetails: false,
      };
    case types.EXPORT_NONE_RESULT_EXCEL_DETAILS_FAILURE:
      return {
        ...state,
        loadingExportNoneResultExcelDetails: false,
      };
    case types.EXPORT_EXAM_FILE_REQUEST:
      return {
        ...state,
        exportExamLoading: true,
      };
    case types.EXPORT_EXAM_FILE_SUCCESS:
    case types.EXPORT_EXAM_FILE_FAILURE:
      return {
        ...state,
        exportExamLoading: false,
      };
    case types.EXPORT_EXAM_BOOK_REQUEST:
      return {
        ...state,
        exportExamBookLoading: true,
      };
    case types.EXPORT_EXAM_BOOK_SUCCESS:
    case types.EXPORT_EXAM_BOOK_FAILURE:
      return {
        ...state,
        exportExamBookLoading: false,
      };
    case types.EXPORT_EXAMIANATION_RESULT_REQUEST:
      return {
        ...state,
        exportExaminationExcelLoading: true,
      };
    case types.EXPORT_EXAMIANATION_RESULT_SUCCESS:
    case types.EXPORT_EXAMIANATION_RESULT_FAILURE:
      return {
        ...state,
        exportExaminationExcelLoading: false,
      };
    case types.GET_AVAILABLE_DAY_BY_UNIT_FOR_EXPORT_EXAMINATION_REQUEST: {
      return {
        ...state,
        loadingAvailableDayForExport: true,
      };
    }
    case types.GET_AVAILABLE_DAY_BY_UNIT_FOR_EXPORT_EXAMINATION_SUCCESS: {
      return {
        ...state,
        availableDayForExport: action.payload,
        loadingAvailableDayForExport: false,
      };
    }
    case types.GET_AVAILABLE_DAY_BY_UNIT_FOR_EXPORT_EXAMINATION_FAILURE: {
      return {
        ...state,
        loadingAvailableDayForExport: false,
      };
    }
    case types.GET_EXAMINATION_DETAILS_AVAILABLE_FOR_TEST_SESSION_REQUEST:
      return {
        ...state,
        getExaminationDetailsAvailableForTestSessionLoading: true,
      };
    case types.GET_EXAMINATION_DETAILS_AVAILABLE_FOR_TEST_SESSION_SUCCESS:
      return {
        ...state,
        examinationDetailsAvailableForTestSessionList: action.payload,
        getExaminationDetailsAvailableForTestSessionLoading: false,
      };
    case types.GET_EXAMINATION_DETAILS_AVAILABLE_FOR_TEST_SESSION_FAILURE:
      return {
        ...state,
        getExaminationDetailsAvailableForTestSessionLoading: Boolean(
          action.payload?.message,
        ),
      };
    case types.GET_ALL_EXAMINATION_DETAILS_AVAILABLE_FOR_TEST_SESSION_REQUEST:
      return {
        ...state,
        getAllExaminationDetailsAvailableForTestSessionLoading: true,
      };
    case types.GET_ALL_EXAMINATION_DETAILS_AVAILABLE_FOR_TEST_SESSION_SUCCESS:
      return {
        ...state,
        getAllExaminationDetailsAvailableForTestSessionLoading: false,
        allExaminationDetailsAvailableForTestSessionList: action.payload,
      };
    case types.GET_ALL_EXAMINATION_DETAILS_AVAILABLE_FOR_TEST_SESSION_FAILURE:
      return {
        ...state,
        getAllExaminationDetailsAvailableForTestSessionLoading: false,
      };
    case types.GET_BY_PROFILE_ID_REQUEST:
      return {
        ...state,
        getPeopleByProfileIdLoading: true,
      };
    case types.GET_BY_PROFILE_ID_SUCCESS:
      return {
        ...state,
        getPeopleByProfileIdLoading: false,
        peopleByProfile: action.payload,
      };
    case types.GET_BY_PROFILE_ID_FAILURE:
      return {
        ...state,
        getPeopleByProfileIdLoading: false,
      };
    case types.MERGE_PROFILE_REQUEST:
      return {
        ...state,
        mergeProfileLoading: true,
      };
    case types.MERGE_PROFILE_SUCCESS:
      return {
        ...state,
        mergeProfileLoading: false,
        mergeProfileData: action.payload,
      };
    case types.MERGE_PROFILE_FAILURE:
      return {
        ...state,
        mergeProfileLoading: false,
      };
    case types.GET_EXAMINATION_BY_DETAIL_REQUEST:
      return {
        ...state,
        getExaminationDetailLoading: true,
      };
    case types.GET_EXAMINATION_BY_DETAIL_SUCCESS:
      return {
        ...state,
        getExaminationDetailLoading: false,
        examinationDetail: action.payload,
      };
    case types.GET_EXAMINATION_BY_DETAIL_FAILURE:
      return {
        ...state,
        getExaminationDetailLoading: false,
      };
    case types.CREATE_PROFILE_FROM_EXAMINATION_REQUEST:
      return {
        ...state,
        createProfileFromExaminationLoading: true,
      };
    case types.CREATE_PROFILE_FROM_EXAMINATION_SUCCESS:
    case types.CREATE_PROFILE_FROM_EXAMINATION_FAILURE:
      return {
        ...state,
        createProfileFromExaminationLoading: false,
      };
    case types.IMPORT_INFORMATION_REQUEST:
      return {
        ...state,
        importInformationLoading: true,
      };
    case types.IMPORT_INFORMATION_SUCCESS:
    case types.IMPORT_INFORMATION_FAILURE:
      return {
        ...state,
        importInformationLoading: false,
      };
    case types.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        updateProfileLoading: true,
      };
    case types.UPDATE_PROFILE_SUCCESS:
    case types.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        updateProfileLoading: false,
      };
    case types.EXPORT_EXAMINATION_RESULT_REQUEST:
      return {
        ...state,
        exportExaminationResultLoading: true,
      };
    case types.EXPORT_EXAMINATION_RESULT_SUCCESS:
    case types.EXPORT_EXAMINATION_RESULT_FAILURE:
      return {
        ...state,
        exportExaminationResultLoading: false,
      };
    case types.CHANGE_PROFILE_REQUEST:
      return {
        ...state,
        changeProfileLoading: true,
      };
    case types.CHANGE_PROFILE_SUCCESS:
    case types.CHANGE_PROFILE_FAILURE:
      return {
        ...state,
        changeProfileLoading: false,
      };
    case types.GET_PERSONAL_EXAM_HISTORY_REQUEST:
      return {
        ...state,
        getPersonalExamHistoryLoading: true,
      };
    case types.GET_PERSONAL_EXAM_HISTORY_SUCCESS:
      return {
        ...state,
        personalExamHistoryList: action.payload,
        getPersonalExamHistoryLoading: false,
      };
    case types.GET_PERSONAL_EXAM_HISTORY_FAILURE:
      return {
        ...state,
        getPersonalExamHistoryLoading: false,
      };
    case types.UPLOAD_PROFILES_FROM_EXCEL_REQUEST:
      return {
        ...state,
        uploadProfilefromExcelLoading: true,
      };
    case types.UPLOAD_PROFILES_FROM_EXCEL_SUCCESS:
      return {
        ...state,
        uploadProfilefromExcelData: action.payload,
        uploadProfilefromExcelLoading: false,
      };
    case types.UPLOAD_PROFILES_FROM_EXCEL_FAILURE:
      return {
        ...state,
        uploadProfilefromExcelLoading: false,
      };
    case types.EXPORT_RESULT_FROM_EXCEL_REQUEST:
      return {
        ...state,
        exportResultFromExcelLoading: true,
      };
    case types.EXPORT_RESULT_FROM_EXCEL_SUCCESS:
    case types.EXPORT_RESULT_FROM_EXCEL_FAILURE:
      return {
        ...state,
        exportResultFromExcelLoading: false,
      };
    case types.IMPORT_ASSIGNS_REQUEST:
      return {
        ...state,
        importAssignsLoading: true,
      };
    case types.IMPORT_ASSIGNS_SUCCESS:
    case types.IMPORT_ASSIGNS_FAILURE:
      return {
        ...state,
        importAssignsLoading: false,
      };
    case types.CHANGE_PROFILE_PATCH_REQUEST:
      return {
        ...state,
        changeProfileBatchLoading: true,
      };
    case types.CHANGE_PROFILE_PATCH_SUCCESS:
      return {
        ...state,
        changeProfileBatchData: action.payload,
        changeProfileBatchLoading: false,
      };
    case types.CHANGE_PROFILE_PATCH_FAILURE:
      return {
        ...state,
        changeProfileBatchLoading: false,
      };
    case types.GET_AVAILABLE_CODES_TO_USE_REQUEST:
      return {
        ...state,
        getAvailableCodesToUseLoading: true,
      };
    case types.GET_AVAILABLE_CODES_TO_USE_SUCCESS:
      return {
        ...state,
        availableCodesToUse: action.payload,
        getAvailableCodesToUseLoading: false,
      };
    case types.GET_AVAILABLE_CODES_TO_USE_FAILURE:
      return {
        ...state,
        getAvailableCodesToUseLoading: false,
      };
    case types.CREATE_GROUP_PROFILE_REQUEST:
      return {
        ...state,
        createGroupProfileLoading: true,
      };
    case types.CREATE_GROUP_PROFILE_SUCCESS:
    case types.CREATE_GROUP_PROFILE_FAILURE:
      return {
        ...state,
        createGroupProfileLoading: false,
      };
    case types.GET_SAMPLING_PLACES_REQUEST:
      return {
        ...state,
        getSamplingPlaceLoading: true,
      };
    case types.GET_SAMPLING_PLACES_SUCCESS:
      return {
        ...state,
        samplingPlaceList: action.payload,
        getSamplingPlacesLoading: false,
      };
    case types.GET_SAMPLING_PLACES_FAILURE:
      return {
        ...state,
        getSamplingPlaceLoading: false,
      };
    case types.MASK_AS_UNSATISFACTORY_SAMPLE_REQUEST:
      return {
        ...state,
        markAsUnsatisfactorySampleLoading: true,
      };
    case types.MASK_AS_UNSATISFACTORY_SAMPLE_SUCCESS:
    case types.MASK_AS_UNSATISFACTORY_SAMPLE_FAILURE:
      return {
        ...state,
        markAsUnsatisfactorySampleLoading: false,
      };
    case types.UN_MASK_AS_UNSATISFACTORY_SAMPLE_REQUEST:
      return {
        ...state,
        unMarkAsUnsatisfactorySampleLoading: true,
      };
    case types.UN_MASK_AS_UNSATISFACTORY_SAMPLE_SUCCESS:
    case types.UN_MASK_AS_UNSATISFACTORY_SAMPLE_FAILURE:
      return {
        ...state,
        unMarkAsUnsatisfactorySampleLoading: false,
      };
    case types.EXPORT_STATISTIC_EXAMINATION_BY_CODE_REQUEST:
      return {
        ...state,
        exportStatisticExaminationByCodeLoading: true,
      };
    case types.EXPORT_STATISTIC_EXAMINATION_BY_CODE_SUCCESS:
    case types.EXPORT_STATISTIC_EXAMINATION_BY_CODE_FAILURE:
      return {
        ...state,
        exportStatisticExaminationByCodeLoading: false,
      };
    case types.CLEAR_EXAMINATION_DETAIL_FILTER:
        return {
          ...state,
          clearExaminationDetailFilter: action.payload,
        };
    case types.GET_QUICK_TESTS_REQUEST: {
      return {
        ...state,
        getQuickTestLoading: true,
      };
    }
    case types.GET_QUICK_TESTS_SUCCESS: {
      return {
        ...state,
        getQuickTestLoading: false,
        quickTestData: action.payload,
      };
    }
    case types.GET_QUICK_TESTS_FAILURE: {
      return {
        ...state,
        getQuickTestLoading: false,
      };
    }
    case types.GET_DELETED_QUICK_TESTS_REQUEST: {
      return {
        ...state,
        getDeletedQuickTestLoading: true,
      };
    }
    case types.GET_DELETED_QUICK_TESTS_SUCCESS: {
      return {
        ...state,
        getDeletedQuickTestLoading: false,
        deletedQuickTestData: action.payload,
      };
    }
    case types.GET_DELETED_QUICK_TESTS_FAILURE: {
      return {
        ...state,
        getDeletedQuickTestLoading: false,
      };
    }
    case types.GET_QUICK_TESTS_BY_MANAGEMENT_UNIT_REQUEST: {
      return {
        ...state,
        getQuickTestsByManagementUnitLoading: true,
      };
    }
    case types.GET_QUICK_TESTS_BY_MANAGEMENT_UNIT_SUCCESS: {
      return {
        ...state,
        getQuickTestsByManagementUnitLoading: false,
        quickTestsByManagementUnitData: action.payload,
      };
    }
    case types.GET_QUICK_TESTS_BY_MANAGEMENT_UNIT_FAILURE: {
      return {
        ...state,
        getQuickTestsByManagementUnitLoading: false,
      };
    }
    case types.GET_QUICK_TESTS_BY_UNIT_TYPE_REQUEST: {
      return {
        ...state,
        getQuickTestsByUnitTypeLoading: true,
      };
    }
    case types.GET_QUICK_TESTS_BY_UNIT_TYPE_SUCCESS: {
      return {
        ...state,
        getQuickTestsByUnitTypeLoading: false,
        quickTestsByUnitTypeData: action.payload,
      };
    }
    case types.GET_QUICK_TESTS_BY_UNIT_TYPE_FAILURE: {
      return {
        ...state,
        getQuickTestsByUnitTypeLoading: false,
      };
    }
    case types.GET_PERSONAL_QUICK_TEST_HISTORY_REQUEST: {
      return {
        ...state,
        getPersonalQuickTestHistoryLoading: true,
      };
    }
    case types.GET_PERSONAL_QUICK_TEST_HISTORY_SUCCESS: {
      return {
        ...state,
        personalQuickTestHistoryList: action.payload,
        getPersonalQuickTestHistoryLoading: false,
      };
    }
    case types.GET_PERSONAL_QUICK_TEST_HISTORY_FAILURE: {
      return {
        ...state,
        getPersonalQuickTestHistoryLoading: false,
      };
    }
    case types.GET_POSITIVE_QUICK_TESTS_REQUEST: {
      return {
        ...state,
        getPositiveQuickTestLoading: true,
      };
    }
    case types.GET_POSITIVE_QUICK_TESTS_SUCCESS: {
      return {
        ...state,
        positiveQuickTestData: action.payload,
        getPositiveQuickTestLoading: false,
      };
    }
    case types.GET_POSITIVE_QUICK_TESTS_FAILURE: {
      return {
        ...state,
        getPositiveQuickTestLoading: false,
      };
    }
    case types.CREATE_QUICK_TEST_REQUEST: {
      return {
        ...state,
        createQuickTestLoading: true,
      };
    }
    case types.CREATE_QUICK_TEST_SUCCESS:
    case types.CREATE_QUICK_TEST_FAILURE: {
      return {
        ...state,
        createQuickTestLoading: false,
      };
    }
    case types.CREATE_QUICK_TEST_WITH_PROFILE_REQUEST: {
      return {
        ...state,
        createQuickTestWithProfileLoading: true,
      };
    }
    case types.CREATE_QUICK_TEST_WITH_PROFILE_SUCCESS:
    case types.CREATE_QUICK_TEST_WITH_PROFILE_FAILURE: {
      return {
        ...state,
        createQuickTestWithProfileLoading: false,
      };
    }
    case types.CREATE_BATCH_QUICK_TEST_REQUEST: {
      return {
        ...state,
        createBatchQuickTestLoading: true,
      };
    }
    case types.CREATE_BATCH_QUICK_TEST_SUCCESS:
    case types.CREATE_BATCH_QUICK_TEST_FAILURE: {
      return {
        ...state,
        createBatchQuickTestLoading: false,
      };
    }
    case types.CREATE_BATCH_QUICK_TEST_WITH_PROFILE_REQUEST: {
      return {
        ...state,
        createBatchQuickTestWithProfileLoading: true,
      };
    }
    case types.CREATE_BATCH_QUICK_TEST_WITH_PROFILE_SUCCESS:
    case types.CREATE_BATCH_QUICK_TEST_WITH_PROFILE_FAILURE: {
      return {
        ...state,
        createBatchQuickTestWithProfileLoading: false,
      };
    }
    case types.UPDATE_QUICK_TEST_REQUEST: {
      return {
        ...state,
        updateQuickTestLoading: true,
      };
    }
    case types.UPDATE_QUICK_TEST_SUCCESS:
    case types.UPDATE_QUICK_TEST_FAILURE: {
      return {
        ...state,
        updateQuickTestLoading: false,
      };
    }
    case types.DELETE_QUICK_TEST_REQUEST: {
      return {
        ...state,
        deleteQuickTestLoading: true,
      };
    }
    case types.DELETE_QUICK_TEST_SUCCESS:
    case types.DELETE_QUICK_TEST_FAILURE: {
      return {
        ...state,
        deleteQuickTestLoading: false,
      };
    }
    case types.RECOVERY_QUICK_TEST_REQUEST: {
      return {
        ...state,
        recoveryQuickTestLoading: true,
      };
    }
    case types.RECOVERY_QUICK_TEST_SUCCESS:
    case types.RECOVERY_QUICK_TEST_FAILURE: {
      return {
        ...state,
        recoveryQuickTestLoading: false,
      };
    }
    case types.ASSIGN_QUICK_TEST_SESSION: {
      return {
        ...state,
        assignQuickTestSession: action.payload,
      };
    }
    case types.PUBLISH_QUICK_TEST_REQUEST: {
      return {
        ...state,
        publishQuickTestLoading: true,
      };
    }
    case types.PUBLISH_QUICK_TEST_SUCCESS:
    case types.PUBLISH_QUICK_TEST_FAILURE: {
      return {
        ...state,
        publishQuickTestLoading: false,
      };
    }
    case types.IMPORT_QUICK_TEST_JSON_REQUEST: {
      return {
        ...state,
        importQuickTestJsonLoading: true,
      };
    }
    case types.IMPORT_QUICK_TEST_JSON_SUCCESS:
    case types.IMPORT_QUICK_TEST_JSON_FAILURE: {
      return {
        ...state,
        importQuickTestJsonLoading: false,
      };
    }
    default: {
      return state;
    }
  }
}
