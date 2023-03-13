import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Button,
  Modal,
  Input,
  Select,
} from 'semantic-ui-react';

import AddressDetails from '../../../contact/components/contact-location/ContactLocationAddress';

const zoneOptions = [{ value: 0, text: 'Khu cách ly kiểm dịch' }, { value: 1, text: 'Khu cách ly điều trị' }];

const ZoneModal = (props) => {
  const {
    open,
    loading,
    onClose,
    initialData,
  } = props;

  const [data, setData] = useState(initialData);

  const handleCreate = () => {
    const {
      onSubmit,
    } = props;

    onSubmit(data);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>{!initialData.id ? 'Tạo' : 'Sửa'}</Modal.Header>
      <Modal.Content>
        <Form
          loading={loading}
          onSubmit={handleCreate}
        >

          <Form.Field
            required
            clearable
            control={Select}
            options={zoneOptions.map((z) => ({
              key: z.value,
              text: z.text,
              value: z.value,
            }))}
            value={data.isTreatmentZone ? 1 : 0}
            label="Loại hình khu cách ly"
            onChange={(e, { value }) => setData({
              ...data,
              isTreatmentZone: value,
            })}
          />
          <Form.Field
            required
            control={Input}
            value={data.name || ''}
            label="Tên khu cách ly"
            onChange={(event) => setData({
              ...data,
              name: event.target.value,
            })}
          />
          <Form.Field
            label="Địa chỉ"
            initialData={data.address || {}}
            control={AddressDetails}
            onChange={(d) => setData({
              ...data,
              address: d,
            })}
          />
          <Form.Input
            control={Input}
            value={data.contactName || ''}
            label="Người quản lý"
            onChange={(event) => setData({
              ...data,
              contactName: event.target.value,
            })}
          />
          <Form.Input
            control={Input}
            value={data.contactPhone || ''}
            label="Số điện thoại"
            onChange={(event) => setData({
              ...data,
              contactPhone: event.target.value,
            })}
          />
          <Button primary type="submit">Xác nhận</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

ZoneModal.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.shape({}),
    isTreatmentZone: PropTypes.bool,
    contactName: PropTypes.string,
    contactPhone: PropTypes.string,
    numberOfRoom: PropTypes.string,
    numberOfBed: PropTypes.string,
  }),
};

ZoneModal.defaultProps = {
  initialData: {},
};

export default ZoneModal;
