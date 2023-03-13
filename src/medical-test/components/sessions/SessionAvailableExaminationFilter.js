import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Form, Select } from 'semantic-ui-react';

import { useSelector } from 'react-redux';
import { importantTypeList } from 'infection-chain/utils/helpers';
import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';
import { useAuth } from 'app/hooks';
import { InstantSearchBar } from 'app/components/shared';

const Wrapper = styled.div`
  padding: 8px;
`;
const feeTypeOptions = [
  { value: 0, text: 'Không thu phí' },
  { value: 1, text: 'Thu phí' },
];
const SessionAvailableExaminationFilter = (props) => {
  const { onChange } = props;

  const { getExaminationDetailsAvailableForTestSessionLoading } = useSelector(
    (s) => s.medicalTest,
  );

  const [searchValue, setSearchValue] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [diseaseId, setDiseaseId] = useState('');
  const [examTypeId, setExamTypeId] = useState('');
  const [importantValue, setImportantValue] = useState('');
  const [unitId, setUnitId] = useState('');
  const [unitTypeId, setUnitTypeId] = useState('');
  const [feeType, setFeeType] = useState('');

  const {
    unitInfo,
    prefixList,
    diseaseList,
    unitTypeList,
    examinationTypeList,
    getPrefixesLoading,
    getUnitInfoLoading,
    getExaminationTypesLoading,
    getUnitTypesLoading,
    getDiseasesLoading,
  } = useSelector((state) => state.medicalTest);

  const { isAdmin } = useAuth();
  const { isTester, isCollector, isReceiver } = unitInfo;
  const isJoiningExam = isTester && isCollector && isReceiver;

  useEffect(() => {
    onChange({
      unitId,
      unitTypeId,
      searchValue,
      from,
      to,
      diseaseId,
      examTypeId,
      importantValue,
      feeType,
    });
    // eslint-disable-next-line
  }, [
    unitId,
    unitTypeId,
    searchValue,
    from,
    to,
    diseaseId,
    examTypeId,
    importantValue,
    feeType,
  ]);

  const [options, setOptions] = useState([]);
  const [unitTypeOptions, setUnitTypeOptions] = useState([]);

  useEffect(() => {
    if (isAdmin || isJoiningExam) {
      setOptions(
        prefixList.map((pr) => ({
          key: pr.id,
          text: pr.name,
          value: pr.id,
        })),
      );
      setUnitTypeOptions(
        unitTypeList.map((ut) => ({
          key: ut.id,
          text: ut.name,
          value: ut.id,
        })),
      );
    } else {
      setUnitId(unitInfo?.id);
      setUnitTypeId(unitInfo?.unitTypeId);
      setOptions(
        prefixList
          .filter((pr) => pr.id === unitInfo?.id)
          .map((pr) => ({
            key: pr.id,
            text: pr.name,
            value: pr.id,
          })),
      );
      setUnitTypeOptions(
        unitTypeList
          .filter((pr) => pr.id === unitInfo?.unitTypeId)
          .map((ut) => ({
            key: ut.id,
            text: ut.name,
            value: ut.id,
          })),
      );
    }
  }, [isAdmin, isJoiningExam, prefixList, unitInfo, unitTypeList]);
  return (
    <InstantSearchBar
      loading={getExaminationDetailsAvailableForTestSessionLoading}
      onChange={setSearchValue}
    >
      <Wrapper>
        <div className="ui form">
          <Form.Group widths="equal">
            <Form.Field
              loading={getUnitInfoLoading || getPrefixesLoading}
              search
              deburr
              clearable={isAdmin || isJoiningExam}
              label="Cơ sở"
              control={Select}
              options={options}
              value={unitId}
              onChange={(e, { value }) => setUnitId(value)}
            />
            <Form.Field
              loading={getUnitTypesLoading}
              search
              deburr
              label="Loại hình cơ sở"
              control={Select}
              options={unitTypeOptions}
              value={unitTypeId}
              onChange={(e, { value }) => setUnitTypeId(value)}
            />
            <Form.Field
              search
              deburr
              label="Độ ưu tiên"
              control={Select}
              value={importantValue}
              options={importantTypeList.map((i) => ({
                value: i.value,
                text: i.label,
                label: {
                  empty: true,
                  circular: true,
                  color: i.color,
                },
              }))}
              onChange={(e, { value }) => {
                setImportantValue(value);
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              isHavingTime
              label="Từ ngày"
              value={from}
              control={KeyboardDateTimePicker}
              onChange={setFrom}
            />
            <Form.Field
              isHavingTime
              label="Đến ngày"
              value={to}
              control={KeyboardDateTimePicker}
              onChange={setTo}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              loading={getDiseasesLoading}
              search
              deburr
              clearable
              label="Loại bệnh"
              control={Select}
              options={diseaseList.map((c) => ({
                key: c.id,
                value: c.id,
                text: `${c.name} - Mã bệnh: ${c.code}`,
              }))}
              onChange={(e, { value }) => {
                setDiseaseId(value);
              }}
            />
            <Form.Field
              loading={getExaminationTypesLoading}
              search
              deburr
              clearable
              label="Loại mẫu xét nghiệm"
              control={Select}
              options={examinationTypeList.map((c) => ({
                key: c.id,
                value: c.id,
                text: c.name,
              }))}
              onChange={(e, { value }) => {
                setExamTypeId(value);
              }}
            />
            <Form.Field
              search
              deburr
              clearable
              label="Loại hình"
              control={Select}
              options={feeTypeOptions}
              onChange={(_, { value }) => {
                setFeeType(value);
              }}
            />
          </Form.Group>
        </div>
      </Wrapper>
    </InstantSearchBar>
  );
};

SessionAvailableExaminationFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default SessionAvailableExaminationFilter;
