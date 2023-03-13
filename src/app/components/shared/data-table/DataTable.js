/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import {
  Dimmer,
  Loader,
  Table,
  Grid,
  Header,
  Popup,
  Dropdown,
  Button,
  Label,
} from 'semantic-ui-react';
import { FiFileText } from 'react-icons/fi';
import {
  useTable,
  useRowSelect,
  usePagination,
  useExpanded,
} from 'react-table';

import { useDispatch } from 'react-redux';
import { triggerTreeFolderOpen } from 'app/actions/global';

import {
  HeaderCheckbox,
  CellCheckbox,
  CellExpand,
  Actions,
  StyledIconButtonWrapper,
  IconButton,
  EditableCell,
} from './Elements';
import Pagination from './Pagination';

const dateFilterOptions = [
  {
    text: 'trong ngày',
    content: 'Trong ngày',
    value: 1,
    data: {
      from: moment().format('YYYY-MM-DD'),
      to: moment().format('YYYY-MM-DD'),
      hideDateFilter: true,
    },
  },
  {
    text: 'hôm qua',
    content: 'Hôm qua',
    value: 2,
    data: {
      from: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      to: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      hideDateFilter: true,
    },
  },
  {
    text: 'trong tuần',
    content: 'Trong tuần',
    value: 3,
    data: {
      from: moment().startOf('isoWeek').format('YYYY-MM-DD'),
      to: moment().format('YYYY-MM-DD'),
      hideDateFilter: true,
    },
  },
  {
    text: 'tuần trước',
    content: 'Tuần trước',
    value: 4,
    data: {
      from: moment()
        .subtract(1, 'week')
        .startOf('isoWeek')
        .format('YYYY-MM-DD'),
      to: moment().subtract(1, 'week').endOf('isoWeek').format('YYYY-MM-DD'),
      hideDateFilter: true,
    },
  },
  {
    text: 'trong tháng',
    content: 'Trong tháng',
    value: 5,
    data: {
      from: moment().startOf('month').format('YYYY-MM-DD'),
      to: moment().format('YYYY-MM-DD'),
      hideDateFilter: true,
    },
  },
  {
    text: 'tháng trước',
    content: 'Tháng trước',
    value: 6,
    data: {
      from: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      to: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
      hideDateFilter: true,
    },
  },
  {
    text: 'tất cả',
    content: 'Tất cả',
    value: 7,
    data: { from: '', to: '', hideDateFilter: false },
  },
];

const Wrapper = styled.div`
  position: relative;
  margin-top: 16px;
`;
const StyledTable = styled(Table)`
  margin-top: 8px !important;
  .text-center {
    text-align: center !important;
  }
  .text-bold {
    font-weight: bold !important;
  }
`;
const TableWrapper = styled.div`
  overflow: visible;
  .pointer {
    cursor: pointer;
  }
`;
const ExpandCell = styled(Table.Cell)`
  background: rgba(34, 36, 38, 0.05);
  padding-left: 50px !important;
`;
const Ribbon = styled(Label)`
  left: calc(-1rem - 0.7em) !important;
`;
const HeaderContent = styled(Header.Content)`
  font-weight: bold !important;
`;

