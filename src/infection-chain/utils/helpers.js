/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
import {
  SubjectInfectionType,
  SubjectStage,
  CreateFromType,
  ImportantType,
  AssignStatuses,
  SourceType,
  TransportType,
  TransportCheckingStatus,
  SessionStatus,
  SummaryTypes,
} from './constants';

const { F0, F11, F12, F21 } = SubjectInfectionType;

const {
  IMPORTANT,
  WEAK,
  // NORMAL,
} = ImportantType;

const {
  EXAMINATION: CREATED_FROM_EXAMINATION,
  INFECTIONCHAIN: CREATED_FROM_INFECTIONCHAIN,
  QUARANTINE: CREATED_FROM_QUARANTINE,
  TREATMENT: CREATED_FROM_TREATMENT,
} = CreateFromType;

const {
  CREATE,
  CANCEL_BOOKING,
  CANCEL_ASSIGN,
  CANCEL_TAKING,
  REJECT_ASSIGN,
  REJECT_BOOKING,
  TAKEN,
} = AssignStatuses;

const {
  ASSIGN,
  BOOKING,
  CREATE: SOURCECREATE,
  IMPORT,
  QUARANTINE,
  CHAIN,
} = SourceType;

const { CREATE: TRANSPORTCREATE, SENT, RECEIVED } = TransportType;

const { MISSING, AVAILABLE, SPARE } = TransportCheckingStatus;

const { CREATED, PROCESSING, DONE } = SessionStatus;

const {
  SUMMARY_INFECTIONCHAIN,
  SUMMARY_EXAMINATION,
  // SUMMARY_QUARANTINE,
} = SummaryTypes;

const summaryOptions = [
  { value: SUMMARY_INFECTIONCHAIN, text: 'Thống kê chuỗi lây nhiễm' },
  { value: SUMMARY_EXAMINATION, text: 'Thống kê xét nghiệm' },
  // { value: SUMMARY_QưUARANTINE, text: 'Thống kê cách ly', disabled: true },
];

const getSubjectTypeLabel = (type) => {
  switch (type) {
    case F0:
      return 'F0';
    case F11:
      return 'F1.1';
    case F12:
      return 'F1.2';
    case F21:
      return 'F2.1';
    default:
      return 'F?';
  }
};

const subjectTypeList = [
  {
    label: 'F0',
    value: F0,
    color: 'red',
    hex: '#DB2828',
  },
  {
    label: 'F1.1',
    value: F11,
    color: 'yellow',
    hex: '#FBBD08',
  },
  {
    label: 'F1.2',
    value: F12,
    color: 'blue',
    hex: '#2185D0',
  },
  {
    label: 'F2.1',
    value: F21,
    color: 'green',
    hex: '#21BA45',
  },
  {
    label: 'F?',
    value: null,
    color: 'black',
    hex: '#000000',
  },
  {
    label: 'Không tiếp xúc',
    value: -1,
    color: 'black',
    hex: '#000000',
  },
];

const importantTypeList = [
  {
    label: 'Khẩn cấp',
    value: IMPORTANT,
    color: 'red',
    hex: '#DB2828',
  },
  // {
  //   label: 'Ưu tiên', value: NORMAL, color: 'yellow', hex: '#FBBD08',
  // },
  {
    label: 'Thường quy',
    value: WEAK,
    color: 'green',
    hex: '#21BA45',
  },
];

const createFromTypeList = [
  {
    label: 'Xét nghiệm',
    value: CREATED_FROM_EXAMINATION,
    color: 'violet',
    hex: '#a333c8',
  },
  {
    label: 'Cách ly',
    value: CREATED_FROM_QUARANTINE,
    color: 'teal',
    hex: '#008080',
  },
  {
    label: 'Chuỗi',
    value: CREATED_FROM_INFECTIONCHAIN,
    color: 'blue',
    hex: '#2185D0',
  },
  {
    label: 'Điều trị',
    value: CREATED_FROM_TREATMENT,
    color: 'orange',
    hex: '#f2711c',
  },
];

const transportTypes = [
  { value: 0, label: 'Cơ sở lấy mẫu -> Cơ sở nhận mẫu' },
  { value: 1, label: 'Cơ sở nhận mẫu -> Cơ sở nhận mẫu' },
  { value: 2, label: 'Cơ sở nhận mẫu -> Cơ sở xét nghiệm' },
  { value: 3, label: 'Cơ sở xét nghiệm -> Cơ sở xét nghiệm' },
];

const transportStatuses = [
  { value: TRANSPORTCREATE, label: 'Đã tạo' },
  { value: SENT, label: 'Đã chuyển' },
  { value: RECEIVED, label: 'Đã nhận' },
];

