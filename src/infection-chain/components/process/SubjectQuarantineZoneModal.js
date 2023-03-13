import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Form,
  Button,
  Select,
} from 'semantic-ui-react';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { KeyboardDatePicker } from 'app/components/shared';
import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

const SubjectQuarantineZoneModal = (props) => {
  const {
    open,
    onClose,
    onChange,
    onSubmit,
  } = props;

  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [zoneSuggestions, setZoneSuggestions] = useState(
    [],
  );
  const [zoneSelect, setZoneSelect] = useState('');
  const [expectedTime, setExpectedTime] = useState(null);

  const handleSearch = (value) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(
      setTimeout(() => {
        setLoading(true);
        httpClient
          .callApi({
            method: 'GET',
            url: apiLinks.quarantineZone(),
            params: { name: value },
          })
          .then((response) => {
            setZoneSuggestions(response.data || []);
          })
          .finally(() => {
            setLoading(false);
          });
      }, 300),
    );
  };

  useEffect(() => {
    handleSearch('');
    // eslint-disable-next-line
  }, []);

  const {
    watch,
    register,
    setValue,
    getValues,
    handleSubmit,
  } = useForm({
    defaultValues: {},
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    register({ name: 'quarantineZoneId' });
    register({ name: 'startTime' });
    register({ name: 'endTime' });
    setValue('startTime', moment().add(1, 'days'));
    setValue('endTime', moment().add(15, 'days'));
  }, [register, setValue]);

  const options = zoneSuggestions.map((cl) => ({
    key: cl.id,
    text: cl.name,
    value: cl.id,
    isTreatmentZone: cl.isTreatmentZone,
  }));

  const handleChangeExpectedTime = () => {
    if (expectedTime) {
      setValue('endTime', expectedTime);
    } else {
      setValue('endTime', moment(watch('startTime')).add(14, 'days').format());
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Cách ly tại khu cách ly tập trung</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group widths="equal">
            <Form.Field
              search
              deburr
              clearable
              required
              control={Select}
              options={options.filter((e) => !e.isTreatmentZone)}
              loading={loading}
              label="Tên địa điểm"
              placeholder="Tìm kiếm"
              value={zoneSelect}
              onSearchChange={(e, { searchQuery }) => {
                handleSearch(searchQuery);
              }}
              onChange={(e, { value }) => {
                setZoneSelect(value);
                if (!value) {
                  setZoneSuggestions((sl) => sl.filter((s) => s.id !== -1));
                }
                if (value !== -1) {
                  const zone = zoneSuggestions.find(
                    (cl) => cl.id === value,
                  );
                  setValue('quarantineZoneId', zone ? zone.id : '');
                  onChange(getValues());
                }
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={KeyboardDatePicker}
              label="Ngày bắt đầu cách ly"
              value={watch('startTime') || ''}
              onChange={(d) => {
                setValue('startTime', moment(d, 'YYYY-MM-DD').format());
                handleChangeExpectedTime();
              }}
            />
            <Form.Field
              required
              control={KeyboardDatePicker}
              readOnly
              label="Dự kiến ngày kết thúc cách ly"
              value={watch('endTime') || ''}
              onChange={(d) => {
                setValue('endTime', moment(d, 'YYYY-MM-DD').format());
              }}
            />
            <Form.Field
              control={KeyboardDatePicker}
              label="Ngày chính thức kết thúc cách ly"
              value={expectedTime}
              onChange={(d) => {
                setExpectedTime(moment(d, 'YYYY-MM-DD').format());
                handleChangeExpectedTime();
              }}
            />
          </Form.Group>
          <Button primary disabled={!watch('quarantineZoneId')}>Xác nhận</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

SubjectQuarantineZoneModal.propTypes = {
  open: PropTypes.bool,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

SubjectQuarantineZoneModal.defaultProps = {
  open: false,
  onChange: () => {},
  onClose: () => {},
  onSubmit: () => {},
};

export default SubjectQuarantineZoneModal;
