const SubjectInfectionType = {
  F0: 0,
  F11: 1,
  F12: 2,
  F21: 3,
};

const CreateFromType = {
  EXAMINATION: 0,
  INFECTIONCHAIN: 1,
  QUARANTINE: 2,
  TREATMENT: 3,
};

const ProcessType = {
  HOME: 0,
  QUARANTINE_ZONE: 1,
  TREATMENT_ZONE: 2,
};

const LocationType = {
  LOCATION: 0,
  VEHICLE: 1,
  AIRPLANE: 2,
};

const SubjectStage = {
  VERIFICATION_WAITING: 0,
  VERIFIED: 1,
  PROCESSING_WAITING: 2,
  PROCESSED: 3,
  TAKING_IN_QUARANTINE_WAITING: 4,
  TAKING_IN_TREATMENT_WAITING: 5,
  TAKEN_IN_QUARANTINE: 6,
  TAKEN_IN_TREATMENT: 7,
  EXAMINATION_WAITING: 8,
  EXAMINED: 9,
  COMPLETED: 10,
};

const SubjectDetailsTab = {
  INFOMATION: 'information',
  INFECTION_CHAIN: 'infection-chain',
  MEDICAL_TEST: 'medical-test',
  TREATMENT: 'treatment',
  QUARANTINE: 'quarantine',
};

const ImportantType = {
  IMPORTANT: 2,
  NORMAL: 1,
  WEAK: 0,
};

const AssignStatuses = {
  CREATE: 0,
  CANCEL_BOOKING: 1,
  CANCEL_ASSIGN: 2,
  CANCEL_TAKING: 3,
  REJECT_ASSIGN: 4,
  REJECT_BOOKING: 5,
  TAKEN: 6,
};

const SourceType = {
  ASSIGN: 0,
  BOOKING: 1,
  CREATE: 2,
  IMPORT: 3,
  QUARANTINE: 4,
  CHAIN: 5,
};

const TransportType = {
  CREATE: 0,
  SENT: 1,
  RECEIVED: 2,
};

const TransportCheckingStatus = {
  AVAILABLE: 0,
  SPARE: 1,
  MISSING: 2,
};

const SessionStatus = {
  CREATED: 0,
  PROCESSING: 2,
  DONE: 1,
};

const SummaryTypes = {
  SUMMARY_INFECTIONCHAIN: 0,
  SUMMARY_EXAMINATION: 1,
  SUMMARY_QUARANTINE: 2,
};

const SubjectKeyType = {
  CCCD: 0,
  CMND: 1,
  PASSPORT: 2,
  HEALTHINSURANCE: 3,
};

const CreatedFrom = {
  EXAMINATION: 0,
  CHAIN: 1,
  QUARANTINE: 2,
  TREATMENT: 3,
};

export {
  SubjectInfectionType,
  CreateFromType,
  ImportantType,
  ProcessType,
  SubjectStage,
  SubjectDetailsTab,
  AssignStatuses,
  SourceType,
  TransportType,
  TransportCheckingStatus,
  SessionStatus,
  SummaryTypes,
  SubjectKeyType,
  CreatedFrom,
  LocationType,
};
