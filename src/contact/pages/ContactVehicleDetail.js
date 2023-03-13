import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  Form,
  Input,
  Card,
  Button,
  Select,
} from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateContactVehicle } from 'contact/actions/contact';
import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

const StyledCard = styled(Card)`
  padding: 20px !important;
  width: auto !important;
  margin-top: 0 !important;
`;

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

const ContactVehicleDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const dispatch = useDispatch();

  const getContactVehicle = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(setTimeout(() => {
      setSearchLoading(true);
      httpClient.callApi({
        method: 'GET',
        url: apiLinks.contactVehicle(id),
      }).then((response) => {
        setData(response.data);
      }).finally(() => {
        setSearchLoading(false);
      });
    }, 300));
  };

  const handleRefresh = useCallback(() => {
    getContactVehicle();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [dispatch, id]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleUpdate = () => {
    dispatch(updateContactVehicle(data)).then(() => {
      handleRefresh();
    });
  };

  return (
    <StyledCard className="ContactVehicleDetail">
      <Form onSubmit={handleUpdate} loading={searchLoading}>
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            label="Tên phương tiện"
            name="vehicleName"
            value={data?.vehicleName ?? ''}
            onChange={(event) => setData({
              ...data,
              vehicleName: event.target.value,
            })}
          />
          <Form.Field
            clearable
            label="Loại hình"
            control={Select}
            options={vehicleTypes}
            value={data?.vehicleType ?? ''}
            onChange={(e, { value }) => setData({
              ...data,
              vehicleType: value,
            })}
          />
          <Form.Field
            control={Input}
            label="Só ghế"
            name="seatNumber"
            value={data?.seatNumber ?? ''}
            onChange={(event) => setData({
              ...data,
              seatNumber: event.target.value,
            })}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            label="Điểm khởi hành"
            name="from"
            value={data?.from ?? ''}
            onChange={(event) => setData({
              ...data,
              from: event.target.value,
            })}
          />
          <Form.Field
            control={Input}
            label="Điểm đến"
            name="to"
            value={data?.to ?? ''}
            onChange={(event) => setData({
              ...data,
              to: event.target.value,
            })}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            label="Ghi chú"
            name="notes"
            value={data?.notes ?? ''}
            onChange={(event) => setData({
              ...data,
              notes: event.target.value,
            })}
          />
        </Form.Group>
        <Button primary>Xác nhận</Button>
      </Form>
    </StyledCard>
  );
};

export default ContactVehicleDetail;
