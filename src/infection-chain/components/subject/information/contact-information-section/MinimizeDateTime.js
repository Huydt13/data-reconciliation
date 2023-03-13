import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Label } from 'semantic-ui-react';

const StyledMinimizeWrapper = styled.div`
  & .ui.label {
    margin-right: 0 !important;
    margin-bottom: 3px;
    font-weight: normal !important;
    font-size: 0.9em !important;
  }
  & .detail {
    margin-left: 3px !important;
  }
`;

const MinimizeDateTime = (props) => {
  const { from, to } = props;

  const labels = [
    {
      rowIndex: 1,
      col: [
        { key: 'from', label: 'Từ thời gian:', value: from || '' },
        { key: 'to', label: 'Đến thời gian:', value: to || '' },
      ],
    },
  ];

  return (
    <StyledMinimizeWrapper>
      {labels.map((r) => (
        <div key={r.rowIndex}>
          {r.col.map((f) => (
            <Label
              key={f.key}
              color={f.color}
              basic
              content={f.label}
              detail={f.value}
            />
          ))}
        </div>
      ))}
    </StyledMinimizeWrapper>
  );
};

MinimizeDateTime.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
};

MinimizeDateTime.defaultProps = {
  from: '',
  to: '',
};

export default MinimizeDateTime;
