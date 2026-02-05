/**
 * 首页 - 项目介绍和 Demo 导航
 */

import React, { useEffect, useRef } from 'react';
import { Card, Button, DatePicker, Space, Statistic, Row, Col, Typography, Tag } from 'antd';
import { Link } from 'umi';
import { Chart } from '@antv/g2';
import type { Chart as G2Chart } from '@antv/g2';
import {
  ThunderboltOutlined,
  ApiOutlined,
  TableOutlined,
  ArrowRightOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import PageLayout from '@/components/PageLayout';
import './index.less';

const { Text } = Typography;

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
    <PageLayout
      showBack={false}
      title="UmiJS 3.5 + TypeScript + Ant Design 5 + AntV G2"
      description="这是一个使用 UmiJS 3.5.41、TypeScript 4.1.2、Ant Design 5.27.0、AntV G2 5.4.8 初始化的项目模板"
      className="gradient-header"
    >
      {/* Demo 页面菜单 */}
      <div className="demo-section">
        <div className="section-header">
          <h3 className="section-title">Demo 页面</h3>
          <p className="section-subtitle">选择以下示例页面查看功能演示</p>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Link to="/counter-demo" className="demo-card-link">
              <Card hoverable className="demo-card demo-card--purple">
                <div className="demo-card-icon">
                  <ThunderboltOutlined />
                </div>
                <h4 className="demo-card-title">计数器 Demo</h4>
                <p className="demo-card-subtitle">UmiJS Model 数据流</p>
                <p className="demo-card-desc">
                  展示如何使用 useModel Hook 实现状态管理，包含基础操作、自定义步长、异步操作等功能
                </p>
                <div className="demo-card-tags">
                  <Tag color="blue">状态管理</Tag>
                  <Tag color="cyan">React Hooks</Tag>
                </div>
                <div className="demo-card-arrow">
                  <ArrowRightOutlined />
                </div>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Link to="/api-demo" className="demo-card-link">
              <Card hoverable className="demo-card demo-card--green">
                <div className="demo-card-icon">
                  <ApiOutlined />
                </div>
                <h4 className="demo-card-title">API 请求 Demo</h4>
                <p className="demo-card-subtitle">Fetch 封装示例</p>
                <p className="demo-card-desc">
                  演示封装的 fetch 请求方法，包含登录、CRUD 操作、统一错误处理等功能
                </p>
                <div className="demo-card-tags">
                  <Tag color="green">HTTP 请求</Tag>
                  <Tag color="purple">TypeScript</Tag>
                </div>
                <div className="demo-card-arrow">
                  <ArrowRightOutlined />
                </div>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Link to="/table-demo" className="demo-card-link">
              <Card hoverable className="demo-card demo-card--blue">
                <div className="demo-card-icon">
                  <TableOutlined />
                </div>
                <h4 className="demo-card-title">ProTable Demo</h4>
                <p className="demo-card-subtitle">高级表格组件</p>
                <p className="demo-card-desc">
                  企业级表格组件，支持分页、搜索、筛选、排序、列配置、列宽拖拽等功能
                </p>
                <div className="demo-card-tags">
                  <Tag color="orange">表格组件</Tag>
                  <Tag color="red">Ant Design</Tag>
                </div>
                <div className="demo-card-arrow">
                  <ArrowRightOutlined />
                </div>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={12} sm={6}>
          <Card className="stat-card stat-card--up">
            <Statistic
              title="总访问量"
              value={11280}
              suffix="次"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card stat-card--up">
            <Statistic
              title="用户数"
              value={932}
              suffix="人"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card stat-card--down">
            <Statistic
              title="转化率"
              value={23.5}
              suffix="%"
              prefix={<FallOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card stat-card--up">
            <Statistic
              title="收入"
              value={9820}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表卡片 */}
      <Card
        title="数据趋势图 (AntV G2)"
        className="chart-card"
        extra={
          <Space>
            <DatePicker.RangePicker />
            <Button type="primary" onClick={handleRefresh}>
              刷新数据
            </Button>
          </Space>
        }
      >
        <div ref={chartRef} className="chart-container" />
      </Card>

      {/* 组件展示 */}
      <Card title="组件展示" className="component-showcase">
        <Space wrap>
          <Button type="primary">主要按钮</Button>
          <Button>默认按钮</Button>
          <Button type="dashed">虚线按钮</Button>
          <Button type="link">链接按钮</Button>
          <Button danger>危险按钮</Button>
        </Space>
      </Card>
    </PageLayout>
  );
};

export default IndexPage;
