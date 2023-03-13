import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'semantic-ui-react';

import { toast } from 'react-toastify';
import Geocode from 'react-geocode';
import locations from 'app/assets/mock/locations.json';

import { useDispatch, useSelector } from 'react-redux';
import { createLocation, updateEstate } from 'contact/actions/contact';

import { LocationType } from 'infection-chain/utils/constants';
import LocationSection from 'chain/components/LocationSection';

const EstateModal = (props) => {
  const { open, onClose, onRefresh, onSelect, data } = props;

  const dispatch = useDispatch();
  const updateLoading = useSelector((s) => s.contact.updateEstateLoading);
  const createLoading = useSelector((s) => s.contact.createLocationLoading);

  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState({});
  useEffect(() => {
    setSelecting(data);
  }, [data]);

  const isUpdate = Boolean(data?.id);
  const handleSubmit = async () => {
    let lat;
    let lng;
    if (
      selecting.provinceValue &&
      selecting.wardValue &&
      selecting.districtValue &&
      selecting.streetHouseNumber
    ) {
      setLoading(true);
      const provinceLabel = locations.find(
        (p) => p.value === selecting.provinceValue,
      ).label;
      const districtLabel = locations
        .find((p) => p.value === selecting.provinceValue)
        .districts.find((d) => d.value === selecting.districtValue).label;
      const wardLabel = locations
        .find((p) => p.value === selecting.provinceValue)
        .districts.find((d) => d.value === selecting.districtValue)
        .wards.find((w) => w.value === selecting.wardValue).label;
      const house = selecting.streetHouseNumber;
      const searchAddress = `${house}, ${wardLabel}, ${districtLabel}, ${provinceLabel}`;
      await Geocode.fromAddress(searchAddress).then((response) => {
        lat = response.results[0].geometry.location.lat;
        lng = response.results[0].geometry.location.lng;
      });
      setLoading(false);

      await dispatch(
        isUpdate
          ? updateEstate({
              id: selecting.id,
              name: selecting.name,
              lat,
              lng,
            })
          : createLocation({
              name: selecting.name,
              contactName: selecting?.contactName ?? undefined,
              contactPhoneNumber: selecting?.contactPhoneNumber ?? undefined,
              address: selecting,
              lat,
              lng,
              locationType: LocationType.LOCATION,
            }),
      );
      onClose();
      onRefresh();
    } else {
      toast.warn('Chưa đủ thông tin!');
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {isUpdate ? 'Chỉnh sửa thông tin nơi tiếp xúc' : 'Tạo mới nơi tiếp xúc'}
      </Modal.Header>
      <Modal.Content>
        <LocationSection
          required
          notFetchApi
          data={data}
          onChange={(d) => setSelecting((initial) => ({ ...initial, ...d }))}
          onSelect={isUpdate ? null : onSelect}
        />
      </Modal.Content>
      <Modal.Actions>
        {isUpdate ? (
          <Button
            color="violet"
            labelPosition="right"
            icon="sync"
            content="Cập nhật"
            loading={createLoading || updateLoading || loading}
            disabled={createLoading || updateLoading || loading}
            onClick={handleSubmit}
          />
        ) : (
          <Button
            color="green"
            labelPosition="right"
            icon="plus"
            content="Tạo mới"
            loading={createLoading || updateLoading || loading}
            disabled={createLoading || updateLoading || loading}
            onClick={handleSubmit}
          />
        )}
      </Modal.Actions>
    </Modal>
  );
};

EstateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
  onRefresh: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
};

EstateModal.defaultProps = {
  onSelect: () => {},
};

export default EstateModal;
