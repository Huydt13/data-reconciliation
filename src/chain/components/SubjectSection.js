/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Accordion, Form, Icon, Dimmer, Loader } from 'semantic-ui-react';
import AddressDetails from 'infection-chain/components/subject/information/form-sections/AddressDetails';
import ImmunizationSection from 'chain/components/ImmunizationSection';

import { getProfilesWithouDispatch } from 'profile/actions/profile';
import { IMMUNIZATION_STATUSES } from 'profile/utils/constants';

import nations from 'app/assets/mock/nations.json';
import { KeyboardDatePicker } from 'app/components/shared';

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

const YearLabel = styled.span`
  cursor: ${({ year }) => (year === 0 ? 'pointer' : '')};
  font-weight: ${({ year }) => (year === 1 ? 'bold' : '')};
`;
const DateLabel = styled.span`
  cursor: ${({ year }) => (year === 1 ? 'pointer' : '')};
  font-weight: ${({ year }) => (year === 0 ? 'bold' : '')};
`;

const SubjectSection = (props) => {
  const {
    showAdditional,
    fillExistProfile,
    initialSubject,
    onChange: onChangeProp,
  } = props;

  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
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

  const hasNoKey = !(
    watch('cccd') ||
    watch('cmnd') ||
    watch('passportNumber') ||
    watch('healthInsuranceNumber')
  );
  const cccdError = watch('cccd') && watch('cccd').length < 12;
  const cmndError = watch('cmnd') && watch('cmnd').length < 9;
  const passportError =
    watch('passportNumber') && watch('passportNumber').length < 6;
  const insuranceError =
    watch('healthInsuranceNumber') &&
    watch('healthInsuranceNumber').length < 15;

  const ruleOptions = {
    required: { required: true },
    dateOfBirth: {
      required: true,
      min: moment().subtract(120, 'years').format('YYYY'),
      max: moment().format('YYYY-MM-DD'),
    },
    phoneNumber: {
      required: true,
      pattern: /((09|03|07|08|05)+([0-9]{8})\b)/g,
    },
    cccd: { validate: () => !hasNoKey && !cccdError },
    cmnd: { validate: () => !hasNoKey && !cmndError },
    passport: { validate: () => !hasNoKey && !passportError },
    insurance: { validate: () => !hasNoKey && !insuranceError },
    addressInVietnam: {
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
          error += 'streetHouseNumber';
        }
        if (!getValues('addressesInVietnam')[0]?.quarter) {
          error += 'quarter';
        }
        if (!getValues('addressesInVietnam')[0]?.quarterGroup) {
          error += 'quarterGroup';
        }
        return error || true;
      },
    },
    immunizations: {
      validate: () => {
        const error = {};
        const immunizationStatus =
          getValues('immunizations')[0]?.immunizationStatus;
        const injectionDate = getValues('immunizations')[0]?.injectionDate;
        if (typeof immunizationStatus === 'undefined') {
          error.immunizationStatus = 'Bắt buộc';
        }
        if (
          immunizationStatus !== IMMUNIZATION_STATUSES.NO_RECORD &&
          immunizationStatus !== IMMUNIZATION_STATUSES.NO_VACCINE
        ) {
          // if (!getValues('immunizations')[0]?.vaccine) {
          //   error += 'vaccine';
          // }
          if (injectionDate) {
            if (
              fillData &&
              fillData?.immunizations &&
              fillData.immunizations.length > 0
            ) {
              const immunizationLatest = fillData.immunizations.reduce(
                (o, i) =>
                  new Date(i.dateCreated) > new Date(o.dateCreated) ? i : o,
                fillData.immunizations[0]
              );
              if (
                moment(injectionDate) < moment(immunizationLatest.injectionDate)
              ) {
                error.injectionDate =
                  'Ngày tiêm gần nhất phải lớn hơn hoặc bằng ngày ghi nhận trên hệ thống';
              }
            }
          } else {
            error.injectionDate = 'Bắt buộc';
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
      !readOnly && cccdError && errors.cccd
        ? 'Tối thiểu 12 ký tự'
        : errors.cccd && hasNoKey
        ? 'Chưa có thông tin xác thực'
        : false,
    cmnd:
      !readOnly && cmndError && errors.cmnd
        ? 'Tối thiểu 9 ký tự'
        : errors.cmnd && hasNoKey
        ? 'Chưa có thông tin xác thực'
        : false,
    passport:
      !readOnly && passportError && errors.passport
        ? 'Tối thiểu 12 ký tự'
        : errors.passportNumber && hasNoKey
        ? 'Chưa có thông tin xác thực'
        : false,
    insurance:
      !readOnly && insuranceError && errors.insurance
        ? 'Tối thiểu 9 ký tự'
        : errors.healthInsuranceNumber && hasNoKey
        ? 'Chưa có thông tin xác thực'
        : false,
  };

  const resetWithoutFields = (fields = []) => {
    const presentFields = getValues();
    Object.keys(presentFields).forEach((key) => {
      if (!fields.includes(key)) {
        setValue(key, SubjectSection.defaultProps.initialSubject[key]);
      }
    });
  };

  const onChangeWithoutDelay = (callback, time) => {
    if (timeOut) {
      clearTimeout(timeOut);
    }
    setTimeOut(setTimeout(callback, time));
  };

  const triggerOnChange = useCallback(() => {
    if (onChangeProp) {
      const s = getValues();
      onChangeProp({
        ...s,
        fullName: s.fullName.toUpperCase(),
        dateOfBirth: s.dateOfBirth
          ? s.dateOfBirth.includes('-')
            ? s.dateOfBirth
            : `${s.dateOfBirth}-01-01`
          : '',
      });
    }
  }, [getValues, onChangeProp]);

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
                ? moment(data[0]?.dateOfBirth).format('YYYY')
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
      fillExistProfile &&
      fullName &&
      phoneNumber &&
      phoneNumber.length > 9 &&
      phoneNumber.length < 12
    ) {
      getExistProfile(fullName, phoneNumber);
    }
  }, [getExistProfile, fillExistProfile, fullName, phoneNumber]);

  useEffect(() => {
    if (initialSubject) {
      setReadOnly(Boolean(initialSubject?.id));
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
        ...SubjectSection.defaultProps.initialSubject,
        sKey: `@${uuidv4()}`,
      });
    }
  }, [reset, initialSubject]);

  const dOBLabel = (
    <>
      <YearLabel
        year={watch('hasYearOfBirthOnly') ? 1 : 0}
        onClick={() => setValue('hasYearOfBirthOnly', true)}
      >
        Năm sinh
      </YearLabel>
      <span>/</span>
      <DateLabel
        year={watch('hasYearOfBirthOnly') ? 1 : 0}
        onClick={() => setValue('hasYearOfBirthOnly', false)}
      >
        Ngày sinh
      </DateLabel>
    </>
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
                    clearable={!readOnly}
                    search
                    label='Quốc tịch'
                    value={value || ''}
                    onChange={(_, { value: v }) => onChange(v)}
                    onBlur={() => {
                      onBlur();
                      triggerOnChange();
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
                    clearable={!readOnly}
                    search
                    label='Tôn giáo'
                    value={value || ''}
                    onChange={(_, { value: v }) => onChange(v)}
                    onBlur={() => {
                      onBlur();
                      triggerOnChange();
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
                      triggerOnChange();
                    }}
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
                      triggerOnChange();
                    }}
                    readOnly={readOnly}
                  />
                )}
              />
            </Form.Group>
            <Form.Group widths='equal'>
              <Controller
                name='workAddresses'
                defaultValue={[]}
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Field
                    fluid
                    control={AddressDetails}
                    label='Địa chỉ nơi làm việc/ học tập'
                    initialData={
                      value.length !== 0
                        ? value[0]
                        : {
                            floor: '',
                            block: '',
                            streetHouseNumber: '',
                            provinceValue: '',
                            districtValue: '',
                            wardValue: '',
                          }
                    }
                    onChange={(d) => {
                      onChange([d]);
                      triggerOnChange();
                    }}
                    onBlur={onBlur}
                    readOnly={readOnly}
                  />
                )}
              />
            </Form.Group>
          </>
        ),
      },
    },
  ];

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
                required
                fluid
                label='Họ và tên'
                value={value || ''}
                onChange={(__, { value: v }) => {
                  onChange(v);
                  onChangeWithoutDelay(setFullName(v.toUpperCase()), 1000);
                }}
                onBlur={() => {
                  onBlur();
                  onChange(value.toUpperCase());
                  triggerOnChange();
                }}
                error={errors.fullName && errorOptions.required}
                readOnly={readOnly}
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
                onBlur={() => {
                  onBlur();
                  triggerOnChange();
                }}
                error={
                  !readOnly && errors.phoneNumber && errorOptions.phoneNumber
                }
                readOnly={readOnly}
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
                    type='number'
                    label={dOBLabel}
                    value={
                      value.toString().includes('-')
                        ? value.substring(0, 4)
                        : value
                    }
                    onChange={onChange}
                    onBlur={() => {
                      onBlur();
                      triggerOnChange();
                    }}
                    error={
                      !readOnly &&
                      errors.dateOfBirth &&
                      errorOptions.dateOfBirth
                    }
                    readOnly={readOnly}
                  />
                );
              }
              return (
                // <Form.Input
                //   fluid
                //   required
                //   type='date'
                //   label={dOBLabel}
                //   value={value}
                //   onChange={onChange}
                //   onBlur={() => {
                //     onBlur();
                //     triggerOnChange();
                //   }}
                //   error={
                //     !readOnly && errors.dateOfBirth && errorOptions.dateOfBirth
                //   }
                //   readOnly={readOnly}
                // />
                <Form.Field
                  required
                  label={dOBLabel}
                  control={KeyboardDatePicker}
                  onChange={onChange}
                  value={value || ''}
                  onBlur={() => {
                    onBlur();
                    triggerOnChange();
                  }}
                  disabledDays={[
                    {
                      before: new Date(watch('fromTime')),
                      after: new Date(),
                    },
                  ]}
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
                clearable={!readOnly}
                label='Giới tính'
                value={value}
                onChange={(__, { value: v }) => onChange(v)}
                onBlur={() => {
                  onBlur();
                  triggerOnChange();
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
                label='Căn cước công dân'
                value={value || ''}
                onChange={onChange}
                onBlur={() => {
                  onBlur();
                  triggerOnChange();
                }}
                readOnly={readOnly}
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
                label='Chứng minh nhân dân'
                value={value || ''}
                onChange={onChange}
                onBlur={() => {
                  onBlur();
                  triggerOnChange();
                }}
                icon={
                  !readOnly ? (
                    <Icon
                      name='pencil alternate'
                      link
                      onClick={() => {
                        onChange(uuidv4());
                      }}
                    />
                  ) : null
                }
                readOnly={readOnly}
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
                label='Hộ chiếu'
                value={value || ''}
                onChange={onChange}
                onBlur={() => {
                  onBlur();
                  triggerOnChange();
                }}
                readOnly={readOnly}
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
                label='Bảo hiểm y tế'
                value={value || ''}
                onChange={onChange}
                onBlur={() => {
                  onBlur();
                  triggerOnChange();
                }}
                readOnly={readOnly}
                error={errorOptions.insurance}
              />
            )}
          />
        </Form.Group>

        <Form.Group widths='equal'>
          <Controller
            name='addressesInVietnam'
            defaultValue={[]}
            control={control}
            rules={ruleOptions.addressInVietnam}
            render={({ onChange, onBlur, value }) => (
              <Form.Field
                fluid
                required
                control={AddressDetails}
                label='Địa chỉ nơi cư trú'
                initialData={
                  value.length !== 0
                    ? value[0]
                    : {
                        floor: '',
                        block: '',
                        streetHouseNumber: '',
                        provinceValue: '',
                        districtValue: '',
                        wardValue: '',
                      }
                }
                onChange={(d) => {
                  onChange([d]);
                  triggerOnChange();
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
                  fillData?.immunizations &&
                  Array.isArray(fillData.immunizations) &&
                  fillData.immunizations.length !== 0
                    ? fillData.immunizations.reduce(
                        (o, i) =>
                          new Date(i.dateCreated) > new Date(o.dateCreated)
                            ? i
                            : o,
                        fillData.immunizations[0]
                      ) // get latest object
                    : {
                        immunizationStatus: undefined,
                        // vaccine: '',
                        injectionDate: null,
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

        {showAdditional && (
          <Accordion as={Form.Field} panels={additionalPanels} />
        )}
      </div>
    </Wrapper>
  );
};

SubjectSection.propTypes = {
  showAdditional: PropTypes.bool,
  fillExistProfile: PropTypes.bool,
  initialSubject: PropTypes.shape({
    addressesInVietnam: PropTypes.arrayOf(PropTypes.shape({})),
    workAddresses: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  onChange: PropTypes.func,
};

SubjectSection.defaultProps = {
  showAdditional: true,
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
    nationality: '',
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
  onChange: null,
};

export default SubjectSection;
