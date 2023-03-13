/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { Card, Dimmer, Loader, Responsive } from 'semantic-ui-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Sector,
} from 'recharts';
import { FiPieChart } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const RelativeDiv = styled.div`
  min-height: 530px;
  position: relative;
`;

const StyledCard = styled(Card)`
  width: auto !important;
  padding-top: 8px;
  padding-bottom: 75px !important;
`;

const StyledDiv = styled.div`
  position: absolute;
  top: 90%;
  left: 53%;
  width: 100%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
`;

const FlexDiv = styled.div`
  display: flex;
  padding-right: 10px;
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
        {`Số mẫu: ${value}`}
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
};

const ExaminationGroupedPieChart = () => {
  const { getGroupedExamDetailLoading, groupedExamDetail } = useSelector(
    (state) => state.dashboard,
  );

  const getWidth = () =>
    typeof window === 'undefined'
      ? Responsive.onlyTablet.minWidth
      : window.innerWidth;

  return (
    <div style={{ marginTop: getWidth() < 768 ? '20px' : '' }}>
      <StyledCard>
        <Card.Header textAlign="center" content="Thống kê mẫu gộp" />
        {!getGroupedExamDetailLoading ? (
          <ResponsiveContainer width="100%" aspect={4.0 / 3.0}>
            <PieChart>
              <Pie
                activeIndex={[0, 1]}
                activeShape={renderActiveShape}
                data={[
                  {
                    name: 'Mẫu thường',
                    value: groupedExamDetail.find((e) => !e.key)?.count,
                  },
                  {
                    name: 'Mẫu gộp',
                    value: groupedExamDetail.find((e) => e.key)?.count,
                  },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={getWidth() <= 425 ? '20%' : '40%'}
                outerRadius={getWidth() <= 425 ? '25%' : '50%'}
                dataKey="value"
              >
                <Cell fill="#435E55FF" />
                <Cell fill="#D64161FF" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <RelativeDiv>
            <Dimmer inverted active>
              <Loader />
            </Dimmer>
          </RelativeDiv>
        )}
        <StyledDiv>
          <FlexDiv>
            <div
              style={{
                color: '#435E55FF',
                paddingRight: '5px',
                paddingTop: '3px',
              }}
            >
              <FiPieChart />
            </div>
            <span>Mẫu thường</span>
          </FlexDiv>
          <FlexDiv>
            <div
              style={{
                color: '#D64161FF',
                paddingRight: '5px',
                paddingTop: '3px',
              }}
            >
              <FiPieChart />
            </div>
            <span>Mẫu gộp</span>
          </FlexDiv>
        </StyledDiv>
      </StyledCard>
    </div>
  );
};

export default ExaminationGroupedPieChart;
