import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, Dimmer, Loader, Modal } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import { useAuth } from 'app/hooks';
import {
  concludeContact,
  getContactDetail,
  updateInvestigation,
} from 'chain/actions/chain';

import EvaluateTable from './EvaluateTable';

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

const EvaluateModal = ({ onClose, onRefresh, data }) => {
  const [subjectToInvestigation, setSubjectToInvestigation] = useState({});
  const { updateInvestigationLoading, concludeContactLoading } = useSelector(
    (s) => s.chain,
  );
  const [fetching, setFetching] = useState(false);
  const [criteriasFrom, setCriteriasFrom] = useState([]);
  const [criteriasTo, setCriteriasTo] = useState([]);
  const [selectingType, setSelectingType] = useState(undefined);
  const {
    subjectDetail: { id: subjectId, infectionType },
  } = useSelector((s) => s.chain);
  useEffect(() => {
    if (data?.id && subjectId) {
      setFetching(true);
      getContactDetail(data.id).then(({ subjectToInvestigations }) => {
        setFetching(false);
        const subject = subjectToInvestigations.find(
          (s) => s.subjectTo.id === subjectId,
        );
        setSubjectToInvestigation(subject);
        if (subject) {
          setCriteriasFrom(
            subject.investigationOfSubjectFrom?.criteriaCategories.map((c) => ({
              categoryId: c?.id,
              criteriaIds: c?.criterias.map((cr) => cr?.id),
            })),
          );
          setCriteriasTo(
            subject.investigationOfSubjectTo?.criteriaCategories.map((c) => ({
              categoryId: c?.id,
              criteriaIds: c?.criterias.map((cr) => cr?.id),
            })),
          );
        }
      });
    }
  }, [data, subjectId]);

  const dispatch = useDispatch();
  const handleUpdateInvestigation = useCallback(
    async (d, isFrom) => {
      const investigationCriteriaCategories = d.map((c) => ({
        investigationCriteriaCategoryId: c.categoryId,
        investigationCriteriaIds: c.criteriaIds,
      }));
      await dispatch(
        updateInvestigation(
          {
            ...subjectToInvestigation,
            investigationOfSubjectFrom: isFrom
              ? { investigationCriteriaCategories }
              : undefined,
            investigationOfSubjectTo: !isFrom
              ? { investigationCriteriaCategories }
              : undefined,
            bothInvestigationAreTheSame: false,
            informantProfileId: d.informant?.id ?? undefined,
            dateCreated: undefined,
            dateUpdated: undefined,
            concludedInfectionType: undefined,
            subjectTo: undefined,
          },
          data.id,
        ),
      );
      onClose();
      onRefresh();
    },
    [dispatch, onRefresh, onClose, subjectToInvestigation, data],
  );

  const table = useMemo(
    () => (
      <EvaluateTable
        infectionTypeId={infectionType?.id}
        criterias={criteriasFrom}
        criteriasTo={criteriasTo}
        isInvestigating
        isSameType={
          subjectToInvestigation.investigationOfSubjectFrom?.infectionType
            ?.id ===
          subjectToInvestigation.investigationOfSubjectTo?.infectionType?.id
        }
        investigationFrom={subjectToInvestigation.investigationOfSubjectFrom}
        investigationTo={subjectToInvestigation.investigationOfSubjectTo}
        onRefresh={handleUpdateInvestigation}
      />
    ),
    [
      infectionType,
      criteriasFrom,
      criteriasTo,
      subjectToInvestigation,
      handleUpdateInvestigation,
    ],
  );

  const { isAdmin } = useAuth();
  const allowToSubmit = useMemo(
    () =>
      Boolean(
        isAdmin &&
          subjectToInvestigation.investigationOfSubjectFrom &&
          subjectToInvestigation.investigationOfSubjectTo &&
          subjectToInvestigation.investigationOfSubjectFrom?.infectionType
            ?.id !==
            subjectToInvestigation.investigationOfSubjectTo?.infectionType?.id,
      ),
    [isAdmin, subjectToInvestigation],
  );
  const handleConclude = () => {
    dispatch(
      showConfirmModal('Bạn có chắc chắn?', async () => {
        await dispatch(concludeContact(data?.id, subjectId, selectingType?.id));
        onClose();
        onRefresh();
      }),
    );
  };

  return (
    <Modal size="small" open={Boolean(data?.id)} onClose={onClose}>
      <Modal.Header>Phiếu đánh giá tiếp xúc</Modal.Header>
      <Modal.Content>
        <Dimmer inverted active={fetching || updateInvestigationLoading}>
          <Loader />
        </Dimmer>
        {table}
        {allowToSubmit && (
          <ButtonGroupWrapper>
            {[
              subjectToInvestigation.investigationOfSubjectFrom?.infectionType,
              subjectToInvestigation.investigationOfSubjectTo?.infectionType,
            ].map((t) => (
              <Button
                basic={selectingType?.id !== t?.id}
                key={t?.id ?? ''}
                color={t?.colorCode ?? 'black'}
                content={t?.name ?? ''}
                onClick={() => setSelectingType(t)}
              />
            ))}
            <MarginLeftButton
              positive
              content="Xác nhận"
              onClick={handleConclude}
              loading={concludeContactLoading}
              disabled={!selectingType || concludeContactLoading}
            />
          </ButtonGroupWrapper>
        )}
      </Modal.Content>
    </Modal>
  );
};

EvaluateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
  }),
};

EvaluateModal.defaultProps = {
  data: {},
};

export default EvaluateModal;
