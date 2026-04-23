/**
 * FigJam 组件 Demo 页面
 * 演示表情轮盘、印章选择器等交互组件
 */

import React, { FC, useState } from 'react';
import { Card, Row, Col, Typography, Space, Badge } from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  FireOutlined,
  StarFilled,
  StarOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  LikeOutlined,
  LikeFilled,
  SmileOutlined,
  SmileFilled,
  FrownOutlined,
  MehOutlined,
  ThunderboltOutlined,
  EyeFilled,
} from '@ant-design/icons';
import PageLayout from '@/components/PageLayout';
import EmoteWheel from './components/EmoteWheel';
import StampWheel from './components/StampWheel';
import EmoteGrid from './components/EmoteGrid';
import FlowChart from './components/FlowChart';
import './index.less';

const { Title, Text } = Typography;

const FigJamDemoPage: FC = () => {
  const [selectedEmote, setSelectedEmote] = useState<string>('');
  const [selectedStamp, setSelectedStamp] = useState<string>('');

  const emotes = [
    { id: 'love', icon: <HeartFilled />, label: 'Love', color: '#ff4d4f' },
    { id: 'fire', icon: <FireOutlined />, label: 'Flame', color: '#ff7a45' },
    { id: 'star', icon: <StarFilled />, label: 'Star', color: '#faad14' },
    { id: 'surprise', icon: <SmileFilled />, label: 'Surprise', color: '#52c41a' },
    { id: 'laugh', icon: <MehOutlined />, label: 'Laugh', color: '#1890ff' },
    { id: 'sad', icon: <FrownOutlined />, label: 'Sad', color: '#722ed1' },
  ];

  const stamps = [
    { id: 'heart', icon: <HeartOutlined />, label: 'Heart', color: '#ff4d4f' },
    { id: 'star', icon: <StarOutlined />, label: 'Star', color: '#faad14' },
    { id: 'check', icon: <CheckCircleOutlined />, label: '+1', color: '#52c41a' },
    { id: 'question', icon: <QuestionCircleOutlined />, label: '?', color: '#1890ff' },
    { id: 'thumbsup', icon: <LikeOutlined />, label: 'Thumbs up', color: '#722ed1' },
    { id: 'fire', icon: <FireOutlined />, label: 'Fire', color: '#ff7a45' },
  ];

  return (
    <PageLayout
      title="FigJam 组件 Demo"
      description="本页面演示 FigJam 风格的交互组件，包含表情轮盘、印章选择器等"
      breadcrumbs={[{ label: 'FigJam Demo' }]}
    >
      {/* 欢迎卡片 */}
      <Card className="welcome-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2} className="welcome-title">
            Welcome to FigJam~
          </Title>
          <Text type="secondary">互动协作组件库演示</Text>
          {selectedEmote && (
            <div className="selected-item">
              <Badge color={emotes.find(e => e.id === selectedEmote)?.color} />
              <Text>已选择表情: {emotes.find(e => e.id === selectedEmote)?.label}</Text>
            </div>
          )}
          {selectedStamp && (
            <div className="selected-item">
              <Badge color={stamps.find(s => s.id === selectedStamp)?.color} />
              <Text>已选择印章: {stamps.find(s => s.id === selectedStamp)?.label}</Text>
            </div>
          )}
        </Space>
      </Card>

      {/* 轮盘组件 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <SmileOutlined />
                表情轮盘 (Emote Wheel)
              </Space>
            }
            className="wheel-card"
          >
            <EmoteWheel items={emotes} onSelect={setSelectedEmote} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <StarFilled />
                印章轮盘 (Stamp Wheel)
              </Space>
            }
            className="wheel-card"
          >
            <StampWheel items={stamps} onSelect={setSelectedStamp} />
          </Card>
        </Col>
      </Row>

      {/* 表情网格 */}
      <Card
        title={
          <Space>
            <ThunderboltOutlined />
            表情网格 (Emote Grid)
          </Space>
        }
      >
        <EmoteGrid items={emotes} />
      </Card>

      {/* 流程图 */}
      <Card
        title={
          <Space>
            <EyeFilled />
            流程图 (Flow Chart)
          </Space>
        }
      >
        <FlowChart />
      </Card>

      {/* 使用说明 */}
      <Card title="使用说明" className="usage-card">
        <Space direction="vertical" size="middle">
          <div>
            <Text strong>1. 表情轮盘：</Text>
            <br />
            <Text type="secondary">
              点击轮盘上的表情图标即可选择，支持 6 种常用表情（Love、Flame、Star、Surprise、Laugh、Sad）
            </Text>
          </div>
          <div>
            <Text strong>2. 印章轮盘：</Text>
            <br />
            <Text type="secondary">
              点击轮盘上的印章图标即可选择，支持 6 种印章（Heart、Star、+1、?、Thumbs up、Fire）
            </Text>
          </div>
          <div>
            <Text strong>3. 表情网格：</Text>
            <br />
            <Text type="secondary">网格布局展示所有表情，支持悬停和点击交互</Text>
          </div>
          <div>
            <Text strong>4. 流程图：</Text>
            <br />
            <Text type="secondary">使用 CSS 实现的简单流程图组件，展示节点和连接线</Text>
          </div>
        </Space>
      </Card>
    </PageLayout>
  );
};

export default FigJamDemoPage;
