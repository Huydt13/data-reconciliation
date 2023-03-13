import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  FiMoreHorizontal,
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import {
  Segment,
  Pagination as SemanticPagination,
} from 'semantic-ui-react';

const Wrapper = styled(Segment)`
  display: flex;
  padding: 0.5rem !important;
  box-shadow: none !important;
  background: #f9fafb !important;
  text-align: inherit;
  vertical-align: middle;
  color: rgba(0, 0, 0, 0.87);
  margin: 0 !important;
  & .pagination {
    box-shadow: none;
  }
`;
const StyledCurrentCount = styled.div`
  line-height: 36px;
  font-size: 16px;
  font-weight: bold;
  margin-left: auto;
  padding: 0.25rem;
`;

const Pagination = (props) => {
  const {
    pageIndex,
    pageCount,
    totalCount,
    gotoPage,
  } = props;

  return (
    <Wrapper>
      <SemanticPagination
        size="mini"
        activePage={pageIndex + 1}
        totalPages={pageCount}
        ellipsisItem={{ content: <FiMoreHorizontal />, icon: true }}
        firstItem={{ content: <FiChevronsLeft />, icon: true }}
        lastItem={{ content: <FiChevronsRight />, icon: true }}
        prevItem={{ content: <FiChevronLeft />, icon: true }}
        nextItem={{ content: <FiChevronRight />, icon: true }}
        onPageChange={(__, data) => {
          gotoPage((data.activePage) - 1);
        }}
      />
      {totalCount !== 0 && (
        <StyledCurrentCount>{`Tổng: ${totalCount}`}</StyledCurrentCount>
      )}
    </Wrapper>
  );
};

Pagination.defaultProps = {
  totalCount: 0,
};

Pagination.propTypes = {
  pageIndex: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number,
  gotoPage: PropTypes.func.isRequired,
};

export default Pagination;
