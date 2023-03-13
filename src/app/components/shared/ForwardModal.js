import React, { useEffect, useState } from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';
import { FiFastForward, FiHelpCircle } from 'react-icons/fi';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { showForwardModal } from 'app/actions/global';
import { resetRelated } from 'profile/actions/profile';

const StyledIconWrapper = styled.span`
  line-height: 0;
  margin-right: 8px;
  font-size: 20px;
  vertical-align: middle;
`;
const Message = styled.p`
  font-size: 30px;
`;

const ForwardModal = () => {
  const dispatch = useDispatch();

  const { forwardMessage, forwardCallback } = useSelector(
    (state) => state.global,
  );
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    if (Boolean(forwardCallback) && Boolean(forwardMessage)) {
      if (countdown > 0) {
        setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        forwardCallback();
        dispatch(showForwardModal(null, null));
        dispatch(resetRelated());
        setCountdown(5);
      }
    }
    // eslint-disable-next-line
  }, [forwardCallback, forwardMessage, countdown]);

  return (
    <Modal
      basic
      size="small"
      open={Boolean(forwardCallback) && Boolean(forwardMessage)}
    >
      <Header
        content="Chuyển trang"
        icon={
          <StyledIconWrapper>
            <FiHelpCircle />
          </StyledIconWrapper>
        }
      />
      <Modal.Content>
        <Message>
          {forwardMessage}
          {countdown}
        </Message>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
          inverted
          content="Chuyển ngay"
          icon={
            <StyledIconWrapper>
              <FiFastForward />
            </StyledIconWrapper>
          }
          onClick={() => {
            forwardCallback();
            dispatch(showForwardModal(null, null));
            dispatch(resetRelated());
            setCountdown(5);
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ForwardModal;
