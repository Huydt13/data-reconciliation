import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  FiX,
} from 'react-icons/fi';

import { Modal, Button } from 'semantic-ui-react';

const Image = styled.img`
  max-width: 1024px;
  max-height: 728px;
`;
const IconWrapper = styled.span`
  line-height: 0;
  margin-right: 8px;
  font-size: 20px;
  vertical-align: middle;
`;

const PreviewImageModal = (props) => {
  const { data, onClose } = props;

  return (
    <Modal
      basic
      size="large"
      open={Boolean(data)}
    >
      <Modal.Content>
        <Image src={data} />
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          inverted
          color="red"
          content="Đóng"
          icon={(
            <IconWrapper>
              <FiX />
            </IconWrapper>
          )}
          onClick={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
};

PreviewImageModal.defaultProps = {
  data: undefined,
  onClose: () => {},
};

PreviewImageModal.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(undefined)]),
  onClose: PropTypes.func,
};

export default PreviewImageModal;
