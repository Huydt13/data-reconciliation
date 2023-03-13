import React, { useMemo } from 'react';
import styled from 'styled-components';

import { FiChevronRight } from 'react-icons/fi';
import { Breadcrumb } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { selectEstate } from 'contact/actions/location';

import EstateTable from 'contact/components/locations/estate/EstateTable';
import LocationVisitorTable from 'contact/components/locations/visitor/LocationVisitorTable';

const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;
const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;

const EstatePage = () => {
  const dispatch = useDispatch();
  const { selectedEstate } = useSelector((s) => s.location);
  const sections = useMemo(() => {
    const bc = [
      {
        key: 0,
        content: 'Danh sách địa điểm tiếp xúc',
        active: !selectedEstate,
        onClick: () => dispatch(selectEstate(undefined)),
      },
    ];

    if (selectedEstate) {
      bc.push({
        key: 1,
        content: selectedEstate.name,
        active: true,
      });
    }

    return bc;
  }, [dispatch, selectedEstate]);
  return (
    <div>
      <BreadcrumbWrapper>
        <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
      </BreadcrumbWrapper>
      {selectedEstate ? <LocationVisitorTable /> : <EstateTable />}
    </div>
  );
};

export default EstatePage;
