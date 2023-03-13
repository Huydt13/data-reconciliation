import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Form, Select } from 'semantic-ui-react';

import { useAuth } from 'app/hooks';
import { useSelector } from 'react-redux';

import { transportStatuses } from 'infection-chain/utils/helpers';
import { FilterSearchBar, KeyboardDateTimePicker } from 'app/components/shared';
import moment from 'moment';

const Wrapper = styled.div`
  padding: 8px;
`;

const TransportFilter = ({ onChange }) => {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [fromReceive, setFromReceive] = useState(null);
  const [toReceive, setToReceive] = useState(null);
  const [fromUnitId, setFromUnitId] = useState('');
  const [toUnitId, setToUnitId] = useState('');
  const [transportStatus, setTransportStatus] = useState('');

  const { isAdmin } = useAuth();
  const { unitInfo, prefixList } = useSelector((state) => state.medicalTest);
  const takeExamByThemselves =
    unitInfo?.isCollector && unitInfo?.isTester && !unitInfo?.isReceiver;

  const handleReset = () => {
    setFrom(null);
    setTo(null);
    setFromReceive(null);
    setToReceive(null);
    setFromUnitId('');
    setToUnitId('');
    setTransportStatus('');
  };

  const handleChange = (searchValue) => {
    onChange({
      searchValue,
      from: from ? moment(from).add('7', 'hours').toJSON() : undefined,
      to: to ? moment(to).add('7', 'hours').toJSON() : undefined,
      fromReceive: fromReceive
        ? moment(fromReceive).add('7', 'hours').toJSON()
        : undefined,
      toReceive: toReceive
        ? moment(toReceive).add('7', 'hours').toJSON()
        : undefined,
      fromUnitId,
      toUnitId,
      transportStatus,
    });
  };

  return (
    <>
      <FilterSearchBar onChange={handleChange} onReset={handleReset}>
        <Wrapper>
          <div className="ui form">
            <Form.Group widths="equal">
              {(Boolean(unitInfo?.isJoiningExam) || isAdmin) && (
                <Form.Field
                  search
                  deburr
                  clearable
                  label="Cơ sở chuyển mẫu"
                  control={Select}
                  options={prefixList.map((pr) => ({
                    key: pr.id,
                    value: pr.id,
                    text: pr.name,
                  }))}
                  value={fromUnitId}
                  onChange={(e, { value }) => setFromUnitId(value)}
                />
              )}
              <Form.Field
                isHavingTime
                label="Từ thời gian chuyển"
                control={KeyboardDateTimePicker}
                value={from}
                onChange={setFrom}
                disabledDays={[{ after: new Date() }]}
              />
              <Form.Field
                isHavingTime
                label="Đến thời gian chuyển"
                control={KeyboardDateTimePicker}
                value={to}
                onChange={setTo}
                disabledDays={[
                  {
                    after: new Date(),
                    before: new Date(from),
                  },
                ]}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                search
                deburr
                clearable
                label="Cơ sở nhận mẫu"
                control={Select}
                options={(takeExamByThemselves
                  ? [
                      unitInfo,
                      ...prefixList.filter(
                        (pr) => pr.isTester && pr.isCollector && pr.isReceiver,
                      ),
                    ]
                  : prefixList.filter(
                      (pr) => pr.isTester && pr.isCollector && pr.isReceiver,
                    )
                ).map((pr) => ({
                  key: pr.id,
                  value: pr.id,
                  text: pr.name,
                }))}
                value={toUnitId}
                onChange={(e, { value }) => setToUnitId(value)}
              />
              <Form.Field
                isHavingTime
                label="Từ thời gian nhận"
                control={KeyboardDateTimePicker}
                value={fromReceive}
                onChange={setFromReceive}
                disabledDays={[{ after: new Date() }]}
              />
              <Form.Field
                isHavingTime
                label="Đến thời gian nhận"
                control={KeyboardDateTimePicker}
                value={toReceive}
                onChange={setToReceive}
                disabledDays={[
                  {
                    after: new Date(),
                    before: new Date(fromReceive),
                  },
                ]}
              />
            </Form.Group>

            <Form.Group>
              <Form.Field
                width={4}
                search
                deburr
                clearable
                value={transportStatus}
                control={Select}
                label="Trạng thái"
                options={transportStatuses.map((t) => ({
                  key: t.value,
                  value: t.value,
                  text: t.label,
                }))}
                onChange={(e, { value }) => setTransportStatus(value)}
              />
            </Form.Group>
          </div>
        </Wrapper>
      </FilterSearchBar>
    </>
  );
};

TransportFilter.propTypes = {
  onChange: PropTypes.func,
};

TransportFilter.defaultProps = {
  onChange: () => {},
};

export default TransportFilter;
