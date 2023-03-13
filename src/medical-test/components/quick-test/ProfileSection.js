/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  Form,
  Accordion,
  Header,
  Icon,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import AddressSection from 'medical-test/components/quick-test/AddressSection';
import ImmunizationSection from 'chain/components/ImmunizationSection';

import { useSelector } from 'react-redux';
import { getProfilesWithouDispatch } from 'profile/actions/profile';
import { isEqualObject } from 'app/utils/helpers';
import { defaultProfileValue } from 'profile/utils/helpers';
import { IMMUNIZATION_STATUSES } from 'profile/utils/constants';

import nations from 'app/assets/mock/nations.json';

const genderOptions = [
  { text: 'Nam', value: 1 },
  { text: 'Nữ', value: 0 },
  { text: 'Khác', value: 2 },
];

const religionOptions = [
  { key: 'Không', text: 'Không', value: 'Không' },
  { key: 'Phật giáo', text: 'Phật giáo', value: 'Phật giáo' },
  { key: 'Công giáo', text: 'Công giáo', value: 'Công giáo' },
  { key: 'Cao Đài', text: 'Cao Đài', value: 'Cao Đài' },
  { key: 'Hòa Hảo', text: 'Hòa Hảo', value: 'Hòa Hảo' },
  { key: 'Tin Lành', text: 'Tin Lành', value: 'Tin Lành' },
  { key: 'Hồi giáo', text: 'Hồi giáo', value: 'Hồi giáo' },
  { key: 'Ấn Độ giáo', text: 'Ấn Độ giáo', value: 'Ấn Độ giáo' },
];

const nationOptions = nations.map((n) => ({
  key: n.countryCode,
  text: n.name,
  value: n.countryCode,
  flag: n.countryCode,
}));

const Wrapper = styled.div`
  position: relative;
`;

const DOBWrapper = styled.span`
  & > span:last-child {
    color: red;
    padding-left: 5px;
  }
`;
const YLabel = styled.span`
  cursor: ${({ year }) => (year === 0 ? 'pointer' : '')};
  font-weight: ${({ year }) => (year === 1 ? 'bold' : '')};
`;
const DLabel = styled.span`
  cursor: ${({ year }) => (year === 1 ? 'pointer' : '')};
  font-weight: ${({ year }) => (year === 0 ? 'bold' : '')};
`;

