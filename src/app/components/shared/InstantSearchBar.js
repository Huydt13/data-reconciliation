import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon, Input } from 'semantic-ui-react';
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

const StyledIcon = styled(Icon)`
  margin-right: 30px !important;
`;

const InstantSearchBar = (props) => {
  const {
    deburr,
    checkbox,
    onCheckboxChange,
    placeholder,
    value,
    disabled,
    onChange,
    onDeburr,
    children,
    loading,
    onEnter,
    isCloseFilter,
  } = props;

  const [expand, setExpand] = useState(false);
  useEffect(() => {
    if (expand && isCloseFilter) {
      setExpand(false);
    }
    // eslint-disable-next-line
  }, [isCloseFilter]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (event) => {
    const { value: val } = event.target;
    setSearchValue(val);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(
      setTimeout(() => {
        onChange(val.toLowerCase());
      }, 300),
    );
  };

  const [isDeburr, setIsDeburr] = useState(true);
  useEffect(() => onDeburr(isDeburr), [isDeburr, onDeburr]);
  const [isCheckbox, setIsCheckbox] = useState(false);
  useEffect(() => onCheckboxChange(isCheckbox), [isCheckbox, onCheckboxChange]);

  return (
    <StyledAccordion fluid styled>
      <Accordion.Title active={expand}>
        <Input
          fluid
          icon={
            <>
              {deburr && (
                <StyledIcon
                  name={isDeburr ? 'toggle on' : 'toggle off'}
                  link
                  onClick={() => setIsDeburr(!isDeburr)}
                />
              )}
              {checkbox && (
                <StyledIcon
                  name={isCheckbox ? 'square check outline' : 'square outline'}
                  link
                  onClick={() => setIsCheckbox(!isCheckbox)}
                />
              )}
              <Icon name="search" />
            </>
          }
          placeholder={placeholder}
          value={value === '' ? value : searchValue}
          onChange={handleChange}
          input={
            <input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onEnter(e.target.value.toLowerCase());
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
        />
      </Accordion.Title>
      <Accordion.Content active={expand}>{children}</Accordion.Content>
    </StyledAccordion>
  );
};

InstantSearchBar.propTypes = {
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Placeholder */
  value: PropTypes.string,
  /** Input change callback */
  onChange: PropTypes.func,
  /** Disabled input */
  disabled: PropTypes.bool,
  /** Checkbox callback */
  onCheckboxChange: PropTypes.func,
  /** Checkbox input */
  checkbox: PropTypes.bool,
  /** Loading input */
  loading: PropTypes.bool,
  /** Expandable children */
  children: PropTypes.node,
  /** Deburr input */
  deburr: PropTypes.bool,
  /** Close filter */
  isCloseFilter: PropTypes.bool,
  /** Deburr callback */
  onDeburr: PropTypes.func,
  /** Enter callback */
  onEnter: PropTypes.func,
};

InstantSearchBar.defaultProps = {
  placeholder: 'Search',
  value: ' ',
  onChange: () => {},
  disabled: false,
  checkbox: false,
  onCheckboxChange: () => {},
  loading: false,
  children: null,
  deburr: false,
  isCloseFilter: false,
  onDeburr: () => {},
  onEnter: () => {},
};

export default InstantSearchBar;
