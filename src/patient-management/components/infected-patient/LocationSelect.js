import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Form, Input, Select } from 'semantic-ui-react';

import { useSelectLocations } from 'app/hooks';

const Wrapper = styled.div`
  padding: 8px;
`;

const LocationSelect = (props) => {
  const { onChange } = props;
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

  useEffect(() => {
    onChange({
      streetHouseNumber: houseNumber,
      provinceValue: province ? province.value : '',
      districtValue: district ? district.value : '',
      wardValue: ward ? ward.value : '',
    });
  }, [houseNumber, province, district, ward]);

  return (
    <>
      <Wrapper>
        <div className="ui form">
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
    </>
  );
};

LocationSelect.propTypes = {
  onChange: PropTypes.func,
};

LocationSelect.defaultProps = {
  onChange: () => { },
};

export default LocationSelect;
