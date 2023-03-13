/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import moment from 'moment';

import { Form, Input, Select, Header } from 'semantic-ui-react';
import { FilterWithExportSearchBar, KeyboardDateTimePicker } from 'app/components/shared';

import { useSelector, useDispatch } from 'react-redux';
import { exportExcel } from 'app/actions/global';
import { useSelectLocations } from 'app/hooks';
import apiLinks from 'app/utils/api-links';
import { getPrefixes, getExaminationTypes } from 'medical-test/actions/medical-test';

const Wrapper = styled.div`
  padding: 8px;
`;
const StyledHeader = styled(Header)`
  margin-bottom: 0.5em !important;
`;

const defaultOption = {
  key: -1,
  value: -1,
  text: 'Tất cả',
};

const dateTypeOptions = [
  { value: 0, text: 'Ngày lấy mẫu' },
  { value: 2, text: 'Ngày có kết quả' },
  { value: 3, text: 'Ngày có kết quả do hệ thống ghi nhận' },
];

const resultOptions =
  ['Chưa có kết quả', 'Âm tính', 'Dương tính']
  .reduce((a, r) =>
    [...a, { text: r, value: r.toUpperCase() }],
  [defaultOption]);

const PositiveExamFilter = (props) => {
  const { hideDateFilter, onChange } = props;

  const [dateType, setDateType] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [personName, setPersonName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [houseNumber, setHouseNumber] = useState('');

  const [unitTakenIds, setUnitTakenIds] = useState([-1]);
  const [unitTestingIds, setUnitTestingIds] = useState([-1]);
  const [examTypeIds, setExamTypeIds] = useState([-1]);
  const [results, setResults] = useState('DƯƠNG TÍNH');

  const [dateError, setDateError] = useState(false);

  const dispatch = useDispatch();
  const {
    province,
    district,
    ward,
    provinceList,
    districtList,
    wardList,
    setProvinceValue,
    setDistrictValue,
    setWardValue,
  } = useSelectLocations({});
  const {
    prefixList,
    examinationTypeList,
    getPrefixesLoading,
    getExaminationTypesLoading,
    getPositiveExaminationDetailLoading,
  } = useSelector((state) => state.medicalTest);
  const { exportLoading } = useSelector((s) => s.global);

  const unitTakenOptión = useMemo(() =>
    prefixList
      .filter((_) => _.isCollector)
      .reduce((result, unit) => [...result, {
          key: unit.id,
          value: unit.id,
          text: unit.name.toUpperCase(),
        }], [defaultOption]),
  [prefixList]);

  const unitTestingOptions = useMemo(() =>
    prefixList
      .filter((_) => _.isTester)
      .reduce((result, unit) => [...result, {
          key: unit.id,
          value: unit.id,
          text: unit.name.toUpperCase(),
        }], [defaultOption]),
  [prefixList]);

  const examinationTypeOptions = useMemo(() =>
    examinationTypeList.reduce((result, type) => [...result, {
        key: type.id,
        value: type.id,
        text: type.name.toUpperCase(),
      }], [defaultOption]),
  [examinationTypeList]);

  const handleMulipleSelect = (type = '', value) => {
    if (type !== '') {
      let newValue = value || [];
      const lastValue = newValue.slice().pop();
      if (newValue.length === 0) {
        newValue = [-1];
      }
      if (newValue.length > 1 && lastValue === -1) {
        newValue = [lastValue];
      }
      if (newValue.length > 1 && newValue.includes(-1)) {
        newValue = newValue.filter((v) => v !== -1 && v !== -2);
      }

      switch (type) {
        case 'unitTakenIds':
          setUnitTakenIds(newValue);
          break;
        case 'unitTestingIds':
          setUnitTestingIds(newValue);
          break;
        case 'examTypeIds':
          setExamTypeIds(newValue);
          break;
        default:
          break;
      }
    }
  };

  const handleChange = (searchValue) => {
    onChange({
      dateType,
      from,
      to,
      code: searchValue ? searchValue.toLowerCase() : undefined,
      personName: personName ? personName.toLowerCase() : undefined,
      phoneNumber: phoneNumber || undefined,
      houseNumber: houseNumber ? houseNumber.toLowerCase() : undefined,
      provinceCode: province ? province.value : undefined,
      districtCode: district ? district.value : undefined,
      wardCode: ward ? ward.value : undefined,
      result: results !== -1 && results !== 'CHƯA CÓ KẾT QUẢ' ? results : undefined,
      hasNoResult: !!(results && results === 'CHƯA CÓ KẾT QUẢ'),
      unitTakens: !unitTakenIds.includes(-1) ? unitTakenIds : undefined,
      unitTestings: !unitTestingIds.includes(-1) ? unitTestingIds : undefined,
      examTypeIds: !examTypeIds.includes(-1) ? examTypeIds : undefined,
    });
  };

  const handleExport = async (searchValue) => {
    if ((!from || !to) && !hideDateFilter) {
      setDateError(true);
      return;
    }

    const data = {
      dateType,
      fromDate: !hideDateFilter ? from : moment().format('YYYY-MM-DDT00:00:00+07:00'),
      toDate: !hideDateFilter ? to : moment().format('YYYY-MM-DDT23:59:59+07:00'),
      code: searchValue ? searchValue.toLowerCase() : undefined,
      name: personName ? personName.toLowerCase() : undefined,
      phone: phoneNumber || undefined,
      houseNumber: houseNumber ? houseNumber.toLowerCase() : undefined,
      province: province ? province.label : undefined,
      district: district ? district.label : undefined,
      ward: ward ? ward.label : undefined,
      results: results !== -1 && results !== 'CHƯA CÓ KẾT QUẢ' ? [results] : undefined,
      hasNoResult: !!(results && results === 'CHƯA CÓ KẾT QUẢ'),
      takenUnitIds: !unitTakenIds.includes(-1) ? unitTakenIds : undefined,
      executedUnitIds: !unitTestingIds.includes(-1) ? unitTestingIds : undefined,
      examinationTypes:
        !examTypeIds.includes(-1)
        ? examinationTypeList
            .filter((_) => examTypeIds.find((id) => _.id === id))
            .map((_) => _.name.toUpperCase())
        : undefined,
    };

    try {
      await dispatch(
        exportExcel({
          method: 'POST',
          url: apiLinks.excel.exportStatisticExamination,
          data,
          fileName: 'Xuất dữ liệu xét nghiệm PCR chi tiết',
        }),
      );
    } catch {
      toast.warn('Không có mẫu');
    }
  };

  useEffect(() => {
    if (prefixList.length === 0) {
      dispatch(getPrefixes());
    }
    if (examinationTypeList.length === 0) {
      dispatch(getExaminationTypes());
    }
    // eslint-disable-next-line
  }, [dispatch]);

  return (
    <FilterWithExportSearchBar
      filterLoading={getPositiveExaminationDetailLoading}
      exportLoading={exportLoading}
      placeholder="Mã xét nghiệm"
      onChange={handleChange}
      exportCallback={handleExport}
    >
      <Wrapper>
        <div className="ui form">
          <div className="ui form">
            <StyledHeader as="h4">
              Thông tin hành chính
            </StyledHeader>
            <Form.Group widths="equal">
              <Form.Field
                label="Tên"
                control={Input}
                onChange={(_, { value }) => {
                  setPersonName(value);
                }}
              />
              <Form.Field
                label="Số điện thoại"
                control={Input}
                onChange={(_, { value }) => {
                  setPhoneNumber(value);
                }}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                label="Số nhà"
                control={Input}
                onChange={(_blank, { value }) => {
                  setHouseNumber(value);
                }}
              />
              <Form.Field
                search
                deburr
                clearable
                label="Tỉnh/Thành"
                control={Select}
                options={provinceList.map((p) => ({
                  value: p.value,
                  text: p.label,
                }))}
                onChange={(_, { value }) => {
                  setProvinceValue(value);
                }}
              />
              <Form.Field
                search
                deburr
                clearable
                label="Quận/Huyện"
                control={Select}
                options={districtList.map((d) => ({
                  value: d.value,
                  text: d.label,
                }))}
                onChange={(_, { value }) => {
                  setDistrictValue(value);
                }}
              />
              <Form.Field
                search
                deburr
                clearable
                label="Phường/Xã"
                control={Select}
                options={wardList.map((w) => ({
                  value: w.value,
                  text: w.label,
                }))}
                onChange={(__, { value }) => {
                  setWardValue(value);
                }}
              />
            </Form.Group>
          </div>
          <div className="ui form">
            <StyledHeader as="h4">Thông tin xét nghiệm</StyledHeader>
            <Form.Group widths="equal">
              <Form.Field
                search
                deburr
                multiple
                loading={getExaminationTypesLoading}
                label="Lý do - đối tượng"
                control={Select}
                value={examTypeIds}
                options={examinationTypeOptions}
                onChange={(__, { value }) => handleMulipleSelect('examTypeIds', value)}
              />
              <Form.Field
                search
                deburr
                multiple
                loading={getPrefixesLoading}
                label="Cơ sở lấy mẫu"
                control={Select}
                value={unitTakenIds}
                options={unitTakenOptión}
                onChange={(__, { value }) => handleMulipleSelect('unitTakenIds', value)}
              />
              <Form.Field
                search
                deburr
                multiple
                loading={getPrefixesLoading}
                label="Cơ sở xét nghiệm"
                control={Select}
                value={unitTestingIds}
                options={unitTestingOptions}
                onChange={(__, { value }) => handleMulipleSelect('unitTestingIds', value)}
              />
              <Form.Field
                search
                deburr
                label="Kết quả xét nghiệm"
                control={Select}
                value={results || ''}
                options={resultOptions}
                onChange={(e, { value }) => setResults(value)}
              />
            </Form.Group>
            {!hideDateFilter && (
              <Form.Group widths="equal">
                <Form.Select
                  search
                  deburr
                  label="Thống kê theo"
                  value={dateType}
                  options={dateTypeOptions}
                  onChange={(e, { value }) => setDateType(value)}
                />
                <Form.Field
                  isHavingTime
                  required={dateError}
                  label="Từ ngày"
                  error={dateError && 'Bắt buộc phải nhập thời gian'}
                  value={from}
                  control={KeyboardDateTimePicker}
                  disabledDays={[{ after: new Date() }]}
                  onChange={(value) => {
                      setFrom(value);
                      if (value) {
                        setDateError(false);
                      }
                    }}
                />
                <Form.Field
                  isHavingTime
                  required={dateError}
                  error={dateError && 'Bắt buộc phải nhập thời gian'}
                  label="Đến ngày"
                  value={to}
                  control={KeyboardDateTimePicker}
                  disabledDays={[
                      {
                        after: new Date(),
                        before: new Date(from),
                      },
                    ]}
                  onChange={(value) => {
                      setTo(value);
                      if (value) {
                        setDateError(false);
                      }
                    }}
                />
              </Form.Group>
            )}
          </div>
        </div>
      </Wrapper>
    </FilterWithExportSearchBar>
  );
};

PositiveExamFilter.propTypes = {
  hideDateFilter: PropTypes.bool,
  onChange: PropTypes.func,
};

PositiveExamFilter.defaultProps = {
  hideDateFilter: false,
  onChange: () => {},
};

export default PositiveExamFilter;
