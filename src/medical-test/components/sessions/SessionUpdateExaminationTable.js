/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { FiEdit2 } from 'react-icons/fi';
import { Header } from 'semantic-ui-react';

import { useAuth } from 'app/hooks';
import { DataTable } from 'app/components/shared';
import { useSelector } from 'react-redux';
import {
  deburr,
  formatToTime,
  renderExaminationResult,
} from 'app/utils/helpers';

const SessionUpdateExaminationTable = ({ updatable, data, onChange }) => {
  const { isHcdcXng, isMasterXng } = useAuth();

  const { unitInfo } = useSelector((state) => state.medicalTest);

  const isJoiningExam =
    unitInfo?.isTester && unitInfo?.isCollector && unitInfo?.isReceiver;

  const columns = [
    { Header: '#', accessor: 'idx' },
    { Header: 'Mã sơ cấp', formatter: (row) => row.code },
    { Header: 'Mã thứ cấp', formatter: (row) => row?.secondaryCode },
    {
      Header: 'Họ và tên',
      formatter: (row) => row?.person?.name,
      cutlength: 50,
    },
    {
      Header: 'Thông tin lấy mẫu',
      formatter: ({ unitTaken, dateTaken }) => (
        <div>
          <Header sub>{unitTaken?.name}</Header>
          <span>{formatToTime(dateTaken)}</span>
        </div>
      ),
    },
    {
      Header: 'Mẫu',
      formatter: ({ diseaseSample, feeType, isGroup }) => (
        <div>
          <Header sub>{diseaseSample?.name}</Header>
          <span>
            {feeType === 0 ? 'Không thu phí | ' : 'Thu phí | '}
            {isGroup ? 'Mẫu gộp' : 'Mẫu đơn'}
          </span>
        </div>
      ),
    },
    {
      Header: 'Thông tin xét nghiệm',
      formatter: ({ unitName, testTechnique }) => (
        <div>
          <Header sub>{unitName}</Header>
          <span>{testTechnique}</span>
        </div>
      ),
    },
    {
      Header: 'Kết quả',
      formatter: ({
        result,
        resultDate,
        cT_E: e,
        cT_N: n,
        cT_RdRp: r,
        orF1ab: o,
        index: i,
      }) =>
        result ? (
          <div>
            <Header sub>{renderExaminationResult(result)}</Header>
            <span>{formatToTime(resultDate)}</span>
            <br />
            {deburr(result) === deburr('Dương tính') && (
              <span>
                {`CT N: ${n ?? ''} | CT E: ${e ?? ''} | CT RdRp: ${
                  r ?? ''
                } | CT ORF1ab: ${o ?? ''} | Index(0.5-150):${i ?? ''}`}
              </span>
            )}
          </div>
        ) : (
          ''
        ),
    },
  ];

  return (
    <DataTable
      title='Danh sách mẫu trong phiên'
      columns={columns}
      data={(data || []).map((r, i) => ({ ...r, idx: i + 1 }))}
      actions={[
        {
          title: 'Cập nhật',
          icon: <FiEdit2 />,
          color: 'violet',
          onClick: onChange,
          hidden: (r) =>
            !updatable ||
            Boolean(r.result) ||
            !(isHcdcXng || isMasterXng || isJoiningExam),
        },
      ]}
    />
  );
};

SessionUpdateExaminationTable.propTypes = {
  updatable: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  onChange: PropTypes.func,
};

SessionUpdateExaminationTable.defaultProps = {
  updatable: true,
  data: [],
  onChange: () => {},
};

export default SessionUpdateExaminationTable;
