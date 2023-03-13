import React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';

const HomePage = () => {
  if (process.env.NODE_ENV === 'production') {
    onbeforeunload = () => '';
  }

  return (
    <>
      <Segment style={{ padding: '4em 0em' }} vertical>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>
              <Header
                as="h3"
                style={{ fontSize: '2em' }}
                content="👋 Welcome to CDS!"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </>
  );
};

export default HomePage;
