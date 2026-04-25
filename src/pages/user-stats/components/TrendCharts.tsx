/**
 * 趋势图表组件
 * 左侧：近 7 日活跃用户趋势（迷你折线图）
 * 右侧：时段分布（迷你柱状图）
 */

import React from 'react';
import { Card, Row, Col } from 'antd';
import { MiniArea, MiniColumn } from '@ant-design/charts';
import type { TrendDataPoint, HourlyDataPoint } from '@/services';

interface TrendChartsProps {
  trendData: TrendDataPoint[];
  hourlyData: HourlyDataPoint[];
  loading?: boolean;
}

const TrendCharts: React.FC<TrendChartsProps> = ({
  trendData,
  hourlyData,
  loading,
}) => {
  // 折线图配置
  const trendConfig = {
    data: trendData,
    xField: 'date',
    yField: 'value',
    height: 120,
    smooth: true,
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    },
    line: {
      color: '#1890ff',
      size: 2,
    },
  };

  // 柱状图配置
  const hourlyConfig = {
    data: hourlyData,
    xField: 'hour',
    yField: 'value',
    height: 120,
    columnStyle: {
      fill: '#1890ff',
      fillOpacity: 0.6,
    },
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card title="近 7 日活跃趋势" loading={loading}>
          <MiniArea {...trendConfig} />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="时段分布（24 小时）" loading={loading}>
          <MiniColumn {...hourlyConfig} />
        </Card>
      </Col>
    </Row>
  );
};

export default TrendCharts;
