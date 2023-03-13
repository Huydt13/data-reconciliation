import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiPlus,
  FiEdit2,
  // FiTrash2,
} from 'react-icons/fi';

import { DataTable } from 'app/components/shared';
// import { showConfirmModal } from 'app/actions/global';
import locations from 'app/assets/mock/locations.json';
import {
  getMedicalTestZones,
  // deleteMedicalTestZone,
  createMedicalTestZone,
  updateMedicalTestZone,
} from 'medical-test/actions/medical-test';
import ZoneFilter from './ZoneFilter';
import ZoneModal from './ZoneModal';
import CodeTableByZone from './CodeTableByZone';

const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Loại hình', formatter: (row) => (row.type === 2 ? 'Cơ sở lấy mẫu' : 'Cơ sở xét nghiệm') },
  { Header: 'Tên cơ sở', accessor: 'name' },
  { Header: 'Địa chỉ', accessor: 'formattedAddress' },
  { Header: 'Người quản lý', accessor: 'contactName' },
  { Header: 'Số điện thoại liên hệ', accessor: 'contactPhone' },
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

const ZoneTable = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [modal, setModal] = useState({
    isOpen: false,
    data: null,
  });

  const {
    medicalTestZoneData,
    getMedicalTestZonesLoading,
    creatMedicalTesteZoneLoading,
    updatMedicalTesteZoneLoading,
    deletMedicalTesteZoneLoading,
    printCodeLoading,
    publishCodeLoading,
  } = useSelector((state) => state.medicalTest);

  const handleRefresh = () => {
    dispatch(getMedicalTestZones({
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

  const handleSubmit = (d) => {
    dispatch(!d.id ? createMedicalTestZone(d) : updateMedicalTestZone(d)).then(() => {
      setModal({ isOpen: false, data: null });
      handleRefresh();
    });
  };
  const { data, pageCount } = medicalTestZoneData || { data: null, pageCount: 0 };

  return (
    <div>
      <ZoneFilter onChange={setFilter} />
      <DataTable
        title="Cơ sở xét nghiệm"
        columns={columns}
        data={formattedData(data)}
        loading={getMedicalTestZonesLoading
          || creatMedicalTesteZoneLoading
          || updatMedicalTesteZoneLoading
          || deletMedicalTesteZoneLoading
          || printCodeLoading
          || publishCodeLoading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiPlus />,
            title: 'Thêm',
            color: 'green',
            onClick: () => setModal({
              isOpen: true,
              data: null,
            }),
            globalAction: true,
          },
          {
            icon: <FiEdit2 />,
            title: 'Sửa',
            color: 'violet',
            onClick: (row) => setModal({
              isOpen: true,
              data: row,
            }),
          },
          // {
          //   icon: <FiTrash2 />,
          //   title: 'Xóa',
          //   color: 'red',
          //   onClick: (row) => dispatch(showConfirmModal('Xác nhận xóa?', () => {
          //     dispatch(deleteMedicalTestZone(row.id)).then(() => {
          //       handleRefresh();
          //     });
          //   })),
          // },
        ]}
        subComponent={(row) => (
          <CodeTableByZone zonePrefix={row.prefix} />
        )}
      />

      <ZoneModal
        key={modal.isOpen ? 'ModalCreateZoneModal' : 'CloseCreateZoneModal'}
        open={modal.isOpen}
        initialData={modal.data}
        onClose={() => setModal({
          isOpen: false,
          data: null,
        })}
        onSubmit={handleSubmit}
      />

    </div>
  );
};

export default ZoneTable;
