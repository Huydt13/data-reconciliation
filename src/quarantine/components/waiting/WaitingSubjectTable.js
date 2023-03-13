/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FiPlus, FiCheck, FiFastForward, FiFileText } from 'react-icons/fi';
import { Label } from 'semantic-ui-react';

import { InstantSearchBar, DataTable } from 'app/components/shared';
import { filterArray } from 'app/utils/helpers';

import moment from 'moment';
import { getSubjectType } from 'infection-chain/utils/helpers';
import { CreateFromType } from 'infection-chain/utils/constants';
import {
  createProfileFromQuarantine,
  getWaitingList,
} from '../../actions/quarantine';
import CreateSubjectToQuarantineModal from './CreateSubjectToQuarantineModal';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Loại',
    formatter: (row) => {
      const { label, color } = getSubjectType(row.type);
      return (
        <Label basic color={color} content={label} className="type-label" />
      );
    },
  },
  { Header: 'Tên', accessor: 'fullName' },
  {
    Header: 'Ngày sinh',
    formatter: (row) =>
      row.dateOfBirth
        ? !row.hasYearOfBirthOnly
          ? moment(row.dateOfBirth).format('DD-MM-YYYY')
          : moment(row.dateOfBirth).format('YYYY')
        : 'Chưa xác định',
  },
  {
    Header: 'Ngày bắt đầu chờ vào khu',
    formatter: (row) => moment(row.dateStartedToWait).format('DD-MM-YYYY'),
  },
];

const WaitingSubjectTable = (props) => {
  const { zoneId, zoneName, onApprove, onMove, onRefresh } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [toggleStatus, setToggleStatus] = useState(false);
  const [waitingList, setWaitingList] = useState([]);
  const [getWaitingListLoading, setGetWaitingListLoading] = useState(false);

  const handleRefresh = useCallback(() => {
    setGetWaitingListLoading(true);
    dispatch(getWaitingList(zoneId)).then((res) => {
      setWaitingList(res);
      setGetWaitingListLoading(false);
    });
  }, [dispatch, zoneId]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleSubmit = (d) => {
    const { data, startTime, endTime } = d;

    const { dateOfBirth } = data;
    let formattedDOB = '';
    if (dateOfBirth?.length === 4) {
      formattedDOB = moment(dateOfBirth, 'YYYY')
        .startOf('year')
        .format('YYYY-MM-DD');
    }
    const profileData = {
      ...data,
      dateOfBirth: formattedDOB || dateOfBirth,
      createdFrom: CreateFromType.QUARANTINE,
    };
    dispatch(
      createProfileFromQuarantine({
        profile: profileData,
        quarantineFacilityId: zoneId,
        startTime,
        endTime,
      }),
    ).then(() => {
      setToggleStatus(!toggleStatus);
      handleRefresh();
      onRefresh();
      setModal(false);
    });
  };

  return (
    <div>
      <InstantSearchBar onChange={setSearchValue} />
      <DataTable
        loading={getWaitingListLoading}
        title={`Danh sách chờ tại ${zoneName}`}
        columns={columns}
        data={filterArray(waitingList, searchValue).map((r, i) => ({
          ...r,
          index: i + 1,
        }))}
        actions={[
          {
            icon: <FiPlus />,
            title: 'Thêm',
            color: 'green',
            onClick: () => {
              setModal(true);
            },
            globalAction: true,
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (row) => {
              // window.open(`/subject/${row.id}`, '_blank');
              window.open(`/profile/${row.profileId}`, '_blank');
            },
            disabled: (r) => !r.profileId,
          },
          {
            icon: <FiCheck />,
            title: 'Duyệt',
            color: 'green',
            onClick: onApprove,
          },
          {
            icon: <FiFastForward />,
            title: 'Chuyển khu cách ly',
            color: 'orange',
            onClick: onMove,
            disabled: (row) => row.isCompleted,
          },
        ]}
      />
      <CreateSubjectToQuarantineModal
        key={
          modal
            ? 'OpenCreateSubjectToQuarantineModal'
            : 'CloseCreateSubjectToQuarantineModal'
        }
        open={modal}
        onClose={() => setModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

WaitingSubjectTable.propTypes = {
  zoneId: PropTypes.string,
  zoneName: PropTypes.string,
  onApprove: PropTypes.func,
  onMove: PropTypes.func,
  onRefresh: PropTypes.func,
};

WaitingSubjectTable.defaultProps = {
  zoneId: '',
  zoneName: '',
  onApprove: () => {},
  onMove: () => {},
  onRefresh: () => {},
};

export default WaitingSubjectTable;
