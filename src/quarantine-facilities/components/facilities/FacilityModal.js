/* eslint-disable react/jsx-one-expression-per-line */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Divider, Form, Header, Modal } from 'semantic-ui-react';

import { Controller, useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import {
  createFacility,
  updateFacility,
} from 'quarantine-facilities/actions/quarantine-facility';

import { AddressDetails } from 'app/components/shared';

import { FacilityOptions } from 'quarantine-facilities/utils/constants';
import { getIndexes } from 'app/utils/helpers';
import { toast } from 'react-toastify';

const FacilityModal = (props) => {
  const { open, onClose, onSubmit, data } = props;
  const { register, watch, reset, control, getValues } = useForm({
    defaultValues: data,
  });
  useEffect(() => {
    register('username');
  }, [register]);
  useEffect(() => reset(data), [reset, data]);

  const dispatch = useDispatch();

  const { loadingGetUser, userList } = useSelector((s) => s.authorize);
  const { createFacilityLoading, updateFacilityLoading } = useSelector(
    (s) => s.quarantineFacility,
  );
  const loading = useMemo(
    () => Boolean(createFacilityLoading || updateFacilityLoading),
    [createFacilityLoading, updateFacilityLoading],
  );

  const [userOptions, setUserOptions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  useEffect(() => {
    setUserOptions(() =>
      (userList || [])
        .filter((u) => u.username.includes('kcl'))
        .map((u) => ({
          text: u.username,
          value: u.id,
        })),
    );
  }, [userList]);
  const onSelectUser = useCallback(
    (userId, userName) => {
      if (userId === '-1') {
        reset({
          username: userName,
          password: '',
        });
      }
    },
    [reset],
  );
  const disablePassword = useMemo(
    () => Boolean(selectedUserId && selectedUserId !== '-1'),
    [selectedUserId],
  );
  const disabled = useMemo(
    () =>
      !watch('name') ||
      !watch('address') ||
      watch('username')?.includes(' ') ||
      watch('password')?.includes(' ') ||
      (selectedUserId === '-1' && !watch('password')),
    [watch, selectedUserId],
  );

  const userSelectNode = useMemo(
    () => (
      <Form.Select
        fluid
        search
        required
        label="Chọn/Tạo tài khoản"
        allowAdditions
        additionLabel="Thêm mới: "
        loading={loadingGetUser}
        options={userOptions}
        value={selectedUserId}
        error={watch('username')?.includes(' ')}
        onAddItem={(_, { value }) => {
          setUserOptions((so) => [
            ...so.filter((s) => s.value !== '-1'),
            { text: value, value: '-1' },
          ]);
        }}
        onChange={(_, { value }) => {
          if (getIndexes([...value], '-').length === 4) {
            setSelectedUserId(value);
            onSelectUser(value);
          } else {
            setSelectedUserId('-1');
            onSelectUser('-1', value);
          }
        }}
      />
    ),
    [watch, loadingGetUser, userOptions, selectedUserId, onSelectUser],
  );

  const handleSubmitForm = async () => {
    const values = getValues();
    if (!data?.id) {
      try {
        await dispatch(
          createFacility({
            ...values,
            owner: {
              userId: selectedUserId !== '-1' ? selectedUserId : undefined,
              username: selectedUserId === '-1' ? values.username : undefined,
              password: selectedUserId === '-1' ? values.password : undefined,
            },
          }),
        );
      } catch (e) {
        toast.warn(e);
      }
    } else {
      try {
        await dispatch(updateFacility(values));
      } catch (e) {
        toast.warn(e);
      }
    }
    onClose();
    onSubmit();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {data?.id ? 'Cập nhật/Bổ sung thông tin' : 'Tạo'} khu cách ly
      </Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmitForm}>
          {!data?.id && (
            <>
              <Header as="h4" content="Thông tin tài khoản" />
              <Form.Group widths="equal">
                {userSelectNode}
                <Controller
                  name="password"
                  defaultValue=""
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Form.Input
                      required={selectedUserId === '-1'}
                      fluid
                      type="password"
                      label="Mật khẩu"
                      disabled={disablePassword}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Form.Group>
              <Divider />
              <Header as="h4" content="Thông tin khu cách ly" />
            </>
          )}
          <Form.Group widths="equal">
            <Controller name="id" control={control} defaultValue="" />
            <Controller
              name="name"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  required
                  fluid
                  label="Tên khu cách ly"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              name="type"
              defaultValue={0}
              control={control}
              render={({ onChange, onBlur, value }) => {
                if (!data?.id) {
                  return (
                    <Form.Select
                      required
                      fluid
                      label="Loại hình"
                      value={value}
                      options={FacilityOptions}
                      onChange={(_, { value: v }) => onChange(v)}
                      onBlur={onBlur}
                    />
                  );
                }
                return null;
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              name="contactName"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  label="Người liên hệ"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              name="contactPhone"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  label="SĐT liên hệ"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              name="address"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  required
                  fluid
                  control={AddressDetails}
                  addressName={watch('name')}
                  label="Địa chỉ"
                  initialData={
                    value || {
                      floor: '',
                      block: '',
                      streetHouseNumber: '',
                      provinceValue: '',
                      districtValue: '',
                      wardValue: '',
                    }
                  }
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
          <Form.Button
            primary
            content="Xác nhận"
            loading={loading}
            disabled={disabled || loading}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

FacilityModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
  }),
};

FacilityModal.defaultProps = {
  data: undefined,
};

export default FacilityModal;
