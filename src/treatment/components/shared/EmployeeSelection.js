import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'semantic-ui-react';

import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

const EmployeeSelection = ({ required }) => {
  const methods = useFormContext();
  const employeeList = useSelector(
    (state) => state.treatment.employee.employeeList,
  );
  const getEmployeesLoading = useSelector(
    (state) => state.treatment.employee.getEmployeesLoading,
  );
  return (
    <Controller
      control={methods.control}
      defaultValue=""
      name="employeeId"
      rules={{ required }}
      render={({ onChange, onBlur, value }) => (
        <Form.Select
          fluid
          search
          deburr
          clearable
          required={required}
          label="Nhân viên y tế"
          value={value}
          onChange={(_, { value: v }) => onChange(v)}
          onBlur={onBlur}
          loading={getEmployeesLoading}
          error={methods.errors.employeeId && 'Bắt buộc'}
          options={employeeList.map((pr) => ({
            key: pr.id,
            text: pr.name,
            value: pr.id,
          }))}
        />
      )}
    />
  );
};

EmployeeSelection.propTypes = {
  required: PropTypes.bool,
};

EmployeeSelection.defaultProps = {
  required: false,
};

export default EmployeeSelection;
