import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';
import { Select } from 'semantic-ui-react';

const SearchContactVehicle = (props) => {
  const {
    initialContactVehicleId,
    initialContactVehicleName,
    onContactVehicleChange,
    onLoad,
  } = props;

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [contactVehicleSuggestions, setContactVehicleSuggestions] = useState([]);

  const handleSearch = (value) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(setTimeout(() => {
      setSearchLoading(true);
      httpClient.callApi({
        method: 'GET',
        url: apiLinks.searchContactVehicle,
        params: { name: value },
      }).then((response) => {
        setContactVehicleSuggestions(response.data.data || []);
      }).finally(() => {
        setSearchLoading(false);
      });
    }, 300));
  };

  useEffect(() => {
    onLoad(searchLoading);
  }, [onLoad, searchLoading]);

  useEffect(() => {
    if (initialContactVehicleName) {
      handleSearch(initialContactVehicleName);
    } else {
      handleSearch('');
    }
  // eslint-disable-next-line
  }, []);

  const options = contactVehicleSuggestions
    .filter((cl) => cl.vehicleName)
    .map((cv) => ({
      key: cv.id,
      text: cv.vehicleName,
      value: cv.id,
    }));

  return (
    <Select
      search
      deburr
      clearable
      allowAdditions
      options={options}
      loading={searchLoading}
      label="Tìm phương tiện"
      additionLabel="Thêm "
      value={initialContactVehicleId || -1}
      onAddItem={(e, { value }) => {
        setContactVehicleSuggestions((sl) => [...sl, { id: -1, vehicleName: value }]);
      }}
      onSearchChange={(e, { searchQuery }) => handleSearch(searchQuery)}
      onChange={(e, { value }) => {
        if (!value) {
          handleSearch('');
          setContactVehicleSuggestions((sl) => sl.filter((s) => s.id !== -1));
        }
        if (value !== -1) {
          const contactVehicle = contactVehicleSuggestions.find((cl) => cl.id === value);
          onContactVehicleChange(contactVehicle || { vehicleName: value });
        } else {
          onContactVehicleChange({ id: -1, vehicleName: value });
        }
      }}
    />
  );
};

SearchContactVehicle.propTypes = {
  initialContactVehicleId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  initialContactVehicleName: PropTypes.string,
  onContactVehicleChange: PropTypes.func,
  onLoad: PropTypes.func,
};

SearchContactVehicle.defaultProps = {
  initialContactVehicleId: '',
  initialContactVehicleName: '',
  onContactVehicleChange: () => {},
  onLoad: () => {},
};

export default SearchContactVehicle;
