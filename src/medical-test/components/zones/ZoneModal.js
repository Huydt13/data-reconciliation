import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Modal,
  Select,
  Header,
  Message,
} from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import ContactLocationAddress from 'contact/components/contact-location/ContactLocationAddress';
import { useSelector } from 'react-redux';

const typeOptions = [
  { key: 2, value: 2, text: 'Cơ sở lấy mẫu' },
  { key: 1, value: 1, text: 'Cơ sở xét nghiệm' },
];

const ZoneModal = (props) => {
  const {
    open,
    onClose,
    initialData,
    onSubmit,
  } = props;
  const {
    reset,
    watch,
    register,
    setValue,
    getValues,
  } = useForm({
    // defaultValues: initialData,
  });

  useEffect(() => {
    register({ name: 'id' });
    register({ name: 'address' });
    register({ name: 'type' });
    setValue('type', initialData?.id ? initialData.type : '');
  }, [register, initialData, setValue]);

  useEffect(() => {
    reset(initialData);
    // eslint-disable-next-line
  }, [reset, initialData?.id]);

  const {
    createErrorMessage,
    createMedicalTestZoneLoading,
    updateMedicalTestZoneLoading,
  } = useSelector((state) => state.medicalTest);
  const allowToSubmit = watch('type')
  && watch('name')
  && watch('prefix')
  && watch('prefix')?.length === 3
  && watch('address')?.provinceValue
  && watch('address')?.districtValue
  && watch('address')?.wardValue;

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {!initialData?.id ? 'Tạo mới' : 'Cập nhật'}
        {' '}
        cơ sở xét nghiệm
      </Modal.Header>
      <Modal.Content>
        <Form
          loading={createMedicalTestZoneLoading || updateMedicalTestZoneLoading}
          error={createErrorMessage.length !== 0}
          onSubmit={() => onSubmit(getValues())}
        >
          {!initialData?.id && (
            <>
              <Header as="h4" content="Thông tin tài khoản" />
              <Form.Group widths="equal">
                <Form.Field
                  required
                  control={Input}
                  label="Tài khoản cơ sở"
                  name="username"
                  input={{ ref: register }}
                />
                <Form.Field
                  required
                  control={Input}
                  type="password"
                  label="Mật khẩu"
                  name="password"
                  input={{ ref: register }}
                />
              </Form.Group>
            </>
          )}
          <Header as="h4" content="Thông tin cơ sở" />
          <Form.Group widths="equal">
            <Form.Field
              required
              clearable
              label="Loại cơ sở"
              control={Select}
              options={typeOptions}
              value={watch('type') || 0}
              onChange={(e, { value }) => setValue('type', value)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Input}
              label="Tên cơ sở"
              name="name"
              input={{ ref: register }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Input}
              label="Mã cơ sở"
              name="prefix"
              input={{ ref: register, maxLength: '3' }}
              onChange={(e, { value }) => {
                setValue('prefix', value);
              }}
              onBlur={() => {
                setValue('prefix', watch('prefix').toUpperCase());
              }}
              error={
                watch('prefix')?.length !== 3 && {
                  content: 'Mã cơ sở phải gồm 3 ký tự',
                }
              }
            />
            <Form.Field
              control={Input}
              label="Người liên hệ"
              name="contactName"
              input={{ ref: register }}
            />
            <Form.Field
              control={Input}
              label="Số điện thoại"
              name="contactPhone"
              input={{ ref: register }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              label="Địa chỉ"
              isMedicalTestZone
              initialData={initialData?.address ?? {}}
              control={ContactLocationAddress}
              onChange={(d) => setValue('address', d)}
            />
          </Form.Group>
          <Message error content={createErrorMessage} />
          <Button
            loading={createMedicalTestZoneLoading || updateMedicalTestZoneLoading}
            primary
            disabled={!allowToSubmit}
          >
            Xác nhận
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

ZoneModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.number,
    address: PropTypes.shape({
      floor: PropTypes.string,
      block: PropTypes.string,
      streetHouseNumber: PropTypes.string,
      provinceValue: PropTypes.string,
      districtValue: PropTypes.string,
      wardValue: PropTypes.string,
    }),
  }),
  onSubmit: PropTypes.func,
};

ZoneModal.defaultProps = {
  initialData: {},
  onSubmit: () => {},
};

export default ZoneModal;
