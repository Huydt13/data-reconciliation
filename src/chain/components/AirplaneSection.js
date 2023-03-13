import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'semantic-ui-react';

import { Controller, useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { searchAirplane, getLocationDetail } from 'contact/actions/contact';
import KeyboardDateTimePicker from 'app/components/shared/KeyboardDateTimePicker';
import { getIndexes } from 'app/utils/helpers';
import { LocationType } from 'infection-chain/utils/constants';
import moment from 'moment';

const AirplaneSection = (props) => {
  const { onChange: onChangeProps, data: dataProps, hideTime } = props;
  const dispatch = useDispatch();
  const {
    searchAirplaneList: { data: searchAirplaneList },
    getSearchAirplaneLoading,
  } = useSelector((state) => state.contact);

  const { watch, control, getValues, setValue, reset, register } = useForm();

  useEffect(() => register('flightNumber'), [register]);

  const triggerOnChange = useCallback(() => {
    const s = getValues();
    onChangeProps(s);
  }, [getValues, onChangeProps]);

  const [airplaneOptions, setAirplaneOptions] = useState([]);
  useEffect(() => {
    setAirplaneOptions(() =>
      (searchAirplaneList || [])
        .filter((s) => s.flightNumber)
        .map((s) => ({
          text: `${s.flightNumber} - khởi hành ${moment(s.departureTime).format(
            'HH:mm | DD-MM-YYYY',
          )}`,
          value: s.id,
        })),
    );
  }, [searchAirplaneList]);

  const [selectedAirplaneId, setSelectedAirplaneId] = useState('');
  const onSelectAirplane = useCallback(
    (airplaneId, airplaneName) => {
      if (airplaneId !== '-1') {
        const getAirplaneDetails = async () => {
          if (airplaneId) {
            const airplane = await dispatch(
              getLocationDetail(airplaneId, LocationType.AIRPLANE),
            );
            if (airplane) {
              setValue('flightNumber', airplane.flightNumber);
              setValue('seatNumber', airplane.seatNumber);
              setValue('departureTime', airplane.departureTime);
              setValue('arrivalTime', airplane.arrivalTime);
              setValue('flightFrom', airplane.flightFrom);
              setValue('flightTo', airplane.flightTo);
              setValue('locationType', 'Máy bay');
            }
            onChangeProps(airplane);
          }
        };
        getAirplaneDetails();
      } else {
        reset({
          flightNumber: airplaneName,
          seatNumber: '',
          departureTime: '',
          arrivalTime: '',
          flightFrom: '',
          flightTo: '',
          locationType: 'Máy bay',
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
      dispatch(searchAirplane({}));
    }
  }, [dataProps, dispatch]);

  const airplaneSelectNode = useMemo(() => {
    if (dataProps) {
      return (
        <Controller
          name="flightNumber"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Tên chuyến bay"
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
        label="Tên chuyến bay"
        allowAdditions
        additionLabel="Thêm mới: "
        loading={getSearchAirplaneLoading}
        options={airplaneOptions}
        value={selectedAirplaneId}
        onAddItem={(_, { value }) => {
          setAirplaneOptions((so) => [
            ...so.filter((s) => s.value !== '-1'),
            { text: value, value: '-1' },
          ]);
        }}
        onChange={(_, { value }) => {
          if (getIndexes([...value], '-').length === 4) {
            setSelectedAirplaneId(value);
            onSelectAirplane(value);
          } else {
            setSelectedAirplaneId('-1');
            onSelectAirplane('-1', value);
          }
        }}
      />
    );
  }, [
    control,
    dataProps,
    triggerOnChange,
    getSearchAirplaneLoading,
    onSelectAirplane,
    selectedAirplaneId,
    airplaneOptions,
  ]);

  const disabledInfoFields = useMemo(
    () => Boolean(selectedAirplaneId && selectedAirplaneId !== '-1'),
    [selectedAirplaneId],
  );

  return (
    <div className="ui form">
      <Form.Group widths="equal">
        {airplaneSelectNode}
        {/* <Controller
          name="flightNumber"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Số hiệu máy bay"
              disabled={disabledInfoFields}
              value={value}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        /> */}
        <Controller
          name="seatNumber"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Số ghế"
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
          name="flightFrom"
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
          name="flightTo"
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
      {!hideTime && (
        <Form.Group widths="equal">
          <Controller
            name="departureTime"
            defaultValue=""
            control={control}
            render={({ onChange, value }) => (
              <Form.Field
                fluid
                isHavingTime
                control={KeyboardDateTimePicker}
                label="Thời gian khởi hành"
                disabled={disabledInfoFields}
                value={value}
                onChange={(date) => {
                  onChange(date);
                  triggerOnChange();
                }}
                disabledDays={[
                  {
                    after: new Date(),
                  },
                ]}
              />
            )}
          />
          <Controller
            name="arrivalTime"
            defaultValue=""
            control={control}
            render={({ onChange, value }) => (
              <Form.Field
                fluid
                isHavingTime
                control={KeyboardDateTimePicker}
                label="Thời gian đến"
                disabled={disabledInfoFields}
                value={value}
                onChange={(date) => {
                  onChange(date);
                  triggerOnChange();
                }}
                disabledDays={[
                  {
                    after: new Date(),
                    before: new Date(watch('departureTime')),
                  },
                ]}
              />
            )}
          />
        </Form.Group>
      )}
    </div>
  );
};

AirplaneSection.propTypes = {
  hideTime: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  data: PropTypes.shape({}),
};

AirplaneSection.defaultProps = {
  hideTime: false,
  data: null,
};

export default AirplaneSection;
