# 用户活跃度统计页面设计文档

**日期**: 2026-04-25
**作者**: Claude
**状态**: 已批准

## 1. 概述

### 1.1 目标
创建一个用户活跃度统计页面，展示每日/每周/每月活跃用户数、登录次数、在线时长等关键指标，支持数据可视化展示和详细数据查询。

### 1.2 约束条件
- 暂时使用前端模拟数据（后续接入真实 API）
- 复用现有 ProTable 组件
- 保持与项目现有风格一致

---

## 2. 技术方案

### 2.1 技术栈
- **UI 框架**: Ant Design 5.27.0
- **图表库**: @ant-design/charts（基于项目已有的 AntV G2）
- **状态管理**: UmiJS useModel（可选）
- **路由**: UmiJS 内置路由

### 2.2 依赖安装
```bash
npm install @ant-design/charts
```

---

## 3. 数据结构

### 3.1 类型定义

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

### 3.2 模拟数据策略
- 基于当前日期动态生成近30天数据
- 使用随机算法模拟真实波动
- 支持日期范围筛选

---

## 4. 组件设计

### 4.1 文件结构

```
src/
├── pages/
│   └── user-stats/               # 新建页面目录
│       ├── index.tsx             # 主页面组件
│       ├── index.less            # 页面样式
│       ├── components/           # 子组件
│       │   ├── MetricsCards.tsx  # 指标卡片
│       │   └── TrendCharts.tsx   # 趋势图表
│       └── config.ts             # 表格列配置
└── services/
    └── mock-user-stats.ts        # 模拟数据服务
```

### 4.2 组件职责

#### 主页面 (`index.tsx`)
- 组合各子组件
- 处理日期筛选状态
- 协调数据获取和刷新

#### 指标卡片 (`MetricsCards.tsx`)
- 接收统计数据 props
- 渲染 4 个 Statistic 卡片
- 处理趋势箭头颜色（上升绿色/下降红色）

#### 趋势图表 (`TrendCharts.tsx`)
- 使用 `@ant-design/charts` 的 MiniArea 和 MiniColumn
- 左侧：近7日活跃用户趋势（迷你折线图）
- 右侧：时段分布（迷你柱状图，24小时）

#### 配置文件 (`config.ts`)
- 表格列定义（复用 ProTable 模式）
- 日期格式化函数

---

## 5. 页面布局

```
┌─────────────────────────────────────────────────┐
│  用户活跃度统计                    [刷新] [重置] │
├─────────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │今日  │ │本周  │ │总用户│ │平均  │          │
│  │活跃  │ │活跃  │ │      │ │在线  │          │
│  │ 1234 │ │ 5678 │ │ 9012 │ │  45  │          │
│  │ ↑12% │ │ ↓5%  │ │ ↑8%  │ │ ↑2%  │          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
├─────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐            │
│  │ 近7日趋势    │ │ 时段分布     │            │
│  │  (折线图)    │ │  (柱状图)    │            │
│  └──────────────┘ └──────────────┘            │
├─────────────────────────────────────────────────┤
│  详细数据表格                                     │
│  ┌─────────────────────────────────────────┐  │
│  │ 日期 | 活跃用户 | 新增 | 登录 | 在线时长│  │
│  ├─────────────────────────────────────────┤  │
│  │ 2026-04-25 | 1234 | 56 | 7890 | 45     │  │
│  │ ...                                    │  │
│  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 5.1 顶部指标卡片（4个）
| 指标 | 显示内容 |
|------|----------|
| 今日活跃 | 数字 + 趋势箭头 + 日环比百分比 |
| 本周活跃 | 数字 + 趋势箭头 + 周环比百分比 |
| 总注册用户 | 数字 + 趋势箭头 + 月增长率 |
| 平均在线时长 | 数字（分钟）+ 趋势箭头 |

### 5.2 中部趋势图表
- 左侧：近7日活跃用户趋势（迷你折线图）
- 右侧：时段分布（迷你柱状图，0-23小时）

### 5.3 底部数据表格
- 使用 ProTable 组件
- 列：日期、活跃用户数、新增用户、登录次数、平均在线时长
- 支持日期范围筛选
- 支持分页、排序

---

## 6. 服务层设计

### 6.1 API 函数 (`src/services/mock-user-stats.ts`)

```typescript
// 获取关键指标（实时计算）
export async function fetchMetrics(): Promise<UserStatsMetrics>

// 获取趋势图数据（近7日）
export async function fetchTrendData(): Promise<TrendDataPoint[]>

// 获取时段分布数据（24小时）
export async function fetchHourlyData(): Promise<HourlyDataPoint[]>

// 获取详细统计数据（带分页和日期筛选）
export async function fetchStatsRecords(
  params: PageParams & { dateRange?: [string, string] }
): Promise<PageResponse<UserStatsRecord>>
```

### 6.2 数据更新策略
- 指标卡片：页面加载时获取，点击刷新按钮重新获取
- 图表数据：页面加载时获取
- 表格数据：支持分页加载，日期筛选后重新加载

---

## 7. 样式设计

### 7.1 布局规范
- 卡片间距：16px
- 使用 ProTable 的卡片样式
- 响应式布局：移动端卡片单列，平板2列，桌面4列

### 7.2 颜色方案
| 场景 | 颜色 | 代码 |
|------|------|------|
| 上升趋势 | 绿色 | #52c41a |
| 下降趋势 | 红色 | #ff4d4f |
| 主卡片 | 主题色 | #1890ff |

### 7.3 组件复用
- 复用 `PageLayout` 组件
- 复用 `ProTable` 组件
- 遵循 `CLAUDE.md` 中的样式约定

---

## 8. 路由配置

### 8.1 路由定义
修改 `.umirc.ts`：
```typescript
{
  path: '/user-stats',
  component: '@/pages/user-stats',
}
```

### 8.2 访问方式
- URL: `http://localhost:8000/user-stats`
- 建议在首页添加导航入口

---

## 9. 后续扩展

### 9.1 API 接入准备
- 模拟数据服务已预留接口签名
- 后端只需按相同格式返回数据即可直接替换

### 9.2 功能增强（可选）
- 导出统计数据为 Excel
- 自定义日期范围查询
- 实时数据推送（WebSocket）
- 多维度数据对比

---

## 10. 验收标准

- [ ] 页面正常渲染，布局响应式
- [ ] 模拟数据正确生成和展示
- [ ] 指标卡片显示正确数据和趋势
- [ ] 图表正确渲染趋势和分布
- [ ] 表格支持分页、日期筛选
- [ ] 刷新/重置按钮功能正常
- [ ] 样式符合项目规范
- [ ] 无 TypeScript 类型错误
- [ ] 通过 ESLint 检查
