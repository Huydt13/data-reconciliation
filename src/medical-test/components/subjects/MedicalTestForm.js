
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Select,
  Button,
  Header,
  Checkbox,
} from 'semantic-ui-react';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';

import { KeyboardDatePicker } from 'app/components/shared';
import AddressDetails from 'infection-chain/components/subject/information/form-sections/AddressDetails';
import { useSelector, useDispatch } from 'react-redux';
import { getPrintedCode, getAllZones } from 'medical-test/actions/medical-test';

const positiveTypes = [
  { key: 0, value: 0, text: 'Dương tính với COVID' },
  { key: 1, value: 1, text: 'Dương tính với bệnh Sởi' },
];

const statusOptions = [
  {
    key: 0,
    value: false,
    text: 'Âm tính',
  },
  {
    key: 1,
    value: true,
    text: 'Dương tính',
  },
  {
    key: 2,
    value: 0,
    text: 'Chưa xác định',
  },
];

const statuses = ['Âm tính', 'Dương tính', 'Chưa xác định'];

const examines = [
  { key: 'dichHauHong', text: 'Bệnh phẩm đường hô hấp - Dịch hầu họng', result: 'dichHauHong_Result' },
  { key: 'dichSucHong', text: 'Bệnh phẩm đường hô hấp - Dịch súc họng', result: 'dichSucHong_Result' },
  { key: 'dom', text: 'Bệnh phẩm đường hô hấp - Đờm', result: 'dom_Result' },
  { key: 'dichPheQuanPheNan', text: 'Bệnh phẩm đường hô hấp - Dịch phế quản, phế nang ', result: 'dichPheQuanPheNan_Result' },
  { key: 'mau_GiaiDoanCap', text: 'Máu toàn phần - Giai đoạn cấp', result: 'mau_GiaiDoanCap_Result' },
  { key: 'mau_GiaiDoanHoiPhuc', text: 'Máu toàn phần - Giai đoạn hồi phục', result: 'mau_GiaiDoanHoiPhuc_Result' },
  { key: 'mauPhan', text: 'Mẫu phân', result: 'mauPhan_Result' },
];

const StyledForm = styled(Form)`
  padding: 20px;
`;

