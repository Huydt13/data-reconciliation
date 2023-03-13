import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Button,
  // Button,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import {
  // useDispatch,
  useSelector,
} from 'react-redux';

import LocationSection from 'chain/components/LocationSection';
import AirplaneSection from 'chain/components/AirplaneSection';
import OtherVehicleSection from 'chain/components/OtherVehicleSection';
import MinimizeLocationSection from 'chain/components/MinimizeLocationSection';
import MinimizeAirplaneSection from 'chain/components/MinimizeAirplaneSection';
import MinimizeOtherVehicleSection from 'chain/components/MinimizeOtherVehicleSection';

import { LocationType } from 'infection-chain/utils/constants';
import MinimizeAlias from 'chain/components/MinimizeAlias';
import AliasSection from 'chain/components/AliasSection';

// const StyledLocationVehicleButtonWrapper = styled.div`
//   margin-bottom: 10px;
// `;

const ConfirmButtonWrapper = styled.div`
  width: 100%;
  text-align: right;
`;

const PatientInformationSection = ({
  minimize,
  // onRefresh
}) => {
  const { subjectDetail, getSubjectDetailLoading } = useSelector(
    (s) => s.chain,
  );
  const { reset, watch, register, setValue, getValues } = useForm({
    defaultValues: { ...subjectDetail },
  });

  useEffect(() => {
    register('diseaseOutbreakLocation');
  }, [register]);

  useEffect(() => {
    if (subjectDetail.id) {
      reset({
        ...subjectDetail,
        locationType: subjectDetail.diseaseOutbreakLocationType,
      });
    }
  }, [reset, subjectDetail]);

  const locationType = watch('locationType');
  // const dispatch = useDispatch();

  // const handleUpdate = async () => {
  //   await dispatch(updateSubject(getValues()));
  //   onRefresh();
  // };

  return (
    <>
      {minimize ? (
        <div style={{ position: 'relative' }}>
          {getSubjectDetailLoading ? (
            <Dimmer inverted active>
              <Loader />
            </Dimmer>
          ) : (
            <>
              <MinimizeAlias />
              <span>Địa điểm phát bệnh </span>
              {locationType === LocationType.LOCATION && (
                <MinimizeLocationSection />
              )}
              {locationType === LocationType.AIRPLANE && (
                <MinimizeAirplaneSection />
              )}
              {locationType === LocationType.VEHICLE && (
                <MinimizeOtherVehicleSection />
              )}
            </>
          )}
        </div>
      ) : (
        <>
          {/* <StyledLocationVehicleButtonWrapper>
            <Button.Group>
              <Button
                primary
                basic={locationType !== LocationType.LOCATION}
                content="Địa điểm"
                onClick={() => setValue('locationType', LocationType.LOCATION)}
              />
              <Button
                primary
                basic={locationType !== LocationType.AIRPLANE}
                content="Máy bay"
                onClick={() => setValue('locationType', LocationType.AIRPLANE)}
              />
              <Button
                primary
                basic={locationType !== LocationType.VEHICLE}
                content="Phương tiện khác"
                onClick={() => setValue('locationType', LocationType.VEHICLE)}
              />
            </Button.Group>
          </StyledLocationVehicleButtonWrapper> */}
          <AliasSection
            data={subjectDetail}
            onChange={({
              byT_Alias: byt,
              hcM_Alias: hcm,
              hcdC_Alias: hcdc,
            }) => {
              setValue('byT_Alias', byt);
              setValue('hcM_Alias', hcm);
              setValue('hcdC_Alias', hcdc);
            }}
          />
          {(!locationType || locationType === LocationType.LOCATION) && (
            <LocationSection
              data={watch('diseaseOutbreakLocation')}
              onChange={(d) => setValue('diseaseOutbreakLocation', d)}
            />
          )}
          {locationType === LocationType.AIRPLANE && (
            <AirplaneSection
              data={watch('diseaseOutbreakLocation')}
              onChange={(d) => setValue('diseaseOutbreakLocation', d)}
            />
          )}
          {locationType === LocationType.VEHICLE && (
            <OtherVehicleSection
              data={watch('diseaseOutbreakLocation')}
              onChange={(d) => setValue('diseaseOutbreakLocation', d)}
            />
          )}
          <ConfirmButtonWrapper>
            <Button
              icon="sync"
              color="violet"
              content="Cập nhật"
              onClick={() => console.log(getValues())}
            />
          </ConfirmButtonWrapper>
        </>
      )}
    </>
  );
};

PatientInformationSection.propTypes = {
  minimize: PropTypes.bool,
  // onRefresh: PropTypes.func,
};

PatientInformationSection.defaultProps = {
  minimize: false,
  // onRefresh: () => {},
};

export default PatientInformationSection;
