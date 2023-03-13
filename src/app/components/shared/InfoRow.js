import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PopupText from './PopupText';

const Label = styled.p`
  font-size: ${({ big }) => (big ? '16px' : '13px')};
  margin-bottom: 6px;
  margin-right: 6px;
  float: left;
`;
const Content = styled.p`
  & span {
    font-size: 16px;
    font-weight: bold;
  }
  margin-top: ${({ big }) => (big ? '0' : '-3px')};
  margin-bottom: 0 !important;
`;

const InfoRow = (props) => {
  const { big, label, content } = props;
  return (
    <div style={{ overflow: 'hidden' }}>
      <Label big={big}>{`${label}:`}</Label>
      <Content big={big}>
        <PopupText content={content || '...'} />
      </Content>
    </div>
  );
};

InfoRow.propTypes = {
  big: PropTypes.bool,
  label: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

InfoRow.defaultProps = {
  big: false,
};

export default React.memo(InfoRow);
