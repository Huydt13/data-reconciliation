import React, { useEffect } from 'react';
// import { useAuth } from 'app/hooks';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUnits,
  getPrefixes,
  getUnitInfo,
  getDiseases,
  getExaminationTypes,
} from 'medical-test/actions/medical-test';
import TransportTable from 'medical-test/components/transports/TransportTable';

const TransportPage = () => {
  const {
    unitList,
    unitInfo,
    prefixList,
    diseaseList,
    examinationTypeList,
  } = useSelector((state) => state.medicalTest);

  // const { getAuthInfo } = useAuth();
  // const userInfo = getAuthInfo();
  // const isAdmin = (userInfo?.Role ?? []).includes('admin');

  const dispatch = useDispatch();

  useEffect(() => {
    if (prefixList.length === 0) {
      dispatch(getPrefixes());
    }
    if (diseaseList.length === 0) {
      dispatch(getDiseases());
    }
    if (!unitInfo) {
      dispatch(getUnitInfo());
    }
    if (examinationTypeList.length === 0) {
      dispatch(getExaminationTypes());
    }
    if (_.isEmpty(unitList)) {
      dispatch(getUnits({}));
    }
    // eslint-disable-next-line
  }, [dispatch]);
  return (
    <>
      <TransportTable />
    </>
  );
};

export default TransportPage;
