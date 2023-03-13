import React from 'react';
import PropTypes from 'prop-types';
import { InstantSearchBar } from 'app/components/shared';

const CompletedSubjectFilter = (props) => {
  const { onChange } = props;
  return <InstantSearchBar onChange={onChange} />;
};

CompletedSubjectFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default CompletedSubjectFilter;
