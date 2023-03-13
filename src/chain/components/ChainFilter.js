import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { FilterSearchBar } from 'app/components/shared';
import { ChainTypeOptions } from 'chain/utils/constants';

const Wrapper = styled.div`
  padding: 8px;
`;

const ChainFilter = ({ hideDateFilter, onChange }) => {
  const {
    diseaseTypeData: { data: diseaseTypeList },
  } = useSelector((s) => s.general);

  const [diseaseTypeId, setDiseaseTypeId] = useState(undefined);
  const [chainType, setChainType] = useState(undefined);
  const [fromTime, setFromTime] = useState(undefined);
  const [toTime, setToTime] = useState(undefined);

  const handleChange = (name) => {
    onChange({
      name,
      diseaseTypeId,
      chainType,
      fromTime,
      toTime,
    });
  };

  return (
    <FilterSearchBar onChange={handleChange}>
      <Wrapper>
        <div className='ui form'>
          <Form.Group widths='equal'>
            <Form.Select
              clearable
              label='Loại bệnh'
              options={diseaseTypeList.map((d) => ({
                text: d.name,
                value: d.id,
              }))}
              onChange={(_, { value }) => setDiseaseTypeId(value)}
            />
            <Form.Select
              clearable
              label='Loại chuỗi'
              options={ChainTypeOptions}
              onChange={(_, { value }) => setChainType(value)}
            />
          </Form.Group>
          {!hideDateFilter && (
            <Form.Group widths='equal'>
              <Form.Input
                type='date'
                label='Từ ngày'
                value={fromTime}
                onChange={(_, { value }) => setFromTime(value)}
                icon={<Icon name='x' link onClick={() => setFromTime('')} />}
              />
              <Form.Input
                type='date'
                value={toTime}
                label='Đến ngày'
                onChange={(_, { value }) => setToTime(value)}
                icon={<Icon name='x' link onClick={() => setToTime('')} />}
              />
            </Form.Group>
          )}
        </div>
      </Wrapper>
    </FilterSearchBar>
  );
};

ChainFilter.propTypes = {
  onChange: PropTypes.func,
  hideDateFilter: PropTypes.bool,
};

ChainFilter.defaultProps = {
  onChange: () => {},
  hideDateFilter: true,
};

export default ChainFilter;
