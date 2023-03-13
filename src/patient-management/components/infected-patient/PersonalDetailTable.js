/* eslint-disable react/prop-types */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { DataTable, InfoRow } from 'app/components/shared';
import { Header } from 'semantic-ui-react';
import {
  formatToTime,
  renderExaminationResult,
} from 'app/utils/helpers';

const immunizationStatusOptions = [
  { key: 0, value: 0, text: 'Chưa tiêm' },
  { key: 1, value: 1, text: 'Tiêm 1 mũi' },
  { key: 2, value: 2, text: 'Tiêm 2 mũi' },
  { key: 3, value: 3, text: 'Chưa rõ' },
  { key: 4, value: 4, text: 'Tiêm trên 2 mũi' },
];

const PersonalQuickTestHistoryDetailTable = ({ data }) => {
  const columns = [
    { Header: '#', accessor: 'index' },
    { Header: 'Mã', accessor: 'code' },
    {
      Header: 'Họ và tên',
      formatter: (row) => row?.person?.name,
      cutlength: 50,
    },
    {
      Header: 'Tình trạng tiêm vắc xin',
      formatter: ({ vaccinationStatus, lastInjectionDate }) => (
        <div>
          {typeof vaccinationStatus !== 'undefined' ? (
            <Header sub>
              {immunizationStatusOptions.find((o) => o.value === vaccinationStatus)?.text ?? ''}
            </Header>
          ) : null}
          {typeof lastInjectionDate !== 'undefined' && vaccinationStatus !== 0 && vaccinationStatus !== 3 ? (
            <span>{moment(lastInjectionDate).format('DD-MM-YYYY')}</span>
          ) : null}
        </div>
      ),
    },
    {
      Header: 'Thông tin lấy mẫu',
      formatter: ({ unit: { name }, date }) => (
        <div>
          <Header sub>{name}</Header>
          <span>{formatToTime(date)}</span>
        </div>
      ),
    },
    {
      Header: 'Triệu chứng',
      formatter: ({ hasSymptom }) => hasSymptom ? 'Có' : 'Không',
    },
    {
      Header: 'Kết quả',
      formatter: ({ result }) =>
        result ? (
          <div>
            <Header sub>{renderExaminationResult(result)}</Header>
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
        label="Nơi lấy mẫu"
        content={data?.samplingPlace?.name ?? '...'}
      />
      <DataTable
        title="Danh sách test nhanh"
        columns={columns}
        data={[data]}
      />
    </>
  );
};

PersonalQuickTestHistoryDetailTable.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
  }),
};

PersonalQuickTestHistoryDetailTable.defaultProps = {
  data: undefined,
};

export default PersonalQuickTestHistoryDetailTable;
