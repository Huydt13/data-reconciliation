import React from 'react';
import { Form } from 'semantic-ui-react';
import { Controller, useFormContext } from 'react-hook-form';

import nations from 'app/assets/mock/nations.json';
import AddressDetails from './AddressDetails';

const religionOptions = [
  { key: 'Không', text: 'Không', value: 'Không' },
  { key: 'Phật giáo', text: 'Phật giáo', value: 'Phật giáo' },
  { key: 'Công giáo', text: 'Công giáo', value: 'Công giáo' },
  { key: 'Cao Đài', text: 'Cao Đài', value: 'Cao Đài' },
  { key: 'Hòa Hảo', text: 'Hòa Hảo', value: 'Hòa Hảo' },
  { key: 'Tin Lành', text: 'Tin Lành', value: 'Tin Lành' },
  { key: 'Hồi giáo', text: 'Hồi giáo', value: 'Hồi giáo' },
  { key: 'Ấn Độ giáo', text: 'Ấn Độ giáo', value: 'Ấn Độ giáo' },
];

const nationOptions = nations.map((n) => ({
  key: n.countryCode,
  text: n.name,
  value: n.countryCode,
  flag: n.countryCode,
}));

const AdditionInformationSection = () => {
  const { control } = useFormContext();
  return (
    <div className="ui form">
      <Form.Group widths="equal">
        <Controller
          name="nationality"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Select
              fluid
              deburr
              clearable
              search
              label="Quốc tịch"
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={onBlur}
              options={nationOptions.filter((g) => g.value === value)}
            />
          )}
        />
        <Controller
          name="religion"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Select
              fluid
              deburr
              search
              label="Tôn giáo"
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={onBlur}
              options={religionOptions.filter((g) => g.value === value)}
            />
          )}
        />
        <Controller
          name="job"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Nghề nghiệp"
              value={value || ''}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <Controller
          name="email"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              type="email"
              label="Email"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Controller
          name="workAddresses"
          defaultValue={[]}
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Field
              fluid
              control={AddressDetails}
              label="Địa chỉ nơi làm việc/ học tập"
              initialData={
                value || {
                  floor: '',
                  block: '',
                  streetHouseNumber: '',
                  provinceValue: '',
                  districtValue: '',
                  wardValue: '',
                }
              }
              onChange={(d) => {
                onChange([d]);
              }}
              onBlur={onBlur}
            />
          )}
        />
      </Form.Group>
    </div>
  );
};

export default AdditionInformationSection;
