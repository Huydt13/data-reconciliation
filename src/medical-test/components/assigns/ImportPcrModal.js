/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable arrow-parens */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import xlsx from 'xlsx';

import { FiEdit3 } from 'react-icons/fi';
import {
  Modal,
  Button,
  Message,
  Icon,
  Header,
  Tab,
  List,
  Dimmer,
  Loader,
  Menu,
} from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import ProfileSection from 'medical-test/components/quick-test/ProfileSection';

import { useDispatch, useSelector } from 'react-redux';
import {
  getProfileWithouDispatch,
  updateProfile,
  updateImmunizationForProfile,
  createImmunizationForProfile,
} from 'profile/actions/profile';
import {
  getSamplingPlaces,
  getExaminationTypes,
} from 'medical-test/actions/medical-test';
import {
  formatProfileRequest,
  downloadFile,
  getExaminationError,
  formatAddressToString,
} from 'app/utils/helpers';

import locations from 'app/assets/mock/locations';
import excelTemplate from 'app/assets/excels/Mẫu import PCR.xlsx';
import { IMMUNIZATION_STATUSES } from 'profile/utils/constants';
import { createPcrExamination } from 'medical-test/actions/transport';
import { defaultProfileValue } from 'profile/utils/helpers';

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

const startWithRow = 2;
const steps = {
  downloadTemplate: 0,
  reviewData: 1,
  result: 2,
};

