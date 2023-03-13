import { useAuth } from "app/hooks";
import SubjectSection from "chain/components/SubjectSection";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Accordion, Button, Message } from "semantic-ui-react";
import MinimizeReasonInformation from "./form-sections/MinimizeReasonInformation";
import PropTypes from "prop-types";
import MinimizeGeneralInformation from "./form-sections/MinimizeGeneralInformation";
import MinimizeAdditionInformation from "./form-sections/MinimizeAdditionInformation";
import MinimizeImmunization from "./form-sections/MinimizeImmunization";
import MinimizeHealthInformation from "./form-sections/MinimizeHealthInformation";
import ExaminationReasonSection from "medical-test/components/assigns/ExaminationReasonSection";
import AdditionInformationSection from "./form-sections/AdditionInformationSection";
import HealthInformationSection from "./form-sections/HealthInformationSection";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createProfile } from "profile-train/actions/profile";
import { formatProfileRequest } from "app/utils/helpers";

const SubjectFormTrain = ({ initialData: data }) => {
  const [activeAccordion, setActiveAccordion] = useState([0]);
  const handleClickAccordion = (e, titleProps) => {
    const { index } = titleProps;
    if (activeAccordion.includes(index)) {
      setActiveAccordion(activeAccordion.filter((a) => a !== index));
    } else {
      setActiveAccordion([...activeAccordion, index]);
    }
  };
  const { isMasterDte } = useAuth(); //???
  const disableEditProfile =
    data.isInfectedPatient ||
    (!isMasterDte &&
      (data.hasExaminationResult ||
        data.hasInfectionChainHistories ||
        data.hasQuicktestHistories)); // ẩn nút edit

  const list = useMemo(() => {
    const defaultList = [];
    if (!isMasterDte && data.hasExaminationResult) {
      defaultList.push("Đã có kq xn");
    }
    if (!isMasterDte && data.hasInfectionChainHistories) {
      defaultList.push("đã có ls điều tra dịch tể");
    }
    if (!isMasterDte && data.hasQuicktestHistories) {
      defaultList.push("Đã có lịch sử test nhanh");
    }
    return defaultList;
  }, [data, isMasterDte]);

  const accordion = data.id
    ? [
        {
          key: 0,
          title: "Thông tin hồ sơ",
          // làm lại
          content: (
            <MinimizeReasonInformation
              data={data}
              disabled={disableEditProfile}
            />
          ),
        },
        {
          key: 1,
          title: "Thông tin hành chính",
          // làm lại
          content: (
            <MinimizeGeneralInformation
              data={data}
              disabled={disableEditProfile}
            />
          ),
        },
        {
          key: 2,
          title: "Thông tin bổ sung",
          // làm lại
          content: (
            <MinimizeAdditionInformation
              data={data}
              disabled={disableEditProfile}
            />
          ),
        },
        {
          key: 3,
          title: "Thông tin tiêm chung",
          // làm lại
          content: (
            <MinimizeImmunization data={data} disabled={disableEditProfile} />
          ),
        },
        {
          key: 4,
          title: "Thông tin sức khỏe",
          // làm lại
          content: (
            <MinimizeHealthInformation
              data={data}
              disabled={disableEditProfile}
            />
          ),
        },
      ]
    : [
        {
          key: 7,
          title: "Lý do",
          content: <ExaminationReasonSection />,
        },
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
          title: "Thông tin sức khỏe",
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
      {disableEditProfile && !data?.isInfectedPatient && (
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
          <div>
            <Button
              positive
              labelPosition="right"
              icon="checkmark"
              content="Tạo đối tượng"
              disabled={loading}
              loading={loading}
              onClick={methods.handleSubmit(onSubmit)}
            />
          </div>
        )}
      </FormProvider>
    </>
  );
};

SubjectFormTrain.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.number,
  }),
};

SubjectFormTrain.defaultProps = {
  initialData: {
    id: 0,
  },
};

export default SubjectFormTrain;
