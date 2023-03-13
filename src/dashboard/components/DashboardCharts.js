import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Grid, Header, Form, Select, Responsive } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';

import { KeyboardDatePicker } from 'app/components/shared';
import {
  getChainsSummaries,
  selectSubjectLocation,
} from 'dashboard/actions/dashboard';
import { getInfectionTypes } from 'general/actions/general';
import ChainMap from 'chain/components/ChainMap';

import PieChart from './PieCharts';
import LineChart from './LineCharts';
import BarCharts from './BarCharts';
import HeatMapChart from './HeatMapChart';

const StyledGrid = styled(Grid)`
  padding: 8px !important;
`;
const StyledHeader = styled(Header)`
  margin: 1rem 0em 1rem !important;
`;

const StyledTopHeader = styled(Header)`
  margin: 0 0 1rem !important;
`;

const StyledSelect = styled(Select)`
  width: 100px !important;
`;

const MarginSelect = styled(Select)`
  width: 16rem !important;
`;
const isSubjectOptions = [
  { key: 0, value: true, text: 'Theo đối tượng' },
  { key: 1, value: false, text: 'Theo đối tượng và nơi tiếp xúc' },
];

const getWidth = () =>
  typeof window === 'undefined'
    ? Responsive.onlyTablet.minWidth
    : window.innerWidth;

const DashboardCharts = () => {
  const dispatch = useDispatch();
  const { isSubject } = useSelector((state) => state.dashboard);
  const {
    infectionTypeData: { data: infectionTypeOptions },
    getInfectionTypesLoading,
  } = useSelector((s) => s.general);
  const [infectionTypeId, setInfectionTypeId] = useState('');

  const [dateFrom, setDateFrom] = useState(
    moment().subtract(7, 'days').format('YYYY-MM-DD'),
  );
  const [dateTo, setDateTo] = useState(moment().format('YYYY-MM-DD'));
  const handleRefresh = useCallback(() => {
    dispatch(
      getChainsSummaries({
        fromDate: moment(dateFrom).startOf('date').toJSON(),
        toDate: moment(dateTo).endOf('date').toJSON(),
      }),
    );
  }, [dispatch, dateFrom, dateTo]);

  useEffect(handleRefresh, [handleRefresh]);

  const changeDate = () => {
    dispatch(getChainsSummaries({ fromDate: moment().toJSON() }));
  };

  useEffect(() => {
    setInfectionTypeId(infectionTypeOptions.find((i) => i.isPositive)?.id);
  }, [infectionTypeOptions]);

  useEffect(() => {
    changeDate();
    dispatch(getInfectionTypes({ pageSize: 1000, pageIndex: 0 }));
    // eslint-disable-next-line
  }, [dispatch]);

  return (
    <div>
      <StyledGrid>
        <Grid.Row>
          <Grid.Column tablet={16} computer={8}>
            <StyledTopHeader as="h2">Sơ đồ chuỗi lây nhiễm</StyledTopHeader>
          </Grid.Column>
          <Grid.Column tablet={16} computer={8} textAlign="right">
            <MarginSelect
              text={isSubjectOptions.find((e) => e.value === isSubject).text}
              options={isSubjectOptions}
              onChange={(e, { value }) =>
                dispatch(selectSubjectLocation(value))
              }
            />
            {isSubject && (
              <StyledSelect
                text={
                  infectionTypeOptions.find((e) => e.id === infectionTypeId)
                    ?.name
                }
                options={infectionTypeOptions.map((i) => ({
                  text: i.name,
                  value: i.id,
                }))}
                loading={getInfectionTypesLoading}
                onChange={(e, { value }) => setInfectionTypeId(value)}
              />
            )}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} style={{ paddingBottom: '10px' }}>
            {infectionTypeId && (
              <ChainMap
                withLocations={!isSubject}
                infectionTypeId={infectionTypeId}
              />
            )}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column tablet={16} computer={5}>
            <StyledHeader as="h2">Biểu đồ theo thời gian</StyledHeader>
          </Grid.Column>
          <Grid.Column floated="right" tablet={16} computer={11}>
            <div className="ui form">
              <Form.Group widths="equal" style={{ marginBottom: '10px' }}>
                <Form.Field
                  label="Từ ngày"
                  control={KeyboardDatePicker}
                  value={dateFrom}
                  disabledDays={[{ after: new Date() }]}
                  onChange={setDateFrom}
                />
                <Form.Field
                  label="Đến ngày"
                  control={KeyboardDatePicker}
                  value={dateTo}
                  disabledDays={[
                    {
                      after: new Date(),
                      before: new Date(dateFrom),
                    },
                  ]}
                  onChange={setDateTo}
                />
              </Form.Group>
            </div>
          </Grid.Column>
        </Grid.Row>
        {getWidth() >= 991 ? (
          <Grid.Row stretched>
            <Grid.Column computer={10} tablet={16}>
              <LineChart />
            </Grid.Column>
            <Grid.Column computer={6} tablet={16}>
              <PieChart />
              <BarCharts />
            </Grid.Column>
          </Grid.Row>
        ) : (
          <>
            <Grid.Row>
              <Grid.Column>
                <LineChart />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <PieChart />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <BarCharts />
              </Grid.Column>
            </Grid.Row>
          </>
        )}
        <Grid.Row>
          <Grid.Column width={16}>
            <HeatMapChart />
          </Grid.Column>
        </Grid.Row>
      </StyledGrid>
    </div>
  );
};

export default DashboardCharts;
