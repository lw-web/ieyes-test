/**
 * ProTable Demo 配置文件
 * 包含列定义、筛选选项、表头搜索组件等
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

// 角色选项（从后端获取）
export const roles = [
  { label: '超级管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '用户', value: 'user' },
];

// 部门选项（从后端获取）
export const departments = [
  { label: '技术部', value: '技术部' },
  { label: '产品部', value: '产品部' },
  { label: '运营部', value: '运营部' },
  { label: '市场部', value: '市场部' },
];

// 用户状态选项（从后端获取）
export const userStatuses = [
  { label: '正常', value: 'active' },
  { label: '禁用', value: 'inactive' },
  { label: '封禁', value: 'banned' },
];

// 默认列配置
export const defaultColumnConfig: ColumnConfig[] = [
  { key: 'id', label: 'ID', visible: true },
  { key: 'username', label: '用户名', visible: true },
  { key: 'nickname', label: '昵称', visible: true },
  { key: 'email', label: '邮箱', visible: true },
  { key: 'phone', label: '手机号', visible: true },
  { key: 'role', label: '角色', visible: true },
  { key: 'department', label: '部门', visible: true },
  { key: 'status', label: '状态', visible: true },
  { key: 'lastLoginAt', label: '最后登录', visible: false },
  { key: 'createdAt', label: '创建时间', visible: true },
  { key: 'action', label: '操作', visible: true },
];

// 列定义 - 使用 filterDropdown 实现表头搜索/筛选
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
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    width: 120,
    sorter: true,
    filterDropdown: TableHeaderSearch,
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 200,
    filterDropdown: TableHeaderSearch,
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: 130,
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
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    width: 120,
    filters: departments.map((d) => ({ text: d.label, value: d.label })),
    filterIcon: (filtered: boolean) => (
      <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    filters: userStatuses.map((s) => ({ text: s.label, value: s.value })),
    filterIcon: (filtered: boolean) => (
      <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    render: (status: string) => {
      const statusConfig: Record<string, { color: string; text: string }> = {
        active: { color: 'success', text: '正常' },
        inactive: { color: 'default', text: '禁用' },
        banned: { color: 'error', text: '封禁' },
      };
      const config = statusConfig[status] || statusConfig.active;
      return <Tag color={config.color}>{config.text}</Tag>;
    },
  },
  {
    title: '最后登录',
    dataIndex: 'lastLoginAt',
    key: 'lastLoginAt',
    width: 180,
    render: (date: string) => (date ? new Date(date).toLocaleString('zh-CN') : '-'),
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    sorter: true,
    render: (date: string) => new Date(date).toLocaleString('zh-CN'),
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right' as const,
    render: (_: any, record: UserTableItem) => (
      <Space>
        <Button type="link" size="small">
          编辑
        </Button>
        <Button type="link" size="small" danger>
          删除
        </Button>
      </Space>
    ),
  },
];
