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
