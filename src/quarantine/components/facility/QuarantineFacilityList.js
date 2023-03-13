import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Grid } from 'semantic-ui-react';
import { FiFastForward, FiPlus, FiTrash2 } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import {
  createFacility,
  deleteFacility,
  getFacilities,
  setManager,
} from 'quarantine/actions/facility';

import { formatAddress } from 'app/utils/helpers';
import { DataTable, DataList } from 'app/components/shared';

import AddFacilityModal from './AddFacilityModal';
import SetManagerModal from './SetManagerModal';
// import QuarantineRequestTable from './QuarantineRequestTable';

const StyledGrid = styled(Grid)`
  background-color: white !important ;
`;
const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Tên khu/khách sạn', accessor: 'name' },
  { Header: 'Người liên hệ', accessor: 'contactName' },
  { Header: 'SDT liên hệ', accessor: 'contactPhone' },
  { Header: 'Địa chỉ', accessor: 'formattedAddress' },
];
const QuarantineFacilityList = () => {
  const dispatch = useDispatch();
  const { userList, selectedUser, loadingGetUser } = useSelector(
    (state) => state.authorize,
  );
  const {
    facilityData,
    getFacilitiesLoading,
    createFacilityLoading,
    updateFacilityLoading,
    deleteFacilityLoading,
  } = useSelector((s) => s.facility);
  const { totalPages, data: facilityList } = facilityData;
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selecting, setSelecting] = useState(null);
  const [addFacilityModal, setAddFacilityModal] = useState(false);
  const [setManagerModal, setSetManagerModal] = useState(false);

  const getFacilityData = useCallback(() => {
    if (selectedUser) {
      dispatch(
        getFacilities({
          managerId: selectedUser.id,
          pageIndex,
          pageSize,
        }),
      );
    }
  }, [dispatch, selectedUser, pageSize, pageIndex]);
  useEffect(getFacilityData, [getFacilityData]);

  const handleSubmit = (d) => {
    dispatch(createFacility({ ...d, managerId: selectedUser.id })).then(
      getFacilityData,
      setAddFacilityModal(false),
    );
  };
  const handleSetManager = (d) => {
    dispatch(setManager(selecting.id, d.managerId)).then(
      getFacilityData,
      setSetManagerModal(false),
    );
  };
  return (
    <StyledGrid>
      <Grid.Column className="facility-list" width={selectedUser?.id ? 4 : 16}>
        <DataList
          search
          toggle
          title="Danh sách tài khoản quận/huyện"
          data={userList}
          loading={loadingGetUser}
          onRowClick={(row) => {
            if (selectedUser?.id === row?.id) {
              // setPageIndex(0);
              // setPageSize(10);
            } else {
              setPageIndex(0);
              setPageSize(10);
            }
          }}
          itemHeaderRender={(d) => d.username}
          itemContentRender={(d) => `Email: ${d.email}`}
          getRowKey={(d) => d.id}
        />
      </Grid.Column>
      {selectedUser?.id && (
        <Grid.Column width={12}>
          <DataTable
            columns={columns}
            title={`Danh sách khu/khách sạn của ${selectedUser.username}`}
            data={formatAddress(facilityList || [])}
            pageCount={totalPages}
            onPaginationChange={(p) => {
              setPageIndex(p.pageIndex);
              setPageSize(p.pageSize);
            }}
            loading={
              getFacilitiesLoading ||
              createFacilityLoading ||
              updateFacilityLoading ||
              deleteFacilityLoading
            }
            actions={[
              {
                title: 'Thêm',
                color: 'green',
                icon: <FiPlus />,
                onClick: () => setAddFacilityModal(true),
                globalAction: true,
              },
              {
                title: 'Chuyển khu vực quản lý',
                color: 'blue',
                icon: <FiFastForward />,
                onClick: (r) => {
                  setSelecting(r);
                  setSetManagerModal(true);
                },
              },
              {
                title: 'Xoá',
                color: 'red',
                icon: <FiTrash2 />,
                onClick: (row) =>
                  dispatch(
                    showConfirmModal('Xác nhận xóa?', () =>
                      dispatch(deleteFacility(row.id)).then(getFacilityData),
                    ),
                  ),
              },
            ]}
          />
        </Grid.Column>
      )}
      <SetManagerModal
        open={setManagerModal}
        onClose={() => setSetManagerModal(false)}
        onSubmit={handleSetManager}
      />
      <AddFacilityModal
        open={addFacilityModal}
        onClose={() => setAddFacilityModal(false)}
        onSubmit={handleSubmit}
      />
    </StyledGrid>
  );
};

export default QuarantineFacilityList;
