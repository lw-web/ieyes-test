# 用户活跃度统计页面实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标:** 创建一个展示用户活跃度数据的统计页面，包含指标卡片、趋势图表和详细数据表格。

**架构:** 单页面组件，采用上下分层布局（指标卡片 → 图表 → 表格）。模拟数据服务独立于组件，便于后续替换为真实 API。

**技术栈:** React + TypeScript, Ant Design 5.27, @ant-design/charts, UmiJS 3.5

---

## 文件结构

```
src/
├── services/
│   ├── types.ts                      # 修改：新增统计相关类型
│   └── mock-user-stats.ts            # 新建：模拟数据服务
├── pages/
│   └── user-stats/
│       ├── index.tsx                 # 新建：主页面组件
│       ├── index.less                # 新建：页面样式
│       ├── components/
│       │   ├── MetricsCards.tsx      # 新建：指标卡片组件
│       │   └── TrendCharts.tsx       # 新建：趋势图表组件
│       └── config.ts                 # 新建：表格列配置
└── .umirc.ts                         # 修改：添加路由配置
```

---

## Task 1: 添加类型定义

**文件:**
- 修改: `src/services/types.ts`

- [ ] **步骤 1: 在 types.ts 末尾添加统计相关类型**

在 `src/services/types.ts` 文件末尾（最后一个 enum 之后）添加以下类型定义：

```typescript
// 用户统计关键指标
export interface UserStatsMetrics {
  todayActive: number;        // 今日活跃
  todayActiveGrowth: number;  // 日环比 %
  weekActive: number;         // 本周活跃
  weekActiveGrowth: number;   // 周环比 %
  totalUsers: number;         // 总用户
  totalGrowth: number;        // 月增长率 %
  avgOnlineTime: number;      // 平均在线时长（分钟）
  avgOnlineGrowth: number;    // 日环比 %
}

// 趋势图数据点
export interface TrendDataPoint {
  date: string;   // 日期 "MM-DD"
  value: number;  // 活跃用户数
}

// 时段分布数据
export interface HourlyDataPoint {
  hour: number;   // 小时 0-23
  value: number;  // 活跃用户数
}

// 详细统计记录
export interface UserStatsRecord {
  date: string;              // 日期 "YYYY-MM-DD"
  activeUsers: number;       // 活跃用户数
  newUsers: number;          // 新增用户
  loginCount: number;        // 登录次数
  avgOnlineMinutes: number;  // 平均在线时长（分钟）
}
```

- [ ] **步骤 2: 验证类型定义正确性**

运行: `npm run lint`
预期: 无 TypeScript 类型错误

- [ ] **步骤 3: 提交类型定义**

```bash
git add src/services/types.ts
git commit -m "feat: 添加用户统计相关类型定义

- UserStatsMetrics: 关键指标数据结构
- TrendDataPoint: 趋势图数据点
- HourlyDataPoint: 时段分布数据
- UserStatsRecord: 详细统计记录

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 2: 创建模拟数据服务

**文件:**
- 新建: `src/services/mock-user-stats.ts`

- [ ] **步骤 1: 创建模拟数据服务文件**

创建 `src/services/mock-user-stats.ts`，包含以下内容：

```typescript
/**
 * 用户统计模拟数据服务
 * 后续可替换为真实 API 调用
 */

import {
  UserStatsMetrics,
  TrendDataPoint,
  HourlyDataPoint,
  UserStatsRecord,
  PageResponse,
  PageParams,
} from './types';

// 生成随机整数
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 生成最近 N 天的日期数组
const generateDates = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// 格式化日期为 MM-DD
const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;
};

/**
 * 获取关键指标
 */
export async function fetchMetrics(): Promise<UserStatsMetrics> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    todayActive: randomInt(800, 1500),
    todayActiveGrowth: randomInt(-15, 25),
    weekActive: randomInt(5000, 8000),
    weekActiveGrowth: randomInt(-10, 20),
    totalUsers: randomInt(20000, 50000),
    totalGrowth: randomInt(5, 15),
    avgOnlineTime: randomInt(30, 90),
    avgOnlineGrowth: randomInt(-5, 15),
  };
}

/**
 * 获取近 7 日趋势数据
 */
export async function fetchTrendData(): Promise<TrendDataPoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const dates = generateDates(7);
  return dates.map((date) => ({
    date: formatDateShort(date),
    value: randomInt(800, 1500),
  }));
}

/**
 * 获取时段分布数据（24 小时）
 */
export async function fetchHourlyData(): Promise<HourlyDataPoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const data: HourlyDataPoint[] = [];
  for (let hour = 0; hour < 24; hour++) {
    // 模拟真实使用模式：工作日 9-18 点活跃度高，凌晨低
    let base = randomInt(50, 200);
    if (hour >= 9 && hour <= 18) {
      base += randomInt(300, 800);
    } else if (hour >= 19 && hour <= 23) {
      base += randomInt(200, 500);
    }
    data.push({ hour, value: base });
  }
  return data;
}

