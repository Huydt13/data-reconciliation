/* eslint-disable no-nested-ternary */
import React, {
  useState,
  useEffect,
} from 'react';
import {
  FiFileText, FiPlus, FiPlusCircle,
} from 'react-icons/fi';
import { Label } from 'semantic-ui-react';

import moment from 'moment';

import { DataTable } from 'app/components/shared';

import { useSelector, useDispatch } from 'react-redux';

import {
  getMedicalTests, toggleCreateModal, createMedicalTest,
} from 'medical-test/actions/medical-test';

import { getSubjectType } from 'infection-chain/utils/helpers';
import { showConfirmModal } from 'app/actions/global';
import { updateSubject, createSubject } from 'infection-chain/actions/subject';
import { CreateFromType } from 'infection-chain/utils/constants';
import MedicalTestFilter from './MedicalTestFilter';
import CreateMedicalTestModal from './CreateMedicalTestModal';
import CreateSubjectToMedicalTestModal from './CreateSubjectToMedicalTestModal';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Loại',
    formatter: (row) => {
      const { label, color } = getSubjectType(row?.subjectType);
      return <Label basic color={color} content={label} className="type-label" />;
    },
  },
  { Header: 'Tên đối tượng', accessor: 'subjectName' },
  { Header: 'Ngày lẫy mẫu mới nhất', formatter: (row) => (row.id ? moment(row.takenDate).format('DD-MM-YYYY') : '') },
  { Header: 'Nơi xét nghiệm mới nhất', accessor: 'resultFrom' },
  { Header: 'Kết quả xét nghiệm mới nhất', formatter: (row) => (row.id ? (row.isPositive === null ? 'Chưa xác định' : (row.isPositive ? 'Dương tính' : 'Âm tính')) : '') },
];

const MedicalTestTable = () => {
  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectingSubjectId, setSelectingSubjectId] = useState('');

  const {
    createModal,
    medicalTestData,
    getMedicalTestsLoading,
    createMedicalTestLoading,
    updateMedicalTestLoading,
    deleteMedicalTestLoading,
  } = useSelector((state) => state.medicalTest);

  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(getMedicalTests({
      ...filter,
      pageIndex,
      pageSize,
    }));
  };

  // eslint-disable-next-line
  useEffect(() => { handleRefresh(); }, [
    filter,
    pageIndex,
    pageSize,
  ]);

  const { subject } = useSelector((state) => state.subject);
  const [modal, setModal] = useState(false);

  const handleSubmit = (d) => {
    const data = {
      ...d,
      subjectId: subject.id,
      isPositive: d.isPositive === 0 ? '' : d.isPositive,
    };
    if (d.isPositive && d.isFinalResult) {
      dispatch(showConfirmModal('Bạn có chắc chắn đối tượng này dương tính?', () => {
        const {
          information,
          diseaseLocation,
          code,
        } = subject;
        const { alias } = information;
        dispatch(updateSubject({
          ...subject,
          code: d?.code ?? code,
          information: {
            ...information,
            alias: d?.alias ?? alias,
          },
          diseaseLocation: d?.diseaseLocation ?? diseaseLocation,
        })).then(() => {
          dispatch(toggleCreateModal());
          dispatch(createMedicalTest(data)).then(() => {
            handleRefresh();
          });
        });
      }));
    } else {
      dispatch(toggleCreateModal());
      dispatch(createMedicalTest(data)).then(() => {
        handleRefresh();
      });
    }
  };

  const { data, pageCount } = medicalTestData;

  const handleCreate = (d) => {
    const { data: medData, medicalTest } = d;
    const { information } = medData;
    const { dateOfBirth } = information;
    let formattedDOB = '';
    if (dateOfBirth?.length === 4) {
      formattedDOB = moment(dateOfBirth, 'YYYY').startOf('year').format('YYYY-MM-DD');
    }

    const creatingSubject = {
      ...medData,
      information: {
        ...information,
        dateOfBirth: formattedDOB || dateOfBirth || '',
      },
      type: null,
      createFromType: CreateFromType.QUARANTINE,
    };
    dispatch(createSubject(creatingSubject)).then((res) => {
      const medicalData = {
        ...medicalTest,
        subjectId: res,
        isPositive: medicalTest.isPositive === 0 ? '' : medicalTest.isPositive,
      };
      dispatch(createMedicalTest(medicalData)).then(() => {
        handleRefresh();
      }).then(() => {
        setModal(false);
      });
    });
  };

  return (
    <div>
      <MedicalTestFilter onChange={(e) => { setFilter(e); }} />
      <DataTable
        title="Quản lý xét nghiệm"
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={
          getMedicalTestsLoading
          || createMedicalTestLoading
          || updateMedicalTestLoading
          || deleteMedicalTestLoading
        }
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiPlus />,
            title: 'Thêm',
            color: 'green',
            onClick: () => setModal(true),
            globalAction: true,
          },
          {
            icon: <FiPlusCircle />,
            title: 'Thêm xét nghiệm',
            color: 'teal',
            onClick: (row) => {
              setSelectingSubjectId(row.subjectId);
              dispatch(toggleCreateModal());
            },
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: (row) => {
              window.open(`/subject/${row.subjectId}/medical-test`, '_blank');
            },
          },
        ]}
      />
      <CreateMedicalTestModal
        key={createModal ? 'OpenCreateMedicalTestModal' : 'CloseCreateMedicalTestModal'}
        open={createModal}
        subjectId={selectingSubjectId}
        handleSubmit={handleSubmit}
        onClose={() => dispatch(toggleCreateModal())}
      />

      <CreateSubjectToMedicalTestModal
        key={modal ? 'OpenCreateSubjectToMedicalTestModal' : 'CloseCreateSubjectToMedicalTestModal'}
        open={modal}
        onClose={() => setModal(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default MedicalTestTable;
