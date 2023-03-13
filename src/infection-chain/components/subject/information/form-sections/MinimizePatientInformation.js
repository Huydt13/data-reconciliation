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

const MinimizePatientinitialData = (props) => {
  const {
    initialData,
  } = props;

  const {
    code,
    information,
  } = initialData;

  const {
    privateAlias,
    alias,
  } = information;

  const labels = [
    {
      rowIndex: 2,
      col: [
        { key: 'code', label: 'Bí danh CDC:', value: code },
        { key: 'privateAlias', label: 'Bí danh HCM:', value: privateAlias },
        { key: 'alias', label: 'Bí danh BYT:', value: alias },
      ],
    },
  ];

  return (
    <StyledMinimizeWrapper>
      <span>Thông tin:</span>
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

MinimizePatientinitialData.propTypes = {
  initialData: PropTypes.shape({
    code: PropTypes.string,
    privateAlias: PropTypes.string,
    alias: PropTypes.string,
    diseaseLocation: PropTypes.shape({}),
    information: PropTypes.shape({
      privateAlias: PropTypes.string,
      alias: PropTypes.string,
    }),
  }),
};

MinimizePatientinitialData.defaultProps = {
  initialData: {},
};

export default MinimizePatientinitialData;
