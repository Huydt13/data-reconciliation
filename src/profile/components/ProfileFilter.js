import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// import { Form, Input, Select, Checkbox } from 'semantic-ui-react';
import { Form, Input, Select } from 'semantic-ui-react';
import { FilterSearchBar } from 'app/components/shared';
import { useSelectLocations } from 'app/hooks';

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

  const [cccd, setCccd] = useState('');
  const [cmnd, setCmnd] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [healthInsurranceNumber, setHealthInsurranceNumber] = useState('');
  // const [hasSymptoms, setHasSymptoms] = useState(false);
  // const [symptoms, setSymptoms] = useState([]);
  // const [hasUnderlyingDiseases, setHasUnderlyingDiseases] = useState(false);
  // const [underlyingDiseases, setUnderlyingDiseases] = useState([]);

  const handleChange = (name) => {
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
  };

  return (
    <>
      <FilterSearchBar placeholder="Tên hồ sơ" onChange={handleChange}>
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
          </div>
          {/* <div className="ui form">
            <Form.Group widths="equal">
              {hasSymptoms ? (
                <Form.Field
                  search
                  deburr
                  clearable
                  label="Bệnh nền"
                  control={Select}
                  options={wardList.map((w) => ({
                    value: w.value,
                    text: w.label,
                  }))}
                  onChange={(_, { value }) => {
                    setWardValue(value);
                  }}
                />
              ) : null}
            </Form.Group>
          </div>
          <div className="ui form">
            <Form.Group>
              <Form.Field
                control={Checkbox}
                label="Có triệu chứng"
                checked={hasSymptoms || false}
                onClick={() => setHasSymptoms(!hasSymptoms)}
              />
              <Form.Field
                control={Checkbox}
                label="Có bệnh nền"
                checked={hasUnderlyingDiseases || false}
                onClick={() => setHasUnderlyingDiseases(!hasUnderlyingDiseases)}
              />
            </Form.Group>
          </div> */}
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
