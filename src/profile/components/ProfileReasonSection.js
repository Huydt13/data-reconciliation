import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { Form } from 'semantic-ui-react';

import nations from 'app/assets/mock/nations.json';
import locations from 'app/assets/mock/locations.json';
import SearchSubjectSection from 'infection-chain/components/subject/information/form-sections/SearchSubjectSection';
import { ImportantType } from 'infection-chain/utils/constants';
import { getImportantType } from 'infection-chain/utils/helpers';
import { deburr } from 'app/utils/helpers';

const reasons = [
  {
    important: ImportantType.IMPORTANT,
    value: 'Mẫu gộp dương tính',
  },
  {
    important: ImportantType.IMPORTANT,
    value: 'Test nhanh dương tính',
  },
  {
    important: ImportantType.IMPORTANT,
    value: 'Tầm soát khi cơ sở y tế có F0',
  },
  {
    important: ImportantType.IMPORTANT,
    value: 'Tầm soát người đến khám bệnh, sử dụng dịch vụ y tế',
  },
  {
    important: ImportantType.IMPORTANT,
    value: 'Tầm soát người nguy cơ rất cao (#F1 gần)',
    loadF0: true,
  },
  {
    important: ImportantType.IMPORTANT,
    value: 'Tầm soát người nguy cơ cao (#F1 xa)',
    loadF0: true,
  },
  {
    important: ImportantType.IMPORTANT,
    value: 'Tầm soát chùm ca Viêm hô hấp',
  },

  {
    important: ImportantType.WEAK,
    value: 'Tầm soát người có nguy cơ (#F2, F khác)',
    loadF0: true,
  },
  {
    important: ImportantType.WEAK,
    value: 'Xét nghiệm theo dõi trường hợp khác',
    loadF0: true,
  },
  {
    important: ImportantType.WEAK,
    value: 'Xét nghiệm theo dõi F0 tại cơ sở y tế',
  },
  {
    important: ImportantType.WEAK,
    value: 'Xét nghiệm theo dõi F0 tại nhà',
  },
  {
    important: ImportantType.WEAK,
    value: 'Xét nghiệm theo dõi F0 sau điều trị',
  },
  {
    important: ImportantType.WEAK,
    value: 'Giám sát cộng đồng',
  },
  {
    important: ImportantType.WEAK,
    value: 'Giám sát thường quy',
  },
  {
    important: ImportantType.WEAK,
    value: 'Theo yêu cầu',
  },
  {
    important: ImportantType.WEAK,
    value: 'Kiểm dịch người về từ nước ngoài',
    isCountry: true,
  },
  {
    important: ImportantType.WEAK,
    value: 'Kiểm dịch người về từ vùng dịch trong nước',
    isProvince: true,
  },
];

const ProfileReasonSection = ({ required, data }) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { reasonLv1 } = watch();
  const reasonTypeCondition = reasonLv1
    ? reasons.find((r) => r.value === reasonLv1)
    : {};

  useEffect(() => {
    if (data?.reasonLv1) {
      setValue('reasonLv1', data.reasonLv1);
      setValue('reasonLv2', data.reasonLv2);
      const lv3Attribute = reasons.find((r) => r.value === data.reasonLv1);

      if (
        lv3Attribute?.loadF0 ||
        lv3Attribute?.isCountry ||
        lv3Attribute?.isProvince
      ) {
        setValue('reasonLv3', data.reasonLv3);
      }
    }
  }, [data, setValue]);

  return (
    <div className="ui form">
      <Form.Group widths="equal">
        <Controller
          name="reasonLv1"
          defaultValue={data?.reasonLv1 ?? ''}
          control={control}
          rules={{ required }}
          render={({ onChange, onBlur, value }) => (
            <Form.Select
              fluid
              search={(options, v) =>
                options.filter((e) => deburr(e.content).includes(deburr(v)))
              }
              deburr
              clearable
              required={required}
              label="Lý do - Đối tượng"
              value={value}
              options={reasons.map((r, i) => ({
                text: r.value.toUpperCase(),
                value: r.value.toUpperCase(),
                content: `${i + 1}. ${r.value} ${
                  r.important === ImportantType.IMPORTANT
                    ? '(Khẩn cấp)'
                    : '(Thường quy)'
                }`,
                label: {
                  empty: true,
                  circular: true,
                  color: getImportantType(r.important).color,
                },
              }))}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={onBlur}
              error={errors.reasonLv1 && 'Bắt buộc'}
            />
          )}
        />
        {reasonTypeCondition?.isCountry && (
          <Controller
            name="reasonLv3"
            defaultValue={data?.reasonLv3 ?? ''}
            control={control}
            // rules={{ required }}
            render={({ onChange, onBlur, value }) => (
              <Form.Select
                search
                deburr
                fluid
                clearable
                // required={required}
                label="Về từ quốc gia"
                value={value}
                options={nations.map((n) => ({
                  key: n.countryCode,
                  text: n.name,
                  value: n.countryCode,
                  flag: n.countryCode,
                }))}
                onChange={(_, { value: v }) => onChange(v)}
                onBlur={onBlur}
                // error={Boolean(errors.fromCountry)}
              />
            )}
          />
        )}
        {reasonTypeCondition?.isProvince && (
          <Controller
            name="reasonLv3"
            defaultValue={data?.reasonLv3 ?? ''}
            control={control}
            // rules={{ required }}
            render={({ onChange, onBlur, value }) => (
              <Form.Select
                search
                deburr
                fluid
                clearable
                // required={required}
                label="Về từ tỉnh/thành phố"
                value={value}
                options={locations.map((n) => ({
                  key: n.value,
                  text: n.label,
                  value: n.value,
                }))}
                onChange={(_, { value: v }) => onChange(v)}
                onBlur={onBlur}
                // error={Boolean(errors.fromProvince)}
              />
            )}
          />
        )}
        {reasonTypeCondition?.loadF0 && (
          <Controller
            name="reasonLv3"
            defaultValue={data?.reasonLv3 ?? ''}
            control={control}
            // rules={{ required }}
            render={({ onChange, onBlur }) => (
              <Form.Field
                type={0}
                // required={required}
                label="F0 (tìm kiếm 3 ký tự trở lên)"
                control={SearchSubjectSection}
                onChange={onChange}
                onBlur={onBlur}
                // error={Boolean(errors.relatedProfileId)}
              />
            )}
          />
        )}
      </Form.Group>
    </div>
  );
};

ProfileReasonSection.propTypes = {
  data: PropTypes.shape({
    reasonLv1: PropTypes.string,
    reasonLv2: PropTypes.string,
    reasonLv3: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  required: PropTypes.bool,
  relatedPositiveProfile: PropTypes.shape({
    id: PropTypes.string,
  }),
};

ProfileReasonSection.defaultProps = {
  data: null,
  required: false,
  relatedPositiveProfile: null,
};

export default ProfileReasonSection;
