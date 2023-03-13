import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Form } from 'semantic-ui-react';

import { Controller, useFormContext } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import {
  getSamplingPlaces,
  setExaminationInputCache,
} from 'medical-test/actions/medical-test';

const SamplingPlaceSection = ({ required }) => {
  const dispatch = useDispatch();
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const inputCache = useSelector((s) => s.medicalTest.inputCache);

  const options = useSelector((s) => s.medicalTest.samplingPlaceList);
  const loading = useSelector((s) => s.medicalTest.getSamplingPlacesLoading);

  useEffect(() => {
    dispatch(getSamplingPlaces());
  }, [dispatch]);

  return (
    <div className="ui form">
      <Form.Group widths="equal">
        <Controller
          name="samplingPlaceId"
          defaultValue={inputCache?.samplingPlaceId ?? ''}
          rules={{ required }}
          control={control}
          render={({ onChange, onBlur, value, name }) => (
            <Form.Select
              fluid
              search
              deburr
              clearable
              required={required}
              loading={loading}
              label="Nơi lấy mẫu"
              value={value}
              options={_.orderBy(options, ({ name: n }) => n).map(
                ({ id, name: n }) => ({
                  value: id,
                  text: n,
                }),
              )}
              onChange={(__, { value: v }) => {
                onChange(v);
                dispatch(setExaminationInputCache({ [name]: v }));
              }}
              onBlur={onBlur}
              error={errors.samplingPlaceId && 'Bắt buộc'}
            />
          )}
        />
      </Form.Group>
    </div>
  );
};

SamplingPlaceSection.propTypes = {
  required: PropTypes.bool,
};

SamplingPlaceSection.defaultProps = {
  required: false,
};

export default SamplingPlaceSection;
