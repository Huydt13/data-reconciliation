import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Header, Select } from 'semantic-ui-react';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';
import moment from 'moment';

import { useDispatch } from 'react-redux';
import { selectSubjectOnCreatingProfile } from 'infection-chain/actions/subject';

import { deburr } from 'app/utils/helpers';

const SearchSubjectSection = ({
  type,
  initialProfileId,
  onChange: onChangeProp,
}) => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [subjectSuggestions, setSubjectSuggestions] = useState([]);

  const dispatch = useDispatch();
  const handleSearch = useCallback(
    (_, { searchQuery: name }) => {
      if (name.length > 2) {
        setSearchLoading(true);
        httpClient
          .callApi({
            url:
              type === 0
                ? apiLinks.infectionChain.subjects.getF0
                : type === 1
                ? apiLinks.infectionChain.subjects.getF11
                : apiLinks.infectionChain.subjects.getPersonels,
            params: {
              name,
              diseaseTypeId: 'b597cc8f-74b6-434d-8b9d-52b74595a1de',
              infectionTypeIds:
                type === 2 ? 'efb02881-ebec-49c9-875b-5ec15f44d58d' : undefined,
              pageSize: 20,
              pageIndex: 0,
            },
          })
          .then(({ data: { data } }) => {
            setSubjectSuggestions(data || []);
          })
          .finally(() => {
            setSearchLoading(false);
          });
      }
    },
    [type],
  );

  const options = subjectSuggestions.map((s) => ({
    text: s.fullName,
    value: s.profileId,
    content: (
      <Header
        content={s.fullName}
        subheader={
          type === 0
            ? `Năm sinh: ${
                s.dateOfBirth ? `${moment(s?.dateOfBirth).format('YYYY')}` : ''
              }, Bí danh HCM: ${s?.privateAlias ?? ''}, Bí danh BYT: ${
                s?.alias ?? ''
              }`
            : `Năm sinh: ${
                s.dateOfBirth ? `${moment(s?.dateOfBirth).format('YYYY')}` : ''
              }`
        }
      />
    ),
    mapped: `${s.fullName} ${
      s.dateOfBirth ? `${moment(s?.dateOfBirth).format('YYYY')}` : ''
    } ${s?.privateAlias ?? ''} ${s?.alias ?? ''}`,
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
      loading={searchLoading}
      defaultValue={initialProfileId}
      placeholder="Tìm kiếm (3 ký tự)"
      onChange={(_, { value }) => {
        if (onChangeProp) {
          onChangeProp(value);
        } else {
          dispatch(selectSubjectOnCreatingProfile(value, type === 0));
        }
      }}
      onSearchChange={handleSearch}
    />
  );
};

SearchSubjectSection.propTypes = {
  type: PropTypes.number.isRequired,
  initialProfileId: PropTypes.number,
  onChange: PropTypes.func,
};

SearchSubjectSection.defaultProps = {
  initialProfileId: 0,
  onChange: () => {},
};

export default SearchSubjectSection;
