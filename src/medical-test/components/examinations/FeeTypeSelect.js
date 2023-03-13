import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

const feeTypeOptions = [
  { value: -1, text: 'Tất cả' },
  { value: 0, text: 'Không thu phí' },
  { value: 1, text: 'Thu phí' },
];

const FeeTypeSelect = ({
  displayValueOnly,
  required,
  clearable,
  disabled,
  value,
  onChange,
}) => (
  <>
    <Form.Select
      search
      required={required}
      clearable={clearable}
      disabled={disabled}
      label="Loại hình"
      options={
        displayValueOnly
          ? feeTypeOptions.filter((e) => e.value > -1)
          : feeTypeOptions
      }
      // eslint-disable-next-line no-nested-ternary
      value={typeof value === 'number' ? value : displayValueOnly ? '' : -1}
      onChange={(_, { value: v }) => onChange(v > -1 ? v : '')}
    />
  </>
);

FeeTypeSelect.propTypes = {
  clearable: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  displayValueOnly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};
FeeTypeSelect.defaultProps = {
  value: '',
  required: false,
  clearable: false,
  displayValueOnly: false,
  disabled: false,
};
export default FeeTypeSelect;
