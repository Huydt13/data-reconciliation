import React from 'react';
import moment from 'moment';
import { Button } from 'semantic-ui-react';
import { FiArrowLeft } from 'react-icons/fi';
import styled from 'styled-components';

import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { createProfile, resetRelated } from 'profile/actions/profile';
import { CreateFromType } from 'infection-chain/utils/constants';

import SubjectForm from '../components/subject/information/SubjectForm';

const StyledWrapper = styled.div`
  padding: 8px;
`;
const BackButton = styled(Button)`
  margin-bottom: 16px !important;
`;

const CreateSubjectPage = () => {
  const history = useHistory();

  // const { createProfileLoading } = useSelector((state) => state.profile);
  const { relatedProfileId } = useSelector((state) => state.subject);
  const { createProfileLoading } = useSelector((state) => state.profile);
  // const { createSubjectLoading } = useSelector((state) => state.subject);
  const dispatch = useDispatch();

  // admin only
  const handleCreate = async (data) => {
    const {
      dateOfBirth,
      profileCreationReason: {
        isFromDomesticInfectedZone,
        countryValue,
        domesticInfectedProvinceValue,
        reason,
        reasonType,
        reasonAttribute,
      },
    } = data;
    let formattedDOB = '';
    if (dateOfBirth?.length === 4) {
      formattedDOB = moment(dateOfBirth, 'YYYY')
        .startOf('year')
        .format('YYYY-MM-DD');
    }

    const creatingProfile = {
      ...data,
      guid: undefined,
      addresses: undefined,
      homeAddress: undefined,
      id: undefined,
      dateOfBirth: formattedDOB || dateOfBirth,
      createdFrom: CreateFromType.INFECTIONCHAIN,
      profileCreationReason: {
        isFromDomesticInfectedZone,
        countryValue,
        domesticInfectedProvinceValue,
        reason,
        reasonType,
        reasonAttribute,
        realtedPositiveProfileId: relatedProfileId || undefined,
      },
    };

    dispatch(createProfile(creatingProfile)).then(({ profileId }) => {
      dispatch(resetRelated());
      history.push(`/profile/${profileId}`);
    });
  };

  return (
    <StyledWrapper>
      <BackButton
        basic
        animated
        onClick={() => {
          history.replace('/subject');
        }}
      >
        <Button.Content visible>Trờ về</Button.Content>
        <Button.Content hidden>
          <FiArrowLeft />
        </Button.Content>
      </BackButton>

      <SubjectForm onSubmit={handleCreate} loading={createProfileLoading} />
    </StyledWrapper>
  );
};

export default CreateSubjectPage;
