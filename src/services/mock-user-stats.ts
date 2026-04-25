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
