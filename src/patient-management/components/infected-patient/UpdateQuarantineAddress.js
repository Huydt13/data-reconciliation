import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Select, Button } from 'semantic-ui-react';
import { KeyboardDatePicker } from 'app/components/shared';

import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth, useSelectLocations } from 'app/hooks';
import { updateQuarantineAddress } from 'patient-management/actions/medical-test';
import ContactLocationAddress from 'contact/components/contact-location/ContactLocationAddress';

const UpdateQuarantineAddressModal = (props) => {
  const { data, onClose, onRefresh } = props;

  const dispatch = useDispatch();
  const {
    provinceList,
    districtList,
    wardList,
    setProvinceValue,
    setDistrictValue,
    setWardValue,
  } = useSelectLocations({});
  const { isAdmin, getAuthInfo } = useAuth();
  const { watch, register, handleSubmit, setValue, control, reset } = useForm({
    defaultValues: data,
  });
  const {
    name,
    streetHouseNumber,
    provinceValue,
    districtValue,
    wardValue,
  } = data;

  const { unitInfo, prefixList, getPrefixesLoading, createAssignLoading } =
    useSelector((state) => state.medicalTest);

  const onSubmit = async (d) => {
    try {
      await dispatch(updateQuarantineAddress({
        guid: data?.guid,
        quarantineAddress: {
          provinceValue: d?.provinceValue,
          districtValue: d?.districtValue,
          wardValue: d?.wardValue,
          streetHouseNumber: d?.streetHouseNumber,
          quarterGroup: d?.quarterGroup,
        }
      }));
      onClose();
      onRefresh();
      // eslint-disable-next-line
    } catch (error) { }
  };

  useEffect(() => {
    register({ name: 'provinceValue' });
    register({ name: 'districtValue' });
    register({ name: 'wardValue' });
    register({ name: 'streetHouseNumber' });
    register({ name: 'quarter' });
    register({ name: 'quarterGroup' });
  }, [register, watch]);


  return (
    <Modal open={Boolean(data?.guid)} onClose={onClose}>
      <Modal.Header>Cập nhật địa chỉ cách ly</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group widths="equal">
            <Form.Field
              isMedicalTestZone
              initialData={{
                provinceValue: data?.quarantineAddress?.provinceValue ?? '',
                districtValue: data?.quarantineAddress?.districtValue ?? '',
                wardValue: data?.quarantineAddress?.wardValue ?? '',
                streetHouseNumber: data?.quarantineAddress?.streetHouseNumber ?? '',
                quarterGroup: data?.quarantineAddress?.quarterGroup ?? ''
              }}
              control={ContactLocationAddress}
              onChange={(d) => {
                const {
                  wardValue,
                  districtValue,
                  provinceValue,
                  streetHouseNumber,
                  quarterGroup,
                } = d;
                setValue('wardValue', wardValue);
                setValue('districtValue', districtValue);
                setValue('provinceValue', provinceValue);
                setValue('streetHouseNumber', streetHouseNumber);
                setValue('quarterGroup', quarterGroup);
              }}
            />
          </Form.Group>

          <Button
            primary
            content="Xác nhận"
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

UpdateQuarantineAddressModal.propTypes = {
  data: PropTypes.shape({}),
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
};

UpdateQuarantineAddressModal.defaultProps = {
  data: {},
  onClose: () => { },
  onRefresh: () => { },
};

export default UpdateQuarantineAddressModal;
