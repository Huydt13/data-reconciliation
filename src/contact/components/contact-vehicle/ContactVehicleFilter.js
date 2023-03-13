import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'semantic-ui-react';
import styled from 'styled-components';

import { InstantSearchBar } from 'app/components/shared';

const vehicleTypes = [
  { key: 'Máy bay', text: 'Máy bay', value: 'Máy bay' },
  { key: 'Tàu điện', text: 'Tàu điện', value: 'Tàu điện' },
  { key: 'Tàu hỏa', text: 'Tàu hỏa', value: 'Tàu hỏa' },
  { key: 'Tàu thủy', text: 'Tàu thủy', value: 'Tàu thủy' },
  { key: 'Xe khách', text: 'Xe khách', value: 'Xe khách' },
  { key: 'Xe buýt', text: 'Xe buýt', value: 'Xe buýt' },
  { key: 'Taxi', text: 'Taxi', value: 'Taxi' },
  { key: 'Grab car', text: 'Grab car', value: 'Grab car' },
  { key: 'Grab bike', text: 'Grab bike', value: 'Grab bike' },
  { key: 'Xe ôm', text: 'Xe ôm', value: 'Xe ôm' },
  { key: 'Ô tô', text: 'Ô tô', value: 'Ô tô' },
];

const Wrapper = styled.div`
  padding: 8px;
`;

const ContactVehicleFilter = (props) => {
  const { onChange } = props;

  const [searchValue, setSearchValue] = useState('');

  const [selectingVehicleType, setSelectingVehicleType] = useState(null);

  useEffect(() => {
    onChange({
      vehicleName: searchValue,
      vehicleType: selectingVehicleType,
    });
    // eslint-disable-next-line
  }, [searchValue, selectingVehicleType]);

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
                label="Loại hình"
                control={Select}
                options={vehicleTypes}
                onChange={(el, { value }) => {
                  setSelectingVehicleType(value);
                }}
              />
            </Form.Group>
          </div>
        </Wrapper>
      </InstantSearchBar>
    </>
  );
};

ContactVehicleFilter.propTypes = {
  onChange: PropTypes.func,
};

ContactVehicleFilter.defaultProps = {
  onChange: () => {},
};

export default ContactVehicleFilter;
