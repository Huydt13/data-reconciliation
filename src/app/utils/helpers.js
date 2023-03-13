/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
import React from 'react';
import moment from 'moment';
import locations from 'app/assets/mock/locations.json';
import { LocationType } from 'infection-chain/utils/constants';
import _ from 'lodash';

const defaultPaging = {
  totalPages: 0,
  data: [],
};
const examinationPaging = {
  pageCount: 0,
  data: [],
};
const postPaging = {
  pageSize: 0,
  totalSize: 0,
};

const treatmentPaging = {
  pageCount: 0,
  data: [],
};

// eslint-disable-next-line no-restricted-globals
const isNumberic = (num) => !isNaN(num);

const formatVNCurrency = (number) => `${number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} ₫`;

const filterArray = (array, searchValue) => array.filter((element) => {
    const keys = Object.keys(element);
    let found = false;
    keys.forEach((key) => {
      if (
        element[key]
        && `${element[key]}`.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        found = true;
      }
    });
    return found;
  });

const compareName = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const mergeArrayObjects = (arr1, arr2) => {
  let start = 0;
  const merge = [];
  while (start < arr1.length) {
    if (
      arr1.length !== 0
      && arr2.length !== 0
      && arr1[start].time === arr2[start].time
    ) {
      // pushing the merged objects into array
      const array1 = arr1[start];
      const nameArray1 = array1.name;
      const array2 = arr2[start];
      const nameArray2 = array2.name;
      array1[nameArray1] = array1.value;
      array2[nameArray2] = array2.value;
      array1.formattedTime = moment(array1.time).format('DD-MM-YY');
      array2.formattedTime = moment(array2.time).format('DD-MM-YY');
      merge.push({ ...array1, ...array2 });
    }
    // incrementing start value
    start += 1;
  }
  return merge;
};