const assignStatuses = [
  { value: CREATE, label: 'Chờ lấy mẫu' },
  { value: CANCEL_BOOKING, label: 'Người dùng hủy lịch' },
  { value: CANCEL_ASSIGN, label: 'CDC thu hồi chỉ định' },
  { value: CANCEL_TAKING, label: 'Cơ sở tự hủy' },
  { value: REJECT_ASSIGN, label: 'Cơ sở từ chối chỉ định' },
  { value: REJECT_BOOKING, label: 'Cơ sở từ chối lịch hẹn' },
  { value: TAKEN, label: 'Đã lấy mẫu' },
];

const sourceTypes = [
  { value: ASSIGN, label: 'CDC chỉ định' },
  { value: BOOKING, label: 'Đặt lịch trực tuyến' },
  { value: SOURCECREATE, label: 'Tự chỉ định' },
  { value: IMPORT, label: 'Import' },
  { value: QUARANTINE, label: 'Chỉ định từ cách ly' },
  { value: CHAIN, label: 'Chỉ định từ dịch tể' },
];

const transportCheckingList = [
  {
    value: AVAILABLE,
    label: 'Mã phù hợp',
    color: 'green',
    hex: '#21BA45',
  },
  {
    value: SPARE,
    label: 'Mã dư',
    color: 'yellow',
    hex: '#FBBD08',
  },
  {
    value: MISSING,
    label: 'Mã thiếu',
    color: 'red',
    hex: '#DB2828',
  },
];

const sessionList = [
  {
    value: CREATED,
    label: 'Đã tạo',
  },
  {
    value: PROCESSING,
    label: 'Đang xét nghiệm',
  },
  {
    value: DONE,
    label: 'Đã hoàn thành',
  },
];

const getSubjectType = (type) => subjectTypeList.find((t) => t.value === type);
const getCreateFromType = (type) =>
  createFromTypeList.find((c) => c.value === type);
const getImportantType = (type) =>
  importantTypeList.find((i) => i.value === type);
const getTransportType = (type) => transportTypes.find((t) => t.value === type);
const getSourceType = (type) => sourceTypes.find((s) => s.value === type);
const getTransportStatus = (type) =>
  transportStatuses.find((t) => t.value === type);
const getAssignStatus = (type) => assignStatuses.find((a) => a.value === type);
const getTransportCheckingStatus = (status) =>
  transportCheckingList.find((t) => t.value === status);
const getSessionStatus = (status) =>
  sessionList.find((t) => t.value === status);

const {
  VERIFICATION_WAITING,
  VERIFIED,
  PROCESSING_WAITING,
  PROCESSED,
  TAKING_IN_QUARANTINE_WAITING,
  TAKING_IN_TREATMENT_WAITING,
  TAKEN_IN_QUARANTINE,
  TAKEN_IN_TREATMENT,
  EXAMINATION_WAITING,
  EXAMINED,
  COMPLETED,
} = SubjectStage;

const subjectStageList = [
  {
    label: 'Chờ xác minh',
    value: VERIFICATION_WAITING,
    color: 'teal',
  },
  {
    label: 'Đã xác minh',
    value: VERIFIED,
    color: 'blue',
  },
  {
    label: 'Chờ xử lý',
    value: PROCESSING_WAITING,
    color: 'violet',
  },
  {
    label: 'Đã xử lý',
    value: PROCESSED,
    color: 'purple',
  },
  {
    label: 'Chờ tiếp nhận cách ly kiểm dịch',
    value: TAKING_IN_QUARANTINE_WAITING,
    color: 'pink',
  },
  {
    label: 'Chờ tiếp nhận cách ly điều trị',
    value: TAKING_IN_TREATMENT_WAITING,
    color: 'pink',
  },
  {
    label: 'Đã tiếp nhận cách ly kiểm dịch',
    value: TAKEN_IN_QUARANTINE,
    color: 'brown',
  },
  {
    label: 'Đã tiếp nhận cách ly điều trị',
    value: TAKEN_IN_TREATMENT,
    color: 'brown',
  },
  {
    label: 'Chờ xét nghiệm',
    value: EXAMINATION_WAITING,
    color: 'grey',
  },
  {
    label: 'Đã xét nghiệm',
    value: EXAMINED,
    color: 'black',
  },
  {
    label: 'Đã xử lý',
    value: COMPLETED,
    color: 'black',
  },
];

const getSubjectStage = (stage) =>
  subjectStageList.find((s) => s.value === stage);

const genGuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export {
  transportStatuses,
  getSubjectTypeLabel,
  subjectTypeList,
  importantTypeList,
  getImportantType,
  createFromTypeList,
  getSubjectType,
  getCreateFromType,
  getSubjectStage,
  getTransportType,
  getTransportStatus,
  getAssignStatus,
  genGuid,
  getSourceType,
  sourceTypes,
  assignStatuses,
  transportCheckingList,
  getTransportCheckingStatus,
  sessionList,
  getSessionStatus,
  summaryOptions,
};
