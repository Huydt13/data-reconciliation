import React from 'react';
import { Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { triggerTreeFolderOpen } from 'app/actions/global';
import TreeFolder from './tree-folder';

const TreeFolderModal = () => {
  const dispatch = useDispatch();

  const open = useSelector((s) => s.global.treeFolderOpen);

  return (
    <Modal open={open} onClose={() => dispatch(triggerTreeFolderOpen())}>
      <Modal.Header>Danh sách File Mẫu</Modal.Header>
      <Modal.Content>
        <TreeFolder />
      </Modal.Content>
    </Modal>
  );
};

export default TreeFolderModal;
