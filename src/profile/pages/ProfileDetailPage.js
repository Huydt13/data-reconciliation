import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";

import { FiDownload, FiGitMerge } from "react-icons/fi";
import { Loader, Tab, Button } from "semantic-ui-react";

import { useSelector, useDispatch } from "react-redux";
import {
  createProfile,
  getProfile,
  updateProfile,
  verifyProfile,
} from "profile/actions/profile";
import { mergeProfile } from "medical-test/actions/medical-test";

import { showConfirmModal } from "app/actions/global";
import {
  CreateFromType,
  SubjectDetailsTab,
  SubjectInfectionType,
} from "infection-chain/utils/constants";

import InfectionChainInformation from "infection-chain/components/subject/information/InfectionChainInformation";
import ProfileInformation from "infection-chain/components/subject/information/SubjectForm";
// import QuarantineTable from 'infection-chain/components/subject/quarantine/QuarantineTable';
import CreateProfileModal from "profile/components/CreateProfileModal";
// import QuarantineHistoryTable from 'infection-chain/components/subject/quarantine/QuarantineHistoryTable';
import SubjectInfectionChainModal from "infection-chain/components/subject/information/SubjectInfectionChainModal";
import PersonalExamHistory from "infection-chain/components/subject/medical-test/PersonalExamHistory";
import PersonalQuickTestHistoryTable from "medical-test/components/quick-test/PersonalQuickTestHistoryTable";
import DiseaseHistoryTable from "infection-chain/components/subject/information/DiseaseHistoryTable";

