import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  // Form,
  Button,
  Header,
  Form,
  Input,
} from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import { FiEdit2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { getUnits, updateUnit } from 'medical-test/actions/medical-test';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  margin-right: 0 !important;
  margin-top: 15px !important;
`;

const ButtonGroupWrapper = styled.div`
  margin-bottom: 10px;
  text-align: right;
  & .buttons {
    margin-top: 16px;
    margin-right: 4px;
  }
`;

const MarginLeftButton = styled(Button)`
  margin-left: 10px !important;
`;

const AllWattageModal = (props) => {
  const {
    open,
    onClose,
    // onSubmit,
  } = props;
  const {
    unitList: { data },
    getUnitsLoading,
    updateUnitLoading,
  } = useSelector((state) => state.medicalTest);
  const loading = getUnitsLoading || updateUnitLoading;
  const dispatch = useDispatch();
  useEffect(() => {
    if (open) {
      dispatch(getUnits({ pageSize: '2147483647' }));
    }
  }, [open, dispatch]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});
  const [recordList, setRecordList] = useState(
    (data || []).map((d, i) => ({ ...d, index: i + 1 })),
  );
  const tableColumns = useMemo(
    () => [
      { Header: '#', accessor: 'index' },
      { Header: 'Tên cơ sở', accessor: 'name' },
      {
        Header: 'Chỉ tiêu lấy mẫu',
        formatter: (row) => (row.isCollector ? `${row.collectLimit}` : ''),
      },
      {
        Header: 'Chỉ tiêu xét nghiệm',
        formatter: (row) => (row.isTester ? `${row.testLimit}` : ''),
      },
    ],
    [],
  );
  const tableActions = [
    {
      icon: <FiEdit2 />,
      title: 'Sửa',
      color: 'violet',
      onClick: (row) => {
        setIsUpdate(true);
        setDisabled(true);
        setCurrentRecord(row);
      },
    },
  ];

  const updateRecordList = () => {
    setRecordList((oldRecord) => (
      oldRecord.map((s) => (s.id !== currentRecord.id
        ? s
        : {
          ...currentRecord,
          isUpdated: true,
        }))
    ));
    setIsUpdate(false);
    setDisabled(false);
    setCurrentRecord({});
  };
  const table = (
    <DataTable
      noPaging
      loading={getUnitsLoading}
      title="Danh sách cơ sở"
      columns={tableColumns}
      data={recordList}
      actions={tableActions}
    />
  );
  const confirmButton = (
    <MarginLeftButton
      basic
      color="violet"
      content="Cập nhật"
      onClick={updateRecordList}
    />
  );
  const cancelButton = (
    <MarginLeftButton
      basic
      color="grey"
      content="Huỷ"
      onClick={() => {
        setIsUpdate(false);
        setDisabled(false);
        setCurrentRecord({});
      }}
    />
  );
  const detailInformation = (
    <>
      <Header
        as="h4"
        content={`Điều chỉnh chỉ tiêu của ${currentRecord?.name}`}
      />
      <Form.Group widths="equal">
        <Form.Field
          disabled={!currentRecord?.isCollector}
          type="number"
          control={Input}
          label="Chỉ tiêu lấy mẫu được giao"
          value={currentRecord.collectLimit || ''}
          onChange={(e, { value }) => {
            setCurrentRecord({
              ...currentRecord,
              collectLimit: value,
            });
          }}
        />
        <Form.Field
          disabled={!currentRecord?.isTester}
          type="number"
          control={Input}
          label="Chỉ tiêu xét nghiệm được giao"
          value={currentRecord.testLimit || ''}
          onChange={(e, { value }) => {
            setCurrentRecord({
              ...currentRecord,
              testLimit: value,
            });
          }}
        />
      </Form.Group>
    </>
  );

  const handleUpdate = async () => {
    const updateList = recordList.filter((r) => r.isUpdated);
    Promise.all(updateList.map((e) => dispatch(updateUnit(e)))).then(() => {
      onClose();
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Điều chỉnh công suất và chỉ tiêu</Modal.Header>
      <Modal.Content>
        <div className={`ui form ${loading ? 'loading' : ''}`}>
          {table}
          {isUpdate && (
            <>
              {detailInformation}
              <ButtonGroupWrapper>
                {confirmButton}
                {cancelButton}
              </ButtonGroupWrapper>
            </>
          )}
          {!disabled && (
            <ButtonGroupWrapper>
              <StyledButton
                primary
                content="Xác nhận"
                loading={loading}
                disabled={loading}
                onClick={handleUpdate}
              />
            </ButtonGroupWrapper>
          )}
        </div>
      </Modal.Content>
    </Modal>
  );
};

AllWattageModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  // onSubmit: PropTypes.func,
};

AllWattageModal.defaultProps = {
  // onSubmit: () => {},
};

export default AllWattageModal;
