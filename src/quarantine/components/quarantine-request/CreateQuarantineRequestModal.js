import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Button, Form, Modal, Tab,
} from 'semantic-ui-react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getFacilities } from 'quarantine/actions/facility';

import GeneralInformationSection from 'infection-chain/components/subject/information/form-sections/GeneralInformationSection';

const fields = ['requester', 'facilityRequest', 'homeRequest', 'additionalInformation'];

const StyledButton = styled(Button)`
  margin-top: 16px !important;
`;

const CreateQuarantineRequestModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const {
    register, watch, setValue, handleSubmit,
  } = useForm();
  const [isPartTime, setIsPartTime] = useState(true);
  const disabled = !watch('requester')?.fullName
    || !watch('requester')?.dateOfBirth
    || !watch('facilityRequest')?.facilityId
    || (isPartTime && !watch('homeRequest')?.homeAddress);
  const panes = useMemo(
    () => [
      {
        menuItem: 'Cách ly 7/7 ngày',
        render: () => (
          <Tab.Pane attached={false}>
            <Form.Field
              paddingButton
              isCreateNewSubject
              isPartTimeQuarantine
              control={GeneralInformationSection}
              onChange={(d) => {
                setIsPartTime(true);
                const { homeAddress, facilityId, additionalInformation } = d;
                setValue('requester', {
                  ...d,
                  type: undefined,
                  religion: undefined,
                  workAddresses: undefined,
                  addressesInVietnam: undefined,
                  facilityId: undefined,
                  homeAddress: undefined,
                  additionalInformation: undefined,
                });
                setValue('homeRequest', { homeAddress });
                setValue('facilityRequest', { facilityId });
                setValue('additionalInformation', additionalInformation);
              }}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Cách ly 14 ngày',
        render: () => (
          <Tab.Pane attached={false}>
            <Form.Field
              paddingButton
              isCreateNewSubject
              isFullTimeQuarantine
              control={GeneralInformationSection}
              onChange={(d) => {
                setIsPartTime(false);
                const { facilityId, additionalInformation } = d;
                setValue('requester', {
                  ...d,
                  type: undefined,
                  religion: undefined,
                  workAddresses: undefined,
                  addressesInVietnam: undefined,
                  facilityId: undefined,
                  homeAddress: undefined,
                });
                setValue('homeRequest', undefined);
                setValue('facilityRequest', { facilityId });
                setValue('additionalInformation', additionalInformation);
              }}
            />
          </Tab.Pane>
        ),
      },
    ],
    [setValue],
  );
  useEffect(() => {
    fields.forEach(register);
  }, [register]);
  const { createQuarantineRequestLoading } = useSelector(
    (s) => s.quarantineRequest,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFacilities({ pageIndex: 0, pageSize: 10000 }));
  }, [dispatch]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Đăng ký cách ly</Modal.Header>
      <Modal.Content>
        <div
          className={`ui form ${createQuarantineRequestLoading ? 'loading' : ''}`}
        >
          <Tab menu={{ pointing: true }} panes={panes} />
          <StyledButton
            primary
            content="Đăng ký"
            disabled={disabled}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </Modal.Content>
    </Modal>
  );
};

CreateQuarantineRequestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateQuarantineRequestModal;
