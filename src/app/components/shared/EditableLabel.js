/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { FiEdit2 } from 'react-icons/fi';
import {
  Dropdown,
  Icon,
  Input,
  Label as Lb,
  Popup,
  Select,
} from 'semantic-ui-react';
import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';
import { deburr } from 'app/utils/helpers';

const Wrapper = styled.div`
  & .ui.label:not(.circular) {
    margin-left: 3px !important;
    margin-right: 0 !important;
    margin-bottom: 3px;
    font-weight: normal !important;
    font-size: 0.9em !important;
  }
  & .detail {
    margin-left: 3px !important;
  }
`;

const WrapperIcon = styled.i`
  display: none;
  margin-right: 0 !important;
  margin-left: 0.5em !important;
  font-size: 0.868em !important;
`;

const MarginRightIcon = styled(Icon)`
  margin-right: 20px !important;
`;
const MarginLeftIcon = styled(Icon)`
  margin-left: 20px !important;
`;

const FloatRight = styled.div`
  float: right;
`;
const MarginFloatRight = styled.div`
  margin-top: 4px;
  float: right;
`;

const Label = styled(Lb)`
  &:not(.readonly) {
    cursor: pointer;
  }

  &:not(.readonly):hover {
    background: none #ffffff !important;
    color: #1a1c1d !important;
    border-color: #1a1c1d !important;
  }

  &:not(.readonly):hover ${WrapperIcon} {
    display: inline-block;
  }
`;

const MiniSelect = styled(Select)`
  font-size: 0.8125em;
  padding: 0.6875em 0.975em 0.6875em 0.875em !important;
`;

const StyledDropdown = styled(Dropdown)`
  & > i.dropdown.icon {
    display: none !important;
  }

  .readonly {
    cursor: auto !important;
  }
`;

const StyledInput = styled(Input)`
  & .label {
    margin-bottom: 0 !important;
  }

  & .error {
    border: 1px solid #e7bdbc !important;
  }

  & .fields {
    margin-left: 3px !important;
    margin-right: 0 !important;
    margin-bottom: 3px;
    font-weight: normal !important;
    font-size: 0.9em !important;

    & .DayPickerInput {
      & input {
        padding: 0.4733em 0.833em !important;
      }
    }
  
    & input[type="time"] {
      padding: 0.4733em 0.833em !important;
    }
  }
`;

const YLabel = styled.span`
  cursor: ${({ year }) => (year === 0 ? 'pointer' : '')};
  font-weight: ${({ year }) => (year === 1 ? 'bold' : '')};
`;
const DLabel = styled.span`
  cursor: ${({ year }) => (year === 1 ? 'pointer' : '')};
  font-weight: ${({ year }) => (year === 0 ? 'bold' : '')};
`;

