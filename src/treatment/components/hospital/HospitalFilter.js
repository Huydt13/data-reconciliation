import React from 'react';
import PropTypes from 'prop-types';

import { FilterSearchBar } from 'app/components/shared';

const HospitalFilter = ({ onChange }) => {
  const handleChange = (name) => {
    onChange({
      name,
    });
  };

  return <FilterSearchBar onChange={handleChange} />;
};

HospitalFilter.propTypes = {
  onChange: PropTypes.func,
};

HospitalFilter.defaultProps = {
  onChange: () => {},
};

export default HospitalFilter;