const deburr = (s) => {
  let result = s ?? '';
  result = result.toLowerCase();
  result = result.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  result = result.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  result = result.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  result = result.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  result = result.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  result = result.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  result = result.replace(/đ/g, 'd');
  result = result.replace(
    // eslint-disable-next-line no-useless-escape
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  result = result.replace(/ + /g, ' ');
  result = result.trim();
  return result;
};

const formatAddress = (data) => (data || []).map((e, i) => {
    let formattedFloor = '';
    let formattedBlock = '';
    let formattedStreet = '';
    let formattedWard = '';
    let formattedDistrict = '';
    // let formattedProvince = '';

    formattedFloor = e?.address?.floor ? `Tầng ${e?.address?.floor}, ` : '';
    formattedBlock = e?.address?.block ? `Lô ${e?.address?.block}, ` : '';
    formattedStreet = e?.address?.streetHouseNumber
      ? `${e?.address?.streetHouseNumber}, `
      : '';
    // formattedProvince = e?.address?.provinceValue
    //   ? locations?.find((p) => p?.value === e?.address?.provinceValue)?.label
    //   : '';
    formattedDistrict = e?.address?.districtValue && e?.address?.provinceValue
        ? `${locations
          ?.find((p) => p?.value === e?.address?.provinceValue)
          ?.districts?.find((d) => d?.value === e?.address?.districtValue)
          ?.label
        }`
        : '';
    formattedWard = e?.address?.wardValue
        && e?.address?.provinceValue
        && e?.address?.districtValue
        ? `${locations
          ?.find((p) => p?.value === e?.address?.provinceValue)
          ?.districts?.find((d) => d?.value === e?.address?.districtValue)
          ?.wards?.find((w) => w?.value === e?.address?.wardValue)?.label
        }, `
        : '';
    return {
      ...e,
      index: i + 1,
      formattedAddress:
        formattedFloor
        + formattedBlock
        + formattedStreet
        + formattedWard
        + formattedDistrict,
    };
  });

const formatObjectToAddress = (data) => {
  let formattedStreet = '';
  let formattedWard = '';
  let formattedDistrict = '';
  formattedStreet = data?.address?.streetHouseNumber
    ? `${data?.address?.streetHouseNumber}, `
    : '';
  formattedDistrict = data?.address?.districtValue && data?.address?.provinceValue
      ? `${locations
        ?.find((p) => p?.value === data?.address?.provinceValue)
        ?.districts?.find((d) => d?.value === data?.address?.districtValue)
        ?.label
      }`
      : '';
  formattedWard = data?.address?.wardValue
      && data?.address?.provinceValue
      && data?.address?.districtValue
      ? `${locations
        ?.find((p) => p?.value === data?.address?.provinceValue)
        ?.districts?.find((d) => d?.value === data?.address?.districtValue)
        ?.wards?.find((w) => w?.value === data?.address?.wardValue)?.label
      }, `
      : '';
  return formattedStreet + formattedWard + formattedDistrict;
};

const formatAddressToString = (address) => {
  let formattedStreet = '';
  let formattedWard = '';
  let formattedDistrict = '';
  formattedStreet = address?.streetHouseNumber
    ? `${address?.streetHouseNumber}, `
    : '';
  formattedDistrict = address?.districtValue && address?.provinceValue
      ? `${locations
        ?.find((p) => p?.value === address?.provinceValue)
        ?.districts?.find((d) => d?.value === address?.districtValue)
        ?.label
      ?? address?.districtValue
      ?? ''
      }`
      : '';
  formattedWard = address?.wardValue && address?.provinceValue && address?.districtValue
      ? `${locations
        ?.find((p) => p?.value === address?.provinceValue)
        ?.districts?.find((d) => d?.value === address?.districtValue)
        ?.wards?.find((w) => w?.value === address?.wardValue)?.label
      ?? address?.wardValue
      ?? ''
      }, `
      : '';
  return formattedStreet + formattedWard + formattedDistrict;
};

const formatExaminationAddressToString = (data) => {
  let formattedStreet = '';
  let formattedWard = '';
  let formattedDistrict = '';
  formattedStreet = data?.address ? `${data?.address}, ` : '';
  formattedDistrict = data?.district && data?.province
      ? `${locations
        ?.find((p) => p?.value === data?.province)
        ?.districts?.find((d) => d?.value === data?.district)?.label
      }`
      : '';
  formattedWard = data?.ward && data?.province && data?.district
      ? `${locations
        ?.find((p) => p?.value === data?.province)
        ?.districts?.find((d) => d?.value === data?.district)
        ?.wards?.find((w) => w?.value === data?.ward)?.label
      }, `
      : '';
  return formattedStreet + formattedWard + formattedDistrict;
};

const getIndexes = (arr, char) => arr.map((e, i) => (e === char ? i : '')).filter((e) => e);

const getExaminationError = (error = '') => {
  if (error && error.includes('\n')) {
    return error.substring(0, error.indexOf('\n') + 1);
  }
  return 'Đã có lỗi xảy ra';
};
const getQuarantineError = (error = '') => {
  const flag = '***Trace***';
  if (error && typeof error === 'string' && error.includes(flag)) {
    return error.substring(0, error.indexOf(flag) + 1);
  }
  return 'Đã có lỗi xảy ra';
};

const getFullLocationName = (location) => {
  let locationTypeText;
  let locationName;
  if (location.locationType === LocationType.LOCATION) {
    locationTypeText = 'Địa điểm';
    locationName = location.location?.name;
  } else if (location.locationType === LocationType.AIRPLANE) {
    locationTypeText = 'Máy bay';
    locationName = location.location?.flightNumber;
  } else {
    locationTypeText = location.location.vehicleType;
    locationName = location.location?.vehicleName;
  }
  return `${locationTypeText} - ${locationName}`;
};

const checkFilter = (oldFilter, currentFilter) => !_.isEqual(
    Object.values(oldFilter).filter(Boolean),
    Object.values(currentFilter).filter(Boolean),
  );

const formatToServerTime = (date) => date ? moment(date).format('YYYY-MM-DD') : '';
const formatToDate = (date) => (date ? moment(date).format('DD-MM-YYYY') : '');
const formatToTime = (date) => date ? moment(date).format('HH:mm | DD-MM-YYYY') : '';
const formatToYear = (date) => (date ? moment(date).format('YYYY') : '');

const calculateColumnsTotal = (info, value) => {
  const total = info.rows.reduce((sum, row) => row.values[`${value}`] + sum, 0);
  return total;
};

const renderExaminationResult = (result) => {
  const deburrResult = deburr(result);
  if (deburrResult) {
    if (deburrResult.includes(deburr('Dương'))) {
      return <b style={{ color: '#DB2729' }}>{result}</b>;
    }
    if (deburrResult.includes(deburr('Chưa'))) {
      return <span style={{ color: '#2A85D0' }}>{result}</span>;
    }
    return result;
  }
  return '';
};

const renderProfileKey = ({
  cmnd,
  cccd,
  passportNumber,
  healthInsuranceNumber,
  addressesInVietnam,
  keyWithAddress = true,
}) => {
  if (
    addressesInVietnam
    && addressesInVietnam[0]?.streetHouseNumber
    && keyWithAddress
  ) {
    return `Địa chỉ nhà: ${formatAddressToString(addressesInVietnam[0])}`;
  }
  if (cccd) {
    return `CCCD: ${cccd}`;
  }
  if (cmnd) {
    return `CMND: ${cmnd}`;
  }
  if (passportNumber) {
    return `Hộ chiếu: ${passportNumber}`;
  }
  if (healthInsuranceNumber) {
    return `BHYT: ${healthInsuranceNumber}`;
  }
  return '';
};
const renderGender = ({ gender }) => {
  if (gender === 0) {
    return 'Nữ';
  }
  if (gender === 1) {
    return 'Nam';
  }
  if (gender === 2) {
    return 'Khác';
  }
  return '';
};

const formatProfileRequest = (d) => {
  let dob = '';
  if (d.hasYearOfBirthOnly) {
    dob = `${d.dateOfBirth}-01-01`;
  } else {
    dob = d.dateOfBirth;
  }
  return {
    ...d,
    dateOfBirth: dob,
    hasYearOfBirthOnly: d.hasYearOfBirthOnly,
    addressesInVietnam: _.isPlainObject(d.addressesInVietnam)
      ? [d.addressesInVietnam]
      : d.addressesInVietnam,
    workAddresses: _.isPlainObject(d.workAddresses)
      ? [d.workAddresses]
      : d.workAddresses,
    symptoms: (d?.symptoms ?? []).map((s) => ({
      symptomId: s,
      notes: '',
      otherSymptomDescription: '',
    })),
    profileCreationReason: {
      reason: d.reasonLv1,
      reasonType: d.reasonLv1,
      // country or district
      reasonAttribute: '',
      isFromDomesticInfectedZone: d.reasonLv3?.length === 2,
      countryValue:
        d.reasonLv3?.length === 2 && !isNumberic(d.reasonLv3)
          ? d.reasonLv3
          : undefined,
      domesticInfectedProvinceValue:
        d.reasonLv3?.length === 2 && isNumberic(d.reasonLv3)
          ? d.reasonLv3
          : undefined,
      realtedPositiveProfileId:
        d.reasonLv3?.length !== 2 && isNumberic(d.reasonLv3)
          ? Number(d.reasonLv3)
          : undefined,
    },
  };
};

const readAsArrayBuffer = (blob) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result);
    };
    reader.readAsArrayBuffer(blob);
  });

