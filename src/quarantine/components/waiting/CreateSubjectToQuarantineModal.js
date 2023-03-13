import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Modal,
  Form,
  Header,
} from 'semantic-ui-react';
import moment from 'moment';
import { KeyboardDatePicker } from 'app/components/shared';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import SubjectForm from 'infection-chain/components/subject/information/SubjectForm';

const CreateSubjectToQuarantineModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const dispatch = useDispatch();
  const { createSubjectLoading, processSubjectLoading } = useSelector((state) => state.subject);
  const loading = createSubjectLoading || processSubjectLoading;

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [expectedTime, setExpectedTime] = useState(null);

  useEffect(() => {
    if (expectedTime && moment(expectedTime).isValid) {
      setEndTime(expectedTime);
    } else if (startTime && moment(startTime).isValid) {
      setEndTime(moment(startTime).add(14, 'days').format());
    }
  }, [startTime, expectedTime]);

  return (
    <>
      <Modal
        open={open}
        onClose={() => dispatch(showConfirmModal('Dữ liệu chưa được lưu, bạn có muốn đóng?', onClose))}
      >
        <Modal.Header content="Thêm đối tượng vào danh sách chờ" />
        <Modal.Content>
          <div className={`ui form ${loading ? 'loading' : ''}`}>
            <Header as="h4" content="Thông tin cách ly" />
            <Form.Group widths="equal">
              <Form.Field
                required
                control={KeyboardDatePicker}
                label="Ngày bắt đầu"
                value={startTime || ''}
                onChange={(d) => {
                  setStartTime(moment(d, 'YYYY-MM-DD').format());
                }}
              />
              <Form.Field
                required
                control={KeyboardDatePicker}
                readOnly
                label="Dự kiến ngày kết thúc"
                value={moment(endTime).isValid ? endTime : null}
              />
              <Form.Field
                control={KeyboardDatePicker}
                label="Ngày chính thức kết thúc"
                value={expectedTime || ''}
                onChange={(d) => {
                  setExpectedTime(moment(d, 'YYYY-MM-DD').format());
                }}
              />
            </Form.Group>
            <Header as="h4" content="Thông tin đối tượng" />
          </div>
        </Modal.Content>
        <SubjectForm
          paddingButton
          onSubmit={(d) => {
            onSubmit({ data: d, startTime, endTime });
          }}
          loading={createSubjectLoading || loading}
        />
      </Modal>
    </>
  );
};

CreateSubjectToQuarantineModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
};

CreateSubjectToQuarantineModal.defaultProps = {
  onSubmit: () => {},
};

export default CreateSubjectToQuarantineModal;
