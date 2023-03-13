import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Label } from 'semantic-ui-react';

const StyledMinimizeWrapper = styled.div`
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

const MinimizeContactVehicle = (props) => {
  const {
    contactVehicle,
  } = props;

  const {
    vehicleType,
    vehicleName,
    seatNumber,
    from,
    to,
  } = contactVehicle;

  const labels = [
    {
      rowIndex: 1,
      col: [
        { key: 'vehicleName', label: 'Tên phương tiện:', value: vehicleName },
        { key: 'vehicleType', label: 'Loại hình:', value: vehicleType },
        { key: 'seatNumber', label: 'Số ghế:', value: seatNumber },
      ],
    },
    {
      rowIndex: 2,
      col: [
        { key: 'from', label: 'Điểm khởi hành:', value: from },
        { key: 'to', label: 'Điểm đến:', value: to },
      ],
    },
  ];

  return (
    <StyledMinimizeWrapper>
      {labels.map((r) => (
        <div key={r.rowIndex}>
          {r.col.map((f) => (
            <Label
              key={f.key}
              color={f.color}
              basic
              content={f.label}
              detail={f.value}
            />
          ))}
        </div>
      ))}
    </StyledMinimizeWrapper>
  );
};

MinimizeContactVehicle.propTypes = {
  contactVehicle: PropTypes.shape({
    vehicleType: PropTypes.string,
    vehicleName: PropTypes.string,
    seatNumber: PropTypes.string,
    from: PropTypes.string,
    to: PropTypes.string,
  }),
};

MinimizeContactVehicle.defaultProps = {
  contactVehicle: {},
};
export default MinimizeContactVehicle;
