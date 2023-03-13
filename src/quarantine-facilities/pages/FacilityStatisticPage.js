import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiChevronRight } from 'react-icons/fi';

import { DataList } from 'app/components/shared';
import { Breadcrumb } from 'semantic-ui-react';
import {
  FacilityStatisticType,
  FacilityStatisticOptions,
} from 'quarantine-facilities/utils/constants';

import Statistic from '../components/statistic';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;

const FacilityStatisticPage = () => {
  const [selecting, setSelecting] = useState(undefined);

  const dataList = useMemo(
    () => (
      <DataList
        search
        toggle
        title="Danh sách thống kê"
        data={FacilityStatisticOptions}
        onRowClick={setSelecting}
        itemHeaderRender={(d) => d.text}
        itemContentRender={() => ''}
        getRowKey={(d) => d.value}
      />
    ),
    [],
  );

  const sections = useMemo(() => {
    const bc = [
      {
        key: 0,
        content: 'Thống kê',
        active: !selecting,
        onClick: () => setSelecting(undefined),
      },
    ];

    if (selecting) {
      bc.push({
        key: 1,
        content: selecting.text,
        active: true,
      });
    }

    return bc;
  }, [selecting]);

  const renderComponent = useMemo(() => {
    if (selecting) {
      switch (selecting.value) {
        case FacilityStatisticType.SHEET1:
          return <Statistic.QuarantineStatisticSheet1 />;
        case FacilityStatisticType.SHEET2:
          return <Statistic.QuarantineStatisticSheet2 />;
        case FacilityStatisticType.SHEET3:
          return <Statistic.QuarantineStatisticSheet3 />;
        case FacilityStatisticType.SHEET4:
          return <Statistic.QuarantineStatisticSheet4 />;
        case FacilityStatisticType.SHEET5:
          return <Statistic.QuarantineStatisticSheet5 />;
        case FacilityStatisticType.SHEET6:
          return <Statistic.QuarantineStatisticSheet6 />;
        case FacilityStatisticType.SHEET7:
          return <Statistic.QuarantineStatisticSheet7 />;
        case FacilityStatisticType.SHEET8:
          return <Statistic.QuarantineStatisticSheet8 />;
        case FacilityStatisticType.SHEET9:
          return <Statistic.QuarantineStatisticSheet9 />;
        default:
          return null;
      }
    }
    return null;
  }, [selecting]);

  return (
    <div>
      <BreadcrumbWrapper>
        <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
      </BreadcrumbWrapper>

      {selecting ? renderComponent : dataList}
    </div>
  );
};

export default FacilityStatisticPage;
