/**
 * 指标卡片组件
 * 展示 4 个关键指标：今日活跃、本周活跃、总用户、平均在线时长
 */

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { UserStatsMetrics } from '@/services';

interface MetricsCardsProps {
  data: UserStatsMetrics;
  loading?: boolean;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ data, loading }) => {
  // 渲染趋势箭头和百分比
  const renderTrend = (value: number) => {
    const isPositive = value >= 0;
    const color = isPositive ? '#52c41a' : '#ff4d4f';
    const icon = isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
    return (
      <span style={{ color, fontSize: 14, marginLeft: 8 }}>
        {icon} {Math.abs(value)}%
      </span>
    );
  };

  const metrics = [
    {
      title: '今日活跃',
      value: data.todayActive,
      prefix: <UserOutlined />,
      suffix: renderTrend(data.todayActiveGrowth),
    },
    {
      title: '本周活跃',
      value: data.weekActive,
      prefix: <UserOutlined />,
      suffix: renderTrend(data.weekActiveGrowth),
    },
    {
      title: '总注册用户',
      value: data.totalUsers,
      prefix: <UserOutlined />,
      suffix: renderTrend(data.totalGrowth),
    },
    {
      title: '平均在线时长',
      value: data.avgOnlineTime,
      prefix: <ClockCircleOutlined />,
      suffix: (
        <>
          {renderTrend(data.avgOnlineGrowth)} 分钟
        </>
      ),
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {metrics.map((metric, index) => (
        <Col xs={12} sm={12} lg={6} key={index}>
          <Card>
            <Statistic
              title={metric.title}
              value={metric.value}
              prefix={metric.prefix}
              suffix={metric.suffix}
              loading={loading}
              valueStyle={{ fontSize: 24 }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default MetricsCards;
