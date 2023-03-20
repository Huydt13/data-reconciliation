/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
  } from 'react';
  import styled from 'styled-components';
  import { toast } from 'react-toastify';
  import PropTypes from 'prop-types';
  import moment from 'moment';
  import xlsx from 'xlsx';
  
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
  } from 'semantic-ui-react';
  import { DataTable } from 'app/components/shared';
  
  import { useDispatch, useSelector } from 'react-redux';
  import { importQuickTestJson } from 'medical-test/actions/medical-test';
  import { getUnderlyingDiseases } from 'profile/actions/profile';
  import {
    formatToDate,
    formatAddressToString,
    downloadFile,
    formatToTime,
    deburr,
    getExaminationError,
  } from 'app/utils/helpers';
  import { formatGender } from 'profile/utils/helpers';
  import { IMMUNIZATION_STATUSES } from 'profile/utils/constants';
  
  import locations from 'app/assets/mock/locations';
  import excelTemplate from 'app/assets/excels/file test.xlsx';
  
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
  
  
  const steps = {
    downloadTemplate: 0,
    reviewData: 1,
    result: 2,
  };
  
  const ImportModal = ({
    open,
    onClose: onCloseProp,
    onRefresh,
  }) => {
    const [step, setStep] = useState(steps.downloadTemplate);
    const [disabled, setDisabled] = useState(false);
  
    const fileInputRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null);
  
    const [data, setData] = useState([]);
    const [error, setError] = useState([]);
    const [result, setResult] = useState([]);
  
    const dispatch = useDispatch();
    const {
      underlyingDiseaseData: { data: underlyingDiseaseList },
    } = useSelector((state) => state.profile);
    const { importQuickTestJsonLoading } = useSelector(
      (state) => state.medicalTest,
    );
  
    const loading = importQuickTestJsonLoading;
  
    const model = useMemo(
      () => [
        {
          header: 'Họ tên(*)',
          assign: 'name',
          formatter: (value) => value.toUpperCase().trim(),
          validate: (__, value) => {
            if (!value) {
              return 'Bắt buộc nhập tên';
            }
            return false;
          },
        },
        {
          header: 'Ngày sinh(*)',
          assign: 'dateOfBirth',
          formatter: (value) =>
            moment(value, 'DD/MM/YYYY').format('YYYY-MM-DDT07:00:00'),
          validate: (__, value) => {
            if (!value) {
              return 'Bắt buộc nhập ngày sinh';
            }
  
            const date = moment(value, 'DD/MM/YYYY');
            const beforeDate = moment('01/01/1921', 'DD/MM/YYYY');
            const afterDate = moment().endOf('day');
            if (date > afterDate || date < beforeDate) {
              return `Ngày sinh phải nằm trong khoảng từ ${beforeDate.format(
                'DD/MM/YYYY',
              )} đến ${afterDate.format('DD/MM/YYYY')}`;
            }
            return false;
          },
        },
        {
          header: 'Giới tính  (Nữ/Nam)(*)',
          assign: 'gender',
          formatter: (value) => formatGender(value),
        },
        {
          header: 'CMND /CCCD(*)',
          assign: 'identityCard',
          validate: (__, value) => {
            if (!value) {
              return 'Bắt buộc nhập CMND/CCCD';
            }
            return false;
          },
        },
        {
          header: 'Điện thoại (*)',
          assign: 'phoneNumber',
          formatter: (value) => (typeof value === 'number' ? `0${value}` : value),
          validate: (__, value) => {
            if (!value) {
              return 'Bắt buộc nhập số điện thoại';
            }
            return false;
          },
        },
        {
          header: 'Số nhà, tên đường (*)',
          assign: 'streetHouseNumber',
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
          formatter: (__, value) =>
            locations?.find((p) =>
              p?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()),
            )?.value,
          validate: (__, value) => {
            if (!value) {
              return 'Bắt buộc nhập tỉnh/thành phố';
            }
            const province = locations?.find((p) =>
              p?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()),
            );
            if (!province) {
              return 'Tỉnh/Thành phố không hợp lệ';
            }
            return false;
          },
        },
        {
          header: 'Quận/Huyện/ TP/TX (*)',
          assign: 'districtValue',
          formatter: (obj, value) =>
            locations
              ?.find((p) =>
                p?.value
                  ?.toLowerCase()
                  ?.includes(`${obj.provinceValue}`.toLowerCase()),
              )
              ?.districts?.find((d) =>
                d?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()),
              )?.value,
          validate: (obj, value) => {
            if (!value) {
              return 'Bắt buộc nhập quận/huyện/thành phố/thị xã';
            }
            if (obj?.provinceValue) {
              const district = locations
                ?.find((p) =>
                  p.value
                    ?.toLowerCase()
                    ?.includes(`${obj.provinceValue}`.toLowerCase()),
                )
                ?.districts?.find((d) =>
                  d.label?.toLowerCase()?.includes(`${value}`.toLowerCase()),
                );
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
          formatter: (obj, value) =>
            locations
              ?.find((p) =>
                p?.value
                  ?.toLowerCase()
                  ?.includes(`${obj.provinceValue}`.toLowerCase()),
              )
              ?.districts?.find((d) =>
                d?.value
                  ?.toLowerCase()
                  ?.includes(`${obj.districtValue}`.toLowerCase()),
              )
              ?.wards?.find((d) =>
                d?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()),
              )?.value,
          validate: (obj, value) => {
            if (!value) {
              return 'Bắt buộc nhập phường/xã/thị trấn';
            }
            if (obj?.provinceValue && obj?.districtValue) {
              const ward = locations
                ?.find((p) =>
                  p?.value
                    ?.toLowerCase()
                    ?.includes(`${obj.provinceValue}`.toLowerCase()),
                )
                ?.districts?.find((d) =>
                  d?.value
                    ?.toLowerCase()
                    ?.includes(`${obj.districtValue}`.toLowerCase()),
                )
                ?.wards?.find((d) =>
                  d?.label?.toLowerCase()?.includes(`${value}`.toLowerCase()),
                );
              if (!ward) {
                return 'Phường/Xã/Thị trấn không hợp lệ';
              }
            }
            return false;
          },
        },
        {
          header: 'KP/ấp',
          assign: 'quarter',
          validate: (__, value) => {
            if (!value) {
              return 'Bắt buộc nhập khu phố/ấp';
            }
            return false;
          },
        },
        {
          header: 'Tổ(*)',
          assign: 'quarterGroup',
          validate: (__, value) => {
            if (!value) {
              return 'Bắt buộc nhập tổ dân phố';
            }
            return false;
          },
        },
        // {
        //   header: 'Tiêm vắc xin (1 mũi/2 mũi/ chưa tiêm)(*)',
        //   assign: 'immunizationStatus',
        //   formatter: (value) => {
        //     const status = immunizationStatusOptions.find(
        //       (p) => p.text.toUpperCase() === value.toUpperCase(),
        //     );
        //     return status?.value;
        //   },
        //   validate: (__, value) => {
        //     if (!value) {
        //       return 'Bắt buộc chọn trạng thái tiêm vắc xin';
        //     }
  
        //     const status = immunizationStatusOptions.find(
        //       (p) => p.text.toUpperCase() === value.toUpperCase(),
        //     );
        //     if (!status) {
        //       return 'Trạng thái tiêm vắc xin không đúng định dạng';
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Loại Vaccine (mũi 1)',
        //   assign: 'vaccineFirst',
        //   validate: (obj, value) => {
        //     if (typeof obj.immunizationStatus === 'number') {
        //       if (
        //         !value &&
        //         obj.immunizationStatus >= IMMUNIZATION_STATUSES.ONE_SHOT
        //       ) {
        //         return 'Bắt buộc nhập loại vắc xin (mũi 1)';
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Ngày tiêm mũi 1',
        //   assign: 'injectionDateFirst',
        //   formatter: (value) =>
        //     moment(value, 'DD/MM/YYYY').format('YYYY-MM-DDT07:00:00'),
        //   validate: (obj, value) => {
        //     if (typeof obj.immunizationStatus === 'number') {
        //       if (
        //         !value &&
        //         obj.immunizationStatus >= IMMUNIZATION_STATUSES.ONE_SHOT
        //       ) {
        //         return 'Bắt buộc nhập ngày tiêm (mũi 1)';
        //       }
  
        //       const date = moment(value, 'DD/MM/YYYY');
        //       const beforeDate = moment('01/01/2021', 'DD/MM/YYYY');
        //       const afterDate = moment().endOf('day');
        //       if (date > afterDate || date < beforeDate) {
        //         return `Ngày tiêm phải nằm trong khoảng từ ${beforeDate.format(
        //           'DD/MM/YYYY',
        //         )} đến ${afterDate.format('DD/MM/YYYY')}`;
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Loại Vaccine (mũi 2)',
        //   assign: 'vaccineSecond',
        //   validate: (obj, value) => {
        //     if (typeof obj.immunizationStatus === 'number') {
        //       if (
        //         !value &&
        //         obj.immunizationStatus >= IMMUNIZATION_STATUSES.TWO_SHOT
        //       ) {
        //         return 'Bắt buộc nhập loại vắc xin (mũi 2)';
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Ngày tiêm mũi 2',
        //   assign: 'injectionDateSecond',
        //   formatter: (value) =>
        //     moment(value, 'DD/MM/YYYY').format('YYYY-MM-DDT07:00:00'),
        //   validate: (obj, value) => {
        //     if (typeof obj.immunizationStatus === 'number') {
        //       if (
        //         !value &&
        //         obj.immunizationStatus >= IMMUNIZATION_STATUSES.TWO_SHOT
        //       ) {
        //         return 'Bắt buộc nhập ngày tiêm (mũi 2)';
        //       }
  
        //       const date = moment(value, 'DD/MM/YYYY');
        //       const beforeDate = moment('01/01/2021', 'DD/MM/YYYY');
        //       const afterDate = moment().endOf('day');
        //       if (date > afterDate || date < beforeDate) {
        //         return `Ngày tiêm phải nằm trong khoảng từ ${beforeDate.format(
        //           'DD/MM/YYYY',
        //         )} đến ${afterDate.format('DD/MM/YYYY')}`;
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Có bệnh lý nền(*)',
        //   assign: 'underlyingDiseases',
        //   formatter: (value) =>
        //     value.toString().includes(';')
        //       ? value
        //         .toString()
        //         .split(';')
        //         .filter((v) =>
        //           (underlyingDiseaseList || []).find(
        //             (u) => u.index === parseInt(v, 10),
        //           ),
        //         )
        //         .map((u) => u.id)
        //       : (underlyingDiseaseList || [])
        //         .filter((u) => u.index === parseInt(value.toString(), 10))
        //         .map((u) => u.id),
        //   validate: (__, value) => {
        //     if (typeof value === 'undefined') {
        //       return 'Bắt buộc phải nhập có bệnh lý nền';
        //     }
        //     const underlyingDiseaseIndexList = (underlyingDiseaseList || []).map(
        //       (u) => u.index,
        //     );
        //     const difference = value.toString().includes(';')
        //       ? value
        //         .toString()
        //         .split(';')
        //         .filter(
        //           (v) =>
        //             v && !underlyingDiseaseIndexList.includes(parseInt(v, 10)),
        //         )
        //       : !underlyingDiseaseIndexList.includes(parseInt(value, 10))
        //         ? [value]
        //         : [];
        //     if (Array.isArray(difference) && difference.length > 0) {
        //       return 'Bệnh nền không hợp lệ';
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Thời gian nhiễm(mm/yyyy)',
        //   assign: 'infectedDate',
        //   formatter: (value) =>
        //     moment(value, 'DD/MM/YYYY').format('YYYY-MM-DDT07:00:00'),
        //   validate: (value) => {
        //     if (value) {
        //       const date = moment(value, 'DD/MM/YYYY');
        //       const afterDate = moment().endOf('day');
        //       if (date > afterDate) {
        //         return `Ngày xét nghiệm không được lớn hơn ${afterDate.format(
        //           'DD/MM/YYYY',
        //         )}`;
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Ngày XN  lần 1',
        //   assign: 'dateOfExamFirst',
        //   formatter: (value) =>
        //     moment(value, 'DD/MM/YYYY').format('YYYY-MM-DDT07:00:00'),
        //   validate: (value) => {
        //     if (value) {
        //       const date = moment(value, 'DD/MM/YYYY');
        //       const afterDate = moment().endOf('day');
        //       if (date > afterDate) {
        //         return `Ngày xét nghiệm không được lớn hơn ${afterDate.format(
        //           'DD/MM/YYYY',
        //         )}`;
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Kết quả XN lần 1',
        //   assign: 'resultOfExamFirst',
        //   validate: (obj, value) => {
        //     if (typeof obj.dateOfExamFirst !== 'undefined') {
        //       if (
        //         !resultsOfExam.find(
        //           (r) => r.toUpperCase() === value.toUpperCase(),
        //         )
        //       ) {
        //         return 'Kết quả xét nghiệm (lần 1) không đúng định dạng';
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Ngày XN  lần 2',
        //   assign: 'dateOfExamSecond',
        //   formatter: (value) =>
        //     moment(value, 'DD/MM/YYYY').format('YYYY-MM-DDT07:00:00'),
        //   validate: (value) => {
        //     if (value) {
        //       const date = moment(value, 'DD/MM/YYYY');
        //       const afterDate = moment().endOf('day');
        //       if (date > afterDate) {
        //         return `Ngày xét nghiệm không được lớn hơn ${afterDate.format(
        //           'DD/MM/YYYY',
        //         )}`;
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Kết quả XN lần 2',
        //   assign: 'resultOfExamSecond',
        //   validate: (obj, value) => {
        //     if (typeof obj.dateOfExamSecond !== 'undefined') {
        //       if (
        //         !resultsOfExam.find(
        //           (r) => r.toUpperCase() === value.toUpperCase(),
        //         )
        //       ) {
        //         return 'Kết quả xét nghiệm (lần 1) không đúng định dạng';
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Loại Vaccine (Mũi bổ sung hoặc nhắc lại)',
        //   assign: 'additionalVaccine',
        //   validate: (obj, value) => {
        //     if (value) {
        //       if (typeof obj.additionalVaccine !== 'undefined') {
        //         return 'Chỉ được điền 1 trong 3 mũi tiêm (mũi cơ bản 1/mũi cơ bản 2/mũi bổ sung (mũi nhắc lại))';
        //       }
        //       if (
        //         typeof obj.immunizationStatus !== 'number' ||
        //         obj.immunizationStatus !== IMMUNIZATION_STATUSES.TWO_SHOT
        //       ) {
        //         return 'Yêu cầu phải tiêm đủ 2 mũi trước khi tiêm mũi bổ sung (mũi nhắc lại)';
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Ngày tiêm (Mũi bổ sung hoặc nhắc lại)',
        //   assign: 'additionalInjectionDate',
        //   validate: (obj, value) => {
        //     if (
        //       typeof obj.additionalVaccine !== 'undefined' &&
        //       obj.immunizationStatus === IMMUNIZATION_STATUSES.TWO_SHOT
        //     ) {
        //       if (!value) {
        //         return 'Bắt buộc phải nhập ngày tiêm (mũi bổ sung hoặc nhắc lại)';
        //       }
  
        //       const date = moment(value, 'DD/MM/YYYY');
        //       const beforeDate = moment('01/01/2021', 'DD/MM/YYYY');
        //       const afterDate = moment().endOf('day');
        //       if (date > afterDate || date < beforeDate) {
        //         return `Ngày tiêm phải nằm trong khoảng từ ${beforeDate.format(
        //           'DD/MM/YYYY',
        //         )} đến ${afterDate.format('DD/MM/YYYY')}`;
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Loại Vaccine (Mũi CB 1)',
        //   assign: 'additionalVaccine',
        //   validate: (obj, value) => {
        //     if (value) {
        //       if (typeof obj.additionalVaccine !== 'undefined') {
        //         return 'Chỉ được điền 1 trong 3 mũi tiêm (mũi cơ bản 1/mũi cơ bản 2/mũi bổ sung (mũi nhắc lại))';
        //       }
        //       if (
        //         typeof obj.immunizationStatus !== 'number' ||
        //         obj.immunizationStatus !== IMMUNIZATION_STATUSES.NO_VACCINE
        //       ) {
        //         return 'Yêu cầu chưa tiêm mũi nào trước khi tiêm mũi cơ bản 1';
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Ngày tiêm (Mũi CB 1)',
        //   assign: 'additionalInjectionDate',
        //   validate: (obj, value) => {
        //     if (
        //       typeof obj.additionalVaccine !== 'undefined' &&
        //       obj.immunizationStatus === IMMUNIZATION_STATUSES.NO_VACCINE
        //     ) {
        //       if (!value) {
        //         return 'Bắt buộc phải nhập ngày tiêm (mũi cơ bản 1)';
        //       }
  
        //       const date = moment(value, 'DD/MM/YYYY');
        //       const beforeDate = moment('01/01/2021', 'DD/MM/YYYY');
        //       const afterDate = moment().endOf('day');
        //       if (date > afterDate || date < beforeDate) {
        //         return `Ngày tiêm phải nằm trong khoảng từ ${beforeDate.format(
        //           'DD/MM/YYYY',
        //         )} đến ${afterDate.format('DD/MM/YYYY')}`;
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Loại Vaccine (Mũi CB 2)',
        //   assign: 'additionalVaccine',
        //   validate: (obj, value) => {
        //     if (value) {
        //       if (typeof obj.additionalVaccine !== 'undefined') {
        //         return 'Chỉ được điền 1 trong 3 mũi tiêm (mũi cơ bản 1/mũi cơ bản 2/mũi bổ sung (mũi nhắc lại))';
        //       }
        //       if (
        //         typeof obj.immunizationStatus !== 'number' ||
        //         obj.immunizationStatus !== IMMUNIZATION_STATUSES.ONE_SHOT
        //       ) {
        //         return 'Yêu cầu phải tiêm mũi 1 trước khi tiêm mũi cơ bản 2';
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Ngày tiêm (Mũi CB 2)',
        //   assign: 'additionalInjectionDate',
        //   validate: (obj, value) => {
        //     if (
        //       typeof obj.additionalVaccine !== 'undefined' &&
        //       obj.immunizationStatus === IMMUNIZATION_STATUSES.ONE_SHOT
        //     ) {
        //       if (!value) {
        //         return 'Bắt buộc phải nhập ngày tiêm (mũi cơ bản 2)';
        //       }
  
        //       const date = moment(value, 'DD/MM/YYYY');
        //       const beforeDate = moment('01/01/2021', 'DD/MM/YYYY');
        //       const afterDate = moment().endOf('day');
        //       if (date > afterDate || date < beforeDate) {
        //         return `Ngày tiêm phải nằm trong khoảng từ ${beforeDate.format(
        //           'DD/MM/YYYY',
        //         )} đến ${afterDate.format('DD/MM/YYYY')}`;
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Được cấp gói thuốc C',
        //   assign: 'DCGTC',
        //   validate: (obj, value) => {
        //     if (obj.infectedDate) {
        //       if (value) {
        //         if (!['CÓ', 'KHÔNG'].indexOf(value.toUpperCase())) {
        //           return 'Được cấp gói thuốc C không đúng định dạng';
        //         }
        //       }
        //     }
        //     return false;
        //   },
        // },
        // {
        //   header: 'Là F0 được cách ly tại nhà',
        //   assign: 'LFDCLTN',
        //   validate: (obj, value) => {
        //     if (obj.infectedDate) {
        //       if (value) {
        //         if (!['CÓ', 'KHÔNG'].indexOf(value.toUpperCase())) {
        //           return 'Không đúng định dạng cột (Là F0 được cách lý tại nhà)';
        //         }
        //       }
        //     }
        //     return false;
        //   },
        // },
      ],
      [underlyingDiseaseList],
    );
  
    const refresh = () => {
      setStep(steps.downloadTemplate);
      setDisabled(false);
      setSelectedFile(null);
      setData([]);
      setError([]);
      setResult([]);
    };
  
    const onClose = () => {
      refresh();
      onCloseProp();
      onRefresh();
    };
  
    // #region parse data
    const parseData = useCallback(
      (binary) => {
        try {
          const book = xlsx.read(binary, {
            type: 'binary',
            cellDates: true,
            cellNF: false,
            cellText: false,
          });
  
          const sheet = book.Sheets[book.SheetNames[0]];
          const rawData = xlsx.utils.sheet_to_json(sheet).map((row) =>
            Object.keys(row).reduce((obj, key) => {
              obj[key.replace(/(\r\n|\n|\r)/gm, '').trim()] = row[key];
              return obj;
            }, {}),
          );
          const parserData = rawData.map((row, index) =>
            model.reduce((obj, props) => {
              const resultOfValidation = props?.validate
                ? props.validate(obj, row[props.header])
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
                typeof row[props.header] !== 'undefined' &&
                row[props.header] !== ''
              ) {
                obj[props.assign] = props?.formatter
                  ? props.formatter(row[props.header])
                  : row[props.header];
              }
              return obj;
            }, {}),
          );
          setData(parserData.filter((d) => !d?.errors));
          setError(parserData.filter((d) => d?.errors));
        } catch (e) {
          toast.warn('Tệp tin không đúng định dạng');
        }
      },
      [model],
    );
    useEffect(() => {
      if (selectedFile) {
        const reader = new FileReader();
        if (reader.readAsBinaryString) {
          reader.onload = () => parseData(reader.result);
          reader.readAsBinaryString(selectedFile);
        }
      }
      // eslint-disable-next-line
    }, [selectedFile]);
    // #endregion
  
    // #region upload data
    const formatRequest = (d) => {
      const url = window.location.href;
      return {
        profileModel: {
          profile: {
            fullName: d.name,
            gender: d.gender,
            cmnd: d.identityCard.length !== 12 ? `${d.identityCard}` : null,
            cccd: d.identityCard.length === 12 ? `${d.identityCard}` : null,
            phoneNumber: d.phoneNumber,
            dateOfBirth: d.dateOfBirth,
            hasYearOfBirthOnly: false,
            profileCreationReason: {},
            workAddresses: [],
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
            underlyingDiseases: d?.underlyingDiseases ?? null,
            createdFrom: 6,
          },
          newImmunization: d?.additionalImmunizationStatus
            ? {
              immunizationStatus: d.additionalImmunizationStatus,
              injectionDate: d.additionalInjectionDate,
              vaccine: d.additionalVaccine,
              disease: 'Covid-19',
            }
            : null,
          curImmunizations: d?.injectionDateSecond
            ? [
              {
                immunizationStatus: IMMUNIZATION_STATUSES.TWO_SHOT,
                injectionDate: d.injectionDateSecond,
                vaccine: d.vaccineSecond,
                disease: 'Covid-19',
              },
              {
                immunizationStatus: IMMUNIZATION_STATUSES.ONE_SHOT,
                injectionDate: d.injectionDateFirst,
                vaccine: d.vaccineFirst,
                disease: 'Covid-19',
              },
            ]
            : d?.injectionDateFirst
              ? [
                {
                  immunizationStatus: IMMUNIZATION_STATUSES.ONE_SHOT,
                  injectionDate: d.injectionDateFirst,
                  vaccine: d.vaccineFirst,
                  disease: 'Covid-19',
                },
              ]
              : [],
          treatment: d?.infectedDate
            ? {
              fromDate: d?.infectedDate,
              contents: {
                DCGTC: d?.DCGTC,
                LFDCLTN: d?.LFDCLTN,
              },
            }
            : null,
        },
        quickTestModel: {
          date1: d?.dateOfExamFirst ?? null,
          result1: d?.resultOfExamFirst ?? null,
          date2: d?.dateOfExamSecond ?? null,
          result2: d?.resultOfExamSecond ?? null,
        },
        createProfileMqExchangeName:
          url.indexOf('abcde') > -1 || process.env.NODE_ENV === 'development'
            ? 'NewProfileQueue1'
            : 'NewProfileQueue',
      };
    };
    const getImportError = (errorResponse = { response: {} }) => {
      const resultError = {
        succeed: false,
        message: 'Lỗi không xác định',
      };
      if (errorResponse.response?.data) {
        if (typeof errorResponse.response.data === 'string') {
          if (
            errorResponse.response.data.includes(
              'Record is existed or only update',
            )
          ) {
            resultError.message = 'Xung đột thông tin tiền sử tiêm chủng';
          } else {
            const examinationError = getExaminationError(
              errorResponse.response.data,
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
      for (const profile of data) {
        try {
          await dispatch(importQuickTestJson([formatRequest(profile)]));
          setResult((rl) => [...rl, { ...profile, result: { succeed: true } }]);
        } catch (e) {
          setResult((rl) => [
            ...rl,
            { ...profile, result: { ...getImportError(e) } },
          ]);
        }
      }
  
      setStep(steps.result);
    };
    // #endregion
  
    // #region component
    const dataColumns = useMemo(
      () => [
        {
          Header: '#',
          accessor: 'index',
        },
        {
          Header: 'Họ tên',
          accessor: 'name',
        },
        {
          Header: 'Ngày sinh',
          formatter: ({ dateOfBirth }) => formatToDate(dateOfBirth),
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
        },
        // {
        //   Header: 'Tiền sử tiêm chủng',
        //   formatter: ({
        //     vaccineFirst,
        //     injectionDateFirst,
        //     vaccineSecond,
        //     injectionDateSecond,
        //   }) => (
        //     <div>
        //       {vaccineSecond ? (
        //         <>
        //           <Header sub>
        //             <b style={{ color: '#DB2729' }}>Mũi 2</b>
        //             {` | ${vaccineSecond}`}
        //           </Header>
        //           <span>{formatToDate(injectionDateSecond)}</span>
        //         </>
        //       ) : vaccineFirst ? (
        //         <>
        //           <Header sub>
        //             <b style={{ color: '#DB2729' }}>Mũi 1</b>
        //             {` | ${vaccineFirst}`}
        //           </Header>
        //           <span>{formatToDate(injectionDateFirst)}</span>
        //         </>
        //       ) : (
        //         <Header sub>Chưa tiêm</Header>
        //       )}
        //     </div>
        //   ),
        // },
        // {
        //   Header: 'Xét nghiệm lần 1',
        //   formatter: ({ dateOfExamFirst, resultOfExamFirst }) =>
        //     resultOfExamFirst ? (
        //       <div>
        //         <Header sub>
        //           {resultOfExamFirst.includes(deburr('Dương')) ? (
        //             <b style={{ color: '#DB2729' }}>{resultOfExamFirst}</b>
        //           ) : (
        //             resultOfExamFirst
        //           )}
        //         </Header>
        //         <span>{formatToDate(dateOfExamFirst)}</span>
        //       </div>
        //     ) : null,
        // },
        // {
        //   Header: 'Xét nghiệm lần 2',
        //   formatter: ({ dateOfExamSecond, resultOfExamSecond }) =>
        //     resultOfExamSecond ? (
        //       <div>
        //         <Header sub>
        //           {resultOfExamSecond.includes(deburr('Dương')) ? (
        //             <b style={{ color: '#DB2729' }}>{resultOfExamSecond}</b>
        //           ) : (
        //             resultOfExamSecond
        //           )}
        //         </Header>
        //         <span>{formatToDate(dateOfExamSecond)}</span>
        //       </div>
        //     ) : null,
        // },
      ],
      [],
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
                    <List.Icon name="x" color="red" verticalAlign="middle" />
                    <List.Content>
                      <List.Description>{m}</List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            ) : null,
        },
      ],
      [],
    );
    const jsx_menuTable = useMemo(() => {
      const panes = [
        {
          menuItem: `Dữ liệu đọc được (${data.length})`,
          render: () => (
            <Tab.Pane>
              <DataTable
                columns={dataColumns}
                data={data.map((d, i) => ({ ...d, index: i + 1 }))}
              />
            </Tab.Pane>
          ),
        },
        {
          menuItem: `Dữ liệu bị lỗi (${error.length})`,
          render: () => (
            <Tab.Pane>
              <DataTable
                columns={errorColumns}
                data={error.map((e, i) => ({ ...e, index: i + 1 }))}
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
    }, [data, error, dataColumns, errorColumns]);
  
    const resultColumns = useMemo(
      () => [
        {
          Header: '#',
          accessor: 'index',
        },
        {
          Header: 'Họ tên',
          accessor: 'name',
        },
        {
          Header: 'Ngày sinh',
          formatter: ({ dateOfBirth }) => formatToDate(dateOfBirth),
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
        },
        // {
        //   Header: 'Tiền sử tiêm chủng',
        //   formatter: ({
        //     vaccineFirst,
        //     injectionDateFirst,
        //     vaccineSecond,
        //     injectionDateSecond,
        //   }) => (
        //     <div>
        //       {vaccineSecond ? (
        //         <>
        //           <Header sub>
        //             <b style={{ color: '#DB2729' }}>Mũi 2</b>
        //             {` | ${vaccineSecond}`}
        //           </Header>
        //           <span>{formatToTime(injectionDateSecond)}</span>
        //         </>
        //       ) : vaccineFirst ? (
        //         <>
        //           <Header sub>
        //             <b style={{ color: '#DB2729' }}>Mũi 1</b>
        //             {` | ${vaccineFirst}`}
        //           </Header>
        //           <span>{formatToTime(injectionDateFirst)}</span>
        //         </>
        //       ) : (
        //         <Header sub>Chưa tiêm</Header>
        //       )}
        //     </div>
        //   ),
        // },
        // {
        //   Header: 'Xét nghiệm lần 1',
        //   formatter: ({ dateOfExamFirst, resultOfExamFirst }) =>
        //     resultOfExamFirst ? (
        //       <div>
        //         <Header sub>
        //           {resultOfExamFirst.includes(deburr('Dương')) ? (
        //             <b style={{ color: '#DB2729' }}>{resultOfExamFirst}</b>
        //           ) : (
        //             resultOfExamFirst
        //           )}
        //         </Header>
        //         <span>{formatToTime(dateOfExamFirst)}</span>
        //       </div>
        //     ) : null,
        // },
        // {
        //   Header: 'Xét nghiệm lần 2',
        //   formatter: ({ dateOfExamSecond, resultOfExamSecond }) =>
        //     resultOfExamSecond ? (
        //       <div>
        //         <Header sub>
        //           {resultOfExamSecond.includes(deburr('Dương')) ? (
        //             <b style={{ color: '#DB2729' }}>{resultOfExamSecond}</b>
        //           ) : (
        //             resultOfExamSecond
        //           )}
        //         </Header>
        //         <span>{formatToTime(dateOfExamSecond)}</span>
        //       </div>
        //     ) : null,
        // },
        {
          Header: ' ',
          formatter: (r) => (
            <>
              <Icon name="info circle" />{' '}
              {r?.result?.succeed ? 'Thành công' : r?.result?.message}
            </>
          ),
        },
      ],
      [],
    );
    const jsx_resultTable = useMemo(
      () => (
        <DataTable
          title={`Kết quả đã nạp ${result.reduce(
            (c, t) => (t?.result?.succeed ? c + 1 : c),
            0,
          )}/${result.length} hồ sơ`}
          columns={resultColumns}
          data={result.map((d, i) => ({ ...d, index: i + 1 }))}
          rowError={(r) => !r?.result?.succeed}
          rowSucceed={(r) => r?.result?.succeed}
        />
      ),
      [result, resultColumns],
    );
  
    const jsx_downloadTemplate = useMemo(
      () => (
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
      ),
      [],
    );
  
    const jsx_content = useMemo(() => {
      switch (step) {
        case steps.downloadTemplate:
          return jsx_downloadTemplate;
        case steps.reviewData:
          return jsx_menuTable;
        case steps.result:
          return jsx_resultTable;
        default:
          return jsx_downloadTemplate;
      }
    }, [step, jsx_downloadTemplate, jsx_menuTable, jsx_resultTable]);
    // #endregion
  
    useEffect(() => {
      if (!underlyingDiseaseList || underlyingDiseaseList.length === 0) {
        dispatch(getUnderlyingDiseases({}));
      }
      // eslint-disable-next-line
    }, [dispatch]);
  
    useEffect(() => {
      if (error.length === 0) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }, [error]);
  
    return (
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
                <span style={{ marginLeft: '10px', fontWeight: '700' }}>
                  {selectedFile.name}
                </span>
              ) : null}
            </div>
            <input
              hidden
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                setSelectedFile(e.target.files[0]);
                setStep(steps.reviewData);
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
            disabled={disabled}
            loading={loading}
            onClick={uploadData}
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
    );
  };
  
  ImportModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onRefresh: PropTypes.func,
  };
  
  ImportModal.defaultProps = {
    open: false,
    onClose: () => { },
    onRefresh: () => { },
  };
  
  export default ImportModal;
  