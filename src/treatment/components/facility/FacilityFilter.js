import React from 'react';
import PropTypes from 'prop-types';

import { FilterSearchBar } from 'app/components/shared';

const FacilityFilter = ({ onChange }) => {
  const handleChange = (filter) => {
    onChange({
      filter,
    });
  };

  return <FilterSearchBar onChange={handleChange} />;
};

FacilityFilter.propTypes = {
  onChange: PropTypes.func,
};

FacilityFilter.defaultProps = {
  onChange: () => {},
};

export default FacilityFilter;
