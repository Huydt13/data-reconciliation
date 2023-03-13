import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Grid,
  Card,
  Header,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import SummaryTypeSelect from './SummaryTypeSelect';

const StyledGrid = styled(Grid)`
  padding: 8px !important;
  margin-top: 0 !important;
`;

const StyledDiv = styled.div`
  height: 156px;
  position: relative;
`;

const StyledHeader = styled(Header)`
  margin-top: calc(2rem - 0.14285714em) !important;
  padding-left: 8px;
`;

const QuarantineSummary = (props) => {
  const { onChange } = props;
  return (
    <div>
      <Grid>
        <Grid.Row>
          <Grid.Column width="8">
            <StyledHeader as="h2">Thống kê cách ly</StyledHeader>
          </Grid.Column>
          <Grid.Column width="8" textAlign="right">
            <SummaryTypeSelect onChange={onChange} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <StyledGrid>
        <Grid.Row>
          <Grid.Column computer={4} tablet={8}>
            <Card color="orange">
              {/* {!loadingGetSubjectSummaries ? ( */}
              <Card.Content>
                <Card.Header textAlign="center">
                  <Header as="h1" color="orange">
                    Tổng
                  </Header>
                </Card.Header>
                <Card.Description
                  as="h1"
                  textAlign="center"
                  style={{
                    fontWeight: 'normal',
                    marginTop: 0,
                    fontSize: '50px ',
                  }}
                >
                  123
                </Card.Description>
              </Card.Content>
              {/* ) : ( */}
              <StyledDiv>
                <Dimmer inverted active>
                  <Loader />
                </Dimmer>
              </StyledDiv>
              {/* )} */}
            </Card>
          </Grid.Column>
        </Grid.Row>
      </StyledGrid>
    </div>
  );
};

QuarantineSummary.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default QuarantineSummary;
