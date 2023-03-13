import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";

import { FiDownload, FiGitMerge } from "react-icons/fi";
import { Loader, Tab, Button } from "semantic-ui-react";

import { useSelector, useDispatch } from "react-redux";
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
// import QuarantineHistoryTable from 'infection-chain/components/subject/quarantine/QuarantineHistoryTable';
import SubjectInfectionChainModal from "infection-chain/components/subject/information/SubjectInfectionChainModal";
import PersonalExamHistory from "infection-chain/components/subject/medical-test/PersonalExamHistory";
import { getInfectedPatientDetail } from "../actions/medical-test";
import DiseaseHistoryTable from "patient-management/components/infected-patient/DiseaseHistoryTable";
import QuickTestHistoryTable from "patient-management/components/infected-patient/QuickTestHistoryTable";

const StyledWrapper = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  position: relative;
`;

const InfectedPatientDetailPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    infectedPatientDetail,
    getInfectedPatientDetailLoading,
  } = useSelector((state) => state.infectedPatient);

  const handleRefresh = useCallback(() => {
    dispatch(getInfectedPatientDetail(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

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
  const formatProfileData = (data) => ({
    ...data?.profileInformation,
    id: data?.profileInformation?.guid,
    isInfectedPatient: true,
    addressesInVietnam: [data?.profileInformation?.addressInVietnam],
    immunizations: [
      {
        immunizationStatus: data?.profileInformation?.immunizationStatus,
        injectionDate: data?.profileInformation?.injectionDate,
        disease: "Covid-19",
        profileId: data?.profileInformation?.guid
      }
    ],
    workAddresses: [data?.profileInformation?.workAddress],
    quarantineAddress: [data.profileHealthDeclarations ? data.profileHealthDeclarations[data.profileHealthDeclarations.length - 1]?.quarantineAddress : []],
    symptoms: [],
    underlyingDiseases: [],
    nationality: "vn",
    religion: null,

  });
  const profileInformation = useMemo(
    () => (
      <ProfileInformation
        initialData={formatProfileData(infectedPatientDetail)}
        loading={
          getInfectedPatientDetailLoading
        }
        onReload={() => {
          dispatch(getInfectedPatientDetail(id));
        }}
        isCreateFromAnonymous={true}
      />
    ),
    // eslint-disable-next-line
    [infectedPatientDetail, getInfectedPatientDetailLoading]
  );


  const quickTestTable = useMemo(
    () => (
      <QuickTestHistoryTable
        initialData={infectedPatientDetail}
        profile={infectedPatientDetail}
        loading={getInfectedPatientDetailLoading}
        onRefresh={handleRefresh}
      />
    ),
    [infectedPatientDetail, getInfectedPatientDetailLoading]
  );
  const diseaseHistoryTable = useMemo(
    () => (
      <DiseaseHistoryTable
        initialData={infectedPatientDetail}
        profile={infectedPatientDetail}
        loading={getInfectedPatientDetailLoading}
        onRefresh={handleRefresh}
      />
    ),
    // eslint-disable-next-line
    [infectedPatientDetail, getInfectedPatientDetailLoading],
  );
  const panes = [
    { title: "Thông tin đối tượng", component: profileInformation },
    { title: "Test nhanh", component: quickTestTable },
    { title: "Ca bệnh", component: diseaseHistoryTable },
  ];

  return (
    <StyledWrapper>
      <Loader active={getInfectedPatientDetailLoading} inline="centered" />

      <Tab
        defaultActiveIndex={defaultActiveIndex}
        renderActiveOnly
        panes={panes.map((p, i) => ({
          menuItem: {
            key: p.title,
            content: p.title,
            // disable treatment
            disabled: i === 4,
          },
          render: () => <Tab.Pane>{p.component}</Tab.Pane>,
        }))}
        menu={{ secondary: true, pointing: true }}
        onTabChange={(e, { activeIndex }) =>
          setDefaultActiveIndex(activeIndex)
        }
      />

    </StyledWrapper>
  );
};

export default InfectedPatientDetailPage;
