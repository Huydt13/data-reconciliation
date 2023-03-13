/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Modal,
  Select,
} from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import SelectYear from 'app/components/shared/SelectYear';
import moment from 'moment';

const CreateCodeModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const {
    watch,
    setValue,
    register,
    getValues,
  } = useForm();

  useEffect(() => {
    register({ name: 'unitId' });
    register({ name: 'unitCode' });
    register({ name: 'diseaseCode' });
    register({ name: 'year' });
    setValue('year', moment().format('YYYY'));
  }, [register, setValue]);

  const { prefixList, diseaseList, createMedicalTestCodeLoading } = useSelector((state) => state.medicalTest);

  const allowToSubmit = watch('unitId') && watch('diseaseCode') && watch('quantity');

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo mã xét nghiệm</Modal.Header>
      <Modal.Content>
        <Form loading={createMedicalTestCodeLoading} onSubmit={() => onSubmit(getValues())}>
          <Form.Group widths="equal">
            <Form.Field
              required
              search
              deburr
              clearable
              label="Tên cơ sở"
              control={Select}
              value={watch('unitId') || ''}
              options={prefixList.map((p) => ({
                key: p.id,
                text: p.name,
                value: p.id,
              }))}
              onChange={(e, { value }) => {
                setValue('unitId', value);
                setValue(
                  'unitCode',
                  prefixList.find((p) => p.id === value).code,
                );
              }}
            />
            <Form.Field
              required
              search
              deburr
              clearable
              label="Loại bệnh"
              control={Select}
              options={diseaseList.map((c) => ({
                key: c.id,
                text: `${c.name} - Mã bệnh: ${c.code}`,
                value: c.code,
              }))}
              onChange={(e, { value }) => setValue('diseaseCode', value)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              type="number"
              control={Input}
              label="Số lượng"
              name="quantity"
              input={{ ref: register }}
            />
            <SelectYear onChange={(year) => setValue('year', year)} />
          </Form.Group>
          <Button primary disabled={!allowToSubmit}>
            Xác nhận
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

CreateCodeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    notes: PropTypes.string,
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

CreateCodeModal.defaultProps = {
  initialData: {},
  onSubmit: () => {},
};

export default CreateCodeModal;
