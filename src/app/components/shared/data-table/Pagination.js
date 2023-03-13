/* eslint-disable react/button-has-type */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Pagination as SuiPagination,
  Dropdown,
  Input,
} from 'semantic-ui-react';
import styled from 'styled-components';
import {
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
  FiMoreHorizontal,
} from 'react-icons/fi';

const StyledDropdown = styled(Dropdown)`
  position: absolute !important;
  right: 14px;
  box-shadow: 0px 1px 2px 0 rgba(34, 36, 38, 0.15) !important;
`;
const StyledTotal = styled.span`
  font-weight: 700;
  position: absolute !important;
  right: 150px;
  bottom: 23px;
`;
const StyledInput = styled(Input)`
  width: 90px !important;
  input {
    padding-top: 8 !important;
    padding-bottom: 12px !important;
    margin-left: 12px !important;
  }
  button {
    background-color: #344955 !important;
    color: white !important;
  }
`;

const Pagination = (props) => {
  const {
    pageIndex,
    pageSize,
    pageCount,
    totalCount,
    gotoPage,
    setPageSize,
    hideGoToButton,
  } = props;
  const pageIndexInputRef = useRef();
  const [pi, setPi] = useState('');

  return (
    <Table.Footer>
      <Table.Row>
        <Table.HeaderCell colSpan={100}>
          <SuiPagination
            size="small"
            activePage={pageIndex + 1}
            ellipsisItem={{ content: <FiMoreHorizontal />, icon: true }}
            firstItem={{ content: <FiChevronsLeft />, icon: true }}
            lastItem={{ content: <FiChevronsRight />, icon: true }}
            prevItem={{ content: <FiChevronLeft />, icon: true }}
            nextItem={{ content: <FiChevronRight />, icon: true }}
            totalPages={pageCount}
            onPageChange={(e, data) => {
              gotoPage(data.activePage - 1);
            }}
          />
          {!hideGoToButton && (
            <StyledInput
              ref={pageIndexInputRef}
              type="number"
              onChange={(_, { value: v }) => setPi(v)}
              action={{
                icon: 'long arrow alternate right',
                onClick: () => {
                  if (!pi || pi > pageCount) {
                    pageIndexInputRef.current.focus();
                  } else {
                    gotoPage(pi - 1);
                  }
                },
              }}
              placeholder="Trang ..."
            />
          )}
          {typeof totalCount === 'number' && (
            <StyledTotal>
              Tổng:
              {' '}
              {totalCount}
            </StyledTotal>
          )}
          <StyledDropdown
            selection
            value={pageSize}
            options={[
              { key: 10, value: 10, text: 'Hiển thị: 10' },
              { key: 20, value: 20, text: 'Hiển thị: 20' },
              { key: 30, value: 30, text: 'Hiển thị: 30' },
              { key: 40, value: 40, text: 'Hiển thị: 40' },
              { key: 50, value: 50, text: 'Hiển thị: 50' },
              { key: 100, value: 100, text: 'Hiển thị: 100' },
              { key: 200, value: 200, text: 'Hiển thị: 200' },
              { key: 500, value: 500, text: 'Hiển thị: 500' },
              { key: 2000, value: 2000, text: 'Hiển thị: 2000' },
            ]}
            onChange={(e, data) => setPageSize(data.value)}
          />
        </Table.HeaderCell>
      </Table.Row>
    </Table.Footer>
  );
};

Pagination.propTypes = {
  pageIndex: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageCount: PropTypes.number,
  totalCount: PropTypes.number,
  gotoPage: PropTypes.func.isRequired,
  setPageSize: PropTypes.func.isRequired,
  hideGoToButton: PropTypes.bool,
};

Pagination.defaultProps = {
  pageCount: 1,
  totalCount: undefined,
  hideGoToButton: false,
};

export default Pagination;
