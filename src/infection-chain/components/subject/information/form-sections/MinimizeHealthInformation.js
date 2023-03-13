/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from 'profile/actions/profile';

import EditableLabel from 'app/components/shared/EditableLabel';
import {
  getSymptoms,
  getUnderlyingDiseases,
} from 'infection-chain/actions/subject';

const Flex = styled.div`
  display: flex;
`;

const MinimizeHealthInformation = ({ data, disabled }) => {
  const { symptoms, underlyingDiseases } = data;
  const [selectingKey, setSelectingKey] = useState(undefined);

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

  const labels = [
    {
      rowIndex: 0,
      col: [
        {
          name: 'symptoms',
          label: 'Triệu chứng:',
          type: 'multiple-select',
          value: symptoms.map((s) => s.symptomId),
          loading: getSymptomsLoading,
          dropdownOptions: symptomList.map((r) => ({
            value: r.id,
            text: r.name,
          })),
          disabled,
        },
      ],
    },
    {
      rowIndex: 1,
      col: [
        {
          name: 'underlyingDiseases',
          label: 'Bệnh nền:',
          type: 'multiple-select',
          value: underlyingDiseases,
          loading: getUnderlyingDiseasesLoading,
          dropdownOptions: underlyingDiseaseList.map((r) => ({
            value: r.id,
            text: r.name,
          })),
          disabled,
        },
      ],
    },
  ];

  const getProfileLoading = useSelector((s) => s.profile.getProfileLoading);
  const updateProfileLoading = useSelector(
    (s) => s.profile.updateProfileLoading,
  );
  const handleUpdateProfile = async ({ name, data: d }) => {
    try {
      await dispatch(
        updateProfile({
          ...data,
          [name]:
            name === 'symptoms'
              ? d.map((s) => ({
                  symptomId: s,
                  notes: '',
                  otherSymptomDescription: '',
                }))
              : d,
        }),
      );
    } catch (e) {
      toast.warn(e);
    }
    await dispatch(getProfile(data.id));
  };

  return (
    <>
      {labels.map((r) => (
        <Flex key={r.rowIndex}>
          {r.col.map((f) => (
            <EditableLabel
              // style props
              key={f.name}
              color={f.color}
              header={f.label}
              content={f.value}
              maxLength={f?.maxLength}
              // logic props
              name={f.name}
              type={f?.type}
              disabled={f.disabled}
              loading={getProfileLoading || updateProfileLoading}
              dropdownOptions={f?.dropdownOptions}
              selectingKey={selectingKey}
              setSelectingKey={setSelectingKey}
              onChange={(d) => handleUpdateProfile({ name: f.name, data: d })}
            />
          ))}
        </Flex>
      ))}
    </>
  );
};

MinimizeHealthInformation.propTypes = {
  disabled: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    id: PropTypes.number,
    symptoms: PropTypes.arrayOf(PropTypes.shape({})),
    underlyingDiseases: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

export default MinimizeHealthInformation;
