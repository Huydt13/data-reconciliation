import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Checkbox } from 'semantic-ui-react';
import styled from 'styled-components';

import { InstantSearchBar } from 'app/components/shared';

import { subjectTypeList } from 'infection-chain/utils/helpers';

const Wrapper = styled.div`
  padding: 8px;
`;
const ButtonWrapper = styled.div`
  margin-bottom: 16px;
`;

const MedicalTestFilter = (props) => {
  const { onChange } = props;

  const [searchValue, setSearchValue] = useState('');
  const [typeFilterList, setTypeFilterList] = useState([]);
  const [takeUnExaminedSubjects, setTakeUnExaminedSubjects] = useState(null);
  const [takeOnlyPositiveSubjects, setTakeOnlyPositiveSubjects] =
    useState(false);

  useEffect(() => {
    onChange({
      subjectName: searchValue,
      subjectTypes: typeFilterList,
      takeUnExaminedSubjects,
      takeOnlyPositiveSubjects,
    });
    // eslint-disable-next-line
  }, [
    searchValue,
    typeFilterList,
    takeUnExaminedSubjects,
    takeOnlyPositiveSubjects,
  ]);

  return (
    <>
      <InstantSearchBar onChange={(v) => setSearchValue(v)}>
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
            <Form.Group>
              <Form.Field
                control={Checkbox}
                label="Đã xét nghiệm"
                indeterminate={takeUnExaminedSubjects === null}
                checked={!takeUnExaminedSubjects || false}
                onClick={() => {
                  switch (takeUnExaminedSubjects) {
                    case null:
                      setTakeUnExaminedSubjects(true);
                      break;
                    case true:
                      setTakeUnExaminedSubjects(false);
                      break;
                    case false:
                      setTakeUnExaminedSubjects(null);
                      break;
                    default:
                  }
                }}
              />
              <Form.Field
                control={Checkbox}
                label="Dương tính"
                checked={takeOnlyPositiveSubjects}
                onClick={() =>
                  setTakeOnlyPositiveSubjects(!takeOnlyPositiveSubjects)
                }
              />
            </Form.Group>
          </div>
        </Wrapper>
      </InstantSearchBar>
    </>
  );
};

MedicalTestFilter.propTypes = {
  onChange: PropTypes.func,
};

MedicalTestFilter.defaultProps = {
  onChange: () => {},
};

export default MedicalTestFilter;
