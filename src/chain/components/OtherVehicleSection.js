import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'semantic-ui-react';

import { Controller, useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { searchOtherVehicle, getLocationDetail } from 'contact/actions/contact';
import { getIndexes } from 'app/utils/helpers';
import { LocationType } from 'infection-chain/utils/constants';

const vehicleTypes = [
  { key: 'Tàu điện', text: 'Tàu điện', value: 'Tàu điện' },
  { key: 'Tàu hỏa', text: 'Tàu hỏa', value: 'Tàu hỏa' },
  { key: 'Tàu thủy', text: 'Tàu thủy', value: 'Tàu thủy' },
  { key: 'Xe khách', text: 'Xe khách', value: 'Xe khách' },
  { key: 'Xe buýt', text: 'Xe buýt', value: 'Xe buýt' },
  { key: 'Taxi', text: 'Taxi', value: 'Taxi' },
  { key: 'Grab car', text: 'Grab car', value: 'Grab car' },
  { key: 'Grab bike', text: 'Grab bike', value: 'Grab bike' },
  { key: 'Xe ôm', text: 'Xe ôm', value: 'Xe ôm' },
  { key: 'Ô tô', text: 'Ô tô', value: 'Ô tô' },
];

const OtherVehicleSection = (props) => {
  const { onChange: onChangeProps, data: dataProps } = props;
  const dispatch = useDispatch();
  const {
    searchOtherVehicleList: { data: searchOtherVehicleList },
    getSearchOtherVehicleLoading,
  } = useSelector((state) => state.contact);

  const { control, getValues, setValue, reset, register } = useForm();

  useEffect(() => register('vehicleName'), [register]);

  const triggerOnChange = useCallback(() => {
    const s = getValues();
    onChangeProps(s);
  }, [getValues, onChangeProps]);

  const [otherVehicleOptions, setOtherVehicleOptions] = useState([]);
  useEffect(() => {
    setOtherVehicleOptions(() =>
      (searchOtherVehicleList || [])
        .filter((s) => s.vehicleName)
        .map((s) => ({
          text: `${s.vehicleName} - ${s.vehicleType}`,
          value: s.id,
        })),
    );
  }, [searchOtherVehicleList]);

  const [selectedOtherVehicleId, setSelectedOtherVehicleId] = useState('');
  const onSelectOtherVehicle = useCallback(
    (otherVehicleId, otherVehicleName) => {
      if (otherVehicleId !== '-1') {
        const getOtherVehicleDetails = async () => {
          if (otherVehicleId) {
            const otherVehicle = await dispatch(
              getLocationDetail(otherVehicleId, LocationType.VEHICLE),
            );

            if (otherVehicle) {
              setValue('vehicleName', otherVehicle.vehicleName);
              setValue('vehicleType', otherVehicle.vehicleType);
              setValue('liscencePlateNumber', otherVehicle.liscencePlateNumber);
              setValue('tripNumber', otherVehicle.tripNumber);
              setValue('from', otherVehicle.from);
              setValue('to', otherVehicle.to);
            }
            onChangeProps(otherVehicle);
          }
        };
        getOtherVehicleDetails();
      } else {
        reset({
          vehicleName: otherVehicleName,
          vehicleType: '',
          liscencePlateNumber: '',
          tripNumber: '',
          from: '',
          to: '',
        });
      }
    },
    [dispatch, setValue, reset, onChangeProps],
  );

  // if initialData !== null
  useEffect(() => {
    reset({ ...dataProps });
  }, [reset, dataProps]);

  useEffect(() => {
    if (!dataProps?.id) {
      dispatch(searchOtherVehicle({}));
    }
  }, [dispatch, dataProps]);

  const otherVehicleSelectNode = useMemo(() => {
    if (dataProps) {
      return (
        <Controller
          name="vehicleName"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Tên phương tiện"
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
      );
    }
    return (
      <Form.Select
        fluid
        search
        label="Tên phương tiện"
        allowAdditions
        additionLabel="Thêm mới: "
        loading={getSearchOtherVehicleLoading}
        options={otherVehicleOptions}
        value={selectedOtherVehicleId}
        onAddItem={(e, { value }) => {
          setOtherVehicleOptions((so) => [
            ...so.filter((s) => s.value !== '-1'),
            { text: value, value: '-1' },
          ]);
        }}
        onChange={(e, { value }) => {
          if (getIndexes([...value], '-').length === 4) {
            setSelectedOtherVehicleId(value);
            onSelectOtherVehicle(value);
          } else {
            setSelectedOtherVehicleId('-1');
            onSelectOtherVehicle('-1', value);
          }
        }}
      />
    );
  }, [
    control,
    dataProps,
    triggerOnChange,
    getSearchOtherVehicleLoading,
    onSelectOtherVehicle,
    selectedOtherVehicleId,
    otherVehicleOptions,
  ]);

  const disabledInfoFields = useMemo(
    () => Boolean(selectedOtherVehicleId && selectedOtherVehicleId !== '-1'),
    [selectedOtherVehicleId],
  );

  return (
    <div className="ui form">
      <Form.Group widths="equal">
        {otherVehicleSelectNode}
        <Controller
          name="vehicleType"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Select
              fluid
              deburr
              clearable
              search
              label="Loại hình"
              disabled={disabledInfoFields}
              value={value}
              onChange={(_, { value: v }) => onChange(v)}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
              options={vehicleTypes}
            />
          )}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Controller
          name="liscencePlateNumber"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Biển đăng ký xe"
              disabled={disabledInfoFields}
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
        <Controller
          name="tripNumber"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Mã số chuyến đi"
              disabled={disabledInfoFields}
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Controller
          name="from"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Nơi khởi hành"
              disabled={disabledInfoFields}
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
        <Controller
          name="to"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Nơi đến"
              disabled={disabledInfoFields}
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
      </Form.Group>
    </div>
  );
};

OtherVehicleSection.propTypes = {
  onChange: PropTypes.func.isRequired,
  data: PropTypes.shape({}),
};

OtherVehicleSection.defaultProps = {
  data: null,
};

export default OtherVehicleSection;
