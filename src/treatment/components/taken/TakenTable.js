/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  FiArrowRight,
  FiCheck,
  FiClipboard,
  FiCornerRightUp,
} from 'react-icons/fi';

import { DataTable } from 'app/components/shared';

import { useDispatch, useSelector } from 'react-redux';
import { getEmployees } from 'treatment/actions/employee';
import { getAccountInfo } from 'treatment/actions/account';
import { getFacilities, getFacilityInfo } from 'treatment/actions/facility';
import { getQuarantineListByFacility } from 'treatment/actions/quarantine-list';

import { useAuth } from 'app/hooks';
import {
  checkFilter,
  formatAddressToString,
  formatToTime,
  formatToYear,
  renderGender,
} from 'app/utils/helpers';

import TakenFilter from './TakenFilter';
import CompleteTreatmentModal from '../shared/CompleteTreatmentModal';
import OutOfProcessTreatmentModal from '../shared/OutOfProcessTreatmentModal';
import TransitTreatmentModal from '../shared/TransitTreatmentModal';
import VisitDetailSection from '../shared/VisitDetailSection';
import TransferTreatmentModal from '../shared/TransferTreatmentModal';

const TakenTable = () => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [transferModal, setTransferModal] = useState(false);
  const [transitModal, setTransitModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [outOfProcessModal, setOutOfProcessModal] = useState(false);

  const [openVisitHistory, setOpenVisitHistory] = useState(false);
  const [selectingRow, setSelectingRow] = useState({});

  const accountInfo = useSelector((s) => s.treatment.account.accountInfo);
  const getAccountInfoLoading = useSelector(
    (s) => s.treatment.account.getAccountInfoLoading,
  );
  const facilityInfo = useSelector((s) => s.treatment.facility.facilityInfo);
  const getFacilityInfoLoading = useSelector(
    (s) => s.treatment.facility.getFacilityInfoLoading,
  );

  const { data, pageCount } = useSelector(
    (s) => s.treatment.quarantineList.quarantineListByFacilityData,
  );
  const getDataLoading = useSelector(
    (s) => s.treatment.quarantineList.getQuarantineListByFacilityLoading,
  );

  const { isHcdcDtr } = useAuth();
  const columns = useMemo(() => {
    const defaultColumns = [
      {
        Header: '#',
        accessor: 'index',
      },
      {
        Header: 'Họ và tên',
        formatter: ({ profile }) => profile.fullName,
        cutlength: 50,
      },
      {
        Header: 'Năm sinh',
        formatter: ({ profile }) => formatToYear(profile.dateOfBirth),
      },
      {
        Header: 'Giới tính',
        formatter: ({ profile }) => renderGender(profile),
      },
      {
        Header: 'Số điện thoại',
        formatter: ({ profile }) => profile.phoneNumber,
      },
      {
        Header: 'Địa chỉ nhà',
        formatter: ({ profile }) =>
          formatAddressToString(profile.addressesInVietnam[0] || {}),
      },
      {
        Header: 'Thông tin điều trị',
        formatter: ({ approveDate, expectedEndDate }) => (
          <div>
            <span>{`Từ: ${formatToTime(approveDate)}`}</span>
            <br />
            <span>
              Dự kiến hoàn thành:
              {`${formatToTime(expectedEndDate)}`}
            </span>
          </div>
        ),
      },
    ];
    if (isHcdcDtr) {
      defaultColumns.splice(6, 0, {
        Header: 'Cơ sở điều trị',
        formatter: ({ facility }) => facility.name,
      });
    }
    return defaultColumns;
  }, [isHcdcDtr]);

  useEffect(() => {
    dispatch(getFacilities({ pageSize: 1000, pageIndex: 0 }));
  }, [dispatch]);

  useEffect(() => {
    if (!accountInfo) {
      dispatch(getAccountInfo());
    } else if (accountInfo?.isFacility) {
      dispatch(
        getEmployees({
          facilityId: accountInfo?.facility?.id,
          pageSize: 1000,
          pageIndex: 0,
        }),
      );
    }
  }, [dispatch, accountInfo]);

  useEffect(() => {
    if (!facilityInfo) {
      dispatch(getFacilityInfo());
    }
  }, [dispatch, facilityInfo]);

  const getData = useCallback(() => {
    dispatch(
      getQuarantineListByFacility({
        ...filter,
        pageSize,
        pageIndex,
      }),
    );
  }, [dispatch, filter, pageIndex, pageSize]);

  useEffect(getData, [getData]);

  return (
    <div>
      {openVisitHistory ? (
        <VisitDetailSection
          data={selectingRow}
          onClose={() => setOpenVisitHistory(false)}
        />
      ) : (
        <>
          <TakenFilter
            onChange={(d) => checkFilter(filter, d) && setFilter(d)}
          />
          <DataTable
            title="Danh sách đã tiếp nhận"
            columns={columns}
            data={data.map((d, i) => ({ ...d, index: i + 1 }))}
            actions={[
              {
                icon: <FiArrowRight />,
                color: 'blue',
                title: 'Chuyển khu điều trị',
                onClick: (r) => {
                  setSelectingRow(r);
                  setTransferModal(true);
                },
                hidden: Boolean(accountInfo?.isDoctor),
              },
              {
                icon: <FiClipboard />,
                color: 'blue',
                title: 'Thăm khám và lịch sử',
                onClick: (r) => {
                  setOpenVisitHistory(true);
                  setSelectingRow(r);
                },
                hidden: Boolean(accountInfo?.isFacility),
              },
              {
                icon: <FiCornerRightUp />,
                color: 'teal',
                title: 'Chuyển tuyến trên',
                onClick: (r) => {
                  setSelectingRow(r);
                  setTransitModal(true);
                },
                hidden: Boolean(accountInfo?.isFacility),
              },
              {
                icon: <FiArrowRight />,
                color: 'violet',
                title: 'Chuyển đến ngoài quy trình',
                onClick: (r) => {
                  setSelectingRow(r);
                  setOutOfProcessModal(true);
                },
                hidden: Boolean(accountInfo?.isFacility),
              },
              {
                icon: <FiCheck />,
                color: 'green',
                title: 'Hoàn thành điều trị',
                onClick: (r) => {
                  setSelectingRow(r);
                  setCompleteModal(true);
                },
                hidden: Boolean(accountInfo?.isFacility),
              },
            ]}
            loading={
              getFacilityInfoLoading || getAccountInfoLoading || getDataLoading
            }
            pageCount={pageCount}
            onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
              setPageSize(ps);
              setPageIndex(pi);
            }}
          />
        </>
      )}
      <TransferTreatmentModal
        open={transferModal}
        onClose={() => setTransferModal(false)}
        data={selectingRow}
        getData={getData}
      />
      <TransitTreatmentModal
        key={transitModal ? 'OpenTransitModal' : 'CloseTransitModal'}
        open={transitModal}
        onClose={() => setTransitModal(false)}
        data={selectingRow}
        getData={getData}
      />
      <CompleteTreatmentModal
        key={completeModal ? 'OpenCompleteModal' : 'CloseCompleteModal'}
        open={completeModal}
        onClose={() => setCompleteModal(false)}
        data={selectingRow}
        getData={getData}
      />
      <OutOfProcessTreatmentModal
        key={
          outOfProcessModal ? 'OpenOutOfProcessModal' : 'CloseOutOfProcessModal'
        }
        open={outOfProcessModal}
        onClose={() => setOutOfProcessModal(false)}
        data={selectingRow}
        getData={getData}
      />
    </div>
  );
};

export default TakenTable;
