/**
 * ProTable Demo 页面
 * 展示高级表格组件的所有功能
 */

import React, { useRef } from 'react';
import { Card, Button, Space, Row, Col, Typography } from 'antd';
import {
  TableOutlined,
  ReloadOutlined,
  SettingOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  ColumnHeightOutlined,
} from '@ant-design/icons';
import type { ProTableRef } from '@/components/ProTable';
import type { UserTableItem } from '@/services';
import ProTable from '@/components/ProTable';
import { fetchUserList } from '@/services/api';
import { columns, defaultColumnConfig } from './config';
import PageLayout from '@/components/PageLayout';

const { Text } = Typography;

const TableDemoPage: React.FC = () => {
  const tableRef = useRef<ProTableRef>(null);

  // 数据请求函数 - 调用真实后端 API
  const handleRequest = async (params: any) => {
    const { current, pageSize, filters, sorter } = params;

    return await fetchUserList({
      current,
      pageSize,
      filters,
      sorter,
    });
  };

  // 工具栏操作
  const toolbarActions = (
    <Space>
      <Button
        icon={<ReloadOutlined />}
        onClick={() => tableRef.current?.reload()}
      >
        刷新
      </Button>
      <Button
        icon={<ReloadOutlined />}
        onClick={() => tableRef.current?.reload(true)}
      >
        重置
      </Button>
    </Space>
  );

  // 功能特性卡片
  const features = [
    {
      icon: <SearchOutlined />,
      title: '表头搜索',
      description: '使用 filterDropdown 实现列头模糊搜索',
      color: 'primary',
    },
    {
      icon: <FilterOutlined />,
      title: '列筛选',
      description: '使用 filters 实现下拉选项筛选',
      color: 'success',
    },
    {
      icon: <SortAscendingOutlined />,
      title: '排序',
      description: '支持单列升序/降序排序',
      color: 'warning',
    },
    {
      icon: <SettingOutlined />,
      title: '列配置',
      description: '可视化配置列显示/隐藏，支持持久化',
      color: 'default',
    },
    {
      icon: <ColumnHeightOutlined />,
      title: '列宽拖拽',
      description: '支持拖拽调整列宽，最小 60px，最大 800px',
      color: 'info',
    },
    {
      icon: <TableOutlined />,
      title: '分页',
      description: '支持页码切换、每页条数调整、快速跳转',
      color: 'processing',
    },
  ];

  return (
    <PageLayout
      title="ProTable 高级表格组件 Demo"
      description="企业级表格组件，提供开箱即用的分页、搜索、筛选、排序、列配置等功能。支持 TypeScript 类型安全，可灵活定制。"
      breadcrumbs={[{ label: 'ProTable Demo' }]}
      extra={toolbarActions}
    >
      {/* ProTable 表格 */}
      <Card className="protable-card">
        <ProTable<UserTableItem>
          ref={tableRef}
          request={handleRequest}
          columns={columns}
          rowKey="id"
          defaultColumnConfig={defaultColumnConfig}
          enableColumnSetting={true}
          enableResizable={true}
          columnConfigKey="table-demo-columns"
          tableProps={{
            bordered: true,
            size: 'middle',
          }}
        />
      </Card>

      {/* 功能特性 */}
      <Card title="功能特性" className="features-card">
        <Row gutter={[16, 16]}>
          {features.map((feature, index) => (
            <Col xs={12} sm={8} lg={4} key={index}>
              <div className={`feature-item feature-item--${feature.color}`}>
                <div className="feature-icon">{feature.icon}</div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-desc">{feature.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 使用说明 */}
      <Card title="快速开始" className="usage-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>1. 基础用法：</Text>
            <pre className="code-block">{`import ProTable from '@/components/ProTable';

<ProTable
  request={async (params) => {
    const { current, pageSize } = params;
    return await fetchData({ current, pageSize });
  }}
  columns={columns}
  rowKey="id"
/>`}</pre>
          </div>
          <div>
            <Text strong>2. 列配置：</Text>
            <pre className="code-block">{`const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    filterDropdown: TableHeaderSearch,  // 表头搜索
    filterIcon: (filtered) => <SearchOutlined />,
  },
  {
    title: '角色',
    dataIndex: 'role',
    filters: roleOptions,  // 下拉筛选
    filterIcon: (filtered) => <FilterOutlined />,
  },
];`}</pre>
          </div>
          <div>
            <Text strong>3. 更多文档：</Text>
            <p style={{ margin: 0 }}>
              查看完整文档请访问{' '}
              <a href="/docs/PROTABLE_GUIDE.md" target="_blank">
                ProTable 使用指南
              </a>
            </p>
          </div>
        </Space>
      </Card>
    </PageLayout>
  );
};

export default TableDemoPage;