const stringToArrayBuffer = (string) => {
  if (typeof ArrayBuffer !== 'undefined') {
    const buffer = new ArrayBuffer(string.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i !== string.length; i += 1) {
      view[i] = string.charCodeAt(i) & 0xff;
    }
    return buffer;
  }

  const buffer = new Array(string.length);
  for (let i = 0; i !== string.length; i += 1) {
    buffer[i] = string.charCodeAt(i) & 0xff;
  }
  return buffer;
};

const naturalCompare = (a, b) => {
  const ax = [];
  const bx = [];

  a.replace(/(\d+)|(\D+)/g, (__, $1, $2) => {
    ax.push([$1 || Infinity, $2 || '']);
  });
  b.replace(/(\d+)|(\D+)/g, (__, $1, $2) => {
    bx.push([$1 || Infinity, $2 || '']);
  });

  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();
    const nn = an[0] - bn[0] || an[1].localeCompare(bn[1]);
    if (nn) return nn;
  }

  return ax.length - bx.length;
};

const downloadFile = (file) => {
  const link = document.createElement('a');
  link.href = file;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const differenceObject = (a, b) => _.reduce(a, (result, value, key) => {
    if (_.isPlainObject(value)) {
      result[key] = differenceObject(value, b[key] || {});
    } else if (!b[key] || (b[key] && !_.isEqual(value, b[key]))) {
      result[key] = value;
    }
    return result;
  }, {});

const isEqualObject = (a, b, options = []) => {
  const difference = differenceObject(a, b);
  return Object.keys(difference).length > 0
    ? options.length > 0
      ? Object.keys(difference)
        .reduce((result, key) => {
          if (!result) { return result; }
          if (options.includes(key)) {
            return false;
          }
          return true;
        }, true)
      : !(difference.length > 0)
    : true;
};

const isUndefinedOrNullObject = (obj) => Object.keys(obj).reduce((result, key) => {
    if (!obj[key]) {
      return true;
    }
    return result;
  }, false);

export {
  // paging
  defaultPaging,
  examinationPaging,
  treatmentPaging,
  postPaging,
  // logic checkng
  isNumberic,
  // format time using momentjs
  formatToServerTime,
  formatToDate,
  formatToTime,
  formatToYear,
  // format object/text
  formatAddress,
  formatVNCurrency,
  formatObjectToAddress,
  formatAddressToString,
  formatExaminationAddressToString,
  getFullLocationName,
  renderExaminationResult,
  renderProfileKey,
  renderGender,
  // search and filter
  deburr,
  filterArray,
  // error format
  getQuarantineError,
  getExaminationError,
  // filter checking
  checkFilter,
  // format request
  formatProfileRequest,
  // others
  compareName,
  mergeArrayObjects,
  getIndexes,
  calculateColumnsTotal,
  readAsArrayBuffer,
  stringToArrayBuffer,
  naturalCompare,
  downloadFile,
  differenceObject,
  isEqualObject,
  isUndefinedOrNullObject,
};
