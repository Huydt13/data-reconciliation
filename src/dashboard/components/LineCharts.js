import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import _ from 'lodash';

import { Card, Dimmer, Loader } from 'semantic-ui-react';
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
import { useSelector } from 'react-redux';
import { colors } from 'general/utils/constants';

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

const LineCharts = () => {
  const { chainsSummariesByRangeData, getChainsSummariesByRangeLoading } =
    useSelector((state) => state.dashboard);

  const [data, setData] = useState([]);
  useEffect(() => {
    setData(
      chainsSummariesByRangeData.map((range) => ({
        date: range.date,
        ...range.summaryDetails.reduce((acc, d) => {
          acc[d.infectionType.name] = d.total;
          acc[`${d.infectionType.name}color`] = d.infectionType.colorCode;
          return acc;
        }, {}),
      })),
    );
  }, [chainsSummariesByRangeData]);

  const domain = [
    0,
    Math.floor(
      Math.max(
        ..._.flattenDeep(
          chainsSummariesByRangeData.map((s) =>
            s.summaryDetails.map((d) => d.total),
          ),
        ),
      ) /
        10 +
        1,
    ) * 10,
  ];
  return (
    <div>
      <StyledCard className="line-chart">
        {!getChainsSummariesByRangeLoading ? (
          <ResponsiveContainer width="100%" aspect={3.0 / 2.7}>
            <LineChart
              data={data}
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
              <YAxis domain={domain} tickCount={11} />
              <Tooltip />
              <Legend />
              {Object.keys(_.omit(...data, ['date'])).map((key) => {
                if (key.includes('color')) {
                  const replaced = key.replace('color', '');
                  const stroke = colors.find(
                    (c) => c.en === _.omit(...data, ['date'])[key],
                  )?.hex;
                  return (
                    <Line
                      key={replaced}
                      type="monotone"
                      name={`Số có ${replaced}`}
                      dataKey={replaced}
                      stroke={stroke}
                      dot={false}
                    />
                  );
                }
                return null;
              })}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <StyledDiv>
            <Dimmer inverted active={getChainsSummariesByRangeLoading}>
              <Loader />
            </Dimmer>
          </StyledDiv>
        )}
      </StyledCard>
    </div>
  );
};

export default LineCharts;
