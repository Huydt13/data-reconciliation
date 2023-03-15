import React, { useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { Accordion, Card } from "semantic-ui-react";
import ExportReportModal from "home/components/ExportReportModal";

import { useAuth } from "app/hooks";
import { CDS_GUIDE_URL } from "home/utils/contants";

const StyledAccordion = styled(Accordion)`
  padding-bottom: 0.5rem;
  & .title {
    font-weight: 600 !important;
    text-transform: uppercase;
  }
`;
const StyledCard = styled(Card)`
  width: 362px !important;
  & .description {
    font-weight: 600 !important;
  }
`;

const InformationSection = () => {
  const [isExpand, setIsExpand] = useState(true);
  const [exportReportModal, setExportReportModal] = useState(false);
  const handleExpand = () => setIsExpand(!isExpand);

  const { isUsername } = useAuth();
  const history = useHistory();
  const items = useMemo(
    () => [
      {
        key: "cds_guide",
        description: "Test",
        onClick: () => history.push('/test'),
      },
      // {
      //   key: 'cds_guide',
      //   description: 'Hướng dẫn sử dụng CDS',
      //   onClick: () => window.open(CDS_GUIDE_URL, '_blank'),
      // },
      //   {
      //     key: 'positive_examination',
      //     description: 'Thông tin kết quả xét nghiệm PCR',
      //     onClick: () => history.push('/positive-examination'),
      //   },
      //   {
      //     key: 'positive_quick_test',
      //     description: 'Thông tin kết quả xét nghiệm nhanh',
      //     onClick: () => history.push('/positive-quick-test'),
      //   },
      //   {
      //     key: 'infected_patient',
      //     description: 'Thông tin khai báo f0',
      //     onClick: () => history.push('/infected-patient'),
      //   },
      //   {
      //     key: 'export_report',
      //     description: 'Xuất báo cáo tổng hợp',
      //     onClick: () => setExportReportModal(true),
      //     hidden: !isUsername('hcdc'),
      //   },
    ],
    [history, isUsername, setExportReportModal]
  );

  return (
    <>
      <StyledAccordion fluid>
        <Accordion.Title active={isExpand} onClick={handleExpand}>
          <i aria-hidden="true" className="dropdown icon" />
          Thông tin chung
        </Accordion.Title>
        <Accordion.Content active={isExpand}>
          <Card.Group>
            {items.map(
              (item) =>
                !item?.hidden && (
                  <StyledCard
                    key={item.key}
                    description={item.description}
                    onClick={item.onClick}
                  />
                )
            )}
          </Card.Group>
        </Accordion.Content>
      </StyledAccordion>

      <ExportReportModal
        open={exportReportModal}
        onClose={() => setExportReportModal(false)}
      />
    </>
  );
};

export default InformationSection;