const DataTable = (props) => {
  const {
    // basic
    title,
    columns: propColumns,
    data,
    loading,
    celled,
    footer,

    rowError,
    rowSucceed,
    rowWarning,

    hideGoToButton,
    showTemplate,

    // filter by date
    filterByDate,
    onFilterByDateChange,

    // selectable
    selectable,
    defaultSelected,
    onSelectionChange,

    // sub-component
    subComponent,

    // actions
    actions,

    // editable
    editable,
    onUpdate,

    // pagination
    onPaginationChange,
    onRowClick,
    pageCount: controlledPageCount,
    totalCount,
    noPaging,
  } = props;

  const dispatch = useDispatch();

  const [columns, setColumns] = useState([]);
  useEffect(() => {
    const tmp = [...propColumns];
    // sub-component
    if (subComponent && !propColumns.find((c) => c.id === 'expander')) {
      tmp.unshift({
        id: 'expander',
        Header: () => null,
        Cell: CellExpand,
      });
    }

    // add selection column if selection is true
    if (selectable && !propColumns.find((c) => c.id === 'selection')) {
      tmp.unshift({
        id: 'selection',
        Header: HeaderCheckbox,
        Cell: CellCheckbox,
      });
    }

    // actions
    const rowActions = actions.filter((a) => !a.globalAction);
    if (
      (rowActions.length > 0 || editable)
      && !propColumns.find((c) => c.id === 'actions')
    ) {
      tmp.push({
        id: 'actions',
        Header: () => null,
        Cell: (table) => Actions(table, rowActions),
      });
    }

    setColumns(tmp);
  }, [propColumns, actions, editable, selectable, subComponent]);

  const mappedSelectedIds = {};
  data
    .filter((e) => defaultSelected.includes(e.id))
    .forEach((e, i) => {
      mappedSelectedIds[i] = true;
    });

  const {
    headerGroups,
    footerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Cell: (cellProps) => EditableCell(cellProps, editable) },
      updateMyData: onUpdate,
      manualPagination: Boolean(controlledPageCount),
      pageCount: controlledPageCount,
      autoResetPage: false,
      // set cứng .id, no paging
      initialState: {
        selectedRowIds: mappedSelectedIds,
      },
    },
    useExpanded,
    usePagination,
    useRowSelect,
  );

  React.useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange({ pageIndex, pageSize });
    }
  }, [onPaginationChange, pageIndex, pageSize]);

  const selected = page
    .filter((element, index) => Object.keys(selectedRowIds).includes(`${index}`),
    )
    .map((row) => row.original);

  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedFlatRows.map((r) => r.original));
    }
  }, [onSelectionChange, selectedFlatRows]);

  useEffect(() => {
    if (onFilterByDateChange) {
      onFilterByDateChange(dateFilterOptions[0].data);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Wrapper>
      <Dimmer inverted active={loading}>
        <Loader />
      </Dimmer>
      {(Boolean(title)
        || actions.filter((a) => a.globalAction && !a.hidden).length !== 0) && (
          <Grid>
            <Grid.Column floated="left" width={12}>
              <Header as="h3">
                <HeaderContent>
                  {title}
                  {filterByDate && (
                    <span>
                      {' '}
                      <Dropdown
                        as="a"
                        inline
                        style={{ color: '#4183C4' }}
                        header="Hiển thị ngày"
                        options={dateFilterOptions}
                        defaultValue={dateFilterOptions[0].value}
                        onChange={(_, { value: v }) => {
                          onFilterByDateChange(
                            dateFilterOptions.find((e) => e.value === v).data,
                          );
                        }}
                      />
                    </span>
                  )}
                </HeaderContent>
              </Header>
            </Grid.Column>
            <Grid.Column floated="right" width={4} textAlign="right">
              {(showTemplate
                ? [
                  {
                    icon: <FiFileText />,
                    title: 'Tải File Mẫu',
                    color: 'teal',
                    onClick: () => dispatch(triggerTreeFolderOpen()),
                    globalAction: true,
                  },
                  ...actions,
                ]
                : actions
              )
                .filter((a) => a.globalAction && !a.dropdown && !a.hidden)
                .map((a) => {
                  if (a.content) {
                    return (
                      <Button
                        key={a.content}
                        color={a.color}
                        content={a.content}
                        disabled={a.disabled}
                        onClick={() => a.onClick(selected)}
                      />
                    );
                  }
                  return (
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
                            disabled={a.disabled}
                            onClick={() => a.onClick(selected)}
                          />
                        </StyledIconButtonWrapper>
                      }
                    />
                  );
                })}
              {actions
                .filter((a) => a.globalAction && a.dropdown && !a.hidden)
                .map((a) => (
                  <Popup
                    inverted
                    size="tiny"
                    key={a.title}
                    content={a.title}
                    trigger={
                      <Button.Group
                        basic
                        color={a.color}
                        style={{ border: 'none' }}
                      >
                        <Dropdown
                          button
                          icon={a.icon}
                          className="icon"
                          disabled={a.disabled}
                          style={{
                            padding: '8px 7px 6px 7px',
                            marginLeft: '4px',
                          }}
                        >
                          <Dropdown.Menu>
                            {a.dropdownActions
                              .filter((ac) => !ac.dropdownHidden)
                              .map((ac) => (
                                <Dropdown.Item
                                  key={ac.titleDropdown}
                                  disabled={ac.dropdownDisabled}
                                  onClick={ac.onDropdownClick}
                                >
                                  {ac.titleDropdown}
                                </Dropdown.Item>
                              ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Button.Group>
                    }
                  />
                ))}
            </Grid.Column>
          </Grid>
        )}

      <TableWrapper>
        <StyledTable
          celled={celled}
          selectable
          unstackable
          compact="very"
          size="small"
        >
          <Table.Header>
            {headerGroups.map((headerGroup) => {
              const { key: headerRowKey } = headerGroup.getHeaderGroupProps();
              return (
                <Table.Row key={headerRowKey}>
                  {headerGroup.headers.map((column) => {
                    const { key: headerCellKey } = column.getHeaderProps();
                    return (
                      <Table.HeaderCell
                        {...column.getHeaderProps()}
                        key={headerCellKey}
                        className={column.columns ? 'text-center' : ''}
                        collapsing={['selection', 'expander'].includes(
                          column.id,
                        )}
                        content={column.render('Header')}
                      />
                    );
                  })}
                </Table.Row>
              );
            })}
          </Table.Header>
          <Table.Body>
            {page.map((row) => {
              prepareRow(row);
              const { key: rowKey } = row.getRowProps();
              return (
                <React.Fragment key={rowKey}>
                  <Table.Row
                    negative={rowError && rowError(row.original)}
                    positive={rowSucceed && rowSucceed(row.original)}
                    warning={rowWarning && rowWarning(row.original)}
                    className={
                      onRowClick.toString() === '() => {}'
                        || onRowClick.toString() === 'function(){}'
                        ? ''
                        : 'pointer'
                    }
                    onClick={() => {
                      if (onRowClick && row.original) {
                        onRowClick(row.original);
                      }
                    }}
                  >
                    {row.cells.map((cell) => {
                      const { key: cellKey } = cell.getCellProps();
                      return (
                        <Table.Cell
                          style={{ position: 'initial' }}
                          key={cellKey}
                          content={cell.render('Cell')}
                          textAlign={
                            cellKey.includes('actions') ? 'right' : 'left'
                          }
                        />
                      );
                    })}
                  </Table.Row>
                  {row.isExpanded && subComponent && (
                    <Table.Row>
                      <ExpandCell
                        colSpan={columns.length}
                        content={subComponent(row.original)}
                      />
                    </Table.Row>
                  )}
                </React.Fragment>
              );
            })}
          </Table.Body>
          {!noPaging && (
            <Pagination
              hideGoToButton={hideGoToButton}
              pageIndex={pageIndex}
              pageSize={pageSize}
              pageCount={pageCount}
              totalCount={totalCount}
              gotoPage={async (n) => {
                await gotoPage(n); // dirty fix?
                gotoPage(n);
              }}
              setPageSize={setPageSize}
            />
          )}
          {footer && (
            <Table.Footer>
              {footerGroups.map((footerGroup) => {
                const { key: footerGroupKey } = footerGroup.getFooterGroupProps();
                if (
                  footerGroup.headers.some((header) => header.parent)
                  || footerGroup.headers.some(
                    (header) => header.Footer && !header.Footer.toString().includes('()'),
                  )
                ) {
                  return (
                    <Table.Row key={footerGroupKey}>
                      {footerGroup.headers.map((column, i) => {
                        const { key: headerCellKey } = column.getFooterProps();
                        if (i === 0) {
                          return (
                            <Table.HeaderCell
                              key={headerCellKey}
                              content={
                                <Ribbon ribbon color="green" content="Tổng" />
                              }
                            />
                          );
                        }
                        return (
                          <Table.HeaderCell
                            {...column.getFooterProps()}
                            key={headerCellKey}
                            className={
                              column.columns
                                ? 'text-center text-bold'
                                : 'text-bold'
                            }
                            collapsing={['selection', 'expander'].includes(
                              column.id,
                            )}
                            content={
                              column.Footer ? column.render('Footer') : ''
                            }
                          />
                        );
                      })}
                    </Table.Row>
                  );
                }
                return <Table.Row key={footerGroupKey} />;
              })}
            </Table.Footer>
          )}
        </StyledTable>
      </TableWrapper>
    </Wrapper>
  );
};

DataTable.propTypes = {
  /** Title of table */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

  /** Array of table's columns */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ).isRequired,

  /** Array of table's data */
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,

  /** Decide style */
  celled: PropTypes.bool,
  footer: PropTypes.bool,

  rowError: PropTypes.func,
  rowSucceed: PropTypes.func,
  rowWarning: PropTypes.func,

  // remember to add 'Footer' for ALL objects on columns prop
  showTemplate: PropTypes.bool,

  /** Decide if table is selectable */
  selectable: PropTypes.bool,
  onSelectionChange: PropTypes.func,
  defaultSelected: PropTypes.arrayOf(PropTypes.string),

  /** Indicate table's loading state */
  loading: PropTypes.bool,

  /** Row's expandable component */
  subComponent: PropTypes.func,

  /** Table actions */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
      icon: PropTypes.node,
      content: PropTypes.string,
      title: PropTypes.string,
      onClick: PropTypes.func,
      color: PropTypes.oneOf([
        'facebook',
        'google plus',
        'vk',
        'twitter',
        'linkedin',
        'instagram',
        'youtube',
        'red',
        'orange',
        'yellow',
        'olive',
        'green',
        'teal',
        'blue',
        'violet',
        'purple',
        'pink',
        'brown',
        'grey',
        'black',
      ]),
      globalAction: PropTypes.bool,
      dropdown: PropTypes.bool,
      dropdownActions: PropTypes.arrayOf(
        PropTypes.shape({
          onDropdownClick: PropTypes.func,
          titleDropdown: PropTypes.string,
          dropdownHidden: PropTypes.bool,
          dropdownDisabled: PropTypes.bool,
        }),
      ),
      disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
      hidden: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    }),
  ),

  /** Decide if table is editable */
  editable: PropTypes.bool,

  hideGoToButton: PropTypes.bool,

  filterByDate: PropTypes.bool,
  onFilterByDateChange: PropTypes.func,

  /** Callback when an editable cell is blurred */
  onUpdate: PropTypes.func,

  /** on controlled pagination change (pageIndex, pageSize) */
  onPaginationChange: PropTypes.func,

  /** on row click */
  onRowClick: PropTypes.func,

  /** number of pages (controlled pagination) */
  pageCount: PropTypes.number,

  /** number of row */
  totalCount: PropTypes.number,

  /** No Paging flag */
  noPaging: PropTypes.bool,
};

DataTable.defaultProps = {
  title: '',
  celled: false,
  footer: false,
  rowError: () => { },
  rowSucceed: () => { },
  rowWarning: () => { },
  selectable: false,
  hideGoToButton: false,
  loading: false,
  showTemplate: false,
  subComponent: null,
  actions: [],
  editable: false,
  onUpdate: () => { },
  onRowClick: () => { },
  onPaginationChange: () => { },
  onSelectionChange: () => { },
  filterByDate: false,
  onFilterByDateChange: () => { },
  pageCount: 0,
  totalCount: undefined,
  noPaging: false,
  defaultSelected: [],
};

export default DataTable;
