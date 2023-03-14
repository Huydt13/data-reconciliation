import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// import { Form, Input, Select, Checkbox } from 'semantic-ui-react';
import { Form, Input, Select } from "semantic-ui-react";
import { FilterSearchBar } from "app/components/shared";
import { useSelectLocations } from "app/hooks";

const Wrapper = styled.div`
  padding: 8px;
`;

const ProfileFilter = ({ onChange }) => {
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

  const [phoneNumber, setPhoneNumber] = useState("");

  const handleChange = (name) => {
    onChange({
      name,
      phoneNumber,
      provinceValue: province ? province.value : "",
      districtValue: district ? district.value : "",
      wardValue: ward ? ward.value : "",
    });
  };

  return (
    <>
      <FilterSearchBar placeholder="Tìm kiếm" onChange={handleChange}>
        <Wrapper>
          <div className="ui form">
            <Form.Group widths="equal"></Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                label="Tên"
                control={Input}
                onChange={(_, { value }) => setPhoneNumber(value)}
              />
              <Form.Field
                type="number"
                label="Số điện thoại"
                control={Input}
                onChange={(_, { value }) => setPhoneNumber(value)}
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
                onChange={(_, { value }) => {
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

ProfileFilter.propTypes = {
  onChange: PropTypes.func,
};

ProfileFilter.defaultProps = {
  onChange: () => {},
};

export default ProfileFilter;
