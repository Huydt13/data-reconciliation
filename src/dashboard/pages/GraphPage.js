import React from 'react';
import { useLocation } from 'react-router-dom';
import ChainMap from 'chain/components/ChainMap';

const useQuery = () => new URLSearchParams(useLocation().search);

const GraphPage = () => {
  const query = useQuery();
  const chainId = query.get('chainId');
  const infectionTypeLevelId = query.get('infectionTypeLevelId');

  return (
    <ChainMap
      fullscreen
      chainId={chainId}
      infectionTypeId={infectionTypeLevelId}
    />
  );
};

export default GraphPage;
