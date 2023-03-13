/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form } from 'semantic-ui-react';

import { FormProvider, useForm } from 'react-hook-form';

import { FilterSearchBar } from 'app/components/shared';

import FacilitySelection from '../shared/FacilitySelection';

const Wrapper = styled.div`
  padding: 8px;
`;

const TransitedFilter = ({ onChange }) => {
  const { isHcdcDtr } = useForm();

  const methods = useForm();

  const handleChange = (name) => {
    onChange({
      ...methods.getValues(),
      name,
    });
  };

  return (
    <FilterSearchBar onChange={handleChange}>
      <Wrapper>
        <FormProvider {...methods}>
          <div className="ui form">
            <Form.Group widths="equal">
              {isHcdcDtr && <FacilitySelection />}
            </Form.Group>
          </div>
        </FormProvider>
      </Wrapper>
    </FilterSearchBar>
  );
};

TransitedFilter.propTypes = {
  onChange: PropTypes.func,
};

TransitedFilter.defaultProps = {
  onChange: () => {},
};

export default TransitedFilter;
