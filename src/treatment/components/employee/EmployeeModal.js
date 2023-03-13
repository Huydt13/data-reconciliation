import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { createEmployee, updateEmployeeById } from 'treatment/actions/employee';

import { AddressDetails } from 'app/components/shared';

const EmployeeModal = ({ open, onClose, data, getData }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm({ defaultValues: data });
  useEffect(() => reset(data), [reset, data]);

  const facilityInfo = useSelector((s) => s.treatment.facility.facilityInfo);
  const createLoading = useSelector(
    (s) => s.treatment.employee.createEmployeeLoading,
  );
  const updateLoading = useSelector(
    (s) => s.treatment.employee.updateEmployeeByIdLoading,
  );

  const employeeTypeList = useSelector(
    (s) => s.treatment.employeeType.employeeTypeList,
  );
  const getEmployeeTypesLoading = useSelector(
    (s) => s.treatment.employeeType.getEmployeeTypesLoading,
  );

  const onSubmit = async (d) => {
    await dispatch(
      !data.id
        ? createEmployee({
            ...d,
            userInformation: { username: d.username, password: d.password },
            username: undefined,
            password: undefined,
            facilityId: facilityInfo.id,
          })
        : updateEmployeeById(d),
    );
    onClose();
    getData();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {!data.id
          ? 'Tạo tài khoản cho cán bộ y tế'
          : 'Cập nhật thông tin cán bộ y tế'}
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Controller control={control} defaultValue="" name="id" />
          {/* {!data.id && (
            <Form.Group widths="equal">
              <Controller
                control={control}
                defaultValue=""
                name="username"
                render={({ onChange, onBlur, value }) => (
                  <Form.Input
                    fluid
                    label="Tên tài khoản"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <Controller
                control={control}
                defaultValue=""
                name="password"
                render={({ onChange, onBlur, value }) => (
                  <Form.Input
                    fluid
                    type="password"
                    label="Mật khẩu"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </Form.Group>
          )} */}
          <Form.Group>
            <Controller
              control={control}
              defaultValue=""
              name="name"
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  width={4}
                  label="Họ và tên"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="code"
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  width={4}
                  label="Mã cán bộ"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              name="employeeTypeId"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  fluid
                  search
                  deburr
                  clearable
                  width={8}
                  loading={getEmployeeTypesLoading}
                  options={employeeTypeList.map((e) => ({
                    value: e.id,
                    text: e.description,
                  }))}
                  label="Chức năng"
                  value={value}
                  onChange={(_, { value: v }) => onChange(v)}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              name="phone"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  type="number"
                  label="Số điện thoại"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              name="email"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  label="Email"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              name="cccd"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  label="Căn cước công dân"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              name="cmnd"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  label="Chứng minh nhân dân"
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
              defaultValue={{}}
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  fluid
                  control={AddressDetails}
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
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          loading={createLoading || updateLoading}
          disabled={createLoading || updateLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

EmployeeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

export default EmployeeModal;
