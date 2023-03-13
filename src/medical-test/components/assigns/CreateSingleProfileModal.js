/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Modal, Form, Button, Header } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import {
  createProfile,
  updateProfile,
  createImmunizationForProfile,
  updateImmunizationForProfile,
} from 'profile/actions/profile';
import { createAssignWithProfile } from 'medical-test/actions/medical-test';
import { showConfirmModal } from 'app/actions/global';

import { useAuth } from 'app/hooks';
import { formatProfileRequest } from 'app/utils/helpers';

import SubjectSection from 'chain/components/SubjectSection';
import ExaminationReasonSection from './ExaminationReasonSection';

const CreateSingleProfileModal = ({ open, onClose, getData }) => {
  const unitInfo = useSelector((state) => state.medicalTest.unitInfo);
  const prefixList = useSelector((state) => state.medicalTest.prefixList);

  const {
    createProfileLoading,
    updateProfileLoading,
    createImmunizationForProfileLoading,
    updateImmunizationForProfileLoading,
  } = useSelector((state) => state.profile);
  const createAssignLoading = useSelector(
    (state) => state.medicalTest.createAssignLoading
  );
  const getPrefixesLoading = useSelector(
    (state) => state.medicalTest.getPrefixesLoading
  );

  const methods = useForm();
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();

  const loading =
    createAssignLoading ||
    createProfileLoading ||
    updateProfileLoading ||
    createImmunizationForProfileLoading ||
    updateImmunizationForProfileLoading;

  const onSubmit = async (d) => {
    let profileId = d?.id;
    try {
      if (!profileId) {
        const { profileId: profileIdValue } = await dispatch(
          createProfile(formatProfileRequest(d))
        );
        profileId = profileIdValue;
      } else {
        await dispatch(updateProfile(formatProfileRequest(d), false));
      }
      if (d?.immunizations && d.immunizations.length > 0) {
        const immunization = d.immunizations[0];
        await dispatch(
          d.immunizations[0].guid
            ? updateImmunizationForProfile({
                id: immunization.guid,
                guid: immunization.guid,
                profileId,
                disease: 'Covid-19',
                immunizationStatus: immunization.immunizationStatus,
                vaccine: immunization.vaccine,
                injectionDate: immunization.injectionDate,
              })
            : createImmunizationForProfile({
                profileId,
                disease: 'Covid-19',
                immunizationStatus: immunization.immunizationStatus,
                vaccine: immunization.vaccine,
                injectionDate: immunization.injectionDate,
              })
        );
      }
    } catch (e) {
      return;
    }
    const assignData = await dispatch(
      createAssignWithProfile({
        profileId,
        unitId: d.unitId || unitInfo.id,
      })
    );
    onClose();
    getData({
      ...assignData,
      unit: { id: d.unitId || unitInfo.id },
      profileCreationReason: d,
    });
  };

  return (
    <>
      <Modal
        open={open}
        size='large'
        onClose={() =>
          dispatch(
            showConfirmModal(
              'Dữ liệu chưa được lưu, bạn có muốn đóng?',
              onClose
            )
          )
        }
      >
        <Modal.Header content='Chỉ định đối tượng xét nghiệm - mẫu đơn' />
        <Modal.Content>
          <FormProvider {...methods}>
            <div className='ui form'>
              <Header as='h3' content='Lý do tạo hồ sơ' />
              <ExaminationReasonSection required isExamination />

              {isAdmin && (
                <>
                  <Header as='h3' content='Thông tin chỉ định' />
                  <Controller
                    control={methods.control}
                    defaultValue=''
                    name='unitId'
                    rules={{ required: true }}
                    render={({ onChange, onBlur, value }) => (
                      <Form.Select
                        search
                        deburr
                        clearable
                        required
                        fluid
                        label='Cơ sở lấy mẫu'
                        value={value}
                        onChange={(_, { value: v }) => onChange(v)}
                        onBlur={onBlur}
                        loading={getPrefixesLoading}
                        error={methods.errors.unitId && 'Bắt buộc'}
                        options={prefixList.map((pr) => ({
                          key: pr.id,
                          text: pr.name,
                          value: pr.id,
                        }))}
                      />
                    )}
                  />
                </>
              )}

              <Header as='h3' content='Thông tin đối tượng' />
              <div className='ui form'>
                <SubjectSection fillExistProfile />
              </div>
            </div>
          </FormProvider>
        </Modal.Content>

        <Modal.Actions>
          <Button
            positive
            labelPosition='right'
            icon='checkmark'
            content='Xác nhận'
            disabled={loading}
            loading={loading}
            onClick={methods.handleSubmit(onSubmit)}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

CreateSingleProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

export default CreateSingleProfileModal;
