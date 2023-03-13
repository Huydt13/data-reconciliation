/* eslint-disable react/no-array-index-key */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Label, Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCriteria,
  createDiseaseType,
  createInfectionType,
  getInfectionTypes,
} from 'general/actions/general';

import { Generals } from 'general/utils/constants';
import { FiX } from 'react-icons/fi';
import { Controller, useForm } from 'react-hook-form';
import SelectColor from 'app/components/shared/SelectColor';
import { ChainTypeOptions } from 'chain/utils/constants';

const CreateGeneralModal = (props) => {
  const { open, onClose, onRefresh } = props;

  const {
    selectedGeneral,
    createDiseaseTypeLoading,
    createInfectionTypeLoading,
    createCriteriaLoading,
    getInfectionTypesLoading,
    diseaseTypeData: { data: diseaseTypeOptions },
    infectionTypeData: { data: infectionOptions },
  } = useSelector((s) => s.general);
  const loading =
    createDiseaseTypeLoading ||
    createInfectionTypeLoading ||
    createCriteriaLoading;

  const { watch, control, getValues } = useForm();
  const [creatingList, setCreatingList] = useState(['']);

  const disabled = useMemo(() => {
    switch (selectedGeneral.value) {
      case Generals.INFECTION_TYPE:
        return Boolean(
          !watch('name') ||
            watch('value') === '' ||
            !watch('colorCode') ||
            !watch('diseaseTypeId') ||
            watch('chainType') === '',
        );
      case Generals.CRITERIAS:
        return Boolean(
          !watch('name') ||
            !watch('infectionTypeId') ||
            !watch('diseaseTypeId') ||
            creatingList.filter((n) => !n).length !== 0 ||
            loading,
        );
      case Generals.DISEASE_TYPE:
        return Boolean(creatingList.filter((n) => !n).length !== 0 || loading);
      default:
        return false;
    }
  }, [selectedGeneral, creatingList, loading, watch]);

  const dispatch = useDispatch();

  const handleAdd = (e) => {
    e.preventDefault();
    setCreatingList([...creatingList, '']);
  };
  const handleChange = (index, e) => {
    const values = [...creatingList];
    values[index] = e.target.value;
    setCreatingList(values);
  };
  const handleRemove = (e, index) => {
    e.preventDefault();
    const values = [...creatingList];
    values.splice(index, 1);
    setCreatingList(values);
  };

  const handleSubmit = async () => {
    const values = getValues();
    switch (selectedGeneral.value) {
      case Generals.INFECTION_TYPE: {
        await dispatch(
          createInfectionType({
            ...values,
            value: parseInt(values.value, 10),
          }),
        );
        break;
      }
      case Generals.CRITERIAS: {
        await dispatch(
          createCriteria({
            ...values,
            criterias: creatingList.map((c) => ({ name: c })),
          }),
        );
        break;
      }
      case Generals.DISEASE_TYPE: {
        await dispatch(createDiseaseType(creatingList));
        break;
      }
      default:
    }
    onClose();
    onRefresh();
  };

  const isDiseaseType = selectedGeneral.value === Generals.DISEASE_TYPE;
  const generalName = selectedGeneral.name.toLowerCase();

  return (
    <Modal
      size={isDiseaseType ? 'tiny' : 'small'}
      open={open}
      onClose={onClose}
    >
      <Modal.Header>{`Tạo ${generalName}`}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          {/* Create disease type fields */}
          {selectedGeneral.value === Generals.CRITERIAS && (
            <Form.Group widths="equal">
              <Controller
                name="name"
                defaultValue=""
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Input
                    required
                    fluid
                    label="Tên loại tiếp xúc"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <Controller
                name="diseaseTypeId"
                defaultValue=""
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    required
                    label="Loại bệnh"
                    options={(diseaseTypeOptions || []).map((dt) => ({
                      value: dt.id,
                      text: dt.name,
                    }))}
                    value={value}
                    onChange={(_, { value: v }) => {
                      onChange(v);
                      dispatch(
                        getInfectionTypes({
                          diseaseTypeId: v,
                          pageIndex: 0,
                          pageSize: 1000,
                        }),
                      );
                    }}
                    onBlur={onBlur}
                  />
                )}
              />
              <Controller
                name="infectionTypeId"
                defaultValue=""
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Select
                    required
                    label="Loại nhãn"
                    options={(infectionOptions || []).map((dt) => ({
                      value: dt.id,
                      text: dt.name,
                      content: (
                        <Label
                          basic
                          color={dt?.colorCode ?? 'black'}
                          content={dt?.name ?? 'F?'}
                        />
                      ),
                    }))}
                    value={value}
                    disabled={
                      !watch('diseaseTypeId') || getInfectionTypesLoading
                    }
                    loading={getInfectionTypesLoading}
                    onChange={(_, { value: v }) => onChange(v)}
                    onBlur={onBlur}
                  />
                )}
              />
            </Form.Group>
          )}
          {(selectedGeneral.value === Generals.DISEASE_TYPE ||
            selectedGeneral.value === Generals.CRITERIAS) && (
            <>
              {creatingList.map((_, i) => (
                <Form.Group key={i}>
                  <Form.Input
                    width="14"
                    required
                    label={`Tên ${generalName}`}
                    value={creatingList[i] || ''}
                    onChange={(e) => handleChange(i, e)}
                  />
                  <Form.Button
                    fluid
                    basic
                    width="2"
                    color="red"
                    label="Xóa"
                    icon={<FiX />}
                    onClick={(e) => handleRemove(e, i)}
                  />
                </Form.Group>
              ))}
              <Form.Group widths="equal">
                <Form.Button
                  color="green"
                  content={`Thêm ${generalName} khác`}
                  onClick={handleAdd}
                />
                <Form.Button
                  primary
                  floated="right"
                  loading={loading}
                  disabled={
                    creatingList.filter((n) => !n).length !== 0 || loading
                  }
                  content="Hoàn tất"
                />
              </Form.Group>
            </>
          )}
          {selectedGeneral.value === Generals.INFECTION_TYPE && (
            <>
              <Form.Group widths="equal">
                <Controller
                  name="name"
                  defaultValue=""
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Form.Input
                      required
                      fluid
                      label="Tên nhãn"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                <Controller
                  name="value"
                  defaultValue=""
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Form.Input
                      required
                      fluid
                      type="number"
                      label="Giá trị của nhãn"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                <Controller
                  name="colorCode"
                  defaultValue=""
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Form.Field
                      required
                      getText
                      control={SelectColor}
                      label="Màu nhãn"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Controller
                  name="diseaseTypeId"
                  defaultValue=""
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Form.Select
                      required
                      label="Loại bệnh"
                      options={(diseaseTypeOptions || []).map((dt) => ({
                        value: dt.id,
                        text: dt.name,
                      }))}
                      value={value}
                      onChange={(_, { value: v }) => onChange(v)}
                      onBlur={onBlur}
                    />
                  )}
                />
                <Controller
                  name="chainType"
                  defaultValue=""
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Form.Select
                      required
                      label="Loại chuỗi"
                      options={ChainTypeOptions}
                      value={value}
                      onChange={(_, { value: v }) => onChange(v)}
                      onBlur={onBlur}
                    />
                  )}
                />
                <Controller
                  name="isPositive"
                  defaultValue="false"
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Form.Checkbox
                      style={{ paddingTop: '35px' }}
                      label="Dương tính"
                      checked={value === true}
                      onChange={(_, { checked }) => onChange(checked)}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Form.Group>
              <Form.Button
                primary
                loading={loading}
                disabled={loading || disabled}
                content="Xác nhận"
              />
            </>
          )}
        </Form>
      </Modal.Content>
    </Modal>
  );
};

CreateGeneralModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default CreateGeneralModal;
