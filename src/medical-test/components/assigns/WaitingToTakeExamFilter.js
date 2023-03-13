import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Select } from 'semantic-ui-react';
import { KeyboardDatePicker, InstantSearchBar } from 'app/components/shared';
import { useAuth } from 'app/hooks';
import { useSelector } from 'react-redux';

const Wrapper = styled.div`
  padding: 8px;
`;

const WaitingToTakeExamFilter = (props) => {
  const { onChange } = props;
  const [searchValue, setSearchValue] = useState('');
  const [unitId, setUnitId] = useState('');
  const [assignDateFrom, setAssignDateFrom] = useState(null);
  const [assignDateTo, setAssignDateTo] = useState(null);

  const { isAdmin } = useAuth();

  const { unitInfo, prefixList } = useSelector((state) => state.medicalTest);

  useEffect(() => {
    if (!isAdmin) {
      setUnitId(unitInfo?.id);
    }
  }, [prefixList, unitInfo, isAdmin]);

  useEffect(() => {
    onChange({
      searchValue,
      unitId,
      assignDateFrom,
      assignDateTo,
    });
  }, [onChange, searchValue, unitId, assignDateFrom, assignDateTo]);

  return (
    <>
      <InstantSearchBar onChange={setSearchValue}>
        <Wrapper>
          <div className="ui form">
            <Form.Group widths="equal">
              {isAdmin && (
                <Form.Field
                  search
                  deburr
                  clearable
                  label="Cơ sở xét nghiệm"
                  control={Select}
                  options={prefixList.map((pr) => ({
                    key: pr.id,
                    text: pr.name,
                    value: pr.id,
                  }))}
                  onChange={(_, { value }) => setUnitId(value)}
                />
              )}
              <Form.Field
                label="Từ ngày (ngày chỉ định)"
                control={KeyboardDatePicker}
                onChange={setAssignDateFrom}
              />
              <Form.Field
                label="Đến ngày (ngày chỉ định)"
                control={KeyboardDatePicker}
                onChange={setAssignDateTo}
              />
            </Form.Group>
          </div>
        </Wrapper>
      </InstantSearchBar>
    </>
  );
};

WaitingToTakeExamFilter.propTypes = {
  onChange: PropTypes.func,
};

WaitingToTakeExamFilter.defaultProps = {
  onChange: () => {},
};

export default WaitingToTakeExamFilter;
