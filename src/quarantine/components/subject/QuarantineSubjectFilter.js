import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Select, Checkbox } from 'semantic-ui-react';
import styled from 'styled-components';

import { InstantSearchBar } from 'app/components/shared';
import { subjectTypeList } from 'infection-chain/utils/helpers';

const typeOptions = [
  { key: 1, value: 1, text: 'Cách ly tại nhà' },
  { key: 2, value: 2, text: 'Cách ly tại khu cách ly' },
];

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
  const [isCompleted, setIsCompleted] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    onChange({
      name: searchValue,
      subjectTypes: typeFilterList,
      type,
      isCompleted,
    });
    // eslint-disable-next-line
  }, [searchValue, type, typeFilterList, isCompleted]);
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

          <div className="ui form">
            <Form.Group widths="equal">
              <Form.Field
                search
                deburr
                clearable
                label="Loại hình"
                control={Select}
                options={typeOptions}
                onChange={(el, { value }) => {
                  setType(value);
                }}
              />
              <Form.Field
                style={{ paddingTop: '35px' }}
                control={Checkbox}
                label="Hoàn thành"
                indeterminate={isCompleted === null}
                checked={isCompleted || false}
                onClick={() => {
                  switch (isCompleted) {
                    case null:
                      setIsCompleted(true);
                      break;
                    case true:
                      setIsCompleted(false);
                      break;
                    case false:
                      setIsCompleted(null);
                      break;
                    default:
                  }
                }}
              />
            </Form.Group>
          </div>
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
