import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { Form } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import {
  getExaminationTypes,
  setExaminationInputCache,
} from 'medical-test/actions/medical-test';

import nations from 'app/assets/mock/nations.json';
import locations from 'app/assets/mock/locations.json';

import { ImportantType } from 'infection-chain/utils/constants';
import { getImportantType } from 'infection-chain/utils/helpers';
import { deburr } from 'app/utils/helpers';

import SearchSubjectSection from 'infection-chain/components/subject/information/form-sections/SearchSubjectSection';

const reasons = [
  {
    important: ImportantType.IMPORTANT,
    value: 'NGHI NGỜ NHIỄM COVID-19',
  },
  {
    important: ImportantType.IMPORTANT,
    value: 'TẦM SOÁT NGƯỜI NGUY CƠ RẤT CAO (#F1)',
  },
  {
    important: ImportantType.IMPORTANT,
    value: 'TẦM SOÁT CHÙM CA VIÊM HÔ HẤP',
  },
  {
    important: ImportantType.WEAK,
    value: 'GIÁM SÁT TRỌNG ĐIỂM',
    loadF0: true,
  },
  {
    important: ImportantType.WEAK,
    value: 'XÉT NGHIỆM THEO DÕI TRƯỜNG HỢP KHÁC',
    loadF0: true,
  },
  {
    important: ImportantType.WEAK,
    value: 'XÉT NGHIỆM THEO DÕI F0',
  },
  {
    important: ImportantType.WEAK,
    value: 'GIÁM SÁT ĐỊNH KỲ ',
  },
  {
    important: ImportantType.WEAK,
    value: 'THEO YÊU CẦU',
  },
  {
    important: ImportantType.WEAK,
    value: 'KIỂM DỊCH NGƯỜI VỀ TỪ NƯỚC NGOÀI',
    isCountry: true,
  },
  {
    important: ImportantType.WEAK,
    value: 'KIỂM DỊCH NGƯỜI VỀ TỪ VÙNG DỊCH TRONG NƯỚC',
    isProvince: true,
  },
  {
    important: ImportantType.WEAK,
    value: 'TẦM SOÁT CỘNG ĐỒNG',
  },
];

const ExaminationReasonSection = ({ required, data }) => {
  const dispatch = useDispatch();
  const inputCache = useSelector((s) => s.medicalTest.inputCache);

  useEffect(() => {
    dispatch(getExaminationTypes());
  }, [dispatch]);

  const examinationTypeList = useSelector(
    (s) => s.medicalTest.examinationTypeList
  );
  const getExaminationTypesLoading = useSelector(
    (s) => s.medicalTest.getExaminationTypesLoading
  );

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { reasonLv1 } = watch();
  const reasonTypeCondition = reasonLv1
    ? examinationTypeList.find((r) => r.name === reasonLv1)
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
    <div className='ui form'>
      <Form.Group widths='equal'>
        <Controller
          name='reasonLv1'
          defaultValue={data?.reasonLv1 ?? inputCache?.reasonLv1 ?? ''}
          control={control}
          rules={{ required }}
          loading={getExaminationTypesLoading}
          render={({ onChange, onBlur, value, name }) => (
            <Form.Select
              fluid
              search={(options, v) =>
                options.filter((e) => deburr(e.content).includes(deburr(v)))
              }
              deburr
              clearable
              required={required}
              label='Lý do - Đối tượng'
              value={value}
              options={examinationTypeList.map((r, i) => ({
                key: r.id,
                text: r.name,
                value: r.name,
                content: `${i + 1}. ${r.name} ${
                  r.importantValue === ImportantType.IMPORTANT
                    ? '(Khẩn cấp)'
                    : '(Thường quy)'
                }`,
                label: {
                  empty: true,
                  circular: true,
                  color: getImportantType(r.importantValue).color,
                },
              }))}
              onChange={(_, { value: v }) => {
                onChange(v);
                dispatch(setExaminationInputCache({ [name]: v }));
              }}
              onBlur={onBlur}
              error={errors.reasonLv1 && 'Bắt buộc'}
            />
          )}
        />

        {/* country */}
        {reasonTypeCondition.type === 5 && (
          <Controller
            name='reasonLv3'
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
                label='Về từ quốc gia'
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

        {/* province */}
        {reasonTypeCondition.type === 6 && (
          <Controller
            name='reasonLv3'
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
                label='Về từ tỉnh/thành phố'
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

        {/* F0 */}
        {reasonTypeCondition.type === 1 && (
          <Controller
            name='reasonLv3'
            defaultValue={data?.reasonLv3 ?? ''}
            control={control}
            // rules={{ required }}
            render={({ onChange, onBlur }) => (
              <Form.Field
                type={0}
                // required={required}
                label='F0 (tìm kiếm 3 ký tự trở lên)'
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

ExaminationReasonSection.propTypes = {
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

ExaminationReasonSection.defaultProps = {
  data: null,
  required: false,
  relatedPositiveProfile: null,
};

export default ExaminationReasonSection;
