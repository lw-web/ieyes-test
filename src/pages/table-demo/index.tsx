/**
 * ProTable Demo 页面
 * 展示高级表格组件的所有功能
 */

import React, { useRef, useState, useEffect } from 'react';
import { Card, Button, Space, Tag, Typography, Row, Col, Statistic, Input } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { ProTableRef, ColumnConfig } from '@/components/ProTable';
import type { UserTableItem } from '@/services';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import ProTable from '@/components/ProTable';
import { fetchUserList, fetchUserStats } from '@/services/api';
import './index.less';

const { Title, Text } = Typography;

// 表头搜索组件
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
      <Button
        type="primary"
        onClick={() => confirm()}
        size="small"
        icon={<SearchOutlined />}
      >
        搜索
      </Button>
      <Button onClick={() => clearFilters?.()} size="small">
        重置
      </Button>
    </Space>
  </div>
);

// 角色选项（从后端获取）
const roles = [
  { label: '超级管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '用户', value: 'user' },
];

// 部门选项（从后端获取）
const departments = [
  { label: '技术部', value: '技术部' },
  { label: '产品部', value: '产品部' },
  { label: '运营部', value: '运营部' },
  { label: '市场部', value: '市场部' },
];

// 用户状态选项（从后端获取）
const userStatuses = [
  { label: '正常', value: 'active' },
  { label: '禁用', value: 'inactive' },
  { label: '封禁', value: 'banned' },
];

const TableDemoPage: React.FC = () => {
  const tableRef = useRef<ProTableRef>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, banned: 0 });

  // 列配置
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>([
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
  ]);

  // 列定义 - 使用 filterDropdown 实现表头搜索/筛选
  const columns = [
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

  // 加载统计数据
  const loadStats = async () => {
    try {
      const data = await fetchUserStats();
      setStats(data);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  };

  // 初始加载统计数据
  useEffect(() => {
    loadStats();
  }, []);

  // 数据请求函数 - 调用真实后端 API
  const handleRequest = async (params: any) => {
    const { current, pageSize, filters, sorter } = params;

    console.log('=== 前端请求参数 ===');
    console.log('current:', current);
    console.log('pageSize:', pageSize);
    console.log('filters:', filters);
    console.log('sorter:', sorter);

    const result = await fetchUserList({
      current,
      pageSize,
      filters,
      sorter,
    });

    console.log('=== 后端返回结果 ===');
    console.log('result:', result);

    // 数据加载成功后，刷新统计数据
    loadStats();

    return result;
  };

  return (
    <div className="table-demo-page">
      <Card>
        <Title level={2}>ProTable 高级表格组件</Title>
        <Text type="secondary">
          展示分页、表头搜索、筛选、排序、列配置、列宽拖拽等功能（后端 API 对接）
        </Text>
      </Card>

      {/* 统计数据 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总用户数" value={stats.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="正常用户" value={stats.active} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="禁用用户" value={stats.inactive} valueStyle={{ color: '#8c8c8c' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="封禁用户" value={stats.banned} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>

      {/* 表格 */}
      <Card style={{ marginTop: 16 }}>
        <ProTable<UserTableItem>
          ref={tableRef}
          request={handleRequest}
          columns={columns}
          rowKey="id"
          defaultColumnConfig={columnConfig}
          enableColumnSetting={true}
          enableResizable={true}
          columnConfigKey="table-demo-columns"
          tableProps={{
            bordered: true,
            size: 'middle',
          }}
          onRequestSuccess={(data) => {
            console.log('数据加载成功:', data);
          }}
        />
      </Card>

      {/* 使用说明 */}
      <Card title="使用说明" style={{ marginTop: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>后端服务：</Text>
            <Text>Express 运行在 http://localhost:3000</Text>
          </div>
          <div>
            <Text strong>1. 表头搜索：</Text>
            <Text>点击用户名、昵称、邮箱、手机号列头的搜索图标，输入内容进行模糊搜索</Text>
          </div>
          <div>
            <Text strong>2. 列筛选：</Text>
            <Text>点击角色、部门、状态列头的筛选图标，选择筛选条件</Text>
          </div>
          <div>
            <Text strong>3. 列排序：</Text>
            <Text>点击可排序列（ID、用户名、昵称、创建时间）的表头，进行升序/降序排序</Text>
          </div>
          <div>
            <Text strong>4. 列配置：</Text>
            <Text>点击工具栏的"列设置"按钮，勾选需要显示的列</Text>
          </div>
          <div>
            <Text strong>5. 列宽拖拽：</Text>
            <Text>鼠标悬停在列边线（出现浅灰色高亮），拖拽调整列宽（60px - 800px）</Text>
          </div>
          <div>
            <Text strong>6. 分页：</Text>
            <Text>切换页码或每页条数，自动触发数据请求</Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default TableDemoPage;
