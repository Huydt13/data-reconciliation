/* eslint-disable no-empty */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import { Form, Header, Icon } from 'semantic-ui-react';
import { KeyboardDateTimePicker } from 'app/components/shared';

import { useAuth } from 'app/hooks';
import { isEqualObject, isUndefinedOrNullObject } from 'app/utils/helpers';
import {
  immunizationStatusOptions as statusOptions /* ,vaccineTypeOptions */,
} from 'profile/utils/helpers';
import { IMMUNIZATION_STATUSES } from 'profile/utils/constants';

const StyledIcon = styled(Icon)`
  font-size: 1em !important;
  margin-left: 0.4em !important;
  margin-bottom: 0.4em !important;
`;

const ImmunizationSection = (props) => {
  const { initialData, fillData, errorText, onChange: onChangeProps } = props;
  const [readOnly, setReadOnly] = useState(true);

  const { isUsername } = useAuth();
  const { reset, control, setValue, getValues } = useForm({
    defaultValues: initialData,
  });

  const immunizationStatusOptions = useMemo(() => {
    const result = _.cloneDeep(statusOptions);
    if (
      !isUsername('hcdc') &&
      fillData &&
      typeof fillData.immunizationStatus === 'number'
    ) {
      const key = result.reduce((__, status, index) => {
        if (status.value === fillData.immunizationStatus) {
          return index;
        }
        return __;
      }, 0);
      return result.slice(key);
    }
    return result;
    // eslint-disable-next-line
  }, [fillData]);

  const getValueFromJson = (json, property) => {
    try {
      const obj = JSON.parse(json);
      return obj[property];
    } catch (e) {}
    return '';
  };

  const validate = (d) => {
    const r = _.cloneDeep(d);
    if (d?.immunizationStatus && typeof d.immunizationStatus === 'number') {
      if (
        !immunizationStatusOptions.find(
          (option) => option.value === d.immunizationStatus
        )
      ) {
        // setValue('vaccine', '');
        setValue('injectionDate', null);
        r.injectionDate = null;
      }
      if (
        d.immunizationStatus === IMMUNIZATION_STATUSES.NO_RECORD ||
        d.immunizationStatus === IMMUNIZATION_STATUSES.NO_VACCINE
      ) {
        setReadOnly(true);
        // setValue('vaccine', '');
        setValue('injectionDate', null);
        r.injectionDate = null;
      } else {
        setReadOnly(false);
      }
    }
    return r;
  };

  const triggerOnChange = (d) => {
    const payload = d || getValues();
    onChangeProps(payload);
  };

  useEffect(() => {
    const values = getValues();
    if (!isUndefinedOrNullObject(initialData)) {
      if (
        !isUndefinedOrNullObject(values) &&
        !isEqualObject(values, initialData, ['guid', 'immunizationStatus'])
      ) {
        const formater = validate(initialData);
        reset(formater);
        triggerOnChange(formater);
      }
    }
    // eslint-disable-next-line
  }, [initialData]);

  return (
    <div className='ui form'>
      <Header as='h5'>
        Tiền sử tiêm chủng
        {fillData && typeof fillData.immunizationStatus === 'number' ? (
          <StyledIcon
            link
            size='tiny'
            name='pencil alternate'
            onClick={() => {
              const formater = validate(fillData);
              reset(formater);
              triggerOnChange(formater);
            }}
          />
        ) : null}
      </Header>
      <Form.Group widths='equal'>
        <Controller name='guid' defaultValue='' control={control} />
        <Controller
          name='immunizationStatus'
          defaultValue=''
          control={control}
          render={({ onChange, value }) => (
            <Form.Select
              fluid
              deburr
              search
              required
              error={
                errorText.includes('immunizationStatus') &&
                getValueFromJson(errorText, 'immunizationStatus')
              }
              label='Trạng thái tiêm vắc xin'
              value={value}
              onChange={(__, { value: v }) => {
                if (v !== value) {
                  onChange(v);
                  validate(getValues());
                  triggerOnChange();
                }
              }}
              options={immunizationStatusOptions}
            />
          )}
        />
        {/* <Controller
          name="vaccine"
          defaultValue=""
          control={control}
          render={({ onChange, value }) => (
            <Form.Select
              fluid
              deburr
              search
              required={!readOnly}
              disabled={readOnly}
              error={errorText.includes('vaccine') && 'Bắt buộc'}
              label="Loại vắc xin"
              value={value}
              onChange={(_, { value: v }) => {
                if (v !== value) {
                  onChange(v);
                  triggerOnChange();
                }
              }}
              options={vaccineTypeOptions}
            />
          )}
        /> */}
        <Controller
          name='injectionDate'
          defaultValue=''
          control={control}
          render={({ onChange, value }) => (
            <Form.Field
              isHavingTime
              required={!readOnly}
              disabled={readOnly}
              error={
                errorText.includes('injectionDate') &&
                getValueFromJson(errorText, 'injectionDate')
              }
              control={KeyboardDateTimePicker}
              label='Ngày tiêm gần nhất'
              value={value}
              disabledDays={[
                {
                  after: new Date(),
                  before: fillData?.injectionDate
                    ? new Date(fillData.injectionDate)
                    : new Date(2021, 0, 0),
                },
              ]}
              onChange={(v) => {
                if (!moment(v).isSame(moment(value))) {
                  onChange(v);
                  triggerOnChange();
                }
              }}
            />
          )}
        />
      </Form.Group>
    </div>
  );
};

ImmunizationSection.propTypes = {
  initialData: PropTypes.shape({
    immunizationStatus: PropTypes.number,
  }),
  fillData: PropTypes.shape({
    immunizationStatus: PropTypes.number,
  }),
  errorText: PropTypes.string,
  onChange: PropTypes.func,
};

ImmunizationSection.defaultProps = {
  initialData: {},
  fillData: {},
  errorText: '',
  onChange: () => {},
};

export default ImmunizationSection;
