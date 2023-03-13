/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Form,
  Input,
  Modal,
  Select,
} from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FiX } from 'react-icons/fi';
import styled from 'styled-components';
import { getAvailableUnitsToPublish } from 'medical-test/actions/medical-test';
import SelectYear from 'app/components/shared/SelectYear';
import moment from 'moment';

const StyledFormGroup = styled(Form.Group)` margin-bottom: 0 !important; `;
const PublishBatchUnitModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const {
    diseaseList,
    getAvailableUnitToPublishLoading,
    availableUnitToPublishList,
    publishBatchUnitLoading,
  } = useSelector((state) => state.medicalTest);
  const loading = getAvailableUnitToPublishLoading || publishBatchUnitLoading;
  const [units, setUnits] = useState([{ unitId: '', unitCode: '', quantity: 0 }]);
  const {
    watch,
    setValue,
    register,
    handleSubmit,
  } = useForm();
  useEffect(() => {
    register({ name: 'units' });
    register({ name: 'diseaseCode' });
    register({ name: 'year' });
    setValue('year', moment().format('YYYY'));
  }, [register, setValue]);
  const handleAdd = (e) => {
    e.preventDefault();
    setUnits([...units, { unitId: '', unitCode: '', quantity: 0 }]);
  };
  const handleRemove = (e, index) => {
    e.preventDefault();
    const values = [...units];
    values.splice(index, 1);
    setUnits(values);
  };
  const handleQuantityChange = (index, e) => {
    const values = [...units];
    values[index][e.target.name] = parseInt(e.target.value, 10);
    setUnits(values);
  };
  const handleUnitChange = (index, value) => {
    const values = [...units];
    values[index].unitId = availableUnitToPublishList.find((p) => p.unitCode === value).unitId;
    values[index].unitCode = value;
    setUnits(values);
  };
  useEffect(() => {
    setValue('units', units);
  }, [units, setValue]);
  const dispatch = useDispatch();
  const diseaseCode = watch('diseaseCode');
  const year = watch('year');
  useEffect(() => {
    if (year && diseaseCode) {
      dispatch(getAvailableUnitsToPublish(diseaseCode, year));
    }
  }, [dispatch, diseaseCode, year]);
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Cấp mã cho nhiều cơ sở</Modal.Header>
      <Modal.Content>
        <Form loading={loading} onSubmit={handleSubmit(onSubmit)}>
          <Form.Group widths="equal">
            <Form.Field
              required
              search
              deburr
              label="Loại bệnh"
              control={Select}
              options={diseaseList.map((c) => ({
                key: c.id,
                text: `${c.name} - Mã bệnh: ${c.code}`,
                value: c.code,
              }))}
              onChange={(e, { value }) => setValue('diseaseCode', value)}
            />
            <SelectYear onChange={(y) => setValue('year', y)} />
          </Form.Group>
          {Boolean(diseaseCode) && Boolean(year) && units.map((u, i) => (
            <StyledFormGroup key={`${u.unitId}-${i}`}>
              <Form.Field
                width="8"
                required
                search
                deburr
                clearable
                label="Cơ sở"
                control={Select}
                options={availableUnitToPublishList.map((unit) => ({
                  key: unit.unitId,
                  text: unit.name,
                  value: unit.unitCode,
                  disabled: units.map((un) => un.unitCode).includes(unit.unitCode),
                }))}
                value={units[i].unitCode}
                onChange={(e, { value }) => handleUnitChange(i, value)}
              />
              <Form.Field
                width="7"
                required
                type="number"
                name="quantity"
                control={Input}
                label={`Số lượng có thể cấp: ${availableUnitToPublishList.find((unit) => unit.unitCode === units[i].unitCode)?.count ?? ''}`}
                input={{ max: availableUnitToPublishList.find((unit) => unit.unitCode === units[i].unitCode)?.count }}
                value={units[i].quantity || ''}
                onChange={(e) => handleQuantityChange(i, e)}
              />
              <Form.Group>
                <Form.Button
                  label="Xoá"
                  basic
                  color="red"
                  icon={<FiX />}
                  title="Xoá"
                  onClick={(e) => handleRemove(e, i)}
                />
              </Form.Group>
            </StyledFormGroup>
          ))}
          <>
            {Boolean(diseaseCode) && (
              <Button
                color="green"
                content="Thêm cơ sở"
                onClick={(e) => handleAdd(e)}
              />
            )}
            <Button primary content="Xác nhận" disabled={units.filter((u) => !u.unitId).length !== 0} />
          </>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

PublishBatchUnitModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default PublishBatchUnitModal;
