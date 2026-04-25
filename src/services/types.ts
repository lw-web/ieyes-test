/**
 * API 通用类型定义
 */

// 分页参数
export interface PageParams {
  current?: number;
  pageSize?: number;
}

// 分页响应
export interface PageResponse<T> {
  list: T[];
  total: number;
  current: number;
  pageSize: number;
}

// 用户信息
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email?: string;
  avatar?: string;
  role?: string;
  createdAt: string;
}

// 登录参数
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
}

// 登录响应
export interface LoginResult {
  token: string;
  userInfo: UserInfo;
}

// 响应结果（业务层）
export interface ResponseResult<T = any> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

// 表格查询参数（扩展）
export interface TableQueryParams extends PageParams {
  filters?: Record<string, any>;
  sorter?: {
    field?: string;
    order?: 'ascend' | 'descend';
  };
  keyword?: string; // 关键词搜索
}

// 用户状态枚举
export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Banned = 'banned',
}

// 扩展用户信息（用于表格）
export interface UserTableItem extends UserInfo {
  status?: UserStatus;
  phone?: string;
  department?: string;
  lastLoginAt?: string;
}

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
