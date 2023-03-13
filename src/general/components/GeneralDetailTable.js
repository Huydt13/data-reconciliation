import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Label } from 'semantic-ui-react';
import { FiCheck, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import {
  getDiseaseTypes,
  getInfectionTypes,
  deleteDiseaseType,
  deleteInfectionType,
  getCriterias,
} from 'general/actions/general';

import { DataTable } from 'app/components/shared';
import { Generals } from 'general/utils/constants';
import UpdateGeneralModal from './UpdateGeneralModal';
import CreateGeneralModal from './CreateGeneralModal';

const GeneralDetailTable = () => {
  const {
    selectedGeneral,
    criteriaData,
    diseaseTypeData: { data: diseaseTypeData, totalPages: diseaseTypePages },
    infectionTypeData: {
      data: infectionTypeData,
      totalPages: infectionTypePages,
    },
    getDiseaseTypesLoading,
    deleteDiseaseTypeLoading,
    getInfectionTypesLoading,
    deleteInfectionTypeLoading,
  } = useSelector((s) => s.general);
  const loading =
    getDiseaseTypesLoading ||
    deleteDiseaseTypeLoading ||
    getInfectionTypesLoading ||
    deleteInfectionTypeLoading;

  const dispatch = useDispatch();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const getData = useCallback(() => {
    switch (selectedGeneral.value) {
      case Generals.CRITERIAS:
        dispatch(getCriterias());
        dispatch(getInfectionTypes({ pageSize: 1000, pageIndex: 0 }));
        dispatch(getDiseaseTypes({ pageSize: 1000, pageIndex: 0 }));
        break;
      case Generals.DISEASE_TYPE:
        dispatch(getDiseaseTypes({ pageSize, pageIndex }));
        break;
      case Generals.INFECTION_TYPE:
        dispatch(getDiseaseTypes({ pageSize: 1000, pageIndex: 0 }));
        dispatch(getInfectionTypes({ pageSize, pageIndex }));
        break;
      default:
        break;
    }
  }, [dispatch, selectedGeneral, pageSize, pageIndex]);
  useEffect(getData, [getData]);

  const columns = useMemo(() => {
    const defaultColumns = [
      { Header: '#', accessor: 'index' },
      {
        Header: selectedGeneral.name,
        formatter: (row) => {
          if (selectedGeneral.value === Generals.INFECTION_TYPE) {
            return (
              <Label
                basic
                color={row?.colorCode ?? 'black'}
                content={row?.name ?? 'F?'}
                className="type-label"
              />
            );
          }
          return row.name;
        },
      },
    ];
    switch (selectedGeneral.value) {
      case Generals.INFECTION_TYPE:
        {
          const addingColumns = [
            {
              Header: 'Loại bệnh',
              formatter: (r) =>
                diseaseTypeData.find((d) => d.id === r.diseaseTypeId)?.name,
            },
            {
              Header: 'Dương tính',
              formatter: (r) => (r.isPositive ? <FiCheck /> : null),
            },
          ];
          defaultColumns.splice(2, 0, ...addingColumns);
        }
        return defaultColumns;
      case Generals.CRITERIAS:
        {
          const addingColumns = [
            {
              Header: 'Loại tiếp xúc',
              accessor: 'categoryName',
            },
            {
              Header: 'Loại bệnh',
              formatter: (r) => {
                const diseaseTypeId = infectionTypeData.find(
                  (d) => d.id === r.infectionTypeId,
                )?.diseaseTypeId;
                return diseaseTypeData?.find((d) => d.id === diseaseTypeId)
                  ?.name;
              },
            },
            {
              Header: 'Loại nhãn',
              formatter: (r) => {
                const infectionType = infectionTypeData.find(
                  (d) => d.id === r.infectionTypeId,
                );
                return (
                  <Label
                    basic
                    color={infectionType?.colorCode ?? 'black'}
                    content={infectionType?.name ?? 'F?'}
                    className="type-label"
                  />
                );
              },
            },
          ];
          defaultColumns.splice(2, 0, ...addingColumns);
        }
        return defaultColumns;
      default:
        return defaultColumns;
    }
  }, [selectedGeneral, diseaseTypeData, infectionTypeData]);

  const data = useMemo(() => {
    switch (selectedGeneral.value) {
      case Generals.DISEASE_TYPE:
        return diseaseTypeData;
      case Generals.INFECTION_TYPE:
        return infectionTypeData;
      case Generals.CRITERIAS:
        return criteriaData.reduce(
          (acc, current) => [
            ...acc,
            ...current.criterias.map((c) => ({
              ...c,
              categoryId: current.id,
              categoryName: current.name,
              infectionTypeId: current.infectionTypeId,
            })),
          ],
          [],
        );
      default:
        break;
    }
    return [];
  }, [selectedGeneral, diseaseTypeData, infectionTypeData, criteriaData]);

  const pageCount = useMemo(() => {
    switch (selectedGeneral.value) {
      case Generals.DISEASE_TYPE:
        return diseaseTypePages;
      case Generals.INFECTION_TYPE:
        return infectionTypePages;
      default:
        return 0;
    }
  }, [selectedGeneral, diseaseTypePages, infectionTypePages]);

  const [createGeneralModal, setCreateGeneralModal] = useState(false);
  const [updateGeneralModal, setUpdateGeneralModal] = useState(false);
  const [selectingRow, setSelectingRow] = useState({});

  const handleDelete = (r) => {
    dispatch(
      showConfirmModal('Xác nhận xóa?', async () => {
        switch (selectedGeneral.value) {
          case Generals.DISEASE_TYPE:
            await dispatch(deleteDiseaseType(r.id));
            break;
          case Generals.INFECTION_TYPE:
            await dispatch(deleteInfectionType(r.id));
            break;
          default:
            break;
        }
        getData();
      }),
    );
  };
  return (
    <div>
      <DataTable
        title={`Danh sách ${selectedGeneral.name.toLowerCase()}`}
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={loading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageSize(p.pageSize);
          setPageIndex(p.pageIndex);
        }}
        actions={[
          {
            icon: <FiPlus />,
            title: 'Thêm',
            color: 'green',
            onClick: () => {
              setCreateGeneralModal(true);
            },
            globalAction: true,
          },
          {
            icon: <FiEdit2 />,
            title: 'Sửa',
            color: 'violet',
            onClick: (r) => {
              setUpdateGeneralModal(true);
              setSelectingRow(r);
            },
          },
          {
            icon: <FiTrash2 />,
            title: 'Xóa',
            color: 'red',
            onClick: handleDelete,
          },
        ]}
      />

      <CreateGeneralModal
        key={
          createGeneralModal
            ? 'OpenCreateGeneralModal'
            : 'CloseCreateGeneralModal'
        }
        open={createGeneralModal}
        onClose={() => setCreateGeneralModal(false)}
        onRefresh={getData}
      />

      <UpdateGeneralModal
        key={
          updateGeneralModal
            ? 'OpenUpdateGeneralModal'
            : 'CloseUpdateGeneralModal'
        }
        open={updateGeneralModal}
        data={selectingRow}
        onClose={() => setUpdateGeneralModal(false)}
        onRefresh={getData}
      />
    </div>
  );
};

export default GeneralDetailTable;
