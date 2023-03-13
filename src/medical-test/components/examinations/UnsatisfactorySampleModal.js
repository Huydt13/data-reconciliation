import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Modal, Form, Button } from 'semantic-ui-react';
import ExaminationDetailsTable from 'medical-test/components/examinations/ExaminationDetailsTable';
import ImportSampleTable from 'medical-test/components/examinations/ImportSampleTable';

import store from 'app/store';
import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal, showErrorModal } from 'app/actions/global';
import { clearExams, selectExams } from 'medical-test/actions/session';
import { markAsUnsatisfactorySample, unMarkAsUnsatisfactorySample } from 'medical-test/actions/medical-test';

const UnsatisfactorySampleModal = (props) => {
  const {
    open,
    mark,
    unMark,
    isTakenUnit,
    isReceivedUnit,
    onClose,
    onRefresh,
  } = props;

  const [selectingType, setSelectingType] = useState(0);

  const dispatch = useDispatch();
  const {
    markAsUnsatisfactorySampleLoading,
    unMarkAsUnsatisfactorySampleLoading,
  } = useSelector((state) => state.medicalTest);

  const title = `${mark ? 'Cập nhật' : 'Huỷ kết quả'} mẫu không đạt`;

  const onSubmit = async () => {
    const samples = _.flattenDeep(
      store
        .getState()
        .session.selectedRows.filter((e) => e.exams)
        .map((e) => e.exams),
    );
    if (samples && samples.length >= 0) {
      dispatch(
        mark
          ? markAsUnsatisfactorySample(samples)
          : unMarkAsUnsatisfactorySample(samples),
      )
        .then((response) => {
          if (response?.errors && response.errors.length > 0) {
            dispatch(
              showErrorModal(
                'Kết quả huỷ mẫu kết quả không đạt',
                response?.data ?? '',
                response.errors.map((error) => `Mã: ${error?.code ?? ''} - Lỗi: ${error?.error ?? ''}`),
              ),
            );
          } else {
            toast.success(`Kết quả: ${response?.data ?? ''}`);
            onClose();
            onRefresh();
            dispatch(clearExams());
          }
        });
    }
  };

  return (
    <Modal
      size="large"
      open={open}
      onClose={() =>
        dispatch(
          showConfirmModal(
            'Dữ liệu chưa được lưu, bạn có muốn đóng?',
            () => {
              dispatch(clearExams());
              onClose();
              onRefresh();
            },
          ),
        )
      }
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content scrolling>
        <Form loading={markAsUnsatisfactorySampleLoading || unMarkAsUnsatisfactorySampleLoading}>
          <Form.Field>
            Chọn mẫu từ:
            {' '}
            <b>
              {selectingType
                ? selectingType === 1
                  ? 'Hệ thống'
                  : 'File Excel'
                : ''}
            </b>
          </Form.Field>
          <Form.Checkbox
            radio
            value={1}
            name="checkboxRadioGroup"
            label="Hệ thống"
            checked={selectingType === 1}
            onChange={(__, { value }) => {
              setSelectingType(value);
              dispatch(clearExams());
            }}
          />
          <Form.Checkbox
            radio
            value={2}
            name="checkboxRadioGroup"
            label="File Excel"
            checked={selectingType === 2}
            onChange={(__, { value }) => {
              setSelectingType(value);
              dispatch(clearExams());
            }}
          />
          {selectingType === 1 && (
            <Form.Field
              noResult={mark}
              hasSatisfactorySample={unMark}
              isTakenUnit={isTakenUnit}
              isReceivedUnit={isReceivedUnit}
              control={ExaminationDetailsTable}
              onChange={({ data: d, pageIndex }) => {
                dispatch(selectExams((d || []).map((r) => r.code), pageIndex));
              }}
            />
          )}
          {selectingType === 2 && (
            <Form.Field
              control={ImportSampleTable}
              onChange={(d) => {
                dispatch(selectExams(d, 1));
              }}

            />
          )}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          labelPosition="right"
          color={mark ? 'violet' : 'red'}
          icon={mark ? 'sync' : 'trash alternate'}
          content={mark ? 'Cập nhật' : 'Huỷ'}
          disabled={markAsUnsatisfactorySampleLoading}
          onClick={onSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
};

UnsatisfactorySampleModal.defaultProps = {
  open: false,
  mark: false,
  unMark: false,
  isTakenUnit: false,
  isReceivedUnit: false,
  onClose: () => {},
  onRefresh: () => {},
};

UnsatisfactorySampleModal.propTypes = {
  open: PropTypes.bool,
  mark: PropTypes.bool,
  unMark: PropTypes.bool,
  isTakenUnit: PropTypes.bool,
  isReceivedUnit: PropTypes.bool,
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default UnsatisfactorySampleModal;
