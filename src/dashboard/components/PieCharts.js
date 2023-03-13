/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Dimmer, Loader } from 'semantic-ui-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { useSelector } from 'react-redux';
import { colors } from 'general/utils/constants';

const RelativeDiv = styled.div`
  min-height: 530px;
  position: relative;
`;

const StyledCard = styled(Card)`
  width: auto !important;
  padding-top: 8px;
  padding-bottom: 50px !important;
`;

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  if (percent !== 0) {
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {`Số ca: ${value}`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(Tỉ lệ: ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  }
  return null;
};

const PieCharts = () => {
  const { chainsSummariesData, getChainsSummariesLoading } = useSelector(
    (state) => state.dashboard,
  );
  const [data, setData] = useState([]);

  useEffect(() => {
    if (chainsSummariesData.summaryDetails.length) {
      setData(
        chainsSummariesData.summaryDetails.map((d, index) => ({
          key: index,
          name: d.infectionType.name,
          color: colors.find((c) => c.en === d.infectionType.colorCode)?.hex,
          value: d.total,
        })),
      );
    }
  }, [chainsSummariesData]);

  return (
    <>
      <StyledCard>
        {!getChainsSummariesLoading ? (
          <ResponsiveContainer width="100%" height="100%" aspect={5.0 / 3.0}>
            <PieChart>
              <Pie
                activeIndex={[0, 1, 2, 3]}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="60%"
                dataKey="value"
              >
                {data.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <RelativeDiv>
            <Dimmer inverted active={getChainsSummariesLoading}>
              <Loader />
            </Dimmer>
          </RelativeDiv>
        )}
      </StyledCard>
    </>
  );
};

renderActiveShape.propTypes = {
  payload: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

export default PieCharts;
