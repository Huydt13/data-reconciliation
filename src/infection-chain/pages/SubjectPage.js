import React from 'react';
import styled from 'styled-components';

import SubjectTable from '../components/subject/SubjectTable';

const StyledContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const SubjectPage = () => (
  <StyledContainer>
    <SubjectTable />
  </StyledContainer>
);

export default SubjectPage;
