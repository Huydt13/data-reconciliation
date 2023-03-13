/* eslint-disable no-empty */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import moment from 'moment';
import xlsx from 'xlsx';

import { FiEdit3 } from 'react-icons/fi';
import {
  Modal, Button,
  Message, Icon,
  Header, Tab, List,
  Dimmer, Loader, Menu,
} from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import ProfileSection from 'medical-test/components/quick-test/ProfileSection';

import { useDispatch, useSelector } from 'react-redux';
import {
  getProfileWithouDispatch,
  createProfile,
  updateProfile,
  createImmunizationForProfile,
  updateImmunizationForProfile,
} from 'profile/actions/profile';
import { getSamplingPlaces, getExaminationTypes, createQuickTest } from 'medical-test/actions/medical-test';
import {
  formatProfileRequest,
  formatAddressToString,
  downloadFile,
  getExaminationError,
} from 'app/utils/helpers';
import { defaultProfileValue, formatGender } from 'profile/utils/helpers';
import { IMMUNIZATION_STATUSES } from 'profile/utils/constants';
import { formatImmunizationStatusForExam } from 'medical-test/utils/helpers';

import locations from 'app/assets/mock/locations';
import excelTemplate from 'app/assets/excels/Mẫu import Test nhanh.xlsx';

const Wrapper = styled.div`
  position: relative;
`;

const MenuWrapper = styled.div`
  margin-top: 15px;
  & .tab {
    padding-top: 0.1em !important;
  }
  & .fVDZkI {
    margin-top: 0 !important;
  }
`;

const resultsOfExam = ['Dương tính', 'Âm tính'];
const immunizationStatusOptions = [
  { key: 0, value: IMMUNIZATION_STATUSES.NO_RECORD, text: 'Chưa rõ' },
  { key: 1, value: IMMUNIZATION_STATUSES.NO_VACCINE, text: 'Chưa tiêm' },
  { key: 2, value: IMMUNIZATION_STATUSES.ONE_SHOT, text: 'Tiêm 1 mũi' },
  { key: 3, value: IMMUNIZATION_STATUSES.TWO_SHOT, text: 'Tiêm 2 mũi' },
  { key: 4, value: IMMUNIZATION_STATUSES.MORE_THAN_TWO_SHOT, text: 'Tiêm trên 2 mũi' },
];

const startWithRow = 2;
const steps = {
  downloadTemplate: 0,
  reviewData: 1,
  result: 2,
};

