import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Input } from 'semantic-ui-react';
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

const CodeFilter = ({ onChange }) => {
  const [unitPrefix, setUnitPrefix] = useState('');
  const [diseaseCode, setDiseaseCode] = useState('');
  const [lastPrintFrom, setLastPrintFrom] = useState('');
  const [lastPrintTo, setLastPrintTo] = useState('');
  const [printedCount, setPrintedCount] = useState('');
  const [usedFrom, setUsedFrom] = useState('');
  const [usedTo, setUsedTo] = useState('');
  const [year, setYear] = useState('');

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
      diseaseCode,
      year,
      lastPrintFrom,
      lastPrintTo,
      printedCount,
      usedFrom,
      usedTo,
    });
  };

  return (
    <>
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
            <Form.Group widths="equal">
              <Form.Field
                control={KeyboardDatePicker}
                label="Lần in cuối từ"
                onChange={setLastPrintFrom}
              />
              <Form.Field
                control={KeyboardDatePicker}
                label="Lần in cuối đến"
                onChange={setLastPrintTo}
              />
              <Form.Field
                type="number"
                control={Input}
                label="Số lần in"
                onChange={(e, { value }) => setPrintedCount(value)}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                control={KeyboardDatePicker}
                label="Ngày sử dụng từ"
                onChange={setUsedFrom}
              />
              <Form.Field
                control={KeyboardDatePicker}
                label="Ngày sử dụng đến"
                onChange={setUsedTo}
              />
            </Form.Group>
          </div>
        </Wrapper>
      </FilterSearchBar>
    </>
  );
};

CodeFilter.propTypes = {
  onChange: PropTypes.func,
};

CodeFilter.defaultProps = {
  onChange: () => {},
};

export default CodeFilter;
