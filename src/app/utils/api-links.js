const url = window.location.href;
const isDev = url.indexOf('abcde') > -1 || process.env.NODE_ENV === 'development';

const gatewayUrl = 'https://api.hcdc.vn/api/v1';
const devUrl = 'https://test-api.hcdc.vn/api/v1';

const userUrl = `${gatewayUrl}/auth`;
const profileUrl = isDev
  ? 'https://profile-test.hcdc.vn/api'
  : `${gatewayUrl}/profile`;
const examinationUrl = isDev
  ? 'https://examination-management.hcdc.vn/api'
  : `${gatewayUrl}/examination`;
const chainUrl = `${isDev ? devUrl : gatewayUrl}/infectionChain`;
const quarantineUrl = isDev
  ? 'http://202.78.227.175:32585/api'
  : 'https://quarantine.vkhealth.vn/api';

const treatmentUrl = isDev
  ? 'https://homequarantine.bakco.vn/api'
  : 'http://202.78.227.174:51560/api';
const reportUrl = `${gatewayUrl}/report`;

const healthDeclaration = isDev
  ? 'https://health-declaration-dev.hcdc.vn/api'
  : 'https://api.hcdc.vn/api/v1/healthDeclaration';

const apiLinks = {
  login: `${userUrl}/Users/Login`,
  checkCredential: `${userUrl}/Users/ValidateCredential`,
  changePassword: `${userUrl}/Users/ChangePassword`,
  getPermission: `${userUrl}/Users/Permissions/Ui`,
  getDiseases: `${profileUrl}/Health?isSymptom=false&pageSize=20&pageIndex=0`,
  getSymptoms: `${profileUrl}/Health?isSymptom=true&pageSize=20&pageIndex=0`,
  disease: `${profileUrl}/Health/Diseases`,
  symptoms: `${profileUrl}/Health/Symptoms`,
  diseaseSample: {
    get: `${examinationUrl}/DiseaseSamples`,
  },
  diseases: {
    get: `${examinationUrl}/Diseases`,
  },
  samplingPlaces: {
    get: `${examinationUrl}/SamplingPlaces?pageIndex=0&pageSize=1000`,
  },
  examination: {
    get: `${examinationUrl}/Examinations`,
    create: `${examinationUrl}/Examinations`,
    update: `${examinationUrl}/Examinations`,
    delete: `${examinationUrl}/Examinations`,
    getByPerson: `${examinationUrl}/Examinations/GetExaminationByPerson`,
    getDetails: `${examinationUrl}/Examinations/GetExaminationDetailsAvailable`,
    getNormalDetails: `${examinationUrl}/Examinations/GetExaminationDetailForTransportsNormal`,
    getUrgencyDetails: `${examinationUrl}/Examinations/GetExaminationDetailForTransportsUrgency`,
    getAvailableExamForTransport: `${examinationUrl}/Examinations/GetExaminationDetailsAvailableForTransport`,
    getExaminationDetail: `${examinationUrl}/Examinations/GetExaminationDetails`,
    getExaminationDetailV2: `${examinationUrl}/Examinations/GetExaminationDetailsV2`,
    updateExaminationDetail: `${examinationUrl}/Examinations/UpdateExamDetail`,
    uploadResultExcel: `${examinationUrl}/Examinations/ExamDetailResultExcel`,
    getExaminationDetailsAvailableForTestSession: `${examinationUrl}/Examinations/GetExaminationDetailsAvailableForTestSession`,
    getPositiveExaminationDetail: `${examinationUrl}/Examinations/ExamDetailPositive`,
    changeProfile: `${examinationUrl}/Examinations/ChangeProfile`,
    changeProfileBatch: `${examinationUrl}/Examinations/ChangeProfileBatch`,
    markAsUnsatisfactorySample: `${examinationUrl}/Examinations/MarkAsUnsatisfactorySample`,
    unMarkAsUnsatisfactorySample: `${examinationUrl}/Examinations/UnMarkAsUnsatisfactorySample`,
  },
  excel: {
    exportExam: `${examinationUrl}/Excels/ExamResultAnswerForm`,
    exportByRange: `${examinationUrl}/Excels/DateRangeListHCDC`,
    exportExamBook: `${examinationUrl}/Excels/ExportExamBook`,
    examResultList: `${examinationUrl}/Excels/ExamResultList`,
    getAvailableDatesForResultList: `${examinationUrl}/Excels/AvailableDatesForResultList`,
    examResultListHCDC: `${examinationUrl}/Excels/ExamResultListHCDC`,
    getAvailableDatesForResultListHCDC: `${examinationUrl}/Excels/AvailableDatesForResultListHCDC`,
    receivedStatistic: `${examinationUrl}/Excels/ReceivedStatistic`,
    takenExamList: `${examinationUrl}/Excels/TakenExamList`,
    availableDatesForTakenExamList: `${examinationUrl}/Excels/AvailableDatesForTakenExamList`,
    exportPlate: `${examinationUrl}/Excels/ExportPlate`,
    exportPlateResult: `${examinationUrl}/Excels/ExportPlateResult`,
    importTestSessionResult: `${examinationUrl}/Excels/ImportTestSessionResult`,
    importInformation: `${examinationUrl}/Excels/ImportInformation`,
    exportExaminationResult: `${examinationUrl}/Excels/ExportExaminationDetail`,
    uploadProfilesFromExcel: `${examinationUrl}/Excels/FindProfilesFromExcel`,
    exportResultFromExcel: `${examinationUrl}/Excels/FindResultFromExcel`,
    importAssigns: `${examinationUrl}/Excels/ImportAssigns`,
    importSecodaryCodeMapping: `${examinationUrl}/Excels/ImportSecondaryCodeMapping`,
    importExams: `${examinationUrl}/Excels/ImportExams`,
    dateRangeListAll: `${examinationUrl}/Excels/DateRangeListAll`,
    readPlateResult: `${examinationUrl}/Excels/ReadPlateResult`,
    importQuickResultUpdate: `${examinationUrl}/Excels/ImportQuickResultUpdate`,
    exportStatisticExamination: `${reportUrl}/Excel/GetElasticReportStatistic`,
    exportProgressExamiantionTracking: `${reportUrl}/Excel/GetProgressExaminationTracking`,
    exportExaminationStatisticByTakenDate: `${reportUrl}/Excel/GetExaminationStatisticByTakenDate`,
    exportExaminationStatisticByResultDate: `${reportUrl}/Excel/GetExaminationStatisticByResultDate`,
    exportCommunityPositiveRateStatistic: `${reportUrl}/Excel/CommunityPositiveRateStatistic`,
    exportStatisticExaminationByCodes: `${reportUrl}/Excel/GetElasticReportStatisticByCodes`,
    exportExaminationStatusReportByPlaceResidence: `${reportUrl}/Excel/GetExaminationStatusReportByPlaceResidence`,
    exportSummaryExaminationStatisticOfDistrictByResidencePlace: `${reportUrl}/Excel/SummaryExaminationStatisticOfDistrictByResidencePlace`,
    exportIsNotGroupPositivePerIsNotGroupAll: `${reportUrl}/Excel/GetIsNotGroupPositivePerIsNotGroupAll`,
    exportExaminationStatusReportByDangerZone: `${reportUrl}/Excel/GetExaminationStatusReportByDangerZone`,
    exportPositiveRateStatisticBySamplingPlaces: `${reportUrl}/Excel/PositiveRateStatisticBySamplingPlaces`,
    exportProfileHasExamination: `${profileUrl}/Exports/Profiles/Examinated`,
    exportQuickTestAvailableToPublish: `${examinationUrl}/Excels/ExportQuickTestAvailableToPublish`,
    exportQuickTestReportStatistic: `${reportUrl}/Excel/GetQuickTestReportStatistic`,
    exportPositiveExaminationReportStatistic: `${reportUrl}/Excel/GetPositiveElasticReportStatistic`,
    // exportQuickTestResultAnswerForm: `${examinationUrl}/Excels/QuickTestResultAnswerForm`,
    exportQuickTestResultAnswerForm: `${examinationUrl}/Excels/QuickTestResultAnswerFormV2`,
    // https://examination-management.hcdc.vn/api/Excels/QuickTestResultAnswerFormV2?qtId=342342
    exportInfectiousDisease: `${profileUrl}/InfectiousDiseaseHistory/Export`,
  },
  examinationType: {
    get: `${examinationUrl}/ExaminationTypes`,
  },
  samplingPlace: {
    get: `${examinationUrl}/SamplingPlaces`,
  },
  assign: {
    get: `${examinationUrl}/Assigns`,
    create: `${examinationUrl}/Assigns/AssignCreateWithProfile`,
    update: `${examinationUrl}/Assigns`,
    delete: `${examinationUrl}/Assigns`,
    getByUnitId: `${examinationUrl}/units`,
    cancel: `${examinationUrl}/Assigns/Cancel`,
    assignWithCodeOnly: `${examinationUrl}/Assigns/AssignWithCodeOnly`,
    assignWithDate: `${examinationUrl}/Assigns/AssignWithDate`,
  },
  examinationCode: {
    getUnAvailableCodes: `${examinationUrl}/ExaminationCodes/GetUnAvailableCodes`,
    getAvailableCodes: `${examinationUrl}/ExaminationCodes/GetAvailableCodes`,
    getUsedCodes: `${examinationUrl}/ExaminationCodes/GetUsedCodes`,
    getOtherCodes: `${examinationUrl}/ExaminationCodes/GetOtherCodes`,
    getAvailableCodesToPrint: `${examinationUrl}/ExaminationCodes/GetAvailableCodeToPrint`,
    getAvailableCodesToPublish: `${examinationUrl}/ExaminationCodes/GetAvailableCodeToPublish`,
    getAvailableCodesToRePrint: `${examinationUrl}/ExaminationCodes/GetAvailableCodeToRePrint`,
    getAvailableCodesToUse: `${examinationUrl}/ExaminationCodes/AvailableCodeToUse`,
    getAvailableDiseasesToPrint: `${examinationUrl}/ExaminationCodes/GetAvailableDiseaseToPrint`,
    getAvailableDiseasesToPublish: `${examinationUrl}/ExaminationCodes/GetAvailableDiseaseToPublish`,
    getAvailableDiseasesToRePrint: `${examinationUrl}/ExaminationCodes/GetAvailableDiseaseToRePrint`,
    create: `${examinationUrl}/ExaminationCodes`,
    publish: `${examinationUrl}/ExaminationCodes/Publish`,
    print: `${examinationUrl}/ExaminationCodes/Print`,
    rePrint: `${examinationUrl}/ExaminationCodes/RePrint`,
    rePrintFrom: `${examinationUrl}/ExaminationCodes/RePrintFrom`,
    createBatchUnit: `${examinationUrl}/ExaminationCodes/CreateBatchUnit`,
    getAvailableUnitsToPublish: `${examinationUrl}/ExaminationCodes/GetAvailableUnitsToPublish`,
    publishBatchUnit: `${examinationUrl}/ExaminationCodes/PublishBatchUnit`,
  },
  transport: {
    get: `${examinationUrl}/Transports`,
    create: `${examinationUrl}/Transports`,
    update: `${examinationUrl}/Transports`,
    delete: `${examinationUrl}/Transports`,
    send: `${examinationUrl}/Transports/Send`,
    receive: `${examinationUrl}/Transports/Receive`,
    getById: `${examinationUrl}/Transports/`,
    getUnitAvailable: `${examinationUrl}/Transports/GetUnitsAvailable`,
    importExcel: `${examinationUrl}/Transports/ImportExcel`,
    exportExcel: `${examinationUrl}/Transports/ExportExcel`,
    rejectSent: `${examinationUrl}/Transports/RejectSent`,
    rejectReceived: `${examinationUrl}/Transports/RejectReceived`,
    uploadTransportExcel: `${examinationUrl}/Examinations/GetExaminationDetailsAvailableForTransportExcel`,
    findTransportRelated: `${examinationUrl}/Transports/FindTransportRelated`,
    quickReceive: `${examinationUrl}/Transports/QuickReceive`,
  },
  unit: {
    getInfo: `${examinationUrl}/Units/GetByToken`,
    get: `${examinationUrl}/Units`,
    create: `${examinationUrl}/Units`,
    update: `${examinationUrl}/Units`,
    delete: `${examinationUrl}/Units`,
    getById: `${examinationUrl}/Units`,
    getPrefixes: `${examinationUrl}/Units/GetUnitPrefixes`,
    updateCode: `${examinationUrl}/Units/UpdateCode`,
    getUnitConfigs: `${examinationUrl}/Units/UnitConfigs`,
    createUnitConfig: `${examinationUrl}/Units/UnitConfig`,
    updateUnitConfig: `${examinationUrl}/Units/UnitConfig`,
    deleteUnitConfig: `${examinationUrl}/Units/UnitConfig`,
  },
  unitType: {
    get: `${examinationUrl}/UnitTypes`,
    create: `${examinationUrl}/UnitTypes`,
    update: `${examinationUrl}/UnitTypes`,
    delete: `${examinationUrl}/UnitTypes`,
  },
  session: {
    get: `${examinationUrl}/TestSessions`,
    create: `${examinationUrl}/TestSessions`,
    update: `${examinationUrl}/TestSessions`,
    delete: `${examinationUrl}/TestSessions`,
    getPlateAutoFill: `${examinationUrl}/TestSessions/PlateAutoFill`,
    updateResult: `${examinationUrl}/TestSessions/UpdateResult`,
    createAndUpdateResult: `${examinationUrl}/TestSessions/CreateAndUpdateResult`,
    testing: `${examinationUrl}/TestSessions/Testing`,
  },
  collectingSession: {
    get: `${examinationUrl}/CollectingSession`,
    getDetail: `${examinationUrl}/CollectingSession/`,
    create: `${examinationUrl}/CollectingSession`,
    update: `${examinationUrl}/CollectingSession`,
    delete: `${examinationUrl}/CollectingSession/`,
  },
  people: {
    create: `${examinationUrl}/People`,
    get: `${examinationUrl}/People/GetByProfileId`,
    merge: `${examinationUrl}/People/MergeProfile`,
    update: `${examinationUrl}/People/UpdateProfile`,
    getPersonExamHistory: `${examinationUrl}/People/ProfileExamHistory`,
    getPersonalQuickTestHistory: `${examinationUrl}/People/ProfileQuickTestHistory`,
    createGroupProfile: `${examinationUrl}/People/CreateGroupProfileByIds`,
  },
  examinationSummary: {
    get: `${examinationUrl}/Dashboard`,
    getByTime: `${examinationUrl}/Dashboard/GetTakenExaminationCountByDates`,
    getTakenExaminationCountByDates3: `${examinationUrl}/Dashboard/GetTakenExaminationCountByDates`,
    getResultedExaminationCount4: `${examinationUrl}/Dashboard/GetResultedExaminationCount`,
    getPeopleAssignedCount1: `${examinationUrl}/Dashboard/GetPeopleAssignedCount`,
    getPeopleTakenExamCount2: `${examinationUrl}/Dashboard/GetPeopleTakenExamCount`,
    getPeopleHasResultedExamCount: `${examinationUrl}/Dashboard/GetPeopleHasResultedExamCount`,
    getExaminationWaitingResultCount5: `${examinationUrl}/Dashboard/GetExaminationWaitingResultCount`,
    getPeopleExaminationStatistic: `${examinationUrl}/Dashboard/GetPeopleExaminationStatistic`,
    getExaminationDetailStatistic: `${examinationUrl}/Dashboard/GetExaminationDetailStatistic`,
    getGroupedExamDetailStatistic: `${examinationUrl}/Dashboard/GetGroupedExamDetailStatistic`,
    getDashboardByDate: `${examinationUrl}/Dashboard/getDashboardByDate`,
  },
  quarantineFacilities: {
    get: `${quarantineUrl}/Facilities`,
    create: `${quarantineUrl}/Facilities`,
    update: `${quarantineUrl}/Facilities`,
    delete: `${quarantineUrl}/Facilities`,
    setManager: `${quarantineUrl}/Facilities`,
  },
  quarantineRequests: {
    get: `${quarantineUrl}/QuarantineRequests`,
    create: `${quarantineUrl}/QuarantineRequests`,
  },
  profiles: {
    get: `${profileUrl}/Profiles`,
    create: `${profileUrl}/Profiles`,
    update: `${profileUrl}/Profiles`,
    delete: `${profileUrl}/Profiles`,
    verify: `${profileUrl}/Profiles`,
    getRelated: `${profileUrl}/Profiles/Related`,
    getChildProfile: `${profileUrl}/Profiles/Grouping/`,
    getDuplicateProfile: `${profileUrl}/Profiles/SearchExistences`,
    mergeDuplicateProfile: `${profileUrl}/Profiles/Merge`,
    getProfileByQRCode: `${profileUrl}/Profiles/GetByQRCode`,
  },
  subjects: {
    get: `${chainUrl}/Subjects`,
    create: `${chainUrl}/Subjects`,
    update: `${chainUrl}/Subjects`,
    verify: `${chainUrl}/Subjects`,
    search: `${chainUrl}/Subjects/Search`,
  },
  contacts: {
    get: `${chainUrl}/Contacts`,
    getBySubject: `${chainUrl}/Subjects/`,
    create: `${chainUrl}/Contacts`,
    update: `${chainUrl}/Contacts`,
    outbreakSearch: `${chainUrl}/Locations/Outbreak`,
    estateSearch: `${chainUrl}/Locations/Estates`,
    checkEstateName: `${chainUrl}/Locations/Estates/`,
    airplaneSearch: `${chainUrl}/Locations/Airplanes`,
    vehicleSearch: `${chainUrl}/Locations/Vehicles`,
    getLocationDetail: `${chainUrl}/Locations/`,
    updateEstate: `${chainUrl}/Locations/Estates/`,
    getVisitors: `${chainUrl}/Locations/Visitors`,
    addVisitors: `${chainUrl}/Locations/Visitors`,
    removeVisitor: `${chainUrl}/Locations/Visitors`,
    createLocation: `${chainUrl}/Locations`,
  },
  facilities: {
    quarantine: {
      createAppoint: `${quarantineUrl}/Quarantine/CreateAppoint`,
      appoint: `${quarantineUrl}/Quarantine/Appoint`,
      takeIn: `${quarantineUrl}/Quarantine/TakeIn`,
      complete: `${quarantineUrl}/Quarantine/Complete/QuarantineForm/`,
      transfer: `${quarantineUrl}/Quarantine/Transfer/Treatment`,
      transferRoom: `${quarantineUrl}/Quarantine/Rooms/QuarantineForm/`,
      transferFacility: `${quarantineUrl}/Quarantine/Facilities/QuarantineForm/`,
      extend: `${quarantineUrl}/Quarantine/Time/QuarantineForm/`,
      getHistory: `${quarantineUrl}/Quarantine/Profiles`,
      importWaitingList: `${quarantineUrl}/Quarantine/ImportWaitingList`,
      exportWaitingList: `${quarantineUrl}/Quarantine/ExportExcelWaitingList`,
      exportFacilityQuarantineList: `${quarantineUrl}/Quarantine/ExportFacilityQuarantineList/`,
      exportCompletedQuarantineList: `${quarantineUrl}/Quarantine/ExportCompletedQuarantineList/`,
    },
    quarantineFacilities: {
      get: `${quarantineUrl}/Facilities`,
      getInfo: `${quarantineUrl}/Users/Facility`,
      create: `${quarantineUrl}/Facilities`,
      update: `${quarantineUrl}/Facilities/`,
      getDetail: `${quarantineUrl}/Facilities`,
      getRooms: `${quarantineUrl}/Facilities`,
      getAvailableRooms: `${quarantineUrl}/Facilities`,
      createRooms: `${quarantineUrl}/Facilities`,
      updateRoom: `${quarantineUrl}/Facilities`,
      deleteRoom: `${quarantineUrl}/Facilities`,
      delete: `${quarantineUrl}/Facilities/`,
      getCompleted: `${quarantineUrl}/Facilities/Completed`,
      getCompletedByFacility: `${quarantineUrl}/Facilities`,
      getWaitingList: `${quarantineUrl}/Facilities/InWaitingList`,
      getWaitingListByFacility: `${quarantineUrl}/Facilities`,
      getInQuarantine: `${quarantineUrl}/Facilities/InQuarantine`,
      getInQuarantineByFalicity: `${quarantineUrl}/Facilities`,
      getInHome: `${quarantineUrl}/Facilities/InHomeQuarantine`,
      getInHomeByFacility: `${quarantineUrl}/Facilities`,
      getHouses: `${quarantineUrl}/Facilities`,
      setManager: `${quarantineUrl}/Facilities`,
      statistic1: `${quarantineUrl}/Facilities/Statistics`,
      statistic2: `${quarantineUrl}/Facilities/Statistics`,
      exportFacilities: `${quarantineUrl}/Facilities/ExportFacilities`,
      exportFacilityRooms: `${quarantineUrl}/Facilities/ExportFacilityRooms`,
      exportFacilityOccupiers: `${quarantineUrl}/Facilities/ExportFacilityOccupiers`,
    },
    quarantineForms: {
      get: `${quarantineUrl}/QuarantineForms`,
      create: `${quarantineUrl}/QuarantineForms`,
      getDetail: `${quarantineUrl}/QuarantineForms/`,
    },
  },
  general: {
    diseaseTypes: {
      get: `${chainUrl}/DiseaseTypes`,
      create: `${chainUrl}/DiseaseTypes`,
      update: `${chainUrl}/DiseaseTypes`,
      delete: `${chainUrl}/DiseaseTypes/`,
    },
    infectionTypes: {
      get: `${chainUrl}/InfectionTypes`,
      create: `${chainUrl}/InfectionTypes`,
      update: `${chainUrl}/InfectionTypes`,
      delete: `${chainUrl}/InfectionTypes/`,
      getSummaries: `${chainUrl}/InfectionTypes/Summaries/DiseaseType/b597cc8f-74b6-434d-8b9d-52b74595a1de`,
      reloadSummaries: `${chainUrl}/InfectionTypes/Summaries/DiseaseType/b597cc8f-74b6-434d-8b9d-52b74595a1de/Update/Current`,
    },
    // locationTypes: {
    //   get: `${chainUrl}/LocationTypes`,
    //   create: `${chainUrl}/LocationTypes`,
    //   update: `${chainUrl}/LocationTypes`,
    //   delete: `${chainUrl}/LocationTypes`,
    // },
  },
  infectionChain: {
    chains: {
      get: `${chainUrl}/Chains`,
      create: `${chainUrl}/Chains`,
      update: `${chainUrl}/Chains/`,
      delete: `${chainUrl}/Chains/`,
      addContact: `${chainUrl}/Chains`,
      getDetail: `${chainUrl}/Chains/`,
      createContact: `${chainUrl}/Chains`,
      getSubjects: `${chainUrl}/Chains/`,
    },
    contacts: {
      getContactsByChain: `${chainUrl}/Chains`,
      addSubjects: `${chainUrl}/Contacts/AddSubjects`,
      deleteSubject: `${chainUrl}/Contacts`,
      deleteContact: `${chainUrl}/Contacts/`,
      getContactsBySubject: `${chainUrl}/Subjects`,
      getContactDetail: `${chainUrl}/Contacts/`,
      updateInvestigation: `${chainUrl}/Contacts/UpdateInvestigations`,
      conclude: `${chainUrl}/Contacts/`,
      exportContactsByChain: `${chainUrl}/Chains/`,
    },
    subjects: {
      getSubjectDetail: `${chainUrl}/Subjects/`,
      checkPositive: `${chainUrl}/Subjects/ProfilesHavePositiveInfectedSubjects`,
      getF0: `${chainUrl}/Profiles/F0`,
      getF11: `${chainUrl}/Profiles/F11`,
      getProfileList: `${profileUrl}/Profiles/Batch`,
      getPersonels: `${chainUrl}/Personels`,
      exportSubjects: `${chainUrl}/Subjects/Export`,
    },
  },
  investigationCrtieriaCategories: {
    get: `${chainUrl}/InvestigationCrtieriaCategories`,
    getNextLevel: `${chainUrl}/InvestigationCrtieriaCategories/InfectionType/`,
    create: `${chainUrl}/InvestigationCrtieriaCategories`,
    update: `${chainUrl}/InvestigationCrtieriaCategories`,
    delete: `${chainUrl}/InvestigationCrtieriaCategories`,
    assertResult: `${chainUrl}/InvestigationCrtieriaCategories/AssertResult`,
  },
  treatment: {
    account: {
      getInfo: `${treatmentUrl}/Account/Information`,
    },
    employee: {
      get: `${treatmentUrl}/Employee`,
      create: `${treatmentUrl}/Employee`,
      updateByToken: `${treatmentUrl}/Employee`,
      delete: `${treatmentUrl}/Employee`,
      getAll: `${treatmentUrl}/Employee/Filter`,
      updateById: `${treatmentUrl}/Employee/`,
    },
    employeeType: {
      get: `${treatmentUrl}/EmployeeType`,
    },
    expectedQuarantineDate: {
      get: `${treatmentUrl}/ExpectedQuarantineDate`,
      update: `${treatmentUrl}/ExpectedQuarantineDate`,
    },
    facility: {
      get: `${treatmentUrl}/Facility`,
      getFacilities: `${treatmentUrl}/Facility/Filter`,
      create: `${treatmentUrl}/Facility/`,
      update: `${treatmentUrl}/Facility/`,
      delete: `${treatmentUrl}/Facility/`,
      transfer: `${treatmentUrl}/Facility/Transfer`,
      undo: `${treatmentUrl}/Facility/Recall`,
      getDetail: `${treatmentUrl}/Facility/`,
      getCompleted: `${treatmentUrl}/Facility/Completed`,
      getTransited: `${treatmentUrl}/Facility/Transited`,
      getOutOfProcess: `${treatmentUrl}/Facility/OutOfProcess`,
      getTransfer: `${treatmentUrl}/Transfer`,
      approveTransfer: `${treatmentUrl}/Transfer/Accept`,
    },
    hospital: {
      getAll: `${treatmentUrl}/Hospital/Filter`,
      create: `${treatmentUrl}/Hospital`,
      update: `${treatmentUrl}/Hospital/`,
      delete: `${treatmentUrl}/Hospital/`,
      getByFacility: `${treatmentUrl}/Hospital/`,
      createByFacility: `${treatmentUrl}/Hospital/`,
      deleteByFacility: `${treatmentUrl}/Hospital/`,
    },
    quarantineList: {
      get: `${treatmentUrl}/QuarantineList`,
      complete: `${treatmentUrl}/QuarantineList/Complete`,
      transit: `${treatmentUrl}/QuarantineList/Transit`,
      outOfProcess: `${treatmentUrl}/QuarantineList/OutOfProcess`,
    },
    visit: {
      get: `${treatmentUrl}/Visit/`,
      create: `${treatmentUrl}/Visit`,
      update: `${treatmentUrl}/Visit`,
      complete: `${treatmentUrl}/Visit/Completed`,
    },
    waitingList: {
      get: `${treatmentUrl}/WaitingList/AlreadyInWaitingList`,
      getByFacility: `${treatmentUrl}/WaitingList`,
      create: `${treatmentUrl}/WaitingList`,
      approve: `${treatmentUrl}/WaitingList/Approve`,
    },
    profileList: {
      get: `${treatmentUrl}/ProfileList/Filter`,
      create: `${treatmentUrl}/ProfileList`,
      createNewProfile: `${treatmentUrl}/ProfileList/Profile`,
    },
  },
  excelCategories: {
    get: `${reportUrl}/Category`,
    create: `${reportUrl}/Category`,
    update: `${reportUrl}/Category`,
    delete: `${reportUrl}/Category/`,
  },
  quickTest: {
    get: (id) => `${examinationUrl}/QuickTests/${id || ''}`,
    create: `${examinationUrl}/QuickTests`,
    update: `${examinationUrl}/QuickTests`,
    updateByAdmin: `${examinationUrl}/QuickTests/AdminUpdate`,
    delete: (id) => `${examinationUrl}/QuickTests?id=${id}`,
    deleteByAdmin: (id) => `${examinationUrl}/QuickTests/AdminDelete?id=${id}`,
    assign: `${examinationUrl}/QuickTests/Assign`,
    publish: `${examinationUrl}/QuickTests/Publish`,
    recovery: (id) => `${examinationUrl}/QuickTests/RecoverDeleted?id=${id}`,
    changeProfile: `${examinationUrl}/QuickTests/ChangeProfile`,
    createWithProfile: `${examinationUrl}/QuickTests/CreateWithProfile`,
    createBatch: `${examinationUrl}/QuickTests/CreateBatch`,
    createBatchProfile: `${examinationUrl}/QuickTests/CreateBatch`,
    createBatchWithProfile: `${examinationUrl}/QuickTests/CreateBatchWithProfile`,
    getDeleted: `${examinationUrl}/QuickTests/GetDeleted`,
    getPositiveQuickTests: `${examinationUrl}/QuickTests/QuickTestPositive`,
    getQuickTestsByUnitType: `${examinationUrl}/QuickTests/FilterByUnitType`,
    getQuickTestsByManagementUnit: `${examinationUrl}/QuickTests/FilterByManagementUnits`,
    importJson: `${examinationUrl}/ImportJson/ImportQuickTestJson`,
  },
  immunization: {
    create: `${profileUrl}/Immunization`,
    update: `${profileUrl}/Immunization`,
  },
  underlyingDiseases: {
    get: `${profileUrl}/Health`,
    create: `${profileUrl}/Health`,
    delete: `${profileUrl}/Health`,
  },
  infectiousDiseases: {
    get: `${profileUrl}/InfectiousDiseaseHistory`,
    GetPHRAndCheckPositive: `${profileUrl}/InfectiousDiseaseHistory/GetPHRAndCheckPositive`,
  },
  importPcrExamination: {
    create: `${examinationUrl}/ImportJson/ImportExamJsonV2`,
  },
  injectedPatient: {
    get: `${healthDeclaration}/ProfileInformation/GetWithProfileHealthDeclaration`,
    getById: `${healthDeclaration}/HealthDeclaration`,
    importExcel: `${healthDeclaration}/HealthDeclaration/ImportByExcel`,
    exportExcel: `${healthDeclaration}/ProfileInformation/ExportWithHealthDeclaration`,
    delete: `${healthDeclaration}/HealthDeclaration`,
    updateQuarantineAddress: `${healthDeclaration}/HealthDeclaration`,
  },
  infectiousDiseaseHistories: {
    get: `${profileUrl}/InfectiousDiseaseHistory`,
    getLog: `${profileUrl}/InfectiousDiseaseHistoryLog`,
    checkPositive: `${profileUrl}/InfectiousDiseaseHistory/GetPHRAndCheckPositive`,
  },

};

export default apiLinks;
