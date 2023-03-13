import React from 'react';
import styled from 'styled-components';
import { Label } from 'semantic-ui-react';

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

const MinimizeAlias = () => {
  const {
    subjectDetail: { byT_Alias: byt, hcM_Alas: hcm, hcdC_Alias: hcdc },
  } = useSelector((s) => s.chain);
  const labels = [
    {
      rowIndex: 3,
      col: [
        { key: 1, label: 'Bí danh BYT:', value: byt },
        { key: 0, label: 'Bí danh HCM:', value: hcm },
        { key: 2, label: 'Bí danh CDC:', value: hcdc },
      ],
    },
  ];
  return (
    <StyledMinimizeWrapper>
      {labels.map((r) => (
        <div key={r.rowIndex}>
          {r.col.map((f) => (
            <Label key={f.key} basic content={f.label} detail={f.value} />
          ))}
        </div>
      ))}
    </StyledMinimizeWrapper>
  );
};

export default MinimizeAlias;
