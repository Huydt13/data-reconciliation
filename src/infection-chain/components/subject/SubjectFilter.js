import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';

import { Button, Form, Select } from 'semantic-ui-react';

import { useSelectLocations } from 'app/hooks';
import { useSelector } from 'react-redux';

import { FilterSearchBar } from 'app/components/shared';

const Wrapper = styled.div`
  padding: 8px;
`;
const ButtonWrapper = styled.div`
  margin-bottom: 16px;
`;

const SubjectFilter = ({
  isUnverified,
  // hideDateFilter,
  onChange,
}) => {
  const [cccd, setCccd] = useState('');
  const [cmnd, setCmnd] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [healthInsurranceNumber, setHealthInsurranceNumber] = useState('');
  const [infectionTypeIds, setInfectionTypeIds] = useState([]);

  const {
    infectionTypeData: { data: infectionTypeOptions },
  } = useSelector((s) => s.general);

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
    if (infectionTypeOptions.length) {
      setInfectionTypeIds([infectionTypeOptions.find((i) => i.isPositive).id]);
    }
    // eslint-disable-next-line
  }, [infectionTypeOptions]);

  const handleChange = (searchValue) => {
    onChange({
      name: searchValue,
      provinceValue: province ? province.value : '',
      districtValue: district ? district.value : '',
      wardValue: ward ? ward.value : '',
      cccd,
      cmnd,
      phoneNumber,
      passportNumber,
      healthInsurranceNumber,
      infectionTypeIds,
    });
  };

  return (
    <FilterSearchBar onChange={handleChange}>
      <Wrapper>
        {!isUnverified && (
          <ButtonWrapper>
            <Button.Group>
              {_.sortBy(
                infectionTypeOptions,
                [(item) => item.level, (item) => item.value],
                ['asc', 'asc'],
              ).map((t) => (
                <Button
                  key={t.id}
                  color={t.colorCode}
                  content={t.name}
                  basic={!infectionTypeIds.includes(t.id)}
                  onClick={() => {
                    if (infectionTypeIds.includes(t.id)) {
                      setInfectionTypeIds((it) => it.filter((i) => i !== t.id));
                    } else {
                      setInfectionTypeIds((it) => [...it, t.id]);
                    }
                  }}
                />
              ))}
            </Button.Group>
          </ButtonWrapper>
        )}

        <div className="ui form">
          <Form.Group widths="equal">
            <Form.Input
              type="number"
              label="Căn cước công dân"
              onChange={(__, { value }) => setCccd(value)}
            />
            <Form.Input
              type="number"
              label="Chứng minh nhân dân"
              onChange={(__, { value }) => setCmnd(value)}
            />
            <Form.Input
              label="Hộ chiếu"
              onChange={(__, { value }) => setPassportNumber(value)}
            />
            <Form.Input
              label="Số bảo hiểm"
              onChange={(__, { value }) => setHealthInsurranceNumber(value)}
            />
          </Form.Group>
        </div>
        <div className="ui form">
          <Form.Group widths="equal">
            <Form.Input
              type="number"
              label="Số điện thoại"
              onChange={(__, { value }) => setPhoneNumber(value)}
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
              onChange={(__, { value }) => {
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
              onChange={(__, { value }) => {
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
              onChange={(__, { value }) => {
                setWardValue(value);
              }}
            />
          </Form.Group>
        </div>
      </Wrapper>
    </FilterSearchBar>
  );
};

SubjectFilter.propTypes = {
  onChange: PropTypes.func,
  isUnverified: PropTypes.bool,
  // hideDateFilter: PropTypes.bool,
};

SubjectFilter.defaultProps = {
  onChange: () => {},
  isUnverified: false,
  // hideDateFilter: false,
};

export default SubjectFilter;
