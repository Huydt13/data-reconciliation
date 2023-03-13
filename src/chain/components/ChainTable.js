/* eslint-disable quotes */

import React, { useState, useMemo, useEffect, useCallback } from "react";

import moment from "moment";

import { FiClock, FiEdit2, FiTrash2 } from "react-icons/fi";

import { useSelector, useDispatch } from "react-redux";

import { getDiseaseTypes } from "general/actions/general";

import { getCriterias } from "contact/actions/contact";

import { deleteChain, getChains } from "chain/actions/chain";

import { showConfirmModal } from "app/actions/global";

import { DataTable } from "app/components/shared";

import ChainFilter from "./ChainFilter";

import UpdateChainModal from "./UpdateChainModal";

const ChainTable = () => {
  const {
    diseaseTypeData: { data: diseaseTypeList },

    getDiseaseTypesLoading,
  } = useSelector((s) => s.general);

  const columns = useMemo(
    () => [
      { Header: "Tên chuỗi", accessor: "name" },

      {
        Header: "Loại chuỗi",

        formatter: (r) =>
          r.chainType === 1 ? "Chuỗi nghi ngờ" : "Chuỗi xác định",
      },

      {
        Header: "Loại bệnh",

        formatter: (r) =>
          diseaseTypeList.find((d) => d.id === r.diseaseTypeId)?.name ?? "",
      },

      {
        Header: "Thời gian bắt đầu",

        formatter: (r) => moment(r.fromTime).format("DD-MM-YYYY HH:mm"),
      },

      {
        Header: "Thời gian kết thúc",

        formatter: (r) =>
          r.toTime ? moment(r.toTime).format("DD-MM-YYYY HH:mm") : null,
      },
    ],

    [diseaseTypeList]
  );

  const dispatch = useDispatch();

  const {
    chainData: { data, totalPages },

    getChainsLoading,

    deleteChainLoading,
  } = useSelector((state) => state.chain);

  const [isUpdate, setIsUpdate] = useState(false);

  const [isEnd, setIsEnd] = useState(false);

  const [from, setFrom] = useState(moment().format("YYYY-MM-DD"));

  const [to, setTo] = useState(moment().format("YYYY-MM-DD"));

  const [hideDateFilter, setHideDateFilter] = useState(false);

  const loading =
    getChainsLoading || getDiseaseTypesLoading || deleteChainLoading;

  const [filter, setFilter] = useState({});

  const [pageIndex, setPageIndex] = useState(0);

  const [pageSize, setPageSize] = useState(10);

  const [selecting, setSelecting] = useState({});

  const handleRefresh = useCallback(() => {
    setIsEnd(false);

    setIsUpdate(false);

    dispatch(
      getChains({
        ...filter,

        pageSize,

        pageIndex,

        fromTime: from || filter.fromTime,

        toTime: to || filter.toTime,
      })
    );
  }, [dispatch, filter, pageSize, pageIndex, from, to]);

  useEffect(handleRefresh, [handleRefresh]);

  useEffect(() => {
    dispatch(getCriterias());

    dispatch(getDiseaseTypes({ pageIndex: 0, pageSize: 1000 }));
  }, [dispatch]);

  return (
    <div>
      <ChainFilter hideDateFilter={hideDateFilter} onChange={setFilter} />

      <DataTable
        title="Danh sách chuỗi"
        columns={columns}
        loading={loading}
        data={data.map((r, i) => ({ ...r, index: i + 1 }))}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);

          setPageSize(p.pageSize);
        }}
        pageCount={totalPages}
        filterByDate
        onFilterByDateChange={({ from: f, to: t, hideDateFilter: h }) => {
          setFrom(f);

          setTo(t);

          setHideDateFilter(h);
        }}
        onRowClick={({ id }) => window.open(`/chain/${id}`, "_blank")}
        actions={[
          {
            icon: <FiClock />,

            title: "Kết thúc chuỗi",

            color: "yellow",

            onClick: (r) => {
              setIsEnd(true);

              setSelecting(r);
            },
          },

          {
            icon: <FiEdit2 />,

            title: "Cập nhật",

            color: "violet",

            onClick: (r) => {
              setIsUpdate(true);

              setSelecting(r);
            },
          },

          {
            icon: <FiTrash2 />,

            title: "Xóa",

            color: "red",

            onClick: ({ id }) =>
              dispatch(
                showConfirmModal("Xóa chuỗi?", async () => {
                  await dispatch(deleteChain(id));

                  handleRefresh();
                })
              ),
          },
        ]}
      />

      <UpdateChainModal
        onClose={() => {
          setSelecting({});

          setIsUpdate(false);

          setIsEnd(false);
        }}
        isEnd={isEnd}
        isUpdate={isUpdate}
        data={selecting}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default ChainTable;
