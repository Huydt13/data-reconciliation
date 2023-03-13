import React from 'react';
import styled from 'styled-components';
import { Label, Loader } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

const StyledMinimizeWrapper = styled.div`
  position: relative;
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

const InvestigateSection = () => {
  const {
    subjectDetail: { infectionType },
    getSubjectDetailLoading: loading,
  } = useSelector((s) => s.chain);
  const labels = [
    {
      rowIndex: 0,
      col: [
        {
          key: 'subjectTypeLabel',
          label: 'Nhãn xác minh:',
          value: infectionType?.name ?? 'F?',
          color: infectionType?.colorCode ?? 'black',
        },
      ],
    },
  ];

  return (
    <StyledMinimizeWrapper>
      {loading ? (
        <Loader active />
      ) : (
        <>
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
        </>
      )}
    </StyledMinimizeWrapper>
  );
};

export default InvestigateSection;
