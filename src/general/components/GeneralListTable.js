import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FiChevronRight } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { selectGeneral } from 'general/actions/general';

import { DataList } from 'app/components/shared';
import { Breadcrumb } from 'semantic-ui-react';
import {
  GeneralList,
  // Generals
} from 'general/utils/constants';

import GeneralDetailTable from './GeneralDetailTable';
// import CriteriasTable from './CriteriasTable';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;

const GeneralListTable = () => {
  const dispatch = useDispatch();

  const { selectedGeneral } = useSelector((s) => s.general);

  const dataList = useMemo(
    () => (
      <DataList
        search
        toggle
        title="Chọn danh mục dùng chung"
        data={GeneralList}
        onRowClick={(row) => {
          if (selectedGeneral === row.value) {
            dispatch(selectGeneral(undefined));
          } else {
            dispatch(selectGeneral(row));
          }
        }}
        itemHeaderRender={(d) => d.name}
        itemContentRender={(d) => `Danh sách ${d.name.toLowerCase()}`}
        getRowKey={(d) => d.value}
      />
    ),
    [dispatch, selectedGeneral],
  );

  const sections = useMemo(() => {
    const bc = [
      {
        key: 0,
        content: 'Danh mục',
        active: !selectedGeneral,
        onClick: () => dispatch(selectGeneral(undefined)),
      },
    ];

    if (selectedGeneral) {
      bc.push({
        key: 1,
        content: selectedGeneral.name,
        active: true,
      });
    }

    return bc;
  }, [dispatch, selectedGeneral]);

  return (
    <div>
      <BreadcrumbWrapper>
        <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
      </BreadcrumbWrapper>

      {!selectedGeneral && dataList}
      {selectedGeneral && <GeneralDetailTable />}

      {/* {selectedGeneral && selectedGeneral.value !== Generals.CRITERIAS && (
        <GeneralDetailTable />
      )}

      {selectedGeneral && selectedGeneral.value === Generals.CRITERIAS && (
        <CriteriasTable />
      )} */}
    </div>
  );
};

export default GeneralListTable;
