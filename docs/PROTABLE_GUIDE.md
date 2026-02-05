# ProTable 高级表格组件使用指南

> 封装的企业级表格组件，提供开箱即用的分页、搜索、筛选、排序、列配置等功能

## 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [API 参考](#api-参考)
- [列配置](#列配置)
- [完整示例](#完整示例)
- [后端对接](#后端对接)
- [常见问题](#常见问题)

---

## 功能特性

| 功能 | 说明 |
|------|------|
| **分页** | 支持页码切换、每页条数调整、快速跳转 |
| **表头搜索** | 使用 `filterDropdown` 实现列头的模糊搜索 |
| **列筛选** | 使用 `filters` 实现下拉选项筛选 |
| **排序** | 支持单列升序/降序排序 |
| **列配置** | 可视化配置列的显示/隐藏，支持 localStorage 持久化 |
| **列宽拖拽** | 支持拖拽调整列宽（最小 60px，最大 800px） |
| **工具栏** | 可自定义工具栏内容 |
| **Ref 方法** | 支持通过 ref 调用刷新、重置等方法 |

---

## 快速开始

### 基础用法

```tsx
import ProTable from '@/components/ProTable';
import type { ProTableProps, ProTableRef } from '@/components/ProTable';

// 数据请求函数
const request = async (params) => {
  const { current, pageSize, filters, sorter } = params;
  const response = await fetch('/api/list', {
    method: 'POST',
    body: JSON.stringify({ current, pageSize, filters, sorter }),
  });
  return response.json();
};

function App() {
  return (
    <ProTable
      request={request}
      columns={columns}
      rowKey="id"
    />
  );
}
```

### 使用 Ref 方法

```tsx
import { useRef } from 'react';

function App() {
  const tableRef = useRef<ProTableRef>(null);

  const handleReload = () => {
    tableRef.current?.reload(); // 刷新当前页
    tableRef.current?.reload(true); // 刷新并重置到第一页
  };

  const handleReset = () => {
    tableRef.current?.reset(); // 重置查询条件
  };

  return (
    <>
      <Button onClick={handleReload}>刷新</Button>
      <Button onClick={handleReset}>重置</Button>
      <ProTable ref={tableRef} {...props} />
    </>
  );
}
```

---

## API 参考

### ProTableProps

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `request` | `(params: TableQueryParams) => Promise<ProTableRequestResult<T>>` | **必填** | 数据请求函数 |
| `columns` | `ColumnType<T>[]` | **必填** | 列定义 |
| `rowKey` | `string \| ((record: T) => string)` | `'id'` | 行的唯一标识 |
| `defaultColumnConfig` | `ColumnConfig[]` | - | 默认列配置 |
| `enableColumnSetting` | `boolean` | `true` | 是否启用列配置功能 |
| `enableResizable` | `boolean` | `true` | 是否启用列宽拖拽 |
| `columnConfigKey` | `string` | `'protable-column-config'` | localStorage 存储键名 |
| `toolbarRender` | `() => ReactNode` | - | 自定义工具栏内容 |
| `tableProps` | `Omit<TableProps, 'columns' \| 'dataSource' \| 'loading' \| 'onChange' \| 'pagination'>` | - | 透传给 Table 的属性 |
| `autoRequest` | `boolean` | `true` | 是否自动发起请求 |
| `initialValues` | `Partial<TableQueryParams>` | - | 初始查询参数 |
| `onRequestSuccess` | `(data: ProTableRequestResult<T>) => void` | - | 请求成功回调 |
| `onRequestError` | `(error: Error) => void` | - | 请求失败回调 |

### ProTableRef 方法

| 方法 | 类型 | 说明 |
|------|------|------|
| `reload` | `(resetPageIndex?: boolean) => void` | 刷新表格数据，resetPageIndex 为 true 时重置到第一页 |
| `reset` | `() => void` | 重置所有查询条件（分页、筛选、排序） |
| `getQueryParams` | `() => TableQueryParams` | 获取当前查询参数 |
| `getDataSource` | `() => T[]` | 获取当前数据源 |
| `setFilters` | `(filters: Record<string, FilterValue \| null>) => void` | 手动设置筛选条件 |
| `setSorter` | `(sorter: Record<string, 'ascend' \| 'descend' \| null>) => void` | 手动设置排序条件 |

### 类型定义

```typescript
// 查询参数
interface TableQueryParams {
  current: number;           // 当前页码
  pageSize: number;          // 每页条数
  filters?: Record<string, FilterValue | null>;  // 筛选条件
  sorter?: SorterResult<any> | SorterResult<any>[];  // 排序条件
}

// 请求返回值
interface ProTableRequestResult<T = any> {
  list: T[];          // 数据列表
  total: number;      // 总条数
  current?: number;   // 当前页码
  pageSize?: number;  // 每页条数
}

// 列配置项
interface ColumnConfig {
  key: string;        // 列的 key（对应 columns 中的 key 或 dataIndex）
  label: string;      // 列标题
  visible: boolean;   // 是否可见
  fixed?: boolean | 'left' | 'right';  // 固定列
  width?: number;     // 列宽
}
```

---

## 列配置

### 1. 文本列

```tsx
{
  title: '用户名',
  dataIndex: 'username',
  key: 'username',
  width: 150,
}
```

### 2. 可搜索列（filterDropdown）

使用 `filterDropdown` 实现表头搜索框：

```tsx
// 搜索组件
const TableHeaderSearch: React.FC<FilterDropdownProps> = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
}) => (
  <div style={{ padding: 8 }}>
    <Input
      placeholder="请输入搜索内容"
      value={selectedKeys[0]}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={() => confirm()}
      style={{ width: 188, marginBottom: 8, display: 'block' }}
    />
    <Space>
      <Button type="primary" onClick={() => confirm()} size="small" icon={<SearchOutlined />}>
        搜索
      </Button>
      <Button onClick={() => clearFilters?.()} size="small">
        重置
      </Button>
    </Space>
  </div>
);

// 列定义
{
  title: '用户名',
  dataIndex: 'username',
  key: 'username',
  filterDropdown: TableHeaderSearch,
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
}
```

### 3. 可筛选列（filters）

使用 `filters` 实现下拉选项筛选：

```tsx
const roles = [
  { label: '超级管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '用户', value: 'user' },
];

{
  title: '角色',
  dataIndex: 'role',
  key: 'role',
  filters: roles.map((r) => ({ text: r.label, value: r.value })),
  filterIcon: (filtered: boolean) => (
    <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  render: (role: string) => {
    const roleInfo = roles.find((r) => r.value === role);
    return <Tag color={role === 'admin' ? 'red' : 'blue'}>{roleInfo?.label || role}</Tag>;
  },
}
```

### 4. 可排序列

```tsx
{
  title: '创建时间',
  dataIndex: 'createdAt',
  key: 'createdAt',
  sorter: true,  // 启用排序
  render: (date: string) => new Date(date).toLocaleString('zh-CN'),
}
```

### 5. 操作列

```tsx
{
  title: '操作',
  key: 'action',
  width: 150,
  fixed: 'right' as const,
  render: (_: any, record: UserTableItem) => (
    <Space>
      <Button type="link" size="small">编辑</Button>
      <Button type="link" size="small" danger>删除</Button>
    </Space>
  ),
}
```

---

## 完整示例

### 推荐的目录结构

```
src/pages/user-list/
├── index.tsx       # 页面组件
├── config.tsx      # 列配置、筛选选项
└── index.less      # 样式文件
```

### config.tsx - 配置文件

```tsx
/**
 * 用户列表配置文件
 */
import React from 'react';
import { Button, Space, Tag, Input } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import type { ColumnType } from 'antd/es/table';
import type { ColumnConfig } from '@/components/ProTable';
import type { UserTableItem } from '@/services';

// 表头搜索组件
export const TableHeaderSearch: React.FC<FilterDropdownProps> = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
}) => (
  <div style={{ padding: 8 }}>
    <Input
      placeholder="请输入搜索内容"
      value={selectedKeys[0]}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={() => confirm()}
      style={{ width: 188, marginBottom: 8, display: 'block' }}
    />
    <Space>
      <Button type="primary" onClick={() => confirm()} size="small" icon={<SearchOutlined />}>
        搜索
      </Button>
      <Button onClick={() => clearFilters?.()} size="small">
        重置
      </Button>
    </Space>
  </div>
);

// 角色选项
export const roles = [
  { label: '超级管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '用户', value: 'user' },
];

// 默认列配置
export const defaultColumnConfig: ColumnConfig[] = [
  { key: 'id', label: 'ID', visible: true },
  { key: 'username', label: '用户名', visible: true },
  { key: 'nickname', label: '昵称', visible: true },
  { key: 'email', label: '邮箱', visible: true },
  { key: 'role', label: '角色', visible: true },
  { key: 'status', label: '状态', visible: true },
  { key: 'action', label: '操作', visible: true },
];

// 列定义
export const columns: ColumnType<UserTableItem>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    sorter: true,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 150,
    sorter: true,
    filterDropdown: TableHeaderSearch,
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 120,
    filters: roles.map((r) => ({ text: r.label, value: r.value })),
    filterIcon: (filtered: boolean) => (
      <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    render: (role: string) => {
      const roleInfo = roles.find((r) => r.value === role);
      return <Tag color={role === 'admin' ? 'red' : 'blue'}>{roleInfo?.label || role}</Tag>;
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right' as const,
    render: (_: any, record: UserTableItem) => (
      <Space>
        <Button type="link" size="small">编辑</Button>
        <Button type="link" size="small" danger>删除</Button>
      </Space>
    ),
  },
];
```

### index.tsx - 页面组件

```tsx
/**
 * 用户列表页面
 */
import React, { useRef } from 'react';
import { Card } from 'antd';
import type { ProTableRef } from '@/components/ProTable';
import type { UserTableItem } from '@/services';
import ProTable from '@/components/ProTable';
import { fetchUserList } from '@/services/api';
import { columns, defaultColumnConfig } from './config';

const UserListPage: React.FC = () => {
  const tableRef = useRef<ProTableRef>(null);

  // 数据请求函数
  const handleRequest = async (params: any) => {
    const { current, pageSize, filters, sorter } = params;

    return await fetchUserList({
      current,
      pageSize,
      filters,
      sorter,
    });
  };

  return (
    <Card>
      <ProTable<UserTableItem>
        ref={tableRef}
        request={handleRequest}
        columns={columns}
        rowKey="id"
        defaultColumnConfig={defaultColumnConfig}
        enableColumnSetting={true}
        enableResizable={true}
        columnConfigKey="user-list-columns"
        tableProps={{
          bordered: true,
          size: 'middle',
        }}
      />
    </Card>
  );
};

export default UserListPage;
```

---

## 后端对接

### 前端请求格式

前端使用 `POST` 请求发送以下参数：

```typescript
{
  current: number,      // 当前页码
  pageSize: number,     // 每页条数
  filters?: {           // 筛选条件（可选）
    [key: string]: (string | number)[]
  },
  sorter?: {            // 排序条件（可选）
    field: string,
    order: 'ascend' | 'descend'
  }
}
```

### filters 参数示例

```javascript
// 用户名搜索（filterDropdown）
{
  filters: {
    username: ['admin']  // 用户名包含 'admin'
  }
}

// 角色筛选（filters）
{
  filters: {
    role: ['admin', 'editor']  // 角色是 admin 或 editor
  }
}
```

### sorter 参数示例

```javascript
// 升序排序
{
  sorter: {
    field: 'createdAt',
    order: 'ascend'
  }
}

// 降序排序
{
  sorter: {
    field: 'id',
    order: 'descend'
  }
}
```

### 后端接口规范

**请求：** `POST /api/user/list`

**请求体：**
```json
{
  "current": 1,
  "pageSize": 10,
  "filters": {
    "role": ["admin"]
  },
  "sorter": {
    "field": "createdAt",
    "order": "descend"
  }
}
```

**响应：**
```json
{
  "list": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  ],
  "total": 100,
  "current": 1,
  "pageSize": 10
}
```

### Express 后端示例

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 生成模拟数据
const generateUsers = (count) => {
  const users = [];
  for (let i = 1; i <= count; i++) {
    users.push({
      id: i,
      username: `user_${i}`,
      email: `user${i}@example.com`,
      role: ['admin', 'editor', 'user'][i % 3],
      status: ['active', 'inactive'][i % 2],
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    });
  }
  return users;
};

const allUsers = generateUsers(100);

// 用户列表接口
app.post('/api/user/list', (req, res) => {
  const { current = 1, pageSize = 10, filters, sorter } = req.body;

  let filtered = [...allUsers];

  // 处理筛选
  if (filters) {
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        filtered = filtered.filter(item => {
          // filterDropdown 搜索：模糊匹配
          // filters 筛选：精确匹配
          return values.some(v => String(item[key]).toLowerCase().includes(String(v).toLowerCase()));
        });
      }
    });
  }

  // 处理排序
  if (sorter && sorter.field) {
    const { field, order } = sorter;
    filtered.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (order === 'ascend') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  // 分页
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  const list = filtered.slice(start, end);

  res.json({
    list,
    total: filtered.length,
    current,
    pageSize,
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

---

## 常见问题

### Q1: 筛选/排序参数没有传递到后端？

**原因：** React 状态更新是异步的，如果依赖状态更新后再发起请求，可能导致参数丢失。

**解决方案：** ProTable 内部已通过 `overrideParams` 参数解决了此问题，确保参数在状态更新前传递。如果仍有问题，请检查 `useTableQuery.ts` 中的 `fetchTable` 函数是否正确实现。

### Q2: 列宽拖拽不生效？

**检查项：**
1. 确认 `enableResizable={true}` 已设置
2. 检查 `index.less` 样式文件是否正确加载
3. 确认列定义中有 `width` 属性

### Q3: 列配置没有持久化？

**检查项：**
1. 确认 `columnConfigKey` 属性已设置且唯一
2. 检查浏览器是否允许 localStorage
3. 查看控制台是否有 localStorage 相关错误

### Q4: filterDropdown 搜索不生效？

**检查项：**
1. 确认 `filterDropdown` 组件正确调用了 `confirm()` 方法
2. 检查后端是否正确处理了 filters 参数
3. 搜索值可能是数组格式，需要使用 `selectedKeys[0]` 获取

### Q5: 如何禁用某个功能？

```tsx
<ProTable
  enableColumnSetting={false}  // 禁用列配置
  enableResizable={false}      // 禁用列宽拖拽
  // ...其他props
/>
```

---

## 组件结构

```
src/components/ProTable/
├── index.tsx           # 主组件
├── types.ts            # 类型定义
├── useTableQuery.ts    # 查询状态管理 Hook
├── useColumnResize.ts  # 列宽拖拽 Hook
├── useColumnConfig.ts  # 列配置管理 Hook
├── ColumnSetting.tsx   # 列设置组件
└── index.less          # 样式文件
```

---

## 更新日志

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2025-02-05 | 初始版本，支持分页、搜索、筛选、排序、列配置、列宽拖拽 |
| 1.1.0 | 2025-02-05 | 修复筛选/排序参数传递问题；优化 TypeScript 类型定义 |
