/* eslint-disable no-empty */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import moment from 'moment';
import xlsx from 'xlsx';

import { FiEdit3 } from 'react-icons/fi';
import {
  Modal, Button,
  Message, Icon,
  Header, Tab, List,
  Dimmer, Loader, Menu,
} from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import ProfileSection from 'medical-test/components/quick-test/ProfileSection';

import { useDispatch, useSelector } from 'react-redux';
import {
  getProfileWithouDispatch,
  createProfile,
  updateProfile,
  createImmunizationForProfile,
  updateImmunizationForProfile,
} from 'profile/actions/profile';
import { getSamplingPlaces, getExaminationTypes, createQuickTest } from 'medical-test/actions/medical-test';
import {
  formatProfileRequest,
  formatAddressToString,
  downloadFile,
  getExaminationError,
} from 'app/utils/helpers';
import { defaultProfileValue, formatGender } from 'profile/utils/helpers';
import { IMMUNIZATION_STATUSES } from 'profile/utils/constants';
import { formatImmunizationStatusForExam } from 'medical-test/utils/helpers';

import locations from 'app/assets/mock/locations';
import excelTemplate from 'app/assets/excels/Mẫu import khai báo F0.xlsx';
import { importExcel } from 'app/actions/global';
import apiLinks from 'app/utils/api-links';

const Wrapper = styled.div`
  position: relative;
`;

const MenuWrapper = styled.div`
  margin-top: 15px;
  & .tab {
    padding-top: 0.1em !important;
  }
  & .fVDZkI {
    margin-top: 0 !important;
  }
`;

const resultsOfExam = ['Dương tính', 'Âm tính'];
const immunizationStatusOptions = [
  { key: 0, value: IMMUNIZATION_STATUSES.NO_RECORD, text: 'Chưa rõ' },
  { key: 1, value: IMMUNIZATION_STATUSES.NO_VACCINE, text: 'Chưa tiêm' },
  { key: 2, value: IMMUNIZATION_STATUSES.ONE_SHOT, text: 'Tiêm 1 mũi' },
  { key: 3, value: IMMUNIZATION_STATUSES.TWO_SHOT, text: 'Tiêm 2 mũi' },
  { key: 4, value: IMMUNIZATION_STATUSES.MORE_THAN_TWO_SHOT, text: 'Tiêm trên 2 mũi' },
];

const startWithRow = 2;
const steps = {
  downloadTemplate: 0,
  reviewData: 1,
  result: 2,
};

const ImportInfectedPatientModal = ({ open, onClose: onCloseProps, onRefresh }) => {
  const [step, setStep] = useState(steps.downloadTemplate);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

  const [readData, setReadData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [uploadResult, setUploadResult] = useState([]);

  const [conflictProfile, setConflictProfile] = useState(undefined);

  const method = useForm();
  const dispatch = useDispatch();

  const jsx_downloadTemplate = useMemo(() => (
    <Message
      info
      icon
      style={{ marginBottom: 0, cursor: 'pointer' }}
      onClick={() => downloadFile(excelTemplate)}
    >
      <Icon name="download" />
      <Message.Content>
        <Message.Header>Tải tệp tin mẫu</Message.Header>
        Sử dụng tệp tin mẫu, để đảm bảo dữ liệu chính xác
      </Message.Content>
    </Message>
  ), []);

  const onClose = () => {
    onCloseProps();
    onRefresh();
  };
  useEffect(() => {
    if (errorData.length === 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [errorData]);

  const uploadData = () => {
    if (selectedFile) {
      const uploadFile = async () => {
        const formData = new FormData();
        formData.append('formFile', selectedFile);
        try {
          await dispatch(
            importExcel({
              method: 'POST',
              url: apiLinks.injectedPatient.importExcel,
              formData,
            }),
          );
          toast.success('Nhập dữ liệu thành công');
          onClose();
        } catch {
          toast.warn('Đã có lỗi xảy ra');
        }
      };
      uploadFile();
    }
    fileInputRef.current.value = '';
    setSelectedFile(undefined);
    // eslint-disable-next-line
  };
  return (
    <>
      <Modal open={open} size={step !== steps.downloadTemplate ? 'fullscreen' : undefined} onClose={onClose}>
        <Modal.Header>Nạp dữ liệu từ file Excel</Modal.Header>
        <Modal.Content>
          <Wrapper>
            <Dimmer inverted active={loading}>
              <Loader />
            </Dimmer>
            <div>
              <Button
                icon="upload"
                labelPosition="right"
                color="green"
                content="Chọn File"
                onClick={() => {
                  fileInputRef.current.click();
                }}
              />
              {jsx_downloadTemplate}
              {selectedFile ? (
                <span style={{ marginLeft: '10px', fontWeight: '700' }}>{selectedFile.name}</span>
              ) : null}
            </div>
            <input
              hidden
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                setSelectedFile(e.target.files[0]);
              }}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
          </Wrapper>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content="Xác nhận"
            disabled={disabled || loading}
            onClick={() => uploadData()}
          />
          <Button
            negative
            labelPosition="right"
            icon="close"
            content="Đóng"
            onClick={onClose}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

ImportInfectedPatientModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
};

ImportInfectedPatientModal.defaultProps = {
  open: false,
  onClose: () => { },
  onRefresh: () => { },
};

export default ImportInfectedPatientModal;
