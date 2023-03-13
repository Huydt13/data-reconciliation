/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { Card, Dimmer, Loader } from 'semantic-ui-react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

import { colors } from 'general/utils/constants';
import _ from 'lodash';

const StyledCard = styled(Card)`
  width: auto !important;
  padding-top: 8px;
  padding-bottom: 60px !important;
`;

const RelativeDiv = styled.div`
  min-height: 530px;
  position: relative;
`;

const BarCharts = () => {
  const { chainsSummariesData, getChainsSummariesLoading } = useSelector(
    (state) => state.dashboard,
  );
  const [data, setData] = useState([]);
  const domain = [
    0,
    Math.floor(
      Math.max(...chainsSummariesData.summaryDetails.map((d) => d.total)) / 10 +
        1,
    ) * 10,
  ];

  useEffect(() => {
    if (chainsSummariesData.summaryDetails.length) {
      setData(
        _.orderBy(
          chainsSummariesData.summaryDetails,
          [
            (item) => item.infectionType.level,
            (item) => item.infectionType.value,
          ],
          ['asc', 'asc'],
        ).map((d, index) => ({
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
          <ResponsiveContainer width="100%" aspect={5.0 / 3.0}>
            <BarChart
              data={data}
              margin={{
                top: 40,
                right: 20,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={domain} tickCount={11} />
              <Tooltip />
              <Bar name="Số ca" dataKey="value">
                {data.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <RelativeDiv>
            <Dimmer inverted active={getChainsSummariesLoading}>
              <Loader />
            </Dimmer>
          </RelativeDiv>
        )}
        {/* <StyledDiv>
          {subjectTypeList.map((e, i) => {
            if (i <= 3) {
              return (
                <FlexDiv key={e.hex}>
                  <div
                    style={{
                      color: e.hex,
                      paddingRight: '5px',
                      paddingTop: '3px',
                    }}
                  >
                    <FiBarChart2 />
                  </div>
                  <span>{`Số ca ${e.label}`}</span>
                </FlexDiv>
              );
            }
            return '';
          })}
        </StyledDiv> */}
      </StyledCard>
    </>
  );
};

export default BarCharts;
