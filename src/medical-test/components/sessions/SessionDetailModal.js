import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dimmer,
  Label, Loader, Modal, Popup, Table,
} from 'semantic-ui-react';
import { InfoRow } from 'app/components/shared';
import { ImportantType, SessionStatus } from 'infection-chain/utils/constants';
import { getSessionStatus } from 'infection-chain/utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getSessionDetail } from 'medical-test/actions/session';

const SessionDetailModal = (props) => {
  const { open, onClose, id } = props;
  const { sessionDetail: data, getSessionDetailLoading } = useSelector((s) => s.session);
  const dispatch = useDispatch();
  useEffect(() => {
    if (id && open) {
      dispatch(getSessionDetail(id));
    }
  }, [dispatch, id, open]);
  const headerColumn = () => {
    const columns = [];
    for (let index = 1; index <= 12; index += 1) {
      columns.push(index);
    }
    return columns;
  };
  const headerRow = () => {
    const rows = [];
    for (
      let index = 'A'.charCodeAt(0);
      index <= 'H'.charCodeAt(0);
      index += 1
    ) {
      rows.push(String.fromCharCode(index));
    }
    return rows;
  };
  const { examinationDetails } = data || { examinationDetails: [] };
  const numberOfCells = headerColumn().length * headerRow().length - 2;
  const cells = ['Neg', ...new Array(numberOfCells), 'Pos'].map((c, i) => {
    if (
      (examinationDetails || []).map((ex) => ex.platePosition).includes(i + 1)
    ) {
      return examinationDetails.find((ex) => ex.platePosition === i + 1).code;
    }
    return c;
  });
  return (
    <Modal open={open} onClose={onClose} size="fullscreen">
      {getSessionDetailLoading && (
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
        <Table fixed definition celled size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              {headerColumn().map((c) => (
                <Table.HeaderCell key={c}>{c}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {headerRow().map((r, i) => (
              <Table.Row key={r}>
                <Table.Cell>{r}</Table.Cell>
                {headerColumn().map((c, j) => {
                  const index = j * headerRow().length + i;
                  const cellValue = cells[`${index}`];
                  if (
                    (j === 0 && i === 0)
                    || (i === headerRow().length - 1
                      && j === headerColumn().length - 1)
                  ) {
                    return <Table.Cell key={c}>{cellValue}</Table.Cell>;
                  }
                  return (
                    <Table.Cell key={c}>
                      {cellValue ? (
                        <Popup
                          content={cellValue}
                          trigger={(
                            <Label
                              size="tiny"
                              basic
                              as="a"
                              color={examinationDetails.find((ex) => ex.code === cellValue)
                                .importantValue === ImportantType.IMPORTANT
                                ? 'red'
                                : 'green'}
                            >
                              {cellValue.length < 10
                                ? cellValue
                                : cellValue
                                  .substring(3, 6)
                                  .concat(cellValue.substring(8))}
                            </Label>
                          )}
                        />
                      ) : (
                        ''
                      )}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Modal.Content>
    </Modal>
  );
};

SessionDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default SessionDetailModal;
