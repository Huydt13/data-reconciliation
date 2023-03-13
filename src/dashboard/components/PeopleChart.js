import React, { useState, useEffect } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useDispatch, useSelector } from 'react-redux';
import { getPeopleExaminationStatistic } from 'dashboard/actions/dashboard';

import moment from 'moment';
import styled from 'styled-components';
import { Card, Dimmer, Form, Loader } from 'semantic-ui-react';
import { KeyboardDatePicker } from 'app/components/shared';

const StyledCard = styled(Card)`
  width: auto !important;
  padding-bottom: 20px !important;
`;

const PeopleChart = () => {
  const {
    getPeopleExaminationStatisticLoading,
    peopleExaminationStatistic: data,
  } = useSelector((s) => s.dashboard);

  const [from, setFrom] = useState(moment().subtract(7, 'days'));
  const [to, setTo] = useState(moment());
  const dispatch = useDispatch();
  const handleRefresh = () => {
    dispatch(
      getPeopleExaminationStatistic(
        moment(from).format('YYYY-MM-DD'),
        moment(to).format('YYYY-MM-DD'),
      ),
    );
  };

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, [from, to]);

  return (
    <div>
      <StyledCard className="people-chart">
        <Card.Header textAlign="center" content="Thống kê theo cá thể" />
        <div className="ui form" style={{ padding: '0 25px' }}>
          <Form.Group widths="equal" style={{ marginBottom: '10px' }}>
            <Form.Field
              label="Từ ngày"
              control={KeyboardDatePicker}
              value={from}
              disabledDays={[{ after: new Date() }]}
              onChange={setFrom}
            />
            <Form.Field
              label="Đến ngày"
              control={KeyboardDatePicker}
              value={to}
              disabledDays={[
                {
                  after: new Date(),
                  before: new Date(from),
                },
              ]}
              onChange={setTo}
            />
          </Form.Group>
        </div>
        {getPeopleExaminationStatisticLoading && (
          <Dimmer inverted active>
            <Loader />
          </Dimmer>
        )}
        <ResponsiveContainer width="100%" aspect={4.0 / 3.0}>
          <BarChart
            data={data.map((d) => ({
              ...d,
              'Số người được chỉ định xét nghiệm': d.assignedCount,
              'Số người đã lấy mẫu': d.takenExamCount,
              'Số người đã có kết quả': d.hasResultCount,
              date: moment(d.date, 'DD/MM/YYYY').format('DD-MM-YYYY'),
            }))}
            margin={{
              top: 40,
              right: 20,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Legend style={{ marginTop: 30 }} />
            <Tooltip />
            <Bar dataKey="Số người được chỉ định xét nghiệm" fill="#6435C9" />
            <Bar dataKey="Số người đã lấy mẫu" fill="#F2711B" />
            <Bar dataKey="Số người đã có kết quả" fill="#21BA45" />
          </BarChart>
        </ResponsiveContainer>
      </StyledCard>
    </div>
  );
};

export default PeopleChart;
