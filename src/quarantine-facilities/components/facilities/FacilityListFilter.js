import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Select } from 'semantic-ui-react';

import locations from 'app/assets/mock/locations.json';
import { InstantSearchBar } from 'app/components/shared';
import { FacilityOptions } from 'quarantine-facilities/utils/constants';

const Wrapper = styled.div`
  padding: 8px;
`;

const FacilityListFilter = ({ onChange }) => {
  const [searchValue, setSearchValue] = useState('');
  const [districtValue, setDistrictValue] = useState('');
  const [type, setType] = useState('');
  useEffect(() => {
    onChange({ searchValue, districtValue, type });
    // eslint-disable-next-line
  }, [searchValue, districtValue, type]);
  return (
    <InstantSearchBar onChange={setSearchValue}>
      <Wrapper>
        <div className="ui form">
          <Form.Group widths="equal">
            <Form.Field
              search
              deburr
              clearable
              label="Quận/Huyện"
              control={Select}
              options={locations
                .find((p) => p.value === '79')
                .districts.map((d) => ({ text: d.label, value: d.value }))}
              onChange={(_, { value: v }) => setDistrictValue(v)}
            />
            <Form.Field
              clearable
              label="Loại hình"
              control={Select}
              options={FacilityOptions}
              onChange={(e, { value }) => setType(value)}
            />
          </Form.Group>
        </div>
      </Wrapper>
    </InstantSearchBar>
  );
};

FacilityListFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default FacilityListFilter;
