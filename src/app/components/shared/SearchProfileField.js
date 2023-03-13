import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  Select,
  // Header,
} from 'semantic-ui-react';

// import httpClient from 'app/utils/http-client';
// import apiLinks from 'app/utils/api-links';
import moment from 'moment';

import { deburr } from 'app/utils/helpers';

const SearchProfileField = ({
  initialProfileId,
  initialProfileName,
  initialProfileDob,
  onChange,
}) => {
  // const [searchLoading, setSearchLoading] = useState(false);
  const [profileSuggestions, setProfileSuggestions] = useState([]);

  useEffect(() => {
    if (initialProfileId) {
      onChange(initialProfileId);
      setProfileSuggestions([
        {
          fullName: initialProfileName,
          profileId: initialProfileId,
          dateOfBirth: initialProfileDob,
        },
      ]);
    }
  }, [onChange, initialProfileId, initialProfileName, initialProfileDob]);

  // useEffect(() => {
  //   setSearchLoading(true);
  //   httpClient
  //     .callApi({
  //       url: apiLinks.profiles.get,
  //       params: {
  //         pageSize: 2147483646,
  //         pageIndex: 0,
  //       },
  //     })
  //     .then(({ data: { data } }) => {
  //       setProfileSuggestions(data || []);
  //     })
  //     .finally(() => {
  //       setSearchLoading(false);
  //     });
  // }, []);

  const options = profileSuggestions.map((s) => ({
    text: s.fullName,
    value: s.profileId,
    content: (
      <Header
        content={s.fullName}
        subheader={`Năm sinh: ${
          s.dateOfBirth ? moment(s?.dateOfBirth).format('YYYY') : ''
        }`}
      />
    ),
    mapped: `${s.fullName} ${
      s.dateOfBirth ? moment(s?.dateOfBirth).format('YYYY') : ''
    }`,
  }));

  return (
    <Select
      search={(searchOptions, value) =>
        searchOptions.filter(({ mapped }) =>
          deburr(mapped).includes(deburr(value)),
        )
      }
      deburr
      fluid
      clearable
      options={options}
      // loading={searchLoading}
      defaultValue={initialProfileId}
      placeholder="Tìm kiếm"
      onChange={(_, { value }) => onChange(value)}
    />
  );
};

SearchProfileField.propTypes = {
  initialProfileId: PropTypes.number,
  initialProfileName: PropTypes.string,
  initialProfileDob: PropTypes.string,
  onChange: PropTypes.func,
};

SearchProfileField.defaultProps = {
  initialProfileId: 0,
  initialProfileName: '',
  initialProfileDob: '',
  onChange: () => {},
};

export default SearchProfileField;
