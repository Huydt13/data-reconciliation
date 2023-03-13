/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { FiPlus, FiX, FiMaximize2, FiMinimize2, FiCamera } from 'react-icons/fi';
import {
  Modal,
  Form,
  Grid,
  Header,
  Divider,
  Select,
  Input,
  Button,
  Dimmer,
  Loader,
  TextArea,
} from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';
import ProfileTableSearchSection from 'profile/components/ProfileTableSearchSection';
import ProfileSection from 'medical-test/components/quick-test/ProfileSection';
import ConfirmWorkAddressOfProfileModal from 'medical-test/components/quick-test/ConfirmWorkAddressOfProfileModal';

import { useDispatch, useSelector } from 'react-redux';
import { useSelectLocations, useAuth } from 'app/hooks';
import { showConfirmModal } from 'app/actions/global';
import {
  createProfileWithImmunization,
  updateProfileWithImmunization,
  getProfileByQRWithouDispatch,
} from 'profile/actions/profile';
import {
  createAssignQuickTest,
  getSamplingPlaces,
  getExaminationTypes,
  setAssignQuickTestSession,
} from 'medical-test/actions/medical-test';
import {
  formatProfileRequest,
  formatToYear,
  renderGender,
  renderProfileKey,
  naturalCompare,
} from 'app/utils/helpers';
import { getImportantType } from 'infection-chain/utils/helpers';
import { ImportantType } from 'infection-chain/utils/constants';

import nations from 'app/assets/mock/nations.json';

const GridColumn = styled(Grid.Column)`
  transition: 0.5s;
`;
const IconStack = styled.span`
  position: relative;
  float: right;
  cursor: pointer;
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
const FormWrapper = styled.div`
  position: relative;
`;

const FlexWrapper = styled.div`
  display: flex;
`;
const HeaderWrapper = styled.div`
  font-weight: 700;
`;
const MarginLeftIcon = styled.div`
  margin-left: auto;
`;
const ScannerIcon = styled(FiCamera)`
  cursor: pointer;
  margin-top: 4px !important;
