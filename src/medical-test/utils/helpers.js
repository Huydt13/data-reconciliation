import { QUICK_TEST_STATUSES } from 'medical-test/utils/constants';

const quickTestStatuses = [
  { value: QUICK_TEST_STATUSES.ASSIGN, label: 'Đã chỉ định' },
  { value: QUICK_TEST_STATUSES.CANCEL, label: 'Đã huỷ' },
  { value: QUICK_TEST_STATUSES.DONE, label: 'Đã xét nghiệm' },
  { value: QUICK_TEST_STATUSES.PUBLISHED, label: 'Đã công bố' },
];

const getAssignQuickTestStatus = (type) => quickTestStatuses.find((a) => a.value === type);

const formatImmunizationStatusForProfile = (status) => {
  if (status === 0) {
    return 1;
  }
  if (status === 1) {
    return 2;
  }
  if (status === 2) {
    return 3;
  }
  if (status === 3) {
    return 0;
  }
  return status;
};

const formatImmunizationStatusForExam = (status) => {
  if (status === 0) {
    return 3;
  }
  if (status === 1) {
    return 0;
  }
  if (status === 2) {
    return 1;
  }
  if (status === 3) {
    return 2;
  }
  return status;
};

export {
  quickTestStatuses,
  getAssignQuickTestStatus,
  formatImmunizationStatusForProfile,
  formatImmunizationStatusForExam,
};
