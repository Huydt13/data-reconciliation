import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Input, Dropdown } from 'semantic-ui-react';

const StyledDropdown = styled(Dropdown)`
  background: none !important;
  border: 1px solid #E8E8E8 !important;
`;

const typeOptions = [
  { value: 0, text: 'Tên' },
  { value: 1, text: 'Số điện thoại' },
];

const DuplicateProfileFilter = ({ onChange }) => {
  const [type, setType] = useState(0);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSelect = (value) => {
    setType(value);
    if (type === 0) {
      setName('');
    } else {
      setPhoneNumber('');
    }
  };

  const handleChange = () => {
    onChange({
      name: type === 0 ? name : '',
      phoneNumber: type !== 0 ? phoneNumber : '',
    });
  };

  return (
    <>
      <Input
        fluid
        placeholder="Từ khoá"
        onChange={(_, { value: v }) => type === 0 ? setName(v.toLowerCase()) : setPhoneNumber(v.toLowerCase())}
        input={
          <input
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleChange();
              }
            }}
          />
        }
        label={
          <StyledDropdown
            defaultValue={typeOptions[0].value}
            options={typeOptions}
            onChange={(_, { value: v }) => handleSelect(v)}
          />
        }
        action={{
          color: 'twitter',
          icon: 'search',
          labelPosition: 'right',
          content: 'Tìm kiếm',
          onClick: () => handleChange(),
        }}
      />
    </>
  );
};

DuplicateProfileFilter.propTypes = {
  onChange: PropTypes.func,
};

DuplicateProfileFilter.defaultProps = {
  onChange: () => {},
};

export default DuplicateProfileFilter;
