/* eslint-disable react/jsx-one-expression-per-line */
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import { deleteFacility, getFacilities } from 'treatment/actions/facility';

import { DataTable } from 'app/components/shared';
import {
  checkFilter,
  formatAddress,
  formatObjectToAddress,
} from 'app/utils/helpers';

import { Grid } from 'semantic-ui-react';
import {
  getHospitalsByFacility,
  removeHospitalsToFacility,
} from 'treatment/actions/hospital';
import FacilityModal from './FacilityModal';
import FacilityFilter from './FacilityFilter';
import AddHospitalModal from '../hospital/AddHospitalModal';

const HighlightText = styled.span`
  font-weight: bold;
  color: #4183c4;
`;
const columns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Tên cơ sở điều trị', accessor: 'name' },
  { Header: 'Người liên hệ', accessor: 'contactName' },
  { Header: 'SDT liên hệ', accessor: 'contactPhone' },
  { Header: 'Địa chỉ', accessor: formatObjectToAddress },
];

const hospitalColumns = [
  { Header: '#', accessor: 'index' },
  { Header: 'Tên bệnh viện', accessor: 'description' },
  { Header: 'Địa chỉ', accessor: formatObjectToAddress },
];

const FacilityListTable = () => {
  // facility section
  const { data, pageCount } = useSelector(
    (s) => s.treatment.facility.facilityData,
  );
  const getLoading = useSelector(
    (s) => s.treatment.facility.getFacilityListLoading,
  );
  const deleteLoading = useSelector(
    (s) => s.treatment.facility.deleteFacilityLoading,
  );

  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [facilityModal, setFacilityModal] = useState(false);
  const [selectingRow, setSelectingRow] = useState({});

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(
      getFacilities({
        ...filter,
        pageSize,
        pageIndex,
      }),
    );
  }, [dispatch, filter, pageSize, pageIndex]);
  useEffect(getData, [getData]);

  // hospital section
  const { data: hospitalData, pageCount: hospitalPageCount } = useSelector(
    (s) => s.treatment.hospital.hospitalByFacilityData,
  );
  const getHospitalsLoading = useSelector(
    (s) => s.treatment.hospital.getHospitalsByFacilityLoading,
  );
  const removeLoading = useSelector(
    (s) => s.treatment.hospital.removeHospitalsLoading,
  );

  const [addHospitalModal, setAddHospitalModal] = useState(false);
  const [hospitalPageIndex, setHospitalPageIndex] = useState(0);
  const [hospitalPageSize, setHospitalPageSize] = useState(10);

  const getHospital = useCallback(() => {
    if (selectingRow?.id) {
      dispatch(
        getHospitalsByFacility({
          facilityId: selectingRow.id,
          pageSize: hospitalPageSize,
          pageIndex: hospitalPageIndex,
        }),
      );
    }
  }, [dispatch, selectingRow, hospitalPageSize, hospitalPageIndex]);
  useEffect(getHospital, [getHospital]);

  return (
    <Grid divided>
      <Grid.Column width={selectingRow?.id ? 8 : 16}>
        <FacilityFilter
          onChange={(d) => checkFilter(filter, d) && setFilter(d)}
        />
        <DataTable
          columns={columns}
          title="Danh sách khu điều trị"
          data={formatAddress(data || []).map((r, i) => ({
            ...r,
            index: i + 1,
          }))}
          pageCount={pageCount}
          onPaginationChange={(p) => {
            setPageIndex(p.pageIndex);
            setPageSize(p.pageSize);
          }}
          loading={getLoading || deleteLoading}
          onRowClick={(r) => {
            if (r.id === selectingRow?.id) {
              setSelectingRow(undefined);
            } else {
              setSelectingRow(r);
            }
          }}
          actions={[
            {
              title: 'Thêm khu điều trị',
              color: 'green',
              icon: <FiPlus />,
              onClick: () => {
                // setFacilityModal(true);
                // setSelectingRow({});
              },
              globalAction: true,
            },
            {
              title: 'Cập nhật',
              color: 'violet',
              icon: <FiEdit2 />,
              onClick: (r) => {
                setFacilityModal(true);
                setSelectingRow(r);
              },
            },
            {
              title: 'Xoá',
              color: 'red',
              icon: <FiTrash2 />,
              onClick: (row) =>
                dispatch(
                  showConfirmModal('Xác nhận xóa?', async () => {
                    await dispatch(deleteFacility(row.id));
                    getData();
                  }),
                ),
            },
          ]}
        />
      </Grid.Column>
      {selectingRow?.id && (
        <Grid.Column width={8}>
          <DataTable
            columns={hospitalColumns}
            title={
              <h3>
                Bệnh viện tuyến trên thuộc{' '}
                <HighlightText>{selectingRow.name}</HighlightText>
              </h3>
            }
            data={formatAddress(hospitalData || []).map((r, i) => ({
              ...r,
              index: i + 1,
            }))}
            pageCount={hospitalPageCount}
            onPaginationChange={(p) => {
              setHospitalPageIndex(p.pageIndex);
              setHospitalPageSize(p.pageSize);
            }}
            loading={getHospitalsLoading || removeLoading}
            actions={[
              {
                title: 'Thêm',
                color: 'green',
                icon: <FiPlus />,
                onClick: () => setAddHospitalModal(true),
                globalAction: true,
              },
              {
                title: 'Xoá',
                color: 'red',
                icon: <FiTrash2 />,
                onClick: ({ id }) => {
                  dispatch(
                    showConfirmModal('Xác nhận xóa?', async () => {
                      await dispatch(
                        removeHospitalsToFacility({
                          facilityId: selectingRow.id,
                          hospitalIds: [id],
                        }),
                      );
                      getHospital();
                    }),
                  );
                },
              },
            ]}
          />
        </Grid.Column>
      )}

      <FacilityModal
        key={facilityModal ? 'OpenFacilityModal' : 'CloseFacilityModal'}
        open={facilityModal}
        onClose={() => setFacilityModal(false)}
        data={selectingRow}
        getData={getData}
      />
      <AddHospitalModal
        key={
          addHospitalModal ? 'OpenAddHospitalModal' : 'CloseAddHospitalModal'
        }
        open={addHospitalModal}
        onClose={() => setAddHospitalModal(false)}
        data={selectingRow}
        getData={getHospital}
      />
    </Grid>
  );
};

export default FacilityListTable;