const ImportPcrModal = ({ open, onClose: onCloseProps }) => {
  const [step, setStep] = useState(steps.downloadTemplate);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const method = useForm();

  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

  const [informationData, setInformationData] = useState(undefined);
  const [readData, setReadData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [uploadResult, setUploadResult] = useState([]);

  const [conflictProfile, setConflictProfile] = useState(undefined);

  const dispatch = useDispatch();
  const {
    examinationTypeList,
    samplingPlaceList,
    createImmunizationForProfileLoading,
    updateImmunizationForProfileLoading,
  } = useSelector((state) => state.medicalTest);
  const { updateProfileLoading } = useSelector((state) => state.profile);

  const exception = useMemo(() => ['#'], []);
  const empty = useMemo(
    () => ['__EMPTY', 'Mã Tổng Hợp', 'Hình thức lấy mẫu'],
    []
  );
  const immunizationStatusOptions = [
    { key: 0, value: IMMUNIZATION_STATUSES.NO_RECORD, text: 'Chưa rõ' },
    { key: 1, value: IMMUNIZATION_STATUSES.NO_VACCINE, text: 'Chưa tiêm' },
    { key: 2, value: IMMUNIZATION_STATUSES.ONE_SHOT, text: 'Tiêm 1 mũi' },
    { key: 3, value: IMMUNIZATION_STATUSES.TWO_SHOT, text: 'Tiêm 2 mũi' },
    {
      key: 4,
      value: IMMUNIZATION_STATUSES.MORE_THAN_TWO_SHOT,
      text: 'Tiêm trên 2 mũi',
    },
  ];
  const errorCode = {
    NULL_UNIT: 'Lỗi: không tìm thấy đơn vị',
    CODE_HAS_BEEN_USED: 'Lỗi: Mã đã được dùng',
    CODE_HAS_BEEN_ISSUED: 'Lỗi: Mã chưa được cấp',
    NULL_DISEASE: 'Lỗi: Không xác định loại bệnh',
    NULL_EXAM_TYPE: 'Lỗi: Không xác định loại xét nghiệm',
    NULL_DISEASE_SAMPLE: 'Lỗi: Không xác định mẫu bệnh phẩm',
    SINGLE_PROFILE_MODIFY_FAILED: 'Lỗi: Tạo/Chỉnh sửa hồ sơ đơn thất bại',
    GROUP_PROFILE_MODIFY_FAILED: 'Lỗi: Tạo/Chỉnh sủa hồ sơ gộp thất bại',
    NULL_SAMPLING_PLACE: 'Lỗi: Nơi lấy mẫu không hợp lệ',
    OVER_DATE_TAKEN: 'Lỗi: Ngày lấy mẫu đã quá 7 ngày',
  };
  const informationModels = useMemo(
    () => [
      {
        row: 2,
        column: 4,
        name: 'nameOfImporter',
      },
      {
        row: 2,
        column: 12,
        name: 'phoneNumberOfImporter',
      },
      {
        row: 2,
        column: 16,
        name: 'unitOfImporter',
      },
      {
        row: 6,
        column: 1,
        name: 'feeType',
        formatter: (__, value) => `${value}`,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc phải chọn loại hình thu phí';
          }
          return false;
        },
      },
      {
        row: 6,
        column: 5,
        name: 'dateTaken',
        formatter: (__, value) => ({
          ...__.dateTaken,
          day: value,
        }),
        validate: (__, value) => {
          const parsed = parseInt(value, 10);
          const day = moment().format('DD');
          if (!value) {
            return 'Bắt buộc phải nhập ngày lấy mẫu';
          }
          if (parsed > 31 || parsed < 0) {
            return 'Ngày bắt đầu lấy mẫu không đúng định dạng (31 > ngày > 0)';
          }
          return false;
        },
      },
      {
        row: 6,
        column: 6,
        name: 'dateTaken',
        formatter: (__, value) => ({
          ...__.dateTaken,
          month: value - 1,
        }),
        validate: (__, value) => {
          const parsed = parseInt(value, 10);
          const month = moment().format('MM');
          if (!value) {
            return 'Bắt buộc phải nhập tháng lấy mẫu';
          }
          if (parsed > parseInt(month, 10) || parsed < 0) {
            return `Tháng bắt đầu lấy mẫu không đúng định dạng (${month} > tháng > 0)`;
          }
          return false;
        },
      },
      {
        row: 6,
        column: 7,
        name: 'dateTaken',
        formatter: (__, value) => ({
          ...__.dateTaken,
          year: value,
        }),
        validate: (__, value) => {
          const parsed = parseInt(value, 10);
          const year = moment().format('YYYY');
          if (!value) {
            return 'Bắt buộc phải nhập năm lấy mẫu';
          }
          if (parsed > parseInt(year, 10) || parsed < 1921) {
            return `Năm bắt đầu lấy mẫu không đúng định dạng (${year} > năm > 1921)`;
          }
          return false;
        },
      },
      {
        row: 6,
        column: 8,
        name: 'dateTaken',
        formatter: (__, value) => ({
          ...__.dateTaken,
          hour: value,
        }),
        validate: (__, value) => {
          const parsed = parseInt(value, 10);
          if (!value) {
            return 'Bắt buộc phải nhập giờ lấy mẫu';
          }
          if (parsed > 24 || parsed < 1) {
            return 'Giờ bắt đầu lấy mẫu không đúng định dạng (24 > giờ > 1)';
          }
          return false;
        },
      },
      {
        row: 6,
        column: 9,
        name: 'dateTaken',
        formatter: (__, value) => ({
          ...__.dateTaken,
          minute: value,
        }),
        validate: (__, value) => {
          const parsed = parseInt(value, 10);
          if (!value) {
            return 'Bắt buộc phải nhập thời gian lấy mẫu';
          }
          if (parsed > 60 || parsed < 0) {
            return 'Phút bắt đầu lấy mẫu không đúng định dạng (60 > phút > 0)';
          }
          return false;
        },
      },
      {
        row: 6,
        column: 11,
        name: 'addressInVietnam',
        formatter: (__, value) => `${value}`,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc phải nhập địa chỉ chi tiết nơi lấy mẫu';
          }
          return false;
        },
      },
      {
        row: 6,
        column: 13,
        name: 'province',
        formatter: (__, value) => `${value}`,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc phải nhập tỉnh/thành nơi lấy mẫu';
          }
          return false;
        },
      },
      {
        row: 6,
        column: 16,
        name: 'district',
        formatter: (__, value) => `${value}`,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc phải nhập quận/huyện nơi lấy mẫu';
          }
          return false;
        },
      },
      {
        row: 6,
        column: 17,
        name: 'ward',
        formatter: (__, value) => `${value}`,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc phải nhập phường/xã nơi lấy mẫu';
          }
          return false;
        },
      },
      {
        row: 6,
        column: 18,
        name: 'quarter',
        formatter: (__, value) => `${value}`,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc phải nhập khu phố/ấp nơi lấy mẫu';
          }
          return false;
        },
      },
      {
        row: 6,
        column: 19,
        name: 'quarterGroup',
        formatter: (__, value) => `${value}`,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc phải nhập tổ dân phô nơi lấy mẫu';
          }
          return false;
        },
      },
    ],
    []
  );
  const dataModels = useMemo(
    () => [
      {
        header: 'Mã Tổng Hợp',
        assign: 'code',
        formatter: (__, value) => value.toUpperCase().trim(),
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập mã tổng hợp';
          }
          return false;
        },
      },
      {
        header: 'Hình thức lấy mẫu',
        assign: 'sampleForm',
        formatter: (__, value) => `${value}`,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập hình thức lấy mẫu';
          }
          return false;
        },
      },
      {
        header: 'Mã TT (*)',
        assign: 'index',
        formatter: (__, value) => value.toString().trim(),
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập mã thứ tự';
          }
          return false;
        },
      },
      {
        header: 'Họ và tên (*)',
        assign: 'name',
        formatter: (__, value) => value.toUpperCase().trim(),
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập họ và tên';
          }
          return false;
        },
      },
      {
        encoding: false,
        header: 'Ng%E0ysinh',
        assign: 'dateOfBirth',
        formatter: (__, value) => ({
          ...__.dateOfBirth,
          day: value,
        }),
        validate: (__, value) => {
          const parsed = parseInt(value, 10);
          if (parsed > 31 || parsed < 0) {
            return 'Ngày sinh không đúng định dạng (31 > ngày > 0)';
          }
          return false;
        },
      },
      {
        encoding: false,
        header: 'Th%E1ngsinh',
        assign: 'dateOfBirth',
        formatter: (__, value) => ({
          ...__.dateOfBirth,
          month: value,
        }),
        validate: (__, value) => {
          const parsed = parseInt(value, 10);
          if (parsed > 12 || parsed < 0) {
            return 'Tháng sinh không đúng định dạng (12 > tháng > 0)';
          }
          return false;
        },
      },
      {
        encoding: false,
        header: 'N%u0103msinh%20%28*%29',
        assign: 'dateOfBirth',
        formatter: (__, value) => ({
          ...__.dateOfBirth,
          year: value,
        }),
        validate: (__, value) => {
          const parsed = parseInt(value, 10);
          const year = moment().format('YYYY');
          if (!value) {
            return 'Bắt buộc phải nhập năm sinh';
          }
          if (parsed > parseInt(year, 10) || parsed < 1921) {
            return `Năm sinh không đúng định dạng (${year} > năm > 1921)`;
          }
          return false;
        },
      },
      {
        encoding: false,
        header: 'Gi%u1EDBit%EDnh%20%28*%29',
        assign: 'gender',
        formatter: (__, value) =>
          value.toUpperCase().includes('NAM')
            ? 1
            : value.toUpperCase().includes('KHÁC')
            ? 2
            : 0,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập giới tính';
          }
          return false;
        },
      },
      {
        header: 'Số ĐT (*)',
        assign: 'phoneNumber',
        formatter: (__, value) =>
          typeof value === 'number' ? `0${value}` : value,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập số điện thoại';
          }
          return false;
        },
      },
      {
        header: 'Tiêm vắc xin (*)',
        assign: 'vaccinationStatus',
        formatter: (__, value) => {
          const status = immunizationStatusOptions.find(
            (p) => p.text.toUpperCase() === value.toUpperCase()
          );
          return status?.value;
        },
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc chọn trạng thái tiêm vắc xin';
          }

          const status = immunizationStatusOptions.find(
            (p) => p.text.toUpperCase() === value.toUpperCase()
          );
          if (!status) {
            return 'Trạng thái tiêm vắc xin không đúng định dạng';
          }
          return false;
        },
      },
      {
        header: 'Ngày tiêm gần nhất',
        assign: 'lastInjectionDate',
        formatter: (__, value) =>
          moment(value, 'DD/MM/YYYY').format('YYYY-MM-DDT07:00:00'),
        validate: (obj, value) => {
          if (typeof obj.immunizationStatus === 'number') {
            if (
              !value &&
              obj.immunizationStatus >= IMMUNIZATION_STATUSES.ONE_SHOT
            ) {
              return 'Bắt buộc nhập ngày tiêm (mũi 1)';
            }

            const date = moment(value, 'DD/MM/YYYY');
            const beforeDate = moment('01/01/2021', 'DD/MM/YYYY');
            const afterDate = moment().endOf('day');
            if (date > afterDate || date < beforeDate) {
              return `Ngày tiêm phải nằm trong khoảng từ ${beforeDate.format(
                'DD/MM/YYYY'
              )} đến ${afterDate.format('DD/MM/YYYY')}`;
            }
          }
          return false;
        },
      },
      {
        header: 'Địa chỉ chi tiết (*)',
        assign: 'streetHouseNumber',
        formatter: (__, value) => value.toString().trim(),
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập họ và tên';
          }
          return false;
        },
      },
      {
        header: 'Tỉnh/Thành (*)',
        assign: 'provinceValue',
        formatter: (__, value) =>
          locations?.find((p) =>
            p?.label?.toLowerCase()?.includes(`${value}`.toLowerCase())
          )?.value,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập tỉnh/thành';
          }
          const province = locations?.find((p) =>
            p?.label?.toLowerCase()?.includes(`${value}`.toLowerCase())
          );
          if (!province) {
            return 'Tỉnh/Thành không hợp lệ';
          }
          return false;
        },
      },
      {
        header: 'Quận/Huyện (*)',
        assign: 'districtValue',
        formatter: (__, value) =>
          locations
            ?.find((p) =>
              p?.value
                ?.toLowerCase()
                ?.includes(`${__.provinceValue}`.toLowerCase())
            )
            ?.districts?.find((d) =>
              d?.label?.toLowerCase()?.includes(`${value}`.toLowerCase())
            )?.value,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập quận/huyện';
          }
          if (__?.provinceValue) {
            const district = locations
              ?.find((p) =>
                p.value
                  ?.toLowerCase()
                  ?.includes(`${__.provinceValue}`.toLowerCase())
              )
              ?.districts?.find((d) =>
                d.label?.toLowerCase()?.includes(`${value}`.toLowerCase())
              );
            if (!district) {
              return 'Quận/Huyện không hợp lệ';
            }
          }
          return false;
        },
      },
      {
        header: 'Phường/Xã (*)',
        assign: 'wardValue',
        formatter: (__, value) =>
          locations
            ?.find((p) =>
              p?.value
                ?.toLowerCase()
                ?.includes(`${__.provinceValue}`.toLowerCase())
            )
            ?.districts?.find((d) =>
              d?.value
                ?.toLowerCase()
                ?.includes(`${__.districtValue}`.toLowerCase())
            )
            ?.wards?.find((d) =>
              d?.label?.toLowerCase()?.includes(`${value}`.toLowerCase())
            )?.value,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập phường/xã';
          }
          if (__?.provinceValue && __?.districtValue) {
            const ward = locations
              ?.find((p) =>
                p?.value
                  ?.toLowerCase()
                  ?.includes(`${__.provinceValue}`.toLowerCase())
              )
              ?.districts?.find((d) =>
                d?.value
                  ?.toLowerCase()
                  ?.includes(`${__.districtValue}`.toLowerCase())
              )
              ?.wards?.find((d) =>
                d?.label?.toLowerCase()?.includes(`${value}`.toLowerCase())
              );
            if (!ward) {
              return 'Phường/Xã không hợp lệ';
            }
          }
          return false;
        },
      },
      {
        header: 'Khu phố / Thôn / Ấp (*)',
        assign: 'quarter',
        formatter: (__, value) => value.toString().trim(),
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập khu phố/thôn/ấp';
          }
          return false;
        },
      },
      {
        header: 'Tổ DP (*)',
        assign: 'quarterGroup',
        formatter: (__, value) => value.toString().trim(),
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập khu tổ dân phố';
          }
          return false;
        },
      },
      {
        header: 'Lý do lấy mẫu (*)',
        assign: 'examinationType',
        formatter: (__, value) =>
          examinationTypeList.find((s) => {
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
          })?.name,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập lý do lấy mẫu';
          }
          const examinationType = examinationTypeList.find((s) => {
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
            return (
              name.includes(keyword.normalize('NFC')) ||
              keyword.normalize('NFC').includes(name)
            );
          });
          if (!examinationType) {
            return 'Lý do lấy mẫu không hợp lệ';
          }
          return false;
        },
      },
      {
        header: 'Nơi lấy mẫu (*)',
        assign: 'samplingPlaceId',
        formatter: (__, value) =>
          samplingPlaceList.find((s) => {
            const keyword = /(\d+.\s+)(.*)/i.exec(
              value.toLowerCase().trim()
            )[2];
            const name = /(\d+.\s+)(.*)/i.exec(s.name.toLowerCase().trim())[2];
            return name.normalize('NFC') === keyword.normalize('NFC');
          })?.id,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buôc phải nhập nơi lấy mẫu (loại hình)';
          }
          const samplingPlace = samplingPlaceList.find((s) => {
            const keyword = /(\d+.\s+)(.*)/i.exec(
              value.toLowerCase().trim()
            )[2];
            const name = /(\d+.\s+)(.*)/i.exec(s.name.toLowerCase().trim())[2];
            return name.normalize('NFC') === keyword.normalize('NFC');
          });
          if (!samplingPlace) {
            return 'Nơi lấy mẫu không hợp lệ';
          }
          return false;
        },
      },
      {
        header: 'Mẫu bệnh phẩm (*)',
        assign: 'diseaseSample',
        formatter: (__, value) => value,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập mẫu bệnh phẩm';
          }
          return false;
        },
      },
      {
        header: 'Kỹ thuật xét nghiệm (*)',
        assign: 'testTechnique',
        formatter: (__, value) => value,
        validate: (__, value) => {
          if (!value) {
            return 'Bắt buộc nhập kỹ thuật xét nghiệm';
          }
          return false;
        },
      },
    ],
    [examinationTypeList, samplingPlaceList]
  );

  const refresh = () => {
    setStep(steps.downloadTemplate);
    setDisabled(false);
    setSelectedFile(null);
    setReadData([]);
    setErrorData([]);
    setUploadResult([]);
  };

  // #region Parse data
  const parseSheetInformation = useCallback(
    (binary) => {
      try {
        const book = xlsx.read(binary, {
          type: 'binary',
          cellDates: true,
          cellNF: false,
          cellText: false,
        });

        const sheet = book.Sheets[book.SheetNames[0]];
        const parserData = informationModels.reduce((obj, model) => {
          const value =
            sheet[xlsx.utils.encode_cell({ r: model.row, c: model.column })]?.v;
          const validation = model?.validate
            ? model.validate(obj, value)
            : false;
          if (!validation) {
            obj[model.name] = model?.formatter
              ? model.formatter(obj, value)
              : value;
          }
          return obj;
        }, {});
        setInformationData(parserData);
      } catch (e) {
        toast.warn('Tệp tin không đúng định dạng');
      }
    },
    [informationModels]
  );
  const parseSheetData = useCallback(
    (binary) => {
      try {
        const book = xlsx.read(binary, {
          type: 'binary',
          cellDates: true,
          cellNF: false,
          cellText: false,
        });

        const sheet = book.Sheets[book.SheetNames[1]];
        const rawData = xlsx.utils
          .sheet_to_json(sheet, { range: startWithRow })
          .map((row) =>
            Object.keys(row).reduce((obj, key) => {
              const convertedKey = key.replace(/(\r\n|\n|\r)/gm, '').trim();
              if (!exception.includes(convertedKey)) {
                obj[escape(convertedKey)] = row[key];
              }
              return obj;
            }, {})
          )
          .filter((row) => Object.keys(row).length > empty.length);
        const parserData = rawData.map((row, index) =>
          dataModels.reduce((obj, props) => {
            const header =
              typeof props.encoding !== 'undefined'
                ? props.encoding
                  ? escape(props.header)
                  : props.header
                : escape(props.header);
            const resultOfValidation = props?.validate
              ? props.validate(obj, row[header])
              : false;
            if (resultOfValidation) {
              if (typeof obj.errors === 'undefined') {
                obj.errors = {
                  row: index + 1,
                  messages: [],
                };
              }
              obj.errors.messages.push(resultOfValidation);
            } else if (
              typeof row[header] !== 'undefined' &&
              row[header] !== ''
            ) {
              obj[props.assign] = props?.formatter
                ? props.formatter(obj, row[header])
                : row[header];
            }
            return obj;
          }, {})
        );
        setReadData(parserData.filter((d) => !d?.errors));
        setErrorData(parserData.filter((d) => d?.errors));
      } catch (e) {
        toast.warn('Tệp tin không đúng định dạng');
      }
    },
    [dataModels]
  );
  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      if (reader.readAsBinaryString) {
        reader.onload = () => {
          parseSheetInformation(reader.result);
          parseSheetData(reader.result);
          setStep(steps.reviewData);
        };
        reader.readAsBinaryString(selectedFile);
      }
    }
    // eslint-disable-next-line
  }, [selectedFile]);
  // #endregion

  // #region Upload data
  const formatDateOfBirth = (d) => {
    if (d?.day && d?.month) {
      const formatData = {
        year: d.year,
        month: d.month.toString().length === 1 ? `0${d.month}` : d.month,
        day: d.day.toString().length === 1 ? `0${d.day}` : d.day,
      };
      return `${formatData.year}-${formatData.month}-${formatData.day}`;
    }
    return `${d.year}-01-01`;
  };
  const onClose = () => {
    refresh();
    onCloseProps();
  };

  const formatRequestForProfile = (d) => ({
    fullName: d.name,
    gender: d.gender,
    cmnd: d?.identityCard
      ? d.identityCard.length !== 12
        ? `${d.identityCard}`
        : null
      : null,
    cccd: d?.identityCard
      ? d.identityCard.length === 12
        ? `${d.identityCard}`
        : null
      : null,
    phoneNumber: d.phoneNumber,
    dateOfBirth: d.dateOfBirth,
    hasYearOfBirthOnly: false,
    nationality: 'vn',
    initialMovingInformation: d?.initialMovingInformation ?? '',
    workAddresses: [
      {
        provinceValue: d.workplaceProvinceValue,
        districtValue: d.workplaceDistrictValue,
        wardValue: d.workplaceWardValue,
        streetHouseNumber: d.streetWorkplaceNumber,
      },
    ],
    addressesInVietnam: [
      {
        provinceValue: d.provinceValue,
        districtValue: d.districtValue,
        wardValue: d.wardValue,
        quarter: d.quarter,
        quarterGroup: d.quarterGroup,
        streetHouseNumber: d.streetHouseNumber,
      },
    ],
    immunizations: [
      {
        disease: 'Covid-19',
        immunizationStatus: d.vaccinationStatus,
        // vaccine: d.vaccine,
        injectionDate: d?.lastInjectionDate
          ? moment(d.lastInjectionDate).format('YYYY-MM-DDT02:00:00')
          : null,
      },
    ],
    symptoms: [],
    profileCreationReason: {
      reason: examinationTypeList.find((e) => e.id === d.examinationTypeId)
        ?.name,
      reasonType: examinationTypeList.find((e) => e.id === d.examinationTypeId)
        ?.name,
    },
  });
  const formatRequestForImmunization = (d, id, profileId) => ({
    id,
    guid: id,
    profileId,
    disease: 'Covid-19',
    immunizationStatus: d.immunizationStatus,
    // vaccine: d.vaccine,
    injectionDate: d?.injectionDate
      ? moment(d.injectionDate).format('YYYY-MM-DDT02:00:00')
      : null,
  });
  const formatExamination = (d) => [
    {
      profiles: Array.isArray(d)
        ? d.map((obj) => ({
            reason: obj.examinationType,
            fullName: obj.name,
            gender: obj.gender === 1 ? 'Nam' : 'Nữ',
            yearOfBirth: !(obj.dateOfBirth?.day && obj.dateOfBirth?.month)
              ? obj.dateOfBirth.year
              : undefined,
            dateOfBirth:
              obj.dateOfBirth?.day && obj.dateOfBirth?.month
                ? formatDateOfBirth(obj.dateOfBirth)
                : undefined,
            phone: obj.phoneNumber,
            cmnd: uuidv4(),
            streetHouseNumber: obj.streetHouseNumber,
            provinceValue: obj.provinceValue,
            districtValue: obj.districtValue,
            wardValue: obj.wardValue,
            quarter: obj.quarter,
            quarterGroup: obj.quarterGroup,
            subjectType: informationData.feeType,
            immunization: {
              immunizationStatus: obj.vaccinationStatus,
              reason: obj.examinationType,
              disease: 'Covid-19',
              injectionDate: obj?.lastInjectionDate
                ? moment(obj.lastInjectionDate).format('YYYY-MM-DDT02:00:00')
                : null,
            },
          }))
        : [
            {
              reason: d.examinationType,
              fullName: d.name,
              gender: d.gender === 1 ? 'Nam' : 'Nữ',
              yearOfBirth: !(d.dateOfBirth?.day && d.dateOfBirth?.month)
                ? d.dateOfBirth.year
                : undefined,
              dateOfBirth:
                d.dateOfBirth?.day && d.dateOfBirth?.month
                  ? formatDateOfBirth(d.dateOfBirth)
                  : undefined,
              phone: d.phoneNumber,
              cmnd: uuidv4(),
              streetHouseNumber: d.streetHouseNumber,
              provinceValue: d.provinceValue,
              districtValue: d.districtValue,
              wardValue: d.wardValue,
              quarter: d.quarter,
              quarterGroup: d.quarterGroup,
              subjectType: d.feeType,
              immunization: {
                immunizationStatus: d.vaccinationStatus,
                reason: d.examinationType,
                disease: 'Covid-19',
                injectionDate: d?.lastInjectionDate
                  ? moment(d.lastInjectionDate).format('YYYY-MM-DDT02:00:00')
                  : null,
              },
            },
          ],
      assign: {
        date: informationData.dateTaken.day
          ? moment(informationData.dateTaken).format('YYYY-MM-DD HH:mm')
          : null,
        facility: informationData.unitOfImporter,
      },
      testing: Array.isArray(d)
        ? {
            code: d[0].code,
            isGroup: d.length > 1,
            reason: d[0].examinationType,
            streetHouseNumber: d[0].streetHouseNumber,
            provinceValue: d[0].provinceValue,
            districtValue: d[0].districtValue,
            wardValue: d[0].wardValue,
            quarter: d[0].quarter,
            quarterGroup: d[0].quarterGroup,
            dateTaken: informationData.dateTaken.day
              ? moment(informationData.dateTaken).format('YYYY-MM-DD HH:mm')
              : null,
            diseaseType: 'U07',
            feeType: informationData.feeType,
            subjectType: informationData.feeType,
            sampleType: d[0].diseaseSample,
            testTechnique: d[0].testTechnique,
            samplingPlaceId: d[0].samplingPlaceId,
          }
        : {
            code: d.code,
            isGroup: d.length > 1,
            reason: d.examinationType,
            streetHouseNumber: informationData.streetHouseNumber,
            provinceValue: informationData.provinceValue,
            districtValue: informationData.districtValue,
            wardValue: informationData.wardValue,
            quarter: informationData.quarter,
            quarterGroup: informationData.quarterGroup,
            dateTaken: moment(informationData.dateTaken).format('YYYY-MM-DD'),
            diseaseType: 'U07',
            feeType: informationData.feeType,
            subjectType: informationData.feeType,
            sampleType: d.diseaseSample,
            testTechnique: d.testTechnique,
            samplingPlaceId: d.samplingPlaceId,
          },
    },
  ];
  const getImportError = (
    errorResponse = { response: {} },
    profileId = undefined
  ) => {
    const resultError = {
      succeed: false,
      message: 'Lỗi không xác định',
    };
    if (errorResponse.response?.data) {
      if (typeof errorResponse.response.data === 'object') {
        const { errors, errorMessage } = errorResponse.response?.data;
        if (errors) {
          resultError.message = Object.values(errors)
            .map((error) => error.join(''))
            .join(', ');
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
        if (
          errorResponse.response.data.includes(
            'Record is existed or only update'
          ) ||
          errorResponse.response.data.includes(
            'Record is existed but dates are not the same'
          )
        ) {
          resultError.message = 'Xung đột tiền sử tiêm chủng';
          resultError.profileId = profileId;
        } else {
          const examinationError = getExaminationError(
            errorResponse.response.data
          );
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
    const dataGroupBySampleForm = readData.reduce((result, obj) => {
      if (result[obj.index]) {
        result[obj.index] = [...result[obj.index], obj];
      } else {
        result[obj.index] = [obj];
      }
      return result;
    }, {});
    const keys = Object.keys(dataGroupBySampleForm);
    for (const key of keys) {
      try {
        const response = await dispatch(
          createPcrExamination(formatExamination(dataGroupBySampleForm[key]))
        );
        const conflict = response?.errors[0]?.profileConflicts[0]?.conflicts;
        const profileConflicts = response?.errors[0]?.profileConflicts;
        if (response?.failed[0]?.length > 0) {
          if (conflict) {
            setUploadResult((r) =>
              r.concat(
                dataGroupBySampleForm[key].map((o, i) => ({
                  ...o,
                  result: {
                    succeed: false,
                    profileId: profileConflicts[i]?.profileId,
                    message: 'Xung đột hồ sơ',
                  },
                }))
              )
            );
            // eslint-disable-next-line no-continue
            continue;
          }
        }
        setUploadResult((r) =>
          r.concat(
            dataGroupBySampleForm[key].map((o, i) => ({
              ...o,
              result: { ...response, succeed: true },
            }))
          )
        );
      } catch (e) {
        const error = getImportError(e);
        setUploadResult((r) =>
          r.concat(
            dataGroupBySampleForm[key].map((o, i) => ({
              ...o,
              result: { ...error },
            }))
          )
        );
      }
    }
    /* For group profile */
    // if (key.includes('GỘP')) {
    //   for (const data in dataGroupBySampleForm[key]) {
    //   }
    // } else {
    //   /* For single profile */
    //   for (const data of dataGroupBySampleForm[key]) {
    //     try {
    //     } catch (e) {
    //       const error = getImportError(e);
    //       setUploadResult((r) => ([...r, { ...data, result: { ...error } }]));
    //     }
    //   }
    // }

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
    } catch (e) {}
  };
  // #endregion
  const updateConflictProfile = async (d) => {
    try {
      await dispatch(updateProfile(formatProfileRequest(d), false));
      if (d?.immunizations && d.immunizations.length > 0) {
        const immunization = d.immunizations[0];
        const conflictImmunization = conflictProfile.exist?.immunizations[0];
        if (
          typeof conflictImmunization !== 'undefined' &&
          typeof conflictImmunization.immunizationStatus === 'number'
        ) {
          if (
            typeof immunization.immunizationStatus === 'number' &&
            immunization.immunizationStatus ===
              conflictImmunization.immunizationStatus
          ) {
            immunization.guid = conflictImmunization?.guid;
          }
        }
        await dispatch(
          immunization?.guid
            ? updateImmunizationForProfile(
                formatRequestForImmunization(
                  immunization,
                  immunization.guid,
                  d.id
                )
              )
            : createImmunizationForProfile(
                formatRequestForImmunization(immunization, undefined, d.id)
              )
        );
      }
      method.reset(defaultProfileValue);
      setUploadResult((r) => {
        const reduce = r.reduce((result, row) => {
          if (row.result.profileId === d.id) {
            row.streetHouseNumber = d?.addressesInVietnam[0].streetHouseNumber;
            row.provinceValue = d?.addressesInVietnam[0].provinceValue;
            row.districtValue = d?.addressesInVietnam[0].districtValue;
            row.wardValue = d?.addressesInVietnam[0].wardValue;
            row.quarter = d?.addressesInVietnam[0].quarter;
            row.quarterGroup = d?.addressesInVietnam[0].quarterGroup;
            row.vaccinationStatus = d?.immunizations[0]?.immunizationStatus;
            row.lastInjectionDate = d?.immunizations[0]?.injectionDate;
            return [
              ...result,
              {
                ...row,
                result: {
                  succeed: false,
                  profileId: row.result.profileId,
                  message: 'Đã chỉnh sửa, cần upload lại',
                },
              },
            ];
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
            if (
              !error?.message ||
              error.message.includes('Lỗi không xác định')
            ) {
              return [...result, { ...row, result: { ...error } }];
            }
            return [
              ...result,
              { ...row, result: { ...error, profileId: row.result.profileId } },
            ];
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
    const resolveList = uploadResult.filter(
      (u) => u?.result?.message && u.result.message.includes('Đã chỉnh sửa')
    );
    const dataGroupBySampleForm = uploadResult.reduce((result, obj) => {
      if (result[obj.index]) {
        result[obj.index] = [...result[obj.index], obj];
      } else {
        result[obj.index] = [obj];
      }
      return result;
    }, {});
    const keys = Object.keys(dataGroupBySampleForm);
    for (const key of keys) {
      try {
        if (
          dataGroupBySampleForm[key].filter(
            (u) =>
              u?.result?.message && u.result.message.includes('Đã chỉnh sửa')
          ).length > 0
        ) {
          const response = await dispatch(
            createPcrExamination(formatExamination(dataGroupBySampleForm[key]))
          );
          // setUploadResult((r) => {
          //   const reduce = r.reduce((result, row) => {
          //     for (const resolve of dataGroupBySampleForm[key]) {
          //       if (row.result.profileId === resolve.result.profileId) {
          //         return [...result, { ...row, result: { ...response, succeed: true } }];
          //       }
          //       return [...result, row];
          //     }
          //   }, []);
          //   return reduce;
          // });
          setUploadResult((r) =>
            r
              .concat(
                dataGroupBySampleForm[key].map((o, i) => ({
                  ...o,
                  result: { ...response, succeed: true },
                }))
              )
              .filter((o) => !o?.result?.profileId)
          );
        }
      } catch (e) {
        // const error = getImportError(e);
        // setUploadResult((r) => ([...r, { ...resolve['0'], result: { ...error } }]));
        setUploadResult((r) => {
          for (const resolve of dataGroupBySampleForm[key]) {
            const reduce = r.reduce((result, row) => {
              if (row.result.profileId === resolve.result.profileId) {
                return [
                  ...result,
                  { ...row, result: { ...getImportError(e) } },
                ];
              }
              return [...result, row];
            }, []);
            return r.concat(reduce).filter((o) => !o?.result?.profileId);
          }
        });
      }
    }
    setStep(steps.result);
    setLoading(false);
  };
  // #region Component
  const jsx_immunization = useCallback(
    ({ vaccinationStatus, lastInjectionDate }) => (
      <div>
        {typeof vaccinationStatus !== 'undefined' ? (
          <Header sub>
            {immunizationStatusOptions.find(
              (o) => o.value === vaccinationStatus
            )?.text ?? ''}
          </Header>
        ) : null}
        {typeof lastInjectionDate !== 'undefined' &&
        vaccinationStatus !== 0 &&
        vaccinationStatus !== 3 ? (
          <span>{moment(lastInjectionDate).format('DD-MM-YYYY')}</span>
        ) : null}
      </div>
    ),
    []
  );

  const dataColumns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'index',
      },
      {
        Header: 'Hình thức lấy mẫu',
        accessor: 'sampleForm',
      },
      {
        Header: 'Người được lấy mẫu',
        accessor: 'name',
      },
      {
        Header: 'Số điện thoại',
        accessor: 'phoneNumber',
      },
      {
        Header: 'Địa chỉ',
        formatter: ({
          streetHouseNumber,
          provinceValue,
          districtValue,
          wardValue,
        }) =>
          formatAddressToString({
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
        Header: 'Mã xét nghiệm',
        formatter: ({ code }) => (code?.length === 12 ? <b>{code}</b> : code),
      },
      {
        Header: 'Ngày lấy mẫu',
        formatter: () =>
          informationData.dateTaken
            ? moment(informationData.dateTaken).format('DD-MM-YY HH:mm')
            : '',
      },
      {
        Header: 'Kỹ thuật xét nghiệm',
        accessor: 'testTechnique',
      },
    ],
    [informationData],
    jsx_immunization
  );
  const errorColumns = useMemo(
    () => [
      {
        Header: 'Hàng',
        formatter: ({ errors }) => <Header sub>{errors?.row}</Header>,
      },
      {
        Header: ' ',
        formatter: ({ errors }) =>
          errors?.messages ? (
            <List divided relaxed>
              {errors.messages.map((m) => (
                <List.Item key={m}>
                  <List.Icon name='x' color='red' verticalAlign='middle' />
                  <List.Content>
                    <List.Description>{m}</List.Description>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          ) : null,
      },
    ],
    []
  );
  const jsx_menuTable = useMemo(() => {
    const panes = [
      {
        menuItem: `Dữ liệu đọc được (${readData.length})`,
        render: () => (
          <Tab.Pane>
            <DataTable columns={dataColumns} data={readData} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: `Dữ liệu bị lỗi (${errorData.length})`,
        render: () => (
          <Tab.Pane>
            <DataTable columns={errorColumns} data={errorData} />
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

  const resultColumns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'index',
      },
      {
        Header: 'Mã xét nghiệm',
        accessor: 'code',
      },
      {
        Header: 'Người được lấy mẫu',
        accessor: 'name',
      },
      {
        Header: 'Số điện thoại',
        accessor: 'phoneNumber',
      },
      {
        Header: 'Hình thức lấy mẫu',
        accessor: 'sampleForm',
      },
      {
        Header: 'Ngày lấy mẫu',
        formatter: () =>
          informationData.dateTaken
            ? moment(informationData.dateTaken).format('DD-MM-YY HH:mm')
            : '',
      },
      {
        Header: 'Kỹ thuật xét nghiệm',
        accessor: 'testTechnique',
      },
      {
        Header: ' ',
        formatter: (r) => (
          <>
            <Icon name='info circle' />
            {r?.result?.succeed && r?.result?.failed.length === 0
              ? 'Thành công'
              : r?.result?.message ||
                errorCode[
                  r?.result?.failed[0]
                    ?.slice(14)
                    .split(/\s/)[0]
                    .replace(/:/g, '')
                ]}
          </>
        ),
      },
    ],
    [informationData, jsx_immunization]
  );
  const jsx_menuResultTable = useMemo(() => {
    const panes = [];
    const success = uploadResult.filter(
      (u) => u?.result?.succeed && u?.result?.failed?.length === 0
    );
    const error = uploadResult.filter(
      (u) => u?.result?.succeed && u?.result?.failed?.length !== 0
    );
    const resolve = uploadResult.filter(
      (u) => !u?.result?.succeed && u?.result?.profileId !== 0
    );
    if (success.length > 0) {
      panes.push({
        menuItem: (
          <Menu.Item key='success'>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            <span style={{ fontWeight: '700' }}>Thành công</span>&nbsp; (
            {success.length})
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
          <Menu.Item key='resolve'>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            <span style={{ fontWeight: '700' }}>Cần chỉnh sửa</span>&nbsp; (
            {resolve.length})
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
          <Menu.Item key='error'>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            <span style={{ fontWeight: '700' }}>Lỗi</span>&nbsp; ({error.length}
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

  const jsx_downloadTemplate = useMemo(
    () => (
      <Message
        info
        icon
        style={{ marginBottom: 0, cursor: 'pointer' }}
        onClick={() => downloadFile(excelTemplate)}
      >
        <Icon name='download' />
        <Message.Content>
          <Message.Header>Tải tệp tin mẫu</Message.Header>
          Sử dụng tệp tin mẫu, để đảm bảo dữ liệu chính xác
        </Message.Content>
      </Message>
    ),
    []
  );

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
  }, []);
  useEffect(() => {
    if (errorData.length === 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [errorData]);
  useEffect(() => {
    if (
      uploadResult.filter(
        (u) => u?.result?.message && u.result.message.includes('Đã chỉnh sửa')
      ).length > 0
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [uploadResult]);

  return (
    <>
      <Modal
        open={open}
        size={step !== steps.downloadTemplate ? 'fullscreen' : undefined}
        onClose={onClose}
      >
        <Modal.Header>Nạp dữ liệu từ file Excel</Modal.Header>
        <Modal.Content>
          <Wrapper>
            <Dimmer inverted active={loading}>
              <Loader />
            </Dimmer>
            <div>
              <Button
                icon='upload'
                labelPosition='right'
                color='green'
                content='Chọn File'
                onClick={() => {
                  refresh();
                  fileInputRef.current.click();
                }}
              />

              {selectedFile ? (
                <div
                  style={{
                    marginTop: '10px',
                    marginLeft: '10px',
                    fontWeight: '700',
                  }}
                >
                  Tên file: {selectedFile.name}
                </div>
              ) : null}
            </div>
            <input
              hidden
              type='file'
              ref={fileInputRef}
              onChange={(e) => {
                setSelectedFile(e.target.files[0]);
              }}
              accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            />
            {jsx_content}
          </Wrapper>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            labelPosition='right'
            icon='checkmark'
            content='Xác nhận'
            disabled={disabled || loading}
            onClick={() => {
              if (
                uploadResult.filter(
                  (u) =>
                    u?.result?.message &&
                    u.result.message.includes('Đã chỉnh sửa')
                ).length > 0
              ) {
                resolveData();
              } else {
                uploadData();
              }
            }}
          />
          {/* {step === steps.reviewData && errorData.length === 0 && (
            <Button
              icon="checkmark"
              labelPosition="right"
              color="blue"
              content="Tạo mẫu"
              onClick={() => {
                if (uploadResult.filter((u) => u?.result?.message && u.result.message.includes('Đã chỉnh sửa')).length > 0) {
                  resolveData();
                } else {
                  uploadData();
                }
              }}
            />
          )} */}
          <Button
            negative
            labelPosition='right'
            icon='close'
            content='Đóng'
            onClick={onClose}
          />
        </Modal.Actions>
        <Modal
          open={Boolean(conflictProfile?.exist?.id)}
          onClose={() => setConflictProfile(undefined)}
        >
          <Modal.Header>{conflictProfile?.exist?.fullName}</Modal.Header>
          <Modal.Content>
            <div className='ui form'>
              <FormProvider {...method}>
                <ProfileSection
                  initialSubject={conflictProfile?.exist}
                  conflictSubject={conflictProfile?.raw}
                  onChange={() => {}}
                />
              </FormProvider>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              labelPosition='right'
              icon='checkmark'
              content='Xác nhận'
              loading={
                updateProfileLoading ||
                createImmunizationForProfileLoading ||
                updateImmunizationForProfileLoading
              }
              onClick={method.handleSubmit(updateConflictProfile)}
            />
          </Modal.Actions>
        </Modal>
      </Modal>
    </>
  );
};

export default ImportPcrModal;
