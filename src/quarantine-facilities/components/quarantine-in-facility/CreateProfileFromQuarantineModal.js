import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';

import { Form, Header, Modal } from 'semantic-ui-react';
import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import { createAppoint } from 'quarantine-facilities/actions/quarantine';
import { useAuth } from 'app/hooks';

import SubjectForm from 'infection-chain/components/subject/information/SubjectForm';
import { formatObjectToAddress } from 'app/utils/helpers';
import { KeyboardDatePicker } from 'app/components/shared';

const CreateProfileFromQuarantineModal = (props) => {
  const { open, onClose, onSubmit } = props;
  const { watch, control, setValue, getValues } = useForm();
  const dispatch = useDispatch();

  const { isAdmin } = useAuth();
  const {
    getFacilitiesLoading,
    facilityData: { data },
    facilityInfo,
  } = useSelector((s) => s.quarantineFacility);
  const quarantineFacilityId = facilityInfo[0]?.id ?? '';

  const { createAppointLoading } = useSelector((s) => s.quarantine);

  const handleCreateProfile = async (profile) => {
    const d = getValues();
    const { dateOfBirth, homeAddress: quarantineHomeAddress } = profile;
    let formattedDOB = '';
    if (dateOfBirth?.length === 4) {
      formattedDOB = moment(dateOfBirth, 'YYYY')
        .startOf('year')
        .format('YYYY-MM-DD');
    }
    await dispatch(
      createAppoint({
        profile: {
          ...profile,
          dateOfBirth: formattedDOB || dateOfBirth,
        },
        ...d,
        quarantineFacilityId: d?.quarantineFacilityId ?? quarantineFacilityId,
        quarantineHomeAddress,
      }),
    );
    onClose();
    onSubmit();
  };
  const quarantineFacility = watch('quarantineFacilityId');
  const startQuarantineTime = watch('startQuarantineTime');
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo đối tượng cách ly</Modal.Header>
      <Modal.Content>
        <div className="ui form">
          {(isAdmin || !quarantineFacilityId) && (
            <Form.Group widths="equal">
              <Controller
                name="quarantineFacilityId"
                defaultValue=""
                control={control}
                render={() => (
                  <Form.Select
                    fluid
                    required
                    search
                    deburr
                    clearable
                    label="Khu cách ly chỉ định"
                    loading={getFacilitiesLoading}
                    onChange={(e, { value }) =>
                      setValue('quarantineFacilityId', value)
                    }
                    options={(data || []).map((d) => ({
                      value: d.id,
                      text: d.name,
                      content: (
                        <Header
                          content={d.name}
                          subheader={`Địa chỉ: ${formatObjectToAddress(d)}`}
                        />
                      ),
                    }))}
                  />
                )}
              />
              <Controller
                name="startQuarantineTime"
                defaultValue=""
                control={control}
                render={({ onChange }) => (
                  <Form.Field
                    fluid
                    required
                    control={KeyboardDatePicker}
                    label="Ngày chỉ định"
                    onChange={onChange}
                  />
                )}
              />
            </Form.Group>
          )}
          <Form.Group widths="equal">
            <Form.Field
              fluid
              required
              disableSubmit={Boolean(
                ((isAdmin || !quarantineFacilityId) && !quarantineFacility) ||
                  !startQuarantineTime,
              )}
              control={SubjectForm}
              loading={createAppointLoading}
              onSubmit={handleCreateProfile}
            />
          </Form.Group>
        </div>
      </Modal.Content>
    </Modal>
  );
};

CreateProfileFromQuarantineModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateProfileFromQuarantineModal;
