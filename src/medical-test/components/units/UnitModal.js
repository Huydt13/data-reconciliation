/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
import React, { useEffect, useState } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import {
  getUnitTypes,
  createUnitType,
} from 'medical-test/actions/medical-test';

const samplingFunctionOptions = [
  'Tầm soát, giám sát, điều tra dịch, kiểm dịch, ....',
  'Điều trị F0 có triệu chứng',
  'Điều trị F0 không triệu chứng',
];
const types1 = [
  {
    value: 1,
    text: 'Cơ sở lấy mẫu',
    isCollector: true,
    isReceiver: false,
    isTester: false,
  },
  {
    value: 2,
    text: 'Cơ sở tự xét nghiệm',
    isCollector: true,
    isReceiver: false,
    isTester: true,
  },
  {
    value: 3,
    text: 'Cơ sở tham gia xét nghiệm',
    isCollector: true,
    isReceiver: true,
    isTester: true,
  },
];

const UnitModal = (props) => {
  const { open, onClose, isAdmin, initialData, onSubmit } = props;
  const { reset, watch, register, setValue, getValues } = useForm({
    // defaultValues: initialData,
  });

  useEffect(() => {
    register({ name: 'id' });
    register({ name: 'provinceValue' });
    register({ name: 'districtValue' });
    register({ name: 'wardValue' });
    register({ name: 'address' });
    register({ name: 'unitTypeId' });
    register({ name: 'isCollector' });
    register({ name: 'isReceiver' });
    register({ name: 'isTester' });
    register({ name: 'samplingFunctionType' });
    setValue('unitTypeId', initialData?.id ? initialData.unitTypeId : '');
  }, [register, initialData, setValue]);

  useEffect(() => {
    reset(initialData);
    // eslint-disable-next-line
  }, [reset, initialData?.id]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUnitTypes());
  }, [dispatch]);

  const {
    unitTypeList,
    updateUnitLoading,
    createUnitLoading,
    createErrorMessage,
    createUnitTypeLoading,
    createMedicalTestUnitLoading,
    updateMedicalTestUnitLoading,
  } = useSelector((state) => state.medicalTest);
  const allowToSubmit =
    watch('unitTypeId') &&
    watch('name') &&
    watch('code') &&
    watch('code')?.length === 3 &&
    watch('address') &&
    watch('provinceValue') &&
    watch('districtValue') &&
    watch('wardValue');

  const [selectingType, setSelectingType] = useState({});
  useEffect(() => {
    if (initialData?.id) {
      if (
        initialData.isCollector &&
        !initialData.isReceiver &&
        !initialData.isTester
      ) {
        setSelectingType(types1[0]);
      }
      if (
        initialData.isCollector &&
        !initialData.isReceiver &&
        initialData.isTester
      ) {
        setSelectingType(types1[1]);
      }
      if (
        initialData.isCollector &&
        initialData.isReceiver &&
        initialData.isTester
      ) {
        setSelectingType(types1[2]);
      }
    }
  }, [initialData]);
  useEffect(() => {
    const { isCollector, isReceiver, isTester } = selectingType;
    setValue('isCollector', isCollector);
    setValue('isReceiver', isReceiver);
    setValue('isTester', isTester);
  }, [selectingType, setValue]);

  const handleCreateUnitType = async (e, { value }) => {
    const unitType = await dispatch(createUnitType({ name: value }));
    dispatch(getUnitTypes());
    setValue('unitTypeId', unitType.id);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {!initialData?.id ? 'Tạo mới' : 'Cập nhật'} cơ sở xét nghiệm
      </Modal.Header>
      <Modal.Content>
        <Form
          loading={
            createMedicalTestUnitLoading ||
            updateMedicalTestUnitLoading ||
            createUnitTypeLoading ||
            updateUnitLoading ||
            createUnitLoading
          }
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
                <Form.Field
                  control={Input}
                  type="email"
                  label="Email"
                  name="email"
                  input={{ ref: register }}
                />
              </Form.Group>
            </>
          )}
          {initialData?.id && isAdmin && (
            <>
              <Header as="h4" content="Thông tin tài khoản" />
              <Form.Group widths="equal">
                <Form.Field
                  required
                  control={Input}
                  label="Tài khoản cơ sở"
                  name="username"
                  input={{ ref: register }}
                  readOnly
                />
              </Form.Group>
            </>
          )}
          <Header as="h4" content="Thông tin cơ sở" />
          <Form.Group widths="equal">
            <Form.Field
              search
              deburr
              required
              clearable
              label="Loại cơ sở"
              control={Select}
              options={unitTypeList.map((ut) => ({
                value: ut.id,
                text: ut.name,
              }))}
              value={watch('unitTypeId') || 0}
              onChange={(e, { value }) => setValue('unitTypeId', value)}
              allowAdditions
              additionLabel="Khác: "
              onAddItem={handleCreateUnitType}
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
            {isAdmin ? (
              <Form.Field
                required
                control={Input}
                label="Mã cơ sở"
                name="code"
                input={{ ref: register, maxLength: '3' }}
                onChange={(e, { value }) => {
                  setValue('code', value);
                }}
                onBlur={() => {
                  setValue('code', watch('code').toUpperCase());
                }}
                error={
                  watch('code')?.length !== 3 && {
                    content: 'Mã cơ sở phải gồm 3 ký tự',
                  }
                }
                disabled={Boolean(initialData?.id)}
              />
            ) : (
              <Form.Field
                required
                readOnly
                control={Input}
                label="Mã cơ sở"
                name="code"
                input={{ ref: register, maxLength: '3' }}
              />
            )}
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
              isMedicalTestZone
              initialData={{
                provinceValue: initialData?.provinceValue ?? '',
                districtValue: initialData?.districtValue ?? '',
                wardValue: initialData?.wardValue ?? '',
                streetHouseNumber: initialData?.address ?? '',
              }}
              control={ContactLocationAddress}
              onChange={(d) => {
                const {
                  wardValue,
                  districtValue,
                  provinceValue,
                  streetHouseNumber,
                } = d;
                setValue('wardValue', wardValue);
                setValue('districtValue', districtValue);
                setValue('provinceValue', provinceValue);
                setValue('address', streetHouseNumber);
              }}
            />
          </Form.Group>
          {isAdmin && (
            <Form.Group widths="equal">
              <Form.Field
                required
                clearable
                label="Chức năng của cơ sở"
                control={Select}
                options={types1}
                value={selectingType?.value ?? 0}
                onChange={(e, { value }) =>
                  setSelectingType(types1.find((t) => t.value === value))
                }
              />
              <Form.Field
                label="Loại chức năng lấy mẫu"
                control={Select}
                options={samplingFunctionOptions.map((e) => ({
                  text: e,
                  value: e,
                }))}
                value={watch('samplingFunctionType') || ''}
                onChange={(_, { value }) =>
                  setValue('samplingFunctionType', value)
                }
              />
            </Form.Group>
          )}
          <Message error content={createErrorMessage} />
          <Button
            loading={
              createMedicalTestUnitLoading || updateMedicalTestUnitLoading
            }
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

UnitModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    unitTypeId: PropTypes.string,
    address: PropTypes.string,
    isCollector: false,
    isReceiver: false,
    isTester: false,
  }),
  onSubmit: PropTypes.func,
};

UnitModal.defaultProps = {
  isAdmin: false,
  initialData: {},
  onSubmit: () => {},
};

export default UnitModal;
