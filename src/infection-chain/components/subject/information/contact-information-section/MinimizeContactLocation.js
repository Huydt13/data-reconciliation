import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Label } from 'semantic-ui-react';

const StyledMinimizeWrapper = styled.div`
  & .ui.label {
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

const MinimizeContactLocation = (props) => {
  const {
    contactLocation,
  } = props;

  const labels = [
    {
      rowIndex: 1,
      col: [
        { key: 'contactLocation', label: 'Địa điểm tiếp xúc:', value: contactLocation.text },
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

MinimizeContactLocation.propTypes = {
  contactLocation: PropTypes.shape({
    text: PropTypes.string,
  }),
};

MinimizeContactLocation.defaultProps = {
  contactLocation: {},
};
export default MinimizeContactLocation;