`;

const expandColumns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Họ và tên',
    formatter: ({ profile }) => profile.fullName.toUpperCase(),
    cutlength: 50,
  },
  {
    Header: 'Năm sinh',
    formatter: ({ profile }) => formatToYear(profile.dateOfBirth),
  },
  {
    Header: 'Giới tính',
    formatter: ({ profile }) => renderGender(profile),
  },
  {
    Header: 'Số điện thoại',
    formatter: ({ profile }) => profile.phoneNumber,
  },
  {
    Header: 'Địa chỉ nhà',
    formatter: ({ profile }) => renderProfileKey(profile),
  },
];
const normalColumns = [
  {
    Header: '#',
    accessor: 'index',
  },
  {
    Header: 'Họ và tên',
    formatter: ({ profile }) => profile.fullName.toUpperCase(),
    cutlength: 50,
  },
  {
    Header: 'Năm sinh',
    formatter: ({ profile }) => formatToYear(profile.dateOfBirth),
  },
  {
    Header: 'Số điện thoại',
    formatter: ({ profile }) => profile.phoneNumber,
  },
  {
    Header: 'Địa chỉ nhà',
    formatter: ({ profile }) => renderProfileKey(profile),
    cutlength: 20,
  },
];
const shrinkColumn = [
  {
    Header: 'Họ và tên',
    formatter: ({ profile }) => profile.fullName.toUpperCase(),
    cutlength: 50,
  },
];

const CreateAssignQuickTestModal = (props) => {
  const { open, onClose, onRefresh } = props;

  const [hoverIndex, setHoverIndex] = useState(0);
  const [assignList, setAssignList] = useState([]);
  const [createSingleProfileModal, setCreateSingleProfileModal] =
    useState(false);
  const [
    confirmWorkAddressOfProfileModal,
    setConfirmWorkAddressOfProfileModal,
  ] = useState(undefined);

  const [scanQRModal, setScanQRModal] = useState(false);
  const [getProfileByQRLoading, setGetProfileByQRLoading] = useState(false);

  const profileQuickTestForm = useForm();
  const singleProfileForm = useForm();
  const scanQRForm = useForm();
  const dispatch = useDispatch();
  const {
    provinceList,
    districtList,
    wardList,
    setProvinceValue,
    setDistrictValue,
    setWardValue,
  } = useSelectLocations({});
  const { getAuthInfo } = useAuth();
  const {
    samplingPlaceList,
    examinationTypeList,
    getSamplingPlaceLoading,
    getExaminationTypeLoading,
    createBatchQuickTestLoading,
    createBatchQuickTestWithProfileLoading,
  } = useSelector((state) => state.medicalTest);
  const {
    createProfileWithImmunizationLoading,
    updateProfileWithImmunizationLoading,
  } = useSelector((state) => state.profile);

  const loading = createBatchQuickTestLoading || createBatchQuickTestWithProfileLoading;
  const profileLoading =
    createProfileWithImmunizationLoading ||
    updateProfileWithImmunizationLoading;

  const isAccountOfAirTransport = useMemo(() => {
    const userInfo = getAuthInfo();
    if (userInfo?.Username && userInfo.Username.toString().includes('sanbaytsn')) {
      return true;
    }
    return false;
  }, [getAuthInfo]);

  const assignInformation = profileQuickTestForm.getValues();
  const samplingPlaceOptions = useMemo(() => {
    const places =
      samplingPlaceList.reduce((array, place) => ([
        ...array,
        {
          key: place.id,
          value: place.id,
          text: place.name,
        },
      ]), []);
    return places.sort((a, b) => naturalCompare(a.value.toString(), b.value.toString()));
  }, [samplingPlaceList]);

  const examinationTypeOptions = useMemo(
    () =>
      _.orderBy(examinationTypeList, (ex) => ex.importantValue, 'desc').map(
        (r, i) => ({
          value: r.id,
          text: r.name,
          content: `${i + 1}. ${r.name} ${r.importantValue === ImportantType.IMPORTANT
            ? '(Khẩn cấp)'
            : '(Thường quy)'
            }`,
          label: {
            empty: true,
            circular: true,
            color: getImportantType(r.importantValue).color,
          },
        }),
      ),
    [examinationTypeList],
  );

  const getProfileByQR = useCallback(async (content) => {
    setGetProfileByQRLoading(true);
    await getProfileByQRWithouDispatch(content)
      .then((response) => {
        if (response?.errorMessages) {
          toast.warn(response.errorMessages);
        }
        if (response?.data) {
          const { data } = response;
          const profile = {
            ...data,
            dateOfBirth:
              data?.dateOfBirth
                ? data?.hasYearOfBirthOnly
                  ? moment(data.dateOfBirth).format('YYYY')
                  : moment(data.dateOfBirth).format('YYYY-MM-DD')
                : '',
            nationality:
              data?.nationality
                ? nations.find((n) => n.name.includes(data.nationality))?.countryCode ?? 'vn'
                : 'vn',
            addressesInVietnam: data?.addressesInVietnam
              ? data?.addressesInVietnam
              : [],
            workAddresses: data?.workAddresses
              ? data?.workAddresses
              : [],
            immunizations: data?.immunizations
              ? data?.immunizations
              : [],
          };
          singleProfileForm.reset(profile);
          scanQRForm.reset({});
          setScanQRModal(false);
        }
      })
      .catch(() => { })
      .finally(() => {
        setGetProfileByQRLoading(false);
      });
  }, [singleProfileForm, scanQRForm]);

  const addProfile = async (d) => {
    let profileId = d?.id;
    try {
      if (profileId) {
        await dispatch(updateProfileWithImmunization(formatProfileRequest(d)));
      } else {
        profileId = await dispatch(createProfileWithImmunization(formatProfileRequest(d)));
      }
    } catch (e) {
      return;
    }
    setAssignList((pl) => [...pl, {
      ...assignInformation,
      id: profileId,
      profile: d,
      addressName: d.workAddresses[0].name,
      houseNumber: d.workAddresses[0].streetHouseNumber,
      provinceCode: d.workAddresses[0].provinceValue,
      districtCode: d.workAddresses[0].districtValue,
      wardCode: d.workAddresses[0].wardValue,
    }]);
    setCreateSingleProfileModal(false);
  };

  const onSubmit = async (d) => {
    try {
      const data = assignList.map((pl) => ({
        provinceCode: pl.provinceCode,
        districtCode: pl.districtCode,
        wardCode: pl.wardCode,
        addressName: pl.name,
        houseNumber: pl.streetHouseNumber,
        examinationTypeId: d.examinationTypeId,
        samplingPlaceId: d.samplingPlaceId,
        profileId: pl.id,
      }));

      await dispatch(createAssignQuickTest(data));
      dispatch(setAssignQuickTestSession({}));
      setAssignList([]);
      onRefresh();
      onClose();
      // eslint-disable-next-line no-empty
    } catch (error) { }
  };

  useEffect(() => {
    if (samplingPlaceList.length === 0) {
      dispatch(getSamplingPlaces());
    }
    if (examinationTypeList.length === 0) {
      dispatch(getExaminationTypes());
    }
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if (isAccountOfAirTransport) {
      const examinationTypeId = examinationTypeList.find((e) => e.id === '6bac1165-6888-409a-8dbb-7c24778d777e')?.id;
      const samplingPlaceId = samplingPlaceList.find((e) => e.id === 'ce2616ca-f4d2-4e15-57ef-08d98cccdbff')?.id;
      if (examinationTypeId && samplingPlaceId) {
        profileQuickTestForm.setValue('examinationTypeId', examinationTypeId);
        profileQuickTestForm.setValue('samplingPlaceId', samplingPlaceId);
      }
    }
  }, [isAccountOfAirTransport, examinationTypeList, samplingPlaceList, profileQuickTestForm]);

  useEffect(() => {
    if (scanQRModal) {
      document.querySelector('.qr_code textarea').focus();
    }
  }, [scanQRModal]);

  return (
    <>
      <Modal
        open={open}
        size="fullscreen"
        onClose={() =>
          dispatch(
            showConfirmModal('Dữ liệu chưa được lưu, bạn có muốn đóng?', () => {
              onClose();
              setAssignList([]);
              dispatch(setAssignQuickTestSession({}));
            }),
          )
        }
      >
        <Modal.Header>Chỉ định đối tượng test nhanh</Modal.Header>
        <Modal.Content scrolling>
          <FormWrapper>
            <Dimmer inverted active={loading}>
              <Loader />
            </Dimmer>
            <Form>
              <Header as="h3" content="Thông tin chung" />
              <Form.Group widths="equal">
                <Controller
                  control={profileQuickTestForm.control}
                  defaultValue=""
                  name="examinationTypeId"
                  rules={{ required: true }}
                  render={({ onChange, value }) => (
                    <Form.Field
                      fluid
                      search
                      deburr
                      required
                      loading={getExaminationTypeLoading}
                      error={
                        profileQuickTestForm.errors.examinationTypeId &&
                        'Bắt buộc phải chọn lý do'
                      }
                      label="Lý do - đối tượng"
                      control={Select}
                      options={examinationTypeOptions}
                      value={value}
                      onChange={(__, { value: v }) => {
                        onChange(v);
                        dispatch(
                          setAssignQuickTestSession(
                            profileQuickTestForm.getValues(),
                          ),
                        );
                      }}
                    />
                  )}
                />
                <Controller
                  control={profileQuickTestForm.control}
                  defaultValue=""
                  name="samplingPlaceId"
                  rules={{ required: true }}
                  render={({ onChange, value }) => (
                    <Form.Field
                      fluid
                      search
                      deburr
                      required
                      loading={getSamplingPlaceLoading}
                      error={
                        profileQuickTestForm.errors.samplingPlaceId &&
                        'Bắt buộc phải chọn nơi lấy mẫu'
                      }
                      label="Nơi lấy mẫu"
                      control={Select}
                      options={samplingPlaceOptions}
                      value={value}
                      onChange={(__, { value: v }) => {
                        onChange(v);
                        dispatch(
                          setAssignQuickTestSession(
                            profileQuickTestForm.getValues(),
                          ),
                        );
                      }}
                    />
                  )}
                />
              </Form.Group>
              <Header as="h3" content="Địa chỉ làm việc - học tập" />
              <Form.Group widths="equal">
                <Controller
                  control={profileQuickTestForm.control}
                  defaultValue=""
                  name="provinceCode"
                  render={({ onChange, value }) => (
                    <Form.Field
                      fluid
                      search
                      deburr
                      required
                      label="Tỉnh/Thành"
                      control={Select}
                      options={provinceList.map((p) => ({
                        key: p.value,
                        value: p.value,
                        text: p.label,
                      }))}
                      value={value}
                      onChange={(__, { value: v }) => {
                        onChange(v);
                        setProvinceValue(v);
                        dispatch(
                          setAssignQuickTestSession(
                            profileQuickTestForm.getValues(),
                          ),
                        );
                      }}
                    />
                  )}
                />
                <Controller
                  control={profileQuickTestForm.control}
                  defaultValue=""
                  name="districtCode"
                  render={({ onChange, value }) => (
                    <Form.Field
                      fluid
                      search
                      deburr
                      required
                      label="Quận/Huyện"
                      control={Select}
                      options={districtList.map((p) => ({
                        key: p.value,
                        value: p.value,
                        text: p.label,
                      }))}
                      value={value}
                      onChange={(__, { value: v }) => {
                        onChange(v);
                        setDistrictValue(v);
                        dispatch(
                          setAssignQuickTestSession(
                            profileQuickTestForm.getValues(),
                          ),
                        );
                      }}
                    />
                  )}
                />
                <Controller
                  control={profileQuickTestForm.control}
                  defaultValue=""
                  name="wardCode"
                  render={({ onChange, value }) => (
                    <Form.Field
                      fluid
                      search
                      deburr
                      required
                      label="Phường/Xã"
                      control={Select}
                      options={wardList.map((p) => ({
                        key: p.value,
                        value: p.value,
                        text: p.label,
                      }))}
                      value={value}
                      onChange={(__, { value: v }) => {
                        onChange(v);
                        setWardValue(v);
                        dispatch(
                          setAssignQuickTestSession(
                            profileQuickTestForm.getValues(),
                          ),
                        );
                      }}
                    />
                  )}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Controller
                  control={profileQuickTestForm.control}
                  defaultValue=""
                  name="name"
                  render={({ onChange, onBlur, value }) => (
                    <Form.Field
                      label="Tên nơi làm việc - học tập"
                      control={Input}
                      value={value}
                      onChange={(__, { value: v }) => onChange(v)}
                      onBlur={() => {
                        onBlur();
                        dispatch(
                          setAssignQuickTestSession(
                            profileQuickTestForm.getValues(),
                          ),
                        );
                      }}
                    />
                  )}
                />
                <Controller
                  control={profileQuickTestForm.control}
                  defaultValue=""
                  name="streetHouseNumber"
                  render={({ onChange, onBlur, value }) => (
                    <Form.Field
                      label="Địa chỉ làm việc - học tập"
                      control={Input}
                      value={value}
                      onChange={(__, { value: v }) => onChange(v)}
                      onBlur={() => {
                        onBlur();
                        dispatch(
                          setAssignQuickTestSession(
                            profileQuickTestForm.getValues(),
                          ),
                        );
                      }}
                    />
                  )}
                />
              </Form.Group>
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
                    selectingList={assignList}
                    onChange={(r) => {
                      setConfirmWorkAddressOfProfileModal({
                        ...assignInformation,
                        id: r.id,
                        profile: r,
                      });
                    }}
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
                  <Header as="h3" content="Danh sách chỉ định test nhanh" />
                  <DataTable
                    hideGoToButton
                    columns={
                      hoverIndex === 1
                        ? shrinkColumn
                        : hoverIndex === 0
                          ? normalColumns
                          : expandColumns
                    }
                    data={assignList.map((r, i) => ({ ...r, index: i + 1 }))}
                    actions={[
                      {
                        content: hoverIndex !== 1 ? 'Tạo hồ sơ' : '',
                        icon: hoverIndex === 1 ? <FiPlus /> : '',
                        color: 'green',
                        onClick: () => {
                          singleProfileForm.setValue('workAddresses', [
                            {
                              streetHouseNumber: 'hello',
                            },
                          ]);
                          setCreateSingleProfileModal(true);
                        },
                        globalAction: true,
                      },
                      {
                        icon: <FiX />,
                        title: 'Xóa',
                        color: 'red',
                        onClick: (row) => {
                          setAssignList((pl) =>
                            pl.filter((p) => p.id !== row.id),
                          );
                        },
                      },
                    ]}
                  />
                </GridColumn>
              </Grid>
            </Form>
          </FormWrapper>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content="Xác nhận"
            disabled={loading}
            onClick={profileQuickTestForm.handleSubmit(onSubmit)}
          />
        </Modal.Actions>
      </Modal>

      <Modal
        size="large"
        open={createSingleProfileModal}
        onClose={() => setCreateSingleProfileModal(false)}
      >
        <Modal.Header>
          <FlexWrapper>
            <HeaderWrapper>
              Tạo mới hồ sơ
            </HeaderWrapper>
            <MarginLeftIcon>
              <ScannerIcon
                onClick={() => setScanQRModal(true)}
              />
            </MarginLeftIcon>
          </FlexWrapper>
        </Modal.Header>
        <Modal.Content>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <FormProvider {...singleProfileForm}>
            <Header as="h3" content="Thông tin đối tượng" />
            <div className="ui form">
              <ProfileSection fillExistProfile fillCmnd={!isAccountOfAirTransport} isWorkAddressRequired={!isAccountOfAirTransport} />
              <ButtonGroupWrapper>
                <MarginLeftButton
                  basic
                  color="green"
                  content="Thêm"
                  disabled={profileLoading}
                  loading={profileLoading}
                  onClick={singleProfileForm.handleSubmit(addProfile)}
                />
                <MarginLeftButton
                  basic
                  color="grey"
                  content="Huỷ"
                  disabled={profileLoading}
                  onClick={() => {
                    setCreateSingleProfileModal(false);
                  }}
                />
              </ButtonGroupWrapper>
            </div>
          </FormProvider>
        </Modal.Content>
      </Modal>

      <Modal open={scanQRModal} onClose={() => setScanQRModal(false)}>
        <Modal.Header>Scan QR</Modal.Header>
        <Modal.Content>
          <Form loading={getProfileByQRLoading}>
            <Form.Group widths="equal">
              <Controller
                control={scanQRForm.control}
                defaultValue=""
                name="content"
                rules={{ required: true }}
                render={({ onBlur, onChange, value }) => (
                  <Form.Field
                    required
                    className="qr_code"
                    error={scanQRForm.errors.content && 'Bắt buộc'}
                    label="Nội dung"
                    control={TextArea}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="green"
            content="Xác nhận"
            disabled={getProfileByQRLoading}
            onClick={scanQRForm.handleSubmit((p) => getProfileByQR(p.content))}
          />
          <MarginLeftButton
            color="red"
            content="Huỷ"
            disabled={getProfileByQRLoading}
            onClick={() => {
              setScanQRModal(false);
            }}
          />
        </Modal.Actions>
      </Modal>

      <ConfirmWorkAddressOfProfileModal
        data={confirmWorkAddressOfProfileModal}
        onChange={(d) => {
          setAssignList((al) => [...al, d]);
          setConfirmWorkAddressOfProfileModal(undefined);
        }}
        onClose={() => setConfirmWorkAddressOfProfileModal(undefined)}
      />
    </>
  );
};

CreateAssignQuickTestModal.defaultProps = {
  open: false,
  onClose: () => { },
  onRefresh: () => { },
};

CreateAssignQuickTestModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default CreateAssignQuickTestModal;
