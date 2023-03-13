/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
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
import styled from 'styled-components';
import {
  useTable,
  useRowSelect,
  usePagination,
  useExpanded,
} from 'react-table';

import {
  HeaderCheckbox,
  CellCheckbox,
  CellExpand,
  Action,
  StyledIconButtonWrapper,
  IconButton,
} from 'app/components/shared/data-table/Elements';
import Pagination from 'app/components/shared/data-table/Pagination';

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
const ActionsWrapper = styled.div`
  margin-left: auto;
`;
const ExpandCell = styled(Table.Cell)`
  background: rgba(34, 36, 38, 0.05);
  padding-left: 50px !important;
`;
const Ribbon = styled(Label)`
  left: calc(-1rem - 0.7em) !important;
`;

const TreatmentSelectTable = (props) => {
  const {
    // basic
    title,
    columns,
    data,
    loading,
    celled,
    footer,

    // selectable
    selectable,

    // sub-component
    subComponent,

    // actions
    actions,

    // pagination
    onPaginationChange,
    onRowClick,
    pageCount: controlledPageCount,
    noPaging,
  } = props;

  const {
    headerGroups,
    footerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    setPageSize,
    getTableProps,
    getTableBodyProps,
    visibleColumns,
    selectedFlatRows,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,

      manualPagination: Boolean(controlledPageCount),
      pageCount: controlledPageCount,
    },
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks) => {
      if (subComponent) {
        hooks.visibleColumns.push((vColumns) => [
          { id: 'expander', Header: () => null, Cell: CellExpand },
          ...vColumns,
        ]);
      }
      if (selectable) {
        hooks.visibleColumns.push((vColumns) => [
          { id: 'selection', Header: HeaderCheckbox, Cell: CellCheckbox },
          ...vColumns,
        ]);
      }
      const rowActions = actions.filter((a) => !a.globalAction);
      if (rowActions.length > 0 && !columns.find((c) => c.id === 'actions')) {
        hooks.visibleColumns.push((vColumns) => [
          ...vColumns,
          {
            id: 'actions',
            Header: () => null,
            Cell: (table) =>
              rowActions.map((a) => (
                <Action
                  key={`${a.title}|${a.color ?? 'rainbow'}`}
                  data={table.row.original}
                  icon={a.icon}
                  color={a.color}
                  title={a.title}
                  onClick={a.onClick}
                  hidden={a.hidden}
                  disabled={a.disabled}
                />
              )),
          },
        ]);
      }
    },
  );

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange({ pageIndex, pageSize });
    }
  }, [onPaginationChange, pageIndex, pageSize]);

  const tableActionsNode = useMemo(
    () => (
      <ActionsWrapper>
        {actions
          .filter((a) => a.globalAction && !a.dropdown && !a.hidden)
          .map((a) => {
            if (a.content) {
              return (
                <Button
                  key={a.content}
                  color={a.color}
                  content={a.content}
                  disabled={a.disabled}
                  onClick={a.onClick}
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
                      // disabled={a.disabled}
                      // onClick={a.onClick}
                      disabled={
                        a?.disabled && typeof a.disabled !== 'boolean'
                          ? a.disabled(selectedFlatRows.map((r) => r.original))
                          : a?.disabled ?? false
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        a.onClick(selectedFlatRows.map((r) => r.original));
                      }}
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
                <Button.Group basic color={a.color} style={{ border: 'none' }}>
                  <Dropdown
                    button
                    icon={a.icon}
                    className="icon"
                    disabled={a.disabled}
                    style={{ padding: '8px 7px 6px 7px', marginLeft: '4px' }}
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
      </ActionsWrapper>
    ),
    [actions, selectedFlatRows],
  );

  return (
    <Wrapper>
      <Dimmer inverted active={loading}>
        <Loader />
      </Dimmer>
      <Grid>
        <Grid.Column floated="left" width={12} title={title}>
          <Header as="h3">{title}</Header>
        </Grid.Column>
        <Grid.Column floated="right" width={4} textAlign="right">
          {tableActionsNode}
        </Grid.Column>
      </Grid>

      <TableWrapper>
        <StyledTable
          celled={celled}
          selectable
          unstackable
          compact="very"
          size="small"
          role={getTableProps().role}
        >
          <Table.Header>
            {headerGroups.map((headerGroup) => {
              const { key: headerRowKey, role: headerGroupRole } =
                headerGroup.getHeaderGroupProps();
              return (
                <Table.Row key={headerRowKey} role={headerGroupRole}>
                  {headerGroup.headers.map((column) => {
                    const { key: headerCellKey, role: headerRoleKey } =
                      column.getHeaderProps();
                    return (
                      <Table.HeaderCell
                        key={headerCellKey}
                        role={headerRoleKey}
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
          <Table.Body role={getTableBodyProps().role}>
            {page.map((row) => {
              prepareRow(row);
              const { key: rowKey, role: roleKey } = row.getRowProps();
              return (
                <React.Fragment key={rowKey}>
                  <Table.Row
                    role={roleKey}
                    className={
                      onRowClick && onRowClick.toString() !== '() => {}'
                        ? 'pointer'
                        : ''
                    }
                    onClick={() => {
                      if (onRowClick && row.original) {
                        onRowClick(row.original);
                      }
                    }}
                  >
                    {row.cells.map((c) => {
                      const { key: cKey, role: cRole } = c.getCellProps();

                      const content = c.column.formatter
                        ? c.column.formatter(row.original)
                        : c.render('Cell');
                      const textAlign = `${cKey}`.includes('action')
                        ? 'right'
                        : 'left';

                      // {formatter ? formatter(row.original) : cell.value}

                      return (
                        <Table.Cell
                          key={cKey}
                          role={cRole}
                          content={content}
                          textAlign={textAlign}
                        />
                      );
                    })}
                  </Table.Row>
                  {row.isExpanded && subComponent && (
                    <Table.Row>
                      <ExpandCell
                        colSpan={visibleColumns.length}
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
              pageIndex={pageIndex}
              pageSize={pageSize}
              pageCount={pageCount}
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
                const { key: footerGroupKey } =
                  footerGroup.getFooterGroupProps();
                if (
                  footerGroup.headers.some((header) => header.parent) ||
                  footerGroup.headers.some(
                    (header) =>
                      header.Footer && !header.Footer.toString().includes('()'),
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

TreatmentSelectTable.propTypes = {
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
  // remember to add 'Footer' for ALL objects on columns prop

  /** Decide if table is selectable */
  selectable: PropTypes.bool,
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

  /** Callback when an editable cell is blurred */
  onUpdate: PropTypes.func,

  /** on controlled pagination change (pageIndex, pageSize) */
  onPaginationChange: PropTypes.func,

  /** on row click */
  onRowClick: PropTypes.func,

  /** number of pages (controlled pagination) */
  pageCount: PropTypes.number,

  /** No Paging flag */
  noPaging: PropTypes.bool,
};

TreatmentSelectTable.defaultProps = {
  title: '',
  celled: false,
  footer: false,
  selectable: false,
  loading: false,
  subComponent: null,
  actions: [],
  editable: false,
  onUpdate: () => {},
  onRowClick: () => {},
  onPaginationChange: () => {},
  pageCount: 0,
  noPaging: false,
  defaultSelected: [],
};

export default TreatmentSelectTable;
