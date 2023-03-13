import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'semantic-ui-react';

import moment from 'moment';

import {
  addSubjects,
  deleteSubject,
  getContactDetail,
  updateInvestigationWithoutDispatch,
} from 'chain/actions/chain';

import { getFullLocationName } from 'app/utils/helpers';
import ListInfoRow from 'app/components/shared/ListInfoRow';

import ContactSubjectTable from './ContactSubjectTable';

const UpdateContactModal = (props) => {
  const { onClose, onRefresh, profileId, infectionTypeId, data } = props;
  const [fetching, setFetching] = useState(false);
  const [toSubjectList, setToSubjectList] = useState([]);
  const [deletingList, setDeletingList] = useState([]);
  const [contactDetail, setContactDetail] = useState({});

  const firstInfoRowData = useMemo(
    () => [
      {
        icon: 'user',
        label: 'Người khai báo',
        content: contactDetail.informant?.fullName,
      },
      {
        icon: 'map marker alternate',
        label: 'Nơi tiếp xúc',
        content: contactDetail.location
          ? getFullLocationName(contactDetail)
          : '...',
      },
      {
        icon: 'calendar outline',
        label: 'Thời gian',
        content: contactDetail.fromTime
          ? `${moment(contactDetail.fromTime).format('HH:mm | DD-MM')} ${
              contactDetail.toTime
                ? moment(contactDetail.toTime).format('~ HH:mm | DD-MM')
                : ''
            }`
          : '...',
      },
    ],
    [contactDetail],
  );
  const secondInfoRowData = useMemo(
    () => [
      {
        icon: 'angle right',
        label: 'Tiếp xúc gần',
        content: contactDetail?.numberOfCloseContacts ?? '...',
      },
      {
        icon: 'angle double right',
        label: 'Tiếp xúc khác',
        content: contactDetail?.numberOfOtherContacts ?? '...',
      },
      {
        icon: 'list alternate outline',
        label: 'Đã tiếp cận',
        content: contactDetail?.numberOfApproachedSubjects ?? '...',
      },
      {
        icon: 'syringe',
        label: 'Đã lấy mẫu',
        content: contactDetail?.numberOfExaminedSubjects ?? '...',
      },
    ],
    [contactDetail],
  );
  const thirdInfoRowData = useMemo(
    () => [
      {
        icon: 'check',
        label: 'Dương tính',
        content: contactDetail?.numberOfExaminedPositiveSubjects ?? '...',
      },
      {
        icon: 'dont',
        label: 'Âm tính',
        content: contactDetail?.numberOfExaminedNegativeSubjects ?? '...',
      },
      {
        icon: 'wait',
        label: 'Chờ kết quả',
        content: contactDetail?.numberOfExaminedWaitingSubjects ?? '...',
      },
    ],
    [contactDetail],
  );

  useEffect(() => {
    if (data?.id) {
      setFetching(true);
      getContactDetail(data.id).then((res) => {
        setContactDetail(res);
        setToSubjectList(
          res.subjectToInvestigations.map((s) => ({
            ...s.subjectTo,
            ...s.subjectTo.profileDetail,
            id: s.subjectTo.id,
            sKey: s.subjectTo.id,
            relationship: s.relationship,
            investigationId: s.id,
            criterias: s?.investigationOfSubjectFrom?.criteriaCategories.map(
              (c) => ({
                categoryId: c?.id,
                criteriaIds: c?.criterias.map((cr) => cr?.id),
              }),
            ),
            type: s?.subjectTo?.infectionType,
          })),
        );
        setFetching(false);
      });
    }
  }, [data]);

  const [hideConfirmButton, setHideConfirmButton] = useState(false);

  const onSubmit = async () => {
    const subjectToInvestigations = toSubjectList
      .filter((s) => s.subjectToProfileId)
      .map((s) => ({
        ...s,
        investigationOfSubjectFrom: {
          investigationCriteriaCategories: s.criterias.map((c) => ({
            investigationCriteriaCategoryId: c.categoryId,
            investigationCriteriaIds: c.criteriaIds,
          })),
        },
      }));
    const newProfileInvestigations = toSubjectList
      .filter((s) => !s.id)
      .map((s) => ({
        newProfile: {
          ...s,
          criterias: undefined,
          type: undefined,
          sKey: undefined,
          bothInvestigationAreTheSame: undefined,
          relationship: undefined,
          profileCreationReason: {
            isFromDomesticInfectedZone: false,
            reason: 'Đối tượng điều tra dịch',
            reasonType: 'Tiếp xúc gần với BN',
            realtedPositiveProfileId: profileId || undefined,
          },
        },
        relationship: s.relationship,
        investigationOfSubjectFrom: {
          investigationCriteriaCategories: s.criterias.map((c) => ({
            investigationCriteriaCategoryId: c.categoryId,
            investigationCriteriaIds: c.criteriaIds,
          })),
        },
        bothInvestigationAreTheSame: s.bothInvestigationAreTheSame,
      }));
    const fetchingData = {
      addSubjectToContactModel: {
        contactId: data.id,
        subjectToInvestigations,
      },
      newProfileInvestigations,
    };
    try {
      setFetching(true);
      // delete subjects if deletingList.length
      if (deletingList.length !== 0) {
        await deleteSubject(data.id, deletingList);
      }

      // update investigation
      await Promise.all(
        toSubjectList
          .filter(
            (toSubject) =>
              toSubject.updating &&
              !toSubject.sKey.includes('@') &&
              toSubject.sKey.includes('-'),
          )
          .map((s) =>
            updateInvestigationWithoutDispatch(
              {
                id: s.investigationId,
                relationship: s.relationship,
                investigationOfSubjectFrom: {
                  investigationCriteriaCategories: s.criterias.map((c) => ({
                    investigationCriteriaCategoryId: c.categoryId,
                    investigationCriteriaIds: c.criteriaIds,
                  })),
                },
                bothInvestigationAreTheSame: s.bothInvestigationAreTheSame,
              },
              data.id,
            ),
          ),
      );

      // add subjects if (subjectToInvestigations || newProfileInvestigations).length
      if (
        fetchingData.addSubjectToContactModel.subjectToInvestigations.length !==
          0 ||
        fetchingData.newProfileInvestigations.length !== 0
      ) {
        await addSubjects(fetchingData);
      }
    } finally {
      setFetching(false);
      onClose();
      onRefresh();
    }
  };

  return (
    <Modal open={Boolean(data?.id)} size="fullscreen">
      <Modal.Header>Chi tiết mốc dịch tễ</Modal.Header>
      <Modal.Content>
        <ListInfoRow data={firstInfoRowData} />
        <ListInfoRow data={secondInfoRowData} />
        <ListInfoRow data={thirdInfoRowData} />

        <ContactSubjectTable
          loading={fetching}
          toSubjects={toSubjectList}
          profileId={profileId}
          onChange={setToSubjectList}
          onDisabled={setHideConfirmButton}
          onDeletingChange={setDeletingList}
          infectionTypeId={infectionTypeId}
        />
      </Modal.Content>
      {!hideConfirmButton && (
        <Modal.Actions>
          <Button content="Huỷ" onClick={onClose} />
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content="Xác nhận"
            loading={fetching}
            disabled={fetching}
            onClick={onSubmit}
          />
        </Modal.Actions>
      )}
    </Modal>
  );
};

UpdateContactModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  profileId: PropTypes.number.isRequired,
  infectionTypeId: PropTypes.string,
  data: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

UpdateContactModal.defaultProps = {
  infectionTypeId: '',
};

export default UpdateContactModal;
