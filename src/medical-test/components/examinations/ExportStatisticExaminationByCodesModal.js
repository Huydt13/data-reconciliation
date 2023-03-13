import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Modal, Form, Button } from 'semantic-ui-react';
import ImportSampleTable from 'medical-test/components/examinations/ImportSampleTable';

import store from 'app/store';
import { useSelector, useDispatch } from 'react-redux';
import { clearExams, selectExams } from 'medical-test/actions/session';
import { exportStatisticExaminationByCodes } from 'medical-test/actions/medical-test';

const ExportStatisticExaminationByCodesModal = (props) => {
  const { open, onClose } = props;

  const dispatch = useDispatch();
  const {
    exportStatisticExaminationByCodeLoading,
  } = useSelector((state) => state.medicalTest);

  const onSubmit = async () => {
    const samples = _.flattenDeep(
      store
        .getState()
        .session.selectedRows.filter((e) => e.exams)
        .map((e) => e.exams),
    );

    if (samples && samples.length >= 0) {
      dispatch(exportStatisticExaminationByCodes(samples))
        .then(() => {
          onClose();
          dispatch(clearExams());
        });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Xuất dữ liệu chi tiết theo mã xét nghiệm</Modal.Header>
      <Modal.Content>
        <Form loading={exportStatisticExaminationByCodeLoading}>
          <Form.Field
            control={ImportSampleTable}
            onChange={(d) => {
              dispatch(selectExams(d, 1));
            }}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          labelPosition="right"
          color="green"
          icon="checkmark"
          content="Xác nhận"
          disabled={exportStatisticExaminationByCodeLoading}
          onClick={onSubmit}
        />
      </Modal.Actions>

    </Modal>
  );
};

ExportStatisticExaminationByCodesModal.defaultProps = {
  open: false,
  onClose: () => {},
};

ExportStatisticExaminationByCodesModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default ExportStatisticExaminationByCodesModal;
