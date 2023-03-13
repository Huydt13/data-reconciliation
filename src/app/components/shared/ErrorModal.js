import React from 'react';
import { Modal, Button, Message } from 'semantic-ui-react';
import { FiX } from 'react-icons/fi';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { showErrorModal } from 'app/actions/global';

const StyledIconWrapper = styled.span`
  line-height: 0;
  margin-right: 8px;
  font-size: 20px;
  vertical-align: middle;
`;

const ErrorModal = () => {
  const dispatch = useDispatch();
  const { errorHeader, errorSuccessList, errorFailLogs } = useSelector(
    (state) => state.global,
  );

  return (
    <Modal open={Boolean(errorHeader)}>
      <Modal.Header>{errorHeader}</Modal.Header>
      <Modal.Content>
        <Message positive header={`Thành công: ${errorSuccessList}`} />
        <Message error header="Lỗi" list={errorFailLogs} />
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          content="Đóng"
          icon={
            <StyledIconWrapper>
              <FiX />
            </StyledIconWrapper>
          }
          onClick={() => dispatch(showErrorModal('', '', []))}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ErrorModal;
