/**
 * Mock 数据 - 表格 Demo
 */

import type { UserTableItem } from '@/services';

// 角色列表
export const roles = [
  { label: '超级管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '用户', value: 'user' },
];

// 部门列表
export const departments = [
  { label: '技术部', value: 'tech' },
  { label: '产品部', value: 'product' },
  { label: '运营部', value: 'operation' },
  { label: '市场部', value: 'marketing' },
];

// 用户状态
export const userStatuses = [
  { label: '正常', value: 'active' },
  { label: '禁用', value: 'inactive' },
  { label: '封禁', value: 'banned' },
];

// 生成 Mock 用户数据
export function generateMockUsers(count: number = 50): UserTableItem[] {
  const users: UserTableItem[] = [];
  const now = Date.now();

  for (let i = 1; i <= count; i++) {
    const roleIndex = Math.floor(Math.random() * roles.length);
    const deptIndex = Math.floor(Math.random() * departments.length);
    const statusIndex = Math.floor(Math.random() * userStatuses.length);

    users.push({
      id: i,
      username: `user_${i}`,
      nickname: `测试用户${i}`,
      email: `user${i}@example.com`,
      phone: `138${String(Math.random()).substr(2, 8)}`,
      role: roles[roleIndex].value,
      department: departments[deptIndex].label,
      status: userStatuses[statusIndex].value as any,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      createdAt: new Date(now - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginAt: new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return users;
}

// Mock 数据存储
let mockData = generateMockUsers(50);

/**
 * 模拟 API 请求 - 获取用户列表
 */
export async function mockGetUserList(params: {
  current: number;
  pageSize: number;
  filters?: Record<string, any>;
  sorter?: any;
  keyword?: string;
}): Promise<{ list: UserTableItem[]; total: number }> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredData = [...mockData];

  // 处理 filters - 包括 filterDropdown 的搜索和 filters 的筛选
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // value 可能是数组（多选筛选）或单个值（搜索）
        if (Array.isArray(value)) {
          if (value.length > 0) {
            // 多选筛选（如角色、部门、状态）
            filteredData = filteredData.filter((item) => {
              const itemValue = (item as any)[key];
              return value.includes(itemValue);
            });
          }
        } else if (typeof value === 'string' && value.length > 0) {
          // 单个值（filterDropdown 搜索）
          const searchValue = value.toLowerCase();
          filteredData = filteredData.filter((item) => {
            const itemValue = (item as any)[key];
            if (itemValue && typeof itemValue === 'string') {
              return itemValue.toLowerCase().includes(searchValue);
            }
            return false;
          });
        }
      }
    });
  }

  // 排序
  if (params.sorter?.field && params.sorter?.order) {
    const { field, order } = params.sorter;
    filteredData.sort((a, b) => {
      const aVal = (a as any)[field];
      const bVal = (b as any)[field];

      // 字符串排序
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'ascend'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // 数字排序
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'ascend' ? aVal - bVal : bVal - aVal;
      }

      // 日期排序
      if (aVal instanceof Date || bVal instanceof Date || (typeof aVal === 'string' && /^\d{4}-\d{2}-\d{2}/.test(aVal))) {
        const dateA = new Date(aVal).getTime();
        const dateB = new Date(bVal).getTime();
        return order === 'ascend' ? dateA - dateB : dateB - dateA;
      }

      return 0;
    });
  }

  // 分页
  const { current, pageSize } = params;
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filteredData.slice(start, end);

  return {
    list: pageData,
    total: filteredData.length,
  };
}

/**
 * 模拟 API 请求 - 获取统计数据
 */
export async function mockGetStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  banned: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    total: mockData.length,
    active: mockData.filter((u) => u.status === 'active').length,
    inactive: mockData.filter((u) => u.status === 'inactive').length,
    banned: mockData.filter((u) => u.status === 'banned').length,
  };
}
