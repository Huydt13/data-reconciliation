import React from 'react';
import styled from 'styled-components';
import { Label } from 'semantic-ui-react';

import { useSelector } from 'react-redux';

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

const MinimizeOtherVehicleSection = () => {
  const {
    subjectDetail: {
      diseaseOutbreakLocation: {
        vehicleName,
        liscencePlateNumber,
        tripNumber,
        from,
        to,
        vehicleType,
      },
    },
  } = useSelector((s) => s.chain);
  const labels = [
    {
      rowIndex: 3,
      col: [{ key: 0, label: 'Loại hình:', value: vehicleType }],
    },
    {
      rowIndex: 0,
      col: [
        { key: 1, label: 'Tên phương tiện:', value: vehicleName },
        { key: 1, label: 'Biển đăng ký xe:', value: liscencePlateNumber },
        { key: 2, label: 'Mã số chuyến đi', value: tripNumber },
      ],
    },
    {
      rowIndex: 1,
      col: [
        { key: 3, label: 'Nơi khởi hành:', value: from },
        { key: 4, label: 'Nơi đến', value: to },
      ],
    },
    {
      rowIndex: 2,
      col: [
        { key: 5, label: 'Thời gian khởi hành:', value: from },
        { key: 6, label: 'Thời gian đến', value: to },
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

export default MinimizeOtherVehicleSection;
