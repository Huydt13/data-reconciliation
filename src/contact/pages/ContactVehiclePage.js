import React from 'react';
import styled from 'styled-components';

import ContactVehicleTable from 'contact/components/contact-vehicle/ContactVehicleTable';

const StyledContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ContactVehiclePage = () => (
  <StyledContainer>
    <ContactVehicleTable />
  </StyledContainer>
);

export default ContactVehiclePage;
