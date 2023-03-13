import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'semantic-ui-react';
import styled from 'styled-components';

import { InstantSearchBar } from 'app/components/shared';
import { useSelectLocations } from 'app/hooks';

const typeOptions = [
  { key: 2, value: 2, text: 'Khu cách ly kiểm dịch' },
  { key: 1, value: 1, text: 'Khu cách ly điều trị' },
];

const Wrapper = styled.div`
  padding: 8px;
`;

const QuarantineZoneFilter = (props) => {
  const { onChange } = props;

  const [searchValue, setSearchValue] = useState('');

  const [selectingType, setSelectingType] = useState(null);

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
      name: searchValue,
      type: selectingType,
      provinceValue: province ? province.value : '',
      districtValue: district ? district.value : '',
      wardValue: ward ? ward.value : '',
    });
    // eslint-disable-next-line
  }, [searchValue, selectingType, province, district, ward]);

  return (
    <>
      <InstantSearchBar onChange={(v) => setSearchValue(v)}>
        <Wrapper>
          <div className="ui form">
            <Form.Group widths="equal">
              <Form.Field
                search
                deburr
                clearable
                label="Loại cơ sở"
                control={Select}
                options={typeOptions}
                onChange={(el, { value }) => {
                  setSelectingType(value);
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
                onChange={(el, { value }) => {
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
                onChange={(el, { value }) => {
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
      </InstantSearchBar>
    </>
  );
};

QuarantineZoneFilter.propTypes = {
  onChange: PropTypes.func,
};

QuarantineZoneFilter.defaultProps = {
  onChange: () => {},
};

export default QuarantineZoneFilter;
