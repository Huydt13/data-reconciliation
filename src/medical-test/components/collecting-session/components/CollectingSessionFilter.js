import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';
import { InstantSearchBar } from 'app/components/shared';

const Wrapper = styled.div`
  padding: 8px;
`;
const CollectingSessionFilter = ({ onChange }) => {
  const [searchValue, setSearchValue] = useState('');
  const [startFrom, setStartFrom] = useState('');
  const [startTo, setStartTo] = useState('');

  useEffect(() => {
    onChange({
      searchValue,
      startFrom,
      startTo,
    });
    // eslint-disable-next-line
  }, [searchValue, startFrom, startTo]);

  return (
    <InstantSearchBar onChange={setSearchValue}>
      <Wrapper>
        <div className="ui form">
          <Form.Group widths="equal">
            <Form.Field
              isHavingTime
              label="Từ ngày"
              value={startFrom}
              control={KeyboardDateTimePicker}
              onChange={setStartFrom}
            />
            <Form.Field
              isHavingTime
              label="Đến ngày"
              value={startTo}
              control={KeyboardDateTimePicker}
              onChange={setStartTo}
            />
          </Form.Group>
        </div>
      </Wrapper>
    </InstantSearchBar>
  );
};

CollectingSessionFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default CollectingSessionFilter;