/**
 * 获取详细统计数据
 */
export async function fetchStatsRecords(
  params: PageParams & { dateRange?: [string, string] }
): Promise<PageResponse<UserStatsRecord>> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const { current = 1, pageSize = 10 } = params;

  // 生成 30 天的模拟数据
  const allData: UserStatsRecord[] = generateDates(30).map((date) => ({
    date,
    activeUsers: randomInt(800, 1500),
    newUsers: randomInt(20, 100),
    loginCount: randomInt(2000, 5000),
    avgOnlineMinutes: randomInt(30, 90),
  }));

  // 日期筛选
  let filteredData = allData;
  if (params.dateRange && params.dateRange.length === 2) {
    const [start, end] = params.dateRange;
    filteredData = allData.filter(
      (item) => item.date >= start && item.date <= end
    );
  }

  // 分页
  const total = filteredData.length;
  const startIdx = (current - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const list = filteredData.slice(startIdx, endIdx);

  return {
    list,
    total,
    current,
    pageSize,
  };
}
```

- [ ] **步骤 2: 更新 services/index.ts 导出**

在 `src/services/index.ts` 文件中添加导出：

```typescript
export * from './types';
export * from './user';
export * from './api';
export * from './mock-user-stats';  // 新增这行
export { default as request, get, post, put, del, postForm } from './request';
```

- [ ] **步骤 3: 验证服务文件正确性**

运行: `npm run lint`
预期: 无错误

- [ ] **步骤 4: 提交模拟数据服务**

```bash
git add src/services/mock-user-stats.ts src/services/index.ts
git commit -m "feat: 添加用户统计模拟数据服务

- fetchMetrics: 获取关键指标
- fetchTrendData: 获取近 7 日趋势
- fetchHourlyData: 获取时段分布
- fetchStatsRecords: 获取详细统计记录（支持分页和日期筛选）

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 3: 安装图表库依赖

- [ ] **步骤 1: 安装 @ant-design/charts**

运行: `npm install @ant-design/charts`
预期: 安装成功，package.json 中新增依赖

- [ ] **步骤 2: 提交依赖更新**

```bash
git add package.json package-lock.json
git commit -m "chore: 安装 @ant-design/charts 图表库

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 4: 创建指标卡片组件

**文件:**
- 新建: `src/pages/user-stats/components/MetricsCards.tsx`

- [ ] **步骤 1: 创建 MetricsCards 组件**

创建 `src/pages/user-stats/components/MetricsCards.tsx`：

```typescript
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
          分钟
          {renderTrend(data.avgOnlineGrowth)}
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
```

- [ ] **步骤 2: 提交指标卡片组件**

```bash
git add src/pages/user-stats/components/MetricsCards.tsx
git commit -m "feat: 添加指标卡片组件

- 展示 4 个关键指标
- 支持趋势箭头显示（上升/下降）
- 响应式布局

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 5: 创建趋势图表组件

**文件:**
- 新建: `src/pages/user-stats/components/TrendCharts.tsx`

- [ ] **步骤 1: 创建 TrendCharts 组件**

创建 `src/pages/user-stats/components/TrendCharts.tsx`：

```typescript
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
```

- [ ] **步骤 2: 提交趋势图表组件**

```bash
git add src/pages/user-stats/components/TrendCharts.tsx
git commit -m "feat: 添加趋势图表组件

- 左侧：近 7 日活跃趋势（迷你折线图）
- 右侧：时段分布（迷你柱状图）
- 使用 @ant-design/charts 组件

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 6: 创建表格列配置

**文件:**
- 新建: `src/pages/user-stats/config.ts`

- [ ] **步骤 1: 创建表格列配置**

创建 `src/pages/user-stats/config.ts`：

```typescript
/**
 * 用户统计页面配置
 * 表格列定义、格式化函数等
 */

import type { ProColumns } from '@/components/ProTable';
import type { UserStatsRecord } from '@/services';

// 格式化日期
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 格式化时长（分钟 -> 小时:分钟）
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}小时${mins}分钟`;
  }
  return `${mins}分钟`;
};

// 表格列定义
export const columns: ProColumns<UserStatsRecord>[] = [
  {
    title: '日期',
    dataIndex: 'date',
    width: 120,
    fixed: 'left',
    sorter: true,
  },
  {
    title: '活跃用户数',
    dataIndex: 'activeUsers',
    width: 120,
    sorter: true,
    render: (value: number) => value.toLocaleString(),
  },
  {
    title: '新增用户',
    dataIndex: 'newUsers',
    width: 100,
    sorter: true,
  },
  {
    title: '登录次数',
    dataIndex: 'loginCount',
    width: 120,
    sorter: true,
    render: (value: number) => value.toLocaleString(),
  },
  {
    title: '平均在线时长',
    dataIndex: 'avgOnlineMinutes',
    width: 150,
    sorter: true,
    render: (value: number) => formatDuration(value),
  },
];

// 默认列配置
export const defaultColumnConfig = {
  date: { show: true, width: 120, fixed: 'left' },
  activeUsers: { show: true, width: 120 },
  newUsers: { show: true, width: 100 },
  loginCount: { show: true, width: 120 },
  avgOnlineMinutes: { show: true, width: 150 },
};
```