const StyledWrapper = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  position: relative;
`;

const ProfileDetailPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    profile,
    getProfileLoading,
    createProfileLoading,
    updateProfileLoading,
    verifyProfileLoading,
  } = useSelector((state) => state.profile);
  const { relatedProfileId, subjectRelated, fromContactData, toContactData } =
    useSelector((state) => state.subject);
  const { mergeProfileLoading, createProfileFromExaminationLoading } =
    useSelector((state) => state.medicalTest);

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

  const [createProfileModal, setCreateProfileModal] = useState(false);
  const handleFillProfileInformation = async (data) => {
    const { dateOfBirth } = data;
    let formattedDOB = "";
    if (dateOfBirth?.length === 4) {
      formattedDOB = moment(dateOfBirth, "YYYY")
        .startOf("year")
        .format("YYYY-MM-DD");
    }
    const profileData = {
      ...data,
      dateOfBirth: formattedDOB || dateOfBirth || "",
      createFromType: CreateFromType.EXAMINATION,
    };
    const { profileId } = await dispatch(createProfile(profileData));
    await dispatch(mergeProfile(id, profileId));
    setCreateProfileModal(false);
    history.push(`/profile/${profileId}`);
  };

  const [defaultActiveIndex, setDefaultActiveIndex] = useState(
    window.location.href.includes("chain") ? 1 : 0
  );
  const { tab } = useParams();
  useEffect(() => {
    switch (tab) {
      case SubjectDetailsTab.INFOMATION:
        setDefaultActiveIndex(0);
        break;
      case SubjectDetailsTab.INFECTION_CHAIN:
        setDefaultActiveIndex(1);
        break;
      case SubjectDetailsTab.MEDICAL_TEST:
        setDefaultActiveIndex(2);
        break;
      case SubjectDetailsTab.QUARANTINE:
        setDefaultActiveIndex(3);
        break;
      case SubjectDetailsTab.TREATMENT:
        setDefaultActiveIndex(4);
        break;
      default:
        break;
    }
  }, [tab]);

  const profileInformation = useMemo(
    () => (
      <ProfileInformation
        initialData={profile}
        loading={
          getProfileLoading ||
          createProfileLoading ||
          updateProfileLoading ||
          verifyProfileLoading ||
          mergeProfileLoading ||
          createProfileFromExaminationLoading
        }
        onSubmit={handleSubmit}
        onReload={() => {
          dispatch(getProfile(id));
        }}
      />
    ),
    // eslint-disable-next-line
    [profile, getProfileLoading, updateProfileLoading, verifyProfileLoading]
  );

  const medicalTestTable = useMemo(
    () => <PersonalExamHistory profile={profile} loading={getProfileLoading} />,
    // eslint-disable-next-line
    [profile, getProfileLoading]
  );

  // const quarantineTable = useMemo(
  //   () => (
  //     <QuarantineHistoryTable
  //       profile={profile}
  //       loading={getProfileLoading}
  //       onRefresh={handleRefresh}
  //     />
  //   ),
  //   // eslint-disable-next-line
  //   [profile, getProfileLoading],
  // );

  // const treatmentTable = useMemo(
  //   () => <TreatmentTable profile={profile} loading={getProfileLoading} />,
  //   [profile, getProfileLoading],
  // );

  const diseaseHistoryTable = useMemo(
    () => (
      <DiseaseHistoryTable
        profile={profile}
        loading={getProfileLoading}
        onRefresh={handleRefresh}
      />
    ),
    // eslint-disable-next-line
    [profile, getProfileLoading]
  );
  const quickTestTable = useMemo(
    () => (
      <PersonalQuickTestHistoryTable
        profile={profile}
        loading={getProfileLoading}
      />
    ),
    [profile, getProfileLoading]
  );

  const panes = [
    { title: "Thông tin đối tượng", component: profileInformation },
    {
      title: "Chuỗi",
      component: <InfectionChainInformation profileId={profile?.id} />,
    },
    { title: "Xét nghiệm PCR", component: medicalTestTable },
    { title: "Test nhanh", component: quickTestTable },
    { title: "Ca bệnh", component: diseaseHistoryTable },
    // { title: 'Cách ly', component: quarantineTable },
    // { title: 'Điều trị', component: treatmentTable },
  ];

  const [openGraph, setOpenGraph] = useState(false);
  const { pageCount: pageCountFrom } = fromContactData || { pageCount: 0 };
  const { pageCount: pageCountTo } = toContactData || { pageCount: 0 };
  return (
    <StyledWrapper>
      <Loader active={getProfileLoading} inline="centered" />
      {subjectRelated?.isVerified &&
        pageCountFrom + pageCountTo > 0 &&
        defaultActiveIndex === 1 && (
          <Button
            animated
            color="teal"
            onClick={() => {
              setOpenGraph(true);
            }}
          >
            <Button.Content visible>Sơ đồ chuỗi lây truyền</Button.Content>
            <Button.Content hidden>
              <FiGitMerge />
            </Button.Content>
          </Button>
        )}

      {subjectRelated?.type === SubjectInfectionType.F0 &&
        pageCountFrom + pageCountTo > 0 && (
          <Button
            animated
            color="yellow"
            onClick={() => {
              window.open(`/pdf/${subjectRelated.id}`, "_blank");
            }}
          >
            <Button.Content visible>Tải PDF báo cáo chuỗi</Button.Content>
            <Button.Content hidden>
              <FiDownload />
            </Button.Content>
          </Button>
        )}
      {profile && (
        <Tab
          defaultActiveIndex={defaultActiveIndex}
          renderActiveOnly
          panes={panes.map((p, i) => ({
            menuItem: {
              key: p.title,
              content: p.title,
              // disable treatment
              disabled: i === 5,
            },
            render: () => <Tab.Pane>{p.component}</Tab.Pane>,
          }))}
          menu={{ secondary: true, pointing: true }}
          onTabChange={(e, { activeIndex }) =>
            setDefaultActiveIndex(activeIndex)
          }
        />
      )}
      {!profile && !getProfileLoading && (
        <Tab
          className="anonymous-examination-tab"
          defaultActiveIndex={1}
          panes={[
            {
              menuItem: {
                key: "Hồ sơ",
                content: "Hồ sơ (thiếu)",
                icon: "warning circle",
                color: "red",
              },
              render: () => (
                <Tab.Pane>
                  <Button
                    primary
                    content="Bổ sung hồ sơ"
                    onClick={() => setCreateProfileModal(true)}
                  />
                  <CreateProfileModal
                    key={
                      createProfileModal
                        ? "OpenCreateProfileModal"
                        : "CloseCreateProfileModal"
                    }
                    open={createProfileModal}
                    onClose={() => setCreateProfileModal(false)}
                    onSubmit={handleFillProfileInformation}
                  />
                </Tab.Pane>
              ),
            },
            {
              menuItem: "Xét nghiệm",
              render: () => <Tab.Pane>{medicalTestTable}</Tab.Pane>,
            },
          ]}
          menu={{ secondary: true, pointing: true }}
          onTabChange={(e, { activeIndex }) => {
            if (activeIndex === 0) {
              setCreateProfileModal(true);
            }
            setDefaultActiveIndex(activeIndex);
          }}
        />
      )}

      <SubjectInfectionChainModal
        key={
          openGraph ? "SubjectInfectionModalOpen" : "SubjectInfectionModalClose"
        }
        open={openGraph}
        subjectId={subjectRelated?.id}
        onClose={() => setOpenGraph(false)}
      />
    </StyledWrapper>
  );
};

export default ProfileDetailPage;
