import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Grid,
  Card,
  Header,
  Dimmer,
  Loader,
  Statistic,
} from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDashboardByDate,
  getExaminationSummary,
  getGroupedExamDetailStatistic,
} from 'dashboard/actions/dashboard';

import ExaminationLineChart from './ExaminationLineChart';
import ExaminationPieChart from './ExaminationPieChart';
import SummaryTypeSelect from './SummaryTypeSelect';
import PeopleChart from './PeopleChart';
import ExaminationDetailChart from './ExaminationDetailChart';
import ExaminationGroupedPieChart from './ExaminationGroupedPieChart';

const StyledGrid = styled(Grid)`
  padding: 8px !important;
  margin-top: 0 !important;
`;

const StyledDiv = styled.div`
  height: 156px;
  position: relative;
`;

const StyledCard = styled(Card)`
  width: 100% !important;
`;

const isIpadSize = window.innerWidth <= 992;
const StyledStatisticGroup = styled(Statistic.Group)`
  padding-bottom: 10px !important;
  margin-top: 0.5em !important;
  justify-content: space-around !important;
`;

const ExaminationSummary = (props) => {
  const { onChange } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getExaminationSummary());
    dispatch(getDashboardByDate());
    dispatch(getGroupedExamDetailStatistic());
  }, [dispatch]);
  const {
    loadingGetExaminationSummary,
    examinationSummary,
    dashboardByDate,
    getDashboardByDateLoading,
  } = useSelector((state) => state.dashboard);

  return (
    <div>
      <StyledGrid>
        <Grid.Row>
          <Grid.Column width="16" textAlign="right">
            <SummaryTypeSelect onChange={onChange} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width="16">
            <Header as="h2">Thống kê xét nghiệm</Header>
          </Grid.Column>
        </Grid.Row>
      </StyledGrid>
      <StyledGrid>
        <Grid.Row>
          <Grid.Column computer={4} tablet={8}>
            <StyledCard color="orange">
              {!(loadingGetExaminationSummary || getDashboardByDateLoading) ? (
                <Card.Content>
                  <Card.Header textAlign="center">
                    <Header as={isIpadSize ? 'h4' : 'h3'} color="orange">
                      LẤY MẪU
                    </Header>
                  </Card.Header>
                  <StyledStatisticGroup size={isIpadSize ? 'mini' : 'tiny'}>
                    <Statistic
                      horizontal={isIpadSize}
                      label="Tổng"
                      value={examinationSummary.takenExamination}
                    />
                    <Statistic
                      horizontal={isIpadSize}
                      label="Trong ngày"
                      value={dashboardByDate.taken}
                    />
                  </StyledStatisticGroup>
                </Card.Content>
              ) : (
                <StyledDiv>
                  <Dimmer inverted active>
                    <Loader />
                  </Dimmer>
                </StyledDiv>
              )}
            </StyledCard>
          </Grid.Column>
          <Grid.Column computer={4} tablet={8}>
            <StyledCard color="violet">
              {!(loadingGetExaminationSummary || getDashboardByDateLoading) ? (
                <Card.Content>
                  <Card.Header textAlign="center">
                    <Header as={isIpadSize ? 'h4' : 'h3'} color="violet">
                      XÉT NGHIỆM
                    </Header>
                  </Card.Header>
                  <StyledStatisticGroup size={isIpadSize ? 'mini' : 'tiny'}>
                    <Statistic
                      horizontal={isIpadSize}
                      label="Tổng"
                      value={examinationSummary.tested}
                    />
                    <Statistic
                      horizontal={isIpadSize}
                      label="Trong ngày"
                      value={dashboardByDate.tested}
                    />
                  </StyledStatisticGroup>
                </Card.Content>
              ) : (
                <StyledDiv>
                  <Dimmer inverted active>
                    <Loader />
                  </Dimmer>
                </StyledDiv>
              )}
            </StyledCard>
          </Grid.Column>
          <Grid.Column
            computer={4}
            tablet={8}
            style={{ marginTop: isIpadSize ? '32px' : '0' }}
          >
            <StyledCard color="green">
              {!(loadingGetExaminationSummary || getDashboardByDateLoading) ? (
                <Card.Content>
                  <Card.Header textAlign="center">
                    <Header as={isIpadSize ? 'h4' : 'h3'} color="green">
                      CÓ KẾT QUẢ
                    </Header>
                  </Card.Header>
                  <StyledStatisticGroup size={isIpadSize ? 'mini' : 'tiny'}>
                    <Statistic
                      horizontal={isIpadSize}
                      label="Tổng"
                      value={examinationSummary.resultedExamination}
                    />
                    <Statistic
                      horizontal={isIpadSize}
                      label="Trong ngày"
                      value={dashboardByDate.resulted}
                    />
                  </StyledStatisticGroup>
                </Card.Content>
              ) : (
                <StyledDiv>
                  <Dimmer inverted active>
                    <Loader />
                  </Dimmer>
                </StyledDiv>
              )}
            </StyledCard>
          </Grid.Column>
          <Grid.Column
            computer={4}
            tablet={8}
            style={{ marginTop: isIpadSize ? '32px' : '0' }}
          >
            <StyledCard color="red">
              {!(loadingGetExaminationSummary || getDashboardByDateLoading) ? (
                <Card.Content>
                  <Card.Header textAlign="center">
                    <Header as={isIpadSize ? 'h4' : 'h3'} color="red">
                      DƯƠNG TÍNH
                    </Header>
                  </Card.Header>
                  <StyledStatisticGroup size={isIpadSize ? 'mini' : 'tiny'}>
                    <Statistic
                      horizontal={isIpadSize}
                      label="Tổng"
                      value={examinationSummary.positive}
                    />
                    <Statistic
                      horizontal={isIpadSize}
                      label="Trong ngày"
                      value={dashboardByDate.positive}
                    />
                  </StyledStatisticGroup>
                </Card.Content>
              ) : (
                <StyledDiv>
                  <Dimmer inverted active>
                    <Loader />
                  </Dimmer>
                </StyledDiv>
              )}
            </StyledCard>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width="16">
            <ExaminationLineChart />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column mobile="16" tablet="8" computer="8">
            <ExaminationPieChart />
          </Grid.Column>
          <Grid.Column mobile="16" tablet="8" computer="8">
            <ExaminationGroupedPieChart />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column mobile="16" tablet="8" computer="8">
            <PeopleChart />
          </Grid.Column>
          <Grid.Column mobile="16" tablet="8" computer="8">
            <ExaminationDetailChart />
          </Grid.Column>
        </Grid.Row>
      </StyledGrid>
    </div>
  );
};

ExaminationSummary.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default ExaminationSummary;
