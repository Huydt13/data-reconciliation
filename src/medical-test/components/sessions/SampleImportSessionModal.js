import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Modal, Progress } from 'semantic-ui-react';

import { DataTable } from 'app/components/shared';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPlateResult } from 'medical-test/actions/session';
import { showInfoModal } from 'app/actions/global';
import { renderExaminationResult } from 'app/utils/helpers';

const MarginTopButton = styled(Button)`
  margin-top: 1em !important;
`;
const StyledProgress = styled(Progress)`
  margin: 1em 0 !important;
`;

const SampleImportSessionModal = (props) => {
  const { open, onClose, onRefresh } = props;
  const { uploadPlateResultLoading, uploadPlateResultProgress } = useSelector(
    (state) => state.medicalTest,
  );
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const columns = useMemo(
    () => [
      { Header: 'Code', accessor: 'code' },
      {
        Header: 'Kết quả',
        formatter: ({ result }) => renderExaminationResult(result),
      },

      { Header: 'Ngày có kết quả', accessor: 'resultDate' },
    ],
    [],
  );
  const data = useMemo(
    () => [
      {
        code: 'U07T01200001',
        result: 'Dương tính',
        resultDate: '20-09-2020 13:45',
      },
      {
        code: 'U07T01200002',
        result: 'Âm tính',
        resultDate: '10-09-2020 10:15',
      },
      {
        code: 'U07T01200003',
        result: 'Dương tính',
        resultDate: '15-10-2020 22:30',
      },
    ],
    [],
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const uploadResult = async () => {
        try {
          await dispatch(uploadPlateResult(formData));
        } catch (e) {
          dispatch(showInfoModal('Đã có lỗi xảy ra', e));
        }
      };
      onClose();
      onRefresh();
      uploadResult();
    }
    // eslint-disable-next-line
  }, [dispatch, selectedFile]);
  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>
        Cập nhật kết quả phiên xét nghiệm bằng file Excel
      </Modal.Header>
      <Modal.Content>
        <DataTable
          title="Mẫu Excel"
          celled
          noPaging
          columns={columns}
          data={data}
          actions={[]}
        />
        {uploadPlateResultLoading && (
          <StyledProgress
            active
            color="green"
            percent={uploadPlateResultProgress}
            size="tiny"
          />
        )}
        <MarginTopButton
          primary
          onClick={() => fileInputRef.current.click()}
          content="Chọn File Excel"
        />
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => setSelectedFile(e.target.files[0])}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </Modal.Content>
    </Modal>
  );
};

SampleImportSessionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
export default SampleImportSessionModal;
