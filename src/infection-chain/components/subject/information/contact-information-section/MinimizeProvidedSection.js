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

const MinimizeProvidedSection = (props) => {
  const {
    subject,
    // situation,
  } = props;

  const labels = [
    {
      rowIndex: 1,
      col: [
        { key: 'fromSubject', label: 'Người chỉ điểm:', value: subject },
        { key: 'providedSubject', label: 'Người khai báo:', value: subject },
      ],
    },
    // {
    //   rowIndex: 3,
    //   col: [
    //     { key: 'situation', label: 'Hoàn cảnh tiếp xúc:', value: situation },
    //   ],
    // },
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

MinimizeProvidedSection.propTypes = {
  subject: PropTypes.string,
  criteriaData: PropTypes.shape({
    criteriaCategories: PropTypes.arrayOf(PropTypes.shape({})),
  }),
};

MinimizeProvidedSection.defaultProps = {
  subject: '',
  criteriaData: {},
};
export default MinimizeProvidedSection;
