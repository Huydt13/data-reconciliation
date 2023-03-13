/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, Header, Modal } from 'semantic-ui-react';
import { FiFileText, FiPlus, FiX } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import {
  addLocationVisitors,
  getProfileList,
  removeLocationVisitor,
} from 'contact/actions/location';

import { formatToYear } from 'app/utils/helpers';
import { DataTable } from 'app/components/shared';
import ListInfoRow from 'app/components/shared/ListInfoRow';
import SubjectSection from 'chain/components/SubjectSection';
import ContactRelativeTable from 'chain/components/ContactRelativeTable';

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

const tableColumns = [
  // {
  //   Header: 'ID',
  //   formatter: ({ id }) => (id.includes('@') ? 'Tạo mới' : id),
  // },
  {
    Header: 'Tên',
    formatter: (row) => row.fullName.toUpperCase(),
    cutlength: 50,
  },
  {
    Header: 'Năm sinh',
    formatter: ({ dateOfBirth }) => formatToYear(dateOfBirth),
  },
];

const VisitorDetailModal = ({ onClose, data, location }) => {
  const dispatch = useDispatch();

  const methods = useForm();
  const newProfile = methods.getValues();

  const [creating, setCreating] = useState(false);

  const [profileList, setProfileList] = useState([]);

  const [deletingProfileList, setDeletingProfileList] = useState([]);

  const confirmButton = (
    <MarginLeftButton
      basic
      color="green"
      content="Thêm"
      disabled={Boolean(
        !(
          newProfile.cccd ||
          newProfile.cmnd ||
          newProfile.passportNumber ||
          newProfile.healthInsuranceNumber
        ) ||
          (newProfile.cccd && newProfile.cccd.length < 12) ||
          (newProfile.cmnd && newProfile.cmnd.length < 9) ||
          (newProfile.healthInsuranceNumber &&
            newProfile.healthInsuranceNumber.length < 15) ||
          !newProfile.fullName ||
          typeof newProfile.gender !== 'number' ||
          !newProfile.dateOfBirth,
      )}
      onClick={() => {
        setProfileList((pl) => [
          ...pl,
          {
            ...methods.getValues(),
            id: uuidv4(),
            dateOfBirth: moment(methods.getValues().dateOfBirth)
              .startOf('year')
              .format('YYYY-MM-DD'),
          },
        ]);
        setCreating(false);
      }}
    />
  );

  const cancelButton = (
    <MarginLeftButton
      basic
      color="grey"
      content="Huỷ"
      onClick={() => {
        setCreating(false);
      }}
    />
  );

  useEffect(() => {
    const fetchData = async () => {
      setProfileList([]);

      const result = await dispatch(getProfileList(data.visitorProfileIds));
      setProfileList(result);
    };
    if (data && data.visitorProfileIds.length !== 0) {
      fetchData();
    }
  }, [dispatch, data]);

  const {
    getProfileListLoading,
    addLocationVisitorsLoading,
    removeLocationVisitorLoading,
  } = useSelector((s) => s.location);

  const handleSubmit = async () => {
    // using reduce to sequentially resolve promises
    const deleting = deletingProfileList
      .filter((dp) => !profileList.map((p) => p.id).includes(dp.id))
      .map((p) => p.id);
    if (deleting) {
      await deleting.reduce(async (previousPromise, profileId) => {
        await previousPromise;
        return dispatch(
          removeLocationVisitor({
            locationVisitorRecordId: data.locationVisitorRecordId,
            profileId,
          }),
        );
      }, Promise.resolve());
    }

    // existed profiles
    const adding = profileList.filter(
      (d) =>
        !profileList
          .filter((p) => typeof p.id !== 'number')
          .map((p) => p.id)
          .includes(d.id),
    );
    // new profiles
    const newProfiles = profileList.filter((p) => typeof p.id === 'string');

    if (adding.length !== 0 || newProfiles.length !== 0) {
      await dispatch(
        addLocationVisitors({
          locationVisitorAddModel: {
            locationId: location.id,
            locationType: location.locationType,
            profileIds: adding.map(({ id }) => id),
            fromTime: data.fromTime,
            toTime: data.toTime,
          },
          newProfiles: profileList
            .filter((p) => typeof p.id === 'string')
            .map((p) => ({
              ...p,
              profileCreationReason: {
                isFromDomesticInfectedZone: false,
                reason: 'Đối tượng điều tra dịch',
                reasonType: 'Tiếp xúc gần với BN',
              },
            })),
        }),
      );
    }
    onClose();
  };

  return (
    <Modal
      open={Boolean(data?.locationVisitorRecordId)}
      onClose={onClose}
      size="fullscreen"
    >
      <Modal.Header>Chi tiết địa điểm</Modal.Header>
      <Modal.Content>
        {/* info row */}
        <ListInfoRow
          data={[
            {
              icon: 'calendar outline',
              label: 'Thời gian',
              content: data?.fromTime
                ? `${moment(data.fromTime).format('HH:mm | DD-MM')} ${
                    data?.toTime
                      ? moment(data.toTime).format('~ HH:mm | DD-MM')
                      : ''
                  }`
                : '...',
            },
          ]}
        />

        <DataTable
          title="Danh sách tiếp xúc"
          columns={tableColumns}
          data={profileList}
          loading={getProfileListLoading}
          actions={[
            {
              icon: <FiPlus />,
              title: 'Thêm',
              color: 'green',
              onClick: () => setCreating(true),
              globalAction: true,
            },
            {
              icon: <FiFileText />,
              title: 'Hồ sơ',
              color: 'blue',
              onClick: ({ id }) => {
                window.open(`/profile/${id}`, '_blank');
              },
              disabled: (r) => typeof r.id === 'string',
            },
            {
              icon: <FiX />,
              title: 'Xóa',
              color: 'red',
              onClick: (row) => {
                if (typeof row.id === 'number') {
                  setDeletingProfileList((dpl) => [...dpl, row]);
                }
                setProfileList((pl) => pl.filter((p) => p.id !== row.id));
              },
            },
          ]}
        />

        {/* render components for creating profile */}
        {creating && (
          <>
            {/* select existed profile section */}
            <ContactRelativeTable
              notFetchApi
              toSubjectList={profileList.map((p) => ({
                ...p,
                profileId: p.id,
              }))}
              onChange={(r) => {
                setProfileList((pl) => [...pl, r]);
              }}
            />

            {/* create profile section using FormProvider */}
            <Header content="Thông tin đối tượng" />
            <FormProvider {...methods}>
              <div className="ui form">
                <SubjectSection fillExistProfile />
                <ButtonGroupWrapper>
                  {confirmButton}
                  {cancelButton}
                </ButtonGroupWrapper>
              </div>
            </FormProvider>
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Xác nhận"
          loading={removeLocationVisitorLoading || addLocationVisitorsLoading}
          disabled={removeLocationVisitorLoading || addLocationVisitorsLoading}
          onClick={handleSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
};

VisitorDetailModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    locationVisitorRecordId: PropTypes.string,
    visitorProfileIds: PropTypes.arrayOf(PropTypes.number),
    fromTime: PropTypes.string,
    toTime: PropTypes.string,
  }),
  location: PropTypes.shape({
    id: PropTypes.string,
    locationType: PropTypes.number,
  }).isRequired,
};

VisitorDetailModal.defaultProps = {
  data: undefined,
};

export default VisitorDetailModal;
