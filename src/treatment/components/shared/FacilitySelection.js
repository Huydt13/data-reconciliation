import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'semantic-ui-react';

import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

const FacilitySelection = ({ required, hiddenIds }) => {
  const methods = useFormContext();
  const { data: facilityList } = useSelector(
    (state) => state.treatment.facility.facilityData,
  );
  const getFacilitiesLoading = useSelector(
    (state) => state.treatment.facility.getFacilitiesLoading,
  );
  return (
    <Controller
      control={methods.control}
      defaultValue=""
      name="facilityId"
      rules={{ required }}
      render={({ onChange, onBlur, value }) => (
        <Form.Select
          search
          deburr
          clearable
          required={required}
          fluid
          label="Cơ sở tiếp nhận"
          value={value}
          onChange={(_, { value: v }) => onChange(v)}
          onBlur={onBlur}
          loading={getFacilitiesLoading}
          error={methods.errors.facilityId && 'Bắt buộc'}
          options={facilityList
            .filter(({ id }) => !hiddenIds.includes(id))
            .map((pr) => ({
              key: pr.id,
              text: pr.name,
              value: pr.id,
            }))}
        />
      )}
    />
  );
};

FacilitySelection.propTypes = {
  hiddenIds: PropTypes.arrayOf(PropTypes.string),
  required: PropTypes.bool,
};

FacilitySelection.defaultProps = {
  hiddenIds: [],
  required: false,
};

export default FacilitySelection;
