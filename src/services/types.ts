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
