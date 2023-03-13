/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { IMMUNIZATION_STATUSES, INFECTIOUS_REASONS, INFECTIOUS_STATUSES } from 'profile/utils/constants';

const defaultProfileValue = {
  id: 0,
  guid: '',
  cccd: '',
  cmnd: '',
  healthInsuranceNumber: '',
  passportNumber: '',
  fullName: '',
  gender: '',
  nationality: 'vn',
  religion: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  hasYearOfBirthOnly: true,
  job: '',
  initialMovingInformation: '',
  addressesInVietnam: [
    {
      id: 0,
      guid: '',
      name: '',
      room: '',
      floor: '',
      block: '',
      provinceValue: '79',
      districtValue: '',
      wardValue: '',
      quarter: '',
      quarterGroup: '',
      streetHouseNumber: '',
      locationType: '',
    },
  ],
  workAddresses: [
    {
      id: 0,
      guid: '',
      name: '',
      room: '',
      floor: '',
      block: '',
      provinceValue: '',
      districtValue: '',
      wardValue: '',
      quarter: '',
      quarterGroup: '',
      streetHouseNumber: '',
      locationType: '',
    },
  ],
  immunizations: [],
};

const immunizationStatusOptions = [
  { key: 0, value: IMMUNIZATION_STATUSES.NO_RECORD, text: 'Chưa rõ' },
  { key: 1, value: IMMUNIZATION_STATUSES.NO_VACCINE, text: 'Chưa tiêm' },
  { key: 2, value: IMMUNIZATION_STATUSES.ONE_SHOT, text: 'Đã tiêm 1 mũi' },
  { key: 3, value: IMMUNIZATION_STATUSES.TWO_SHOT, text: 'Đã tiêm 2 mũi' },
  { key: 4, value: IMMUNIZATION_STATUSES.MORE_THAN_TWO_SHOT, text: 'Đã tiêm hơn 2 mũi' },
];

const vaccineTypeOptions = ['Abdala', 'Hayat-Vax', 'Pfizer', 'Janssen', 'Moderna', 'Vero-Cell', 'Sputnik-V', 'AstraZeneca']
  .map((v) => ({
    value: v,
    text: v,
  }));

const infectiousStatusOptions = [
  { value: INFECTIOUS_STATUSES.POSITIVE, text: 'Dương tính' },
  { value: INFECTIOUS_STATUSES.NEGATIVE, text: 'Âm tính' },
];

const infectiousReasonOptions = [
  { value: INFECTIOUS_REASONS.A, text: 'Xét nghiệm PCR dương tính' },
  { value: INFECTIOUS_REASONS.B, text: 'Xét nghiệm nhanh dương tính với tầm soát người nguy cơ rất cao F1' },
  { value: INFECTIOUS_REASONS.C, text: 'Xét nghiệm nhanh dương tính với nghi ngờ nhiễm covid 19' },
  { value: INFECTIOUS_REASONS.D, text: 'Xét nghiệm nhanh hai lần dương tính' },
  { value: INFECTIOUS_REASONS.NOT_A, text: 'Xét nghiệm PCR âm tính' },
  { value: INFECTIOUS_REASONS.NOT_D, text: 'Xét nghiệm nhanh hai lần âm tính' },
  { value: INFECTIOUS_REASONS.OVER_POSITIVE_TIME, text: 'Vượt quá 14 ngày' },
];

const formatGender = (gender = '') => {
  switch (gender.toUpperCase()) {
    case 'NỮ':
      return 0;
    case 'NAM':
      return 1;
    default:
      return 2;
  }
};

const renderInfectiousStatus = (value) => {
  const status = infectiousStatusOptions.find((s) => s.value === value);
  if (status) {
    if (status.value === INFECTIOUS_STATUSES.POSITIVE) {
      return (
        <b style={{ color: '#DB2729' }}>{status.text}</b>
      );
    }
    return status.text;
  }
  return null;
};

const renderInfectiousReason = (value) => {
  const reason = infectiousReasonOptions.find((s) => s.value === value);
  return reason?.text ?? null;
};

export {
  defaultProfileValue,
  immunizationStatusOptions,
  vaccineTypeOptions,
  infectiousStatusOptions,
  infectiousReasonOptions,
  formatGender,
  renderInfectiousStatus,
  renderInfectiousReason,
};
