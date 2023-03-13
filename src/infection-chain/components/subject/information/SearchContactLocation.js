import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';
import { Select } from 'semantic-ui-react';

const SearchContactLocation = (props) => {
  const {
    initialContactLocationId,
    initialContactLocationName,
    onContactLocationChange,
    onLoad,
  } = props;

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [contactLocationSuggestions, setContactLocationSuggestions] = useState([]);

  useEffect(() => {
    onLoad(searchLoading);
  }, [onLoad, searchLoading]);

  const handleSearch = (value) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(setTimeout(() => {
      setSearchLoading(true);
      httpClient.callApi({
        method: 'GET',
        url: apiLinks.searchContactLocation,
        params: { name: value },
      }).then((response) => {
        setContactLocationSuggestions(response.data.data || []);
      }).finally(() => {
        setSearchLoading(false);
      });
    }, 300));
  };

  useEffect(() => {
    if (initialContactLocationName) {
      handleSearch(initialContactLocationName);
    } else {
      handleSearch('');
    }
  // eslint-disable-next-line
  }, []);

  const options = contactLocationSuggestions
    .filter((cl) => cl.name)
    .map((cl) => ({
      key: cl.id,
      text: cl.name,
      value: cl.id,
    }));

  return (
    <Select
      search
      deburr
      clearable
      allowAdditions
      options={options}
      loading={searchLoading}
      label="Tìm địa điểm"
      additionLabel="Thêm "
      value={initialContactLocationId ?? -1}
      onAddItem={(e, { value }) => {
        setContactLocationSuggestions((sl) => [...sl, { id: -1, name: value }]);
      }}
      onSearchChange={(e, { searchQuery }) => handleSearch(searchQuery)}
      onChange={(e, { value }) => {
        if (!value) {
          handleSearch('');
          setContactLocationSuggestions((sl) => sl.filter((s) => s.id !== -1));
        }
        if (value !== -1) {
          const contactLocation = contactLocationSuggestions.find((cl) => cl.id === value);
          onContactLocationChange(contactLocation || { name: value });
        } else {
          onContactLocationChange({ id: -1, name: value });
        }
      }}
    />
  );
};

SearchContactLocation.propTypes = {
  initialContactLocationId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  initialContactLocationName: PropTypes.string,
  onContactLocationChange: PropTypes.func,
  onLoad: PropTypes.func,
};

SearchContactLocation.defaultProps = {
  initialContactLocationId: '',
  initialContactLocationName: '',
  onContactLocationChange: () => {},
  onLoad: () => {},
};

export default SearchContactLocation;
