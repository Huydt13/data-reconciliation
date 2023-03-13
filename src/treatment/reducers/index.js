import { combineReducers } from 'redux';

import account from './account';
import visit from './visit';
import quarantineList from './quarantine-list';
import facility from './facility';
import waitingList from './waiting-list';
import employee from './employee';
import employeeType from './employee-type';
import hospital from './hospital';
import profileList from './profile-list';
import expectedQuarantineDate from './expected-quarantine-date';

export default combineReducers({
  account,
  facility,
  waitingList,
  expectedQuarantineDate,
  visit,
  quarantineList,
  employee,
  employeeType,
  hospital,
  profileList,
});
