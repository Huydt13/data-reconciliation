import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

import styled from 'styled-components';

const Wrapper = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  cursor: pointer;
`;

const PopupText = (props) => {
  const { content } = props;

  return (
    <Popup
      inverted
      position="top left"
      content={content}
      trigger={<Wrapper>{content}</Wrapper>}
    />
  );
};

PopupText.propTypes = {
  content: PropTypes.string.isRequired,
};

export default React.memo(PopupText);
