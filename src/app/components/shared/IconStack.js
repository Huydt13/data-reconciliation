import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.span`
  display: inline-block;
  position: relative;
`;

const IconStack = ({ icon1: Icon1, icon2: Icon2 }) => (
  <Wrapper>
    <Icon1 textAnchor="middle" alignmentBaseline="middle" />
    <Icon2
      textAnchor="middle"
      alignmentBaseline="middle"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
      }}
    />
  </Wrapper>
);

IconStack.propTypes = {
  icon1: PropTypes.elementType.isRequired,
  icon2: PropTypes.elementType.isRequired,
};

export default IconStack;
