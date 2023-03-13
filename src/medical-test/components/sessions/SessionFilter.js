import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Select } from 'semantic-ui-react';

import { useAuth } from 'app/hooks';
import { useSelector } from 'react-redux';

import { sessionList } from 'infection-chain/utils/helpers';
import { FilterSearchBar, KeyboardDatePicker } from 'app/components/shared';

const Wrapper = styled.div`
  padding: 8px;
`;

const SessionFilter = ({ onChange }) => {
  const { isAdmin } = useAuth();
  const { prefixList } = useSelector((s) => s.medicalTest);

  const [unitId, setUnitId] = useState('');
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [status, setStatus] = useState('');
  const [isCodeSearch, setIsCodeSearch] = useState(false);

  const handleChange = (searchValue) => {
    onChange({
      searchValue,
      status,
      from,
      to,
      isCodeSearch,
      unitId,
    });
  };

  return (
    <>
      <FilterSearchBar onChange={handleChange}>
        <Wrapper>
          <div className="ui form">
            <Form.Group widths="equal">
              {isAdmin && (
                <Form.Field
                  search
                  deburr
                  clearable
                  label="Cơ sở"
                  control={Select}
                  options={prefixList.map((pr) => ({
                    key: pr.id,
                    text: pr.name,
                    value: pr.id,
                  }))}
                  value={unitId}
                  onChange={(e, { value }) => setUnitId(value)}
                />
              )}
              <Form.Field
                search
                deburr
                clearable
                control={Select}
                label="Trạng thái"
                options={sessionList.map((t) => ({
                  key: t.value,
                  value: t.value,
                  text: t.label,
                }))}
                onChange={(e, { value }) => setStatus(value)}
              />
              <Form.Field
                label="Từ ngày"
                control={KeyboardDatePicker}
                onChange={setFrom}
              />
              <Form.Field
                label="Đến ngày"
                control={KeyboardDatePicker}
                onChange={setTo}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Checkbox
                style={{ paddingTop: '35px' }}
                label="Tìm theo mã"
                checked={isCodeSearch}
                onClick={(_, { checked }) => setIsCodeSearch(checked)}
              />
            </Form.Group>
          </div>
        </Wrapper>
      </FilterSearchBar>
    </>
  );
};

SessionFilter.propTypes = {
  onChange: PropTypes.func,
};

SessionFilter.defaultProps = {
  onChange: () => {},
};

export default SessionFilter;
