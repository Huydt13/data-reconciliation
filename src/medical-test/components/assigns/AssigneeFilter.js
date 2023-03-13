import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Select } from 'semantic-ui-react';

import { useAuth } from 'app/hooks';
import { useSelector } from 'react-redux';

import { AssignStatuses } from 'infection-chain/utils/constants';
import { assignStatuses, sourceTypes } from 'infection-chain/utils/helpers';

import { KeyboardDatePicker, FilterSearchBar } from 'app/components/shared';

const Wrapper = styled.div`
  padding: 8px;
`;

const AssigneeFilter = ({
  isWaiting,
  isTaken,
  isOld,
  hideDateFilter,
  onChange,
}) => {
  const [unitId, setUnitId] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState(0);
  const [assignDateFrom, setAssignDateFrom] = useState(null);
  const [assignDateTo, setAssignDateTo] = useState(null);

  const { isAdmin } = useAuth();
  const [assignOptions, setAssignOptions] = useState([]);

  const { unitInfo, prefixList } = useSelector((state) => state.medicalTest);

  useEffect(() => {
    if (!isAdmin) {
      setUnitId(unitInfo?.id);
    }
  }, [unitInfo, isAdmin]);

  useEffect(() => {
    setStatus('');
    if (isWaiting || isOld) {
      setStatus(AssignStatuses.CREATE);
      setAssignOptions(
        assignStatuses
          .filter((a) => a.value === AssignStatuses.CREATE)
          .map((a) => ({
            key: a.value,
            value: a.value,
            text: a.label,
          })),
      );
    } else if (isTaken) {
      setStatus(AssignStatuses.TAKEN);
      setAssignOptions(
        assignStatuses
          .filter((a) => a.value === AssignStatuses.TAKEN)
          .map((a) => ({
            key: a.value,
            value: a.value,
            text: a.label,
          })),
      );
    } else {
      setAssignOptions(
        assignStatuses
          .filter((a) => a.value !== AssignStatuses.TAKEN)
          .filter((a) => a.value !== AssignStatuses.CREATE)
          .map((a) => ({
            key: a.value,
            value: a.value,
            text: a.label,
          })),
      );
    }
  }, [isWaiting, isOld, isTaken]);

  const handleChange = (searchValue) => {
    onChange({
      searchValue,
      unitId,
      source,
      status,
      assignDateFrom,
      assignDateTo,
    });
  };

  return (
    <FilterSearchBar onChange={handleChange}>
      <Wrapper>
        <div className="ui form">
          <Form.Group widths="equal">
            {isAdmin && (
              <Form.Field
                search
                deburr
                clearable
                label="Cơ sở xét nghiệm"
                control={Select}
                options={prefixList.map((pr) => ({
                  key: pr.id,
                  text: pr.name,
                  value: pr.id,
                }))}
                onChange={(_, { value }) => setUnitId(value)}
              />
            )}
            <Form.Field
              search
              deburr
              clearable
              label="Nguồn"
              control={Select}
              options={sourceTypes.map((s) => ({
                key: s.value,
                value: s.value,
                text: s.label,
              }))}
              onChange={(e, { value }) => setSource(value)}
            />
            <Form.Field
              search
              deburr
              clearable={!isWaiting && !isTaken && !isOld}
              label="Trạng thái"
              control={Select}
              options={assignOptions}
              value={status}
              onChange={(e, { value }) => setStatus(value)}
            />
          </Form.Group>
          {!hideDateFilter && (
            <Form.Group widths="equal">
              <Form.Field
                label="Từ ngày (ngày chỉ định)"
                control={KeyboardDatePicker}
                onChange={setAssignDateFrom}
              />
              <Form.Field
                label="Đến ngày (ngày chỉ định)"
                control={KeyboardDatePicker}
                onChange={setAssignDateTo}
              />
            </Form.Group>
          )}
        </div>
      </Wrapper>
    </FilterSearchBar>
  );
};

AssigneeFilter.propTypes = {
  isWaiting: PropTypes.bool,
  isOld: PropTypes.bool,
  isTaken: PropTypes.bool,
  hideDateFilter: PropTypes.bool,
  onChange: PropTypes.func,
};

AssigneeFilter.defaultProps = {
  isWaiting: false,
  isOld: false,
  isTaken: false,
  hideDateFilter: false,
  onChange: () => {},
};

export default AssigneeFilter;
