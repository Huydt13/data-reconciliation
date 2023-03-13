import React from 'react';
import styled from 'styled-components';
import { Label } from 'semantic-ui-react';

import { useSelector } from 'react-redux';
import moment from 'moment';

const StyledMinimizeWrapper = styled.div`
  position: relative;
  & .ui.label {
    margin-left: 3px !important;
    margin-right: 0 !important;
    margin-bottom: 3px;
    font-weight: normal !important;
    font-size: 0.9em !important;
  }
  & .detail {
    margin-left: 3px !important;
  }
`;

const MinimizeLocationSection = () => {
  const {
    subjectDetail: {
      diseaseOutbreakLocation: {
        flightNumber,
        seatNumber,
        departureTime,
        arrivalTime,
        flightFrom,
        flightTo,
        // locationType,
      },
    },
  } = useSelector((s) => s.chain);
  const labels = [
    {
      rowIndex: 3,
      col: [{ key: 0, label: 'Loại hình:', value: 'Máy bay' }],
    },
    {
      rowIndex: 0,
      col: [
        { key: 1, label: 'Tên chuyến bay:', value: flightNumber },
        { key: 2, label: 'Số ghế', value: seatNumber },
      ],
    },
    {
      rowIndex: 1,
      col: [
        { key: 3, label: 'Nơi khởi hành:', value: flightFrom },
        { key: 4, label: 'Nơi đến', value: flightTo },
      ],
    },
    {
      rowIndex: 2,
      col: [
        {
          key: 5,
          label: 'Thời gian khởi hành:',
          value: moment(departureTime).format('HH:mm | DD-MM-YYYY'),
        },
        {
          key: 6,
          label: 'Thời gian đến',
          value: moment(arrivalTime).format('HH:mm | DD-MM-YYYY'),
        },
      ],
    },
  ];
  return (
    <StyledMinimizeWrapper>
      {labels.map((r) => (
        <div key={r.rowIndex}>
          {r.col.map((f) => (
            <Label key={f.key} basic content={f.label} detail={f.value} />
          ))}
        </div>
      ))}
    </StyledMinimizeWrapper>
  );
};

export default MinimizeLocationSection;
