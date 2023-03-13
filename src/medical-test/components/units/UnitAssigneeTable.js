/* eslint-disable no-nested-ternary */
import React, {
  useState,
  useEffect,
  // useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FiFileText } from 'react-icons/fi';

import { DataTable } from 'app/components/shared';

import { getAssigneesByUnit } from 'medical-test/actions/medical-test';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Người được xét nghiệm',
    formatter: (row) => row.person.name,
    cutlength: 50,
  },
];

const UnitAssigneeTable = (props) => {
  const { unitId, unitName } = props;
  const dispatch = useDispatch();
  // const [searchValue, setSearchValue] = useState('');

  // const handleRefresh = useCallback(() => {
  //   dispatch(getAssigneesByUnit(unitId));
  // }, [dispatch, unitId]);

  // useEffect(() => {
  //   handleRefresh();
  // }, [handleRefresh]);

  const [assigneeList, setAssigneeList] = useState([]);
  useEffect(() => {
    dispatch(getAssigneesByUnit(unitId)).then((res) => {
      setAssigneeList(res.data);
    });
  }, [unitId, dispatch]);

  return (
    <div>
      {/* <InstantSearchBar onChange={setSearchValue} /> */}
      <DataTable
        title={`Quản lý đối tượng tại ${unitName}`}
        columns={columns}
        data={assigneeList?.map((r, i) => ({ ...r, index: i + 1 }))}
        actions={[
          // {
          //   icon: <FiPlus />,
          //   title: 'Thêm',
          //   color: 'green',
          //   globalAction: true,
          // },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (row) => {
              window.open(`/subject/${row.person.id}/medical-test`, '_blank');
            },
            disabled: false,
          },
        ]}
      />
    </div>
  );
};

UnitAssigneeTable.propTypes = {
  unitId: PropTypes.string,
  unitName: PropTypes.string,
};

UnitAssigneeTable.defaultProps = {
  unitId: '',
  unitName: '',
};

export default UnitAssigneeTable;