const EditableLabel = ({
  // style props
  color,
  header,
  content,
  description,
  maxLength,

  // logic props
  name,
  type,
  randomable,
  showValue,
  loading,
  disabled,
  dropdownOptions,

  onChange,
  selectingKey,
  setSelectingKey,

  // validate props
  required,
  validate,
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const [hasYearOfBirthOnly, setHasYearOfBirthOnly] = useState(false);
  useEffect(() => {
    if (name === 'dateOfBirth' && typeof description === 'boolean') {
      setHasYearOfBirthOnly(description);
    }
  }, [name, description]);

  const renderInput = () => {
    if (name === 'dateOfBirth') {
      return (
        <StyledInput
          type={hasYearOfBirthOnly ? 'text' : 'date'}
          size="mini"
          label={
            <div className="ui label">
              <YLabel
                year={hasYearOfBirthOnly ? 1 : 0}
                onClick={() => setHasYearOfBirthOnly(true)}
              >
                Năm sinh
              </YLabel>
              <span>/</span>
              <DLabel
                year={hasYearOfBirthOnly ? 1 : 0}
                onClick={() => setHasYearOfBirthOnly(false)}
              >
                Ngày sinh
              </DLabel>
            </div>
          }
          placeholder={content}
          onChange={(_, { value: v }) => setValue(v)}
          input={
            <input
              className={`editable-input ${error && 'error'}`}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  const convertedValue = value
                    .trim()
                    .replace(/[\n\r\s\t]+/g, ' ');
                  if (required) {
                    if (convertedValue.length === 0) {
                      setError(true);
                      return false;
                    }
                  }

                  if (validate) {
                    if (!validate(convertedValue)) {
                      setError(true);
                      return false;
                    }
                  }

                  setError(false);

                  await onChange(convertedValue, hasYearOfBirthOnly);
                  setSelectingKey(undefined);
                }
              }}
            />
          }
          icon={
            loading ? (
              <MarginLeftIcon loading name="spinner" />
            ) : (
              <>
                <MarginRightIcon
                  link
                  color="green"
                  name="checkmark"
                  onClick={async () => {
                    const convertedValue = value
                      .trim()
                      .replace(/[\n\r\s\t]+/g, ' ');
                    if (required) {
                      if (convertedValue.length === 0) {
                        setError(true);
                        return false;
                      }
                    }

                    if (validate) {
                      if (!validate(convertedValue)) {
                        setError(true);
                        return false;
                      }
                    }
                    setError(false);

                    await onChange(value);
                    setSelectingKey(undefined);
                  }}
                />
                <Icon
                  link
                  color="red"
                  name="x"
                  onClick={() => {
                    setSelectingKey(undefined);
                  }}
                />
              </>
            )
          }
        />
      );
    }
    switch (type) {
      case 'input':
        return (
          <StyledInput
            size="mini"
            label={header}
            placeholder={content}
            onChange={(_, { value: v }) => setValue(v)}
            input={
              <input
                className={`editable-input ${error && 'error'}`}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    const convertedValue = value
                      .trim()
                      .replace(/[\n\r\s\t]+/g, ' ');
                    if (required) {
                      if (convertedValue.length === 0) {
                        setError(true);
                        return false;
                      }
                    }

                    if (validate) {
                      if (!validate(convertedValue)) {
                        setError(true);
                        return false;
                      }
                    }

                    setError(false);

                    await onChange(convertedValue);
                    setSelectingKey(undefined);
                  }
                }}
              />
            }
            icon={
              loading ? (
                <MarginLeftIcon loading name="spinner" />
              ) : (
                <>
                  <MarginRightIcon
                    link
                    color="green"
                    name="checkmark"
                    onClick={async () => {
                      const convertedValue = value
                        .trim()
                        .replace(/[\n\r\s\t]+/g, ' ');
                      if (required) {
                        if (convertedValue.length === 0) {
                          setError(true);
                          return false;
                        }
                      }

                      if (validate) {
                        if (!validate(convertedValue)) {
                          setError(true);
                          return false;
                        }
                      }
                      setError(false);

                      await onChange(value);
                      setSelectingKey(undefined);
                    }}
                  />
                  <Icon
                    link
                    color="red"
                    name="x"
                    onClick={() => {
                      setSelectingKey(undefined);
                    }}
                  />
                </>
              )
            }
          />
        );
      case 'select':
        return (
          <MiniSelect
            fluid
            search={(options, v) => {
              if (options.filter((e) => e.content).length !== 0) {
                return options.filter((e) =>
                  deburr(e.content).includes(deburr(v)),
                );
              }
              return options.filter((e) => deburr(e.text).includes(deburr(v)));
            }}
            deburr
            clearable
            className="mini-select"
            label={header}
            open
            defaultValue={content}
            options={dropdownOptions}
            onChange={async (_, { value: v }) => {
              await onChange(v);
              setSelectingKey(undefined);
            }}
            icon={
              <FloatRight>
                {loading ? (
                  <Icon loading name="spinner" />
                ) : (
                  <Icon
                    link
                    color="red"
                    name="x"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectingKey(undefined);
                    }}
                  />
                )}
              </FloatRight>
            }
          />
        );
      case 'multiple-select':
        return (
          <MiniSelect
            open
            fluid
            deburr
            multiple
            clearable
            label={header}
            className="mini-select"
            defaultValue={content}
            options={dropdownOptions}
            search={(options, v) => {
              if (options.filter((e) => e.content).length !== 0) {
                return options.filter((e) =>
                  deburr(e.content).includes(deburr(v)),
                );
              }
              return options.filter((e) => deburr(e.text).includes(deburr(v)));
            }}
            onChange={(_, { value: v }) => setValue(v)}
            icon={
              loading ? (
                <MarginFloatRight>
                  <Icon loading name="spinner" />
                </MarginFloatRight>
              ) : (
                <MarginFloatRight>
                  <MarginRightIcon
                    link
                    color="green"
                    name="checkmark"
                    onClick={async () => {
                      await onChange(value);
                      setSelectingKey(undefined);
                    }}
                  />
                  <Icon
                    link
                    color="red"
                    name="x"
                    onClick={() => {
                      setSelectingKey(undefined);
                    }}
                  />
                </MarginFloatRight>
              )
            }
          />
        );
      case 'date-time':
        return (
          <StyledInput
            size="mini"
            input={
              <KeyboardDateTimePicker
                isMinimize
                value={value}
                onChange={(v) => setValue(v)}
                triggerOnChange={async () => {
                  await onChange(value);
                  setSelectingKey(undefined);
                }}
                triggerOnClose={() => {
                  setSelectingKey(undefined);
                }}
              />
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      {selectingKey === name ? (
        renderInput()
      ) : (
        <>
          {randomable && (
            <StyledDropdown
              className={disabled ? 'readonly' : ''}
              options={
                !disabled
                  ? [
                      { value: 1, text: 'Sửa' },
                      { value: 2, text: 'Tự động điền' },
                    ]
                  : []
              }
              onChange={async (_, { value: v }) => {
                if (v === 1) {
                  setSelectingKey(name);
                } else {
                  setSelectingKey(name);
                  await onChange(uuidv4());
                  setSelectingKey(undefined);
                }
              }}
              trigger={
                <Label
                  basic
                  color={color}
                  className={disabled ? 'readonly' : ''}
                >
                  {header}
                  <Label.Detail
                    content={
                      loading && selectingKey === name ? (
                        <Icon loading name="spinner" />
                      ) : (
                        content
                      )
                    }
                  />
                  <WrapperIcon>
                    <FiEdit2 />
                  </WrapperIcon>
                </Label>
              }
            />
          )}
          {Boolean(maxLength && content?.length > maxLength) && (
            <Popup
              header={header}
              content={content}
              trigger={
                <Label
                  basic
                  color={color}
                  onClick={() => setSelectingKey(name)}
                >
                  {header}
                  <Label.Detail
                    content={`${content.substr(
                      0,
                      maxLength / 2,
                    )}...${content.substr(content.length - maxLength / 2)}`}
                  />
                  <WrapperIcon>
                    <FiEdit2 />
                  </WrapperIcon>
                </Label>
              }
            />
          )}
          {!(
            randomable || Boolean(maxLength && content?.length > maxLength)
          ) && (
            <Label
              basic
              className={disabled ? 'readonly' : ''}
              color={color}
              onClick={() => {
                if (!disabled) {
                  setSelectingKey(name);
                }
              }}
            >
              {header}
              <Label.Detail
                content={
                  type === 'multiple-select'
                    ? dropdownOptions
                        .filter((d) => content.includes(d))
                        .map((d) => d.text)
                        .join(', ')
                    : type === 'select'
                    ? showValue
                      ? content
                      : dropdownOptions.find((d) => d.value === content)?.text
                    : content
                }
              />
              <WrapperIcon>
                <FiEdit2 />
              </WrapperIcon>
            </Label>
          )}
        </>
      )}
    </Wrapper>
  );
};

EditableLabel.propTypes = {
  color: PropTypes.string,
  header: PropTypes.string,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.shape({})),
  ]),
  maxLength: PropTypes.number,

  name: PropTypes.string,
  type: PropTypes.oneOf(['input', 'select', 'multiple-select', 'date-time']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  showValue: PropTypes.bool,
  randomable: PropTypes.bool,
  dropdownOptions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),

  onChange: PropTypes.func,
  selectingKey: PropTypes.string,
  setSelectingKey: PropTypes.func,

  required: PropTypes.bool,
  validate: PropTypes.func,
};

EditableLabel.defaultProps = {
  color: null,
  header: '...',
  content: '...',
  description: '',
  maxLength: 0,

  name: '',
  type: 'input',
  showValue: false,
  randomable: false,
  disabled: false,
  loading: false,
  dropdownOptions: [],

  onChange: () => {},
  selectingKey: '',
  setSelectingKey: () => {},

  required: false,
  validate: () => true,
};

export default EditableLabel;
