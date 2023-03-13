import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, Header } from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';

import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';
import moment from 'moment';

const SearchSubject = (props) => {
  const {
    isProvided,
    initialSubjectId,
    initialSubjectName,
    onSubjectChange,
    filterSubjectIds,
    onLoad,
  } = props;

  const [isClose, setIsClose] = useState(true);
  const [isUsed, setIsUsed] = useState(false);
  const [selecting, setSelecting] = useState(null);

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  // const [subjectSuggestionsResponse, setSubjectSuggestionsResponse] = useState([]);
  const [subjectSuggestions, setSubjectSuggestions] = useState([]);

  const handleSearch = (value) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(setTimeout(() => {
      setSearchLoading(true);
      httpClient.callApi({
        method: 'GET',
        url: apiLinks.quickSearchSubject,
        params: { text: value },
      }).then((response) => {
        // setSubjectSuggestionsResponse(response.data || []);
        setSubjectSuggestions(response.data || []);
      }).finally(() => {
        setSearchLoading(false);
      });
    }, 300));
  };

  useEffect(() => {
    if (initialSubjectName) {
      if (initialSubjectId && initialSubjectId.indexOf('@') > -1) {
        setSubjectSuggestions([
          {
            id: initialSubjectId,
            fullName: initialSubjectName,
          },
        ]);
      } else {
        handleSearch(initialSubjectName);
      }
    }
  // eslint-disable-next-line
  }, []);

  const [uuid, setUuid] = useState(`@${uuidv4()}`);

  useEffect(() => {
    if (initialSubjectId && initialSubjectId.indexOf('@') === -1) {
      setUuid(initialSubjectId || `@${uuidv4()}`);
    }
  }, [initialSubjectId]);

  const options = subjectSuggestions.map((s) => ({
    key: s.id,
    text: `${s.fullName} ${s.dateOfBirth ? `- ${moment(s.dateOfBirth).format('DD/MM/YYYY')}` : ''}`,
    value: s.id,
    content: (
      <Header
        content={`${s.fullName} ${s.dateOfBirth ? `- ${moment(s.dateOfBirth).format('DD/MM/YYYY')}` : ''}`}
        subheader={`SĐT: ${s?.phoneNumber ?? ''} - CMND/CCCD: ${s?.identityNumber ?? s?.cccd ?? ''}`}
      />
    ),
  }));

  const getSubject = (subjectId) => {
    setSearchLoading(true);
    httpClient.callApi({
      method: 'GET',
      url: apiLinks.subject + subjectId,
    }).then((response) => {
      setSelecting(response.data);
    }).finally(() => {
      setSearchLoading(false);
    });
  };

  useEffect(() => {
    onLoad(searchLoading);
  }, [onLoad, searchLoading]);

  useEffect(() => {
    if (isClose && isUsed) {
      onSubjectChange(selecting);
    }
    // eslint-disable-next-line
  }, [isClose, isUsed, selecting]);

  return (
    <Select
      search
      deburr
      fluid
      clearable={!isProvided}
      options={options.filter((s) => !filterSubjectIds.includes(s.value))}
      loading={searchLoading}
      value={initialSubjectId}
      placeholder="Tìm kiếm"
      onSearchChange={(e, { searchQuery }) => { handleSearch(searchQuery); }}
      onChange={(e, { value }) => {
        if (value) {
          if (value.indexOf('@') === -1 && value.indexOf('-') > -1) {
            getSubject(value);
          } else {
            onSubjectChange({
              id: uuid,
              fullName: value,
            });
          }
        } else {
          setSelecting(null);
          setSubjectSuggestions((sl) => sl.filter((s) => !s.id));
        }
      }}
      allowAdditions
      additionLabel="Thêm "
      onAddItem={(e, { value }) => {
        setSubjectSuggestions([
          ...subjectSuggestions,
          {
            id: uuid,
            fullName: value,
          },
        ]);
      }}
      onOpen={() => {
        setIsClose(false);
        setIsUsed(true);
      }}
      onClose={(e) => {
        if (e) {
          setIsClose(true);
        }
      }}

    />
  );
};

SearchSubject.propTypes = {
  onSubjectChange: PropTypes.func,
  isProvided: PropTypes.bool,
  initialSubjectId: PropTypes.string,
  initialSubjectName: PropTypes.string,
  filterSubjectIds: PropTypes.arrayOf(PropTypes.string),
  onLoad: PropTypes.func,
};

SearchSubject.defaultProps = {
  onSubjectChange: () => {},
  isProvided: false,
  initialSubjectId: '',
  initialSubjectName: '',
  filterSubjectIds: [],
  onLoad: () => {},
};

export default SearchSubject;
