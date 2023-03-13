import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import { Accordion, Card } from 'semantic-ui-react';
import { KIBANA_DASHBOARD_1_URL, KIBANA_DASHBOARD_2_URL } from 'home/utils/contants';

const StyledAccordion = styled(Accordion)`
  padding-bottom: 0.5rem;
  & .title {
    font-weight: 600 !important;
    text-transform: uppercase
  }
`;

const StyledCard = styled(Card)`
  width: 362px !important;
  & .description {
    font-weight: 600 !important;
  }
`;

const KibanaDashboardSection = () => {
  const [isExpand, setIsExpand] = useState(false);

  const handleExpand = () => setIsExpand(!isExpand);

  const items = useMemo(() => ([
    {
      key: 'cds_dashboard',
      description: 'CDS - Dashboard',
      onClick: () => window.open(KIBANA_DASHBOARD_1_URL, '_blank'),
    },
    {
      key: 'cds_dashboard_index_statistic',
      description: 'CDS - Dashboard Phân tích chỉ số',
      onClick: () => window.open(KIBANA_DASHBOARD_2_URL, '_blank'),
    },
  ]), []);

  return (
    <StyledAccordion fluid>
      <Accordion.Title active={isExpand} onClick={handleExpand}>
        <i aria-hidden="true" className="dropdown icon" />
        Dashboard
      </Accordion.Title>
      <Accordion.Content active={isExpand}>
        <Card.Group>
          {items.map((item) =>
            !item?.hidden && (
              <StyledCard
                key={item.key}
                description={item.description}
                onClick={item.onClick}
              />
            ),
          )}
        </Card.Group>
      </Accordion.Content>
    </StyledAccordion>
  );
};

export default KibanaDashboardSection;
