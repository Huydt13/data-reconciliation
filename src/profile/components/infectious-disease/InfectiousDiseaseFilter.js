import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Header, Form, Input, Select, Checkbox } from 'semantic-ui-react';
import { FilterWithExportSearchBar, KeyboardDateTimePicker } from 'app/components/shared';

import { useDispatch, useSelector } from 'react-redux';
import { useSelectLocations } from 'app/hooks';
import { getSymptoms, getUnderlyingDiseases } from 'profile/actions/profile';
import { immunizationStatusOptions } from 'profile/utils/helpers';
import { exportExcel } from 'app/actions/global';
import apiLinks from 'app/utils/api-links';
import { toast } from 'react-toastify';

const Wrapper = styled.div`
  padding: 8px;
`;

const StyledHeader = styled(Header)`
  margin-bottom: 0.5em !important;
`;

const InfectiousDiseaseFilter = ({ hasDateFilter, onChange }) => {
  const [fromAge, setFromAge] = useState('');
  const [toAge, setToAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cccd, setCccd] = useState('');
  const [cmnd, setCmnd] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [healthInsurranceNumber, setHealthInsurranceNumber] = useState('');
  const [immunizationStatus, setImmunizationStatus] = useState(undefined);

  const [disease, setDisease] = useState(undefined);
  const [numberOfPositiveTimes, setNumberOfPositiveTimes] = useState(undefined);
  const [hasSymptoms, setHasSymptoms] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [hasUnderlyingDiseases, setHasUnderlyingDiseases] = useState(null);
  const [underlyingDiseases, setUnderlyingDiseases] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

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

  const dispatch = useDispatch();
  const {
    symptomData: { data: symptomList },
    underlyingDiseaseData: { data: underlyingDiseaseList },
    getSymptomsLoading,
    getUnderlyingDiseasesLoading,
  } = useSelector((state) => state.profile);
  const { exportLoading } = useSelector((state) => state.global);

  const handleChange = (name) => {
    onChange({
      FromAge: fromAge,
      ToAge: toAge,
      PhoneNumber: phoneNumber,
      Name: name,
      Cccd: cccd,
      Cmnd: cmnd,
      PassportNumber: passportNumber,
      HealthInsurranceNumber: healthInsurranceNumber,
      NumberOfPositiveTimes: numberOfPositiveTimes,
      ImmunizationStatus: immunizationStatus,
      Disease: disease,
      FromDate: fromDate,
      ToDate: toDate,
      ProvinceValue: province?.value,
      DistrictValue: district?.value,
      WardValue: ward?.value,
      UnderlyingDiseases: underlyingDiseases,
      Symtoms: symptoms,
      HasSymtoms: hasSymptoms,
      HasUnderlyingDiseases: hasUnderlyingDiseases,
    });
  };
  const handleExport = async (searchValue) => {
    const params = {
      IsPositive: hasDateFilter ? true : undefined,
      FromAge: fromAge || undefined,
      ToAge: toAge || undefined,
      PhoneNumber: phoneNumber || undefined,
      Name: searchValue ? searchValue.toUpperCase() : undefined,
      Cccd: cccd || undefined,
      Cmnd: cmnd || undefined,
      PassportNumber: passportNumber || undefined,
      HealthInsurranceNumber: healthInsurranceNumber || undefined,
      NumberOfPositiveTimes: numberOfPositiveTimes || undefined,
      ImmunizationStatus: immunizationStatus || undefined,
      Disease: disease || undefined,
      FromDate: fromDate,
      ToDate: toDate,
      ProvinceValue: province?.value,
      DistrictValue: district?.value,
      WardValue: ward?.value,
      UnderlyingDiseases: underlyingDiseases,
      Symtoms: symptoms,
      HasSymtoms: hasSymptoms,
      HasUnderlyingDiseases: hasUnderlyingDiseases,
    };
    try {
      await dispatch(
        exportExcel({
          method: 'GET',
          url: apiLinks.excel.exportInfectiousDisease,
          params,
          fileName: `Xuất dữ liệu ${hasDateFilter ? 'F0 mới' : 'F0'}`,
        }),
      );
    } catch {
      toast.warn('Không có dữ liệu');
    }
  };
  useEffect(() => {
    if (!symptomList || symptomList.length === 0) {
      dispatch(getSymptoms({}));
    }
    if (!underlyingDiseases || underlyingDiseases.length === 0) {
      dispatch(getUnderlyingDiseases({}));
    }
    // eslint-disable-next-line
  }, [dispatch]);

  return (
    <>
      <FilterWithExportSearchBar
        filterLoading={getUnderlyingDiseasesLoading && getSymptomsLoading}
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
              <Form.Field
                type="number"
                label="Từ tuổi"
                control={Input}
                onChange={(_, { value }) => {
                  setFromAge(value);
                }}
              />
              <Form.Field
                type="number"
                label="Đến tuổi"
                control={Input}
                onChange={(_, { value }) => {
                  setToAge(value);
                }}
              />
            </Form.Group>
          </div>
          <div className="ui form">
            <Form.Group widths="equal">
              <Form.Field
                type="number"
                label="Căn cước công dân"
                control={Input}
                onChange={(_, { value }) => {
                  setCccd(value);
                }}
              />
              <Form.Field
                type="number"
                label="Chứng minh nhân dân"
                control={Input}
                onChange={(_, { value }) => {
                  setCmnd(value);
                }}
              />
              <Form.Field
                label="Hộ chiếu"
                control={Input}
                onChange={(_, { value }) => {
                  setPassportNumber(value);
                }}
              />
              <Form.Field
                label="Số bảo hiểm"
                control={Input}
                onChange={(_, { value }) => {
                  setHealthInsurranceNumber(value);
                }}
              />
            </Form.Group>
          </div>
          <div className="ui form">
            <Form.Group widths="equal">
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
                onChange={(_, { value }) => {
                  setWardValue(value);
                }}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                search
                deburr
                clearable
                label="Trạng thái tiêm vắc xin"
                control={Select}
                options={immunizationStatusOptions}
                onChange={(_, { value }) => {
                  setImmunizationStatus(value);
                }}
              />
            </Form.Group>
          </div>
          <div className="ui form">
            <StyledHeader as="h4">
              Thông tin xét nghiệm
            </StyledHeader>
            <Form.Group widths="equal">
              <Form.Field
                label="Bệnh"
                control={Input}
                onChange={(_, { value }) => {
                  setDisease(value);
                }}
              />
              <Form.Field
                type="number"
                label="Số lần bị nhiễm"
                control={Input}
                onChange={(_, { value }) => {
                  setNumberOfPositiveTimes(value);
                }}
              />
              {hasSymptoms ? (
                <Form.Field
                  clearable
                  multiple
                  control={Select}
                  label="Triệu chứng"
                  loading={getSymptomsLoading}
                  value={symptoms || []}
                  options={(symptomList || []).map((s) => ({
                    value: s.name,
                    text: s.name,
                  }))}
                  onChange={(_, { value }) => {
                    setSymptoms(value);
                  }}
                />
              ) : null}
              {hasUnderlyingDiseases ? (
                <Form.Field
                  clearable
                  multiple
                  control={Select}
                  label="Bệnh nền"
                  loading={getUnderlyingDiseasesLoading}
                  value={underlyingDiseases || []}
                  options={(underlyingDiseaseList || []).map((s) => ({
                    value: s.name,
                    text: s.name,
                  }))}
                  onChange={(_, { value }) => {
                    setUnderlyingDiseases(value);
                  }}
                />
              ) : null}
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                label="Từ ngày"
                value={fromDate}
                control={KeyboardDateTimePicker}
                disabledDays={[{ after: new Date() }]}
                onChange={(value) => {
                  setFromDate(value);
                }}
              />
              <Form.Field
                label="Đến ngày"
                value={toDate}
                control={KeyboardDateTimePicker}
                disabledDays={[
                  {
                    after: new Date(),
                    before: new Date(fromDate),
                  },
                ]}
                onChange={(value) => {
                  setToDate(value);
                }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Field
                control={Checkbox}
                label="Có triệu chứng"
                indeterminate={hasSymptoms === null}
                checked={hasSymptoms || false}
                onClick={() => {
                  switch (hasSymptoms) {
                    case null:
                      setHasSymptoms(true);
                      break;
                    case true:
                      setHasSymptoms(false);
                      break;
                    case false:
                      setHasSymptoms(null);
                      break;
                    default:
                  }
                }}
              />
              <Form.Field
                control={Checkbox}
                label="Có bệnh nền"
                indeterminate={hasUnderlyingDiseases === null}
                checked={hasUnderlyingDiseases || false}
                onClick={() => {
                  switch (hasUnderlyingDiseases) {
                    case null:
                      setHasUnderlyingDiseases(true);
                      break;
                    case true:
                      setHasUnderlyingDiseases(false);
                      break;
                    case false:
                      setHasUnderlyingDiseases(null);
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

InfectiousDiseaseFilter.propTypes = {
  hasDateFilter: PropTypes.bool,
  onChange: PropTypes.func,
};

InfectiousDiseaseFilter.defaultProps = {
  hasDateFilter: false,
  onChange: () => { },
};

export default InfectiousDiseaseFilter;
