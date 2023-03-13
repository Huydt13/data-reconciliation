/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { Form, Grid, Icon, Input, Select } from 'semantic-ui-react';
import { FiCalendar } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { InfoRow, KeyboardDatePicker } from 'app/components/shared';
import nations from 'app/assets/mock/nations.json';

import { useAuth } from 'app/hooks';
import { SubjectKeyType } from 'infection-chain/utils/constants';
import { getRelated } from 'profile/actions/profile';
import { mergeProfile } from 'medical-test/actions/medical-test';
import { showForwardModal, showInfoModal } from 'app/actions/global';
import { useHistory, useParams } from 'react-router-dom';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';
import EvaluateModal from 'chain/components/EvaluateModal';
import MinimizeGeneralInformation from './MinimizeGeneralInformation';

const nationOptions = nations.map((n) => ({
  key: n.countryCode,
  text: n.name,
  value: n.countryCode,
  flag: n.countryCode,
}));

const genderOptions = [
  { key: 'm', text: 'Nam', value: 1 },
  { key: 'f', text: 'Nữ', value: 0 },
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

const fields = [
  'id',
  'guid',
  'fullName',
  'gender',
  'nationality',
  'religion',
  'dateOfBirth',
  'hasYearOfBirthOnly',
  'createdFrom',
  'description',
  'isVerified',
  'symptoms',
  'underlyingDiseases',
  'nationality',
  'workAddresses',
  'addressesInVietnam',
  'facilityId',
  'addresses',
  'additionalInformation',
  'homeAddress',
];

const StyledWrapper = styled.label`
  display: inline-block;
  & svg {
    vertical-align: text-bottom;
    font-size: 20px;
    margin-left: 8px;
  }
`;

const GeneralInformationSection = (props) => {
  const {
    subject,
    loading,
    minimize,
    initialData,
    onChange,
    onRefresh,
    onDisabled,
    readOnly,
    isCreateNewSubject,
    isCreateFromAnonymous,
    isCreateFromQuarantine,
    isPartTimeQuarantine,
    isFullTimeQuarantine,
  } = props;

  const {
    reset,
    watch,
    register,
    setValue,
    setError,
    getValues,
    clearErrors,
    trigger,
  } = useForm({
    defaultValues: { ...initialData },
  });

  useEffect(() => {
    reset(initialData);
    // eslint-disable-next-line
  }, [reset, initialData.id]);

  const hasYearOfBirthOnly = watch('hasYearOfBirthOnly');
  const { isUsername } = useAuth();
  useEffect(() => {
    fields.forEach((name) => {
      register({ name });
    });
    // hcdc.dvu.xng default is full date
    if (isUsername('hcdc.dvu.xng')) {
      setValue('hasYearOfBirthOnly', false);
    } else {
      setValue('hasYearOfBirthOnly', hasYearOfBirthOnly || true);
    }
    // eslint-disable-next-line
  }, [register]);

  const [minimizeYear, setMinimizeYear] = useState(
    isUsername('hcdc.dvu.xng') ? false : hasYearOfBirthOnly,
  );
  const [modal, setModal] = useState(false);

  const toggleDOB = (isMin, setMin) => (
    <StyledWrapper>
      {isMin ? <>Năm sinh</> : <>Ngày sinh</>}
      <FiCalendar
        size={16}
        onClick={() => {
          setMin(!minimizeYear);
          const dob = watch('dateOfBirth');
          if (dob && dob?.length === 4 && minimizeYear) {
            setValue('dateOfBirth', moment(dob, 'YYYY').startOf('year'));
          } else if (
            dob &&
            dob.length === 10 &&
            moment(dob, 'YYYY-DD-MM').isValid
          ) {
            setValue('dateOfBirth', moment(dob).format('YYYY'));
          } else {
            setValue('dateOfBirth', '');
          }
          setValue('hasYearOfBirthOnly', !minimizeYear);
          onChange(getValues());
        }}
      />
    </StyledWrapper>
  );

  const { fromContactData } = useSelector((state) => state.subject);
  const { data } = fromContactData || { data: [{ id: '' }] };

  const evaluateModal = useMemo(
    () => (
      <EvaluateModal
        key={modal ? 'OpenEvaluateModal' : 'CloseEvaluateModal'}
        open={modal}
        subjectId={subject.id}
        contactId={data[data.length - 1]?.id ?? ''}
        isVerified={subject.isVerified}
        verifiedType={subject.type}
        onClose={() => setModal(false)}
        onRefresh={onRefresh}
      />
    ),
    [modal, subject, data, onRefresh],
  );

  const fullName = watch('fullName');
  const dateOfBirth = watch('dateOfBirth');
  const cccd = (watch('cccd') || '').length >= 12 ? watch('cccd') : '';
  const cmnd = (watch('cmnd') || '').length >= 9 ? watch('cmnd') : '';
  const passportNumber = watch('passportNumber');
  const healthInsuranceNumber =
    (watch('healthInsuranceNumber') || '').length >= 15
      ? watch('healthInsuranceNumber')
      : '';
  const key = cccd || cmnd || passportNumber || healthInsuranceNumber;

  const dispatch = useDispatch();
  const handleProfileChecking = useCallback(() => {
    if (fullName && dateOfBirth && isCreateNewSubject) {
      let keyType = 0;
      switch (key) {
        case cccd:
          keyType = SubjectKeyType.CCCD;
          break;
        case cmnd:
          keyType = SubjectKeyType.CMND;
          break;
        case passportNumber:
          keyType = SubjectKeyType.PASSPORT;
          break;
        case healthInsuranceNumber:
          keyType = SubjectKeyType.HEALTHINSURANCE;
          break;
        default:
          break;
      }
      if (key) {
        dispatch(
          getRelated({
            fullName,
            dateOfBirth: moment(dateOfBirth).toJSON(),
            hasYearOfBirthOnly,
            key,
            keyType,
          }),
        );
      }
    }
  }, [
    isCreateNewSubject,
    hasYearOfBirthOnly,
    cccd,
    cmnd,
    passportNumber,
    healthInsuranceNumber,
    fullName,
    dateOfBirth,
    key,
    dispatch,
  ]);

  const { relatedId } = useSelector((s) => s.profile);
  const { id } = useParams();
  const history = useHistory();
  useEffect(() => {
    if (relatedId && isCreateNewSubject) {
      if (isCreateFromAnonymous) {
        httpClient
          .callApi({
            method: 'GET',
            url: `${apiLinks.profiles.get}/${relatedId}`,
          })
          .then(
            ({
              data: {
                fullName: name,
                dateOfBirth: dob,
                gender,
                cccd: cc,
                cmnd: cm,
                healthInsuranceNumber: health,
                passportNumber: pass,
                nationality,
                phoneNumber,
                religion,
                job,
                email,
              },
            }) => {
              dispatch(
                showInfoModal(
                  'Hồ sơ đã tồn tại, thêm thông tin xét nghiệm cho hồ sơ?',
                  <Grid>
                    <Grid.Row columns={2}>
                      <Grid.Column>
                        <InfoRow label="Họ và tên" content={name ?? '...'} />
                        <InfoRow
                          label="Năm sinh"
                          content={moment(dob).format('YYYY') ?? '...'}
                        />
                        <InfoRow
                          label="Căn cước công dân"
                          content={cc ?? '...'}
                        />
                        <InfoRow
                          label="Chứng minh nhân dân"
                          content={cm ?? '...'}
                        />
                        <InfoRow label="Hộ chiếu" content={pass ?? '...'} />
                        <InfoRow
                          label="Bảo hiểm y tế"
                          content={health ?? '...'}
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <InfoRow
                          label="Giới tính"
                          content={gender === 1 ? 'Nam' : 'Nữ'}
                        />
                        <InfoRow
                          label="Quốc tịch"
                          content={
                            nations.find((n) => n.countryCode === nationality)
                              ?.name ?? '...'
                          }
                        />
                        <InfoRow label="Tôn giáo" content={religion ?? '...'} />
                        <InfoRow label="Nghề nghiệp" content={job ?? '...'} />
                        <InfoRow
                          label="Số điện thoại"
                          content={phoneNumber ?? '...'}
                        />
                        <InfoRow label="Email" content={email ?? '...'} />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>,
                  () => {
                    dispatch(mergeProfile(id, relatedId)).then(() => {
                      history.push(`/profile/${relatedId}`);
                    });
                  },
                ),
              );
            },
          );
      } else {
        dispatch(
          showForwardModal('Hồ sơ đã tồn tại, chuyển đến hồ sơ sau: ', () => {
            history.push(`/profile/${relatedId}`);
          }),
        );
      }
    }
    // eslint-disable-next-line
  }, [dispatch, relatedId, isCreateNewSubject]);

  const cccdError = watch('cccd') && watch('cccd').length < 12;
  const cmndError = watch('cmnd') && watch('cmnd').length < 9;
  const insuranceError =
    watch('healthInsuranceNumber') &&
    watch('healthInsuranceNumber').length < 15;

  const enableError = !(
    watch('cccd') ||
    watch('cmnd') ||
    watch('passportNumber') ||
    watch('healthInsuranceNumber')
  );

  useEffect(() => {
    const facilityId = watch('facilityId');
    const homeAddress = watch('homeAddress');
    const gender = watch('gender');
    onDisabled(
      Boolean(
        enableError ||
          cccdError ||
          cmndError ||
          insuranceError ||
          !fullName ||
          gender === null ||
          !dateOfBirth ||
          ((isFullTimeQuarantine || isPartTimeQuarantine) && !facilityId) ||
          ((isPartTimeQuarantine || isCreateFromQuarantine) && !homeAddress),
      ),
    );
    // eslint-disable-next-line
  }, [
    isFullTimeQuarantine,
    isPartTimeQuarantine,
    isCreateFromQuarantine,
    onDisabled,
    watch,
  ]);

  return (
    <>
      {!(readOnly || minimize) && (
        <Form loading={loading}>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Input}
              label="Họ và tên"
              name="fullName"
              value={watch('fullName') || ''}
              onChange={(e, { value }) => {
                setValue('fullName', value);
                onChange(getValues());
              }}
              onBlur={() => {
                setValue('fullName', (watch('fullName') || '').toUpperCase());
                handleProfileChecking();
              }}
              error={!watch('fullName')}
            />
            {minimizeYear ? (
              <Form.Field
                required
                disabled={false}
                type="number"
                readOnly={readOnly}
                label={toggleDOB(minimizeYear, setMinimizeYear)}
                placeholder={
                  watch('dateOfBirth') && moment(watch('dateOfBirth')).isValid()
                    ? moment(watch('dateOfBirth')).format('YYYY')
                    : 'YYYY'
                }
                control={Input}
                onChange={(e, { value }) => {
                  setValue('dateOfBirth', value);
                  onChange(getValues());
                }}
                onBlur={handleProfileChecking}
                error={!watch('dateOfBirth')}
              />
            ) : (
              <Form.Field
                required
                disabled={false}
                label={toggleDOB(minimizeYear, setMinimizeYear)}
                readOnly={readOnly}
                value={watch('dateOfBirth') || ''}
                control={KeyboardDatePicker}
                disabledDays={[{ after: new Date() }]}
                onChange={(date) => {
                  trigger('dateOfBirth');
                  clearErrors('dateOfBirth');
                  setValue('dateOfBirth', date);
                  onChange(getValues());
                }}
                onError={(e) => setError('dateOfBirth', e)}
                onBlur={handleProfileChecking}
                error={!watch('dateOfBirth')}
              />
            )}
            <Form.Field
              // disabled={!isCreateFromContact && Boolean(initialData?.id)}
              label="Căn cước công dân"
              control={Input}
              name="cccd"
              readOnly={readOnly}
              input={{ ref: register }}
              onChange={() => onChange(getValues())}
              onBlur={handleProfileChecking}
              error={
                cccdError
                  ? {
                      content: 'Căn cước công dân phải đủ 12 ký tự',
                      pointing: 'above',
                    }
                  : enableError
              }
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              // disabled={!isCreateFromContact && Boolean(initialData?.id)}
              icon={
                <Icon
                  name="pencil alternate"
                  link
                  onClick={() => {
                    setValue('cmnd', uuidv4());
                  }}
                />
              }
              label="Chứng minh nhân dân"
              control={Input}
              name="cmnd"
              readOnly={readOnly}
              input={{ ref: register }}
              onChange={() => onChange(getValues())}
              onBlur={handleProfileChecking}
              error={
                cmndError
                  ? {
                      content: 'Chứng minh nhân dân phải đủ 9 ký tự',
                      pointing: 'above',
                    }
                  : enableError
              }
            />
            <Form.Field
              label="Hộ chiếu"
              // disabled={!isCreateFromContact && Boolean(initialData?.id)}
              control={Input}
              name="passportNumber"
              readOnly={readOnly}
              input={{ ref: register }}
              onChange={() => onChange(getValues())}
              onBlur={handleProfileChecking}
              error={enableError}
            />
            <Form.Field
              label="Bảo hiểm y tế"
              // disabled={!isCreateFromContact && Boolean(initialData?.id)}
              control={Input}
              name="healthInsuranceNumber"
              readOnly={readOnly}
              input={{ ref: register }}
              onChange={() => onChange(getValues())}
              onBlur={handleProfileChecking}
              error={
                insuranceError
                  ? {
                      content: 'Bảo hiểm y tế phải đủ 15 ký tự',
                      pointing: 'above',
                    }
                  : enableError
              }
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              clearable
              disabled={false}
              label="Giới tính"
              control={Select}
              onBlur={() => {
                onChange(getValues());
              }}
              value={watch('gender')} // dơ vl huhu
              onChange={(e, { value }) => {
                setValue('gender', value);
              }}
              options={genderOptions.filter(
                (g) => g.value === watch('gender') || !readOnly,
              )}
              error={watch('gender') === null}
            />
            <Form.Field
              clearable
              disabled={false}
              search={!readOnly}
              deburr
              label="Quốc tịch"
              control={Select}
              value={watch('nationality') || ''}
              onBlur={() => {
                onChange(getValues());
              }}
              onChange={(e, { value }) => {
                setValue('nationality', value);
              }}
              options={nationOptions.filter(
                (n) => n.value === watch('nationality') || !readOnly,
              )}
            />
            <Form.Field
              clearable
              disabled={false}
              search={!readOnly}
              deburr
              label="Tôn giáo"
              control={Select}
              value={watch('religion') || ''}
              onBlur={() => {
                onChange(getValues());
              }}
              onChange={(e, { value }) => {
                setValue('religion', value);
              }}
              options={religionOptions.filter(
                (r) => r.value === watch('religion') || !readOnly,
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              disabled={false}
              label="Nghề nghiệp"
              name="job"
              readOnly={readOnly}
              input={{ ref: register }}
              onBlur={() => {
                onChange(getValues());
              }}
            />
            <Form.Field
              label="Số điện thoại"
              disabled={false}
              control={Input}
              name="phoneNumber"
              readOnly={readOnly}
              input={{ ref: register }}
              onBlur={() => {
                onChange(getValues());
              }}
            />
            <Form.Field
              label="Email"
              disabled={false}
              control={Input}
              name="email"
              readOnly={readOnly}
              input={{ ref: register }}
              onBlur={() => {
                onChange(getValues());
              }}
            />
          </Form.Group>
        </Form>
      )}
      {(readOnly || minimize) && (
        <MinimizeGeneralInformation data={initialData} />
      )}
      {evaluateModal}
    </>
  );
};

GeneralInformationSection.propTypes = {
  subject: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.number,
    isVerified: PropTypes.bool,
  }),
  loading: PropTypes.bool,
  readOnly: PropTypes.bool,
  minimize: PropTypes.bool,
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fullName: PropTypes.string,
    sKey: PropTypes.string,
    type: PropTypes.number,
    stage: PropTypes.number,
    addressesInVietnam: PropTypes.arrayOf(PropTypes.shape({})),
    workAddresses: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  onChange: PropTypes.func,
  onRefresh: PropTypes.func,
  onDisabled: PropTypes.func,
  isCreateNewSubject: PropTypes.bool,
  isCreateFromAnonymous: PropTypes.bool,
  isCreateFromQuarantine: PropTypes.bool,
  isFullTimeQuarantine: PropTypes.bool,
  isPartTimeQuarantine: PropTypes.bool,
  fromSubject: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.number,
  }),
};

GeneralInformationSection.defaultProps = {
  subject: {
    id: 0,
    isVerified: false,
    type: 0,
  },
  loading: false,
  readOnly: false,
  minimize: false,
  initialData: {
    id: 0,
    fullName: '',
    sKey: '',
    type: -1,
    stage: -1,
    nationality: '',
    email: '',
    dateOfBirth: '',
    cmnd: '',
    phoneNumber: '',
    gender: 1,
    addressesInVietnam: [],
    workAddresses: [],
  },
  onChange: () => {},
  onRefresh: () => {},
  onDisabled: () => {},
  isCreateNewSubject: false,
  isCreateFromAnonymous: false,
  isCreateFromQuarantine: false,
  isFullTimeQuarantine: false,
  isPartTimeQuarantine: false,
  fromSubject: {},
};

export default GeneralInformationSection;
