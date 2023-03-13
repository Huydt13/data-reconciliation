import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Modal } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { updateEstate } from 'contact/actions/contact';

import VehicleSection from 'chain/components/OtherVehicleSection';

const EstateModal = (props) => {
  const dispatch = useDispatch();
  const { onClose, onRefresh, data } = props;
  const loading = useSelector((s) => s.contact.updateEstateLoading);
  const [updatingData, setUpdatingData] = useState({});
  useEffect(() => {
    setUpdatingData(data);
  }, [data]);

  const handleUpdate = async () => {
    await dispatch(
      updateEstate({
        id: updatingData.id,
        name: updatingData.name,
      }),
    );
    onClose();
    onRefresh();
  };
  return (
    <Modal open={Boolean(data?.id)} onClose={onClose}>
      <Modal.Header>Chỉnh sửa thông tin phương tiện</Modal.Header>
      <Modal.Content>
        <VehicleSection
          data={data}
          onChange={(d) => setUpdatingData((initial) => ({ ...initial, ...d }))}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="violet"
          labelPosition="right"
          icon="sync"
          content="Cập nhật"
          loading={loading}
          disabled={loading}
          onClick={handleUpdate}
        />
      </Modal.Actions>
    </Modal>
  );
};
EstateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
};

export default EstateModal;
