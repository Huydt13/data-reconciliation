import React from 'react';
import styled from 'styled-components';

import SubjectTable from '../components/subject/SubjectTable';

const StyledContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const UnverifiedSubjectPage = () => (
  <StyledContainer>
    <SubjectTable isUnverified />
  </StyledContainer>
);

export default UnverifiedSubjectPage;