const ImportQuickTestModal = ({ open, onClose: onCloseProps, onRefresh }) => {
  const [step, setStep] = useState(steps.downloadTemplate);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

  const [readData, setReadData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [uploadResult, setUploadResult] = useState([]);

  const [conflictProfile, setConflictProfile] = useState(undefined);

  const method = useForm();
  const dispatch = useDispatch();
  const {
    examinationTypeList,
    samplingPlaceList,
    createImmunizationForProfileLoading,
    updateImmunizationForProfileLoading,
  } = useSelector((state) => state.medicalTest);
  const {
    updateProfileLoading,
  } = useSelector((state) => state.profile);
  const isNumber = (n) => /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  const model = useMemo(() => ([
    {
      header: 'Họ tên (*)',
      assign: 'name',
      formatter: (__, value) => value.toUpperCase().trim(),
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc nhập họ tên';
        }
        return false;
      },
    },
    {
      header: 'Năm sinh (*)',
      assign: 'dateOfBirth',
      formatter: (__, value) => `${value}-01-01`,
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc nhập năm sinh';
        }

        const year = moment().format('YYYY');
        if (parseInt(value, 10) < 1921 || parseInt(value, 10) > parseInt(year, 10)) {
          return 'Năm sinh không hợp lệ';
        }
        return false;
      },
    },
    {
      header: 'Giới tính  (Nữ/Nam) (*)',
      assign: 'gender',
      formatter: (__, value) => formatGender(value),
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc phải nhập giới tính';
        }
        return false;
      },
    },
    {
      header: 'CMND /CCCD',
      assign: 'identityCard',
    },
    {
      header: 'Điện thoại (*)',
      assign: 'phoneNumber',
      formatter: (__, value) => typeof value === 'number' ? `0${value}` : value,
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc nhập số điện thoại';
        }
        return false;
      },
    },
    {
      header: 'Tiêm vắc xin (1 mũi/2 mũi/ chưa tiêm/ không ghi nhận)',
      assign: 'vaccinationStatus',
      formatter: (__, value) => {
        const status = immunizationStatusOptions.find((p) => p.text.toUpperCase() === value.toUpperCase());
        return status?.value;
      },
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc chọn trạng thái tiêm vắc xin';
        }

        const status = immunizationStatusOptions.find((p) => p.text.toUpperCase() === value.toUpperCase());
        if (!status) {
          return 'Trạng thái tiêm vắc xin không đúng định dạng';
        }
        return false;
      },
    },
    {
      header: 'Ngày tiêm gần nhất',
      assign: 'lastInjectionDate',
      formatter: (__, value) => moment(value, 'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00'),
      validate: (obj, value) => {
        if (typeof obj.immunizationStatus === 'number') {
          if (!value && obj.immunizationStatus >= IMMUNIZATION_STATUSES.ONE_SHOT) {
            return 'Bắt buộc nhập ngày tiêm (mũi 1)';
          }

          const date = moment(value, 'DD/MM/YYYY');
          const beforeDate = moment('01/01/2021', 'DD/MM/YYYY');
          const afterDate = moment().endOf('day');
          if (date > afterDate || date < beforeDate) {
            return `Ngày tiêm phải nằm trong khoảng từ ${beforeDate.format('DD/MM/YYYY')} đến ${afterDate.format('DD/MM/YYYY')}`;
          }
        }
        return false;
      },
    },
    {
      header: 'Số nhà, tên đường (*)',
      assign: 'streetHouseNumber',
      formatter: (__, value) => `${value}`,
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc nhập địa chỉ';
        }
        return false;
      },
    },
    {
      header: 'Tỉnh/Thành phố (*)',
      assign: 'provinceValue',
      formatter: (__, value) => locations?.find((p) => p?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()))?.value,
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc nhập tỉnh/thành phố';
        }
        const province = locations?.find((p) => p?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()));
        if (!province) {
          return 'Tỉnh/Thành phố không hợp lệ';
        }
        return false;
      },
    },
    {
      header: 'Quận/Huyện/ TP/TX (*)',
      assign: 'districtValue',
      formatter: (obj, value) => locations?.find((p) => p?.value?.toLowerCase()?.includes(`${obj.provinceValue}`.toLowerCase()))
          ?.districts?.find((d) => d?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()))?.value,
      validate: (obj, value) => {
        if (!value) {
          return 'Bắt buộc nhập quận/huyện/thành phố/thị xã';
        }
        if (obj?.provinceValue) {
          const district = locations?.find((p) => p.value?.toLowerCase()?.includes(`${obj.provinceValue}`.toLowerCase()))
            ?.districts?.find((d) => d.label?.toLowerCase()?.includes(`${value}`.toLowerCase()));
          if (!district) {
            return 'Quận/Huyện/Thành phố/Thị xã không hợp lệ';
          }
        }
        return false;
      },
    },
    {
      header: 'Phường/Xã/ Thị trấn (*)',
      assign: 'wardValue',
      formatter: (obj, value) => {
        if (isNumber(value) && value.length > 2) {
          return value.padStart(5, 0);
        }
        return locations?.find((p) => p?.value?.toLowerCase()?.includes(`${obj.provinceValue}`.toLowerCase()))
          ?.districts?.find((d) => d?.value?.toLowerCase()?.includes(`${obj.districtValue}`.toLowerCase()))
          ?.wards?.find((d) => d?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()))?.value;
      },
      validate: (obj, value) => {
        if (!value) {
          return 'Bắt buộc nhập phường/xã/thị trấn';
        }
        if (obj?.provinceValue && obj?.districtValue) {
          const ward = locations?.find((p) => p?.value?.toLowerCase()?.includes(`${obj.provinceValue}`.toLowerCase()))
            ?.districts?.find((d) => d?.value?.toLowerCase()?.includes(`${obj.districtValue}`.toLowerCase()))
            ?.wards?.find((d) => d?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()));
          if (!ward) {
            if (!isNumber(value)) { return 'Phường/Xã/Thị trấn không hợp lệ'; }
          }
        }
        return false;
      },
    },
    {
      header: 'KP/ấp',
      assign: 'quarter',
      formatter: (__, value) => `${value}`,
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc nhập khu phố/ấp';
        }
        return false;
      },
    },
    {
      header: 'Tổ',
      assign: 'quarterGroup',
      formatter: (__, value) => `${value}`,
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc nhập tổ dân phố';
        }
        return false;
      },
    },
    {
      encoding: false,
      header: 'N%u01A1i%20la%u0300m%20vi%EA%u0323c%2C%20%u0111i%20ho%u0323c/%20%u1EDF%20nh%E0',
      assign: 'workplaceName',
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc nhập tên nơi làm việc';
        }
        return false;
      },
    },
    {
      encoding: false,
      header: '%u0110i%u0323a%20chi%u0309%20la%u0300m%20vi%EA%u0323c/%20%u1EDF%20nh%E0',
      assign: 'streetWorkplaceNumber',
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc nhập địa chỉ nơi làm việc';
        }
        return false;
      },
    },
    {
      header: 'Tỉnh/Thành phố',
      assign: 'workplaceProvinceValue',
      formatter: (__, value) => locations?.find((p) => p?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()))?.value,
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc nhập tỉnh/thành phố nơi làm việc';
        }
        const province = locations?.find((p) => p?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()));
        if (!province) {
          return 'Tỉnh/Thành phố nơi làm việc không hợp lệ';
        }
        return false;
      },
    },
    {
      header: 'Quận/Huyện/ TP/TX',
      assign: 'workplaceDistrictValue',
      formatter: (obj, value) => locations?.find((p) => p?.value?.toLowerCase()?.includes(`${obj.workplaceProvinceValue}`.toLowerCase()))
          ?.districts?.find((d) => d?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()))?.value,
      validate: (obj, value) => {
        if (!value) {
          return 'Bắt buộc nhập quận/huyện/thành phố/thị xã nơi làm việc';
        }
        if (obj?.workplaceProvinceValue) {
          const district = locations?.find((p) => p?.value?.toLowerCase()?.includes(`${obj.workplaceProvinceValue}`.toLowerCase()))
            ?.districts?.find((d) => d?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()));
          if (!district) {
            return 'Quận/Huyện/Thành phố/Thị xã nơi làm việc không hợp lệ';
          }
        }
        return false;
      },
    },
    {
      header: 'Phường/Xã/ Thị trấn',
      assign: 'workplaceWardValue',
      formatter: (obj, value) => {
        if (isNumber(value) && value.length > 2) {
          return value.padStart(5, 0);
        }
        return locations?.find((p) => p?.value?.toLowerCase()?.includes(`${obj.workplaceProvinceValue}`.toLowerCase()))
          ?.districts?.find((d) => d?.value?.toLowerCase()?.includes(`${obj.workplaceDistrictValue}`.toLowerCase()))
          ?.wards?.find((d) => d?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()))?.value;
      },
      validate: (obj, value) => {
        if (!value) {
          return 'Bắt buộc nhập phường/xã/thị trấn nơi làm việc';
        }
        if (obj?.workplaceProvinceValue && obj?.workplaceDistrictValue) {
          const ward = locations?.find((p) => p?.value?.toLowerCase()?.includes(`${obj.workplaceProvinceValue}`.toLowerCase()))
            ?.districts?.find((d) => d?.value?.toLowerCase()?.includes(`${obj.workplaceDistrictValue}`.toLowerCase()))
            ?.wards?.find((d) => d?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()));
          if (!ward) {
            if (!isNumber(value)) { return 'Phường/Xã/Thị trấn nơi làm việc không hợp lệ'; }
          }
        }
        return false;
      },
    },
    {
      header: 'Ngày lấy mẫu  test nhanh',
      assign: 'dateOfExam',
      formatter: (__, value) => moment(value, 'DD/MM/YYYY').format('YYYY-MM-DDT07:00:00'),
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc phải nhập ngày lấy mẫu';
        }
        const time = moment(value, 'DD/MM/YYYY');
        const afterDate = moment();
        const beforeDate = moment('').startOf('month');
        if (time > afterDate || time < beforeDate) {
          return 'Ngày lấy mẫu không hợp lệ';
        }
        return false;
      },
    },
    {
      header: 'Kêt quả test nhanh',
      assign: 'resultOfExam',
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc phải nhập kết quả';
        }

        const resultOfExam = resultsOfExam.find((r) => r.toUpperCase() === value.toUpperCase());
        if (!resultOfExam) {
          return 'Kết quả test nhanh không hợp lệ';
        }
        return false;
      },
    },
    {
      header: 'Triệu chứng (có /không)',
      assign: 'hasSymptom',
      formatter: (__, value) => !!(value && value.toUpperCase().includes('CÓ')),
    },
    {
      header: 'Lý do',
      assign: 'examinationTypeId',
      formatter: (__, value) => examinationTypeList.find(
          (s) => {
            let keyword = value.toLowerCase().trim();
            let match = /(\d+.\s+)(.*)/i.exec(keyword);
            if (match === null) {
              match = /(\d+.\s+)(.*)/i.exec(keyword);
              if (match !== null) {
                // eslint-disable-next-line prefer-destructuring
                keyword = match[2];
              }
            } else {
              // eslint-disable-next-line prefer-destructuring
              keyword = match[2];
            }
            const name = s.name.toLowerCase().trim();
            return name.includes(keyword.normalize('NFC'));
          },
        )?.id,
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buộc phải nhập lý do';
        }
        const examinationType = examinationTypeList.find(
            (s) => {
              let keyword = value.toLowerCase().trim();
              let match = /(\d+.\s+)(.*)/i.exec(keyword);
              if (match === null) {
                match = /(\d+.\s+)(.*)/i.exec(keyword);
                if (match !== null) {
                  // eslint-disable-next-line prefer-destructuring
                  keyword = match[2];
                }
              } else {
                // eslint-disable-next-line prefer-destructuring
                keyword = match[2];
              }

              const name = s.name.toLowerCase().trim();
              return name.includes(keyword.normalize('NFC'));
            },
          );
        if (!examinationType) {
          return 'Lý do không hợp lệ';
        }
        return false;
      },
    },
    {
      header: 'Nơi lấy mẫu test nhanh (loại hình)',
      assign: 'samplingPlaceId',
      formatter: (__, value) => samplingPlaceList.find(
          (s) => {
            const keyword = /(\d+.\s+)(.*)/i.exec(value.toLowerCase().trim())[2];
            const name = /(\d+.\s+)(.*)/i.exec(s.name.toLowerCase().trim())[2];
            return name.normalize('NFC') === keyword.normalize('NFC');
          },
        )?.id,
      validate: (__, value) => {
        if (!value) {
          return 'Bắt buôc phải nhập nơi lấy mẫu (loại hình)';
        }
        const samplingPlace = samplingPlaceList.find(
            (s) => {
              const keyword = /(\d+.\s+)(.*)/i.exec(value.toLowerCase().trim())[2];
              const name = /(\d+.\s+)(.*)/i.exec(s.name.toLowerCase().trim())[2];
              return name.normalize('NFC') === keyword.normalize('NFC');
            },
          );
        if (!samplingPlace) {
          return 'Nơi lấy mẫu không hợp lệ';
        }
        return false;
      },
    },
    {
      encoding: false,
      header: 'Th%F4ng%20tin%20di%20chuy%u1EC3n',
      assign: 'initialMovingInformation',
    },
  ]), [samplingPlaceList, examinationTypeList]);
  const exception = useMemo(() => (['STT']), []);

  const refresh = () => {
    setStep(steps.downloadTemplate);
    setDisabled(false);
    setSelectedFile(null);
    setReadData([]);
    setErrorData([]);
    setUploadResult([]);
  };
  const onClose = () => {
    refresh();
    onCloseProps();
    onRefresh();
  };

  // #region Check format
  const checkFormatFile = useCallback((binary) => {
    try {
      const book = xlsx.read(binary, {
        type: 'binary',
        cellDates: true,
        cellNF: false,
        cellText: false,
      });

      const sheet = book.Sheets[book.SheetNames[0]];
      const json = xlsx.utils.sheet_to_json(sheet, { range: startWithRow - 1 });
      if (json.length > 0) {
        const modelHeader = model.map((m) => {
          if (typeof m.encoding !== 'undefined') {
            if (m.encoding) {
              return escape(m.header);
            }
            return m.header;
          }
          return escape(m.header);
        });
        const header = Object.values(json[0]).filter((key) => {
          const convertedKey = key.replace(/(\r\n|\n|\r)/gm, '').trim();
          return modelHeader.includes(escape(convertedKey));
        });
        return modelHeader.length === header.length;
      }
    } catch (e) { }
    return false;
  }, [model]);
  // #endregion

  // #region Parse data
  const parseData = useCallback((binary) => {
    try {
      const book = xlsx.read(binary, {
        type: 'binary',
        cellDates: true,
        cellNF: false,
        cellText: false,
      });

      const sheet = book.Sheets[book.SheetNames[0]];
      const rawData = xlsx.utils.sheet_to_json(sheet, { range: startWithRow })
        .map((row) => Object.keys(row).reduce((obj, key) => {
            const convertedKey = key.replace(/(\r\n|\n|\r)/gm, '').trim();
            if (!exception.includes(convertedKey)) {
              obj[escape(convertedKey)] = row[key];
            }
            return obj;
          }, {}),
        )
        .filter((row) => Object.keys(row).length > 0);
      const parserData = rawData.map((row, index) => model.reduce((obj, props) => {
          const header = typeof props.encoding !== 'undefined'
              ? props.encoding
                ? escape(props.header)
                : props.header
              : escape(props.header);
          const resultOfValidation = props?.validate ? props.validate(obj, row[header]) : false;
          if (resultOfValidation) {
            if (typeof obj.errors === 'undefined') {
              obj.errors = {
                row: index + 1,
                messages: [],
              };
            }
            obj.errors.messages.push(resultOfValidation);
          } else if (typeof row[header] !== 'undefined' && row[header] !== '') {
            obj[props.assign] = props?.formatter
                ? props.formatter(obj, row[header])
                : row[header];
          }
          return obj;
        }, {}),
      );
      setReadData(parserData.filter((d) => !d?.errors));
      setErrorData(parserData.filter((d) => d?.errors));
    } catch (e) {
      toast.warn('Tệp tin không đúng định dạng');
    }
  }, [model, exception]);
  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      if (reader.readAsBinaryString) {
        reader.onload = () => {
          const validation = checkFormatFile(reader.result);
          if (validation) {
            parseData(reader.result);
            setStep(steps.reviewData);
          } else {
            toast.warn('Tệp tin không đúng định dạng');
          }
        };
        reader.readAsBinaryString(selectedFile);
      }
    }
    // eslint-disable-next-line
  }, [selectedFile]);
  // #endregion

  // #region Upload data
  const formatRequestForProfile = (d) => ({
    fullName: d.name,
    gender: d.gender,
    cmnd:
      d?.identityCard
        ? d.identityCard.length !== 12
          ? `${d.identityCard}`
          : null
        : null,
    cccd:
      d?.identityCard
        ? d.identityCard.length === 12
          ? `${d.identityCard}`
          : null
        : null,
    phoneNumber: d.phoneNumber,
    dateOfBirth: d.dateOfBirth,
    hasYearOfBirthOnly: false,
    nationality: 'vn',
    initialMovingInformation: d?.initialMovingInformation ?? '',
    workAddresses: [{
      provinceValue: d.workplaceProvinceValue,
      districtValue: d.workplaceDistrictValue,
      wardValue: d.workplaceWardValue,
      streetHouseNumber: d.streetWorkplaceNumber,
    }],
    addressesInVietnam: [{
      provinceValue: d.provinceValue,
      districtValue: d.districtValue,
      wardValue: d.wardValue,
      quarter: d.quarter,
      quarterGroup: d.quarterGroup,
      streetHouseNumber: d.streetHouseNumber,
    }],
    immunizations: [{
      disease: 'Covid-19',
      immunizationStatus: d.vaccinationStatus,
      // vaccine: d.vaccine,
      injectionDate:
        d?.lastInjectionDate
          ? moment(d.lastInjectionDate).format('YYYY-MM-DDT00:00:00+07:00')
          : null,
    }],
    symptoms: [],
    profileCreationReason: {
      reason: examinationTypeList.find((e) => e.id === d.examinationTypeId).name,
      reasonType: examinationTypeList.find((e) => e.id === d.examinationTypeId).name,
    },
  });
  const formatRequestForImmunization = (d, id, profileId) => ({
    id,
    guid: id,
    profileId,
    disease: 'Covid-19',
    immunizationStatus: d.immunizationStatus,
    // vaccine: d.vaccine,
    injectionDate:
      d?.injectionDate
        ? moment(d.injectionDate).format('YYYY-MM-DDT00:00:00+07:00')
        : null,
  });
  const formatRequestForQuickTest = (d, profileId) => ({
    profileId,
    addressName: d.workplaceName,
    houseNumber: d.streetWorkplaceNumber,
    provinceCode: d.workplaceProvinceValue,
    districtCode: d.workplaceDistrictValue,
    wardCode: d.workplaceWardValue,
    hasSymptom: d.hasSymptom,
    vaccinationStatus: formatImmunizationStatusForExam(d.vaccinationStatus),
    lastInjectionDate:
      d?.lastInjectionDate
        ? moment(d.lastInjectionDate).format('YYYY-MM-DDT00:00:00+07:00')
        : null,
    date: moment(d.dateOfExam).format('YYYY-MM-DDT00:00:00+07:00'),
    result: d.resultOfExam,
    samplingPlaceId: d.samplingPlaceId,
    examinationTypeId: d.examinationTypeId,
  });
  const getImportError = (errorResponse = { response: {} }, profileId = undefined) => {
    const resultError = {
      succeed: false,
      message: 'Lỗi không xác định',
    };
    if (errorResponse.response?.data) {
      if (typeof errorResponse.response.data === 'object') {
        const { errors, errorMessage } = errorResponse.response?.data;
        if (errors) {
          resultError.message = Object.values(errors).map((error) => error.join('')).join(', ');
        }
        if (errorMessage) {
          if (errorMessage.includes('Conflicted')) {
            resultError.message = 'Xung đột thông tin hồ sơ';
            resultError.profileId = profileId;
          } else if (errorMessage.includes('Trùng')) {
            resultError.message = 'Mẫu đã được ghi nhận';
          } else {
            const examinationError = getExaminationError(errorMessage);
            if (examinationError) {
              resultError.message = examinationError;
            }
          }
        }
      } else if (typeof errorResponse.response.data === 'string') {
        if (errorResponse.response.data.includes('Record is existed or only update') || errorResponse.response.data.includes('Record is existed but dates are not the same')) {
          resultError.message = 'Xung đột tiền sử tiêm chủng';
          resultError.profileId = profileId;
        } else {
          const examinationError = getExaminationError(errorResponse.response.data);
          if (examinationError) {
            resultError.message = examinationError;
          }
        }
      }
    }
    return resultError;
  };
  const uploadData = async () => {
    setLoading(true);
    for (const row of readData) {
      let profileIdValue;
      try {
        // Create profile
        const { profileId, isConflicted } = await dispatch(createProfile(formatRequestForProfile(row), false));
        profileIdValue = profileId;

        if (isConflicted) {
          setUploadResult((rl) => ([...rl, { ...row, result: { succeed: false, profileId, message: 'Xung đột hồ sơ' } }]));
          // eslint-disable-next-line no-continue
          continue;
        }
        // Create/Update immunization for profile
        await dispatch(createImmunizationForProfile(formatRequestForImmunization(row, undefined, profileId)));
        // Create quicktest for profile
        await dispatch((createQuickTest(formatRequestForQuickTest(row, profileId))));
        setUploadResult((r) => ([...r, { ...row, result: { succeed: true } }]));
      } catch (e) {
        const error = getImportError(e, profileIdValue);
        setUploadResult((r) => ([...r, { ...row, result: { ...error } }]));
      }
    }

    setLoading(false);
    setStep(steps.result);
  };
  // #endregion

  // #region Resolve data
  const getProfile = async (row, id) => {
    try {
      const profile = await getProfileWithouDispatch(id);
      setConflictProfile({
        row,
        raw: formatRequestForProfile(row),
        exist: profile,
      });
      // eslint-disable-next-line no-empty
    } catch (e) { }
  };
  const updateConflictProfile = async (d) => {
    try {
      await dispatch(updateProfile(formatProfileRequest(d), false));
      if (d?.immunizations && d.immunizations.length > 0) {
        const immunization = d.immunizations[0];
        const conflictImmunization = conflictProfile.exist?.immunizations[0];
        if (typeof conflictImmunization !== 'undefined' && typeof conflictImmunization.immunizationStatus === 'number') {
          if (typeof immunization.immunizationStatus === 'number' && immunization.immunizationStatus === conflictImmunization.immunizationStatus) {
            immunization.guid = conflictImmunization?.guid;
          }
        }
        await dispatch(
          immunization?.guid
            ? updateImmunizationForProfile(
              formatRequestForImmunization(immunization, immunization.guid, d.id),
            )
            : createImmunizationForProfile(
              formatRequestForImmunization(immunization, undefined, d.id),
            ),
        );
      }

      method.reset(defaultProfileValue);
      setUploadResult((r) => {
        const reduce = r.reduce((result, row) => {
          if (row.result.profileId === d.id) {
            return [...result, { ...row, result: { succeed: false, profileId: row.result.profileId, message: 'Đã chỉnh sửa, cần upload lại' } }];
          }
          return [...result, row];
        }, []);
        return reduce;
      });
    } catch (e) {
      setUploadResult((r) => {
        const reduce = r.reduce((result, row) => {
          if (row.result.profileId === d.id) {
            const error = getImportError(e);
            if (!error?.message || error.message.includes('Lỗi không xác định')) {
              return [...result, { ...row, result: { ...error } }];
            }
            return [...result, { ...row, result: { ...error, profileId: row.result.profileId } }];
          }
          return [...result, row];
        }, []);
        return reduce;
      });
    } finally {
      setConflictProfile(undefined);
    }
  };
  const resolveData = async () => {
    setLoading(true);
    const resolveList = uploadResult.filter((u) => u?.result?.message && u.result.message.includes('Đã chỉnh sửa'));
    for (const resolve of resolveList) {
      try {
        await dispatch(createQuickTest(formatRequestForQuickTest(resolve, resolve.result.profileId)));
        setUploadResult((r) => {
          const reduce = r.reduce((result, row) => {
            if (row.result.profileId === resolve.result.profileId) {
              return [...result, { ...row, result: { succeed: true } }];
            }
            return [...result, row];
          }, []);
          return reduce;
        });
      } catch (e) {
        setUploadResult((r) => {
          const reduce = r.reduce((result, row) => {
            if (row.result.profileId === resolve.result.profileId) {
              return [...result, { ...row, result: { ...getImportError(e) } }];
            }
            return [...result, row];
          }, []);
          return reduce;
        });
      }
    }

    setLoading(false);
  };
  // #endregion

  // #region Component
  const jsx_immunization = useCallback(({ vaccinationStatus, lastInjectionDate }) => (
    <div>
      {typeof vaccinationStatus !== 'undefined' ? (
        <Header sub>
          {immunizationStatusOptions.find((o) => o.value === vaccinationStatus)?.text ?? ''}
        </Header>
      ) : null}
      {typeof lastInjectionDate !== 'undefined' && vaccinationStatus !== 0 && vaccinationStatus !== 3 ? (
        <span>{moment(lastInjectionDate).format('DD-MM-YYYY')}</span>
      ) : null}
    </div>
  ), []);

  const dataColumns = useMemo(() => [
    {
      Header: '#',
      accessor: 'index',
    },
    {
      Header: 'Họ tên',
      accessor: 'name',
    },
    {
      Header: 'Năm sinh',
      formatter: ({ dateOfBirth }) => moment(dateOfBirth).format('YYYY'),
    },
    {
      Header: 'Số điện thoại',
      accessor: 'phoneNumber',
    },
    {
      Header: 'Địa chỉ',
      formatter: ({ streetHouseNumber, provinceValue, districtValue, wardValue }) => formatAddressToString({
          streetHouseNumber,
          provinceValue,
          districtValue,
          wardValue,
        }),
      cutlength: 30,
    },
    {
      Header: 'Tiền sử tiêm chủng',
      formatter: (d) => jsx_immunization(d),
    },
    {
      Header: 'Triệu chứng',
      formatter: ({ hasSymptom }) => hasSymptom ? 'Có' : 'Không',
    },
    {
      Header: 'Thông tin lấy mẫu',
      formatter: ({ dateOfExam, samplingPlaceId }) => {
        const samplingPlace = samplingPlaceList?.find((e) => e.id === samplingPlaceId);
        return (
          <div>
            <Header sub>
              {samplingPlace?.name}
            </Header>
            <span>{moment(dateOfExam).format('DD-MM-YYYY')}</span>
          </div>
        );
      },
    },
    {
      Header: 'Lý do lấy mẫu',
      formatter: ({ examinationTypeId }) => examinationTypeList?.find((e) => e.id === examinationTypeId)?.name,
    },
    {
      Header: 'Kết quả',
      formatter: ({ resultOfExam }) => (
        <Header sub>{resultOfExam}</Header>
      ),
    },
  ], [samplingPlaceList, examinationTypeList, jsx_immunization]);
  const errorColumns = useMemo(() => ([
    {
      Header: 'Hàng',
      formatter: ({ errors }) => (
        <Header sub>{errors?.row}</Header>
      ),
    },
    {
      Header: ' ',
      formatter: ({ errors }) => errors?.messages
        ? (
          <List divided relaxed>
            {errors.messages.map((m) => (
              <List.Item key={m}>
                <List.Icon name="x" color="red" verticalAlign="middle" />
                <List.Content>
                  <List.Description>{m}</List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>
        ) : null,
    },
  ]), []);
  const jsx_menuTable = useMemo(() => {
    const panes = [
      {
        menuItem: `Dữ liệu đọc được (${readData.length})`,
        render: () => (
          <Tab.Pane>
            <DataTable
              columns={dataColumns}
              data={readData.map((d, i) => ({ ...d, index: i + 1 }))}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: `Dữ liệu bị lỗi (${errorData.length})`,
        render: () => (
          <Tab.Pane>
            <DataTable
              columns={errorColumns}
              data={errorData.map((e, i) => ({ ...e, index: i + 1 }))}
            />
          </Tab.Pane>
        ),
      },
    ];

    return (
      <MenuWrapper>
        <Tab panes={panes} renderActiveOnly />
      </MenuWrapper>
    );
  }, [readData, errorData, dataColumns, errorColumns]);

  const resultColumns = useMemo(() => ([
    {
      Header: '#',
      accessor: 'index',
    },
    {
      Header: 'Họ tên',
      accessor: 'name',
    },
    {
      Header: 'Năm sinh',
      formatter: ({ dateOfBirth }) => moment(dateOfBirth).format('YYYY'),
    },
    {
      Header: 'Số điện thoại',
      accessor: 'phoneNumber',
    },
    {
      Header: 'Địa chỉ',
      formatter: ({ streetHouseNumber, provinceValue, districtValue, wardValue }) => formatAddressToString({
          streetHouseNumber,
          provinceValue,
          districtValue,
          wardValue,
        }),
      cutlength: 30,
    },
    {
      Header: 'Tiền sử tiêm chủng',
      formatter: (d) => jsx_immunization(d),
    },
    {
      Header: 'Triệu chứng',
      formatter: ({ hasSymptom }) => hasSymptom ? 'Có' : 'Không',
    },
    {
      Header: 'Thông tin lấy mẫu',
      formatter: ({ dateOfExam, samplingPlaceId }) => {
        const samplingPlace = samplingPlaceList?.find((e) => e.id === samplingPlaceId);
        return (
          <div>
            <Header sub>
              {samplingPlace?.name}
            </Header>
            <span>{moment(dateOfExam).format('DD-MM-YYYY')}</span>
          </div>
        );
      },
    },
    {
      Header: 'Lý do lấy mẫu',
      formatter: ({ examinationTypeId }) => examinationTypeList?.find((e) => e.id === examinationTypeId)?.name,
    },
    {
      Header: 'Kết quả',
      formatter: ({ resultOfExam }) => (
        <Header sub>{resultOfExam}</Header>
      ),
    },
    {
      Header: ' ',
      formatter: (r) => (
        <>
          <Icon name="info circle" />
          {' '}
          {
            r?.result?.succeed ? 'Thành công' : r?.result?.message}
        </>
      ),
    },
  ]), [samplingPlaceList, examinationTypeList, jsx_immunization]);
  const jsx_menuResultTable = useMemo(() => {
    const panes = [];
    const success = uploadResult.filter((u) => u?.result?.succeed);
    const error = uploadResult.filter((u) => !u?.result?.succeed && !u?.result?.profileId);
    const resolve = uploadResult.filter((u) => !u?.result?.succeed && u?.result?.profileId);
    if (success.length > 0) {
      panes.push({
        menuItem: (
          <Menu.Item key="success">
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            <span style={{ fontWeight: '700' }}>Thành công</span>&nbsp;
            {' '}
            (
            {success.length}
            )
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <DataTable
              columns={resultColumns}
              data={success.map((d, i) => ({ ...d, index: i + 1 }))}
            />
          </Tab.Pane>
        ),
      });
    }
    if (resolve.length > 0) {
      panes.push({
        menuItem: (
          <Menu.Item key="resolve">
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            <span style={{ fontWeight: '700' }}>Cần chỉnh sửa</span>&nbsp;
            {' '}
            (
            {resolve.length}
            )
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <DataTable
              columns={resultColumns}
              data={resolve.map((d, i) => ({ ...d, index: i + 1 }))}
              actions={[
                {
                  icon: <FiEdit3 />,
                  color: 'purple',
                  title: 'Cập nhật hồ sơ',
                  onClick: (r) => getProfile(r, r?.result?.profileId),
                  hidden: (r) => !r?.result?.profileId,
                },
              ]}
            />
          </Tab.Pane>
        ),
      });
    }
    if (error.length > 0) {
      panes.push({
        menuItem: (
          <Menu.Item key="error">
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            <span style={{ fontWeight: '700' }}>Lỗi</span>&nbsp;
            {' '}
            (
            {error.length}
            )
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <DataTable
              columns={resultColumns}
              data={error.map((d, i) => ({ ...d, index: i + 1 }))}
            />
          </Tab.Pane>
        ),
      });
    }

    return (
      <MenuWrapper>
        <Tab panes={panes} defaultActiveIndex={0} renderActiveOnly />
      </MenuWrapper>
    );
    // eslint-disable-next-line
  }, [uploadResult, resultColumns]);

  const jsx_downloadTemplate = useMemo(() => (
    <Message
      info
      icon
      style={{ marginBottom: 0, cursor: 'pointer' }}
      onClick={() => downloadFile(excelTemplate)}
    >
      <Icon name="download" />
      <Message.Content>
        <Message.Header>Tải tệp tin mẫu</Message.Header>
        Sử dụng tệp tin mẫu, để đảm bảo dữ liệu chính xác
      </Message.Content>
    </Message>
  ), []);

  const jsx_content = useMemo(() => {
    switch (step) {
      case steps.downloadTemplate:
        return jsx_downloadTemplate;
      case steps.reviewData:
        return jsx_menuTable;
      case steps.result:
        return jsx_menuResultTable;
      default:
        return jsx_downloadTemplate;
    }
  }, [step, jsx_downloadTemplate, jsx_menuTable, jsx_menuResultTable]);
  // #endregion

  useEffect(() => {
    if (examinationTypeList.length === 0) {
      dispatch(getExaminationTypes());
    }
    if (samplingPlaceList.length === 0) {
      dispatch(getSamplingPlaces());
    }
  });
  useEffect(() => {
    if (errorData.length === 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [errorData]);
  useEffect(() => {
    if (uploadResult.filter((u) => u?.result?.message && u.result.message.includes('Đã chỉnh sửa')).length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [uploadResult]);

  return (
    <>
      <Modal open={open} size={step !== steps.downloadTemplate ? 'fullscreen' : undefined} onClose={onClose}>
        <Modal.Header>Nạp dữ liệu từ file Excel</Modal.Header>
        <Modal.Content>
          <Wrapper>
            <Dimmer inverted active={loading}>
              <Loader />
            </Dimmer>
            <div>
              <Button
                icon="upload"
                labelPosition="right"
                color="green"
                content="Chọn File"
                onClick={() => {
                  refresh();
                  fileInputRef.current.click();
                }}
              />
              {selectedFile ? (
                <span style={{ marginLeft: '10px', fontWeight: '700' }}>{selectedFile.name}</span>
              ) : null}
            </div>
            <input
              hidden
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                setSelectedFile(e.target.files[0]);
              }}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            {jsx_content}
          </Wrapper>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content="Xác nhận"
            disabled={disabled || loading}
            onClick={() => {
              if (uploadResult.filter((u) => u?.result?.message && u.result.message.includes('Đã chỉnh sửa')).length > 0) {
                resolveData();
              } else {
                uploadData();
              }
            }}
          />
          <Button
            negative
            labelPosition="right"
            icon="close"
            content="Đóng"
            onClick={onClose}
          />
        </Modal.Actions>
      </Modal>
      <Modal open={Boolean(conflictProfile?.exist?.id)} onClose={() => setConflictProfile(undefined)}>
        <Modal.Header>{conflictProfile?.exist?.fullName}</Modal.Header>
        <Modal.Content>
          <div className="ui form">
            <FormProvider {...method}>
              <ProfileSection
                initialSubject={conflictProfile?.exist}
                conflictSubject={conflictProfile?.raw}
                onChange={() => { }}
              />
            </FormProvider>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content="Xác nhận"
            loading={updateProfileLoading || createImmunizationForProfileLoading || updateImmunizationForProfileLoading}
            onClick={method.handleSubmit(updateConflictProfile)}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

ImportQuickTestModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
};

ImportQuickTestModal.defaultProps = {
  open: false,
  onClose: () => { },
  onRefresh: () => { },
};

export default ImportQuickTestModal;
