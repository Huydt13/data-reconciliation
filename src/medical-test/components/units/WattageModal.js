import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Form,
  Input,
  Button,
  Header,
} from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';

const fields = [
  'collectW',
  'collectLimit',
  'receiveW',
  'receiveLimit',
  'testW',
  'testLimit',
  'collectWattMax',
  'receiveWattMax',
  'testWattMax',
];
const WattageModal = (props) => {
  const {
    open,
    onClose,
    onSubmit,
    initialData,
  } = props;
  const {
    watch,
    register,
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: initialData,
  });
  useEffect(() => {
    fields.forEach(register);
  }, [register]);

  const { isAdmin } = useAuth();

  const { updateUnitLoading } = useSelector((state) => state.medicalTest);
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        Điều chỉnh công suất và chỉ tiêu
      </Modal.Header>
      <Modal.Content>
        <Form
          loading={updateUnitLoading}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Header as="h4" content="Công suất/Chỉ tiêu lấy mẫu" />
          <Form.Group widths="equal">
            <Form.Field
              disabled={!initialData.isCollector}
              type="number"
              control={Input}
              label="Công suất lấy mẫu"
              value={watch('collectW') || ''}
              onChange={(e, { value }) => {
                setValue('collectW', parseInt(value, 10));
              }}
            />
            <Form.Field
              disabled={!isAdmin || !initialData.isCollector}
              type="number"
              control={Input}
              label="Chỉ tiêu lấy mẫu được giao"
              value={watch('collectLimit') || ''}
              onChange={(e, { value }) => {
                setValue('collectLimit', parseInt(value, 10));
              }}
            />
          </Form.Group>
          <Header as="h4" content="Công suất/Chỉ tiêu xét nghiệm" />
          <Form.Group widths="equal">
            <Form.Field
              disabled={!initialData.isTester}
              type="number"
              control={Input}
              label="Công suất xét nghiệm trung bình"
              value={watch('testW') || ''}
              onChange={(e, { value }) => {
                setValue('testW', parseInt(value, 10));
              }}
            />
            <Form.Field
              disabled={!initialData.isTester}
              type="number"
              control={Input}
              label="Công suất xét nghiệm tối đa"
              value={watch('testWattMax') || ''}
              onChange={(e, { value }) => {
                setValue('testWattMax', parseInt(value, 10));
              }}
            />
            <Form.Field
              disabled={!isAdmin || !initialData.isTester}
              type="number"
              control={Input}
              label="Chỉ tiêu xét nghiệm được giao"
              value={watch('testLimit') || ''}
              onChange={(e, { value }) => {
                setValue('testLimit', parseInt(value, 10));
              }}
            />
          </Form.Group>
          <Button primary content="Xác nhận" />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

WattageModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.number,
    address: PropTypes.string,
    isCollector: false,
    isReceiver: false,
    isTester: false,
  }),
  onSubmit: PropTypes.func,
};

WattageModal.defaultProps = {
  initialData: {},
  onSubmit: () => {},
};

export default WattageModal;
