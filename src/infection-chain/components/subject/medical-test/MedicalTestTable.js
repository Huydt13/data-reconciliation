/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import moment from 'moment';

import { Label } from 'semantic-ui-react';
import { FiCommand, FiRefreshCw } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { DataTable } from 'app/components/shared';

import { useSelector, useDispatch } from 'react-redux';
import {
  createExamination,
  updateExamination,
  getExaminationByPerson,
  getUnitInfo,
  getByProfileId,
  createAssignWithDate,
  updateProfile,
  getPrefixes,
} from 'medical-test/actions/medical-test';

import { getImportantType } from 'infection-chain/utils/helpers';
import { renderExaminationResult } from 'app/utils/helpers';
import { CreateFromType } from 'infection-chain/utils/constants';

import MedicalTestModal from './MedicalTestModal';
import ProcessModal from './ProcessModal';
import MedicalTestDetailModal from './MedicalTestDetailModal';

const columns = [
  {
    Header: 'Mã xét nghiệm',
    formatter: ({ code }) => (code?.length === 12 ? <b>{code}</b> : code),
  },
  {
    Header: 'Mẫu',
    formatter: (row) => row?.diseaseSample?.name,
    // cutlength: 10,
  },
  {
    Header: 'Nơi lấy',
    formatter: (row) => row.unitTaken?.name,
    // cutlength: 10,
  },
  {
    Header: 'Ngày lấy',
    formatter: (row) =>
      row.dateTaken ? moment(row.dateTaken).format('DD-MM-YY HH:mm') : '',
    // cutlength: 8,
  },
  {
    Header: 'Ưu tiên',
    formatter: ({ importantValue }) => (
      <>
        <Label
          empty
          circular
          style={{ marginRight: '5px' }}
          key={getImportantType(importantValue)?.color}
          color={getImportantType(importantValue)?.color}
        />
        {getImportantType(importantValue)?.label}
      </>
    ),
  },
  {
    Header: 'Nơi xét nghiệm',
    formatter: (row) => row?.unitName,
    // cutlength: 10,
  },
  {
    Header: 'Thời gian có KQ',
    formatter: (row) =>
      row.resultDate ? moment(row.resultDate).format('DD-MM-YY HH:mm') : '',
    // cutlength: 8,
  },
  {
    Header: 'Kết quả',
    formatter: ({ result }) => renderExaminationResult(result),
  },
];

const MedicalTestTable = (props) => {
  const { profile, onRefresh } = props;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(null);

  const [examModal, setExamModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);

  const {
    unitInfo,
    prefixList,
    examinationByPersonData,
    getMedicalTestLoading,
    createMedicalTestLoading,
    updateMedicalTestLoading,
    deleteMedicalTestLoading,
    createAssignLoading,
    getExaminationByPersonLoading,
    getPeopleByProfileIdLoading,
    peopleByProfile,
    updateProfileLoading,
  } = useSelector((state) => state.medicalTest);

  const loading =
    getPeopleByProfileIdLoading ||
    getExaminationByPersonLoading ||
    getMedicalTestLoading ||
    createMedicalTestLoading ||
    updateMedicalTestLoading ||
    deleteMedicalTestLoading ||
    createAssignLoading ||
    updateProfileLoading;

  const dispatch = useDispatch();

  const { id } = useParams();
  // === ko - is profileId, có - là guid
  const isProfileId = id.indexOf('-') === -1;
  const personId = profile?.id ?? id;

  // if profile then get examination id of that person
  useEffect(() => {
    if (isProfileId) {
      dispatch(getByProfileId(personId));
    }
  }, [dispatch, personId, isProfileId]);

  // if profile then get examination
  const handleRefresh = () => {
    if (isProfileId && peopleByProfile) {
      dispatch(
        getExaminationByPerson({
          personId: peopleByProfile?.id,
          pageIndex,
          pageSize,
        }),
      );
    } else if (!isProfileId) {
      dispatch(
        getExaminationByPerson({
          personId: id,
          pageIndex,
          pageSize,
        }),
      );
    }
  };

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, [peopleByProfile, pageIndex, pageSize]);

  const handleSubmit = (d) => {
    dispatch(!d.id ? createExamination(d) : updateExamination(d)).then(() => {
      setSelected(null);
      setExamModal(false);
      onRefresh();
      handleRefresh();
    });
  };

  const { data, pageCount } = examinationByPersonData;
  const [processModal, setProcessModal] = useState(false);
  const handleProcess = (d) => {
    dispatch(
      createAssignWithDate({
        ...d,
        profileId: personId,
      }),
    ).then(() => {
      handleRefresh();
      setProcessModal(false);
    });
  };

  useEffect(() => {
    if (!unitInfo) {
      dispatch(getUnitInfo());
    }
    if (prefixList.length === 0) {
      dispatch(getPrefixes());
    }
    // eslint-disable-next-line
  }, [dispatch]);

  return (
    <div>
      <DataTable
        title="Lịch sử xét nghiệm"
        columns={columns}
        data={_.flatMapDeep(
          (data || []).map(({ examinationDetails: ex }) => [...ex]),
        )}
        loading={loading}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiRefreshCw />,
            title: 'Đồng bộ dữ liệu hồ sơ',
            color: 'blue',
            globalAction: true,
            onClick: () => dispatch(updateProfile(id)),
          },
          {
            icon: <FiCommand />,
            title: 'Chỉ định xét nghiệm',
            color: 'yellow',
            globalAction: true,
            onClick: () => setProcessModal(true),
            disabled: !(
              profile?.cccd ||
              profile?.cmnd ||
              profile?.passportNumber ||
              profile?.healthInsuranceNumber
            ),
            hidden: profile?.createFromType === CreateFromType.QUARANTINE,
          },
        ]}
      />

      <MedicalTestModal
        key={
          examModal
            ? 'OpenCreateMedicalTestModal'
            : 'CloseCreateMedicalTestModal'
        }
        open={examModal}
        profile={profile}
        examination={selected}
        handleSubmit={handleSubmit}
        onClose={() => setExamModal(false)}
      />

      <MedicalTestDetailModal
        key={
          examModal
            ? 'OpenDetailMedicalTestModal'
            : 'CloseDetailMedicalTestModal'
        }
        open={detailModal}
        data={selected}
        onClose={() => setDetailModal(false)}
      />

      <ProcessModal
        key={processModal ? 'OpenProcessModal' : 'CloseProcessModal'}
        open={processModal}
        onClose={() => setProcessModal(false)}
        onSubmit={handleProcess}
      />
    </div>
  );
};

MedicalTestTable.propTypes = {
  onRefresh: PropTypes.func,
  profile: PropTypes.shape({
    id: PropTypes.number,
    diseaseLocation: PropTypes.shape({}),
    type: PropTypes.number,
    code: PropTypes.string,
    createFromType: PropTypes.number,
  }),
};

MedicalTestTable.defaultProps = {
  onRefresh: () => {},
  profile: {},
};

export default MedicalTestTable;
