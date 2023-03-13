import React, { useEffect } from 'react';
import { Tab } from 'semantic-ui-react';
import CodeTable from 'medical-test/components/codes/CodeTable';
import UsedCodeTable from 'medical-test/components/codes/UsedCodeTable';
import { useDispatch, useSelector } from 'react-redux';
// import { useAuth } from 'app/hooks';
import {
  getPrefixes,
  getDiseases,
  getUnitInfo,
} from 'medical-test/actions/medical-test';

const panes = [
  {
    menuItem: 'Mã chưa sẵn sàng',
    render: () => (
      <Tab.Pane>
        <CodeTable />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Mã sẵn sàng',
    render: () => (
      <Tab.Pane>
        <CodeTable isAvailable />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Mã đã sử dụng',
    render: () => (
      <Tab.Pane>
        <UsedCodeTable />
      </Tab.Pane>
    ),
  },
];

const CodePage = () => {
  const dispatch = useDispatch();
  const {
    unitInfo,
    prefixList,
    diseaseList,
  } = useSelector((state) => state.medicalTest);

  // const { getAuthInfo } = useAuth();
  // const userInfo = getAuthInfo();
  // const isAdmin = (userInfo?.Role ?? []).includes('admin');

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
    // eslint-disable-next-line
  }, [dispatch]);
  return (
    <div>
      <Tab renderActiveOnly panes={panes} />
    </div>
  );
};

export default CodePage;
