import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Header, Modal } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { appoint } from 'quarantine-facilities/actions/quarantine';
import { KeyboardDatePicker } from 'app/components/shared';
import {
  getFacilities,
  getFacilityInfo,
} from 'quarantine-facilities/actions/quarantine-facility';
import { formatObjectToAddress } from 'app/utils/helpers';
import { useAuth } from 'app/hooks';

const AppointModal = (props) => {
  const { open, onClose, profile, onSubmit } = props;
  const { watch, control, getValues, setValue } = useForm();

  const dispatch = useDispatch();
  const { isAdmin } = useAuth();
  const {
    facilityData: { data },
    getFacilitiesLoading,
    facilityInfo,
  } = useSelector((s) => s.quarantineFacility);
  const quarantineFacilityId = facilityInfo[0]?.id ?? '';
  useEffect(() => {
    dispatch(getFacilityInfo());
    if (isAdmin || !quarantineFacilityId) {
      dispatch(
        getFacilities({
          pageIndex: 0,
          pageSize: 1000,
        }),
      );
    }
  }, [dispatch, isAdmin, quarantineFacilityId]);
  const { appointLoading: loading } = useSelector((s) => s.quarantine);
  const disabled = useMemo(
    () =>
      Boolean(
        (isAdmin && !watch('quarantineFacilityId')) ||
          // || !watch('quarantineHomeAddress')
          !watch('startQuarantineTime'),
      ),
    [watch, isAdmin],
  );
  const handleAppoint = async () => {
    const d = getValues();
    await dispatch(
      appoint({
        ...d,
        profileId: profile.id,
        quarantineFacilityId: d?.quarantineFacilityId ?? quarantineFacilityId,
      }),
    );
    onClose();
    onSubmit();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>{profile.fullName}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleAppoint}>
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
                    onChange={(e, { value }) => {
                      setValue('quarantineFacilityId', value);
                    }}
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
          {!(isAdmin || !quarantineFacilityId) && (
            <Form.Group widths="equal">
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
          {/* <Form.Group widths="equal">
            <Controller
              name="quarantineHomeAddress"
              defaultValue=""
              control={control}
              render={({ onChange }) => (
                <Form.Field
                  fluid
                  required
                  control={AddressDetails}
                  label="Địa chỉ nơi cư trú"
                  onChange={onChange}
                />
              )}
            />
          </Form.Group> */}
          <Form.Button
            primary
            content="Xác nhận"
            disabled={loading || disabled}
            loading={loading}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

AppointModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    id: PropTypes.number,
    fullName: PropTypes.string,
  }),
};

AppointModal.defaultProps = {
  profile: {
    id: 0,
    fullName: '',
  },
};

export default AppointModal;
