import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";

import { Loader, Tab } from "semantic-ui-react";

import { useSelector, useDispatch } from "react-redux";
import {
  createProfile,
  getProfile,
  updateProfile,
  verifyProfile,
} from "profile/actions/profile";

import { showConfirmModal } from "app/actions/global";

import ProfileInformation from "infection-chain/components/subject/information/SubjectForm-train";

const StyledWrapper = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  position: relative;
`;

const ProfileDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { profile, getProfileLoading } = useSelector((state) => state.profile);
  const { relatedProfileId } = useSelector((state) => state.subject);

  const handleRefresh = useCallback(() => {
    if (id.indexOf("-") === -1) {
      dispatch(getProfile(id));
      window.scrollTo(0, 0);
    }
  }, [dispatch, id]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  useEffect(() => {
    document.title = profile?.fullName ?? "CDS";
    return () => {
      document.title = "CDS";
    };
    // eslint-disable-next-line
  }, [profile]);

  const handleSubmit = async (data, isVerified) => {
    const {
      dateOfBirth,
      profileCreationReason: {
        isFromDomesticInfectedZone,
        countryValue,
        domesticInfectedProvinceValue,
        reason,
        reasonType,
        reasonAttribute,
        realtedPositiveProfileId,
      },
    } = data || {
      dateOfBirth: "",
      profileCreationReason: {
        isFromDomesticInfectedZone: false,
        countryValue: "",
        domesticInfectedProvinceValue: "",
        reason: "",
        reasonType: "",
        reasonAttribute: "",
        realtedPositiveProfileId: 0,
      },
    };
    let formattedDOB = "";
    if (dateOfBirth?.length === 4) {
      formattedDOB = moment(dateOfBirth, "YYYY")
        .startOf("year")
        .format("YYYY-MM-DD");
    }

    const profileData = {
      ...data,
      id,
      dateOfBirth: formattedDOB || dateOfBirth,
      profileCreationReason: {
        isFromDomesticInfectedZone,
        countryValue,
        domesticInfectedProvinceValue,
        reason,
        reasonType,
        reasonAttribute,
        realtedPositiveProfileId:
          relatedProfileId || realtedPositiveProfileId || undefined,
      },
    };

    if (isVerified) {
      dispatch(
        showConfirmModal("Xác minh thông tin đối tượng?", () => {
          dispatch(verifyProfile(profileData)).then(() => {
            dispatch(getProfile(id));
          });
        })
      );
    } else {
      dispatch(
        id ? updateProfile(profileData) : createProfile(profileData)
      ).then(() => {
        dispatch(getProfile(id));
      });
    }
  };

  const [defaultActiveIndex] = useState(
    window.location.href.includes("chain") ? 1 : 0
  );

  const profileInformation = useMemo(
    () => (
      <ProfileInformation
        initialData={profile}
        onSubmit={handleSubmit}
        onReload={() => {
          dispatch(getProfile(id));
        }}
      />
    ),
    // eslint-disable-next-line
    [profile]
  );

  const panes = [
    { title: "Thông tin đối tượng", component: profileInformation },
  ];
  return (
    <StyledWrapper>
      <Loader active={getProfileLoading} inline="centered" />
      {profile && (
        <Tab
          defaultActiveIndex={defaultActiveIndex}
          renderActiveOnly
          panes={panes.map((p) => ({
            render: () => <Tab.Pane>{p.component}</Tab.Pane>,
          }))}
        />
      )}
    </StyledWrapper>
  );
};

export default ProfileDetailPage;
