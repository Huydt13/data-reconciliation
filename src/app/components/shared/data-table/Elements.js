import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Button,
  Input,
  Select,
  Popup,
  Dropdown,
} from 'semantic-ui-react';
import {
  FiChevronDown,
  FiChevronRight,
  FiMoreHorizontal,
} from 'react-icons/fi';
import styled from 'styled-components';

const IconButton = styled(Button)`
  padding: 8px !important;
  line-height: 0 !important;
  margin-right: 0 !important;
`;

const StyledSpan = styled.span`
  padding-left: 10px;
`;

const StyledIconButtonWrapper = styled.span`
  margin-left: 4px !important;
`;

const StyledCellValue = styled.span`
  display: block;
  min-height: 20px;
`;

const ClickableSpan = styled.span`
  cursor: pointer;
`;

const HeaderCheckbox = ({ getToggleAllRowsSelectedProps }) => {
  const { checked, onChange } = getToggleAllRowsSelectedProps();

  return <Checkbox checked={checked} onChange={onChange} />;
};

HeaderCheckbox.propTypes = {
  getToggleAllRowsSelectedProps: PropTypes.func.isRequired,
};

const CellCheckbox = ({ row }) => {
  const { checked, onChange } = row.getToggleRowSelectedProps();

  return <Checkbox checked={checked} onChange={onChange} />;
};

CellCheckbox.propTypes = {
  row: PropTypes.shape({
    getToggleRowSelectedProps: PropTypes.func,
  }).isRequired,
};

const CellExpand = ({ row }) => {
  const { onClick } = row.getToggleRowExpandedProps();

  return (
    <IconButton
      basic
      circular
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      icon={row.isExpanded ? <FiChevronDown /> : <FiChevronRight />}
    />
  );
};

CellExpand.propTypes = {
  row: PropTypes.shape({
    isExpanded: PropTypes.bool,
    getToggleRowExpandedProps: PropTypes.func,
  }).isRequired,
};

const Action = ({
  icon,
  color = 'black',
  title,
  onClick,
  disabled: disabledProp = false,
  hidden: hiddenProp = false,
  data,
}) => {
  const disabled = useMemo(() => {
    if (typeof disabledProp === 'function') {
      return disabledProp(data);
    }
    return disabledProp;
  }, [data, disabledProp]);

  const hidden = useMemo(() => {
    if (typeof hiddenProp === 'function') {
      return hiddenProp(data);
    }
    return hiddenProp;
  }, [data, hiddenProp]);

  return (
    <>
      {!hidden && (
        <Popup
          pinned
          inverted
          size="tiny"
          content={title}
          position="top center"
          trigger={
            <StyledIconButtonWrapper>
              <IconButton
                basic
                icon={icon}
                color={color}
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(data);
                }}
              />
            </StyledIconButtonWrapper>
          }
        />
      )}
    </>
  );
};

