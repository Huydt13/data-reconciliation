/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { useHistory } from "react-router-dom";

import { Accordion, Button, Message } from "semantic-ui-react";

import { FormProvider, useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { createProfile } from "profile/actions/profile";

import { useAuth } from "app/hooks";
import { formatProfileRequest } from "app/utils/helpers";

import SubjectSection from "chain/components/SubjectSection";
import ExaminationReasonSection from "medical-test/components/assigns/ExaminationReasonSection";

import MinimizeGeneralInformation from "./form-sections/MinimizeGeneralInformation";
import MinimizeAdditionInformation from "./form-sections/MinimizeAdditionInformation";
import MinimizeReasonInformation from "./form-sections/MinimizeReasonInformation";
import MinimizeHealthInformation from "./form-sections/MinimizeHealthInformation";
import MinimizeImmunization from "./form-sections/MinimizeImmunization";

import HealthInformationSection from "./form-sections/HealthInformationSection";
import AdditionInformationSection from "./form-sections/AdditionInformationSection";

const ConfirmButtonWrapper = styled.div`
  width: 100%;
  text-align: right;
  & button {
    margin: 16px 0 0 10px !important;
  }
  & .text {
    font-weight: bold;
  }
`;

const SubjectForm = ({ initialData: data }) => {
  const [activeAccordion, setActiveAccordion] = useState([0, 1, 2, 3, 4]);
  const handleClickAccordion = (e, titleProps) => {
    const { index } = titleProps;
    if (activeAccordion.includes(index)) {
      setActiveAccordion(activeAccordion.filter((a) => a !== index));
    } else {
      setActiveAccordion([...activeAccordion, index]);
    }
  };

  const { isMasterDte } = useAuth();
  const disabledEditProfile =
    data.isInfectedPatient ||
    (!isMasterDte &&
      (data.hasExaminationResult ||
        data.hasInfectionChainHistories ||
        data.hasQuickTestHistories));

  const list = useMemo(() => {
    const defaultList = [];
    if (!isMasterDte && data.hasExaminationResult) {
      defaultList.push("Đã có kết quả xét nghiệm");
    }
    if (!isMasterDte && data.hasInfectionChainHistories) {
      defaultList.push("Đã có lịch sử điều tra dịch tễ");
    }
    if (!isMasterDte && data.hasQuickTestHistories) {
      defaultList.push("Đã có lịch sử test nhanh");
    }
    return defaultList;
  }, [data, isMasterDte]);

  console.log("Tài khoản HCDC:", isMasterDte ? "✅" : "❌");
  console.log("Kết quả xét nghiệm:", data.hasExaminationResult ? "✅" : "❌");
  console.log(
    "Lịch sửa điều tra dịch tễ:",
    data.hasInfectionChainHistories ? "✅" : "❌"
  );
  console.log("Lịch sửa test nhanh:", data.hasQuickTestHistories ? "✅" : "❌");
  const accordion = data.id
    ? [
        {
          key: 0,
          title: "Thông tin hồ sơ",
          content: (
            <MinimizeReasonInformation
              data={data}
              disabled={disabledEditProfile}
            />
          ),
        },
        {
          key: 1,
          title: "Thông tin hành chính",
          content: (
            <MinimizeGeneralInformation
              data={data}
              disabled={disabledEditProfile}
            />
          ),
        },
        {
          key: 2,
          title: "Thông tin bổ sung",
          content: (
            <MinimizeAdditionInformation
              data={data}
              disabled={disabledEditProfile}
            />
          ),
        },
        {
          key: 3,
          title: "Tiền sử tiêm chủng",
          content: (
            <MinimizeImmunization data={data} disabled={disabledEditProfile} />
          ),
        },
        {
          key: 4,
          title: "Thông tin sức khỏe",
          content: (
            <MinimizeHealthInformation
              data={data}
              disabled={disabledEditProfile}
            />
          ),
        },
      ]
    : [
        { key: 7, title: "Lý do", content: <ExaminationReasonSection /> },
        {
          key: 8,
          title: "Thông tin hành chính",
          content: <SubjectSection showAdditional={false} />,
        },
        {
          key: 2,
          title: "Thông tin bổ sung",
          content: <AdditionInformationSection />,
        },
        {
          key: 9,
          title: "Thông tin sức khoẻ",
          content: <HealthInformationSection />,
        },
      ];

  const methods = useForm();
  const history = useHistory();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.profile.createProfileLoading);

  const onSubmit = async (d) => {
    const { profileId } = await dispatch(
      createProfile(formatProfileRequest(d))
    );
    history.push(`/profile/${profileId}`);
  };

  return (
    <>
      {disabledEditProfile && !data?.isInfectedPatient && (
        <Message warning header="Không thể sửa hồ sơ vì:" list={list} />
      )}
      <FormProvider {...methods}>
        <Accordion fluid styled exclusive={false}>
          {accordion.map((ac, i) => (
            <React.Fragment key={ac.key}>
              <Accordion.Title
                icon="dropdown"
                index={i}
                content={ac.title}
                onClick={handleClickAccordion}
                active={activeAccordion.includes(i)}
              />
              <Accordion.Content
                index={i}
                data={data}
                content={ac.content}
                active={activeAccordion.includes(i)}
              />
            </React.Fragment>
          ))}
        </Accordion>

        {!data.id && (
          <ConfirmButtonWrapper>
            <Button
              positive
              labelPosition="right"
              icon="checkmark"
              content="Tạo đối tượng"
              disabled={loading}
              loading={loading}
              onClick={methods.handleSubmit(onSubmit)}
            />
          </ConfirmButtonWrapper>
        )}
      </FormProvider>
    </>
  );
};

SubjectForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.number,
  }),
};

SubjectForm.defaultProps = {
  initialData: {
    id: 0,
  },
};

export default SubjectForm;
