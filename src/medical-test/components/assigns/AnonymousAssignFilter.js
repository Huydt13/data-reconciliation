import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Select } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';

import { InstantSearchBar } from 'app/components/shared';

const Wrapper = styled.div`
  padding: 8px;
`;
const AnonymousAssignFilter = (props) => {
  const { onChange } = props;
  const [searchValue, setSearchValue] = useState('');
  const [unitId, setUnitId] = useState('');

  const [options, setOptions] = useState([]);
  const { unitInfo, prefixList } = useSelector((state) => state.medicalTest);

  const { isAdmin } = useAuth();
  useEffect(() => {
    if (isAdmin) {
      setOptions(
        prefixList.map((pr) => ({
          key: pr.id,
          text: pr.name,
          value: pr.id,
        })),
      );
    } else {
      setUnitId(unitInfo?.id);
      setOptions(
        prefixList
          .filter((pr) => pr.id === unitInfo?.id)
          .map((pr) => ({
            key: pr.id,
            text: pr.name,
            value: pr.id,
          })),
      );
    }
  }, [prefixList, unitInfo, isAdmin]);

  useEffect(() => {
    onChange({
      searchValue,
      unitId,
    });
  }, [onChange, searchValue, unitId]);

  return (
    <>
      <InstantSearchBar onChange={setSearchValue}>
        {!isAdmin && (
          <Wrapper>
            <div className="ui form">
              <Form.Group widths="equal">
                <Form.Field
                  search
                  deburr
                  label="Cơ sở xét nghiệm"
                  control={Select}
                  options={options}
                  value={unitId}
                  onChange={(e, { value }) => setUnitId(value)}
                />
              </Form.Group>
            </div>
          </Wrapper>
        )}
      </InstantSearchBar>
    </>
  );
};

AnonymousAssignFilter.propTypes = {
  onChange: PropTypes.func,
};

AnonymousAssignFilter.defaultProps = {
  onChange: () => {},
};

export default AnonymousAssignFilter;