Action.propTypes = {
  icon: PropTypes.element.isRequired,
  color: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  hidden: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

Action.defaultProps = {
  color: 'black',
  hidden: false,
  disabled: false,
};

const Actions = (table, actions) => {
  const filterHiddenActions = actions
    .filter(
      (a) => !(
          (typeof a.hidden === 'boolean' && a.hidden)
          || (typeof a.hidden === 'function' && a.hidden(table.row.original))
        ),
    )
    .map((a) => {
      let disabled = false;
      if (typeof a.disabled === 'boolean') {
        disabled = a.disabled;
      }
      if (typeof a.disabled === 'function') {
        const bool = a.disabled(table.row.original);
        if (typeof bool === 'boolean') {
          disabled = bool;
        }
      }
      return { ...a, disabled };
    });
  if (filterHiddenActions.length > 3) {
    return (
      <Dropdown
        basic
        primary
        as={Button}
        style={{ padding: '8px' }}
        icon={<FiMoreHorizontal />}
      >
        <Dropdown.Menu direction="left">
          {filterHiddenActions.map((a) => (
            <Dropdown.Item
              key={a.title}
              icon={a.icon}
              text={<StyledSpan>{a.title}</StyledSpan>}
              disabled={a.disabled}
              onClick={() => a.onClick(table.row.original)}
            />
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  return filterHiddenActions.map((a) => (
    <Popup
      inverted
      size="tiny"
      key={a.title}
      content={a.title}
      trigger={
        <StyledIconButtonWrapper key={a.title}>
          <IconButton
            basic
            color={a.color}
            icon={a.icon}
            title={a.title}
            onClick={(e) => {
              e.stopPropagation();
              a.onClick(table.row.original);
            }}
            disabled={a.disabled}
          />
        </StyledIconButtonWrapper>
      }
    />
  ));
};

const subStringUtil = (string = '', displayLength) => {
  if (!string) {
    return null;
  }
  if (string.length <= displayLength) {
    return string;
  }
  return `${string.substr(0, displayLength / 2)}...${string.substr(
    string.length - displayLength / 2,
  )}`;
};

const EditableCell = (props, editable) => {
  const { cell, row, column, updateMyData } = props;

  const { options, copiable, formatter, cutlength } = column;
  const [editingValue, setEditingValue] = React.useState(cell.value);
  const [isEditing, setIsEditing] = React.useState(false);

  const onChange = (e) => setEditingValue(e.target.value);

  const onUpdate = React.useCallback(() => {
    setIsEditing(false);
    if (cell.value !== editingValue) {
      row.original[column.id] = editingValue;
      updateMyData(row.original);
    }
  }, [cell.value, editingValue, row.original, column.id, updateMyData]);

  React.useEffect(() => {
    if (options || typeof cell.value === 'boolean') {
      onUpdate();
    }
  }, [editingValue, options, cell.value, onUpdate]);
  React.useEffect(() => setEditingValue(cell.value), [cell.value]);

  return (
    <>
      {!options && (
        <>
          {typeof cell.value !== 'boolean' && (
            <>
              {!isEditing && !cutlength && (
                <StyledCellValue
                  role="button"
                  tabIndex={0}
                  // if editable then editing is true
                  onClick={() => {
                    if (copiable) {
                      navigator.clipboard.writeText(cell.value);
                    }
                    setIsEditing(editable);
                  }}
                  onKeyUp={() => {}}
                >
                  {formatter ? (
                    copiable ? (
                      <Popup
                        pinned
                        size="mini"
                        content="Copied!"
                        on="click"
                        mouseEnterDelay={500}
                        mouseLeaveDelay={500}
                        trigger={
                          <ClickableSpan>
                            {formatter(row.original)}
                          </ClickableSpan>
                        }
                      />
                    ) : (
                      formatter(row.original)
                    )
                  ) : (
                    cell.value
                  )}
                </StyledCellValue>
              )}
              {!isEditing && cutlength && (
                <StyledCellValue
                  role="button"
                  tabIndex={0}
                  // if editable then editing is true
                  onClick={() => {
                    if (copiable) {
                      navigator.clipboard.writeText(cell.value);
                    }
                    setIsEditing(editable);
                  }}
                  onKeyUp={() => {}}
                >
                  {formatter ? (
                    <Popup
                      pinned
                      content={formatter(row.original)}
                      trigger={
                        <span>
                          {subStringUtil(formatter(row.original), cutlength)}
                        </span>
                      }
                    />
                  ) : (
                    cell.value
                  )}
                </StyledCellValue>
              )}
              {editable && isEditing && (
                <Input
                  value={editingValue || ''}
                  onChange={onChange}
                  onBlur={onUpdate}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) onUpdate(); // Enter
                    if (e.keyCode === 27) {
                      // ESC
                      setIsEditing(false);
                    }
                  }}
                />
              )}
            </>
          )}
          {typeof cell.value === 'boolean' && (
            <>
              <Checkbox
                checked={editingValue}
                readOnly={!editable}
                onChange={(e, data) => {
                  setEditingValue(data.checked);
                }}
              />
            </>
          )}
        </>
      )}
      {options && (
        <>
          {!isEditing && (
            <span
              role="button"
              tabIndex={0}
              onClick={() => setIsEditing(editable)} // if editable then editing is true
              onKeyUp={() => {}}
            >
              {options.find((o) => o.value === cell.value)
                ? options.find((o) => o.value === cell.value).text
                : ''}
            </span>
          )}
          {editable && isEditing && (
            <Select
              value={editingValue || ''}
              options={options}
              onChange={(e, o) => setEditingValue(o.value)}
              onBlur={() => setIsEditing(false)}
            />
          )}
        </>
      )}
    </>
  );
};

EditableCell.propTypes = {
  cell: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }).isRequired,
  row: PropTypes.shape({
    index: PropTypes.number,
    original: PropTypes.shape({}),
  }).isRequired,
  column: PropTypes.shape({
    id: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        text: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ),
    formatter: PropTypes.func,
    cutlength: PropTypes.number,
    copiable: PropTypes.bool,
  }).isRequired,
  updateMyData: PropTypes.func.isRequired,
};

const CustomCell = (props) => {
  const { cell, row, column } = props;
  const { formatter, copiable, maxlength } = column;

  const cellValue = formatter ? formatter(row.original) : cell.value;
  return (
    <>
      {maxlength && (
        <>
          <StyledCellValue
            onClick={() => {
              if (copiable) {
                navigator.clipboard.writeText(cell.value);
              }
            }}
          >
            <Popup
              pinned
              content={cellValue}
              trigger={
                <span>
                  {subStringUtil(`${cellValue}`, maxlength)}
                </span>
              }
            />
          </StyledCellValue>
        </>
      )}
      {!maxlength && cellValue}
    </>
  );
};

CustomCell.propTypes = {
  cell: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }).isRequired,
  row: PropTypes.shape({
    index: PropTypes.number,
    original: PropTypes.shape({}),
  }).isRequired,
  column: PropTypes.shape({
    id: PropTypes.string,
    formatter: PropTypes.func,
    maxlength: PropTypes.number,
    copiable: PropTypes.bool,
  }).isRequired,
};

export {
  StyledIconButtonWrapper,
  HeaderCheckbox,
  CellCheckbox,
  CellExpand,
  IconButton,
  Action,
  Actions,
  EditableCell,
  CustomCell,
};
