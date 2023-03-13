import React from 'react';
import styled from 'styled-components';
import { Label } from 'semantic-ui-react';

import { useSelector } from 'react-redux';

import locations from 'app/assets/mock/locations.json';

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
    subjectDetail: { diseaseOutbreakLocation },
  } = useSelector((s) => s.chain);
  const labels = [
    {
      rowIndex: 1,
      col: [
        {
          key: 4,
          label: 'Loại hình:',
          value: diseaseOutbreakLocation?.address.locationType,
        },
      ],
    },
    {
      rowIndex: 0,
      col: [
        {
          key: 1,
          label: 'Tên địa điểm:',
          value: diseaseOutbreakLocation?.name,
        },
        {
          key: 2,
          label: 'Người liên hệ',
          value: diseaseOutbreakLocation?.contactName,
        },
        {
          key: 3,
          label: 'SĐT liên hệ',
          value: diseaseOutbreakLocation?.contactPhoneNumber,
        },
      ],
    },
    {
      rowIndex: 2,
      col: [
        {
          key: 5,
          label: 'Tỉnh/Thành:',
          value:
            diseaseOutbreakLocation?.address.provinceValue &&
            locations.find(
              (p) => p.value === diseaseOutbreakLocation?.address.provinceValue,
            ).label,
        },
        {
          key: 6,
          label: 'Quận/Huyện:',
          value:
            diseaseOutbreakLocation?.address.districtValue &&
            locations
              .find(
                (p) =>
                  p.value === diseaseOutbreakLocation?.address.provinceValue,
              )
              .districts.find(
                (d) =>
                  d.value === diseaseOutbreakLocation?.address.districtValue,
              ).label,
        },
        {
          key: 7,
          label: 'Phường/Xã:',
          value:
            diseaseOutbreakLocation?.address.wardValue &&
            locations
              .find(
                (p) =>
                  p.value === diseaseOutbreakLocation?.address.provinceValue,
              )
              .districts.find(
                (d) =>
                  d.value === diseaseOutbreakLocation?.address.districtValue,
              )
              .wards.find(
                (w) => w.value === diseaseOutbreakLocation?.address.wardValue,
              ).label,
        },
      ],
    },
    {
      rowIndex: 3,
      col: [
        {
          key: 8,
          label: 'Thôn/Ấp/Khu Phố:',
          value: diseaseOutbreakLocation?.address.quarter,
        },
        {
          key: 11,
          label: 'Tổ dân phố:',
          value: diseaseOutbreakLocation?.address.quarterGroup,
        },
        {
          key: 9,
          label: 'Địa chỉ (số nhà/đường):',
          value: diseaseOutbreakLocation?.address.streetHouseNumber,
        },
        {
          key: 10,
          label: 'Khu, Lô:',
          value: diseaseOutbreakLocation?.address.block,
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
