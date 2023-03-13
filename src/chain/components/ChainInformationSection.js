import React, { useState, useMemo, useEffect, useCallback } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FiClock, FiEdit2, FiTrash2 } from 'react-icons/fi';

// import { useAuth } from 'app/hooks';
import { useParams } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import { getDiseaseTypes } from 'general/actions/general';
import { getCriterias } from 'contact/actions/contact';
import {
  // checkPositive,
  deleteChain,
  getChains,
  selectChain,
} from 'chain/actions/chain';

import { DataTable } from 'app/components/shared';
import CreateChainModal from './CreateChainModal';
import UpdateChainModal from './UpdateChainModal';

const ChainInformationSection = ({ profileId }) => {
  const dispatch = useDispatch();
  // const { isAdmin } = useAuth();

  const {
    diseaseTypeData: { data: diseaseTypeList },
    getDiseaseTypesLoading,
  } = useSelector((s) => s.general);

  const columns = useMemo(
    () => [
      { Header: 'Tên chuỗi', accessor: 'name' },
      {
        Header: 'Loại chuỗi',
        formatter: (r) =>
          r.chainType === 1 ? 'Chuỗi nghi ngờ' : 'Chuỗi xác định',
      },
      {
        Header: 'Loại bệnh',
        formatter: (r) =>
          diseaseTypeList.find((d) => d.id === r.diseaseTypeId)?.name ?? '',
      },
      {
        Header: 'Thời gian bắt đầu',
        formatter: (r) => moment(r.fromTime).format('DD-MM-YYYY HH:mm'),
      },
      {
        Header: 'Thời gian kết thúc',
        formatter: (r) =>
          r.toTime ? moment(r.toTime).format('DD-MM-YYYY HH:mm') : null,
      },
    ],
    [diseaseTypeList],
  );

  const {
    chainData: { data, totalPages },
    // checkingList,
    checkPositiveLoading,
    getChainsLoading,
    deleteChainLoading,
  } = useSelector((state) => state.chain);

  // select chain if params have chainId
  const { chainId } = useParams();
  useEffect(() => {
    if (chainId && data.length) {
      dispatch(selectChain(data.find((chain) => chain.id === chainId)));
    }
  }, [dispatch, chainId, data]);

  const loading =
    checkPositiveLoading ||
    getChainsLoading ||
    deleteChainLoading ||
    getDiseaseTypesLoading;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isEnd, setIsEnd] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const handleRefresh = useCallback(() => {
    dispatch(
      getChains({
        profileId,
        pageSize,
        pageIndex,
      }),
    );
  }, [dispatch, profileId, pageSize, pageIndex]);

  useEffect(handleRefresh, [handleRefresh]);

  // const checkPositiveCallback = useCallback(() => {
  //   if (diseaseTypeList.length && profileId) {
  //     const diseaseTypeId =
  //       diseaseTypeList.find((d) => d.name.includes('19'))?.id ?? '';
  //     dispatch(checkPositive({ profileId, diseaseTypeId }));
  //   }
  // }, [dispatch, diseaseTypeList, profileId]);
  // useEffect(checkPositiveCallback, [checkPositiveCallback]);
  useEffect(() => {
    dispatch(getCriterias());
    dispatch(getDiseaseTypes({ pageIndex: 0, pageSize: 1000 }));
  }, [dispatch]);

  const [createModal, setCreateModal] = useState(false);
  const [selecting, setSelecting] = useState({});

  return (
    <div>
      <DataTable
        columns={columns}
        loading={loading}
        data={data.map((r, i) => ({ ...r, index: i + 1 }))}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        onRowClick={(r) => dispatch(selectChain(r))}
        pageCount={totalPages}
        actions={[
          // {
          //   content: 'Xác nhận F0 và tạo chuỗi',
          //   color: 'red',
          //   globalAction: true,
          //   hidden:
          //     !isAdmin ||
          //     checkingList.length === 0 ||
          //     checkingList.find((check) => check.profileId === profileId)
          //       ?.hasPositiveSubjects === true,
          //   onClick: () => setCreateModal(true),
          // },
          {
            icon: <FiClock />,
            title: 'Kết thúc chuỗi',
            color: 'yellow',
            onClick: (r) => {
              setIsEnd(true);
              setSelecting(r);
            },
          },
          {
            icon: <FiEdit2 />,
            title: 'Cập nhật',
            color: 'violet',
            onClick: (r) => {
              setIsUpdate(true);
              setSelecting(r);
            },
          },
          {
            icon: <FiTrash2 />,
            title: 'Xóa',
            color: 'red',
            onClick: ({ id }) =>
              dispatch(
                showConfirmModal('Xóa chuỗi?', async () => {
                  await dispatch(deleteChain(id));
                  handleRefresh();
                }),
              ),
          },
        ]}
      />

      <CreateChainModal
        open={createModal}
        profileId={profileId}
        onClose={() => setCreateModal(false)}
        onRefresh={() => {
          handleRefresh();
          // checkPositiveCallback();
        }}
      />
      <UpdateChainModal
        key={
          isEnd || isUpdate ? 'OpenUpdateChainModal' : 'CloseUpdateChainModal'
        }
        data={selecting}
        isEnd={isEnd}
        isUpdate={isUpdate}
        onClose={() => {
          setIsEnd(false);
          setIsUpdate(false);
          setSelecting(null);
        }}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

ChainInformationSection.propTypes = {
  profileId: PropTypes.number,
};

ChainInformationSection.defaultProps = {
  profileId: 0,
};

export default ChainInformationSection;
