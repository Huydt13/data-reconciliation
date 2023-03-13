import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'semantic-ui-react';
import moment from 'moment';


const years = [
  { text: moment().format('YYYY'), value: moment().format('YYYY') },
  {
    text: moment().add(1, 'years').format('YYYY'),
    value: moment().add(1, 'years').format('YYYY'),
  },
  {
    text: moment().add(2, 'years').format('YYYY'),
    value: moment().add(2, 'years').format('YYYY'),
  },
];


const SelectYear = (props) => {
  const { onChange } = props;
  useEffect(() => {
    onChange(moment().format('YYYY'));
    // eslint-disable-next-line
  }, []);

  return (
    <Form.Field
      required
      clearable
      label="Năm"
      control={Select}
      options={years}
      defaultValue={moment().format('YYYY')}
      onChange={(e, { value }) => onChange(value)}
    />
  );
};

SelectYear.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default SelectYear;