const MedicalTestForm = (props) => {
  const {
    initialData,
    onSubmit,
    subjectCode,
    diseaseLocation,
  } = props;
  const dispatch = useDispatch();

  const {
    watch,
    errors,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    trigger,
  } = useForm({ defaultValues: initialData || {} });

  const isPositive = watch('isPositive');
  const isFinalResult = watch('isFinalResult');
  const takenDate = watch('takenDate') || '';

  useEffect(() => {
    register({ name: 'id' });
    register({ name: 'code', required: true }); // cdc
    register({ name: 'alias' }); // byt
    register({ name: 'privateAlias' }); // hcm
    register({ name: 'takenBy' });
    register({ name: 'takenDate' });
    register({ name: 'takenFrom' });
    register({ name: 'resultFrom' });
    register({ name: 'retriveResultDate' });
    register({ name: 'isPositive' });
    register({ name: 'diseaseLocation' });
    register({ name: 'positiveType' });
    register({ name: 'isFinalResult' });
    register({ name: 'dichHauHong' });
    register({ name: 'dichHauHong_Result' });
    register({ name: 'dichHauHong_Result_RetrieveDate' });
    register({ name: 'dichSucHong' });
    register({ name: 'dichSucHong_Result' });
    register({ name: 'dichSucHong_Result_RetrieveDate' });
    register({ name: 'dom' });
    register({ name: 'dom_Result' });
    register({ name: 'dom_Result_RetrieveDate' });
    register({ name: 'dichPheQuanPheNan' });
    register({ name: 'dichPheQuanPheNan_Result' });
    register({ name: 'dichPheQuanPheNan_Result_RetrieveDate' });
    register({ name: 'mau_GiaiDoanCap' });
    register({ name: 'mau_GiaiDoanCap_Result' });
    register({ name: 'mau_GiaiDoanCap_Result_RetrieveDate' });
    register({ name: 'mau_GiaiDoanHoiPhuc' });
    register({ name: 'mau_GiaiDoanHoiPhuc_Result' });
    register({ name: 'mau_GiaiDoanHoiPhuc_Result_RetrieveDate' });
    register({ name: 'mauPhan' });
    register({ name: 'mauPhan_Result' });
    register({ name: 'mauPhan_Result_RetrieveDate' });
    register({ name: 'other' });
    register({ name: 'other_Result' });
    register({ name: 'other_Result_RetrieveDate' });
    register({ name: 'examinationCode' });
    if (initialData && Object.keys(initialData).length !== 0) {
      if (watch('isPositive') === null) {
        setValue('isPositive', 0);
      }
    }
    // eslint-disable-next-line
  }, [register, setValue, initialData]);

  const [selectingZone, setSelectingZone] = useState(null);
  useEffect(() => {
    if (selectingZone?.id) {
      dispatch(getPrintedCode(selectingZone.prefix));
    }
  }, [dispatch, selectingZone]);
  useEffect(() => {
    dispatch(getAllZones());
  }, [dispatch]);

  const {
    zoneList,
    printedCodeList,
    getZoneListLoading,
    getPrintedCodeLoading,
  } = useSelector((state) => state.medicalTest);

  const { getSubjectLoading } = useSelector((state) => state.subject);

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} loading={getSubjectLoading || getZoneListLoading || getPrintedCodeLoading}>
      <Form.Group widths="equal">
        <Form.Field
          required
          label="Ngày lấy mẫu"
          control={KeyboardDatePicker}
          value={takenDate}
          disabledDays={[{ after: new Date() }]}
          onChange={(date) => {
            clearErrors('takenDate');
            setValue('takenDate', date);
          }}
          onError={(e) => setError('takenDate', e)}
          error={Boolean(errors.takenDate)}
        />
        <Form.Field
          label="Nơi xét nghiệm"
          control={Select}
          options={zoneList
            .filter((z) => z?.type === 1)
            .map((z) => ({
              key: z.id,
              text: z.name,
              value: z.name,
            }))}
          value={watch('resultFrom') || ''}
          onChange={(e, { value }) => {
            setValue('resultFrom', value);
          }}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field
          label="Nơi lấy mẫu"
          control={Select}
          options={zoneList
            .filter((z) => z?.type === 2)
            .map((z) => ({
              key: z.id,
              text: z.name,
              value: z.name,
            }))}
          value={watch('takenFrom') || ''}
          onChange={(e, { value }) => {
            setSelectingZone(zoneList.find((z) => z.name === value));
            setValue('takenFrom', value);
          }}
        />
        <Form.Field
          label="Mã xét nghiệm"
          control={Select}
          disabled={!watch('takenFrom')}
          options={printedCodeList.map((p) => ({
            key: p.code,
            text: p.code,
            value: p.code,
          }))}
          value={watch('examinationCode') || ''}
          onChange={(e, { value }) => {
            setValue('examinationCode', value);
          }}
        />
      </Form.Group>
      <h5>Mẫu bệnh phẩm</h5>
      {examines.map((ex) => (
        <Form.Group key={ex.key} widths="equal">
          <Form.Field
            style={{ paddingTop: `${watch(ex.key) ? '1.5rem' : '.5rem'}` }}
            control={Checkbox}
            label={ex.text}
            checked={watch(ex.key)}
            onClick={(e, { checked }) => {
              if (checked) {
                setValue(ex.key, true);
              } else {
                setValue(ex.key, false);
                setValue(`${ex.key}_Result`, '');
              }
            }}
          />
          {watch(ex.key) && (
            <>
              <Form.Field
                label="Ngày có kết quả"
                control={KeyboardDatePicker}
                value={watch(`${ex.key}_Result_RetrieveDate`) || ''}
                onChange={(date) => {
                  clearErrors(`${ex.key}_Result_RetrieveDate`);
                  setValue(`${ex.key}_Result_RetrieveDate`, date);
                }}
                onError={(e) => setError(`${ex.key}_Result_RetrieveDate`, e)}
                error={Boolean(errors[`${ex.key}_Result_RetrieveDate`])}
              />
              <Form.Field
                control={Select}
                label="Kết quả xét nghiệm"
                placeholder="Chọn"
                options={statuses.map((s) => ({
                  key: s,
                  value: s,
                  text: s,
                }))}
                value={watch(`${ex.key}_Result`)}
                onChange={(e, { value }) => {
                  setValue(`${ex.key}_Result`, value);
                }}
              />
            </>
          )}
        </Form.Group>
      ))}
      <Form.Group widths="equal">
        <Form.Field
          label="Mẫu khác"
          control={Input}
          value={watch('other') || ''}
          onChange={(e, { value }) => {
            setValue('other', value);
          }}
        />
        {watch('other') && (
          <>
            <Form.Field
              label="Ngày có kết quả"
              control={KeyboardDatePicker}
              value={watch('other_Result_RetrieveDate') || ''}
              onChange={(date) => {
                clearErrors('other_Result_RetrieveDate');
                setValue('other_Result_RetrieveDate', date);
              }}
              onError={(e) => setError('other_Result_RetrieveDate', e)}
              error={Boolean(errors.other_Result_RetrieveDate)}
            />
            <Form.Field
              label="Kết quả xét nghiệm"
              control={Select}
              options={statuses.map((s) => ({
                key: s,
                value: s,
                text: s,
              }))}
              value={watch('other_Result')}
              onChange={(e, { value }) => {
                setValue('other_Result', value);
              }}
            />
          </>
        )}
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field
          label="Kết quả xác định"
          control={Select}
          options={statusOptions}
          value={watch('isPositive')}
          onChange={(e, { value }) => {
            setValue('isPositive', value);
          }}
        />
        {Boolean(isPositive) && (
          <Form.Field
            required
            label="Loại dương tính"
            control={Select}
            options={positiveTypes}
            value={watch('positiveType')}
            onChange={(e, { value }) => {
              setValue('positiveType', value);
            }}
          />
        )}
      </Form.Group>
      {Boolean(isPositive) && (watch('positiveType') === 0) && (
        <Form.Group widths="equal">
          <Form.Field
            control={Checkbox}
            label="Kết quả xác định"
            checked={isFinalResult}
            onClick={(e, { checked }) => {
              setValue('isFinalResult', checked);
            }}
          />
        </Form.Group>
      )}
      {Boolean(isFinalResult) && Boolean(isPositive) && (
        <>
          {!subjectCode && (
            <>
              <Header as="h4" content="Thông tin người bệnh" />
              <Form.Group widths="equal">
                <Form.Field
                  control={Input}
                  label="Bí danh CDC"
                  value={watch('code') || ''}
                  onChange={(e, { value }) => {
                    trigger('code');
                    setValue('code', value);
                  }}
                  error={Boolean(errors.code)}
                />
                <Form.Field
                  control={Input}
                  label="Bí danh HCM"
                  value={watch('privateAlias') || ''}
                  onChange={(e, { value }) => {
                    trigger('privateAlias');
                    setValue('privateAlias', value);
                  }}
                  error={Boolean(errors.code)}
                />
                <Form.Field
                  control={Input}
                  label="Bí danh BYT"
                  value={watch('alias') || ''}
                  onChange={(e, { value }) => setValue('alias', value)}
                />
              </Form.Group>
            </>
          )}
          {!diseaseLocation?.id && (
            <>
              <Header as="h4" content="Địa điểm phát bệnh" />
              <Form.Group widths="equal">
                <Form.Field
                  control={AddressDetails}
                  initialData={watch('diseaseLocation') || {}}
                  onChange={(d) => setValue('diseaseLocation', d)}
                />
              </Form.Group>
            </>
          )}
        </>
      )}
      <Button
        primary
        type="submit"
        content="Xác nhận"
      />
    </StyledForm>
  );
};

MedicalTestForm.propTypes = {
  initialData: PropTypes.shape({}),
  diseaseLocation: PropTypes.shape({}),
  subjectCode: PropTypes.string,
  onSubmit: PropTypes.func,
};

MedicalTestForm.defaultProps = {
  initialData: {},
  diseaseLocation: {},
  subjectCode: '',
  onSubmit: () => {},
};

export default MedicalTestForm;
