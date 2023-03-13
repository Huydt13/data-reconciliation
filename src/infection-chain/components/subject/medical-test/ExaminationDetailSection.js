/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import { toast } from 'react-toastify';

import { Form, Select, Input } from 'semantic-ui-react';

import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const testTechniques = [
  'Realtime RT PCR',
  'Test nhanh kháng thể',
  'Test nhanh kháng nguyên',
  'Test MD kháng thể',
  'Test MD kháng nguyên',
  'Test nhanh KN-KT',
  'Test MD KN-KT',
];
const fields = [
  'id',
  'diseaseSampleId',
  'diseaseSampleName',
  'unitId',
  'unitName',
  'importantValue',
  'resultDate',
  'result',
  'code',
  'testTechnique',
  'key',
  'isGroup',
];

const ExaminationDetailSection = (props) => {
  const {
    recordList,
    isDisabled,
    initialData,
    onChange,
    onImmediatelyChange,
    importantValue,
  } = props;
  const {
    availableCodesToUse,
    getAvailableCodesToUseLoading,
    // prefixList,
    getAvailableCodesLoading,
    getPrefixesLoading,
    getDiseaseSamplesLoading,
    createExaminationLoading,
    diseaseSampleList,
  } = useSelector((state) => state.medicalTest);
  const [codeList, setCodeList] = useState([]);
  useEffect(() => {
    setCodeList(
      _.uniq(availableCodesToUse || [])
        .filter((p) => !recordList.map((r) => r.code).includes(p))
        .slice(0, 20)
        .map((p) => ({
          key: p,
          text: p,
          value: p,
          content: p.length === 12 ? <b>{p}</b> : null,
        })),
    );
  }, [recordList, availableCodesToUse]);
  const loading =
    createExaminationLoading ||
    getDiseaseSamplesLoading ||
    getAvailableCodesLoading ||
    getPrefixesLoading;
  const {
    watch,
    register,
    setValue,
    getValues,
    // errors,
    // setError,
    // clearErrors,
  } = useForm({
    defaultValues: {
      ...initialData,
      importantValue,
      diseaseSampleId: initialData?.diseaseSampleId,
      diseaseSampleName: initialData?.diseaseSampleName,
    },
  });

  useEffect(() => {
    fields.forEach((name) => {
      register({ name });
    });
    if (!initialData?.id) {
      setValue('testTechnique', 'Realtime RT PCR');
      setValue('diseaseSampleId', diseaseSampleList[0]?.id);
      setValue('diseaseSampleName', diseaseSampleList[0]?.name);
      onChange(getValues());
    }
    // eslint-disable-next-line
  }, [register, setValue, importantValue]);

  const [scanTimeout, setScanTimeout] = useState(null);
  const handleScan = (__, { searchQuery: query }) => {
    const searchQuery = query.toUpperCase();
    setCodeList(
      _.uniq(availableCodesToUse || [])
        .filter((p) => !recordList.map((r) => r.code).includes(p))
        .filter((p) => p.includes(searchQuery))
        .slice(0, 20)
        .map((p) => ({
          key: p,
          text: p,
          value: p,
          content: p.length === 12 ? <b>{p}</b> : null,
        })),
    );
    if (scanTimeout) {
      clearTimeout(scanTimeout);
    }
    setScanTimeout(
      setTimeout(() => {
        if (searchQuery.length === 12 || searchQuery.length === 13) {
          if (
            availableCodesToUse
              .filter((p) => !recordList.map((r) => r.code).includes(p))
              .some((c) => c === searchQuery)
          ) {
            setValue('code', searchQuery);
            onImmediatelyChange(getValues());
          } else if (searchQuery.length === 13) {
            toast.warn('Không tìm thấy mã sẵn sàng');
            onChange(getValues());
          }
          setValue('code', '');
        }
      }, 100),
    );
  };

  return (
    <div className={`ui form ${loading ? 'loading' : ''}`}>
      <Form.Group widths="equal">
        <Form.Field
          required
          clearable
          label="Mẫu bệnh phẩm"
          control={Select}
          value={watch('diseaseSampleId') || ''}
          options={diseaseSampleList.map((d) => ({
            text: d.name,
            value: d.id,
          }))}
          onChange={(e, { value }) => {
            setValue('diseaseSampleId', value);
            setValue(
              'diseaseSampleName',
              diseaseSampleList.find((d) => d.id === value)?.name,
            );
            onChange(getValues());
          }}
        />
        <Form.Field
          required
          clearable
          label="Kỹ thuật xét nghiệm"
          control={Select}
          value={watch('testTechnique') || ''}
          options={testTechniques.map((t) => ({
            text: t,
            value: t,
          }))}
          onChange={(e, { value }) => {
            setValue('testTechnique', value);
            onChange(getValues());
          }}
        />
        {initialData?.id && watch('code') ? (
          <Form.Field
            required
            readOnly
            label="Mã xét nghiệm"
            control={Input}
            value={watch('code') || ''}
          />
        ) : (
          <Form.Field
            search
            required
            clearable
            control={Select}
            label="Mã xét nghiệm"
            disabled={isDisabled}
            options={codeList}
            value={watch('code') || ''}
            loading={getAvailableCodesToUseLoading}
            onChange={(e, { value }) => {
              setValue('code', value);
              onChange(getValues());
            }}
            onSearchChange={handleScan}
          />
        )}
      </Form.Group>
    </div>
  );
};

ExaminationDetailSection.propTypes = {
  recordList: PropTypes.arrayOf(PropTypes.shape({})),
  isDisabled: PropTypes.bool,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    diseaseSample: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  onChange: PropTypes.func,
  onImmediatelyChange: PropTypes.func,
  importantValue: PropTypes.number,
};

ExaminationDetailSection.defaultProps = {
  recordList: [],
  isDisabled: false,
  initialData: {},
  onChange: () => {},
  onImmediatelyChange: () => {},
  importantValue: 0,
};

export default ExaminationDetailSection;
