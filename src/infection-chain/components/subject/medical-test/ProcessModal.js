import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Select, Button } from 'semantic-ui-react';

import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';
import { KeyboardDatePicker } from 'app/components/shared';

const ProcessModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const { watch, register, handleSubmit, setValue } = useForm();

  const { isAdmin, getAuthInfo } = useAuth();
  const { unitInfo, prefixList, getPrefixesLoading, createAssignLoading } =
    useSelector((state) => state.medicalTest);
  useEffect(() => {
    register({ name: 'unitId' });
    register({ name: 'dateAssigned' });
    if (!isAdmin) {
      setValue('unitId', unitInfo?.id);
    }
  }, [register, unitInfo, isAdmin, setValue]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Chỉ định lấy mẫu</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group widths="equal">
            {(isAdmin || (getAuthInfo()?.Username ?? '').includes('.kcl')) && (
              <Form.Field
                search
                deburr
                required
                label="Cơ sở lấy mẫu"
                control={Select}
                loading={getPrefixesLoading}
                options={prefixList.map((z) => ({
                  key: z.id,
                  text: z.name,
                  value: z.id,
                }))}
                onChange={(e, { value }) => {
                  setValue('unitId', value);
                }}
              />
            )}
            <Form.Field
              required
              label="Ngày chỉ định lấy mẫu"
              control={KeyboardDatePicker}
              onChange={(d) => setValue('dateAssigned', d)}
            />
          </Form.Group>
          <Button
            primary
            content="Xác nhận"
            loading={createAssignLoading}
            disabled={
              !watch('unitId') || !watch('dateAssigned') || createAssignLoading
            }
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

ProcessModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

ProcessModal.defaultProps = {
  open: false,
  onClose: () => {},
  onSubmit: () => {},
};

export default ProcessModal;
