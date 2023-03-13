import auth from 'app/reducers/auth';
import global from 'app/reducers/global';
import general from 'general/reducers/general';
import subject from 'infection-chain/reducers/subject';
import happening from 'infection-chain/reducers/happening';
import dashboard from 'dashboard/reducers/dashboard';
import contact from 'contact/reducers/contact';
import location from 'contact/reducers/location';
import medicalTest from 'medical-test/reducers/medical-test';
// import quarantine from 'quarantine/reducers/quarantine';
import facility from 'quarantine/reducers/facility';
import transport from 'medical-test/reducers/transport';
import session from 'medical-test/reducers/session';
import profile from 'profile/reducers/profile';
import quarantineRequest from 'quarantine/reducers/quarantine-request';
import quarantineFacility from 'quarantine-facilities/reducers/quarantine-facility';
import quarantineForm from 'quarantine-facilities/reducers/quarantine-form';
import quarantine from 'quarantine-facilities/reducers/quarantine';
import quarantineStatistic from 'quarantine-facilities/reducers/quarantine-statistic';
import collectingSession from 'medical-test/components/collecting-session/reducers/collecting-session';
import chain from 'chain/reducers/chain';
import chainMap from 'chain/reducers/chain-map';
import treatment from 'treatment/reducers';
import home from 'home/reducers/home';
import infectedPatient from 'patient-management/reducers/medical-test'

export default {
  auth,
  global,
  general,
  subject,
  happening,
  dashboard,
  contact,
  medicalTest,
  treatment,
  transport,
  session,
  facility,
  profile,
  quarantineRequest,
  quarantineFacility,
  quarantineForm,
  quarantine,
  chain,
  chainMap,
  quarantineStatistic,
  location,
  collectingSession,
  infectedPatient,
  home,

};