const ProfileSection = (props) => {
  const {
    initialSubject,
    conflictSubject,
    fillCmnd,
    fillExistProfile,
    isWorkAddressRequired,
    // onChange: onChangeProp,
  } = props;
  const [readOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeOut, setTimeOut] = useState(null);

  // For get exist profile
  const [fillData, setFillData] = useState(undefined);
  const [fullName, setFullName] = useState(undefined);
  const [phoneNumber, setPhoneNumber] = useState(undefined);

  const {
    watch,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { assignQuickTestSession } = useSelector((state) => state.medicalTest);

  const hasNoKey = !(
    watch('cccd')
    || watch('cmnd')
    || watch('passportNumber')
    || watch('healthInsuranceNumber')
  );
  const cccdError = watch('cccd') && watch('cccd').length < 12;
  const cmndError = watch('cmnd') && watch('cmnd').length < 9;
  const passportError = watch('passportNumber') && watch('passportNumber').length < 6;
  const insuranceError = watch('healthInsuranceNumber')
    && watch('healthInsuranceNumber').length < 15;

  const ruleOptions = {
    required: { required: true },
    dateOfBirth: {
      required: true,
      min: moment().subtract(120, 'years').format('YYYY'),
      max: moment().format('YYYY'),
    },
    phoneNumber: {
      required: true,
      pattern: /((09|03|07|08|05)+([0-9]{8})\b)/g,
    },
    cccd: { validate: () => !hasNoKey && !cccdError },
    cmnd: { validate: () => !hasNoKey && !cmndError },
    passport: { validate: () => !hasNoKey && !passportError },
    insurance: { validate: () => !hasNoKey && !insuranceError },
    addressesInVietnam: {
      validate: () => {
        let error = '';
        if (!getValues('addressesInVietnam')[0]?.provinceValue) {
          error += 'provinceValue/';
        }
        if (!getValues('addressesInVietnam')[0]?.districtValue) {
          error += 'districtValue/';
        }
        if (!getValues('addressesInVietnam')[0]?.wardValue) {
          error += 'wardValue/';
        }
        if (!getValues('addressesInVietnam')[0]?.streetHouseNumber) {
          error += 'streetHouseNumber/';
        }
        if (!getValues('addressesInVietnam')[0]?.quarter) {
          error += 'quarter/';
        }
        if (!getValues('addressesInVietnam')[0]?.quarterGroup) {
          error += 'quarterGroup';
        }
        return error || true;
      },
    },
    workAddresses: {
      validate: () => {
        let error = '';
        if (!getValues('workAddresses')[0]?.provinceValue) {
          error += 'provinceValue/';
        }
        if (!getValues('workAddresses')[0]?.districtValue) {
          error += 'districtValue/';
        }
        if (!getValues('workAddresses')[0]?.wardValue) {
          error += 'wardValue/';
        }
        if (!getValues('workAddresses')[0]?.name) {
          error += 'name/';
        }
        if (!getValues('workAddresses')[0]?.streetHouseNumber) {
          error += 'streetHouseNumber';
        }
        return (isWorkAddressRequired && error) || true;
      },
    },
    immunizations: {
      validate: () => {
        const error = {};
        const immunizationStatus = getValues('immunizations')[0]?.immunizationStatus;
        const injectionDate = getValues('immunizations')[0]?.injectionDate;
        const immunizationLatestFromFillData = fillData
          && fillData?.immunizations
          && fillData.immunizations.length > 0
            ? fillData.immunizations.reduce(
                (o, i) => new Date(i.dateCreated) > new Date(o.dateCreated) ? i : o,
                fillData.immunizations[0]
              )
            : undefined;

        if (typeof immunizationStatus === 'undefined') {
          error.immunizationStatus = 'Bắt buộc';
        } else if (immunizationLatestFromFillData) {
          if (
            immunizationLatestFromFillData.immunizationStatus
            > immunizationStatus
          ) {
            error.immunizationStatus = 'Trạng thái tiêm phải lớn hơn hoặc bằng trạng thái ghi nhận trên hệ thống';
          }

          if (
            immunizationStatus !== IMMUNIZATION_STATUSES.NO_RECORD
            && immunizationStatus !== IMMUNIZATION_STATUSES.NO_VACCINE
          ) {
            // if (!getValues('immunizations')[0]?.vaccine) {
            //   error += 'vaccine';
            // }
            if (injectionDate) {
              if (immunizationLatestFromFillData) {
                if (
                  moment(injectionDate)
                  < moment(immunizationLatestFromFillData.injectionDate)
                ) {
                  error.injectionDate = 'Ngày tiêm gần nhất phải lớn hơn hoặc bằng ngày ghi nhận trên hệ thống';
                }
              }
            } else {
              error.injectionDate = 'Bắt buộc';
            }
          }
        }
        return Object.keys(error).length === 0 || JSON.stringify(error);
      },
    },
  };

  const errorOptions = {
    required: {
      content: 'Bắt buộc',
    },
    dateOfBirth: {
      content:
        errors.dateOfBirth?.type === 'required'
          ? 'Bắt buộc'
          : `Năm sinh từ ${moment()
              .subtract(120, 'years')
              .format('YYYY')} - ${moment().format('YYYY')}`,
    },
    phoneNumber: {
      content:
        errors.phoneNumber?.type === 'required'
          ? 'Bắt buộc'
          : 'Chưa đúng định dạng hoặc không có thực',
    },
    cccd:
      cccdError && errors.cccd
        ? 'Tối thiểu 12 ký tự'
        : errors.cccd && hasNoKey
        ? 'Chưa có thông tin xác thực'
        : false,
    cmnd:
      cmndError && errors.cmnd
        ? 'Tối thiểu 9 ký tự'
        : errors.cmnd && hasNoKey
        ? 'Chưa có thông tin xác thực'
        : false,
    passport:
      passportError && errors.passport
        ? 'Tối thiểu 12 ký tự'
        : errors.passportNumber && hasNoKey
        ? 'Chưa có thông tin xác thực'
        : false,
    insurance:
      insuranceError && errors.insurance
        ? 'Tối thiểu 9 ký tự'
        : errors.healthInsuranceNumber && hasNoKey
        ? 'Chưa có thông tin xác thực'
        : false,
  };

  const renderDateOfBirthLabel = (
    <DOBWrapper>
      <YLabel
        year={watch('hasYearOfBirthOnly') ? 1 : 0}
        onClick={() => setValue('hasYearOfBirthOnly', true)}
      >
        Năm sinh
      </YLabel>
      <span>/</span>
      <DLabel
        year={watch('hasYearOfBirthOnly') ? 1 : 0}
        onClick={() => setValue('hasYearOfBirthOnly', false)}
      >
        Ngày sinh
      </DLabel>
      <span>*</span>
    </DOBWrapper>
  );

  const additionalPanels = [
    {
      key: 'details',
      title: 'Thông tin bổ sung',
      content: {
        content: (
          <>
            <Form.Group widths='equal'>
              <Controller
                name='nationality'
                defaultValue=''
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    fluid
                    deburr
                    search
                    label='Quốc tịch'
                    value={value || ''}
                    onChange={(__, { value: v }) => onChange(v)}
                    onBlur={() => {
                      onBlur();
                    }}
                    options={
                      readOnly
                        ? nationOptions.filter((g) => g.value === value)
                        : nationOptions
                    }
                  />
                )}
              />
              <Controller
                name='religion'
                defaultValue=''
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    fluid
                    deburr
                    search
                    label='Tôn giáo'
                    value={value || ''}
                    onChange={(__, { value: v }) => onChange(v)}
                    onBlur={() => {
                      onBlur();
                    }}
                    options={
                      readOnly
                        ? religionOptions.filter((g) => g.value === value)
                        : religionOptions
                    }
                  />
                )}
              />
              <Controller
                name='job'
                defaultValue=''
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Input
                    fluid
                    label='Nghề nghiệp'
                    value={value || ''}
                    onChange={onChange}
                    onBlur={() => {
                      onBlur();
                    }}
                    readOnly={readOnly}
                  />
                )}
              />
              <Controller
                name='email'
                defaultValue=''
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Input
                    fluid
                    type='email'
                    label='Email'
                    value={value || ''}
                    onChange={onChange}
                    onBlur={() => {
                      onBlur();
                    }}
                    readOnly={readOnly}
                  />
                )}
              />
            </Form.Group>

            <Header as='h5' content='Địa chỉ nơi làm việc - học tập' />
            <Form.Group widths='equal'>
              <Controller
                name='workAddresses'
                defaultValue={[]}
                control={control}
                rules={ruleOptions.workAddresses}
                render={({ onChange, onBlur, value }) => (
                  <Form.Field
                    fluid
                    required={isWorkAddressRequired}
                    isWorkAddress
                    control={AddressSection}
                    initialData={
                      value.length !== 0
                        ? value[0]
                        : {
                            name: '',
                            streetHouseNumber: '',
                            provinceValue: '',
                            districtValue: '',
                            wardValue: '',
                          }
                    }
                    onChange={(d) => {
                      onChange([d]);
                    }}
                    onBlur={onBlur}
                    errorText={errors.workAddresses?.message}
                  />
                )}
              />
            </Form.Group>
          </>
        ),
      },
    },
  ];

  const onChangeWithoutDelay = (callback, time) => {
    if (timeOut) {
      clearTimeout(timeOut);
    }
    setTimeOut(setTimeout(callback, time));
  };

  const resetWithoutFields = (fields = []) => {
    const presentFields = getValues();
    Object.keys(presentFields).forEach((key) => {
      if (!fields.includes(key)) {
        setValue(key, defaultProfileValue[key]);
      }
    });
  };

  const getExistProfile = useCallback(
    (name, phone) => {
      setLoading(true);
      getProfilesWithouDispatch({
        name,
        phoneNumber: phone,
        isSensitiveCase: true,
      }).then((res) => {
        const { data } = res;
        if (data && data.length > 0) {
          const profile = {
            ...data[0],
            dateOfBirth: data[0]?.dateOfBirth
              ? data[0]?.hasYearOfBirthOnly
                ? moment(data[0].dateOfBirth).format('YYYY')
                : moment(data[0].dateOfBirth).format('YYYY-MM-DD')
              : '',
            addressesInVietnam: data[0]?.addressesInVietnam
              ? data[0]?.addressesInVietnam
              : [],
            workAddresses: data[0]?.workAddresses ? data[0]?.workAddresses : [],
            immunizations: data[0]?.immunizations ? data[0]?.immunizations : [],
          };
          setFillData(profile);
          reset({
            ...profile,
            immunizations: [],
          });
        } else {
          setFillData(undefined);
          resetWithoutFields(['fullName', 'phoneNumber']);
        }
        setLoading(false);
      });
      // eslint-disable-next-line
    },
    [reset, setFillData]
  );
  useEffect(() => {
    if (
      fillExistProfile
      && fullName
      && phoneNumber
      && phoneNumber.length > 9
      && phoneNumber.length < 12
    ) {
      getExistProfile(fullName, phoneNumber);
    }
  }, [getExistProfile, fillExistProfile, fullName, phoneNumber]);

  useEffect(() => {
    if (conflictSubject?.id || conflictSubject?.fullName) {
      if (!fillData || !isEqualObject(conflictSubject, fillData)) {
        // setFillData(conflictSubject);
        getExistProfile(
          conflictSubject?.fullName,
          conflictSubject?.phoneNumber
        );
      }
    }
  }, [fillData, conflictSubject]);

  useEffect(() => {
    if (initialSubject) {
      reset({
        ...initialSubject,
        dateOfBirth: initialSubject?.dateOfBirth
          ? initialSubject?.hasYearOfBirthOnly
            ? moment(initialSubject?.dateOfBirth).format('YYYY')
            : new Date(initialSubject?.dateOfBirth)
          : '',
        addressesInVietnam: initialSubject?.addressesInVietnam
          ? initialSubject?.addressesInVietnam
          : [],
        workAddresses: initialSubject?.workAddresses
          ? initialSubject?.workAddresses
          : [],
        immunizations: initialSubject?.immunizations
          ? initialSubject?.immunizations
          : [],
      });
    } else {
      reset({
        ...defaultProfileValue,
        sKey: `@${uuidv4()}`,
        addressesInVietnam: [],
        workAddresses: assignQuickTestSession
          ? [
              {
                name: assignQuickTestSession?.name ?? '',
                streetHouseNumber:
                  assignQuickTestSession?.streetHouseNumber ?? '',
                provinceValue: assignQuickTestSession?.provinceCode ?? '',
                districtValue: assignQuickTestSession?.districtCode ?? '',
                wardValue: assignQuickTestSession?.wardCode ?? '',
              },
            ]
          : [],
        immunizations: [],
      });
    }
    // eslint-disable-next-line
  }, [reset, initialSubject, assignQuickTestSession]);

  return (
    <Wrapper>
      <Dimmer inverted active={loading}>
        <Loader />
      </Dimmer>
      <div className='ui form'>
        <Form.Group widths='equal'>
          <Controller name='id' defaultValue='' control={control} />
          <Controller name='sKey' defaultValue='' control={control} />
          <Controller
            name='hasYearOfBirthOnly'
            defaultValue='true'
            control={control}
          />
          <Controller
            name='fullName'
            defaultValue=''
            control={control}
            rules={ruleOptions.required}
            render={({ onChange, onBlur, value }) => (
              <Form.Input
                fluid
                required
                label='Họ và tên'
                value={value || ''}
                onChange={(__, { value: v }) => {
                  onChange(v);
                  onChangeWithoutDelay(setFullName(v.toUpperCase()), 1000);
                }}
                onBlur={() => {
                  onBlur();
                  onChange(value.toUpperCase());
                }}
                error={errors.fullName && errorOptions.required}
              />
            )}
          />
          <Controller
            name='phoneNumber'
            defaultValue=''
            control={control}
            rules={ruleOptions.phoneNumber}
            render={({ onChange, onBlur, value }) => (
              <Form.Input
                fluid
                required
                type='number'
                label='Số điện thoại'
                value={value || ''}
                onChange={(__, { value: v }) => {
                  onChange(v);
                  onChangeWithoutDelay(setPhoneNumber(v), 500);
                }}
                onBlur={onBlur}
                error={
                  !readOnly && errors.phoneNumber && errorOptions.phoneNumber
                }
              />
            )}
          />
          <Controller
            name='dateOfBirth'
            defaultValue=''
            control={control}
            rules={ruleOptions.dateOfBirth}
            render={({ onChange, onBlur, value }) => {
              if (watch('hasYearOfBirthOnly')) {
                return (
                  <Form.Input
                    fluid
                    required
                    disabled={readOnly}
                    type='number'
                    label={renderDateOfBirthLabel}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={
                      !readOnly
                      && errors.dateOfBirth
                      && errorOptions.dateOfBirth
                    }
                  />
                );
              }
              return (
                <Form.Input
                  fluid
                  required
                  disabled={readOnly}
                  type='date'
                  label={renderDateOfBirthLabel}
                  value={value}
                  onChange={onChange}
                  onBlur={() => {
                    onBlur();
                  }}
                  error={
                    !readOnly && errors.dateOfBirth && errorOptions.dateOfBirth
                  }
                />
              );
            }}
          />
          <Controller
            name='gender'
            defaultValue=''
            control={control}
            rules={ruleOptions.required}
            render={({ onChange, onBlur, value }) => (
              <Form.Select
                fluid
                required
                disabled={readOnly}
                label='Giới tính'
                value={value}
                onChange={(__, { value: v }) => onChange(v)}
                onBlur={() => {
                  onBlur();
                }}
                error={errors.gender && errorOptions.required}
                options={
                  readOnly
                    ? genderOptions.filter((g) => g.value === value)
                    : genderOptions
                }
              />
            )}
          />
        </Form.Group>
        <Form.Group widths='equal'>
          <Controller
            name='cccd'
            defaultValue=''
            control={control}
            rules={ruleOptions.cccd}
            render={({ onChange, onBlur, value }) => (
              <Form.Input
                fluid
                disabled={readOnly}
                label='Căn cước công dân'
                value={value || ''}
                onChange={onChange}
                onBlur={() => {
                  onBlur();
                }}
                error={errorOptions.cccd}
              />
            )}
          />
          <Controller
            name='cmnd'
            defaultValue=''
            control={control}
            rules={ruleOptions.cmnd}
            render={({ onChange, onBlur, value }) => (
              <Form.Input
                fluid
                disabled={readOnly}
                label='Chứng minh nhân dân'
                value={value || ''}
                onChange={onChange}
                onBlur={() => {
                  onBlur();
                }}
                icon={
                  fillCmnd ? (
                    <Icon
                      name='pencil alternate'
                      link
                      onClick={() => {
                        onChange(uuidv4());
                      }}
                    />
                  ) : null
                }
                error={errorOptions.cmnd}
              />
            )}
          />
          <Controller
            name='passportNumber'
            defaultValue=''
            control={control}
            rules={ruleOptions.passport}
            render={({ onChange, onBlur, value }) => (
              <Form.Input
                fluid
                disabled={readOnly}
                label='Hộ chiếu'
                value={value || ''}
                onChange={onChange}
                onBlur={() => {
                  onBlur();
                }}
                error={errorOptions.passport}
              />
            )}
          />
          <Controller
            name='healthInsuranceNumber'
            defaultValue=''
            control={control}
            rules={ruleOptions.insurance}
            render={({ onChange, onBlur, value }) => (
              <Form.Input
                fluid
                disabled={readOnly}
                label='Bảo hiểm y tế'
                value={value || ''}
                onChange={onChange}
                onBlur={() => {
                  onBlur();
                }}
                error={errorOptions.insurance}
              />
            )}
          />
        </Form.Group>
        <Form.Group widths='equal'>
          <Controller
            name='initialMovingInformation'
            defaultValue=''
            control={control}
            rules={ruleOptions.required}
            render={({ onChange, onBlur, value }) => (
              <Form.Input
                fluid
                required
                disabled={readOnly}
                label='Thông tin di chuyển'
                value={value || ''}
                onChange={onChange}
                onBlur={() => {
                  onBlur();
                }}
                error={errors.initialMovingInformation && errorOptions.required}
              />
            )}
          />
        </Form.Group>
        <Header as='h5' content='Địa chỉ nơi cư trú' />
        <Form.Group widths='equal'>
          <Controller
            name='addressesInVietnam'
            defaultValue={[]}
            control={control}
            rules={ruleOptions.addressesInVietnam}
            render={({ onChange, onBlur, value }) => (
              <Form.Field
                fluid
                required
                control={AddressSection}
                initialData={
                  value.length !== 0
                    ? value[0]
                    : {
                        name: '',
                        streetHouseNumber: '',
                        provinceValue: '',
                        districtValue: '',
                        wardValue: '',
                      }
                }
                onChange={(d) => {
                  onChange([d]);
                }}
                onBlur={onBlur}
                readOnly={readOnly}
                errorText={errors.addressesInVietnam?.message}
              />
            )}
          />
        </Form.Group>
        <Form.Group widths='equal'>
          <Controller
            name='immunizations'
            defaultValue={[]}
            control={control}
            rules={ruleOptions.immunizations}
            render={({ onChange, value }) => (
              <Form.Field
                fluid
                required
                control={ImmunizationSection}
                fillData={
                  fillData?.immunizations
                  && Array.isArray(fillData.immunizations)
                  && fillData.immunizations.length !== 0
                    ? fillData.immunizations.reduce(
                        (o, i) => new Date(i.dateCreated) > new Date(o.dateCreated)
                            ? i
                            : o,
                        fillData.immunizations[0]
                      ) // get latest object
                    : {
                        immunizationStatus: undefined,
                        // vaccine: '',
                        injectionDate: moment().format('YYYY-MM-DDT02:00:00'),
                      }
                }
                initialData={
                  value.length !== 0
                    ? value[0]
                    : {
                        immunizationStatus: undefined,
                        // vaccine: '',
                        injectionDate: null,
                      }
                }
                onChange={(d) => {
                  onChange([d]);
                }}
                errorText={errors.immunizations?.message}
              />
            )}
          />
        </Form.Group>

        <Accordion
          as={Form.Field}
          defaultActiveIndex={isWorkAddressRequired ? 0 : undefined}
          panels={additionalPanels}
        />
      </div>
    </Wrapper>
  );
};

ProfileSection.propTypes = {
  isWorkAddressRequired: PropTypes.bool,
  fillCmnd: PropTypes.bool,
  fillExistProfile: PropTypes.bool,
  initialSubject: PropTypes.shape({
    addressesInVietnam: PropTypes.arrayOf(PropTypes.shape({})),
    workAddresses: PropTypes.arrayOf(PropTypes.shape({})),
    immunzations: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  conflictSubject: PropTypes.shape({
    addressesInVietnam: PropTypes.arrayOf(PropTypes.shape({})),
    workAddresses: PropTypes.arrayOf(PropTypes.shape({})),
    immunzations: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  // onChange: PropTypes.func,
};

ProfileSection.defaultProps = {
  isWorkAddressRequired: false,
  fillCmnd: true,
  fillExistProfile: false,
  initialSubject: {
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
  },
  conflictSubject: {
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
  },
  // onChange: null,
};

export default ProfileSection;
