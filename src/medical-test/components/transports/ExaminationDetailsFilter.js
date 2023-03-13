/* eslint-disable no-nested-ternary */
import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Form, Select, Checkbox } from 'semantic-ui-react';
import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';
import { KeyboardDatePicker, FilterSearchBar } from 'app/components/shared';

import { useSelector } from 'react-redux';
import { useAuth } from 'app/hooks';

import { naturalCompare } from 'app/utils/helpers';
import { importantTypeList } from 'infection-chain/utils/helpers';

const Wrapper = styled.div`
  padding: 8px;
`;

const feeTypeOptions = [
  { key: 0, value: 0, text: 'Không thu phí' },
  { key: 1, value: 1, text: 'Thu phí' },
];
const sampleTypeOptions = [
  { key: 0, value: false, text: 'Mẫu đơn' },
  { key: 1, value: true, text: 'Mẫu gộp' },
];

const ExaminationDetailsFilter = (props) => {
  const {
    isGetAll,
    isTakenUnit,
    isReceivedUnit,
    // eslint-disable-next-line no-unused-vars
    isWaitingSample,
    isProcessedSample,
    // eslint-disable-next-line no-unused-vars
    isUnQualifySample,
    hideDateFilter,
    nonImportantValue,
    onChange,
  } = props;

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [resultDate, setResultDate] = useState('');
  const [diseaseId, setDiseaseId] = useState('');
  const [examTypeId, setExamTypeId] = useState('');
  const [importantValue, setImportantValue] = useState('');
  const [isGroup, setIsGroup] = useState(null);
  const [hasResult, setHasResult] = useState(null);
  const [unitTaken, setUnitTaken] = useState('');
  const [unitTesting, setUnitTesting] = useState('');
  const [unitTypeId, setUnitTypeId] = useState('');
  const [feeType, setFeeType] = useState('');
  const [resultType, setResultType] = useState('');
  const [samplingPlaceId, setSamplingPlaceId] = useState('');

  const { isAdmin } = useAuth();
  const {
    unitInfo,
    unitTypeList,
    prefixList,
    diseaseList,
    examinationTypeList,
    samplingPlaceList,
    clearExaminationDetailFilter,
  } = useSelector((state) => state.medicalTest);

  const unitTypeOptions = useMemo(() => {
    if (isAdmin || isGetAll) {
      return unitTypeList
        .filter((unit) => unit?.id)
        .reduce((array, unit) => (
          [
            ...array,
            {
              key: unit.id,
              value: unit.id,
              text: unit.name,
            },
          ]), []);
    }
    if (unitInfo?.unitTypeId) {
      return unitTypeList
        .filter((type) => type.id === (unitInfo?.unitTypeId ?? ''))
        .reduce((array, type) => (
          [
            ...array,
            {
              key: type.id,
              value: type.id,
              text: type.name,
            },
          ]), []);
    }
    return [];
  }, [
    isGetAll,
    isAdmin,
    unitInfo,
    unitTypeList,
  ]);

  const takenUnitOptions = useMemo(() => {
    if (isAdmin || isGetAll) {
      return prefixList
        .filter((unit) => unit?.isCollector)
        .reduce((array, unit) => ([
          ...array,
          {
            key: unit.id,
            value: unit.id,
            text: unit.name,
          },
        ]), []);
    }
    if (isTakenUnit) {
      return prefixList
        .filter((unit) => unit.id === (unitInfo?.id ?? ''))
        .map((unit) => ({
          key: unit.id,
          value: unit.id,
          text: unit.name,
        }));
    }
    if (isReceivedUnit) {
      return prefixList
      .filter((unit) => unit?.isCollector)
      .reduce((array, unit) => ([
        ...array,
        {
          key: unit.id,
          value: unit.id,
          text: unit.name,
        },
      ]), []);
    }
    return prefixList
      .filter((unit) => unit?.isCollector)
      .reduce((array, unit) => ([
        ...array,
        {
          key: unit.id,
          value: unit.id,
          text: unit.name,
        },
      ]), []);
  }, [
    isGetAll,
    isAdmin,
    isTakenUnit,
    isReceivedUnit,
    unitInfo,
    prefixList,
  ]);

  const receivedUnitOptions = useMemo(() => {
    if (isAdmin || isGetAll) {
      return prefixList
        .filter((unit) => unit?.isTester)
        .reduce((array, unit) => ([
          ...array,
          {
            key: unit.id,
            value: unit.id,
            text: unit.name,
          },
        ]), []);
    }
    if (isReceivedUnit) {
      return prefixList
        .filter((unit) => unit.id === (unitInfo?.id ?? ''))
        .map((unit) => ({
          key: unit.id,
          value: unit.id,
          text: unit.name,
        }));
    }
    if (isTakenUnit) {
      return prefixList
        .filter((unit) => unit?.isTester)
        .reduce((array, unit) => ([
          ...array,
          {
            key: unit.id,
            value: unit.id,
            text: unit.name,
          },
        ]), []);
    }
    return prefixList
      .filter((unit) => unit?.isTester)
      .reduce((array, unit) => ([
        ...array,
        {
          key: unit.id,
          value: unit.id,
          text: unit.name,
        },
      ]), []);
  }, [
    isGetAll,
    isAdmin,
    isTakenUnit,
    isReceivedUnit,
    unitInfo,
    prefixList,
  ]);

  const samplingPlaceOptions = useMemo(() => {
    const places =
      samplingPlaceList.reduce((array, place) => ([
        ...array,
        {
          key: place.id,
          value: place.name.toUpperCase(),
          text: place.name,
        },
      ]), []);
    return places.sort((a, b) => naturalCompare(a.value.toString(), b.value.toString()));
  }, [samplingPlaceList]);

  const handleChange = (searchValue) => {
    onChange({
      unitTaken,
      unitTesting,
      unitTypeId,
      hasResult,
      isGroup,
      searchValue,
      from,
      to,
      diseaseId,
      examTypeId,
      resultDate,
      importantValue: isGetAll || isTakenUnit || isReceivedUnit
        ? importantValue === 0
          ? 0
          : importantValue
        : importantValue === 0
        ? 0
        : importantValue || 0,
      feeType,
      resultType,
      samplingPlaceId,
    });
  };

  const refreshFilter = () => {
    setFrom('');
    setTo('');
    setResultDate('');
    setDiseaseId('');
    setExamTypeId('');
    setImportantValue('');
    setIsGroup(null);
    setHasResult(null);
    setUnitTaken('');
    setUnitTesting('');
    setUnitTypeId('');
    setFeeType('');
    setResultType('');
    setSamplingPlaceId('');
  };
  useEffect(() => {
    refreshFilter();
  }, [clearExaminationDetailFilter]);

  return (
    <FilterSearchBar onChange={handleChange}>
      <Wrapper>
        <div className="ui form">
          <Form.Group widths="equal">
            <Form.Select
              search
              deburr
              clearable
              label="Cơ sở lấy mẫu"
              options={takenUnitOptions}
              value={
                unitTaken || (
                  (isTakenUnit && !(isAdmin || isGetAll))
                  ? takenUnitOptions[0]?.value ?? undefined
                  : undefined
                )
              }
              onChange={(_, { value }) => setUnitTaken(value)}
            />
            <Form.Field
              search
              deburr
              label="Loại hình cơ sở lấy mẫu"
              control={Select}
              options={unitTypeOptions}
              value={unitTypeId || (
                !(isAdmin || isGetAll)
                ? unitTypeOptions[0]?.value ?? undefined
                : undefined
              )}
              onChange={(e, { value }) => setUnitTypeId(value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Field
              search
              deburr
              clearable
              width={8}
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
              search
              deburr
              clearable
              width={4}
              label="Loại mẫu"
              control={Select}
              options={sampleTypeOptions}
              onChange={(e, { value }) => {
                setIsGroup(typeof value !== 'string' ? value : null);
              }}
            />
            <Form.Field
              search
              deburr
              clearable
              width={4}
              label="Loại hình"
              control={Select}
              options={feeTypeOptions}
              onChange={(_, { value }) => {
                setFeeType(value);
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              search
              deburr
              clearable
              label="Lý do - Đối tượng"
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
            {!nonImportantValue && (
              <Form.Field
                search
                deburr
                clearable
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
            )}
            <Form.Field
              search
              deburr
              clearable
              label="Nơi lấy mẫu"
              control={Select}
              value={samplingPlaceId}
              options={samplingPlaceOptions}
              onChange={(e, { value }) => {
                setSamplingPlaceId(value);
              }}
            />
          </Form.Group>
          {!hideDateFilter && (
            <Form.Group widths="equal">
              <Form.Field
                isHavingTime
                label="Từ ngày (ngày lấy mẫu)"
                value={from}
                control={KeyboardDateTimePicker}
                disabledDays={[{ after: new Date() }]}
                onChange={setFrom}
              />
              <Form.Field
                isHavingTime
                label="Đến ngày (ngày lấy mẫu)"
                value={to}
                control={KeyboardDateTimePicker}
                disabledDays={[
                  {
                    after: new Date(),
                    before: new Date(from),
                  },
                ]}
                onChange={setTo}
              />
            </Form.Group>
          )}
          {(!(isTakenUnit || isReceivedUnit) || isProcessedSample) && (
            <Form.Group widths="equal">
              <Form.Select
                search
                deburr
                clearable
                label="Cơ sở xét nghiệm"
                options={receivedUnitOptions}
                value={
                  unitTesting || (
                    (isReceivedUnit && !(isAdmin || isGetAll))
                    ? receivedUnitOptions[0]?.value ?? undefined
                    : undefined
                  )
                }
                onChange={(_, { value }) => setUnitTesting(value)}
              />
              <Form.Field
                label="Ngày có kết quả"
                control={KeyboardDatePicker}
                disabledDays={[{ after: new Date() }]}
                onChange={setResultDate}
              />
              <Form.Field
                search
                deburr
                clearable
                label="Kết quả xét nghiệm"
                control={Select}
                options={[
                  'Dương tính',
                  'Âm tính',
                  'Âm tính (*)',
                  'Nghi ngờ',
                  'Chưa xác định',
                  'Không xác định',
                  'Mẫu không đạt',
                ].map((e) => ({
                  text: e,
                  value: e.toUpperCase(),
                }))}
                onChange={(e, { value }) => {
                  setResultType(value);
                }}
              />
            </Form.Group>
          )}
          {(isGetAll || isProcessedSample) && (
            <Form.Group>
              <Form.Field
                control={Checkbox}
                label="Có kết quả"
                indeterminate={hasResult === null}
                checked={hasResult || false}
                onClick={() => {
                  switch (hasResult) {
                    case null:
                      setHasResult(true);
                      break;
                    case true:
                      setHasResult(false);
                      break;
                    case false:
                      setHasResult(null);
                      break;
                    default:
                  }
                }}
              />
            </Form.Group>
          )}
        </div>
      </Wrapper>
    </FilterSearchBar>
  );
};

ExaminationDetailsFilter.propTypes = {
  isGetAll: PropTypes.bool,
  isTakenUnit: PropTypes.bool,
  isReceivedUnit: PropTypes.bool,
  isWaitingSample: PropTypes.bool,
  isProcessedSample: PropTypes.bool,
  isUnQualifySample: PropTypes.bool,
  nonImportantValue: PropTypes.bool,
  hideDateFilter: PropTypes.bool,
  onChange: PropTypes.func,
};

ExaminationDetailsFilter.defaultProps = {
  isGetAll: false,
  isTakenUnit: false,
  isReceivedUnit: false,
  isWaitingSample: false,
  isProcessedSample: false,
  isUnQualifySample: false,
  nonImportantValue: false,
  hideDateFilter: false,
  onChange: () => {},
};

export default ExaminationDetailsFilter;
