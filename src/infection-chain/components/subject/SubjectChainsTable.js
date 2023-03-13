import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import { FiFileText, FiGitMerge } from 'react-icons/fi';
import SubjectInfectionChainModal from './information/SubjectInfectionChainModal';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Loại',
    formatter: (row) => (
      <Label
        basic
        color={row?.infectionType?.colorCode ?? 'black'}
        content={row?.infectionType?.name ?? 'F?'}
        className="type-label"
      />
    ),
  },
  { Header: 'Tên chuỗi', accessor: 'chainName' },
];
const SubjectChainsTable = ({ profileId, profileName, data }) => {
  const [selectingId, setSelectingId] = useState('');
  return (
    <>
      <DataTable
        title={`Danh sách chuỗi của ${profileName}`}
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        actions={[
          {
            icon: <FiGitMerge />,
            title: 'Xem sơ đồ chuỗi lây nhiễm',
            color: 'teal',
            onClick: ({ chainId }) => setSelectingId(chainId),
          },
          {
            icon: <FiFileText />,
            title: 'Hồ sơ',
            color: 'blue',
            onClick: ({ chainId }) =>
              window.open(
                `/profile/${profileId}/infection-chain/${chainId}`,
                '_blank',
              ),
          },
        ]}
      />
      <SubjectInfectionChainModal
        open={Boolean(selectingId)}
        chainId={selectingId}
        onClose={() => setSelectingId(undefined)}
      />
    </>
  );
};

SubjectChainsTable.propTypes = {
  profileId: PropTypes.number.isRequired,
  profileName: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
export default SubjectChainsTable;
