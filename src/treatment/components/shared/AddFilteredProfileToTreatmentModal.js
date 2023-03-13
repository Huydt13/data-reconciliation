/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { FormProvider, useForm } from 'react-hook-form';
import {
  Modal,
  Button,
  Header,
  Grid,
  Divider,
  Message,
} from 'semantic-ui-react';

import { FiMaximize2, FiMinimize2, FiPlus, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { createProfile } from 'profile/actions/profile';
import { createProfileList } from 'treatment/actions/profile-list';
import { showConfirmModal } from 'app/actions/global';

import { DataTable } from 'app/components/shared';
import SubjectSection from 'chain/components/SubjectSection';
import ReadyForTreatmentTable from 'treatment/components/shared/ReadyForTreatmentTable';

import {
  formatProfileRequest,
  formatToYear,
  renderGender,
  renderProfileKey,
} from 'app/utils/helpers';
import ExaminationReasonSection from 'medical-test/components/assigns/ExaminationReasonSection';

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

const AddFilteredProfileToTreatmentModal = ({ open, onClose, getData }) => {
  const createProfileListLoading = useSelector(
    (state) => state.treatment.profileList.createProfileListLoading,
  );
  const createProfileLoading = useSelector(
    (state) => state.profile.createProfileLoading,
  );

  const dispatch = useDispatch();

  const methods = useForm();
  const methods2 = useForm();

  const [hoverIndex, setHoverIndex] = useState(0);

  const [creating, setCreating] = useState(false);
  const [profileList, setProfileList] = useState([]);

  const addProfile = async (d) => {
    const { profileId } = await dispatch(
      createProfile(formatProfileRequest(d)),
    );
    setProfileList((pl) => [...pl, { ...d, id: profileId }]);
    setCreating(false);
  };

  const onSubmit = async () => {
    await dispatch(
      createProfileList({
        profileIds: profileList.map(({ id }) => id),
      }),
    );
    onClose();
    getData();
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
        <Modal.Header content="Chỉ định đối tượng" />
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
                  <ReadyForTreatmentTable
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
                  <Header as="h3" content="Danh sách hồ sơ đang chọn" />
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
            disabled={createProfileListLoading}
            loading={createProfileListLoading}
            onClick={methods.handleSubmit(onSubmit)}
          />
        </Modal.Actions>

        <Modal size="large" open={creating} onClose={() => setCreating(false)}>
          <Modal.Header>Tạo mới hồ sơ</Modal.Header>
          <Modal.Content>
            <FormProvider {...methods2}>
              <Header as="h3" content="Thông tin đối tượng" />
              <div className="ui form">
                <SubjectSection />
                <ButtonGroupWrapper>
                  <MarginLeftButton
                    basic
                    color="green"
                    content="Thêm"
                    disabled={createProfileLoading}
                    loading={createProfileLoading}
                    onClick={methods2.handleSubmit(addProfile)}
                  />
                  <MarginLeftButton
                    basic
                    color="grey"
                    content="Huỷ"
                    disabled={createProfileLoading}
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

AddFilteredProfileToTreatmentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

export default AddFilteredProfileToTreatmentModal;
