/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Card,
  Header,
  Dimmer,
  Loader,
  Responsive,
  Icon,
} from 'semantic-ui-react';

import _ from 'lodash';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { reloadSummaries } from 'dashboard/actions/dashboard';

import SummaryTypeSelect from './SummaryTypeSelect';

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

const StyledHeader = styled(Header)`
  font-weight: normal !important;
  margin-top: 0 !important;
  font-size: 50px !important;

  * {
    font-size: 20px !important;
  }
  i {
    vertical-align: unset !important;
    padding-left: 10px !important;
  }
  span {
    font-family: Barlow !important;
    font-weight: bold !important;
  }
`;

const getWidth = () =>
  typeof window === 'undefined'
    ? Responsive.onlyTablet.minWidth
    : window.innerWidth;

const DashboardHeader = ({ onChange }) => {
  const dispatch = useDispatch();

  const {
    chainsSummariesData,
    getChainsSummariesLoading,
    reloadSummariesLoading,
  } = useSelector((state) => state.dashboard);
  const [responsiveData, setResponsiveData] = useState([]);

  useEffect(() => {
    const arr = _.orderBy(
      chainsSummariesData.summaryDetails,
      [(item) => item.infectionType.level, (item) => item.infectionType.value],
      ['asc', 'asc'],
    );
    setResponsiveData(_.chunk(arr, getWidth() <= 991 ? 2 : arr.length));
  }, [chainsSummariesData]);

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
            <Header as="h2">
              <Header.Content style={{ fontWeight: 'bold' }}>
                Thống kê đối tượng
                <Icon
                  link
                  name="refresh"
                  style={{ marginLeft: '10px' }}
                  loading={reloadSummariesLoading}
                  disabled={reloadSummariesLoading}
                  onClick={() => dispatch(reloadSummaries())}
                />
                {reloadSummariesLoading && (
                  <Header.Subheader>
                    Dữ liệu đang được cập nhật
                  </Header.Subheader>
                )}
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid.Row>
      </StyledGrid>
      <StyledGrid>
        {getChainsSummariesLoading && (
          <Grid.Row>
            <Grid.Column width="16">
              <StyledCard>
                <StyledDiv>
                  <Dimmer inverted active>
                    <Loader />
                  </Dimmer>
                </StyledDiv>
              </StyledCard>
            </Grid.Column>
          </Grid.Row>
        )}
        {responsiveData.map((row, i) => (
          <Grid.Row key={i}>
            {row.map((s) => (
              <Grid.Column
                key={s.infectionTypeId}
                width={Math.floor(16 / row.length)}
              >
                <StyledCard color={s.infectionType.colorCode}>
                  <Card.Content>
                    <Card.Header textAlign="center">
                      <Header as="h1" color={s.infectionType.colorCode}>
                        {s.infectionType.name}
                      </Header>
                    </Card.Header>
                    <Card.Description textAlign="center">
                      <StyledHeader
                        content={s.total}
                        subheader={
                          s.diff && s.diff !== 0 ? (
                            <Icon
                              color={s.diff > 0 ? 'red' : 'green'}
                              name={s.diff > 0 ? 'arrow down' : 'arrow up'}
                            >
                              <span>{Math.abs(s.diff)}</span>
                            </Icon>
                          ) : null
                        }
                      />
                    </Card.Description>
                  </Card.Content>
                </StyledCard>
              </Grid.Column>
            ))}
          </Grid.Row>
        ))}
      </StyledGrid>
    </div>
  );
};

DashboardHeader.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default DashboardHeader;
