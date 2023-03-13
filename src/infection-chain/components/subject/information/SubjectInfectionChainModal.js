import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Modal, Tab } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import ChainMap from 'chain/components/ChainMap';

const SubjectInfectionChainModal = (props) => {
  const { open, onClose, chainId } = props;
  const [withLocations, setWithLocations] = useState(false);
  const [hasNodeName, setHasNodeName] = useState(true);
  const {
    infectionTypeData: { data: infectionTypeData },
  } = useSelector((s) => s.general);

  const panes = useMemo(
    () =>
      infectionTypeData.map((d) => ({
        menuItem: d.name,
        render: () => (
          <>
            <Checkbox
              checked={hasNodeName}
              style={{ paddingTop: 20 }}
              label="Hiện tên"
              onChange={(_, { checked }) => setHasNodeName(checked)}
            />
            <Checkbox
              checked={withLocations}
              style={{ paddingLeft: 20, paddingTop: 20 }}
              label="Hiện nơi tiếp xúc"
              onChange={(_, { checked }) => setWithLocations(checked)}
            />
            <ChainMap
              chainId={chainId}
              infectionTypeId={d.id}
              hasNodeName={hasNodeName}
              withLocations={withLocations}
            />
          </>
        ),
      })),
    [chainId, infectionTypeData, withLocations, hasNodeName],
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Sơ đồ chuỗi lây nhiễm</Modal.Header>
      <Modal.Content>
        <Tab panes={panes} />
      </Modal.Content>
    </Modal>
  );
};

SubjectInfectionChainModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  chainId: PropTypes.string,
};

SubjectInfectionChainModal.defaultProps = {
  open: false,
  onClose: () => {},
  chainId: '',
};

export default SubjectInfectionChainModal;