- [ ] **步骤 2: 提交配置文件**

```bash
git add src/pages/user-stats/config.ts
git commit -m "feat: 添加用户统计页面配置

- 定义表格列
- 添加日期和时长格式化函数
- 定义默认列配置

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 7: 创建主页面组件

**文件:**
- 新建: `src/pages/user-stats/index.tsx`

- [ ] **步骤 1: 创建主页面组件**

创建 `src/pages/user-stats/index.tsx`：

```typescript
/**
 * 用户活跃度统计页面
 * 展示用户活跃度关键指标、趋势图表和详细数据表格
 */

import React, { useRef, useState, useCallback } from 'react';
import { Card, Button, Space, DatePicker, message } from 'antd';
import { ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import type { ProTableRef } from '@/components/ProTable';
import type { UserStatsRecord, RangePickerProps } from 'antd/es/date-picker';
import MetricsCards from './components/MetricsCards';
import TrendCharts from './components/TrendCharts';
import ProTable from '@/components/ProTable';
import PageLayout from '@/components/PageLayout';
import {
  fetchMetrics,
  fetchTrendData,
  fetchHourlyData,
  fetchStatsRecords,
} from '@/services/mock-user-stats';
import { columns, defaultColumnConfig } from './config';
import type { UserStatsMetrics, TrendDataPoint, HourlyDataPoint } from '@/services';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const UserStatsPage: React.FC = () => {
  const tableRef = useRef<ProTableRef>(null);

  // 数据状态
  const [metrics, setMetrics] = useState<UserStatsMetrics | null>(null);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  // 加载所有数据
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [metricsData, trendDataResult, hourlyDataResult] = await Promise.all([
        fetchMetrics(),
        fetchTrendData(),
        fetchHourlyData(),
      ]);
      setMetrics(metricsData);
      setTrendData(trendDataResult);
      setHourlyData(hourlyDataResult);
    } catch (error) {
      message.error('加载数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  React.useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // 刷新按钮
  const handleRefresh = () => {
    loadAllData();
    tableRef.current?.reload();
    message.success('数据已刷新');
  };

  // 重置按钮
  const handleReset = () => {
    setDateRange(null);
    loadAllData();
    tableRef.current?.reload(true);
    message.success('已重置');
  };

  // 日期范围变化
  const handleDateRangeChange: RangePickerProps['onChange'] = (dates) => {
    if (dates && dates[0] && dates[1]) {
      const start = dates[0].format('YYYY-MM-DD');
      const end = dates[1].format('YYYY-MM-DD');
      setDateRange([start, end]);
    } else {
      setDateRange(null);
    }
  };

  // 工具栏
  const toolbarActions = (
    <Space>
      <RangePicker onChange={handleDateRangeChange} />
      <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
        刷新
      </Button>
      <Button icon={<SyncOutlined />} onClick={handleReset}>
        重置
      </Button>
    </Space>
  );

  // 表格数据请求
  const handleRequest = async (params: any) => {
    const { current, pageSize } = params;
    return await fetchStatsRecords({
      current,
      pageSize,
      dateRange: dateRange || undefined,
    });
  };

  return (
    <PageLayout
      title="用户活跃度统计"
      description="查看用户活跃度关键指标、趋势分析及详细统计数据"
      breadcrumbs={[{ label: '用户统计' }]}
      extra={toolbarActions}
    >
      {/* 指标卡片 */}
      <Card style={{ marginBottom: 16 }}>
        <MetricsCards data={metrics!} loading={loading} />
      </Card>

      {/* 趋势图表 */}
      <div style={{ marginBottom: 16 }}>
        <TrendCharts trendData={trendData} hourlyData={hourlyData} loading={loading} />
      </div>

      {/* 详细数据表格 */}
      <Card title="详细数据">
        <ProTable<UserStatsRecord>
          ref={tableRef}
          request={handleRequest}
          columns={columns}
          rowKey="date"
          defaultColumnConfig={defaultColumnConfig}
          enableColumnSetting={true}
          enableResizable={true}
          columnConfigKey="user-stats-columns"
          tableProps={{
            bordered: true,
            size: 'middle',
          }}
        />
      </Card>
    </PageLayout>
  );
};

export default UserStatsPage;
```

- [ ] **步骤 2: 提交主页面组件**

```bash
git add src/pages/user-stats/index.tsx
git commit -m "feat: 添加用户统计主页面组件

- 组合指标卡片、趋势图表、数据表格
- 支持日期范围筛选
- 支持刷新和重置功能

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 8: 创建页面样式

**文件:**
- 新建: `src/pages/user-stats/index.less`

- [ ] **步骤 1: 创建页面样式文件**

创建 `src/pages/user-stats/index.less`：

```less
/**
 * 用户活跃度统计页面样式
 */

.user-stats-page {
  // 指标卡片区域
  .metrics-cards {
    margin-bottom: 16px;
  }

  // 趋势图表区域
  .trend-charts {
    margin-bottom: 16px;
  }

  // 数据表格区域
  .data-table {
    :global {
      .ant-card-body {
        padding: 0;
      }
    }
  }

  // 统计卡片样式
  .statistic-card {
    text-align: center;

    .ant-statistic-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
    }

    .ant-statistic-content {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  // 响应式布局
  @media (max-width: @screen-lg) {
    .metrics-cards {
      .ant-col {
        margin-bottom: 8px;
      }
    }
  }

  @media (max-width: @screen-sm) {
    .metrics-cards {
      .ant-col {
        flex: 0 0 100%;
        max-width: 100%;
      }
    }
  }
}
```

- [ ] **步骤 2: 提交样式文件**

```bash
git add src/pages/user-stats/index.less
git commit -m "style: 添加用户统计页面样式

- 响应式布局支持
- 统一卡片间距

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 9: 配置路由

**文件:**
- 修改: `.umirc.ts`

- [ ] **步骤 1: 在 .umirc.ts 中添加路由**

在 `.umirc.ts` 的 routes 数组中添加以下路由配置（在 table-demo 路由之后）：

```typescript
{ path: '/user-stats', component: '@/pages/user-stats' },
```

完整示例：
```typescript
routes: [
  { path: '/', component: '@/pages/index' },
  { path: '/counter', component: '@/pages/counter-demo' },
  { path: '/api-demo', component: '@/pages/api-demo' },
  { path: '/table-demo', component: '@/pages/table-demo' },
  { path: '/user-stats', component: '@/pages/user-stats' },  // 新增
  // ... 其他路由
],
```

- [ ] **步骤 2: 验证路由配置**

运行: `npm run lint`
预期: 无错误

- [ ] **步骤 3: 提交路由配置**

```bash
git add .umirc.ts
git commit -m "feat: 添加用户统计页面路由

- 路径: /user-stats

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 10: 验证和测试

- [ ] **步骤 1: 启动开发服务器**

运行: `npm start`
预期: 服务器在 http://localhost:8000 启动

- [ ] **步骤 2: 访问页面验证功能**

1. 访问: http://localhost:8000/user-stats
2. 验证以下功能：
   - 指标卡片正确显示数据
   - 趋势图正常渲染
   - 表格数据正确展示
   - 日期筛选功能正常
   - 刷新按钮功能正常
   - 重置按钮功能正常
   - 响应式布局正常（调整浏览器窗口大小）

- [ ] **步骤 3: 检查控制台无错误**

打开浏览器开发者工具，检查：
- Console 面板无错误或警告
- Network 面板确认所有请求正常返回

- [ ] **步骤 4: 运行代码检查**

运行: `npm run lint`
预期: 无错误

- [ ] **步骤 5: 提交完成标记**

```bash
git add -A
git commit -m "feat: 完成用户活跃度统计页面

- 实现所有核心功能
- 通过功能验证
- 无 lint 错误

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 11: 添加首页导航入口（可选）

**文件:**
- 修改: `src/pages/index/index.tsx`

- [ ] **步骤 1: 在首页添加导航卡片**

在首页的菜单卡片区域添加用户统计入口（参考现有菜单卡片样式）

- [ ] **步骤 2: 测试导航链接**

点击首页的用户统计卡片，确认能正确跳转到 /user-stats

- [ ] **步骤 3: 提交导航入口**

```bash
git add src/pages/index/index.tsx
git commit -m "feat: 在首页添加用户统计导航入口

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## 验收检查清单

完成所有任务后，验证以下内容：

- [ ] 页面正常渲染，布局响应式
- [ ] 模拟数据正确生成和展示
- [ ] 指标卡片显示正确数据和趋势
- [ ] 图表正确渲染趋势和分布
- [ ] 表格支持分页、日期筛选
- [ ] 刷新/重置按钮功能正常
- [ ] 样式符合项目规范
- [ ] 无 TypeScript 类型错误
- [ ] 通过 ESLint 检查
- [ ] 控制台无错误或警告
