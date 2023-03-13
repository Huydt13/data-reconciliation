import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { Form } from 'semantic-ui-react';

const AliasSection = ({ data, onChange: onChangeProp }) => {
  const { control, reset, getValues } = useForm();
  useEffect(() => {
    reset({ ...data });
  }, [reset, data]);
  const handleOnChange = () => {
    onChangeProp(getValues());
  };
  return (
    <div className="ui form">
      <Form.Group widths="equal">
        <Controller
          name="byT_Alias"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Bí danh BYT"
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                handleOnChange();
              }}
            />
          )}
        />
        <Controller
          name="hcM_Alias"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Bí danh HCM"
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                handleOnChange();
              }}
            />
          )}
        />
        <Controller
          name="hcdC_Alias"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Bí danh CDC"
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                handleOnChange();
              }}
            />
          )}
        />
      </Form.Group>
    </div>
  );
};

AliasSection.propTypes = {
  data: PropTypes.shape({
    byT_Alias: PropTypes.string,
    hcM_Alias: PropTypes.string,
    hcdC_Alias: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AliasSection;
