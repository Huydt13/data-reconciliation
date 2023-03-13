import React, { useState } from 'react';
import DashboardHeader from 'dashboard/components/DashboardHeader';
import DashboardCharts from 'dashboard/components/DashboardCharts';
import QuarantineSummary from 'dashboard/components/QuarantineSummary';
import ExaminationSummary from 'dashboard/components/ExaminationSummary';
// import SummaryTypeSelect from 'dashboard/components/SummaryTypeSelect';
import { SummaryTypes } from 'infection-chain/utils/constants';

const DashboardPage = () => {
  const [selectingSummaryType, setSelectingSummaryType] = useState(0);
  return (
    <div>
      {/* <SummaryTypeSelect onChange={setSelectingSummaryType} /> */}
      {selectingSummaryType === SummaryTypes.SUMMARY_INFECTIONCHAIN && (
        <>
          <DashboardHeader onChange={setSelectingSummaryType} />
          <DashboardCharts />
        </>
      )}
      {selectingSummaryType === SummaryTypes.SUMMARY_EXAMINATION && (
        <ExaminationSummary />
      )}
      {selectingSummaryType === SummaryTypes.SUMMARY_QUARANTINE && (
        <QuarantineSummary onChange={setSelectingSummaryType} />
      )}
    </div>
  );
};

export default DashboardPage;
