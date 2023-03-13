/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { DataTable } from 'app/components/shared';

import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';
import { deleteEmployee, getEmployees } from 'treatment/actions/employee';
import { getFacilityInfo } from 'treatment/actions/facility';
import { getEmployeeTypes } from 'treatment/actions/employee-type';

import { checkFilter } from 'app/utils/helpers';

import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { showConfirmModal } from 'app/actions/global';

import EmployeeModal from './EmployeeModal';
import EmployeeFilter from './EmployeeFilter';

const EmployeeTable = () => {
  const { isHcdcDtr } = useAuth();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({});

  const [employeeModal, setEmployeeModal] = useState(false);
  const [selectingRow, setSelectingRow] = useState({});

  const facilityInfo = useSelector((s) => s.treatment.facility.facilityInfo);
  const getFacilityInfoLoading = useSelector(
    (s) => s.treatment.facility.getFacilityInfoLoading,
  );

  const employeeTypeList = useSelector(
    (s) => s.treatment.employeeType.employeeTypeList,
  );
  const getEmployeeTypesLoading = useSelector(
    (s) => s.treatment.employeeType.getEmployeeTypesLoading,
  );

  const employeeList = useSelector((s) => s.treatment.employee.employeeList);
  const getDataLoading = useSelector(
    (s) => s.treatment.employee.getEmployeeListLoading,
  );

  useEffect(() => {
    dispatch(getEmployeeTypes());
    dispatch(getFacilityInfo());
  }, [dispatch]);

  const getData = useCallback(() => {
    if (facilityInfo?.id || isHcdcDtr) {
      dispatch(
        getEmployees({
          ...filter,
          facilityId: isHcdcDtr ? filter.facilityId : facilityInfo.id,
        }),
      );
    }
  }, [dispatch, isHcdcDtr, facilityInfo, filter]);

  useEffect(getData, [getData]);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'index',
      },
      {
        Header: 'Thông tin cán bộ',
        formatter: ({ code, name }) => `${code} - ${name}`,
      },
      {
        Header: 'Chức năng',
        formatter: ({ employeeTypeId }) =>
          employeeTypeList.find((et) => et.id === employeeTypeId)?.description,
      },
      {
        Header: 'Số điện thoại',
        accessor: 'phone',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
    ],
    [employeeTypeList],
  );

  return (
    <div>
      <EmployeeFilter
        onChange={(d) => checkFilter(filter, d) && setFilter(d)}
      />
      <DataTable
        title="Danh sách cán bộ y tế trong cơ sở"
        columns={columns}
        data={employeeList.map((d, i) => ({ ...d, index: i + 1 }))}
        loading={
          getFacilityInfoLoading || getDataLoading || getEmployeeTypesLoading
        }
        actions={[
          {
            title: 'Tạo tài khoản',
            color: 'green',
            icon: <FiPlus />,
            onClick: () => {
              setEmployeeModal(true);
              setSelectingRow({});
            },
            globalAction: true,
          },
          {
            title: 'Cập nhật',
            color: 'violet',
            icon: <FiEdit2 />,
            onClick: (r) => {
              setEmployeeModal(true);
              setSelectingRow(r);
            },
          },
          {
            title: 'Xoá',
            color: 'red',
            icon: <FiTrash2 />,
            onClick: ({ id }) => {
              dispatch(
                showConfirmModal(
                  'Xóa tài khoản của cán bộ y tế này?',
                  async () => {
                    await dispatch(deleteEmployee(id));
                    getData();
                  },
                ),
              );
            },
          },
        ]}
      />

      <EmployeeModal
        key={employeeModal ? 'OpenEmployeeModal' : 'CloseEmployeeModal'}
        open={employeeModal}
        onClose={() => setEmployeeModal(false)}
        data={selectingRow}
        getData={getData}
      />
    </div>
  );
};

export default EmployeeTable;
