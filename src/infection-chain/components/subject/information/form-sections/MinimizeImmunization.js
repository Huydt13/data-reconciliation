/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Form, Select, Button } from 'semantic-ui-react';
import { KeyboardDateTimePicker } from 'app/components/shared';
import EditableLabel from 'app/components/shared/EditableLabel';

import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';
import {
  getProfile,
  createImmunizationForProfile,
  updateImmunizationForProfile,
} from 'profile/actions/profile';
import { formatToTime } from 'app/utils/helpers';
import {
  immunizationStatusOptions /* , vaccineTypeOptions */,
} from 'profile/utils/helpers';
import { IMMUNIZATION_STATUSES } from 'profile/utils/constants';

const Flex = styled.div`
  display: flex;
`;
const Wrapper = styled.div`
  margin-left: 3px;
  margin-top: 5px;
  margin-bottom: 3px;

  & .DayPickerInput {
    & input {
      padding: 0.435em 0.875em !important;
    }
  }
`;

const MinimizeImmunization = ({ data, disabled }) => {
  const { immunizations } = data;

  const [readOnly, setReadOnly] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const {
    createImmunizationForProfileLoading,
    updateImmunizationForProfileLoading,
  } = useSelector((state) => state.profile);

  const dispatch = useDispatch();
  const { isUsername } = useAuth();
  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loading =
    createImmunizationForProfileLoading || updateImmunizationForProfileLoading;

  const immunizationLatest = useMemo(() => {
    if (immunizations && immunizations.length > 0) {
      return immunizations.reduce(
        (o, i) => (new Date(i.dateCreated) > new Date(o.dateCreated) ? i : o),
        immunizations[0]
      );
    }
    return undefined;
  }, [immunizations]);

  const statusOptions = useMemo(() => {
    if (
      !isUsername('hcdc') &&
      immunizationLatest &&
      typeof immunizationLatest.immunizationStatus === 'number'
    ) {
      const key = immunizationStatusOptions.reduce((_, status, index) => {
        if (status.value === immunizationLatest.immunizationStatus) {
          return index;
        }
        return _;
      }, 0);

      return immunizationStatusOptions.slice(key);
    }
    return immunizationStatusOptions;
    // eslint-disable-next-line
  }, [immunizationLatest]);

  const onSubmit = async (d) => {
    if (data?.id) {
      try {
        await dispatch(
          immunizationLatest &&
            d.immunizationStatus <= immunizationLatest.immunizationStatus
            ? updateImmunizationForProfile({
                ...d,
                id: immunizationLatest.guid,
                guid: immunizationLatest.guid,
                profileId: immunizationLatest.profileId,
                // vaccine:
                //   (d.immunizationStatus === IMMUNIZATION_STATUSES.NO_RECORD ||
                //     d.immunizationStatus === IMMUNIZATION_STATUSES.NO_VACCINE)
                //   ? null
                //   : d.vaccine,
                injectionDate:
                  d.immunizationStatus === IMMUNIZATION_STATUSES.NO_RECORD ||
                  d.immunizationStatus === IMMUNIZATION_STATUSES.NO_VACCINE
                    ? null
                    : d.injectionDate,
              })
            : createImmunizationForProfile({
                ...d,
                profileId: data.id,
                // vaccine:
                //   (d.immunizationStatus === IMMUNIZATION_STATUSES.NO_RECORD ||
                //     d.immunizationStatus === IMMUNIZATION_STATUSES.NO_VACCINE)
                //   ? null
                //   : d.vaccine,
                injectionDate:
                  d.immunizationStatus === IMMUNIZATION_STATUSES.NO_RECORD ||
                  d.immunizationStatus === IMMUNIZATION_STATUSES.NO_VACCINE
                    ? null
                    : d.injectionDate,
              })
        );
        // eslint-disable-next-line no-empty
      } catch (error) {}
      await dispatch(getProfile(data.id));
    }
    setOpenCreate(false);
    reset({});
  };

  const labels = [
    {
      rowIndex: 0,
      col: [
        {
          name: 'disease',
          label: 'Bệnh:',
          value: immunizationLatest?.disease,
          disabled: true,
        },
        {
          type: 'select',
          name: 'immunizationStatus',
          label: 'Trạng thái tiêm vắc xin:',
          value: immunizationLatest?.immunizationStatus,
          dropdownOptions: statusOptions,
          disabled: true,
        },
        // {
        //   type: 'select',
        //   name: 'vaccine',
        //   label: 'Loại vắc xin:',
        //   value: immunizationLatest?.vaccine,
        //   dropdownOptions: vaccineTypeOptions,
        //   disabled: true,
        // },
        {
          type: 'date-time',
          name: 'injectionDate',
          label: 'Ngày tiêm gần nhất:',
          value: formatToTime(immunizationLatest?.injectionDate),
          disabled: true,
        },
      ],
    },
  ];

  const ruleOptions = {
    immunizationStatus: {
      validate: () => {
        const immunizationStatus = watch('immunizationStatus');
        const error =
          typeof immunizationStatus !== 'number' ? 'Bắt buộc' : undefined;
        return error || true;
      },
    },
    // vaccine: {
    //   required: 'Bắt buộc',
    // },
    injectionDate: {
      validate: () => {
        const immunizationStatus = watch('immunizationStatus');
        if (
          immunizationStatus !== IMMUNIZATION_STATUSES.NO_RECORD &&
          immunizationStatus !== IMMUNIZATION_STATUSES.NO_VACCINE
        ) {
          const date = watch('injectionDate');
          const error = date
            ? date < new Date(2021, 0, 1)
              ? 'Thời gian phải lớn hơn 01/01/2021'
              : undefined
            : 'Bắt buộc';
          return error || true;
        }
      },
    },
  };

  return (
    <>
      {!openCreate &&
        labels.map((r) => (
          <Flex key={r.rowIndex}>
            {r.col.map((f) => (
              <EditableLabel
                // style props
                key={f.name}
                header={f.label}
                content={f.value}
                // logic props
                name={f.name}
                disabled={f?.disabled}
                type={f?.type}
                dropdownOptions={f?.dropdownOptions}
              />
            ))}
          </Flex>
        ))}
      <Wrapper>
        {openCreate && (
          <Form size='tiny'>
            <Form.Group>
              <Controller
                name='disease'
                control={control}
                defaultValue='Covid-19'
              />
              <Controller
                name='immunizationStatus'
                control={control}
                defaultValue=''
                rules={ruleOptions.immunizationStatus}
                render={({ onChange, onBlur, value }) => (
                  <Form.Field
                    fluid
                    search
                    width={3}
                    error={errors.immunizationStatus?.message}
                    label='Trạng thái tiêm vắc xin'
                    control={Select}
                    value={value}
                    options={statusOptions}
                    onChange={(__, { value: v }) => {
                      if (
                        v === IMMUNIZATION_STATUSES.NO_RECORD ||
                        v === IMMUNIZATION_STATUSES.NO_VACCINE
                      ) {
                        // setValue('vaccine', undefined);
                        setValue('injectionDate', null);
                        setReadOnly(true);
                      } else if (readOnly) {
                        setReadOnly(false);
                      }
                      onChange(v);
                    }}
                    onBlur={onBlur}
                  />
                )}
              />
              {/* <Controller
                name="vaccine"
                control={control}
                defaultValue=""
                rules={ruleOptions.vaccine}
                render={({ onChange, onBlur, value }) => (
                  <Form.Field
                    fluid
                    search
                    width={3}
                    error={errors.vaccine?.message}
                    label="Loại vắc xin"
                    control={Select}
                    value={value}
                    options={vaccineTypeOptions}
                    onChange={(__, { value: v }) => onChange(v)}
                    onBlur={onBlur}
                  />
                )}
              /> */}
              <Controller
                name='injectionDate'
                control={control}
                defaultValue=''
                rules={ruleOptions.injectionDate}
                render={({ onChange, onBlur, value }) => (
                  <Form.Field
                    fluid
                    width={5}
                    required={!readOnly}
                    disabled={readOnly}
                    error={errors.injectionDate?.message}
                    label='Ngày tiêm gần nhất'
                    control={KeyboardDateTimePicker}
                    disabledDays={[
                      {
                        before: new Date(2021, 0, 1),
                        after: new Date(),
                      },
                    ]}
                    value={value}
                    onChange={(v) => onChange(v)}
                    onBlur={onBlur}
                  />
                )}
              />
            </Form.Group>
          </Form>
        )}
        {!disabled && (
          <Button
            size='mini'
            color='green'
            content='Cập nhật'
            loading={loading}
            onClick={() => {
              if (!openCreate) {
                setOpenCreate(true);
                reset(immunizationLatest);
              } else {
                handleSubmit((d) => onSubmit(d))();
              }
            }}
          />
        )}
        {openCreate && (
          <Button
            size='mini'
            content='Đóng'
            onClick={() => setOpenCreate(false)}
          />
        )}
      </Wrapper>
    </>
  );
};

MinimizeImmunization.propTypes = {
  disabled: PropTypes.bool,
  data: PropTypes.shape({
    id: PropTypes.number,
    immunizations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        disease: PropTypes.string,
        immunizationStatus: PropTypes.number,
        // vaccine: PropTypes.string,
        injectionDate: PropTypes.string,
      })
    ),
  }),
};

MinimizeImmunization.defaultProps = {
  disabled: false,
  data: {},
};

export default MinimizeImmunization;
