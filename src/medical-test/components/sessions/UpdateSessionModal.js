import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Button,
  Dimmer,
  Form,
  Header,
  Icon,
  Input,
  Label,
  Loader,
  Modal,
  Popup,
  Table,
  TextArea,
} from 'semantic-ui-react';

import { useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import { getSessionDetail } from 'medical-test/actions/session';

import { ImportantType } from 'infection-chain/utils/constants';
import SessionAvailableExamationTable from './SessionAvailableExamationTable';

const fields = ['id', 'unitId', 'description', 'examinationDetails'];

const UpdateSessionModal = (props) => {
  const { open, onClose, onSubmit, loading: fetching, id } = props;
  const dispatch = useDispatch();
  const { sessionDetail: data, getSessionDetailLoading } = useSelector(
    (s) => s.session,
  );
  const { watch, register, setValue, getValues, reset } = useForm({
    defaultValues: { ...data },
  });
  useEffect(() => {
    reset(data);
  }, [reset, data]);
  const examinationDetails = watch('examinationDetails');
  const { allExaminationDetailsAvailableForTestSessionList } = useSelector(
    (s) => s.medicalTest,
  );

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
  const numberOfCells = headerColumn().length * headerRow().length - 2;

  const [selecting, setSelecting] = useState(
    (examinationDetails || []).map((e) => e.code),
  );

  const [cells, setCells] = useState([]);
  useEffect(() => {
    if (id && open) {
      dispatch(getSessionDetail(id)).then(({ examinationDetails: exd }) => {
        setCells(
          ['Neg', ...new Array(numberOfCells), 'Pos'].map((c, i) => {
            if ((exd || []).map((ex) => ex.platePosition).includes(i + 1)) {
              return exd.find((ex) => ex.platePosition === i + 1).code;
            }
            return c;
          }),
        );
      });
    }
    // eslint-disable-next-line
  }, [dispatch, id]);

  // register
  useEffect(() => {
    fields.forEach(register);
  }, [register]);

  const handleChangeSelecting = (d) => {
    const values = [...cells];
    let index = 0;
    values.forEach((v, i) => {
      if (!values[i]) {
        values[i] = d[index];
        index += 1;
      }
    });
    setCells(values);
  };

  const handleConfirm = () => {
    setValue(
      'examinationDetails',
      [
        ...allExaminationDetailsAvailableForTestSessionList,
        ...examinationDetails,
      ]
        .filter((ex) => cells.includes(ex.code))
        .map((ex) => ({
          ...ex,
          platePosition: cells.findIndex((c) => c === ex.code) + 1,
        })),
    );
    onSubmit(getValues());
  };

  return (
    <Modal
      size="fullscreen"
      open={open}
      onClose={() =>
        dispatch(
          showConfirmModal('Dữ liệu chưa được lưu, bạn có muốn đóng?', onClose),
        )
      }
    >
      {getSessionDetailLoading && (
        <Dimmer inverted active>
          <Loader />
        </Dimmer>
      )}
      <Modal.Header>Cập nhật phiên/khay xét nghiệm</Modal.Header>
      <Modal.Content>
        <div className={`ui form ${fetching ? 'loading' : ''}`}>
          <Form.Group widths="equal">
            <Form.Field
              required
              label="Tên phiên xét nghiệm"
              control={Input}
              name="name"
              input={{ ref: register }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              label="Ghi chú"
              control={TextArea}
              value={watch('description') || ''}
              onChange={(e, { value }) => setValue('description', value)}
            />
          </Form.Group>
          <SessionAvailableExamationTable
            selecting={cells.slice(1, 95).filter((c) => c)}
            onSubmit={(d) => {
              if (!_.isEqual(d, selecting)) handleChangeSelecting(d);
            }}
          />
          <Header as="h4">
            Số mẫu hiện có trong khay:
            {cells.filter((c) => c).length - 2}
          </Header>
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
                      (j === 0 && i === 0) ||
                      (i === headerRow().length - 1 &&
                        j === headerColumn().length - 1)
                    ) {
                      return <Table.Cell key={c}>{cellValue}</Table.Cell>;
                    }
                    return (
                      <Table.Cell key={c}>
                        {cellValue ? (
                          <Popup
                            content={cellValue}
                            trigger={
                              <Label
                                size="tiny"
                                basic
                                as="a"
                                color={
                                  [
                                    ...allExaminationDetailsAvailableForTestSessionList,
                                    ...examinationDetails,
                                  ].find((ex) => ex.code === cellValue)
                                    ?.importantValue === ImportantType.IMPORTANT
                                    ? 'red'
                                    : 'green'
                                }
                                onClick={() => {
                                  dispatch(
                                    showConfirmModal(
                                      'Xóa mẫu sẽ không thêm lại được, bạn có chắc chắn?',
                                      () => {
                                        const values = [...cells];
                                        values[index] = undefined;
                                        setCells(values);
                                        setSelecting(
                                          selecting.filter(
                                            (s) => s !== cellValue,
                                          ),
                                        );
                                      },
                                    ),
                                  );
                                }}
                              >
                                {cellValue.length < 10
                                  ? cellValue
                                  : cellValue
                                      .substring(3, 6)
                                      .concat(cellValue.substring(8))}
                                <Icon name="delete" color="red" />
                              </Label>
                            }
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
          <Button primary content="Xác nhận" onClick={handleConfirm} />
        </div>
      </Modal.Content>
    </Modal>
  );
};

UpdateSessionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  id: PropTypes.string.isRequired,
};

UpdateSessionModal.defaultProps = {
  loading: false,
};

export default UpdateSessionModal;
