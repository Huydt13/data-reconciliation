import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Link } from 'react-router-dom';
import { Button, Card } from 'semantic-ui-react';

import { FiMaximize } from 'react-icons/fi';
import { TOKEN } from 'app/utils/constants';

const StyledCard = styled(Card)`
  width: 100% !important;
  height: ${({ fullscreen }) =>
    fullscreen ? '100vh !important' : '600px !important'};
  overflow: hidden;
  position: relative;
`;

const StyledButton = styled(Button)`
  position: absolute;
  right: 2%;
  bottom: 2%;
  color: #000;
`;

const StyledIframe = styled.iframe`
  height: 100% !important;
  width: 100% !important;
`;

const isDev =
  window.location.href.includes('abcde') ||
  process.env.NODE_ENV === 'development';
const iframeBaseUrl = 'https://graph.hcdc.vn/index.html?';
// const iframeBaseUrl = 'http://127.0.0.1:8080/index.html?';
// const iframeBaseUrl = 'http://192.168.35.101:8080/index.html?';

const ChainMap = ({
  chainId,
  diseaseTypeId,
  infectionTypeId: infectionTypeLevelId,
  withLocations,
  hasNodeName,
  fullscreen,
}) => {
  const [iframeSrc, setIframeSrc] = useState('');
  const [fullScreenUrl, setFullScreenUrl] = useState('');
  useEffect(() => {
    let chainIdParam = '';
    let infectionTypeLevelIdParam = '';
    let diseaseTypeParam = '';
    let withLocationsParam = '';
    let hasNodeNameParam = '';
    const token = localStorage.getItem(TOKEN) || sessionStorage.getItem(TOKEN);
    const tokenParam = `&token=${token}`;
    const isDevParam = `&isDev=${isDev}`;
    const refParam = `&ref=${new Date().getTime()}`;
    if (diseaseTypeId) {
      diseaseTypeParam = `&diseaseTypeId=${diseaseTypeId}`;
    } else {
      diseaseTypeParam = '&diseaseTypeId=b597cc8f-74b6-434d-8b9d-52b74595a1de';
    }
    if (chainId) {
      chainIdParam = `&chainId=${chainId}`;
    }
    if (infectionTypeLevelId) {
      infectionTypeLevelIdParam = `&infectionTypeLevelId=${infectionTypeLevelId}`;
    }
    if (typeof withLocations === 'boolean') {
      withLocationsParam = `&withLocations=${withLocations}`;
    }
    if (typeof hasNodeName === 'boolean') {
      hasNodeNameParam = `&hasNodeName=${hasNodeName}`;
    }
    setIframeSrc(
      iframeBaseUrl +
        chainIdParam +
        infectionTypeLevelIdParam +
        isDevParam +
        hasNodeNameParam +
        diseaseTypeParam +
        withLocationsParam +
        refParam +
        tokenParam,
    );
    setFullScreenUrl(
      `/graph?${chainIdParam}${infectionTypeLevelIdParam}${diseaseTypeParam}${withLocationsParam}${hasNodeNameParam}`,
    );
  }, [
    chainId,
    infectionTypeLevelId,
    withLocations,
    diseaseTypeId,
    hasNodeName,
    fullscreen,
  ]);
  return (
    <StyledCard fullscreen={fullscreen ? 1 : 0}>
      <StyledIframe
        name={new Date().getDate()}
        id="frame"
        title="iframeGraph"
        frameBorder="0"
        src={iframeSrc}
      />
      <div style={{ color: '#000' }}>
        {!window.location.href.includes('graph') && (
          <StyledButton as={Link} target="_blank" to={fullScreenUrl}>
            <FiMaximize size={20} />
          </StyledButton>
        )}
      </div>
    </StyledCard>
  );
};

ChainMap.propTypes = {
  chainId: PropTypes.string,
  diseaseTypeId: PropTypes.string,
  infectionTypeId: PropTypes.string,
  withLocations: PropTypes.bool,
  hasNodeName: PropTypes.bool,
  fullscreen: PropTypes.bool,
};

ChainMap.defaultProps = {
  chainId: '',
  diseaseTypeId: '',
  infectionTypeId: '',
  withLocations: false,
  hasNodeName: true,
  fullscreen: null,
};

export default ChainMap;
