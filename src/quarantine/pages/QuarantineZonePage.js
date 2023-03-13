import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';

import ZoneTable from '../components/zone/QuarantineZoneTable';
import RoomTable from '../components/room/QuarantineRoomTable';
import WaitingSubjectTable from '../components/waiting/WaitingSubjectTable';
import SubjectInRoomTable from '../components/room/SubjectInRoomTable';

const StyledWrapper = styled.div`
  padding: 8px;
`;

const QuarantineZonePage = () => {
  const {
    openZoneDetail,
    openWaitingSubject,
    openRoomDetail,
  } = useSelector((state) => state.quarantine);

  return (
    <StyledWrapper>
      {!(openZoneDetail || openWaitingSubject || openRoomDetail) && <ZoneTable />}
      {openZoneDetail && <RoomTable />}
      {openWaitingSubject && <WaitingSubjectTable />}
      {openRoomDetail && <SubjectInRoomTable />}
    </StyledWrapper>
  );
};

export default QuarantineZonePage;
