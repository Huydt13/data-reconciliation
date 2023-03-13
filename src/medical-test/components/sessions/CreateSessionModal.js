import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FiPenTool, FiX } from 'react-icons/fi';
import {
  Button,
  Form,
  Header,
  Icon,
  Input,
  Label,
  Modal,
  Popup,
  Table,
  TextArea,
} from 'semantic-ui-react';

import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';

import { showConfirmModal } from 'app/actions/global';
import { IconButton } from 'app/components/shared/data-table/Elements';
import { getPlateAutoFill } from 'medical-test/actions/session';
import { ImportantType } from 'infection-chain/utils/constants';
import SessionAvailableExamationTable from './SessionAvailableExamationTable';

const fields = ['id', 'unitId', 'description', 'examinationDetails'];

const CreateSessionModal = (props) => {
  const { open, onClose, onSubmit, loading: fetching } = props;
  const { watch, register, setValue, getValues } = useForm();

  const {
    unitInfo,
    allExaminationDetailsAvailableForTestSessionList,
    getAllExaminationDetailsAvailableForTestSessionLoading,
  } = useSelector((s) => s.medicalTest);

  // process add/remove code to plate
  const [selecting, setSelecting] = useState([]);
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
  const [cells, setCells] = useState([
    'Neg',
    ...new Array(numberOfCells),
    'Pos',
  ]);

  useEffect(() => {
    fields.forEach(register);
    setValue('unitId', unitInfo?.id);
    setValue('examinationDetails', []);
  }, [register, setValue, unitInfo]);

  const dispatch = useDispatch();
  const [autoFill, setAutoFill] = useState(false);

  const getPlateAutoFillLoading = useSelector(
    (state) => state.session.getPlateAutoFillLoading,
  );

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

  const handleAutoFill = () => {
    if (autoFill) {
      setCells(['Neg', ...new Array(numberOfCells), 'Pos']);
      setSelecting([]);
      setAutoFill((oldAutoFill) => !oldAutoFill);
    } else {
      dispatch(getPlateAutoFill()).then((res) => {
        const result = res.map((r) => r.code);
        if (result.length > 0) {
          setCells([
            'Neg',
            ...result,
            ...new Array(numberOfCells - result.length),
            'Pos',
          ]);
          setAutoFill((oldAutoFill) => !oldAutoFill);
        } else {
          toast.warn('Không tìm thấy mẫu phù hợp để bỏ vào khay');
        }
      });
    }
  };

  const handleConfirm = () => {
    if (!watch('name')) {
      toast.warn('Chưa nhập tên phiên');
    }
    if (cells.filter((c) => c).length <= 2) {
      toast.warn('Chưa chọn mẫu');
    }
    if (watch('name') && cells.filter((c) => c).length > 2) {
      setValue(
        'examinationDetails',
        allExaminationDetailsAvailableForTestSessionList
          .filter((ex) => cells.includes(ex.code))
          .map((ex) => ({
            ...ex,
            platePosition: cells.findIndex((c) => c === ex.code) + 1,
          })),
      );
      onSubmit(getValues());
    }
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
      <Modal.Header>Tạo mới phiên xét nghiệm</Modal.Header>
      <Modal.Content>
        <div
          className={`ui form ${
            fetching ||
            getPlateAutoFillLoading ||
            getAllExaminationDetailsAvailableForTestSessionLoading
              ? 'loading'
              : ''
          }`}
        >
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
          <Table fixed celled size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <IconButton
                    basic
                    color={!autoFill ? 'green' : 'red'}
                    icon={!autoFill ? <FiPenTool /> : <FiX />}
                    onClick={handleAutoFill}
                  />
                </Table.HeaderCell>
                {headerColumn().map((c) => (
                  <Table.HeaderCell key={c}>{c}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {headerRow().map((r, i) => (
                <Table.Row key={r}>
                  <Table.Cell>
                    <b>{r}</b>
                  </Table.Cell>
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
                                  allExaminationDetailsAvailableForTestSessionList.find(
                                    (ex) => ex.code === cellValue,
                                  )?.importantValue === ImportantType.IMPORTANT
                                    ? 'red'
                                    : 'green'
                                }
                                onClick={() => {
                                  const values = [...cells];
                                  values[index] = undefined;
                                  setCells(values);
                                  setSelecting(
                                    selecting.filter((s) => s !== cellValue),
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
          <Button
            primary
            content="Tạo phiên xét nghiệm"
            onClick={handleConfirm}
          />
        </div>
      </Modal.Content>
    </Modal>
  );
};

CreateSessionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  data: PropTypes.shape({
    id: PropTypes.string,
    examinationDetails: PropTypes.arrayOf(PropTypes.shape({})),
  }),
};

CreateSessionModal.defaultProps = {
  data: {},
  loading: false,
};

export default CreateSessionModal;
