import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FiChevronRight, FiDownload } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { selectFacility } from 'quarantine-facilities/actions/quarantine-facility';

import { DataList } from 'app/components/shared';
import { formatObjectToAddress } from 'app/utils/helpers';
import { Breadcrumb } from 'semantic-ui-react';
import { exportExcel } from 'app/actions/global';
import apiLinks from 'app/utils/api-links';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;

const SelectFacilitySection = ({
  componentLabel,
  component,
  isBeing,
  isWaiting,
  isCompleted,
}) => {
  const dispatch = useDispatch();

  const exportLoading = useSelector((s) => s.global.exportLoading);

  const getData = useCallback(() => {
    dispatch(selectFacility(undefined));
  }, [dispatch]);

  useEffect(getData, [getData]);

  const { selectedFacility, facilityData, getFacilitiesLoading } = useSelector(
    (s) => s.quarantineFacility,
  );

  const { data } = facilityData;
  const handleRenderContent = useCallback(
    (d) => {
      if (d) {
        if (isBeing) {
          return `Đang cách ly: ${d.totalOccupier}`;
        }
        if (isWaiting) {
          return `Chờ cách ly: ${d.waitingCount}`;
        }
        // if (isCompleted) {
        //   return `Số người đã cách ly ${d.totalOccupier}`;
        // }
      }
      return '';
    },
    // eslint-disable-next-line
    [isBeing, isWaiting, isCompleted],
  );
  const dataList = useMemo(
    () => (
      <DataList
        search
        toggle
        title="Chọn khu cách ly"
        data={data || []}
        loading={getFacilitiesLoading || exportLoading}
        listActions={[
          {
            icon: <FiDownload />,
            title: 'Export danh sách khu',
            color: 'violet',
            globalAction: true,
            onClick: () =>
              dispatch(
                exportExcel({
                  url: apiLinks.facilities.quarantineFacilities
                    .exportFacilities,
                  params: { exportToExcel: true },
                  fileName: 'DS khu',
                  isQuarantine: true,
                }),
              ),
          },
        ]}
        onRowClick={(row) => {
          if (selectedFacility?.id === row?.id) {
            dispatch(selectFacility(undefined));
          } else {
            dispatch(selectFacility(row));
          }
        }}
        itemHeaderRender={(d) => d.name}
        itemContentRender={handleRenderContent}
        itemSubContentRender={(d) => `Địa chỉ: ${formatObjectToAddress(d)}`}
        getRowKey={(d) => d.id}
      />
    ),
    [
      dispatch,
      getFacilitiesLoading,
      exportLoading,
      data,
      selectedFacility,
      handleRenderContent,
    ],
  );

  const sections = useMemo(() => {
    const bc = [
      {
        key: 0,
        content: !selectedFacility
          ? `Chọn khu cách ly - ${componentLabel}`
          : selectedFacility.name,
        active: !selectedFacility,
        onClick: () => dispatch(selectFacility(undefined)),
      },
    ];

    if (selectedFacility) {
      bc.push({
        key: 1,
        content: componentLabel,
        active: true,
      });
    }

    return bc;
  }, [dispatch, selectedFacility, componentLabel]);

  return (
    <div>
      <BreadcrumbWrapper>
        <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
      </BreadcrumbWrapper>
      {!selectedFacility && dataList}
      {selectedFacility && component}
    </div>
  );
};

SelectFacilitySection.propTypes = {
  component: PropTypes.element.isRequired,
  componentLabel: PropTypes.string.isRequired,
  isBeing: PropTypes.bool,
  isWaiting: PropTypes.bool,
  isCompleted: PropTypes.bool,
};

SelectFacilitySection.defaultProps = {
  isBeing: false,
  isWaiting: false,
  isCompleted: false,
};

export default SelectFacilitySection;
