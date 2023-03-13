import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Input, Select } from 'semantic-ui-react';
import { InstantSearchBar } from 'app/components/shared';
import { useSelectLocations } from 'app/hooks';

const Wrapper = styled.div`
  padding: 8px;
`;

const ReadyForTreatmentFilter = (props) => {
  const { isCloseFilter, onChange } = props;

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

  const [name, setName] = useState('');
  const [cccd, setCccd] = useState('');
  const [cmnd, setCmnd] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [healthInsurranceNumber, setHealthInsurranceNumber] = useState('');

  useEffect(() => {
    onChange({
      name,
      cccd,
      cmnd,
      phoneNumber,
      passportNumber,
      healthInsurranceNumber,
      provinceValue: province ? province.value : '',
      districtValue: district ? district.value : '',
      wardValue: ward ? ward.value : '',
    });
    // eslint-disable-next-line
  }, [
    name,
    cccd,
    cmnd,
    phoneNumber,
    passportNumber,
    healthInsurranceNumber,
    province,
    district,
    ward,
  ]);

  const [searchTimeout, setSearchTimeout] = useState(null);
  const handleChange = (value, setFunc) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(
      setTimeout(() => {
        setFunc(value.toLowerCase());
      }, 500),
    );
  };

  return (
    <>
      <InstantSearchBar isCloseFilter={isCloseFilter} onChange={setName}>
        <Wrapper>
          <div className="ui form">
            <Form.Group widths="equal">
              <Form.Field
                type="number"
                label="Căn cước công dân"
                control={Input}
                onChange={(_, { value }) => {
                  handleChange(value, setCccd);
                }}
              />
              <Form.Field
                type="number"
                label="Chứng minh nhân dân"
                control={Input}
                onChange={(_, { value }) => {
                  handleChange(value, setCmnd);
                }}
              />
              <Form.Field
                label="Hộ chiếu"
                control={Input}
                onChange={(_, { value }) => {
                  handleChange(value, setPassportNumber);
                }}
              />
              <Form.Field
                label="Số bảo hiểm"
                control={Input}
                onChange={(_, { value }) => {
                  handleChange(value, setHealthInsurranceNumber);
                }}
              />
            </Form.Group>
          </div>
          <div className="ui form">
            <Form.Group widths="equal">
              <Form.Field
                type="number"
                label="Số điện thoại"
                control={Input}
                onChange={(_, { value }) => {
                  handleChange(value, setPhoneNumber);
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
                onChange={(_, { value }) => {
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

ReadyForTreatmentFilter.propTypes = {
  isCloseFilter: PropTypes.bool,
  onChange: PropTypes.func,
};

ReadyForTreatmentFilter.defaultProps = {
  isCloseFilter: false,
  onChange: () => {},
};

export default ReadyForTreatmentFilter;
