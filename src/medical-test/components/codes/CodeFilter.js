import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Checkbox, Select, Input } from 'semantic-ui-react';
import styled from 'styled-components';

import { FilterSearchBar, KeyboardDatePicker } from 'app/components/shared';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useAuth } from 'app/hooks';

const years = [
  {
    text: moment().subtract(1, 'years').format('YYYY'),
    value: moment().subtract(1, 'years').format('YY'),
  },
  { text: moment().format('YYYY'), value: moment().format('YY') },
  {
    text: moment().add(1, 'years').format('YYYY'),
    value: moment().add(1, 'years').format('YY'),
  },
];

const Wrapper = styled.div`
  padding: 8px;
`;

const CodeFilter = (props) => {
  const { isAvailable, onChange } = props;

  const [unitPrefix, setUnitPrefix] = useState('');
  const [diseaseCode, setDiseaseCode] = useState('');
  const [year, setYear] = useState('');
  const [lastPrintFrom, setLastPrintFrom] = useState('');
  const [lastPrintTo, setLastPrintTo] = useState('');
  const [printedCount, setPrintedCount] = useState('');
  const [lastPusblishedFrom, setLastPusblishedFrom] = useState('');
  const [lastPusblishedTo, setLastPusblishedTo] = useState('');
  const [isPublished, setIsPublished] = useState(null);

  const { unitInfo, prefixList, diseaseList } = useSelector(
    (state) => state.medicalTest,
  );

  const { isAdmin } = useAuth();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      setOptions(
        prefixList.map((pr) => ({
          key: pr.id,
          text: pr.name,
          value: pr.code,
        })),
      );
    } else {
      setUnitPrefix(unitInfo?.code);
      setOptions(
        prefixList
          .filter((pr) => pr.code === unitInfo?.code)
          .map((pr) => ({
            key: pr.id,
            text: pr.name,
            value: pr.code,
          })),
      );
    }
  }, [prefixList, unitInfo, isAdmin]);

  const handleChange = (searchValue) => {
    onChange({
      unitPrefix,
      searchValue,
      isPublished,
      diseaseCode,
      year,
      lastPusblishedFrom,
      lastPusblishedTo,
      lastPrintFrom,
      lastPrintTo,
      printedCount,
    });
  };

  return (
    <FilterSearchBar onChange={handleChange}>
      <Wrapper>
        <div className="ui form">
          <Form.Group widths="equal">
            <Form.Field
              search
              deburr
              clearable={isAdmin}
              label="Cơ sở xét nghiệm"
              control={Select}
              options={options}
              value={unitPrefix}
              onChange={(e, { value }) => setUnitPrefix(value.toUpperCase())}
            />
            <Form.Field
              search
              deburr
              clearable
              label="Loại bệnh"
              control={Select}
              options={diseaseList.map((c) => ({
                key: c.id,
                text: `${c.name} - Mã bệnh: ${c.code}`,
                value: c.code,
              }))}
              onChange={(e, { value }) => setDiseaseCode(value.toUpperCase())}
            />
            <Form.Field
              clearable
              label="Năm"
              control={Select}
              options={years}
              onChange={(e, { value }) => setYear(value)}
            />
          </Form.Group>
          {isAvailable && (
            <Form.Group widths="equal">
              <Form.Field
                control={KeyboardDatePicker}
                label="Lần cuối in từ"
                onChange={setLastPrintFrom}
              />
              <Form.Field
                control={KeyboardDatePicker}
                label="Lần cuối in đến"
                onChange={setLastPrintTo}
              />
              <Form.Field
                type="number"
                control={Input}
                label="Số lần in"
                onChange={(e, { value }) => setPrintedCount(value)}
              />
            </Form.Group>
          )}
          {!isAvailable && isAdmin && (
            <Form.Group widths="equal">
              <Form.Field
                control={Checkbox}
                style={{ paddingTop: '35px' }}
                label="Đã cấp"
                indeterminate={isPublished === null}
                checked={isPublished || false}
                onClick={() => {
                  switch (isPublished) {
                    case null:
                      setIsPublished(true);
                      break;
                    case true:
                      setIsPublished(false);
                      break;
                    case false:
                      setIsPublished(null);
                      break;
                    default:
                  }
                }}
              />
              <Form.Field
                control={KeyboardDatePicker}
                label="Lần cuối cấp từ"
                onChange={setLastPusblishedFrom}
              />
              <Form.Field
                control={KeyboardDatePicker}
                label="Lần cuối cấp đến"
                onChange={setLastPusblishedTo}
              />
            </Form.Group>
          )}
        </div>
      </Wrapper>
    </FilterSearchBar>
  );
};

CodeFilter.propTypes = {
  isAvailable: PropTypes.bool,
  onChange: PropTypes.func,
};

CodeFilter.defaultProps = {
  isAvailable: false,
  onChange: () => {},
};

export default CodeFilter;
