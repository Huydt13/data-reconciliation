import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Form, Header, Input, Select, Checkbox } from 'semantic-ui-react';
import { FilterSearchBar, KeyboardDateTimePicker } from 'app/components/shared';

import { useSelector, useDispatch } from 'react-redux';
import { useAuth, useSelectLocations } from 'app/hooks';
import { getExaminationTypes, getSamplingPlaces } from 'medical-test/actions/medical-test';
import { naturalCompare } from 'app/utils/helpers';

const Wrapper = styled.div`
  padding: 8px;
`;
const StyledHeader = styled(Header)`
  margin-bottom: 0.5em !important;
`;

const QuickTestFilter = (props) => {
  const { hideDateFilter, onChange } = props;

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [houseNumber, setHouseNumber] = useState('');

  const [unitId, setUnitId] = useState(undefined);
  const [examinationTypeId, setExaminationTypeId] = useState(undefined);
  const [samplingPlaceId, setSamplingPlaceId] = useState(undefined);
  const [resultType, setResultType] = useState(undefined);

  const [hasSymptom, setHasSymptom] = useState(null);

  const { isAdmin } = useAuth();
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
    samplingPlaceList,
    examinationTypeList,
    getSamplingPlacesLoading,
    getExaminationTypesLoading,
  } = useSelector((state) => state.medicalTest);

  const examinationTypeOptions = useMemo(() =>
    examinationTypeList.reduce((array, place) => ([
      ...array,
      {
        key: place.id,
        value: place.id,
        text: place.name,
      },
    ]), []),
    [examinationTypeList]);

  const samplingPlaceOptions = useMemo(() => {
    const places =
      samplingPlaceList.reduce((array, place) => ([
        ...array,
        {
          key: place.id,
          value: place.id,
          text: place.name,
        },
      ]), []);
    return places.sort((a, b) => naturalCompare(a.value.toString(), b.value.toString()));
  }, [samplingPlaceList]);

  const handleChange = (searchValue) => {
    onChange({
      from,
      to,
      personName: searchValue.toLowerCase(),
      phoneNumber,
      houseNumber: houseNumber.toLowerCase(),
      provinceCode: province ? province.value : '',
      districtCode: district ? district.value : '',
      wardCode: ward ? ward.value : '',
      unitId,
      samplingPlaceId,
      examinationTypeId,
      resultType,
      hasSymptom,
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
                ].map((e) => ({
                  text: e,
                  value: e.toUpperCase(),
                }))}
                onChange={(e, { value }) => {
                  setResultType(value);
                }}
              />
            </Form.Group>
            <Form.Group widths="equal">
              {isAdmin && (
                <Form.Field
                  search
                  deburr
                  clearable
                  label="Cơ sở lấy mẫu"
                  control={Select}
                  value={unitId}
                  options={prefixList.map((d) => ({
                    value: d.id,
                    text: d.name,
                  }))}
                  onChange={(_, { value }) => setUnitId(value)}
                />
              )}
              {!hideDateFilter && (
                <>
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
      </FilterSearchBar>
    </>
  );
};

QuickTestFilter.propTypes = {
  hideDateFilter: PropTypes.bool,
  onChange: PropTypes.func,
};

QuickTestFilter.defaultProps = {
  hideDateFilter: false,
  onChange: () => { },
};

export default QuickTestFilter;
