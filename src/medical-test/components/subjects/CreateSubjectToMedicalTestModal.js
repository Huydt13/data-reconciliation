import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Modal, Select, Form, Header } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import SubjectForm from 'infection-chain/components/subject/information/SubjectForm';
import { useAuth } from 'app/hooks';

const CreateSubjectToMedicalTestModal = (props) => {
  const { open, onClose, onSubmit } = props;

  const dispatch = useDispatch();
  const { createSubjectLoading, processSubjectLoading } = useSelector(
    (state) => state.subject,
  );
  const {
    unitInfo,
    prefixList,
    createAssignLoading,
    getPrefixesLoading,
    createMedicalTestLoading,
    mergeProfileLoading,
    createProfileFromExaminationLoading,
  } = useSelector((state) => state.medicalTest);
  const loading =
    createSubjectLoading ||
    processSubjectLoading ||
    createMedicalTestLoading ||
    getPrefixesLoading ||
    mergeProfileLoading ||
    createProfileFromExaminationLoading ||
    createAssignLoading;

  const { isAdmin } = useAuth();
  const [unitId, setUnitId] = useState('');

  return (
    <>
      <Modal
        open={open}
        onClose={() =>
          dispatch(
            showConfirmModal(
              'Dữ liệu chưa được lưu, bạn có muốn đóng?',
              onClose,
            ),
          )
        }
      >
        <Modal.Header content="Chỉ định đối tượng xét nghiệm - mẫu đơn" />
        {isAdmin && (
          <Modal.Content style={{ padding: '1rem' }}>
            <Header as="h4" content="Chỉ định cơ sở lấy mẫu" />
            <div className={`ui form ${loading ? 'loading' : ''}`}>
              <Form.Field
                required
                label="Tên cơ sở"
                control={Select}
                value={unitId}
                options={prefixList.map((pr) => ({
                  key: pr.id,
                  text: pr.name,
                  value: pr.id,
                }))}
                onChange={(e, { value }) => {
                  setUnitId(value);
                }}
              />
            </div>
          </Modal.Content>
        )}
        <SubjectForm
          paddingButton
          loading={loading}
          disableSubmit={isAdmin && !unitId}
          onSubmit={(d) => {
            onSubmit({ data: d, unitId: unitId || unitInfo.id });
          }}
        />
      </Modal>
    </>
  );
};

CreateSubjectToMedicalTestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
};

CreateSubjectToMedicalTestModal.defaultProps = {
  onSubmit: () => {},
};

export default CreateSubjectToMedicalTestModal;
