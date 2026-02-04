/**
 * 用户相关 API
 */
import { get, post, put, del } from './request';
import type { UserInfo, LoginParams, LoginResult, PageParams, PageResponse } from './types';

const BASE_URL = '/api/user';

/**
 * 用户登录
 */
export async function login(params: LoginParams): Promise<LoginResult> {
  return post<LoginResult>(`${BASE_URL}/login`, params, {
    skipAuth: true, // 登录接口不需要 token
  });
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<UserInfo> {
  return get<UserInfo>(`${BASE_URL}/current`);
}

/**
 * 获取用户列表
 */
export async function getUserList(
  params: PageParams & { keyword?: string }
): Promise<PageResponse<UserInfo>> {
  return get<PageResponse<UserInfo>>(`${BASE_URL}/list`, params);
}

/**
 * 获取用户详情
 */
export async function getUserDetail(id: number): Promise<UserInfo> {
  return get<UserInfo>(`${BASE_URL}/${id}`);
}

/**
 * 创建用户
 */
export async function createUser(data: Partial<UserInfo>): Promise<UserInfo> {
  return post<UserInfo>(`${BASE_URL}`, data);
}

/**
 * 更新用户
 */
export async function updateUser(id: number, data: Partial<UserInfo>): Promise<UserInfo> {
  return put<UserInfo>(`${BASE_URL}/${id}`, data);
}

/**
 * 删除用户
 */
export async function deleteUser(id: number): Promise<void> {
  return del<void>(`${BASE_URL}/${id}`);
}
