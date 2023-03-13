import React, { useCallback, useEffect, useState } from 'react';

import { FiEdit3, FiPlus } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { searchLocation } from 'contact/actions/contact';
// import { showConfirmModal } from 'app/actions/global';
import { selectEstate } from 'contact/actions/location';

import { checkFilter, formatObjectToAddress } from 'app/utils/helpers';

import { DataTable } from 'app/components/shared';

import EstateModal from './EstateModal';
import ContactLocationFilter from '../../contact-location/ContactLocationFilter';

const columns = [
  { Header: 'Tên địa điểm', accessor: 'name' },
  {
    Header: 'Loại hình',
    formatter: ({ address }) => address?.locationType ?? '',
  },
  { Header: 'Địa chỉ', formatter: formatObjectToAddress },
  { Header: 'Người liên hệ', accessor: 'contactName' },
  { Header: 'SĐT liên hệ', accessor: 'contactPhoneNumber' },
];
const EstateTable = () => {
  const dispatch = useDispatch();

  const { data, totalPages } = useSelector(
    (s) => s.contact.searchContactLocationList,
  );
  const loading = useSelector((s) => s.contact.getSearchContactLocationLoading);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({});
  const [openEstateModal, setOpenEstateModal] = useState(false);
  const [selecting, setSelecting] = useState({});

  const getData = useCallback(() => {
    dispatch(searchLocation({ ...filter, pageSize, pageIndex }));
  }, [dispatch, filter, pageSize, pageIndex]);
  useEffect(getData, [getData]);
  return (
    <>
      <ContactLocationFilter
        onChange={(d) => checkFilter(filter, d) && setFilter(d)}
      />
      <DataTable
        columns={columns}
        loading={loading}
        data={data || []}
        pageCount={totalPages}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageSize(ps);
          setPageIndex(pi);
        }}
        onRowClick={(r) => dispatch(selectEstate(r))}
        actions={[
          {
            icon: <FiPlus />,
            color: 'green',
            title: 'Tạo',
            onClick: () => setOpenEstateModal(true),
            globalAction: true,
          },
          {
            icon: <FiEdit3 />,
            color: 'violet',
            title: 'Cập nhật',
            onClick: (r) => {
              setSelecting(r);
              setOpenEstateModal(true);
            },
          },
        ]}
      />
      <EstateModal
        open={openEstateModal}
        data={selecting}
        onRefresh={getData}
        onClose={() => {
          setSelecting({});
          setOpenEstateModal(false);
        }}
        onSelect={(d) => {
          dispatch(selectEstate(d));
          setOpenEstateModal(false);
        }}
      />
    </>
  );
};

export default EstateTable;
