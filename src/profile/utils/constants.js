const ReasonTypes = {
  isF0: 1,
  isF11: 2,
  isF12: 3,
  isF21: 4,
  isCountry: 5,
  isProvince: 6,
  isContact: 7,
};

const ReasonOptions = [
  { value: ReasonTypes.isF0, text: 'Tìm kiếm F0' },
  { value: ReasonTypes.isF11, text: 'Tìm kiếm F11' },
  { value: ReasonTypes.isF12, text: 'Tìm kiếm F12' },
  { value: ReasonTypes.isF21, text: 'Tìm kiếm F21' },
  { value: ReasonTypes.isCountry, text: 'Về từ quốc gia' },
  { value: ReasonTypes.isProvince, text: 'Về từ tỉnh/thành phố' },
  { value: ReasonTypes.isContact, text: 'Mốc dịch tễ' },
];

const IMMUNIZATION_STATUSES = {
  NO_RECORD: 0,
  NO_VACCINE: 1,
  ONE_SHOT: 2,
  TWO_SHOT: 3,
  MORE_THAN_TWO_SHOT: 4,
};

const INFECTIOUS_STATUSES = {
  NEGATIVE: 0,
  POSITIVE: 1,
};

const INFECTIOUS_REASONS = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  NOT_A: 4,
  NOT_D: 5,
  OVER_POSITIVE_TIME: 6,
};



export { ReasonTypes, ReasonOptions, IMMUNIZATION_STATUSES, INFECTIOUS_STATUSES, INFECTIOUS_REASONS };
