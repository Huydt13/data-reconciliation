import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Modal, Button } from 'semantic-ui-react';

import ExportList from 'home/components/export-list';

const StyledModalContent = styled(Modal.Content)`
  padding: 1rem !important;
`;

const ExportReportModal = (props) => {
  const { open, onClose } = props;

  return (
    <Modal size="large" open={open} onClose={onClose}>
      <Modal.Header>
        Xuất báo cáo tổng hợp
      </Modal.Header>
      <StyledModalContent scrolling>
        <ExportList />
      </StyledModalContent>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Đóng"
          onClick={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
};

ExportReportModal.defaultProps = {
  open: false,
  onClose: () => {},
};

ExportReportModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default ExportReportModal;
