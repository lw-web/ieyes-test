import React, { useEffect, useRef } from 'react';
import { Card, Button, DatePicker, Space, Statistic, Row, Col, Typography } from 'antd';
import { Chart } from '@antv/g2';
import type { Chart as G2Chart } from '@antv/g2';
import './index.less';

const { Title, Paragraph } = Typography;

interface DataItem {
  date: string;
  value: number;
}

const IndexPage: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<G2Chart | null>(null);

  // 生成示例数据
  const data: DataItem[] = [];
  for (let i = 1; i <= 12; i++) {
    data.push({
      date: `${i}月`,
      value: Math.floor(Math.random() * 1000) + 500,
    });
  }

  useEffect(() => {
    if (chartRef.current) {
      // 初始化图表
      chartInstance.current = new Chart({
        container: chartRef.current,
        autoFit: true,
        height: 300,
      });

      chartInstance.current
        .data(data)
        .encode('x', 'date')
        .encode('y', 'value')
        .scale('y', { nice: true });

      chartInstance.current.interval().tooltip({ title: 'date', items: ['value'] });

      chartInstance.current.render();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const handleRefresh = () => {
    if (chartInstance.current) {
      // 更新数据
      const newData: DataItem[] = [];
      for (let i = 1; i <= 12; i++) {
        newData.push({
          date: `${i}月`,
          value: Math.floor(Math.random() * 1000) + 500,
        });
      }
      chartInstance.current.changeData(newData);
    }
  };

  return (
    <div className="index-page">
      <div className="header">
        <Title level={2}>UmiJS 3.5 + TypeScript + Ant Design 5 + AntV G2</Title>
        <Paragraph>
          这是一个使用 UmiJS 3.5.41、TypeScript 4.1.2、Ant Design 5.27.0、AntV G2 5.4.8
          初始化的项目模板
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总访问量" value={11280} suffix="次" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="用户数" value={932} suffix="人" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="转化率" value={23.5} suffix="%" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="收入" value={9820} prefix="¥" />
          </Card>
        </Col>
      </Row>

      <Card
        title="数据趋势图 (AntV G2)"
        extra={
          <Space>
            <DatePicker.RangePicker />
            <Button type="primary" onClick={handleRefresh}>
              刷新数据
            </Button>
          </Space>
        }
        style={{ marginTop: 16 }}
      >
        <div ref={chartRef} />
      </Card>

      <Card title="组件展示" style={{ marginTop: 16 }}>
        <Space>
          <Button type="primary">主要按钮</Button>
          <Button>默认按钮</Button>
          <Button type="dashed">虚线按钮</Button>
          <Button type="link">链接按钮</Button>
          <Button danger>危险按钮</Button>
        </Space>
      </Card>
    </div>
  );
};

export default IndexPage;
