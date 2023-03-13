import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Input, Modal, Table } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { getSessionDetail, updateSession } from 'medical-test/actions/session';

const UpdateWithSubCodeModal = ({ open, onClose, id, getData }) => {
  const { control, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();

  const getDetailLoading = useSelector(
    (s) => s.session.getSessionDetailLoading,
  );
  const updateLoading = useSelector((s) => s.session.updateSessionLoading);

  const [data, setData] = useState(undefined);
  const [exams, setExams] = useState([]);
  useEffect(() => {
    if (id && open) {
      const getDetail = async () => {
        const result = await dispatch(getSessionDetail(id));
        setData(result);
        setExams(result.examinationDetails);
      };
      getDetail();
    }
    // eslint-disable-next-line
  }, [dispatch, id]);
  useEffect(() => {
    reset(data);
  }, [reset, data]);

  const inputRefs = useRef([]);

  const onSubmit = async (d) => {
    await dispatch(updateSession({ ...data, ...d, examinationDetails: exams }));
    onClose();
    getData();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Cập nhật phiên xét nghiệm</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)} loading={getDetailLoading}>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="name"
              rules={{ required: true }}
              render={({ onChange, onBlur, value }) => (
                <Form.Input
                  fluid
                  required
                  label="Tên phiên xét nghiệm"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              control={control}
              defaultValue=""
              name="description"
              render={({ onChange, onBlur, value }) => (
                <Form.TextArea
                  label="Ghi chú"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Form.Group>
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
                  <Table.Cell>
                    <Input
                      ref={(ref) => {
                        inputRefs.current.push(ref);
                      }}
                      value={r?.secondaryCode ?? ''}
                      onChange={(__, { value }) => {
                        setExams((d) =>
                          d.map((row, idx) =>
                            i === idx ? { ...row, secondaryCode: value } : row,
                          ),
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          inputRefs.current[i + 1].focus();
                        }
                      }}
                      action={{
                        color: 'blue',
                        icon: 'paste',
                        onClick: (e) => {
                          e.preventDefault();
                          setData((d) =>
                            d.map((row, idx) =>
                              i === idx
                                ? { ...row, secondaryCode: row.code }
                                : row,
                            ),
                          );
                        },
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          loading={updateLoading}
          disabled={updateLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

UpdateWithSubCodeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string,
  getData: PropTypes.func.isRequired,
};

UpdateWithSubCodeModal.defaultProps = {
  id: '',
};

export default UpdateWithSubCodeModal;
