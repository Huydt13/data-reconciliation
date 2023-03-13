import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Icon, Input, Select } from 'semantic-ui-react';
import { FilterSearchBar } from 'app/components/shared';
import { useSelectLocations } from 'app/hooks';

const Wrapper = styled.div`
  padding: 8px;
`;

const WaitingForTreatmentFilter = ({ onChange }) => {
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

  const [cccd, setCccd] = useState('');
  const [cmnd, setCmnd] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [healthInsurranceNumber, setHealthInsurranceNumber] = useState('');

  const [fromDate, setFromDate] = useState(undefined);
  const [toDate, setToDate] = useState(undefined);

  const handleChange = (name) => {
    onChange({
      name,
      cccd,
      cmnd,
      phoneNumber,
      passportNumber,
      healthInsurranceNumber,
      province: province ? province.value : '',
      district: district ? district.value : '',
      ward: ward ? ward.value : '',
    });
  };

  return (
    <>
      <FilterSearchBar onChange={handleChange}>
        <Wrapper>
          <div className="ui form">
            <Form.Group widths="equal">
              <Form.Field
                type="number"
                label="Căn cước công dân"
                control={Input}
                onChange={(_, { value }) => {
                  setCccd(value);
                }}
              />
              <Form.Field
                type="number"
                label="Chứng minh nhân dân"
                control={Input}
                onChange={(_, { value }) => {
                  setCmnd(value);
                }}
              />
              <Form.Field
                label="Hộ chiếu"
                control={Input}
                onChange={(_, { value }) => {
                  setPassportNumber(value);
                }}
              />
              <Form.Field
                label="Số bảo hiểm"
                control={Input}
                onChange={(_, { value }) => {
                  setHealthInsurranceNumber(value);
                }}
              />
            </Form.Group>
            <Form.Group widths="equal">
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
            <Form.Group widths="equal">
              <Form.Input
                type="datetime-local"
                label="Từ"
                value={fromDate}
                onChange={(_, { value }) => setFromDate(value)}
                icon={<Icon name="x" link onClick={() => setFromDate('')} />}
              />
              <Form.Input
                type="datetime-local"
                label="Đến"
                value={toDate}
                onChange={(_, { value }) => setToDate(value)}
                icon={<Icon name="x" link onClick={() => setToDate('')} />}
              />
            </Form.Group>
          </div>
        </Wrapper>
      </FilterSearchBar>
    </>
  );
};

WaitingForTreatmentFilter.propTypes = {
  onChange: PropTypes.func,
};

WaitingForTreatmentFilter.defaultProps = {
  onChange: () => {},
};

export default WaitingForTreatmentFilter;
