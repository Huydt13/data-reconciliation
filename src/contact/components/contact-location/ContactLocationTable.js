import React, { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import {
  FiEye,
  FiTrash2,
  FiArrowLeft,
  FiCheck,
} from 'react-icons/fi';
import styled from 'styled-components';

import locations from 'app/assets/mock/locations.json';

import { showConfirmModal } from 'app/actions/global';
import { DataTable } from 'app/components/shared';

import { useDispatch, useSelector } from 'react-redux';
import {
  getContactLocations,
  deleteContactLocation,
  createContactLocation,
  updateContactLocation,
} from '../../actions/contact';

import ContactLocationForm from './ContactLocationForm';
import ContactLocationFilter from './ContactLocationFilter';

const BackButton = styled(Button)`
  margin-bottom: 16px !important;
`;

const columns = [
  { Header: 'Loại hình', formatter: (row) => row?.locationType ?? '' },
  { Header: 'Tên khu vực', accessor: 'name' },
  { Header: 'Địa chỉ', accessor: 'formattedAddress' },
  { Header: 'Điểm nóng', formatter: (row) => (row.isHotpost ? <FiCheck /> : '') },
];

const formattedData = (data) => (data || []).map((e, i) => {
  let formattedFloor = '';
  let formattedBlock = '';
  let formattedStreet = '';
  let formattedWard = '';
  let formattedDistrict = '';
  let formattedProvince = '';

  formattedFloor = e?.address?.floor ? `Tầng ${e?.address?.floor}, ` : '';
  formattedBlock = e?.address?.block ? `Lô ${e?.address?.block}, ` : '';
  formattedStreet = e?.address?.streetHouseNumber
    ? `${e?.address?.streetHouseNumber}, `
    : '';
  formattedProvince = e?.address?.provinceValue
    ? locations?.find((p) => p?.value === e?.address?.provinceValue)?.label
    : '';
  formattedDistrict = (e?.address?.districtValue && e?.address?.provinceValue)
    ? `${locations
      ?.find((p) => p?.value === e?.address?.provinceValue)
      ?.districts?.find((d) => d?.value === e?.address?.districtValue)?.label}, `
    : '';
  formattedWard = (e?.address?.wardValue && e?.address?.provinceValue && e?.address?.districtValue)
    ? `${locations
      ?.find((p) => p?.value === e?.address?.provinceValue)
      ?.districts?.find((d) => d?.value === e?.address?.districtValue)
      ?.wards?.find((w) => w?.value === e?.address?.wardValue)?.label}, `
    : '';
  return {
    ...e,
    index: i + 1,
    formattedAddress:
      formattedFloor + formattedBlock + formattedStreet
    + formattedWard + formattedDistrict + formattedProvince,
  };
});

const ContactLocationTable = () => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [modal, setModal] = useState({
    isOpen: false,
    data: {},
  });

  const {
    contactLocationList,
    loadingGetContactLocation,
    loadingCreateContactLocation,
    loadingUpdateContactLocation,
    loadingDeleteContactLocation,
  } = useSelector((state) => state.contact);

  const handleRefresh = () => {
    // dispatch(getContactLocations());
    dispatch(getContactLocations({
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
    const { locationType } = data.address;
    const d = {
      ...data,
      locationType,
    };
    if (data.id) {
      dispatch(updateContactLocation(d)).then(() => {
        handleRefresh();
      });
    } else {
      dispatch(createContactLocation(d)).then(() => {
        handleRefresh();
      });
    }
  };

  useEffect(contactLocationList.length === 0 ? handleRefresh : () => {}, []);

  const { data, pageCount } = contactLocationList;

  return (
    <>
      {!modal.isOpen && (
        <>
          <ContactLocationFilter onChange={(e) => { setFilter(e); }} />
          <DataTable
            title="Khu vực tiếp xúc"
            columns={columns}
            data={formattedData(data)}
            loading={
              loadingGetContactLocation
              || loadingCreateContactLocation
              || loadingUpdateContactLocation
              || loadingDeleteContactLocation
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
                    dispatch(deleteContactLocation(row.id)).then(() => {
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

          <ContactLocationForm
            initialData={modal.data}
            onSubmit={(d) => handleSubmit(d)}
          />
        </>
      )}
    </>
  );
};

export default ContactLocationTable;
