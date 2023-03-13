import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Breadcrumb } from 'semantic-ui-react';
import { FiChevronRight } from 'react-icons/fi';

import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectChain } from 'chain/actions/chain';

import ChainInformationSection from 'chain/components/ChainInformationSection';
import ChainTabSection from 'chain/components/ChainTabSection';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 16px;
`;

const InfectionChainInformation = ({ profileId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { selectedChain } = useSelector((s) => s.chain);
  const sections = useMemo(() => {
    const bc = [
      {
        key: 0,
        content: !selectedChain ? 'Danh sách chuỗi' : selectedChain.name,
        active: !selectedChain,
        onClick: () => {
          dispatch(selectChain(undefined));
          history.push(`/profile/${profileId}/infection-chain`);
        },
      },
    ];

    if (selectedChain) {
      bc.push({
        key: 2,
        content: 'Thống kê chi tiết',
        active: true,
      });
    }

    return bc;
  }, [dispatch, selectedChain, history, profileId]);

  return (
    <>
      <BreadcrumbWrapper>
        <Breadcrumb
          size="big"
          sections={sections}
          icon={<StyledChevronRight />}
        />
      </BreadcrumbWrapper>
      {!selectedChain && <ChainInformationSection profileId={profileId} />}
      {selectedChain && <ChainTabSection profileId={profileId} />}
    </>
  );
};

InfectionChainInformation.propTypes = {
  profileId: PropTypes.number,
};

InfectionChainInformation.defaultProps = {
  profileId: 0,
};

export default InfectionChainInformation;
