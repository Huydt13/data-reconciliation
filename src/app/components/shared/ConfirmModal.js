import React from 'react';
import {
  Modal,
  Header,
  Button,
} from 'semantic-ui-react';
import {
  FiX,
  FiCheck,
  FiHelpCircle,
} from 'react-icons/fi';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';

const StyledIconWrapper = styled.span`
  line-height: 0;
  margin-right: 8px;
  font-size: 20px;
  vertical-align: middle;
`;
const Message = styled.p`
  font-size: 30px;
`;

const ConfirmModal = () => {
  const dispatch = useDispatch();

  const {
    confirmMessage,
    confirmCallback,
  } = useSelector((state) => state.global);

  return (
    <Modal
      basic
      size="small"
      open={Boolean(confirmCallback) && Boolean(confirmMessage)}
    >
      <Header
        content="Xác nhận"
        icon={(
          <StyledIconWrapper>
            <FiHelpCircle />
          </StyledIconWrapper>
        )}
      />
      <Modal.Content>
        <Message>{confirmMessage}</Message>
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          inverted
          color="red"
          content="Hủy"
          icon={(
            <StyledIconWrapper>
              <FiX />
            </StyledIconWrapper>
          )}
          onClick={() => dispatch(showConfirmModal(null, null))}
        />
        <Button
          color="green"
          inverted
          content="Xác nhận"
          icon={(
            <StyledIconWrapper>
              <FiCheck />
            </StyledIconWrapper>
          )}
          onClick={() => {
            confirmCallback();
            dispatch(showConfirmModal(null, null));
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ConfirmModal;
