import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FiEdit3, FiTag } from 'react-icons/fi';
import { Accordion } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';

import InvestigateSection from 'infection-chain/components/subject/information/form-sections/InvestigateSection';
import PatientInformationSection from 'infection-chain/components/subject/information/form-sections/PatientInformationSection';
import {
  getChainDetail,
  getSubjectFromChainAndProfile,
  getContactsBySubjectWithDispatch,
} from 'chain/actions/chain';
import InformSubjectSection from 'infection-chain/components/subject/information/form-sections/InformSubjectSection';
import ContactBySubjectTable from './ContactBySubjectTable';

const StyledWrapper = styled.div`
  display: inline-block;
  & svg {
    vertical-align: text-bottom;
    font-size: 20px;
    margin-left: 8px;
  }
`;

const toggleButton = (label, isMinimize, setMinimize) => (
  <StyledWrapper key={label}>
    <span style={{ fontWeight: 700 }}>{label}</span>
    {isMinimize ? (
      <FiEdit3
        size={25}
        onClick={(e) => {
          e.stopPropagation();
          setMinimize(false);
        }}
      />
    ) : (
      <FiTag
        size={25}
        onClick={(e) => {
          e.stopPropagation();
          setMinimize(true);
        }}
      />
    )}
  </StyledWrapper>
);

const ChainTabSection = ({ profileId }) => {
  // const [selectedSubject, setSelectedSubject] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [minimizePatientInformation, setMinimizePatientInformation] = useState(
    true,
  );
  const { selectedChain, subjectDetail } = useSelector((state) => state.chain);
  const dispatch = useDispatch();

  // get subject from profileId and chainId
  const getChain = useCallback(() => {
    if (selectedChain?.id) {
      dispatch(getChainDetail(selectedChain.id));
    }
  }, [dispatch, selectedChain]);
  const getSubject = useCallback(() => {
    if (selectedChain?.id && profileId) {
      dispatch(getSubjectFromChainAndProfile(selectedChain.id, profileId));
    }
  }, [dispatch, selectedChain, profileId]);
  const { id: subjectId } = subjectDetail;
  const getContacts = useCallback(() => {
    if (subjectId) {
      dispatch(
        getContactsBySubjectWithDispatch({
          getContactsAsSubjectFrom: false,
          subjectId,
          pageIndex,
          pageSize,
        }),
      );
    }
  }, [dispatch, subjectId, pageIndex, pageSize]);
  useEffect(() => {
    getChain();
    getSubject();
    getContacts();
  }, [getChain, getSubject, getContacts]);

  const informSubjectSection = useMemo(
    () => (
      <InformSubjectSection
        onRefresh={() => {
          getContacts();
          getSubject();
        }}
        onPaginationChange={({ pageSize: ps, pageIndex: pi }) => {
          setPageSize(ps);
          setPageIndex(pi);
        }}
      />
    ),
    [getContacts, getSubject],
  );
  const patientInformationSection = useMemo(
    () => <PatientInformationSection minimize={minimizePatientInformation} />,
    [minimizePatientInformation],
  );
  const contactInformationSection = useMemo(
    () => (
      <ContactBySubjectTable profileId={profileId} onRefresh={getContacts} />
    ),
    [profileId, getContacts],
  );
  const accordion = useMemo(() => {
    const defaultAccordion = [
      { key: 0, title: 'Thông tin chỉ điểm', content: informSubjectSection },
      {
        key: 1,
        title: 'Thông tin điều tra',
        content: <InvestigateSection />,
      },
      {
        key: 3,
        title: 'Thông tin tiếp xúc',
        content: contactInformationSection,
      },
    ];
    if (subjectDetail.infectionType?.isPositive) {
      defaultAccordion.splice(2, 0, {
        key: 2,
        title: toggleButton(
          'Thông tin bệnh nhân',
          minimizePatientInformation,
          setMinimizePatientInformation,
        ),
        content: patientInformationSection,
      });
    }
    return defaultAccordion;
  }, [
    subjectDetail,
    contactInformationSection,
    informSubjectSection,
    minimizePatientInformation,
    patientInformationSection,
  ]);

  const [activeAccordion, setActiveAccordion] = useState(
    profileId ? [0, 1, 2, 3, 4] : [0],
  );
  const handleClickAccordion = (_, titleProps) => {
    const { index } = titleProps;
    if (activeAccordion.includes(index)) {
      setActiveAccordion(activeAccordion.filter((a) => a !== index));
    } else {
      setActiveAccordion([...activeAccordion, index]);
    }
  };

  return (
    <div>
      <Accordion fluid styled exclusive={false}>
        {accordion.map((ac, i) => (
          <React.Fragment key={ac.key}>
            <Accordion.Title
              icon="dropdown"
              index={i}
              content={ac.title}
              active={activeAccordion.includes(i)}
              onClick={handleClickAccordion}
            />
            <Accordion.Content
              index={i}
              content={ac.content}
              active={activeAccordion.includes(i)}
            />
          </React.Fragment>
        ))}
      </Accordion>
    </div>
  );
};

ChainTabSection.propTypes = {
  profileId: PropTypes.number.isRequired,
};

export default ChainTabSection;
