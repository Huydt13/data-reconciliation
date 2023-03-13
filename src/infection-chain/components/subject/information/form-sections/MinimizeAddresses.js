import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

import locations from 'app/assets/mock/locations.json';
import { showConfirmModal } from 'app/actions/global';
import { DataTable } from 'app/components/shared';

import { updateProfile } from 'profile/actions/profile';
import AddressModal from './AddressModal';

const StyledMinimizeWrapper = styled.div`
  & .ui.label {
    margin-left: 3px !important;
    margin-right: 0 !important;
    margin-bottom: 3px;
    font-weight: normal !important;
    font-size: 0.9em !important;
  }
  & .detail {
    margin-left: 3px !important;
  }
`;

const formattedData = (data) =>
  data.map((e) => {
    if (e) {
      let formattedFloor = '';
      let formattedBlock = '';
      let formattedStreet = '';
      let formattedWard = '';
      let formattedDistrict = '';
      let formattedProvince = '';

      formattedFloor = e.floor ? `Tầng ${e.floor}, ` : '';
      formattedBlock = e.block ? `Lô ${e.block}, ` : '';
      formattedStreet = e.streetHouseNumber ? `${e.streetHouseNumber}, ` : '';
      formattedProvince = e.provinceValue
        ? locations?.find((p) => p.value === e.provinceValue)?.label ??
          e.provinceValue
        : '';
      formattedDistrict =
        e.districtValue && e.provinceValue
          ? `${
              locations
                ?.find((p) => p.value === e.provinceValue)
                ?.districts?.find((d) => d.value === e.districtValue)?.label ??
              e.districtValue
            }, `
          : '';
      formattedWard =
        e.wardValue && e.provinceValue && e.districtValue
          ? `${
              locations
                ?.find((p) => p.value === e.provinceValue)
                ?.districts?.find((d) => d.value === e.districtValue)
                ?.wards?.find((w) => w.value === e.wardValue)?.label ??
              e.wardValue
            }, `
          : '';
      return {
        ...e,
        formattedAddress:
          formattedFloor +
          formattedBlock +
          formattedStreet +
          formattedWard +
          formattedDistrict +
          formattedProvince,
      };
    }
    return [];
  });

const tableColumns = [
  { Header: 'Loại hình', accessor: 'locationType' },
  { Header: 'Địa chỉ', accessor: 'formattedAddress' },
];

