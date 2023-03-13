import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Button, List, Header, Grid } from 'semantic-ui-react';

import { deburr } from 'app/utils/helpers';

import InstantSearchBar from '../InstantSearchBar';

const Wrapper = styled.div`
  position: relative;
  margin-top: 16px;
`;
const StyledHeader = styled(Header)`
  margin-top: 0;
  margin-bottom: 8px;
  margin-right: auto;
`;
const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;
const ListActionButton = styled(Button)`
  display: flex;
  padding: 11px !important;
  margin-right: 0 !important;
  margin-left: 9px !important;
  height: ${(props) => (props.search === 'true' ? 'auto' : '36px')};
`;
const StyledInstantSearchBar = styled(InstantSearchBar)`
  flex: 1 1 0%;
`;
const IconButton = styled(Button)`
  line-height: 0 !important;
  margin-left: 3px !important;
  margin-top: 2px !important;
  margin-right: 0 !important;
  padding: 10px !important;
`;
const BorderedList = styled(List)`
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-radius: 5px;
  margin-top: 8px !important;
`;

const DataList = (props) => {
  const {
    data,
    loading,
    search,
    title,
    listActions,
    itemActions,
    itemHeaderRender,
    itemContentRender,
    itemSubContentRender,
    onRowClick,
    getRowKey,
    toggle,
  } = props;

  const [searchValue, setSearchValue] = useState('');
  const InstantSearchBar = useMemo(() => {
    if (search) {
      return <StyledInstantSearchBar size="small" onChange={setSearchValue} />;
    }
    return null;
  }, [search]);

  const filteredData = useMemo(() => {
    if (searchValue) {
      const result = data.filter((r) => {
        const found = Object.values(r).find((v) =>
          deburr(`${v}`).toLowerCase().includes(searchValue.toLowerCase()),
        );
        return found;
      });
      return result;
    }
    return data;
  }, [data, searchValue]);

  const [selecting, setSelecting] = useState();

  return (
    <Wrapper>
      <Dimmer inverted active={loading}>
        <Loader />
      </Dimmer>

      <Grid>
        <Grid.Column width={16}>
          {search && <StyledHeader as="h3">{title}</StyledHeader>}
          <FlexWrapper>
            {search && InstantSearchBar}
            {!search && <StyledHeader as="h3">{title}</StyledHeader>}
            {listActions?.map((action) => (
              <ListActionButton
                icon
                basic
                search={`${search}`}
                key={`${action.title}-${action.color}`}
                title={action.title}
                color={action.color}
                content={action.icon}
                disabled={loading}
                onClick={action.onClick}
              />
            ))}
          </FlexWrapper>

          <BorderedList selection celled verticalAlign="middle">
            {filteredData?.map((d) => (
              <List.Item
                key={getRowKey(d)}
                active={selecting === getRowKey(d)}
                onClick={() => {
                  onRowClick(d);
                  if (toggle) {
                    if (selecting === getRowKey(d)) {
                      setSelecting(undefined);
                    } else {
                      setSelecting(getRowKey(d));
                    }
                  }
                }}
              >
                <List.Content floated="right">
                  {itemActions?.map((action) => (
                    <IconButton
                      icon
                      basic
                      key={`${action.title}-${action.color}`}
                      color={action.color}
                      title={action.title}
                      content={action.icon}
                      disabled={loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(d);
                      }}
                    />
                  ))}
                </List.Content>
                <List.Content>
                  <List.Header>{itemHeaderRender(d)}</List.Header>
                  <List.Description content={itemContentRender?.(d)} />
                  {itemSubContentRender?.(d)}
                </List.Content>
              </List.Item>
            ))}
          </BorderedList>
        </Grid.Column>
      </Grid>
    </Wrapper>
  );
};

DataList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  getRowKey: PropTypes.func.isRequired,
  itemHeaderRender: PropTypes.func.isRequired,
  itemContentRender: PropTypes.func.isRequired,
  itemSubContentRender: PropTypes.func,
  loading: PropTypes.bool,
  search: PropTypes.bool,
  toggle: PropTypes.bool,
  title: PropTypes.string,
  listActions: PropTypes.arrayOf(PropTypes.shape({})),
  itemActions: PropTypes.arrayOf(PropTypes.shape({})),
  onRowClick: PropTypes.func,
};

DataList.defaultProps = {
  data: [],
  loading: false,
  search: false,
  toggle: false,
  title: '',
  listActions: [],
  itemActions: [],
  onRowClick: () => {},
  itemSubContentRender: () => {},
};

export default DataList;
