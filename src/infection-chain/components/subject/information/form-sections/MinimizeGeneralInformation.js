/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from 'profile/actions/profile';

import locations from 'app/assets/mock/locations.json';
import { formatToDate, formatToYear } from 'app/utils/helpers';

import EditableLabel from 'app/components/shared/EditableLabel';

const Wrapper = styled.div`
  margin-top: 12px;
`;
const Flex = styled.div`
  display: flex;
`;

const genderOptions = [
  { text: 'Nam', value: 1 },
  { text: 'Nữ', value: 0 },
  { text: 'Khác', value: 2 },
];

const MinimizeGeneralInformation = ({ data, disabled }) => {
  const {
    fullName,
    cmnd,
    phoneNumber,
    gender,
    cccd,
    passportNumber,
    healthInsuranceNumber,
    dateOfBirth,
    hasYearOfBirthOnly,
    addressesInVietnam,
  } = data;

  const [selectingKey, setSelectingKey] = useState(undefined);

  const address =
    addressesInVietnam[0] ||
    MinimizeGeneralInformation.defaultProps.data.addressesInVietnam[0];

  const generalLabels = [
    {
      rowIndex: 0,
      col: [
        {
          name: 'fullName',
          label: 'Họ và tên:',
          value: fullName?.toUpperCase(),
          maxLength: 50,
          required: true,
          disabled,
        },
        {
          name: 'dateOfBirth',
          label: hasYearOfBirthOnly ? 'Năm sinh' : 'Ngày sinh',
          value: hasYearOfBirthOnly
            ? formatToYear(dateOfBirth)
            : formatToDate(dateOfBirth),
          description: hasYearOfBirthOnly,
          required: true,
          disabled,
        },
        {
          name: 'gender',
          type: 'select',
          label: 'Giới tính:',
          value: gender,
          dropdownOptions: genderOptions,
          disabled,
        },
        {
          name: 'phoneNumber',
          label: 'Số điện thoại:',
          value: phoneNumber,
          required: true,
          disabled,
        },
      ],
    },
    {
      rowIndex: 1,
      col: [
        {
          name: 'cccd',
          label: 'Căn cước công dân:',
          value: cccd,
          randomable: true,
          disabled,
        },
        {
          name: 'cmnd',
          label: 'Chứng minh nhân dân:',
          value: cmnd,
          randomable: true,
          disabled,
        },
        {
          name: 'passportNumber',
          label: 'Hộ chiếu:',
          value: passportNumber,
          randomable: true,
          disabled,
        },
        {
          name: 'healthInsuranceNumber',
          label: 'Bảo hiểm y tế:',
          value: healthInsuranceNumber,
          randomable: true,
          disabled,
        },
      ],
    },
  ];

  const addressLabels = [
    {
      rowIndex: 1,
      col: [
        {
          name: 'locationType',
          label: 'Loại hình:',
          value: address.locationType,
          disabled,
        },
        { name: 'name', label: 'Tên địa điểm:', value: address.name, disabled },
      ],
    },
    {
      rowIndex: 2,
      col: [
        {
          name: 'provinceValue',
          type: 'select',
          dropdownOptions: locations.map((p) => ({
            value: p.value,
            text: p.label,
          })),
          label: 'Tỉnh/Thành:',
          value: address.provinceValue,
          disabled,
        },
        {
          name: 'districtValue',
          type: 'select',
          dropdownOptions: address.provinceValue
            ? locations
              ?.find((p) => p.value === address.provinceValue)
              ?.districts.map((p) => ({
                value: p.value,
                text: p.label,
              }))
            : [],
          label: 'Quận/Huyện:',
          value: address.districtValue,
          disabled,
        },
        {
          name: 'wardValue',
          type: 'select',
          dropdownOptions: address.districtValue
            ? locations
              ?.find((p) => p.value === address.provinceValue)
              ?.districts.find((d) => d.value === address.districtValue)
              ?.wards.map((p) => ({
                value: p.value,
                text: p.label,
              }))
            : [],
          label: 'Phường/Xã:',
          value: address.wardValue,
          disabled,
        },
        {
          name: 'streetHouseNumber',
          label: 'Địa chỉ:',
          value: address.streetHouseNumber,
          required: true,
          disabled,
        },
      ],
    },
    {
      rowIndex: 3,
      col: [
        {
          name: 'quarter',
          label: 'Thôn/Ấp/Khu phố:',
          value: address.quarter,
          disabled,
        },
        {
          name: 'quarterGroup',
          label: 'Tổ dân phố:',
          value: address.quarterGroup,
          disabled,
        },
        { name: 'block', label: 'Khu, lô:', value: address.block, disabled },
        { name: 'floor', label: 'Tầng:', value: address.floor, disabled },
        { name: 'room', label: 'Phòng:', value: address.room, disabled },
      ],
    },
  ];

  const dispatch = useDispatch();
  const getProfileLoading = useSelector((s) => s.profile.getProfileLoading);
  const updateProfileLoading = useSelector(
    (s) => s.profile.updateProfileLoading,
  );
  const handleUpdateProfile = async ({ name, data: d }, isYear) => {
    try {
      await dispatch(
        updateProfile({
          ...data,
          [name]:
            name === 'dateOfBirth' && (isYear || !d.includes('-'))
              ? `${d}-01-01`
              : d,
          hasYearOfBirthOnly: Boolean(isYear),
        }),
      );
    } catch (e) {
      toast.warn(e);
    }
    await dispatch(getProfile(data.id));
  };
  const handleUpdateAddress = async ({ name, data: d }) => {
    try {
      await dispatch(
        updateProfile({
          ...data,
          addressesInVietnam: [{ ...data.addressesInVietnam[0], [name]: d }],
        }),
      );
    } catch (e) {
      toast.warn(e);
    }
    await dispatch(getProfile(data.id));
  };

  return (
    <>
      <span>Thông tin chung:</span>
      {generalLabels.map((r) => (
        <Flex key={r.rowIndex}>
          {r.col.map((f) => (
            <EditableLabel
              // style props
              key={f.name}
              color={f.color}
              header={f.label}
              content={f.value}
              description={f?.description}
              maxLength={f?.maxLength}
              // logic props
              name={f.name}
              disabled={f?.disabled}
              type={f?.type}
              randomable={f?.randomable}
              loading={getProfileLoading || updateProfileLoading}
              dropdownOptions={f?.dropdownOptions}
              selectingKey={selectingKey}
              setSelectingKey={setSelectingKey}
              onChange={(d, isYear) =>
                handleUpdateProfile({ name: f.name, data: d }, isYear)
              }
              // validate props
              required={f?.required}
              validate={f?.validate}
            />
          ))}
        </Flex>
      ))}

      <Wrapper>
        <span>Địa chỉ nhà:</span>
      </Wrapper>
      {addressLabels.map((r) => (
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
              disabled={f?.disabled}
              loading={getProfileLoading || updateProfileLoading}
              dropdownOptions={f?.dropdownOptions}
              selectingKey={selectingKey}
              setSelectingKey={setSelectingKey}
              onChange={(d) => handleUpdateAddress({ name: f.name, data: d })}
              // validate props
              required={f?.required}
              validate={f?.validate}
            />
          ))}
        </Flex>
      ))}
    </>
  );
};

