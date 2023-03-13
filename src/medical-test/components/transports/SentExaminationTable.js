/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Header, Label } from 'semantic-ui-react';

import { DataTable, InstantSearchBar } from 'app/components/shared';
import { transportCheckingList } from 'infection-chain/utils/helpers';
import {
  deburr,
  formatToTime,
  renderExaminationResult,
} from 'app/utils/helpers';

const LabelWrapper = styled.div`
  text-align: right;
  padding: 1rem 0;
`;

const SentExaminationTable = (props) => {
  const { isDisplayLabelNote, initialData, selectable, onChange } = props;

  const [searchValue, setSearchValue] = useState('');

  const columns = [
    { Header: '#', accessor: 'idx' },
    {
      Header: 'Mã xét nghiệm',
      accessor: 'code',
      copiable: true,
      formatter: ({ code, exception }) => exception ? (
        <Label basic content={code} color={exception} />
        ) : code?.length === 12 ? (
          <b>{code}</b>
        ) : (
          <span>{code}</span>
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
        resultDate,
        cT_E: e,
        cT_N: n,
        cT_RdRp: r,
        orF1ab: o,
        index: i,
      }) => result ? (
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
  const data = useMemo(
    () => (initialData || []).map((r, i) => ({
        ...r.examinationDetail,
        idx: i + 1,
        exception: r.exception,
      })),
    [initialData]
  );
  const defaultSelected = useMemo(
    () => (initialData || []).map((r) => r.examinationDetail.id),
    [initialData]
  );

  return (
    <>
      {isDisplayLabelNote && (
        <LabelWrapper>
          {transportCheckingList.map((t) => (
            <Label key={t.value} basic color={t.color} content={t.label} />
          ))}
        </LabelWrapper>
      )}
      <InstantSearchBar onChange={setSearchValue} />
      <DataTable
        title='Danh sách mẫu hiện tại trong phiên'
        selectable={selectable}
        columns={columns}
        data={data.filter((d) => deburr(d?.person?.name + d.code).includes(deburr(searchValue))
        )}
        actions={[]}
        defaultSelected={defaultSelected}
        onSelectionChange={(row) => {
          onChange(row);
        }}
      />
    </>
  );
};

SentExaminationTable.propTypes = {
  selectable: PropTypes.bool,
  isDisplayLabelNote: PropTypes.bool,
  initialData: PropTypes.arrayOf(PropTypes.shape({})),
  onChange: PropTypes.func,
};

SentExaminationTable.defaultProps = {
  selectable: false,
  isDisplayLabelNote: false,
  initialData: [],
  onChange: () => {},
};

export default SentExaminationTable;
