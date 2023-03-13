import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InstantSearchBar } from 'app/components/shared';
import { Button, Grid } from 'semantic-ui-react';

const ContactRelativeFilter = ({ onChange }) => {
  const [name, setName] = useState('');
  const [isRelative, setIsRelative] = useState(false);
  return (
    <>
      <Grid>
        <Grid.Row>
          <Grid.Column width="13">
            <InstantSearchBar
              checkbox
              onCheckboxChange={setIsRelative}
              onChange={setName}
              onEnter={(value) => onChange({ name: value, isRelative })}
            />
          </Grid.Column>
          <Grid.Column width="3">
            <Button
              fluid
              color="blue"
              content="Tìm kiếm"
              onClick={() => onChange({ name, isRelative })}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

ContactRelativeFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default ContactRelativeFilter;
