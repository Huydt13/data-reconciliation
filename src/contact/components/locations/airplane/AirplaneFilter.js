import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Form, Grid } from 'semantic-ui-react';
import { KeyboardDatePicker, InstantSearchBar } from 'app/components/shared';

const AirplaneFilter = (props) => {
  const { onChange } = props;

  const [fromTime, setFromTime] = useState('');
  const [flightNumber, setFlightNumber] = useState('');

  useEffect(() => {
    onChange({
      fromTime,
      flightNumber,
    });
  }, [onChange, fromTime, flightNumber]);

  const [searchTimeout, setSearchTimeout] = useState(null);
  const handleChange = (value, setFunc) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(
      setTimeout(() => {
        setFunc(value.toLowerCase());
      }, 500),
    );
  };

  return (
    <>
      <Grid columns="2">
        <Grid.Row>
          <Grid.Column>
            <InstantSearchBar
              placeholder="Tên chuyến bay"
              onChange={(v) => handleChange(v, setFlightNumber)}
            />
          </Grid.Column>
          <Grid.Column>
            <div className="ui form">
              <Form.Field
                placeholder="Ngày khởi hành"
                control={KeyboardDatePicker}
                onChange={setFromTime}
                disabledDays={[{ after: new Date() }]}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

AirplaneFilter.propTypes = {
  onChange: PropTypes.func,
};

AirplaneFilter.defaultProps = {
  onChange: () => {},
};

export default AirplaneFilter;
