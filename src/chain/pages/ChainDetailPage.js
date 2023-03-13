/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useState } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { Button, Tab } from 'semantic-ui-react';

import ChainSubjectsTable from 'chain/components/ChainSubjectsTable';
import ChainContactsTable from 'chain/components/ChainContactsTable';
import { FiArrowLeft, FiGitMerge } from 'react-icons/fi';
import SubjectInfectionChainModal from 'infection-chain/components/subject/information/SubjectInfectionChainModal';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { getCriterias } from 'contact/actions/contact';
import { getDiseaseTypes, getInfectionTypes } from 'general/actions/general';
import moment from 'moment';
import ListInfoRow from 'app/components/shared/ListInfoRow';

const WrapperButton = styled.div`
  padding-bottom: 15px;
`;
const ChainDetailPage = () => {
  const { id: chainId } = useParams();

  const history = useHistory();

  const dispatch = useDispatch();

  const { chainDetail } = useSelector((s) => s.chain);
  const {
    diseaseTypeData: { data: diseaseTypeList },
  } = useSelector((s) => s.general);

  useEffect(() => {
    dispatch(getCriterias());
    dispatch(getDiseaseTypes({ pageIndex: 0, pageSize: 1000 }));
    dispatch(getInfectionTypes({ pageIndex: 0, pageSize: 1000 }));
  }, [dispatch]);
  const [graphModal, setGraphModal] = useState(false);
  const panes = [
    {
      menuItem: 'Danh sách đối tượng',
      render: () => (
        <Tab.Pane>
          <ChainSubjectsTable chainId={chainId} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Thông tin tiếp xúc',
      render: () => (
        <Tab.Pane>
          <ChainContactsTable chainId={chainId} />
        </Tab.Pane>
      ),
    },
  ];

  const listInfoRowData = useMemo(
    () => [
      { icon: 'tag', label: 'Tên chuỗi', content: chainDetail.name },
      {
        icon: 'check',
        label: 'Loại chuỗi',
        content:
          typeof chainDetail.chainType === 'number'
            ? chainDetail.chainType === 0
              ? 'Chuỗi xác định'
              : 'Chuỗi nghi ngờ'
            : '...',
      },
      {
        icon: 'calendar outline',
        label: 'Thời gian',
        content: chainDetail.fromTime
          ? `${moment(chainDetail.fromTime).format('DD-MM-YYYY')} ${
              chainDetail.toTime
                ? moment(chainDetail.toTime).format('~ DD-MM-YYYY')
                : ''
            }`
          : '...',
      },
      {
        icon: 'bug',
        label: 'Loại bệnh',
        content: diseaseTypeList.find((d) => d.id === chainDetail.diseaseTypeId)
          ?.name,
      },
    ],
    [diseaseTypeList, chainDetail],
  );

  return (
    <div>
      <WrapperButton>
        <Button animated primary onClick={() => history.goBack()}>
          <Button.Content visible>Trở lại</Button.Content>
          <Button.Content hidden>
            <FiArrowLeft />
          </Button.Content>
        </Button>
        <Button animated color="teal" onClick={() => setGraphModal(true)}>
          <Button.Content visible>Sơ đồ chuỗi lây truyền</Button.Content>
          <Button.Content hidden>
            <FiGitMerge />
          </Button.Content>
        </Button>
      </WrapperButton>

      <ListInfoRow data={listInfoRowData} />

      <Tab renderActiveOnly panes={panes} />

      <SubjectInfectionChainModal
        open={graphModal}
        chainId={chainId}
        onClose={() => setGraphModal(false)}
      />
    </div>
  );
};

export default ChainDetailPage;
