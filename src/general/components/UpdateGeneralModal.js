import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateCriteria,
  updateDiseaseType,
  updateInfectionType,
} from 'general/actions/general';

import { Generals } from 'general/utils/constants';
import SelectColor from 'app/components/shared/SelectColor';
import { ChainTypeOptions } from 'chain/utils/constants';

const UpdateGeneralModal = (props) => {
  const { open, onClose, onRefresh, data } = props;
  const { watch, control, reset, getValues } = useForm({ defaultValues: data });
  useEffect(() => reset(data), [reset, data]);

  const {
    selectedGeneral,
    updateDiseaseTypeLoading,
    updateInfectionTypeLoading,
    updateCriteriaLoading,
    diseaseTypeData: { data: diseaseTypeOptions },
  } = useSelector((s) => s.general);
  const loading =
    updateDiseaseTypeLoading ||
    updateInfectionTypeLoading ||
    updateCriteriaLoading;
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    const d = getValues();
    switch (selectedGeneral.value) {
      case Generals.DISEASE_TYPE: {
        await dispatch(updateDiseaseType(d));
        break;
      }
      case Generals.INFECTION_TYPE: {
        await dispatch(
          updateInfectionType({
            ...d,
            value: parseInt(d.value, 10),
          }),
        );
        break;
      }
      case Generals.CRITERIAS: {
        await dispatch(
          updateCriteria(d.categoryId, { ...d, categoryId: undefined }),
        );
        break;
      }
      default:
        break;
    }
    onClose();
    onRefresh();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {'Sửa '}
        {selectedGeneral.name.toLowerCase()}
      </Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Group widths="equal">
            <Controller name="id" control={control} />
            <Controller name="categoryId" control={control} />
            <Controller
              control={control}
              defaultValue=""
              name="name"
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  label={`Tên ${selectedGeneral.name.toLowerCase()}`}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {selectedGeneral.value === Generals.INFECTION_TYPE && (
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
            )}
            {selectedGeneral.value === Generals.INFECTION_TYPE && (
              <Controller
                name="colorCode"
                defaultValue=""
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Form.Field
                    getText
                    control={SelectColor}
                    label={`Màu ${selectedGeneral.name.toLowerCase()}`}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            )}
          </Form.Group>
          {selectedGeneral.value === Generals.INFECTION_TYPE && (
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
          )}

          <Form.Button
            primary
            loading={loading}
            disabled={!watch('name') || loading}
            content="Xác nhận"
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

UpdateGeneralModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
};

export default UpdateGeneralModal;
