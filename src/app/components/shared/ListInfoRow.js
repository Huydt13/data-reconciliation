import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 20px 0;
`;

const ListInfoRow = ({ data }) => (
  <Wrapper>
    <List divided horizontal>
      {data.map((d) => (
        <List.Item key={d.label}>
          <List.Icon name={d.icon} />
          <List.Content>
            <List.Header>{d.label}</List.Header>
            <List.Description>{d?.content ?? '...'}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  </Wrapper>
);

ListInfoRow.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      label: PropTypes.string,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
};

export default React.memo(ListInfoRow);
