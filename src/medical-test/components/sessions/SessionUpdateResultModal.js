import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dimmer, Form, Loader, Modal, Select } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import { getSessionDetail } from 'medical-test/actions/session';

import { deburr } from 'app/utils/helpers';
import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';
import SessionUpdateExaminationTable from './SessionUpdateExaminationTable';

const fields = ['id', 'name', 'unitId', 'description', 'examinationDetails'];

const statuses = ['Dương tính', 'Âm tính', 'Nghi ngờ', 'Không xác định'];

const SessionUpdateResultModal = (props) => {
  const { open, onClose, onSubmit, id, loading: fetching } = props;
  const { sessionDetail: data, getSessionDetailLoading } = useSelector(
    (s) => s.session
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
  const { register, setValue, handleSubmit, reset } = useForm({
    defaultValues: { ...data },
  });
  useEffect(() => {
    reset(data);
  }, [reset, data]);

  const { unitInfo, getUnitInfoLoading } = useSelector(
    (state) => state.medicalTest
  );

  useEffect(() => {
    fields.forEach(register);
    setValue('unitId', unitInfo?.id);
    setValue('examinationDetails', []);
  }, [register, setValue, unitInfo]);

  const loading = getUnitInfoLoading || fetching;
  const [currentExamination, setCurrentExamination] = useState(null);
  useEffect(() => {
    setValue('examinationDetails', currentData);
  }, [setValue, currentData]);

  return (
    <Modal
      size='fullscreen'
      open={open}
      onClose={() =>
        dispatch(
          showConfirmModal('Dữ liệu chưa được lưu, bạn có muốn đóng?', onClose)
        )
      }
    >
      {getSessionDetailLoading && (
        <Dimmer inverted active>
          <Loader />
        </Dimmer>
      )}
      <Modal.Header>
        {`Cập nhật kết quả của phiên
        ${data?.name ?? ''}`}
      </Modal.Header>
      <Modal.Content scrolling>
        <div className={`ui form ${loading ? 'loading' : ''}`}>
          <Form.Group widths='equal'>
            <Form.Field
              control={SessionUpdateExaminationTable}
              data={currentData}
              onChange={setCurrentExamination}
            />
          </Form.Group>
        </div>
      </Modal.Content>
      <Modal
        size='small'
        open={Boolean(currentExamination)}
        onClose={() => setCurrentExamination(null)}
      >
        <Modal.Header
          content={`Cập nhật kết quả cho mẫu ${currentExamination?.code}`}
        />
        <Modal.Content>
          <div className='ui form'>
            <Form.Group widths='equal'>
              <Form.Field
                isHavingTime
                label='Thời gian có kết quả'
                control={KeyboardDateTimePicker}
                value={currentExamination?.resultDate ?? ''}
                onChange={(date) =>
                  setCurrentExamination({
                    ...currentExamination,
                    resultDate: date,
                  })
                }
              />
              <Form.Field
                control={Select}
                label='Kết quả'
                placeholder='Chọn'
                options={statuses.map((s) => ({
                  key: s.toUpperCase(),
                  value: s.toUpperCase(),
                  text: s,
                }))}
                value={currentExamination?.result ?? ''}
                onChange={(_, { value }) =>
                  setCurrentExamination({
                    ...currentExamination,
                    result: value,
                  })
                }
              />
            </Form.Group>
            {deburr(currentExamination?.result ?? '') ===
              deburr('Dương tính') && (
              <Form.Group widths='equal'>
                <Form.Input
                  fluid
                  label='CT N'
                  onChange={(_, { value }) => {
                    setCurrentExamination({
                      ...currentExamination,
                      cT_N: value,
                    });
                  }}
                />
                <Form.Input
                  fluid
                  label='CT E'
                  onChange={(_, { value }) => {
                    setCurrentExamination({
                      ...currentExamination,
                      cT_E: value,
                    });
                  }}
                />
                <Form.Input
                  fluid
                  label='CT RdRp'
                  onChange={(_, { value }) => {
                    setCurrentExamination({
                      ...currentExamination,
                      cT_RdRp: value,
                    });
                  }}
                />
                <Form.Input
                  fluid
                  label='CT ORF1ab'
                  onChange={(_, { value }) => {
                    setCurrentExamination({
                      ...currentExamination,
                      orF1ab: value,
                    });
                  }}
                />
                <Form.Input
                  fluid
                  label='Index(0.5-150)'
                  onChange={(_, { value }) => {
                    setCurrentExamination({
                      ...currentExamination,
                      index: value,
                    });
                  }}
                />
              </Form.Group>
            )}
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            color='green'
            content='Xác nhận'
            disabled={
              !currentExamination?.result || !currentExamination?.resultDate
            }
            onClick={() => {
              setCurrentData([
                ...[...currentData].filter(
                  (d) => d.id !== currentExamination?.id
                ),
                {
                  ...currentExamination,
                  unitId: unitInfo.id,
                  unitName: unitInfo.name,
                },
              ]);
              setCurrentExamination(null);
            }}
          />
          <Button
            basic
            color='red'
            content='Hủy'
            onClick={() => setCurrentExamination(null)}
          />
        </Modal.Actions>
      </Modal>

      <Modal.Actions>
        <Button
          primary
          content='Hoàn tất cập nhật kết quả'
          onClick={handleSubmit(onSubmit)}
        />
      </Modal.Actions>
    </Modal>
  );
};

SessionUpdateResultModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  id: PropTypes.string.isRequired,
};

SessionUpdateResultModal.defaultProps = {
  loading: false,
};

export default SessionUpdateResultModal;
