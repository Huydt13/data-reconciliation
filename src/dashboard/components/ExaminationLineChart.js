import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Dimmer, Form, Loader } from 'semantic-ui-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardDatePicker } from 'app/components/shared';
import moment from 'moment';
import { getExaminationSummaryByRange } from 'dashboard/actions/dashboard';

const StyledCard = styled(Card)`
  width: auto !important;
`;

const StyledDiv = styled.div`
  min-height: 530px;
  position: relative;
`;

const ChartXAxisTick = (props) => {
  const { x, y, payload } = props;
  const date = payload.value.split(' ')[0];
  const hour = payload.value.split(' ')[1];
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-50)"
      >
        {date}
      </text>
      <text
        x={-10}
        y={15}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-50)"
      >
        {hour}
      </text>
    </g>
  );
};

ChartXAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.shape({
    value: PropTypes.string,
  }),
};

ChartXAxisTick.defaultProps = {
  x: 0,
  y: 0,
  payload: {
    value: '',
  },
};

const ExaminationLineChart = () => {
  const {
    loadingGetExaminationSummaryByRange,
    examinationSummaryByRange,
  } = useSelector((state) => state.dashboard);

  const [domain, setDomain] = useState([0, 'auto']);

  useEffect(() => {
    const max = Math.max(...((examinationSummaryByRange || []).map((d) => d.value)));
    const ceilMax = Math.ceil(max / 10) * 10;
    setDomain([0, ceilMax]);
  }, [examinationSummaryByRange]);

  const [from, setFrom] = useState(moment().subtract(7, 'days'));
  const [to, setTo] = useState(moment());
  const dispatch = useDispatch();
  const handleRefresh = () => {
    dispatch(getExaminationSummaryByRange(
      moment(from).format('YYYY-MM-DD'),
      moment(to).format('YYYY-MM-DD'),
    ));
  };

  // eslint-disable-next-line
  useEffect(() => { handleRefresh(); }, [
    from,
    to,
  ]);

  return (
    <div>
      <StyledCard className="line-chart">
        <Card.Header textAlign="center" content="Tổng số lượng lấy mẫu theo ngày" />
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
              disabledDays={[{
                after: new Date(),
                before: new Date(from),
              }]}
              onChange={setTo}
            />
          </Form.Group>
        </div>
        {!loadingGetExaminationSummaryByRange ? (
          <ResponsiveContainer width="100%" aspect={4.0 / 3.0}>
            <LineChart
              data={examinationSummaryByRange}
              margin={{
                top: 40,
                right: 40,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                padding={{
                  left: 40,
                  right: 40,
                }}
                height={100}
                tick={<ChartXAxisTick />}
              />
              <YAxis domain={domain} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                name="Mẫu"
                dataKey="value"
                stroke="#FE9A76"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <StyledDiv>
            <Dimmer inverted active>
              <Loader />
            </Dimmer>
          </StyledDiv>
        )}
      </StyledCard>
    </div>
  );
};

export default ExaminationLineChart;
