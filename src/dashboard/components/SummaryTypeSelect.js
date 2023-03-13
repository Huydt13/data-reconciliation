import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'semantic-ui-react';
import { summaryOptions } from 'infection-chain/utils/helpers';

const SummaryTypeSelect = (props) => {
  const { onChange } = props;
  return (
    <Select
      style={{
        marginRight: '8px',
      }}
      options={summaryOptions}
      placeholder="Thống kê chuỗi lây nhiễm"
      onChange={(e, { value }) => onChange(value)}
    />
  );
};

SummaryTypeSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default SummaryTypeSelect;
