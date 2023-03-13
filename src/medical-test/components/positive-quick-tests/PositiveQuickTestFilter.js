import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Form, Header, Input, Select, Checkbox } from 'semantic-ui-react';
import { FilterWithExportSearchBar, KeyboardDateTimePicker } from 'app/components/shared';

import { useSelector, useDispatch } from 'react-redux';
import { exportExcel } from 'app/actions/global';
import { useSelectLocations } from 'app/hooks';
import { naturalCompare } from 'app/utils/helpers';
import apiLinks from 'app/utils/api-links';
import { getUnitInfo, getPrefixes, getExaminationTypes, getSamplingPlaces } from 'medical-test/actions/medical-test';

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
  { value: 3, text: 'Ngày có kết quả do hệ thống ghi nhận' },
];

const resultOptions =
  ['Âm tính', 'Dương tính']
    .reduce((a, r) =>
      [...a, { text: r, value: r.toUpperCase() }],
      [defaultOption]);

const PositiveQuickTestFilter = (props) => {
  const { hideDateFilter, onChange } = props;

  const [dateType, setDateType] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [houseNumber, setHouseNumber] = useState('');

  const [unitIds, setUnitIds] = useState([-1]);
  const [examinationTypeIds, setExaminationTypeIds] = useState([-1]);
  const [samplingPlaceIds, setSamplingPlaceIds] = useState([-1]);
  const [results, setResults] = useState('DƯƠNG TÍNH');
  const [hasSymptom, setHasSymptom] = useState(null);

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
    unitInfo,
    prefixList,
    samplingPlaceList,
    examinationTypeList,
    getSamplingPlacesLoading,
    getExaminationTypesLoading,
    getPositiveQuickTestLoading,
  } = useSelector((state) => state.medicalTest);
  const { exportLoading } = useSelector((s) => s.global);

  const prefixOptions = useMemo(() =>
    prefixList.reduce((result, unit) => [...result, {
      key: unit.id,
      value: unit.id,
      text: unit.name.toUpperCase(),
    }], [defaultOption]),
    [prefixList]);

  const samplingPlaceOptions = useMemo(() => {
    const places = samplingPlaceList.reduce(
      (array, place) => [
        ...array,
        {
          key: place.id,
          value: place.id,
          text: place.name.toUpperCase(),
        },
      ],
      [defaultOption],
    );
    return places.sort((a, b) =>
      naturalCompare((a?.value ?? '').toString(), (b?.value ?? '').toString()),
    );
  }, [samplingPlaceList]);

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
        newValue = newValue.filter((v) => v !== -1);
      }

      switch (type) {
        case 'unitId':
          setUnitIds(newValue);
          break;
        case 'samplingPlaceId':
          setSamplingPlaceIds(newValue);
          break;
        case 'examinationTypeId':
          setExaminationTypeIds(newValue);
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
      personName: searchValue.toLowerCase(),
      phoneNumber,
      houseNumber: houseNumber.toLowerCase(),
      provinceCode: province ? province.value : '',
      districtCode: district ? district.value : '',
      wardCode: ward ? ward.value : '',
      result: results !== -1 ? results : undefined,
      unitIds: !unitIds.includes(-1) ? unitIds : undefined,
      samplingPlaceIds: !samplingPlaceIds.includes(-1) ? samplingPlaceIds : undefined,
      examinationTypeIds: !examinationTypeIds.includes(-1) ? examinationTypeIds : undefined,
      hasSymptom,
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
      name: searchValue ? searchValue.toLowerCase() : undefined,
      phone: phoneNumber || undefined,
      houseNumber: houseNumber ? houseNumber.toLowerCase() : undefined,
      province: province ? province.label : undefined,
      district: district ? district.label : undefined,
      ward: ward ? ward.label : undefined,
      results: results !== -1 ? [results] : undefined,
      unitIds: !unitIds.includes(-1) ? unitIds : undefined,
      samplingPlaces:
        !samplingPlaceIds.includes(-1)
          ? samplingPlaceList
            .filter((_) => samplingPlaceIds.find((id) => _.id === id))
            .map((_) => _.name.toUpperCase())
          : undefined,
      examinationTypes:
        !examinationTypeIds.includes(-1)
          ? examinationTypeList
            .filter((_) => examinationTypeIds.find((id) => _.id === id))
            .map((_) => _.name.toUpperCase())
          : undefined,
    };

    try {
      await dispatch(
        exportExcel({
          method: 'POST',
          url: apiLinks.excel.exportQuickTestReportStatistic,
          data,
          fileName: 'Xuất dữ liệu test nhanh chi tiết',
        }),
      );
    } catch {
      toast.warn('Không có mẫu');
    }
  };

  useEffect(() => {
    handleChange('');
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (!unitInfo?.id) {
      dispatch(getUnitInfo());
    }
    if (prefixList.length === 0) {
      dispatch(getPrefixes());
    }
    if (samplingPlaceList.length === 0) {
      dispatch(getSamplingPlaces());
    }
    if (examinationTypeList.length === 0) {
      dispatch(getExaminationTypes());
    }
    // eslint-disable-next-line
  }, [dispatch]);

  return (
    <>
      <FilterWithExportSearchBar
        filterLoading={getPositiveQuickTestLoading}
        exportLoading={exportLoading}
        placeholder="Tên hồ sơ"
        onChange={handleChange}
        exportCallback={handleExport}
      >
        <Wrapper>
          <div className="ui form">
            <StyledHeader as="h4">
              Thông tin hành chính
            </StyledHeader>
            <Form.Group widths="equal">
              <Form.Field
                type="number"
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
                onChange={(el, { value }) => {
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
                value={examinationTypeIds}
                options={examinationTypeOptions}
                onChange={(_, { value }) => handleMulipleSelect('examinationTypeId', value)}
              />
              <Form.Field
                search
                deburr
                multiple
                loading={getSamplingPlacesLoading}
                label="Nơi lấy mẫu"
                control={Select}
                value={samplingPlaceIds}
                options={samplingPlaceOptions}
                onChange={(_, { value }) => handleMulipleSelect('samplingPlaceId', value)}
              />
              <Form.Field
                search
                deburr
                label="Kết quả xét nghiệm"
                control={Select}
                value={results}
                options={resultOptions}
                onChange={(e, { value }) => setResults(value)}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                search
                deburr
                multiple
                label="Cơ sở lấy mẫu"
                control={Select}
                value={unitIds}
                options={prefixOptions}
                onChange={(_, { value }) => handleMulipleSelect('unitId', value)}
              />
              <Form.Select
                search
                deburr
                label="Thống kê theo"
                value={dateType}
                options={dateTypeOptions}
                onChange={(e, { value }) => setDateType(value)}
              />
              {!hideDateFilter && (
                <>
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
                </>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Field
                control={Checkbox}
                label="Có triệu chứng"
                indeterminate={hasSymptom === null}
                checked={hasSymptom || false}
                onClick={() => {
                  switch (hasSymptom) {
                    case null:
                      setHasSymptom(true);
                      break;
                    case true:
                      setHasSymptom(false);
                      break;
                    case false:
                      setHasSymptom(null);
                      break;
                    default:
                  }
                }}
              />
            </Form.Group>
          </div>
        </Wrapper>
      </FilterWithExportSearchBar>
    </>
  );
};

PositiveQuickTestFilter.propTypes = {
  hideDateFilter: PropTypes.bool,
  onChange: PropTypes.func,
};

PositiveQuickTestFilter.defaultProps = {
  hideDateFilter: false,
  onChange: () => { },
};

export default PositiveQuickTestFilter;
