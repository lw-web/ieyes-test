/**
 * 计数器 Demo 页面
 * 展示 UmiJS Model 数据流管理
 */

import React, { FC, useState } from 'react';
import { Card, Button, Space, Divider, Input, Row, Col, message } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
// @ts-ignore
import { useModel } from 'umi';
import PageLayout from '@/components/PageLayout';
import './index.less';

// 计数器显示组件
const CounterDisplay: FC<{ value: number; onChange?: (value: number) => void }> = ({
  value,
}) => {
  const getDisplayColor = () => {
    if (value > 0) return '#52c41a';
    if (value < 0) return '#ff4d4f';
    return '#1890ff';
  };

  return (
    <div className="counter-display">
      <div className="counter-value" style={{ color: getDisplayColor() }}>
        {value}
      </div>
      <div className="counter-label">当前计数</div>
    </div>
  );
};

// 操作按钮组件
const ActionButtons: FC<{
  onIncrement: (step: number) => void;
  onDecrement: (step: number) => void;
  onReset: () => void;
  stepValue: number;
}> = ({ onIncrement, onDecrement, onReset, stepValue }) => {
  return (
    <Space className="action-buttons" size="middle">
      <Button
        type="primary"
        size="large"
        icon={<PlusOutlined />}
        onClick={() => onIncrement(1)}
        className="action-btn action-btn--primary"
      >
        加 1
      </Button>
      <Button
        size="large"
        icon={<MinusOutlined />}
        onClick={() => onDecrement(1)}
        className="action-btn"
      >
        减 1
      </Button>
      <Button
        danger
        size="large"
        icon={<ReloadOutlined />}
        onClick={onReset}
        className="action-btn action-btn--danger"
      >
        重置
      </Button>
    </Space>
  );
};

// 步长控制组件
const StepControl: FC<{
  stepValue: number;
  onChange: (value: number) => void;
  onIncrement: (step: number) => void;
  onDecrement: (step: number) => void;
}> = ({ stepValue, onChange, onIncrement, onDecrement }) => {
  return (
    <Card className="control-card" title="自定义步长">
      <Space size="large">
        <Input
          type="number"
          placeholder="步长"
          value={stepValue}
          onChange={(e) => {
            const value = Number(e.target.value);
            onChange(Number.isNaN(value) ? 1 : value);
          }}
          className="step-input"
          min={1}
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => onIncrement(stepValue)}
        >
          增加 {stepValue}
        </Button>
        <Button
          type="dashed"
          icon={<MinusOutlined />}
          onClick={() => onDecrement(stepValue)}
        >
          减少 {stepValue}
        </Button>
      </Space>
    </Card>
  );
};

// 异步操作组件
const AsyncAction: FC<{
  stepValue: number;
  onAsyncAdd: (value: number) => void;
}> = ({ stepValue, onAsyncAdd }) => {
  const [loading, setLoading] = useState(false);

  const handleAsyncClick = () => {
    setLoading(true);
    const hide = message.loading('正在处理...', 0);

    setTimeout(() => {
      hide();
      setLoading(false);
      onAsyncAdd(stepValue);
      message.success('异步增加成功！');
    }, 1000);
  };

  return (
    <Card className="control-card" title="异步操作（模拟 API 调用）">
      <Button
        type="primary"
        ghost
        size="large"
        icon={<ThunderboltOutlined />}
        onClick={handleAsyncClick}
        loading={loading}
        className="async-btn"
      >
        异步增加 {stepValue}
      </Button>
    </Card>
  );
};

// 使用说明组件
const UsageGuide: FC = () => {
  return (
    <Card className="guide-card" title="使用说明">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <div className="guide-item">
            <div className="guide-icon">🎯</div>
            <div className="guide-content">
              <h4>基础操作</h4>
              <p>点击按钮增加或减少计数值</p>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className="guide-item">
            <div className="guide-icon">📏</div>
            <div className="guide-content">
              <h4>自定义步长</h4>
              <p>输入自定义步长值，按指定数值增加或减少</p>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className="guide-item">
            <div className="guide-icon">⚡</div>
            <div className="guide-content">
              <h4>异步操作</h4>
              <p>模拟异步 API 调用，延迟 1 秒后更新状态</p>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className="guide-item">
            <div className="guide-icon">🔄</div>
            <div className="guide-content">
              <h4>状态共享</h4>
              <p>状态存储在 Model 中，可在多个组件间共享</p>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

// 页面组件
const CounterPage: FC = () => {
  const { num, setNum } = useModel('counter');
  const [stepValue, setStepValue] = useState(1);

  const increment = (step: number = 1) => {
    setNum(num + step);
  };

  const decrement = (step: number = 1) => {
    setNum(num - step);
  };

  const reset = () => {
    setNum(0);
    message.info('计数器已重置');
  };

  const asyncAdd = (value: number) => {
    setNum(num + value);
  };

  return (
    <PageLayout
      title="UmiJS Model 数据流 - 计数器 Demo"
      description="本示例展示如何使用 UmiJS 的 useModel Hook 方案实现状态管理。数据存储在 src/models/counter.ts 中，通过 Hook 获取状态和修改方法。"
      breadcrumbs={[{ label: '计数器 Demo' }]}
    >
      <Row gutter={[24, 24]}>
        {/* 计数器主卡片 */}
        <Col xs={24} lg={12}>
          <Card className="counter-main-card">
            <CounterDisplay value={num} />
            <Divider className="counter-divider" />
            <ActionButtons
              onIncrement={increment}
              onDecrement={decrement}
              onReset={reset}
              stepValue={stepValue}
            />
          </Card>
        </Col>

        {/* 控制面板 */}
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <StepControl
              stepValue={stepValue}
              onChange={setStepValue}
              onIncrement={increment}
              onDecrement={decrement}
            />
            <AsyncAction stepValue={stepValue} onAsyncAdd={asyncAdd} />
          </Space>
        </Col>
      </Row>

      {/* 使用说明 */}
      <UsageGuide />
    </PageLayout>
  );
};

export default CounterPage;
