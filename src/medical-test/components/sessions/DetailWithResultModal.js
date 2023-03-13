import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Form, Loader, Modal } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { getSessionDetail } from 'medical-test/actions/session';

import SessionUpdateExaminationTable from './SessionUpdateExaminationTable';

const DetailWithResultModal = (props) => {
  const { open, onClose, id, loading: fetching } = props;
  const { sessionDetail: data, getSessionDetailLoading } = useSelector(
    (s) => s.session,
  );
  const dispatch = useDispatch();

  const [currentData, setCurrentData] = useState([]);
  useEffect(() => {
    if (id && open) {
      dispatch(getSessionDetail(id)).then(({ examinationDetails: exd }) => {
        setCurrentData(exd);
      });
    }
    // eslint-disable-next-line
  }, [dispatch, id]);
  const { getUnitInfoLoading } = useSelector((state) => state.medicalTest);

  const loading = getUnitInfoLoading || fetching;
  return (
    <Modal size="fullscreen" open={open} onClose={onClose}>
      {getSessionDetailLoading && (
        <Dimmer inverted active>
          <Loader />
        </Dimmer>
      )}
      <Modal.Header>
        {`Chi tiết phiên
        ${data?.name ?? ''}`}
      </Modal.Header>
      <Modal.Content scrolling>
        <div className={`ui form ${loading ? 'loading' : ''}`}>
          <Form.Group widths="equal">
            <Form.Field
              updatable={false}
              control={SessionUpdateExaminationTable}
              data={currentData}
            />
          </Form.Group>
        </div>
      </Modal.Content>
    </Modal>
  );
};

DetailWithResultModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  id: PropTypes.string.isRequired,
};

DetailWithResultModal.defaultProps = {
  loading: false,
};

export default DetailWithResultModal;
