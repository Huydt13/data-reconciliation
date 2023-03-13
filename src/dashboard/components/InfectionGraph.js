import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import { FiMaximize } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const handleCardHeight = (props) => {
  if (props.fullscreen === 1) {
    return '100vh !important';
  }
  return '600px !important';
};

const StyledCard = styled(Card)`
  width: 100% !important;
  height: ${(props) => handleCardHeight(props)};
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

const isDev = !(
  window.location.href.indexOf('abcde') > -1 ||
  process.env.NODE_ENV === 'development'
);
const iframeUrl = 'http://202.78.227.109:8991/index.html';

const InfectionGraph = (props) => {
  const {
    subjectId,
    type,
    locationType,
    isSubj,
    fullscreen,
    locationBySubjectId,
  } = props;

  const subjectTypeValue = type ?? Number(type);
  const locationTypeValue = locationType ?? Number(locationType);
  const isSubjectValue = isSubj ? isSubj === 'true' : true;

  const { selectedSubjectType, selectedLocationType, isSubject } = useSelector(
    (state) => state.dashboard,
  );

  const link = `${
    isSubject
      ? `/graph/?subjectId=${subjectId}&type=${
          selectedSubjectType === -1 ? '' : selectedSubjectType
        }&locationBySubjectId=${locationBySubjectId}`
      : `/graph/?isSubject=${isSubject}&locationType=${selectedLocationType}`
  }`;

  const [src, setSrc] = useState('');

  useEffect(() => {
    if (isSubject && isSubjectValue) {
      if (!subjectTypeValue) {
        setSrc(
          `${iframeUrl}?subjectId=${subjectId}${
            selectedSubjectType !== -1 ? `&type=${selectedSubjectType}` : ''
          }&isDev=${isDev}&isSubject=true&ref=${new Date().getTime()}`,
        );
      } else {
        setSrc(
          `${iframeUrl}?subjectId=${subjectId}${
            subjectTypeValue !== -1 ? `&type=${subjectTypeValue}` : ''
          }&isDev=${isDev}&isSubject=true&ref=${new Date().getTime()}`,
        );
      }
    } else {
      setSrc(
        `${iframeUrl}?isSubject=false&locationType=${
          selectedLocationType || locationTypeValue
        }&isDev=${isDev}&ref=${new Date().getTime()}`,
      );
    }
    if (locationBySubjectId) {
      setSrc(
        `${iframeUrl}?locationBySubjectId=true&subjectId=${subjectId}&isDev=${isDev}&ref=${new Date().getTime()}`,
      );
    }
    // eslint-disable-next-line
  }, [
    locationBySubjectId,
    isSubject,
    subjectTypeValue,
    selectedSubjectType,
    selectedLocationType,
    subjectId,
  ]);

  return (
    <div>
      <StyledCard fullscreen={fullscreen ? 1 : 0}>
        <StyledIframe
          name={new Date().getDate()}
          id="frame"
          title="iframeGraph"
          frameBorder="0"
          src={src}
        />
        <div style={{ color: '#000' }}>
          {!window.location.href.includes('graph') ? (
            <StyledButton as={Link} target="_blank" to={link}>
              <FiMaximize size={20} />
            </StyledButton>
          ) : (
            ''
          )}
        </div>
      </StyledCard>
    </div>
  );
};

InfectionGraph.propTypes = {
  fullscreen: PropTypes.bool,
  isSubj: PropTypes.string,
  subjectId: PropTypes.string,
  type: PropTypes.string,
  locationType: PropTypes.string,
  locationBySubjectId: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

InfectionGraph.defaultProps = {
  fullscreen: false,
  isSubj: '',
  subjectId: '',
  type: '',
  locationType: '',
  locationBySubjectId: false,
};

export default InfectionGraph;