MinimizeGeneralInformation.propTypes = {
  disabled: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    id: PropTypes.number,
    cccd: PropTypes.string,
    cmnd: PropTypes.string,
    healthInsuranceNumber: PropTypes.string,
    code: PropTypes.string,
    privateAlias: PropTypes.string,
    alias: PropTypes.string,
    fullName: PropTypes.string,
    nationality: PropTypes.string,
    gender: PropTypes.number,
    email: PropTypes.string,
    passportNumber: PropTypes.string,
    phoneNumber: PropTypes.string,
    dateOfBirth: PropTypes.string,
    religion: PropTypes.string,
    job: PropTypes.string,
    hasYearOfBirthOnly: PropTypes.bool,
    addressesInVietnam: PropTypes.arrayOf(
      PropTypes.shape({
        block: PropTypes.string,
        districtValue: PropTypes.string,
        floor: PropTypes.string,
        guid: PropTypes.string,
        locationType: PropTypes.string,
        name: PropTypes.string,
        provinceValue: PropTypes.string,
        quarter: PropTypes.string,
        quarterGroup: PropTypes.string,
        room: PropTypes.string,
        streetHouseNumber: PropTypes.string,
        wardValue: PropTypes.string,
      }),
    ),
  }),
};

MinimizeGeneralInformation.defaultProps = {
  data: {
    id: 0,
    addressesInVietnam: [
      {
        block: '',
        districtValue: '',
        floor: '',
        guid: '',
        locationType: '',
        name: '',
        provinceValue: '',
        quarter: '',
        quarterGroup: '',
        room: '',
        streetHouseNumber: '',
        wardValue: '',
      },
    ],
  },
};

export default MinimizeGeneralInformation;
