import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import { exportSubjectList } from 'infection-chain/actions/subject';
import { getInfectionTypes } from 'general/actions/general';

const ExportSubjectsModal = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const { watch, control, getValues } = useForm();

  const { exportLoading } = useSelector((s) => s.subject);
  const {
    getDiseaseTypesLoading,
    getInfectionTypesLoading,
    diseaseTypeData: { data: diseaseTypeOptions },
    infectionTypeData: { data: infectionTypeOptions },
  } = useSelector((s) => s.general);

  const handleSubmit = async () => {
    const { diseaseTypeId, infectionTypeId } = getValues();
    if (!diseaseTypeId) {
      dispatch(
        showConfirmModal('Chưa chọn loại bệnh, vẫn xuất file?', async () => {
          await dispatch(exportSubjectList());
          onClose();
        }),
      );
    } else if (!infectionTypeId) {
      dispatch(
        showConfirmModal('Chưa chọn loại nhãn, vẫn xuất file?', async () => {
          await dispatch(exportSubjectList({ diseaseTypeId }));
          onClose();
        }),
      );
    } else {
      await dispatch(exportSubjectList({ diseaseTypeId, infectionTypeId }));
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Xuất danh sách đối tượng</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Controller
              name="diseaseTypeId"
              defaultValue=""
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Form.Select
                  clearable
                  label="Loại bệnh"
                  loading={getDiseaseTypesLoading}
                  options={(diseaseTypeOptions || []).map((dt) => ({
                    value: dt.id,
                    text: dt.name,
                  }))}
                  value={value}
                  onChange={(_, { value: diseaseTypeId }) => {
                    onChange(diseaseTypeId);
                    dispatch(
                      getInfectionTypes({
                        diseaseTypeId,
                        pageSize: 1000,
                        pageIndex: 0,
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
                  clearable
                  disabled={!watch('diseaseTypeId')}
                  label="Loại nhãn"
                  loading={getInfectionTypesLoading}
                  options={(infectionTypeOptions || []).map((it) => ({
                    value: it.id,
                    text: it.name,
                  }))}
                  value={value}
                  onChange={(_, { value: v }) => onChange(v)}
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
          loading={exportLoading}
          disabled={exportLoading}
          onClick={handleSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
};

ExportSubjectsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExportSubjectsModal;
