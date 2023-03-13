import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Form,
  Select,
  Input,
  Button,
} from 'semantic-ui-react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { createContactVehicle } from 'contact/actions/contact';
import MinimizeContactVehicle from './MinimizeContactVehicle';
import SearchContactVehicle from '../SearchContactVehicle';

const vehicleTypes = [
  { key: 'Máy bay', text: 'Máy bay', value: 'Máy bay' },
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

const MarginLeftButton = styled(Button)` margin-left: 10px !important; `;

const ButtonGroupWrapper = styled.div`
  margin-bottom: 10px;
  text-align: right;
  & .buttons {
    margin-top: 16px;
    margin-right: 4px;
  }
`;

const ContactVehicleSection = (props) => {
  const {
    contactId,
    loading,
    initialData,
    onChange,
    minimize,
  } = props;

  const [contactVehicle, setContactVehicle] = useState({});
  const [isExisted, setIsExisted] = useState(Boolean(contactVehicle?.id));

  useEffect(() => {
    if (initialData?.id) {
      setContactVehicle(initialData);
    }
  }, [initialData]);

  const {
    reset,
    watch,
    register,
    setValue,
    getValues,
  } = useForm({
    defaultValues: contactVehicle?.id ? contactVehicle : initialData,
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    reset(initialData);
  // eslint-disable-next-line
  }, [reset, initialData.id]);

  useEffect(() => {
    register({ name: 'id' });
    register({ name: 'vehicleName' });
    register({ name: 'vehicleType' });
  }, [register]);

  const dispatch = useDispatch();
  const handleCreate = () => {
    const data = getValues();
    if (data.id || data.id === -1) {
      delete data.id;
    }
    dispatch(createContactVehicle(data)).then((res) => {
      setValue('id', res);
      setContactVehicle({
        ...data,
        id: res,
      });
      onChange({
        ...data,
        id: res,
      });
    });
  };

  const confirmButton = (
    <MarginLeftButton
      basic
      color="green"
      content="Tạo phương tiện tiếp xúc"
      onClick={handleCreate}
    />
  );

  const cancelButton = (
    <MarginLeftButton
      basic
      color="grey"
      content="Huỷ"
      onClick={() => { setContactVehicle({}); setIsExisted(false); }}
    />
  );

  useEffect(() => {
    setIsExisted(Boolean(contactVehicle?.id));
  }, [contactVehicle]);

  const [isLoading, setIsLoading] = useState(false);
  const { loadingCreateContactVehicle } = useSelector((state) => state.contact);

  return (
    <>
      {!(minimize || isExisted) && (
        <div className={`ui form ${loading || isLoading || loadingCreateContactVehicle ? 'loading' : ''}`}>
          <Form.Group widths="equal">
            <Form.Field
              label="Tên phương tiện"
              control={SearchContactVehicle}
              onLoad={setIsLoading}
              initialContactVehicleId={contactVehicle?.id || initialData?.id || -1}
              initialContactVehicleName={contactVehicle?.vehicleName || initialData?.vehicleName || ''}
              onContactVehicleChange={(cv) => {
                setValue('id', cv?.id ?? -1);
                setValue('vehicleName', cv?.vehicleName ?? '');
                setContactVehicle(cv);
                onChange(getValues());
              }}
            />
            <Form.Field
              label="Loại hình"
              control={Select}
              value={watch('vehicleType') || ''}
              options={vehicleTypes}
              onChange={(e, { value }) => {
                setValue('vehicleType', value);
                onChange(getValues());
              }}
            />
            <Form.Field
              label="Số ghế"
              control={Input}
              input={{ ref: register }}
              name="seatNumber"
              value={watch('seatNumber') || ''}
              onBlur={() => onChange(getValues())}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              label="Điểm khởi hành"
              control={Input}
              input={{ ref: register }}
              name="from"
              value={watch('from') || ''}
              onBlur={() => onChange(getValues())}
            />
            <Form.Field
              label="Điểm đến"
              control={Input}
              input={{ ref: register }}
              name="to"
              value={watch('to') || ''}
              onBlur={() => onChange(getValues())}
            />
          </Form.Group>
        </div>
      )}
      {(minimize || isExisted) && <MinimizeContactVehicle contactVehicle={contactVehicle?.id ? contactVehicle : initialData} />}
      <ButtonGroupWrapper>
        {!(minimize || isExisted) && confirmButton}
        {!contactId && isExisted && cancelButton}
      </ButtonGroupWrapper>
    </>
  );
};

ContactVehicleSection.propTypes = {
  contactId: PropTypes.string,
  initialData: PropTypes.shape({
    id: PropTypes.string,
  }),
  loading: PropTypes.bool,
  minimize: PropTypes.bool,
  onChange: PropTypes.func,
};

ContactVehicleSection.defaultProps = {
  contactId: '',
  initialData: {
    id: '',
    name: '',
    address: {
      floor: '',
      block: '',
      streetHouseNumber: '',
      provinceValue: '',
      districtValue: '',
      wardValue: '',
    },
  },
  loading: false,
  minimize: false,
  onChange: () => {},
};

export default ContactVehicleSection;
