import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

import { InstantSearchBar } from 'app/components/shared';
import { subjectTypeList } from 'infection-chain/utils/helpers';

const Wrapper = styled.div`
  padding: 8px;
`;
const ButtonWrapper = styled.div`
  margin-bottom: 16px;
`;

const QuarantineSubjectFilter = (props) => {
  const { onChange } = props;

  const [searchValue, setSearchValue] = useState('');
  const [typeFilterList, setTypeFilterList] = useState([]);

  useEffect(() => {
    onChange({
      name: searchValue,
      subjectTypes: typeFilterList,
    });
    // eslint-disable-next-line
  }, [searchValue, typeFilterList]);
  return (
    <>
      <InstantSearchBar onChange={setSearchValue}>
        <Wrapper>
          <ButtonWrapper>
            <Button.Group>
              {subjectTypeList.map((t, index) => {
                if (index !== subjectTypeList.length - 1) {
                  return (
                    <Button
                      key={t.value}
                      color={t.color}
                      content={t.label}
                      basic={!typeFilterList.includes(t.value)}
                      onClick={() => {
                        if (typeFilterList.includes(t.value)) {
                          setTypeFilterList(
                            typeFilterList.filter((tp) => tp !== t.value),
                          );
                        } else {
                          setTypeFilterList([...typeFilterList, t.value]);
                        }
                      }}
                    />
                  );
                }
                return '';
              })}
            </Button.Group>
          </ButtonWrapper>
        </Wrapper>
      </InstantSearchBar>
    </>
  );
};
QuarantineSubjectFilter.propTypes = {
  onChange: PropTypes.func,
};

QuarantineSubjectFilter.defaultProps = {
  onChange: () => {},
};

export default QuarantineSubjectFilter;
