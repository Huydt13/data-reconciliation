import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  createUnitConfig,
  updateUnitConfig,
} from 'medical-test/actions/medical-test';

const UnitConfigModal = (props) => {
  const dispatch = useDispatch();
  const {
    open, onClose, onRefresh, onLoad, loading, unitId, data,
  } = props;
  const {
    watch, control, reset, getValues,
  } = useForm({ defaultValues: data });
  useEffect(() => reset(data), [reset, data]);

  const handleSubmit = async () => {
    onLoad(true);
    const d = getValues();
    try {
      await dispatch(
        data?.id
          ? updateUnitConfig({ ...d, code: d.code.toUpperCase() })
          : createUnitConfig({ ...d, code: d.code.toUpperCase(), unitId }),
      );
    } finally {
      onLoad(false);
      onClose();
      onRefresh();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>{data?.id ? 'Sửa mã phụ' : 'Tạo mã phụ'}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="code"
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  input={{ maxLength: '3' }}
                  label="Tên mã phụ"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller control={control} defaultValue="" name="id" />
          </Form.Group>
          <Form.Button
            primary
            content="Xác nhận"
            loading={loading}
            disabled={!watch('code')}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

UnitConfigModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onLoad: PropTypes.func.isRequired,
  unitId: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
};

export default UnitConfigModal;