const MinimizeAddresses = (props) => {
  const { label, subject, minimize, addresses, isWorkAddress, onRefresh } =
    props;

  const { updateProfileLoading } = useSelector((state) => state.profile);

  const dispatch = useDispatch();

  const [modal, setModal] = useState({ isOpen: false, data: {} });

  const handleSubmit = (d) => {
    setModal({ isOpen: false, data: {} });
    const { guid: id, addresses: address } = d;
    let newSubjectInfo = {};
    let newAddresses = [];
    if (id) {
      newAddresses = addresses.map((a) =>
        a.guid === id ? { ...address, guid: id } : a,
      );
    } else {
      newAddresses = [...addresses, address];
    }
    if (isWorkAddress) {
      newSubjectInfo = {
        ...subject,
        workAddresses: newAddresses,
      };
    } else {
      newSubjectInfo = {
        ...subject,
        addressesInVietnam: newAddresses,
      };
    }

    dispatch(updateProfile(newSubjectInfo)).then(() => {
      onRefresh();
    });
  };

  const handleDeleteAddress = (d) => {
    const filterAddresses = addresses.filter((a) => a.guid !== d.guid);
    let newSubjectInfo = {};
    if (isWorkAddress) {
      newSubjectInfo = {
        ...subject,
        workAddresses: filterAddresses,
      };
    } else {
      newSubjectInfo = {
        ...subject,
        addressesInVietnam: filterAddresses,
      };
    }
    dispatch(updateProfile(newSubjectInfo)).then(() => {
      setModal({ isOpen: false, data: {} });
      onRefresh();
    });
  };

  const tableActions = [
    {
      icon: <FiPlus />,
      title: 'Thêm',
      color: 'green',
      onClick: () => setModal({ isOpen: true, data: {} }),
      globalAction: true,
    },
    {
      icon: <FiEdit2 />,
      title: 'Sửa',
      color: 'violet',
      onClick: (row) => setModal({ isOpen: true, data: row }),
    },
    {
      icon: <FiTrash2 />,
      title: 'Xóa',
      color: 'red',
      onClick: (row) =>
        dispatch(
          showConfirmModal('Xác nhận xóa?', () => handleDeleteAddress(row)),
        ),
    },
  ];

  const tableTitle = useMemo(() => `Danh sách ${label.toLowerCase()}`, [label]);

  const table = useMemo(
    () => (
      <DataTable
        title={tableTitle}
        columns={tableColumns}
        data={formattedData(addresses)}
        actions={tableActions}
        loading={updateProfileLoading}
      />
    ),
    [updateProfileLoading, addresses, tableActions, tableTitle],
  );

  const modalAddress = (
    <AddressModal
      label={label}
      open={modal.isOpen}
      initialData={modal.data}
      onSubmit={handleSubmit}
      onClose={() => setModal({ isOpen: false, data: {} })}
    />
  );

  const addressList = addresses.map((e) => ({
    id: e.id,
    locationTypeValue: e.locationType,
    roomValue: e.room,
    floorValue: e.floor,
    blockValue: e.block,
    quarterValue: e.quarter,
    quarterGroupValue: e.quarterGroup,
    streetHouseNumberValue: e.streetHouseNumber,
    nameValue: e.name,
    provinceObject:
      locations?.find((p) => p.value === e.provinceValue) ?? e.provinceValue,
    districtObject:
      locations
        ?.find((p) => p.value === e.provinceValue)
        ?.districts?.find((d) => d.value === e.districtValue) ??
      e.districtValue,
    wardObject:
      locations
        ?.find((p) => p.value === e.provinceValue)
        ?.districts?.find((d) => d.value === e.districtValue)
        ?.wards?.find((w) => w.value === e.wardValue) ?? e.wardValue,
  }));

  const data = addressList.map((e) => ({
    key: e.id,
    labels: [
      {
        rowIndex: 1,
        col: [
          {
            key: 'locationTypeValue',
            label: 'Loại hình:',
            value: e.locationTypeValue,
          },
          { key: 'nameValue', label: 'Tên địa điểm:', value: e.nameValue },
        ],
      },
      {
        rowIndex: 2,
        col: [
          { key: 'roomValue', label: 'Phòng:', value: e.roomValue },
          { key: 'floorValue', label: 'Tầng:', value: e.floorValue },
          { key: 'blockValue', label: 'Khu, lô:', value: e.blockValue },
        ],
      },
      {
        rowIndex: 3,
        col: [
          {
            key: 'quarterValue',
            label: 'Thôn/Ấp/Khu phố:',
            value: e.quarterValue,
          },
          {
            key: 'quarterGroupValue',
            label: 'Tổ dân phố:',
            value: e.quarterGroupValue,
          },
          {
            key: 'streetHouseNumberValue',
            label: 'Địa chỉ (số nhà/đường):',
            value: e.streetHouseNumberValue,
          },
        ],
      },
      {
        rowIndex: 4,
        col: [
          {
            key: 'detailsWard',
            label: 'Phường/Xã:',
            value: e?.wardObject?.label ?? e?.wardObject,
          },
          {
            key: 'detailsDistrict',
            label: 'Quận/Huyện:',
            value: e?.districtObject?.label ?? e?.districtObject,
          },
          {
            key: 'detailsProvince',
            label: 'Tỉnh/Thành:',
            value: e?.provinceObject?.label ?? e?.provinceObject,
          },
        ],
      },
    ],
  }));

  const labels = (
    <StyledMinimizeWrapper>
      <span>{label}</span>
      {data.map((d, i) => (
        <div key={d.key}>
          {data.length > 1 && (
            <span style={{ fontSize: '14px' }}>{`Địa điểm ${i + 1}:`}</span>
          )}
          {d.labels.map((r) => (
            <div key={r.rowIndex}>
              {r.col.map((f) => (
                <Label key={f.key} basic content={f.label} detail={f.value} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </StyledMinimizeWrapper>
  );

  return (
    <>
      {minimize ? (
        labels
      ) : (
        <div>
          {table}
          {modalAddress}
        </div>
      )}
    </>
  );
};

MinimizeAddresses.propTypes = {
  label: PropTypes.string,
  subject: PropTypes.shape({
    information: PropTypes.shape({}),
  }),
  minimize: PropTypes.bool,
  isWorkAddress: PropTypes.bool,
  onRefresh: PropTypes.func,
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      floor: PropTypes.string,
      block: PropTypes.string,
      streetHouseNumber: PropTypes.string,
      provinceValue: PropTypes.string,
      districtValue: PropTypes.string,
      wardValue: PropTypes.string,
    }),
  ),
};

MinimizeAddresses.defaultProps = {
  label: '',
  subject: {},
  minimize: false,
  isWorkAddress: false,
  addresses: [],
  onRefresh: () => {},
};

export default MinimizeAddresses;
