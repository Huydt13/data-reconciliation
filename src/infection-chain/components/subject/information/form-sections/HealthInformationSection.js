import React, { useEffect } from 'react';
import { Form } from 'semantic-ui-react';

import { Controller, useFormContext } from 'react-hook-form';

import { useSelector, useDispatch } from 'react-redux';
import {
  getSymptoms,
  getUnderlyingDiseases,
} from '../../../../actions/subject';

const HealthInformationSection = () => {
  const { control } = useFormContext();

  const dispatch = useDispatch();
  const symptomList = useSelector((state) => state.subject.symptomList);
  const getSymptomsLoading = useSelector(
    (state) => state.subject.getSymptomsLoading,
  );
  const underlyingDiseaseList = useSelector(
    (state) => state.subject.underlyingDiseaseList,
  );
  const getUnderlyingDiseasesLoading = useSelector(
    (state) => state.subject.getUnderlyingDiseasesLoading,
  );
  useEffect(() => {
    dispatch(getSymptoms());
    dispatch(getUnderlyingDiseases());
  }, [dispatch]);

  return (
    <>
      <div className="ui form">
        <Form.Group widths="equal">
          <Controller
            name="symptoms"
            defaultValue={[]}
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Form.Select
                fluid
                multiple
                search
                deburr
                label="Triệu chứng"
                value={value}
                onBlur={onBlur}
                onChange={(_, { value: v }) => onChange(v)}
                loading={getSymptomsLoading}
                options={symptomList.map((r) => ({
                  value: r.id,
                  text: r.name,
                }))}
              />
            )}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Controller
            name="underlyingDiseases"
            defaultValue={[]}
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Form.Select
                fluid
                multiple
                search
                deburr
                label="Bệnh nền"
                value={value}
                onBlur={onBlur}
                onChange={(_, { value: v }) => onChange(v)}
                loading={getUnderlyingDiseasesLoading}
                options={underlyingDiseaseList.map((r) => ({
                  value: r.id,
                  text: r.name,
                }))}
              />
            )}
          />
        </Form.Group>
      </div>
    </>
  );
};

export default HealthInformationSection;
