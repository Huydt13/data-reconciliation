/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  Modal,
  Form,
  Button,
  Header,
  Grid,
  Divider,
  Message,
} from 'semantic-ui-react';

import { FiMaximize2, FiMinimize2, FiPlus, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  createAssignWithProfile,
  createGroupProfile,
} from 'medical-test/actions/medical-test';
import {
  createProfile,
  updateProfile,
  createImmunizationForProfile,
  updateImmunizationForProfile,
} from 'profile/actions/profile';
import { showConfirmModal } from 'app/actions/global';

import { useAuth } from 'app/hooks';

import { DataTable } from 'app/components/shared';
import SubjectSection from 'chain/components/SubjectSection';
import ProfileTableSearchSection from 'profile/components/ProfileTableSearchSection';

import {
  formatProfileRequest,
  formatToYear,
  isNumberic,
  renderGender,
  renderProfileKey,
} from 'app/utils/helpers';

import ExaminationReasonSection from './ExaminationReasonSection';

const GridColumn = styled(Grid.Column)`
  transition: 0.5s;
`;
const ButtonGroupWrapper = styled.div`
  margin-bottom: 10px;
  text-align: right;
  & .buttons {
    margin-top: 16px;
    margin-right: 4px;
  }
`;
const MarginLeftButton = styled(Button)`
  margin-left: 10px !important;
`;
const IconStack = styled.span`
  position: relative;
  float: right;
  cursor: pointer;
`;
const expandColumns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Họ và tên',
    formatter: (row) => row.fullName.toUpperCase(),
    cutlength: 50,
  },
  {
    Header: 'Năm sinh',
    formatter: ({ dateOfBirth }) => formatToYear(dateOfBirth),
  },
  {
    Header: 'Giới tính',
    formatter: renderGender,
  },
  {
    Header: 'Số điện thoại',
    formatter: ({ phoneNumber }) => phoneNumber,
  },
  {
    Header: 'Địa chỉ nhà',
    formatter: renderProfileKey,
  },
];
const normalColumns = [
  {
    Header: '#',
    accessor: 'index',
  },
  { Header: 'Họ và tên', formatter: (r) => r.fullName, cutlength: 50 },
  {
    Header: 'Năm sinh',
    formatter: ({ dateOfBirth }) => formatToYear(dateOfBirth),
  },
  {
    Header: 'Địa chỉ nhà',
    formatter: renderProfileKey,
    cutlength: 20,
  },
];
const shrinkColumn = [
  {
    Header: 'Họ và tên',
    formatter: (row) => row.fullName.toUpperCase(),
    cutlength: 50,
  },
];

