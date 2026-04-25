/**
 * 趋势图表组件
 * 左侧：近 7 日活跃用户趋势（简化版）
 * 右侧：时段分布（简化版）
 * 使用 CSS 实现简单图表，避免 @ant-design/charts 的 React 18 依赖
 */

import React from 'react';
import { Card, Row, Col } from 'antd';
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
  // 计算最大值用于缩放
  const maxTrendValue = Math.max(...trendData.map(d => d.value), 1);
  const maxHourlyValue = Math.max(...hourlyData.map(d => d.value), 1);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card title="近 7 日活跃趋势" loading={loading}>
          <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            {trendData.map((item, index) => {
              const heightPercent = (item.value / maxTrendValue) * 80;
              return (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${heightPercent}%`,
                      background: 'linear-gradient(180deg, #7ec2f3 0%, #1890ff 100%)',
                      borderRadius: '4px 4px 0 0',
                      minHeight: 4,
                      transition: 'height 0.3s',
                    }}
                  />
                  <div style={{ fontSize: 10, marginTop: 4, color: '#666' }}>
                    {item.date}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="时段分布（24 小时）" loading={loading}>
          <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
            {hourlyData.map((item, index) => {
              const heightPercent = (item.value / maxHourlyValue) * 80;
              return (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    height: `${heightPercent}%`,
                    background: '#1890ff',
                    opacity: 0.6,
                    borderRadius: '2px 2px 0 0',
                    minHeight: 2,
                    transition: 'height 0.3s',
                  }}
                  title={`${item.hour}:00 - ${item.value} 活跃用户`}
                />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10 }}>0:00</span>
            <span style={{ fontSize: 10 }}>12:00</span>
            <span style={{ fontSize: 10 }}>23:00</span>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default TrendCharts;
