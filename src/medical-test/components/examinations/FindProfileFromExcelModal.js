import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Modal } from 'semantic-ui-react';
import { FiX } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';

import { DataTable } from 'app/components/shared';
import { changeProfileBatch } from 'medical-test/actions/medical-test';
import { showInfoModal } from 'app/actions/global';

const columns = [
  { Header: 'ID hồ sơ', accessor: 'profileId' },
  { Header: 'Họ và tên', accessor: 'name' },
  {
    Header: 'Mã xét nghiệm',
    formatter: ({ code }) => (code?.length === 12 ? <b>{code}</b> : code),
  },
];
const FindProfileFromExcelModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { uploadProfilefromExcelData, changeProfileBatchLoading } = useSelector(
    (s) => s.medicalTest,
  );

  const [data, setData] = useState([]);
  useEffect(
    () => setData(uploadProfilefromExcelData),
    [uploadProfilefromExcelData],
  );

  const handleSubmit = async () => {
    const result = await dispatch(changeProfileBatch(data));
    dispatch(showInfoModal('Kết quả', result));
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Đổi hồ sơ của mẫu</Modal.Header>
      <Modal.Content>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Hoàn thành"
          loading={changeProfileBatchLoading}
          disabled={changeProfileBatchLoading}
          onClick={handleSubmit}
        />
        <DataTable
          columns={columns}
          title="Danh sách hồ sơ trong file excel"
          data={data}
          actions={[
            {
              title: 'Xóa',
              color: 'red',
              icon: <FiX />,
              onClick: ({ code }) =>
                setData((old) => old.filter((d) => d.code !== code)),
            },
          ]}
        />
      </Modal.Content>
    </Modal>
  );
};

FindProfileFromExcelModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FindProfileFromExcelModal;
