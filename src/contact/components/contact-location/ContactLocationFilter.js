import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Select,
  // Checkbox,
} from 'semantic-ui-react';
import styled from 'styled-components';

import { InstantSearchBar } from 'app/components/shared';
import { useSelectLocations } from 'app/hooks';

const locationTypes = [
  'Nhà riêng',
  'Chung cư',
  'Ký túc xá',
  'Nhà trọ',
  'Resort/Khu nghỉ dưỡng,Khách sạn',
  'Khách sạn',
  'Nhà nghỉ',
  'Quán ăn uống',
  'Cửa hàng thời trang',
  'Ngân hàng/quỹ tín dụng',
  'Cơ sở khám chữa bệnh',
  'Nhà thuốc',
  'Nhà hộ sinh/Nhà bảo sinh',
  'Phòng xét nghiệm',
  'Khu cách ly',
  'Nhà hàng',
  'Chợ',
  'Siêu thị',
  'Cửa hàng tiện lợi',
  'Karaoke',
  'Bar',
  'Club/Bub/Lounge',
  'Văn phòng',
  'Cơ sở sản xuất',
  'Trụ sở cơ quan nhà nước',
  'Cơ sở giáo dục',
  'Trung tâm bảo trợ xã hội',
  'Cơ sở giải trí, nghệ thuật',
  'Trung tâm thể thao',
  'Điểm du lịch',
  'Cơ sở tôn giáo',
  'Cơ sở giam giữ',
  'Dịch vụ làm đẹp',
  'Cơ sở luyện tập',
  'Cơ sở chăm sóc vật nuôi',
  'Sân bay',
  'Bến xe',
  'Nhà ga',
  'Khác',
].map((e) => ({ key: e, text: e, value: e }));

const Wrapper = styled.div`
  padding: 8px;
`;

const ContactLocationFilter = (props) => {
  const { onChange } = props;

  const [name, setName] = useState('');
  // const [isHotpost, setIsHotpost] = useState(null);

  const [selectingLocationType, setSelectingLocationType] = useState(null);

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

  useEffect(() => {
    onChange({
      name,
      locationType: selectingLocationType,
      provinceValue: province ? province.value : '',
      districtValue: district ? district.value : '',
      wardValue: ward ? ward.value : '',
      // isHotpost,
    });
  }, [
    onChange,
    name,
    selectingLocationType,
    province,
    district,
    ward,
    // isHotpost,
  ]);

  return (
    <>
      <InstantSearchBar onChange={setName}>
        <Wrapper>
          <div className="ui form">
            <Form.Group widths="equal">
              <Form.Field
                search
                deburr
                clearable
                label="Loại hình"
                control={Select}
                options={locationTypes}
                onChange={(_, { value }) => {
                  setSelectingLocationType(value);
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
                onChange={(_, { value }) => {
                  setWardValue(value);
                }}
              />
            </Form.Group>
            {/* <Form.Group>
              <Form.Field
                control={Checkbox}
                label="Điểm nóng"
                indeterminate={isHotpost === null}
                checked={isHotpost || false}
                onClick={() => {
                  switch (isHotpost) {
                    case null:
                      setIsHotpost(true);
                      break;
                    case true:
                      setIsHotpost(false);
                      break;
                    case false:
                      setIsHotpost(null);
                      break;
                    default:
                  }
                }}
              />
            </Form.Group> */}
          </div>
        </Wrapper>
      </InstantSearchBar>
    </>
  );
};

ContactLocationFilter.propTypes = {
  onChange: PropTypes.func,
};

ContactLocationFilter.defaultProps = {
  onChange: () => {},
};

export default ContactLocationFilter;
