import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Label, Loader, Modal, Table } from 'semantic-ui-react';
import { InfoRow } from 'app/components/shared';
import { SessionStatus } from 'infection-chain/utils/constants';
import { getSessionStatus } from 'infection-chain/utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getSessionDetail } from 'medical-test/actions/session';

const DetailWithSubCodeModal = ({ open, onClose, id }) => {
  const dispatch = useDispatch();
  const getLoading = useSelector((s) => s.session.getSessionDetailLoading);

  const [data, setData] = useState(undefined);
  const [exams, setExams] = useState([]);
  useEffect(() => {
    if (id && open) {
      const getData = async () => {
        const result = await dispatch(getSessionDetail(id));
        setData(result);
        setExams(result.examinationDetails);
      };
      getData();
    }
    // eslint-disable-next-line
  }, [dispatch, id]);

  return (
    <Modal open={open} onClose={onClose}>
      {getLoading && (
        <Dimmer inverted active>
          <Loader />
        </Dimmer>
      )}
      <Modal.Header>
        <Label
          basic
          color={data?.status === SessionStatus.CREATED ? 'blue' : 'green'}
          size="large"
          content={getSessionStatus(data?.status)?.label}
        />
      </Modal.Header>
      <Modal.Content>
        <InfoRow label="Tên phiên xét nghiệm" content={data?.name ?? '...'} />
        <InfoRow label="Ghi chú" content={data?.description ?? '...'} />
        <Table fixed celled size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Mã sơ cấp</Table.HeaderCell>
              <Table.HeaderCell>Mã thứ cấp</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {exams.map((r, i) => (
              <Table.Row key={r.id}>
                <Table.Cell content={i + 1} />
                <Table.Cell
                  content={r.code?.length === 12 ? <b>{r.code}</b> : r.code}
                />
                <Table.Cell content={r.secondaryCode} />
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Modal.Content>
    </Modal>
  );
};

DetailWithSubCodeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default DetailWithSubCodeModal;
