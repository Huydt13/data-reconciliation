import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { toast } from 'react-toastify';

import { Button, Form, Modal } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { sendTransport } from 'medical-test/actions/transport';

import { formatToTime } from 'app/utils/helpers';

import { InfoRow } from 'app/components/shared';
import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';

const SendTransportModal = ({ open, onClose, data, getData }) => {
  const dispatch = useDispatch();

  const loading = useSelector((s) => s.transport.sendTransportLoading);

  const [sendingTime, setSendingTime] = useState(moment());

  const onSend = async () => {
    if (moment(sendingTime).isBefore(moment(data.dateCreated))) {
      toast.warn(
        `Thời gian chuyển mẫu phải sau ${formatToTime(data.dateCreated)}`,
      );
    } else if (moment(sendingTime).isAfter(moment())) {
      toast.warn(`Thời gian chuyển mẫu phải trước ${formatToTime(moment())}`);
    } else {
      await dispatch(sendTransport({ id: data.id, sendingTime }));
      onClose();
      getData();
    }
  };

  return (
    <Modal size="small" open={open}>
      <Modal.Header>Xác nhận chuyển mẫu</Modal.Header>
      <Modal.Content>
        <div className="ui form">
          <InfoRow
            label="Thời gian tạo phiên"
            content={formatToTime(data?.dateCreated ?? moment())}
          />
          <Form.Field
            required
            isHavingTime
            label="Thời gian chuyển mẫu"
            control={KeyboardDateTimePicker}
            value={sendingTime}
            onChange={(date) => setSendingTime(moment(date).toJSON())}
            disabledDays={[
              {
                before: moment(data?.dateCreated).toDate(),
                after: moment().toDate(),
              },
            ]}
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Đóng"
          labelPosition="right"
          icon="x"
          onClick={onClose}
        />
        <Button
          positive
          labelPosition="right"
          icon="arrow up"
          content="Chuyển mẫu"
          loading={loading}
          disabled={loading}
          onClick={onSend}
        />
      </Modal.Actions>
    </Modal>
  );
};

SendTransportModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  getData: PropTypes.func,
  data: PropTypes.shape({
    id: PropTypes.string,
    dateCreated: PropTypes.string,
  }),
};

SendTransportModal.defaultProps = {
  open: false,
  onClose: () => {},
  getData: () => {},
  data: {},
};

export default SendTransportModal;