const CreateGroupProfileModal = ({ open, onClose, getData }) => {
  const unitInfo = useSelector((state) => state.medicalTest.unitInfo);
  const prefixList = useSelector((state) => state.medicalTest.prefixList);

  const {
    createProfileLoading,
    updateProfileLoading,
    createImmunizationForProfileLoading,
    updateImmunizationForProfileLoading,
  } = useSelector((state) => state.profile);
  const getPrefixesLoading = useSelector(
    (state) => state.medicalTest.getPrefixesLoading,
  );
  const createAssignLoading = useSelector(
    (state) => state.medicalTest.createAssignLoading,
  );

  const methods = useForm();
  const methods2 = useForm();
  const dispatch = useDispatch();
  const { isAdmin, isUsername } = useAuth();

  const [hoverIndex, setHoverIndex] = useState(0);

  const [creating, setCreating] = useState(false);
  const [profileList, setProfileList] = useState([]);

  const profileLoading =
    createProfileLoading ||
    updateProfileLoading ||
    createImmunizationForProfileLoading ||
    updateImmunizationForProfileLoading;

  const addProfile = async (d) => {
    let profileId = d?.id;
    try {
      if (!profileId) {
        const { profileId: profileIdValue } = await dispatch(
          createProfile(formatProfileRequest(d)),
        );
        profileId = profileIdValue;
      } else {
        await dispatch(updateProfile(formatProfileRequest(d), false));
      }
      if (d?.immunizations && d.immunizations.length > 0) {
        const immunization = d.immunizations[0];
        await dispatch(
          d.immunizations[0].guid
          ? updateImmunizationForProfile({
            id: immunization.guid,
            guid: immunization.guid,
            profileId,
            disease: 'Covid-19',
            immunizationStatus: immunization.immunizationStatus,
            // vaccine: immunization.vaccine,
            injectionDate: immunization.injectionDate,
          })
          : createImmunizationForProfile({
            profileId,
            disease: 'Covid-19',
            immunizationStatus: immunization.immunizationStatus,
            // vaccine: immunization.vaccine,
            injectionDate: immunization.injectionDate,
          }),
        );
      }
    } catch (e) {
      return;
    }
    setProfileList((pl) => [...pl, { ...d, id: profileId }]);
    setCreating(false);
  };

  const onSubmit = async (d) => {
    const { reasonLv1, reasonLv3 } = methods.getValues();
    if (profileList.length <= 1) {
      toast.warn('Chưa đủ hồ sơ để tạo mẫu gộp!');
    } else {
      const createProfileResponse = await dispatch(
        createGroupProfile({
          profileIds: profileList.map((e) => e.id),
          description: '',
          profileCreationReason: {
            reason: reasonLv1 || (isUsername('hcdc.dvu.xng') ? 'Khác' : ''),
            reasonType:
              reasonLv1 || (isUsername('hcdc.dvu.xng') ? 'Dịch vụ' : ''),
            // country or district
            reasonAttribute: '',
            isFromDomesticInfectedZone: reasonLv3?.length === 2,
            countryValue:
              reasonLv3?.length === 2 && !isNumberic(reasonLv3)
                ? reasonLv3
                : undefined,
            domesticInfectedProvinceValue:
              reasonLv3?.length === 2 && isNumberic(reasonLv3)
                ? reasonLv3
                : undefined,
            realtedPositiveProfileId:
              reasonLv3?.length !== 2 && isNumberic(reasonLv3)
                ? Number(reasonLv3)
                : undefined,
          },
        }),
      );
      const assignResponse = await dispatch(
        createAssignWithProfile({
          unitId: d.unitId || unitInfo.id,
          profileId: createProfileResponse.profileId,
        }),
      );
      onClose();
      getData({
        ...assignResponse,
        unit: { id: d.unitId || unitInfo.id },
        profileCreationReason: d,
      });
    }
  };

  return (
    <>
      <Modal
        open={open}
        size="fullscreen"
        onClose={() =>
          dispatch(
            showConfirmModal(
              'Dữ liệu chưa được lưu, bạn có muốn đóng?',
              onClose,
            ),
          )
        }
      >
        <Modal.Header content="Chỉ định đối tượng xét nghiệm - mẫu gộp" />
        <Modal.Content scrolling>
          <FormProvider {...methods}>
            <div className="ui form">
              <Header as="h3" content="Lý do tạo hồ sơ" />
              <ExaminationReasonSection required isExamination />
              {!methods.getValues('reasonLv1') && (
                <Message info size="small">
                  <Message.Header content="Chưa chọn lý do/đối tượng" />
                  <p>Vui lòng chọn lý do/đối tượng để tiếp tục tạo hồ sơ</p>
                </Message>
              )}

              {isAdmin && (
                <>
                  <Header as="h3" content="Thông tin chỉ định" />
                  <Controller
                    control={methods.control}
                    defaultValue=""
                    name="unitId"
                    rules={{ required: true }}
                    render={({ onChange, onBlur, value }) => (
                      <Form.Select
                        search
                        deburr
                        clearable
                        required
                        fluid
                        label="Cơ sở lấy mẫu"
                        value={value}
                        onChange={(_, { value: v }) => onChange(v)}
                        onBlur={onBlur}
                        loading={getPrefixesLoading}
                        error={methods.errors.unitId && 'Bắt buộc'}
                        options={prefixList.map((pr) => ({
                          key: pr.id,
                          text: pr.name,
                          value: pr.id,
                        }))}
                      />
                    )}
                  />
                </>
              )}

              <Divider />
              <Grid divided>
                <GridColumn
                  width={hoverIndex === 0 ? 8 : hoverIndex === 1 ? 12 : 4}
                >
                  <IconStack
                    onClick={() => setHoverIndex(hoverIndex === 1 ? 0 : 1)}
                  >
                    {hoverIndex !== 1 ? <FiMaximize2 /> : <FiMinimize2 />}
                  </IconStack>
                  <ProfileTableSearchSection
                    isShrink={hoverIndex === 2}
                    isNormal={hoverIndex === 0}
                    isCloseFilter={hoverIndex !== 1}
                    selectingList={profileList}
                    onChange={(r) => setProfileList((pl) => [...pl, r])}
                  />
                </GridColumn>
                <GridColumn
                  width={hoverIndex === 0 ? 8 : hoverIndex === 2 ? 12 : 4}
                >
                  <IconStack
                    onClick={() => setHoverIndex(hoverIndex === 2 ? 0 : 2)}
                  >
                    {hoverIndex !== 2 ? <FiMaximize2 /> : <FiMinimize2 />}
                  </IconStack>
                  <Header as="h3" content="Danh sách hồ sơ trong mẫu gộp" />
                  <DataTable
                    hideGoToButton
                    columns={
                      hoverIndex === 1
                        ? shrinkColumn
                        : hoverIndex === 0
                        ? normalColumns
                        : expandColumns
                    }
                    data={profileList.map((r, i) => ({ ...r, index: i + 1 }))}
                    actions={[
                      {
                        content: hoverIndex !== 1 ? 'Tạo hồ sơ' : '',
                        icon: hoverIndex === 1 ? <FiPlus /> : '',
                        color: 'green',
                        onClick: () => setCreating(true),
                        globalAction: true,
                        hidden: !methods.getValues('reasonLv1'),
                      },
                      {
                        icon: <FiX />,
                        title: 'Xóa',
                        color: 'red',
                        onClick: (row) => {
                          setProfileList((pl) =>
                            pl.filter((p) => p.id !== row.id),
                          );
                        },
                      },
                    ]}
                  />
                </GridColumn>
              </Grid>
            </div>
          </FormProvider>
        </Modal.Content>

        <Modal.Actions>
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content="Xác nhận"
            disabled={profileLoading || createAssignLoading}
            loading={profileLoading || createAssignLoading}
            onClick={methods.handleSubmit(onSubmit)}
          />
        </Modal.Actions>

        <Modal size="large" open={creating} onClose={() => setCreating(false)}>
          <Modal.Header>Tạo mới hồ sơ</Modal.Header>
          <Modal.Content>
            <FormProvider {...methods2}>
              <Header as="h3" content="Thông tin đối tượng" />
              <div className="ui form">
                <SubjectSection fillExistProfile />
                <ButtonGroupWrapper>
                  <MarginLeftButton
                    basic
                    color="green"
                    content="Thêm"
                    disabled={profileLoading}
                    loading={profileLoading}
                    onClick={methods2.handleSubmit(addProfile)}
                  />
                  <MarginLeftButton
                    basic
                    color="grey"
                    content="Huỷ"
                    disabled={profileLoading}
                    onClick={() => {
                      setCreating(false);
                    }}
                  />
                </ButtonGroupWrapper>
              </div>
            </FormProvider>
          </Modal.Content>
        </Modal>
      </Modal>
    </>
  );
};

CreateGroupProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

export default CreateGroupProfileModal;
