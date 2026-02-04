import React, { FC } from 'react';
import {
  Card,
  Button,
  Space,
  Statistic,
  Row,
  Col,
  Typography,
  Divider,
  Input,
  message,
} from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
// @ts-ignore
import { useModel } from 'umi';

const { Title, Paragraph } = Typography;

// 独立的计数器组件
interface CounterWidgetProps {
  count: number;
  onIncrement: (step?: number) => void;
  onDecrement: (step?: number) => void;
  onReset: () => void;
  onAsyncAdd: (value: number) => void;
}

const CounterWidget: FC<CounterWidgetProps> = ({
  count,
  onIncrement,
  onDecrement,
  onReset,
  onAsyncAdd,
}) => {
  const [stepValue, setStepValue] = React.useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setStepValue(Number.isNaN(value) ? 1 : value);
  };

  return (
    <Card
      title="计数器组件"
      extra={
        <Button type="primary" danger icon={<ReloadOutlined />} onClick={onReset}>
          重置
        </Button>
      }
    >
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Statistic
            title="当前计数"
            value={count}
            valueStyle={{ color: count > 0 ? '#3f8600' : count < 0 ? '#cf1322' : '#1890ff' }}
          />
        </Col>
      </Row>

      <Divider />

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 基础操作 */}
        <div>
          <Paragraph strong>基础操作：</Paragraph>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => onIncrement(1)}
              size="large"
            >
              加 1
            </Button>
            <Button icon={<MinusOutlined />} onClick={() => onDecrement(1)} size="large">
              减 1
            </Button>
          </Space>
        </div>

        {/* 自定义步长 */}
        <div>
          <Paragraph strong>自定义步长：</Paragraph>
          <Space>
            <Input
              type="number"
              placeholder="步长"
              value={stepValue}
              onChange={handleInputChange}
              style={{ width: 100 }}
            />
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => onIncrement(stepValue)}>
              增加 {stepValue}
            </Button>
            <Button type="dashed" icon={<MinusOutlined />} onClick={() => onDecrement(stepValue)}>
              减少 {stepValue}
            </Button>
          </Space>
        </div>

        {/* 异步操作 */}
        <div>
          <Paragraph strong>异步操作 (模拟 API 调用)：</Paragraph>
          <Space>
            <Button
              type="primary"
              ghost
              icon={<ThunderboltOutlined />}
              onClick={() => {
                const hide = message.loading('正在处理...', 0);
                setTimeout(() => {
                  hide();
                  onAsyncAdd(stepValue);
                  message.success('异步增加成功！');
                }, 500);
              }}
            >
              异步增加 {stepValue}
            </Button>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

// 页面组件
const CounterPage: FC = () => {
  const { num, setNum } = useModel('counter');

  const increment = (step: number = 1) => {
    setNum(num + step);
  };

  const decrement = (step: number = 1) => {
    setNum(num - step);
  };

  const reset = () => {
    setNum(0);
  };

  const asyncAdd = (value: number) => {
    setTimeout(() => {
      setNum(num + value);
    }, 1000);
  };

  return (
    <div className="counter-page">
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
        <Card style={{ marginBottom: 16 }}>
          <Title level={2}>UmiJS Model 数据流 - 计数器 Demo</Title>
          <Paragraph>
            本示例展示如何使用 UmiJS 的 <code>useModel</code> Hook 方案实现状态管理。数据存储在{' '}
            <code>src/models/counter.ts</code> 中，通过 Hook 获取状态和修改方法。
          </Paragraph>
        </Card>

        <CounterWidget
          count={num}
          onIncrement={increment}
          onDecrement={decrement}
          onReset={reset}
          onAsyncAdd={asyncAdd}
        />

        <Card title="使用说明" style={{ marginTop: 16 }}>
          <ul>
            <li>
              <strong>基础操作</strong>：点击按钮增加或减少计数值
            </li>
            <li>
              <strong>自定义步长</strong>：输入自定义步长值，按指定数值增加或减少
            </li>
            <li>
              <strong>异步操作</strong>：模拟异步 API 调用，延迟 1 秒后更新状态
            </li>
            <li>
              <strong>状态共享</strong>：状态存储在 Model 中，可在多个组件间共享
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default CounterPage;
