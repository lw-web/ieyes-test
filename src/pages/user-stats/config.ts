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
