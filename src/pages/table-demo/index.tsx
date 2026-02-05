/**
 * ProTable Demo 页面
 * 展示高级表格组件的所有功能
 */

import React, { useRef } from 'react';
import { Card } from 'antd';
import type { ProTableRef } from '@/components/ProTable';
import type { UserTableItem } from '@/services';
import ProTable from '@/components/ProTable';
import { fetchUserList } from '@/services/api';
import { columns, defaultColumnConfig } from './config';
import './index.less';

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

  return (
    <div className="table-demo-page">
      <Card>
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
    </div>
  );
};

export default TableDemoPage;
