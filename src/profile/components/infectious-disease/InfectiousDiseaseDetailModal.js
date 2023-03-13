import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';

import { useDispatch, useSelector } from 'react-redux';
import { getInfectiousDiseaseHistoriesByProfile } from 'profile/actions/profile';
import { formatToTime } from 'app/utils/helpers';
import { renderInfectiousStatus, renderInfectiousReason } from 'profile/utils/helpers';

const columns = [
  {
    Header: 'Thời gian',
    formatter: (r) => formatToTime(r.date),
  },
  {
    Header: 'Trạng thái',
    formatter: (r) => renderInfectiousStatus(r.infectiousDiseaseStatus),
  },
  {
    Header: 'Lý do',
    formatter: (r) => renderInfectiousReason(r.infectionReason),
  },
];

const InfectiousDiseaseDetailModal = ({ data, onClose }) => {
  const dispatch = useDispatch();
  const {
    infectiousDiseaseHistoriesByProfile: { data: infectiousData },
    getInfectiousDiseaseHistoriesByProfileLoading,
  } = useSelector((state) => state.profile);

  const getData = useCallback(() => {
    if (data?.guid) {
      dispatch(getInfectiousDiseaseHistoriesByProfile({ infectiousDiseaseHistoryId: data.guid }));
    }
  }, [dispatch, data]);
  useEffect(getData, [getData]);

  return (
    <Modal open={Boolean(data?.guid)} onClose={onClose}>
      <Modal.Header>Lịch sử bị nhiễm</Modal.Header>
      <Modal.Content>
        <DataTable
          columns={columns}
          data={infectiousData || []}
          loading={getInfectiousDiseaseHistoriesByProfileLoading}
        />
      </Modal.Content>
    </Modal>
  );
};

InfectiousDiseaseDetailModal.defaultProps = {
  data: undefined,
  onClose: () => { },
};

InfectiousDiseaseDetailModal.propTypes = {
  data: PropTypes.shape({
    guid: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func,
};

export default InfectiousDiseaseDetailModal;
