/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import { getExaminationByDetail } from 'medical-test/actions/medical-test';

import { DataTable, InfoRow } from 'app/components/shared';
import { Header, Label } from 'semantic-ui-react';
import {
  deburr,
  formatToTime,
  renderExaminationResult,
} from 'app/utils/helpers';
import { getImportantType } from 'infection-chain/utils/helpers';

const PersonalExamHistoryDetailTable = ({ data }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      dispatch(getExaminationByDetail(data.examinationId));
    }
  }, [dispatch, data]);

  const getExaminationDetailLoading = useSelector(
    (s) => s.medicalTest.getExaminationDetailLoading
  );
  const examinationDetail = useSelector((s) => s.medicalTest.examinationDetail);

  const columns = [
    { Header: '#', accessor: 'idx' },
    {
      Header: 'Mã',
      formatter: ({ importantValue, code }) => (
        <Label
          size='small'
          basic
          color={getImportantType(importantValue)?.color}
        >
          {code.length < 10
            ? code
            : code.substring(3, 6).concat(code.substring(8))}
        </Label>
      ),
    },
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
      formatter: ({ diseaseSample, isGroup }) => (
        <div>
          <Header sub>{diseaseSample?.name}</Header>
          <span>
            {examinationDetail?.feeType === 0
              ? 'Không thu phí | '
              : 'Thu phí | '}
            {isGroup ? 'Mẫu gộp' : 'Mẫu đơn'}
          </span>
        </div>
      ),
    },
    {
      Header: 'Thông tin xét nghiệm',
      formatter: ({ unitName, resultDate }) => (
        <div>
          <Header sub>{unitName}</Header>
          <span>{formatToTime(resultDate)}</span>
        </div>
      ),
    },
    {
      Header: 'Kết quả',
      formatter: ({
        result,
        cT_E: e,
        cT_N: n,
        cT_RdRp: r,
        orF1ab: o,
        index: i,
      }) =>
        result ? (
          <div>
            <Header sub>{renderExaminationResult(result)}</Header>
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
    <>
      <InfoRow
        big
        label='Lý do xét nghiệm'
        content={examinationDetail?.examinationType?.name ?? '...'}
      />
      <InfoRow
        big
        label='Nơi lấy mẫu'
        content={examinationDetail?.samplingPlace?.name ?? '...'}
      />
      <DataTable
        title='Danh sách mẫu bệnh phẩm'
        columns={columns}
        loading={getExaminationDetailLoading}
        data={(examinationDetail?.examinationDetails ?? []).map((ex, i) => ({
          ...ex,
          idx: i + 1,
        }))}
        actions={[]}
      />
    </>
  );
};

PersonalExamHistoryDetailTable.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
  }),
};

PersonalExamHistoryDetailTable.defaultProps = {
  data: undefined,
};

export default PersonalExamHistoryDetailTable;
