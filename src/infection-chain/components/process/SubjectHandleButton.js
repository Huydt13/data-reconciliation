import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button } from 'semantic-ui-react';
import { ProcessType } from 'infection-chain/utils/constants';
import { useDispatch } from 'react-redux';
import { processSubject } from 'infection-chain/actions/subject';
import SubjectHomeModal from './SubjectHomeModal';
import SubjectQuarantineZoneModal from './SubjectQuarantineZoneModal';
import SubjectTreatmentZoneModal from './SubjectTreatmentZone';

const SubjectHandleButton = (props) => {
  const { code, type, subjectId, onSuccess } = props;

  const [modal, setModal] = useState({
    home: false,
    quarantineZone: false,
    treatmentZone: false,
  });

  const dispatch = useDispatch();
  const handleSubmit = (data, t) => {
    // process
    dispatch(
      processSubject({
        ...data,
        subjectId,
        type: t,
      }),
    ).then(() => {
      setModal({
        home: false,
        quarantineZone: false,
        treatmentZone: false,
      });
      onSuccess();
    });
  };

  return (
    <>
      {type === 0 && (
        <Button
          color="yellow"
          onClick={() => setModal({ treatmentZone: true })}
        >
          Cách ly tại cơ sở điều trị
        </Button>
      )}
      {type !== 0 && (
        <Dropdown upward as={Button} text="Xử lý" color="yellow">
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setModal({ home: true })}>
              Cách ly tại nhà
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setModal({ quarantineZone: true })}>
              Cách ly tại khu cách ly tập trung
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
      <SubjectHomeModal
        open={modal.home}
        onClose={() => setModal({ home: false })}
        onSubmit={(data) => handleSubmit(data, ProcessType.HOME)}
      />
      <SubjectQuarantineZoneModal
        open={modal.quarantineZone}
        onClose={() => setModal({ quarantineZone: false })}
        onSubmit={(data) => handleSubmit(data, ProcessType.QUARANTINE_ZONE)}
      />
      <SubjectTreatmentZoneModal
        open={modal.treatmentZone}
        code={code}
        onClose={() => setModal({ treatmentZone: false })}
        onSubmit={(data) => handleSubmit(data, ProcessType.TREATMENT_ZONE)}
      />
    </>
  );
};

SubjectHandleButton.propTypes = {
  type: PropTypes.number,
  code: PropTypes.string,
  subjectId: PropTypes.string,
  onSuccess: PropTypes.func,
};

SubjectHandleButton.defaultProps = {
  type: 0,
  code: '',
  subjectId: '',
  onSuccess: () => {},
};

export default SubjectHandleButton;
