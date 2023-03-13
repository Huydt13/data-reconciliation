import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Form, Header, Input, Select } from 'semantic-ui-react';
import { FilterSearchBar, KeyboardDateTimePicker } from 'app/components/shared';

import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from 'app/hooks';
import { getExaminationTypes, getSamplingPlaces } from 'medical-test/actions/medical-test';
import { naturalCompare } from 'app/utils/helpers';
import LocationSelect from '../infected-patient/LocationSelect';

const Wrapper = styled.div`
  padding: 8px;
`;
const StyledHeader = styled(Header)`
  margin-bottom: 0.5em !important;
`;

const dateTypeOptions = [
  { value: 1, text: 'Ngày xét nghiệm' },
  { value: 3, text: 'Ngày hệ thống ghi nhận' },
  { value: 4, text: 'Ngày xác minh' },
];
const dataSourceOptions = [
  { value: 1, text: 'F0 từ cơ sở y tế (CDS)' },
  { value: 2, text: 'F0 tự khai báo (Nền tảng số)' },
  { value: 3, text: 'Từ cả 2 nguồn' },
  { value: 4, text: 'Tất cả' },
];
const chainTypeOptions = [
  { value: 0, text: 'Xác định' },
  { value: 1, text: 'Nghi ngờ' },
];
const TotalInfectedPatientFilter = (props) => {
  const { hideDateFilter, onChange } = props;

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [quarantineName] = useState('');
  const [dateType, setDateType] = useState(undefined);
  const [dataSource, setDataSource] = useState(undefined);
  const [chainType, setChainType] = useState(undefined);
  const [personalLocation, setPersonalLocation] = useState(undefined);

  const [unitId, setUnitId] = useState(undefined);
  const [examinationTypeId, setExaminationTypeId] = useState(undefined);
  const [samplingPlaceId, setSamplingPlaceId] = useState(undefined);
  const [resultType] = useState(undefined);

  const { isAdmin } = useAuth();
  const dispatch = useDispatch();
  const {
    prefixList,
    samplingPlaceList,
    examinationTypeList,
    getSamplingPlacesLoading,
    getExaminationTypesLoading,
  } = useSelector((state) => state.medicalTest);

  const examinationTypeOptions = useMemo(() => examinationTypeList.reduce((array, place) => ([
      ...array,
      {
        key: place.id,
        value: place.name,
        text: place.name,
      },
    ]), []),
    [examinationTypeList]);

  const samplingPlaceOptions = useMemo(() => {
    const places = samplingPlaceList.reduce((array, place) => ([
        ...array,
        {
          key: place.id,
          value: /(\d+.\s+)(.*)/i.exec(place.name.toLowerCase().trim())[2],
          text: place.name,
        },
      ]), []);
    return places.sort((a, b) => naturalCompare(a.value.toString(), b.value.toString()));
  }, [samplingPlaceList]);


  const handleChange = (searchValue) => {
    onChange({
      FromDate: from,
      ToDate: to,
      FullName: searchValue.toUpperCase(),
      PhoneNumber: phoneNumber,
      StreetHouseNumber: personalLocation?.streetHouseNumber ?? '',
      ProvinceValue: personalLocation?.provinceValue ?? '',
      DistrictValue: personalLocation?.districtValue ?? '',
      WardValue: personalLocation?.wardValue ?? '',
      NameDCCL: quarantineName,
      Unit: unitId,
      SamplingPlace: samplingPlaceId,
      ExaminationType: examinationTypeId,
      Result: resultType,
      DateType: dateType,
      DataSource: dataSource === 3 || dataSource === 4 ? undefined : dataSource,
      HasDuplicateId: dataSource === 3,
      ChainType: chainType,
      RemoveCDSDuplicateData: dataSource === 3 ? true : null,
    });
  };

  useEffect(() => {
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
      <FilterSearchBar placeholder="Tên hồ sơ" onChange={handleChange}>
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
            <LocationSelect onChange={setPersonalLocation} />
          </div>
          <div className="ui form">
            <StyledHeader as="h4">Thông tin xét nghiệm</StyledHeader>
            <Form.Group widths="equal">
              <Form.Field
                search
                deburr
                clearable
                loading={getExaminationTypesLoading}
                label="Lý do - đối tượng"
                control={Select}
                value={examinationTypeId}
                options={examinationTypeOptions}
                onChange={(_, { value }) => setExaminationTypeId(value)}
              />
              <Form.Field
                search
                deburr
                clearable
                loading={getSamplingPlacesLoading}
                label="Nơi lấy mẫu"
                control={Select}
                value={samplingPlaceId}
                options={samplingPlaceOptions}
                onChange={(_, { value }) => setSamplingPlaceId(value)}
              />
              <Form.Select
                search
                deburr
                label="Loại ca bệnh"
                value={chainType}
                options={chainTypeOptions}
                onChange={(e, { value }) => setChainType(value)}
              />
              {/* <Form.Field
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
                ].map((e) => ({
                  text: e,
                  value: e.toUpperCase(),
                }))}
                onChange={(e, { value }) => {
                  setResultType(value);
                }}
              /> */}
            </Form.Group>
            {isAdmin && (
              <Form.Group widths="equal">
                <Form.Field
                  search
                  deburr
                  clearable
                  label="Đơn vị xác minh"
                  control={Select}
                  value={unitId}
                  options={prefixList.map((d) => ({
                    value: d.name,
                    text: d.name,
                  }))}
                  onChange={(_, { value }) => setUnitId(value)}
                />
                <Form.Select
                  search
                  deburr
                  label="Thống kê theo"
                  value={dateType}
                  defaultValue={4}
                  options={dateTypeOptions}
                  onChange={(e, { value }) => setDateType(value)}
                />
                <Form.Select
                  search
                  deburr
                  label="Nguồn dữ liệu theo"
                  value={dataSource}
                  options={dataSourceOptions}
                  onChange={(e, { value }) => setDataSource(value)}
                />
              </Form.Group>

            )}
            {!hideDateFilter && (
              <Form.Group widths="equal">
                <Form.Field
                  isHavingTime
                  label="Từ ngày (ngày lấy mẫu)"
                  value={from}
                  control={KeyboardDateTimePicker}
                  disabledDays={[{ before: new Date('2022-04-01'), after: new Date() }]}
                  onChange={setFrom}
                />
                <Form.Field
                  isHavingTime
                  label="Đến ngày (ngày lấy mẫu)"
                  value={to}
                  control={KeyboardDateTimePicker}
                  disabledDays={[{ before: new Date(from), after: new Date() }]}
                  onChange={setTo}
                />
              </Form.Group>
            )}
          </div>
        </Wrapper>
      </FilterSearchBar>
    </>
  );
};

TotalInfectedPatientFilter.propTypes = {
  hideDateFilter: PropTypes.bool,
  onChange: PropTypes.func,
};

TotalInfectedPatientFilter.defaultProps = {
  hideDateFilter: false,
  onChange: () => { },
};

export default TotalInfectedPatientFilter;
