import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Button, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import { FiMenu } from 'react-icons/fi';

const StyledAccordion = styled(Accordion)`
  box-shadow: none !important;
  .title {
    padding: 0 !important;
  }
  .content {
    border: 1px solid rgba(34, 36, 38, 0.15);
    border-top: none;
    border-bottom-right-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
    padding: 8px !important;
  }
`;

const StyledButton = styled(Button)`
  margin-left: 8px !important;
  margin-bottom: 8px !important;
`;

const FilterSearchBar = ({
  placeholder,
  disabled,
  onChange,
  onReset,
  children,
  loading,
}) => {
  const [expand, setExpand] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <StyledAccordion fluid styled>
      <Accordion.Title active={expand}>
        <Input
          fluid
          placeholder={placeholder}
          onChange={(_, { value: v }) => setSearchValue(v.toLowerCase())}
          input={
            <input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onChange(searchValue);
                }
              }}
            />
          }
          loading={disabled || loading}
          label={
            children
              ? {
                  basic: true,
                  content: <FiMenu />,
                  onClick: () => setExpand(!expand),
                }
              : null
          }
          action={
            !expand
              ? {
                  color: 'twitter',
                  icon: 'search',
                  labelPosition: 'right',
                  content: 'Tìm kiếm',
                  onClick: () => onChange(searchValue),
                }
              : null
          }
        />
      </Accordion.Title>
      <Accordion.Content active={expand}>
        {children}
        {onReset && (
          <StyledButton
            primary
            labelPosition="right"
            icon="sync"
            content="Reset"
            onClick={onReset}
          />
        )}
        <StyledButton
          color="twitter"
          labelPosition="right"
          icon="filter"
          content="Áp dụng"
          onClick={() => onChange(searchValue)}
        />
      </Accordion.Content>
    </StyledAccordion>
  );
};

FilterSearchBar.propTypes = {
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Input change callback */
  onChange: PropTypes.func,
  /** Reset callback */
  onReset: PropTypes.func,
  /** Disabled input */
  disabled: PropTypes.bool,
  /** Checkbox callback */
  loading: PropTypes.bool,
  /** Expandable children */
  children: PropTypes.node,
};

FilterSearchBar.defaultProps = {
  placeholder: 'Search',
  onChange: () => {},
  onReset: null,
  disabled: false,
  loading: false,
  children: null,
};

export default FilterSearchBar;
