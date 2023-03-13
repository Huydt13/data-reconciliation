import React from 'react';
import styled from 'styled-components';

import ContactLocationTable from '../components/contact-location/ContactLocationTable';

const StyledContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ContactLocationPage = () => (
  <StyledContainer>
    <ContactLocationTable />
  </StyledContainer>
);

export default ContactLocationPage;
