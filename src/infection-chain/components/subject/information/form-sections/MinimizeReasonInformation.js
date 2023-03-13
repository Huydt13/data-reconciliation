/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile } from "profile/actions/profile";

import nations from "app/assets/mock/nations.json";
import locations from "app/assets/mock/locations.json";

import { getImportantType } from "infection-chain/utils/helpers";
import { ImportantType } from "infection-chain/utils/constants";

import EditableLabel from "app/components/shared/EditableLabel";
import { getExaminationTypes } from "medical-test/actions/medical-test";
import { ReasonTypes } from "profile/utils/constants";
import _ from "lodash";
import { formatToTime } from "app/utils/helpers";

const Flex = styled.div`
  display: flex;
`;

const MinimizeReasonInformation = ({ data, disabled }) => {
  const { dateCreated, dateUpdated, numberOfChanges, profileCreationReason } =
    data;

  const {
    reason,
    countryValue,
    domesticInfectedProvinceValue,
    realtedPositiveProfileId,
  } =
    profileCreationReason ||
    MinimizeReasonInformation.defaultProps.data.profileCreationReason;

  const dispatch = useDispatch();
  const examinationTypeList = useSelector(
    (s) => s.medicalTest.examinationTypeList
  );
  const getExaminationTypesLoading = useSelector(
    (s) => s.medicalTest.getExaminationTypesLoading
  );

  const [selectingKey, setSelectingKey] = useState(undefined);
  useEffect(() => {
    dispatch(getExaminationTypes());
  }, [dispatch]);
  const reasonType = reason
    ? examinationTypeList.find((r) => r.name === reason)?.type
    : 0;

  const labels = useMemo(() => {
    const defaultLabels = [
      {
        rowIndex: -1,
        col: [
          {
            name: "dateCreated",
            label: "Ngày tạo hồ sơ:",
            value: formatToTime(dateCreated),
            disabled: true,
          },
        ],
      },
      {
        rowIndex: 0,
        col: [
          {
            name: "dateUpdated",
            label: "Ngày cập nhật gần nhất:",
            value: formatToTime(dateUpdated),
            disabled: true,
          },
          {
            name: "numberOfChanges",
            label: "Số lần cập nhật:",
            value: numberOfChanges,
            disabled: true,
          },
        ],
      },
      {
        rowIndex: 1,
        col: [
          {
            name: "reason",
            label: "Lý do/Đối tượng:",
            type: "select",
            value: reason,
            showValue: true,
            loading: getExaminationTypesLoading,
            dropdownOptions: _.orderBy(
              examinationTypeList,
              (ex) => ex.importantValue,
              "desc"
            ).map((r, i) => ({
              value: r.name,
              text: r.name,
              content: `${i + 1}. ${r.name} ${
                r.importantValue === ImportantType.IMPORTANT
                  ? "(Khẩn cấp)"
                  : "(Thường quy)"
              }`,
              label: {
                empty: true,
                circular: true,
                color: getImportantType(r.importantValue).color,
              },
            })),
            disabled,
          },
        ],
      },
    ];

    if (reasonType === ReasonTypes.isProvince) {
      defaultLabels.push({
        rowIndex: 2,
        col: [
          {
            name: "countryValue",
            label: "Về từ quốc gia",
            type: "select",
            value: countryValue,
            dropdownOptions: nations.map((n) => ({
              text: n.name,
              value: n.countryCode,
            })),
            disabled,
          },
        ],
      });
    }

    if (reasonType === ReasonTypes.isProvince) {
      defaultLabels.push({
        rowIndex: 2,
        col: [
          {
            name: "domesticInfectedProvinceValue",
            label: "Về từ tỉnh/thành phố",
            type: "select",
            value: domesticInfectedProvinceValue,
            dropdownOptions: locations.map((n) => ({
              key: n.value,
              text: n.label,
              value: n.value,
            })),
            disabled,
          },
        ],
      });
    }
    if (reasonType === ReasonTypes.isF0) {
      defaultLabels.push({
        rowIndex: 2,
        col: [
          {
            name: "realtedPositiveProfileId",
            label: "F0 (tìm kiếm 3 ký tự trở lên)",
            type: "select",
            value: realtedPositiveProfileId,
            dropdownOptions: [],
            disabled,
          },
        ],
      });
    }
    return defaultLabels;
  }, [
    disabled,
    dateCreated,
    dateUpdated,
    numberOfChanges,
    reason,
    examinationTypeList,
    getExaminationTypesLoading,
    countryValue,
    reasonType,
    realtedPositiveProfileId,
    domesticInfectedProvinceValue,
  ]);

  const getProfileLoading = useSelector((s) => s.profile.getProfileLoading);
  const updateProfileLoading = useSelector(
    (s) => s.profile.updateProfileLoading
  );
  const handleUpdateProfile = async ({ name, data: d }) => {
    try {
      await dispatch(
        updateProfile({
          ...data,
          profileCreationReason: {
            ...data.profileCreationReason,
            [name]: d,
          },
        })
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
              showValue={f?.showValue}
              disabled={f?.disabled}
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

MinimizeReasonInformation.propTypes = {
  disabled: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    id: PropTypes.number,
    dateCreated: PropTypes.string,
    dateUpdated: PropTypes.string,
    numberOfChanges: PropTypes.number,
    profileCreationReason: PropTypes.shape({
      reason: PropTypes.string,
      countryValue: PropTypes.string,
      domesticInfectedProvinceValue: PropTypes.string,
      isFromDomesticInfectedZone: PropTypes.bool,
      realtedPositiveProfileId: PropTypes.number,
    }),
  }),
};

MinimizeReasonInformation.defaultProps = {
  data: {
    profileCreationReason: {
      reason: "",
      countryValue: "",
      domesticInfectedProvinceValue: "",
      isFromDomesticInfectedZone: false,
      realtedPositiveProfileId: 0,
    },
  },
};

export default MinimizeReasonInformation;
