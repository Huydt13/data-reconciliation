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
import { getExaminationDetailStatistic } from 'dashboard/actions/dashboard';

import moment from 'moment';
import styled from 'styled-components';
import { Card, Dimmer, Form, Loader, Responsive } from 'semantic-ui-react';
import { KeyboardDatePicker } from 'app/components/shared';

const StyledCard = styled(Card)`
  width: auto !important;
  padding-bottom: 20px !important;
`;

const ExaminationDetailChart = () => {
  const {
    getExaminationDetailStatisticLoading,
    examinationDetailStatistic: data,
  } = useSelector((s) => s.dashboard);

  const [from, setFrom] = useState(moment().subtract(7, 'days'));
  const [to, setTo] = useState(moment());
  const dispatch = useDispatch();
  const handleRefresh = () => {
    dispatch(
      getExaminationDetailStatistic(
        moment(from).format('YYYY-MM-DD'),
        moment(to).format('YYYY-MM-DD'),
      ),
    );
  };

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, [from, to]);

  const getWidth = () =>
    typeof window === 'undefined'
      ? Responsive.onlyTablet.minWidth
      : window.innerWidth;
  return (
    <div style={{ marginTop: getWidth() < 768 ? '20px' : '' }}>
      <StyledCard className="examination-detail-chart">
        <Card.Header
          textAlign="center"
          content="Thống kê theo mẫu xét nghiệm"
        />
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
        {getExaminationDetailStatisticLoading && (
          <Dimmer inverted active>
            <Loader />
          </Dimmer>
        )}
        <ResponsiveContainer width="100%" aspect={4.0 / 3.0}>
          <BarChart
            data={data.map((d) => ({
              ...d,
              'Số lượng mẫu bệnh phẩm đã nhận': d.received,
              'Số lượng mẫu đang chờ xét nghiệm': d.waiting,
              date: moment(d.date).format('DD-MM-YYYY'),
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
            <Bar
              stackId="a"
              dataKey="Số lượng mẫu bệnh phẩm đã nhận"
              fill="#ffa600"
            />
            <Bar
              stackId="a"
              dataKey="Số lượng mẫu đang chờ xét nghiệm"
              fill="#003f5c"
            />
          </BarChart>
        </ResponsiveContainer>
      </StyledCard>
    </div>
  );
};

export default ExaminationDetailChart;
