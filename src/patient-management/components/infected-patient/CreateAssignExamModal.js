import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Select, Button } from 'semantic-ui-react';
import { KeyboardDatePicker } from 'app/components/shared';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';
import {
  getUnitInfo,
  getPrefixes,
  createAssignWithDate,
} from 'medical-test/actions/medical-test';

const CreateAssignExamModal = (props) => {
  const { data, onClose, onRefresh } = props;

  const dispatch = useDispatch();
  const { isAdmin, getAuthInfo } = useAuth();
  const { watch, register, handleSubmit, setValue } = useForm();
  const { unitInfo, prefixList, getPrefixesLoading, createAssignLoading } =
    useSelector((state) => state.medicalTest);

  const onSubmit = async (d) => {
    try {
       await dispatch(createAssignWithDate({
         ...d,
         profileId: data?.person?.profileId ?? 0,
       }));
       onClose();
       onRefresh();
    // eslint-disable-next-line
    } catch (error) {}
  };

  useEffect(() => {
    if (!unitInfo?.id) {
      dispatch(getUnitInfo());
    }
    if (prefixList.length === 0) {
      dispatch(getPrefixes());
    }
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    register({ name: 'unitId' });
    register({ name: 'dateAssigned' });
    if (!isAdmin) {
      setValue('unitId', unitInfo?.id);
    }
  }, [register, unitInfo, isAdmin, setValue]);

  return (
    <Modal open={Boolean(data?.id)} onClose={onClose}>
      <Modal.Header>Chỉ định lấy mẫu PCR</Modal.Header>
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

CreateAssignExamModal.propTypes = {
  data: PropTypes.shape({}),
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
};

CreateAssignExamModal.defaultProps = {
  data: {},
  onClose: () => {},
  onRefresh: () => {},
};

export default CreateAssignExamModal;
