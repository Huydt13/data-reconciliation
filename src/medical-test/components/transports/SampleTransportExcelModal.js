import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Modal, Progress } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { uploadTransportFile } from 'medical-test/actions/transport';

import { DataTable } from 'app/components/shared';
import { renderExaminationResult } from 'app/utils/helpers';

const MarginTopButton = styled(Button)`
  margin-top: 1em !important;
`;
const StyledProgress = styled(Progress)`
  margin: 1em 0 !important;
`;

const SampleTransportExcelModal = (props) => {
  const { open, onClose, onRefresh } = props;
  const { uploadProgress, uploadTransportLoading } = useSelector(
    (state) => state.transport,
  );
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const columns = useMemo(
    () => [
      { Header: 'Mã', accessor: 'code' },
      {
        Header: 'Kết quả',
        formatter: ({ result }) => renderExaminationResult(result),
      },

      { Header: 'Thời gian có kết quả', accessor: 'resultDate' },
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
      dispatch(uploadTransportFile(formData)).then(() => {
        onClose();
        onRefresh();
      });
    }
    // eslint-disable-next-line
  }, [dispatch, selectedFile]);
  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>Cập nhật phiên xét nghiệm bằng file Excel</Modal.Header>
      <Modal.Content>
        <DataTable
          title="Mẫu Excel"
          celled
          noPaging
          columns={columns}
          data={data}
          actions={[]}
        />
        {uploadTransportLoading && (
          <StyledProgress
            active
            color="green"
            percent={uploadProgress}
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

SampleTransportExcelModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
};

SampleTransportExcelModal.defaultProps = {
  open: false,
  onClose: () => {},
  onRefresh: () => {},
};

export default SampleTransportExcelModal;
