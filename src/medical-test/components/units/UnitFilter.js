import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'semantic-ui-react';
import styled from 'styled-components';

import { InstantSearchBar } from 'app/components/shared';
import { useSelectLocations } from 'app/hooks';

const typeOptions = [
  { key: 1, value: 1, text: 'Cơ sở lấy mẫu' },
  { key: 2, value: 2, text: 'Cơ sở tự xét nghiệm' },
  { key: 3, value: 3, text: 'Cơ sở tham gia xét nghiệm' },
];

const Wrapper = styled.div`
  padding: 8px;
`;

const UnitFilter = (props) => {
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
    let filterType = {};
    switch (selectingType) {
      case 1: {
        filterType = {
          isCollector: true,
          isReceiver: false,
          isTester: false,
        };
        break;
      }
      case 2: {
        filterType = {
          isCollector: true,
          isReceiver: false,
          isTester: true,
        };
        break;
      }
      case 3: {
        filterType = {
          isCollector: true,
          isReceiver: true,
          isTester: true,
        };
        break;
      }
      default: {
        filterType = {};
      }
    }
    onChange({
      ...filterType,
      searchValue,
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

UnitFilter.propTypes = {
  onChange: PropTypes.func,
};

UnitFilter.defaultProps = {
  onChange: () => {},
};

export default UnitFilter;
