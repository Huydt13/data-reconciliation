/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import locations from 'app/assets/mock/locations.json';
import nations from 'app/assets/mock/nations.json';

import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from 'profile/actions/profile';

import EditableLabel from 'app/components/shared/EditableLabel';

const Wrapper = styled.div`
  margin-top: 12px;
`;
const Flex = styled.div`
  display: flex;
`;

const religionOptions = [
  { key: 'Không', text: 'Không', value: 'Không' },
  { key: 'Phật giáo', text: 'Phật giáo', value: 'Phật giáo' },
  { key: 'Công giáo', text: 'Công giáo', value: 'Công giáo' },
  { key: 'Cao Đài', text: 'Cao Đài', value: 'Cao Đài' },
  { key: 'Hòa Hảo', text: 'Hòa Hảo', value: 'Hòa Hảo' },
  { key: 'Tin Lành', text: 'Tin Lành', value: 'Tin Lành' },
  { key: 'Hồi giáo', text: 'Hồi giáo', value: 'Hồi giáo' },
  { key: 'Ấn Độ giáo', text: 'Ấn Độ giáo', value: 'Ấn Độ giáo' },
];

const MinimizeAdditionInformation = ({ data, disabled }) => {
  const { email, religion, job, nationality, workAddresses } = data;

  const [selectingKey, setSelectingKey] = useState(undefined);

  const address =
    workAddresses[0] ||
    MinimizeAdditionInformation.defaultProps.data.workAddresses[0];

  const generalLabels = [
    {
      rowIndex: 0,
      col: [
        {
          name: 'nationality',
          label: 'Quốc tịch:',
          type: 'select',
          value: nationality,
          dropdownOptions: nations.map((n) => ({
            text: n.name,
            value: n.countryCode,
          })),
          disabled,
        },
        {
          name: 'religion',
          label: 'Tôn giáo:',
          type: 'select',
          value: religion,
          dropdownOptions: religionOptions,
          disabled,
        },
        { name: 'job', label: 'Nghề nghiệp:', value: job, disabled },
        { name: 'email', label: 'Email:', value: email, disabled },
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
          value: address?.locationType,
          disabled,
        },
        {
          name: 'name',
          label: 'Tên địa điểm:',
          value: address?.name,
          disabled,
        },
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
          value: address?.provinceValue,
          disabled,
        },
        {
          name: 'districtValue',
          type: 'select',
          dropdownOptions: address?.provinceValue
            ? locations
                ?.find((p) => p.value === address?.provinceValue)
                ?.districts.map((p) => ({
                  value: p.value,
                  text: p.label,
                }))
            : [],
          label: 'Quận/Huyện:',
          value: address?.districtValue,
          disabled,
        },
        {
          name: 'wardValue',
          type: 'select',
          dropdownOptions: address?.districtValue
            ? locations
                ?.find((p) => p.value === address?.provinceValue)
                ?.districts.find((d) => d.value === address?.districtValue)
                ?.wards.map((p) => ({
                  value: p.value,
                  text: p.label,
                }))
            : [],
          label: 'Phường/Xã:',
          value: address?.wardValue,
          disabled,
        },
        {
          name: 'streetHouseNumber',
          label: 'Địa chỉ:',
          value: address?.streetHouseNumber,
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
          value: address?.quarter,
          disabled,
        },
        {
          name: 'quarterGroup',
          label: 'Tổ dân phố:',
          value: address?.quarterGroup,
        },
        { name: 'block', label: 'Khu, lô:', value: address?.block },
        { name: 'floor', label: 'Tầng:', value: address?.floor },
        { name: 'room', label: 'Phòng:', value: address?.room },
      ],
    },
  ];

  const dispatch = useDispatch();
  const getProfileLoading = useSelector((s) => s.profile.getProfileLoading);
  const updateProfileLoading = useSelector(
    (s) => s.profile.updateProfileLoading,
  );
  const handleUpdateProfile = async ({ name, data: d }) => {
    await dispatch(updateProfile({ ...data, [name]: d }));
    await dispatch(getProfile(data.id));
  };
  const handleUpdateAddress = async ({ name, data: d }) => {
    try {
      await dispatch(
        updateProfile({
          ...data,
          workAddresses: [{ ...data.workAddresses[0], [name]: d }],
        }),
      );
    } catch (e) {
      toast.warn(e);
    }
    await dispatch(getProfile(data.id));
  };

  return (
    <>
      <span>Thông tin bổ sung:</span>
      {generalLabels.map((r) => (
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
              onChange={(d) => handleUpdateProfile({ name: f.name, data: d })}
            />
          ))}
        </Flex>
      ))}

      <Wrapper>
        <span>Địa chỉ học tập/làm việc:</span>
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
            />
          ))}
        </Flex>
      ))}
    </>
  );
};

MinimizeAdditionInformation.propTypes = {
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
    workAddresses: PropTypes.arrayOf(
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

MinimizeAdditionInformation.defaultProps = {
  data: {
    id: 0,
    workAddresses: [
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

export default MinimizeAdditionInformation;
