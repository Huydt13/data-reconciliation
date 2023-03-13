import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { Form, Select } from 'semantic-ui-react';

const FacilityFilter = ({ onChange }) => {
  const {
    getFacilitiesLoading,
    facilityData: { data: facilityList },
  } = useSelector((s) => s.quarantineFacility);
  const [facilityId, setFacilityId] = useState('');

  useEffect(() => {
    onChange({
      facilityId,
    });
    // eslint-disable-next-line
  }, [facilityId]);

  return (
    <div>
      <Form>
        <Form.Group widths="equal">
          <Form.Field
            search
            deburr
            clearable
            label="Khu"
            control={Select}
            options={(facilityList ?? []).map((f) => ({
              value: f.id,
              text: f.name,
            }))}
            loading={getFacilitiesLoading}
            onChange={(_, { value: v }) => setFacilityId(v)}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

FacilityFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default FacilityFilter;
