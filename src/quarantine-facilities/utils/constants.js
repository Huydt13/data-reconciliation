const FacilityOptions = [
  { text: 'Cách ly tập trung', value: 0 },
  { text: 'Cách ly điều trị', value: 1 },
  { text: 'Bệnh viện', value: 2 },
];

const FacilityStatisticType = {
  SHEET1: 1,
  SHEET2: 2,
  SHEET3: 3,
  SHEET4: 4,
  SHEET5: 5,
  SHEET6: 6,
  SHEET7: 7,
  SHEET8: 8,
  SHEET9: 9,
};

const FacilityStatisticOptions = [
  { text: 'KCL KS-TP-QĐ-Khác', value: FacilityStatisticType.SHEET1 },
  { text: 'DS ra KCL KS', value: FacilityStatisticType.SHEET2 },
  { text: 'DS hiện diện KCL KS', value: FacilityStatisticType.SHEET3 },
  { text: 'DS ra KCL TP', value: FacilityStatisticType.SHEET4 },
  { text: 'DS hiện diện KCL TP ', value: FacilityStatisticType.SHEET5 },
  { text: 'KCL Q.H', value: FacilityStatisticType.SHEET6 },
  { text: 'Cach ly tai nha', value: FacilityStatisticType.SHEET7 },
  { text: 'DS ra KCL QH', value: FacilityStatisticType.SHEET8 },
  { text: 'DS hien dien KCL QH', value: FacilityStatisticType.SHEET9 },
];

export { FacilityOptions, FacilityStatisticType, FacilityStatisticOptions };
