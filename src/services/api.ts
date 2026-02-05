/**
 * 后端 API 服务
 * 与 Express 后端对接
 */

import { request, PageResponse, UserTableItem, TableQueryParams } from './';

// API 基础地址
const API_BASE = 'http://localhost:3000/api';

/**
 * 获取用户列表（后端 API）
 * @param params 查询参数（分页、筛选、排序）
 */
export async function fetchUserList(
  params: TableQueryParams
): Promise<PageResponse<UserTableItem>> {
  return request<PageResponse<UserTableItem>>(`${API_BASE}/user/list`, {
    method: 'POST',
    body: JSON.stringify(params),
    skipAuth: true,
  });
}

/**
 * 获取统计数据
 */
export async function fetchUserStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  banned: number;
}> {
  return request(`${API_BASE}/user/stats`, {
    method: 'GET',
    skipAuth: true,
  });
}

/**
 * 获取配置选项
 */
export async function fetchConfigOptions(): Promise<{
  roles: Array<{ label: string; value: string }>;
  departments: Array<{ label: string; value: string }>;
  userStatuses: Array<{ label: string; value: string }>;
}> {
  return request(`${API_BASE}/config/options`, {
    method: 'GET',
    skipAuth: true,
  });
}

// 健康检查
export async function healthCheck(): Promise<{ status: string; timestamp: string }> {
  return request('http://localhost:3000/health', {
    method: 'GET',
    skipAuth: true,
  });
}
