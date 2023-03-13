import React, { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import {
  FiEye,
  FiTrash2,
  FiArrowLeft,
  FiCheck,
} from 'react-icons/fi';
import styled from 'styled-components';

import { showConfirmModal } from 'app/actions/global';
import { DataTable } from 'app/components/shared';

import { useDispatch, useSelector } from 'react-redux';
import {
  getContactVehicles,
  deleteContactVehicle,
  createContactVehicle,
  updateContactVehicle,
} from '../../actions/contact';

import ContactVehicleForm from './ContactVehicleForm';
import ContactVehicleFilter from './ContactVehicleFilter';

const BackButton = styled(Button)`
  margin-bottom: 16px !important;
`;

const columns = [
  { Header: 'Tên phương tiện', accessor: 'vehicleName' },
  { Header: 'Loại hình', accessor: 'vehicleType' },
  { Header: 'Điểm khởi hành', accessor: 'from' },
  { Header: 'Điểm đến', accessor: 'to' },
  { Header: 'Điểm nóng', formatter: (row) => (row.isHotpost ? <FiCheck /> : '') },
];

const ContactVehicleTable = () => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [modal, setModal] = useState({
    isOpen: false,
    data: {},
  });

  const {
    contactVehicleList,
    loadingGetContactVehicle,
    loadingCreateContactVehicle,
    loadingUpdateContactVehicle,
    loadingDeleteContactVehicle,
  } = useSelector((state) => state.contact);

  const handleRefresh = () => {
    // dispatch(getContactVehicles());
    dispatch(getContactVehicles({
      ...filter,
      pageIndex,
      pageSize,
    }));
  };

  // eslint-disable-next-line
  useEffect(() => { handleRefresh(); }, [
    filter,
    pageIndex,
    pageSize,
  ]);

  const handleSubmit = (data) => {
    setModal({
      isOpen: false,
      data: {},
    });
    if (data.id) {
      dispatch(updateContactVehicle(data)).then(() => {
        handleRefresh();
      });
    } else {
      dispatch(createContactVehicle(data)).then(() => {
        handleRefresh();
      });
    }
  };

  useEffect(contactVehicleList.length === 0 ? handleRefresh : () => {}, []);

  const { data, pageCount } = contactVehicleList;

  return (
    <>
      {!modal.isOpen && (
        <>
          <ContactVehicleFilter onChange={(e) => { setFilter(e); }} />
          <DataTable
            title="Phương tiện tiếp xúc"
            columns={columns}
            data={data || [].map((d, i) => ({ ...d, index: i + 1 }))}
            loading={
              loadingGetContactVehicle
              || loadingCreateContactVehicle
              || loadingUpdateContactVehicle
              || loadingDeleteContactVehicle
            }
            pageCount={pageCount}
            onPaginationChange={(p) => {
              setPageIndex(p.pageIndex);
              setPageSize(p.pageSize);
            }}
            actions={[
              {
                icon: <FiEye />,
                title: 'Chi tiết',
                color: 'blue',
                onClick: (row) => {
                  setModal({
                    isOpen: true,
                    data: row,
                  });
                },
              },
              {
                icon: <FiTrash2 />,
                title: 'Xóa',
                color: 'red',
                onClick: (row) => dispatch(
                  showConfirmModal('Xác nhận xóa?', () => {
                    dispatch(deleteContactVehicle(row.id)).then(() => {
                      handleRefresh();
                    });
                  }),
                ),
              },
            ]}
          />
        </>
      )}
      {modal.isOpen && (
        <>
          <BackButton
            basic
            animated
            onClick={() => {
              setModal({
                isOpen: false,
                data: {},
              });
            }}
          >
            <Button.Content visible>Trờ về</Button.Content>
            <Button.Content hidden>
              <FiArrowLeft />
            </Button.Content>
          </BackButton>

          <ContactVehicleForm
            initialData={modal.data}
            onSubmit={(d) => handleSubmit(d)}
          />
        </>
      )}
    </>
  );
};

export default ContactVehicleTable;
