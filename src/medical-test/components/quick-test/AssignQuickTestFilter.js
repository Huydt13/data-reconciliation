import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Form, Input, Select } from 'semantic-ui-react';
import { FilterSearchBar } from 'app/components/shared';

import { useSelectLocations } from 'app/hooks';

const Wrapper = styled.div`
  padding: 8px;
`;

const AssignQuickTestFilter = ({ onChange }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [houseNumber, setHouseNumber] = useState('');

  const {
    province,
    district,
    ward,
    provinceList,
    districtList,
    wardList,
    setProvinceValue,
    setDistrictValue,
    setWardValue,
  } = useSelectLocations({});

  const handleChange = (searchValue) => {
    onChange({
      personName: searchValue.toLowerCase(),
      phoneNumber,
      houseNumber: houseNumber.toLowerCase(),
      provinceCode: province ? province.value : '',
      districtCode: district ? district.value : '',
      wardCode: ward ? ward.value : '',
    });
  };

  return (
    <>
      <FilterSearchBar placeholder="Tên người chỉ định" onChange={handleChange}>
        <Wrapper>
          <div className="ui form">
            <Form.Group widths="equal">
              <Form.Field
                type="number"
                label="Số điện thoại"
                control={Input}
                onChange={(_, { value }) => {
                  setPhoneNumber(value);
                }}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                label="Số nhà"
                control={Input}
                onChange={(_blank, { value }) => {
                  setHouseNumber(value);
                }}
              />
              <Form.Field
                search
                deburr
                clearable
                label="Tỉnh/Thành"
                control={Select}
                options={provinceList.map((p) => ({
                  value: p.value,
                  text: p.label,
                }))}
                onChange={(_, { value }) => {
                  setProvinceValue(value);
                }}
              />
              <Form.Field
                search
                deburr
                clearable
                label="Quận/Huyện"
                control={Select}
                options={districtList.map((d) => ({
                  value: d.value,
                  text: d.label,
                }))}
                onChange={(_, { value }) => {
                  setDistrictValue(value);
                }}
              />
              <Form.Field
                search
                deburr
                clearable
                label="Phường/Xã"
                control={Select}
                options={wardList.map((w) => ({
                  value: w.value,
                  text: w.label,
                }))}
                onChange={(el, { value }) => {
                  setWardValue(value);
                }}
              />
            </Form.Group>
          </div>
        </Wrapper>
      </FilterSearchBar>
    </>
  );
};

AssignQuickTestFilter.propTypes = {
  onChange: PropTypes.func,
};

AssignQuickTestFilter.defaultProps = {
  onChange: () => {},
};

export default AssignQuickTestFilter;
