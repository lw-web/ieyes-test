/**
 * 免费测试 API 服务
 * 对接公开的测试接口，无需后端即可演示功能
 * 使用 Vercel Serverless Functions 作为代理
 */

import type { UserInfo } from './types';

// ==================== Vercel Serverless Functions 代理 ====================
// 开发环境使用本地代理，生产环境使用 Serverless Functions

// 使用更可靠的环境检测方法
const getProxyBase = (service: string) => {
  // 检测是否在 localhost 开发环境
  const isDev = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname === '');

  if (isDev) {
    // 开发环境：使用 webpack proxy
    return `/api/${service}`;
  } else {
    // 生产环境：直接调用 Serverless Function
    return `/api/proxy/${service}`;
  }
};

// ==================== JSONPlaceholder ====================
// 最常用的测试 API，提供帖子、评论、用户、相册等数据
// 文档: https://jsonplaceholder.typicode.com/

/**
 * 获取文章列表
 */
export async function fetchPosts(page = 1, limit = 10) {
  const start = (page - 1) * limit;
  const response = await fetch(`${getProxyBase('jsonplaceholder')}/posts?_start=${start}&_limit=${limit}`);
  return response.json();
}

/**
 * 获取文章详情
 */
export async function fetchPostDetail(id: number) {
  const response = await fetch(`${getProxyBase('jsonplaceholder')}/posts/${id}`);
  return response.json();
}

/**
 * 获取评论列表
 */
export async function fetchComments(postId?: number) {
  const url = postId
    ? `${getProxyBase('jsonplaceholder')}/posts/${postId}/comments`
    : `${getProxyBase('jsonplaceholder')}/comments`;
  const response = await fetch(url);
  return response.json();
}

/**
 * 获取用户列表（简版）
 */
export async function fetchUsers(page = 1, limit = 10) {
  const response = await fetch(`${getProxyBase('jsonplaceholder')}/users?_page=${page}&_limit=${limit}`);
  return response.json();
}

/**
 * 获取相册列表
 */
export async function fetchAlbums(userId?: number) {
  const url = userId
    ? `${getProxyBase('jsonplaceholder')}/albums?userId=${userId}`
    : `${getProxyBase('jsonplaceholder')}/albums`;
  const response = await fetch(url);
  return response.json();
}

/**
 * 获取照片列表
 */
export async function fetchPhotos(albumId?: number) {
  const url = albumId
    ? `${getProxyBase('jsonplaceholder')}/photos?albumId=${albumId}`
    : `${getProxyBase('jsonplaceholder')}/photos`;
  const response = await fetch(url);
  return response.json();
}

/**
 * 获取待办事项
 */
export async function fetchTodos(userId?: number) {
  const url = userId
    ? `${getProxyBase('jsonplaceholder')}/todos?userId=${userId}`
    : `${getProxyBase('jsonplaceholder')}/todos`;
  const response = await fetch(url);
  return response.json();
}

// ==================== Fake Store API ====================
// 电商相关测试数据，适合商城页面
// 文档: https://fakestoreapi.com/

/**
 * 商品列表
 */
export async function fetchProducts(limit = 20) {
  const response = await fetch(`${getProxyBase('fakestore')}/products?limit=${limit}`);
  return response.json();
}

/**
 * 商品详情
 */
export async function fetchProductDetail(id: string | number) {
  const response = await fetch(`${getProxyBase('fakestore')}/products/${id}`);
  return response.json();
}

/**
 * 商品分类
 */
export async function fetchCategories() {
  const response = await fetch(`${getProxyBase('fakestore')}/products/categories`);
  return response.json();
}

/**
 * 分类下的商品
 */
export async function fetchProductsByCategory(category: string) {
  const response = await fetch(`${getProxyBase('fakestore')}/products/category/${category}`);
  return response.json();
}

/**
 * 获取购物车
 */
export async function fetchCarts(userId?: number) {
  const url = userId ? `${getProxyBase('fakestore')}/carts/user/${userId}` : `${getProxyBase('fakestore')}/carts`;
  const response = await fetch(url);
  return response.json();
}

// ==================== Random User Generator ====================
// 随机用户数据，适合用户统计页面
// 文档: https://randomuser.me/api/

/**
 * 获取随机用户列表
 */
export async function fetchRandomUsers(results = 20, nationalities?: string[]) {
  const natParams = nationalities ? `&nat=${nationalities.join(',')}` : '';
  const response = await fetch(`${getProxyBase('randomuser')}/api?results=${results}${natParams}`);
  return response.json();
}

/**
 * 将 RandomUser 数据转换为 UserInfo 格式
 */
export function transformRandomUser(raw: any): UserInfo {
  return {
    id: raw.login.uuid,
    username: raw.login.username,
    nickname: `${raw.name.first} ${raw.name.last}`,
    email: raw.email,
    avatar: raw.picture.medium,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
}

// ==================== Cat Facts ====================
// 趣味 API，用于测试
// 文档: https://catfact.ninja/

/**
 * 获取随机猫咪冷知识
 */
export async function fetchCatFact() {
  const response = await fetch(`${getProxyBase('catfact')}/fact`);
  return response.json();
}

// ==================== 综合数据接口 ====================

/**
 * 获取仪表板数据（组合多个 API）
 */
export async function fetchDashboardData() {
  const [posts, products, users] = await Promise.all([
    fetchPosts(1, 5),
    fetchProducts(5),
    fetchRandomUsers(5),
  ]);

  return {
    recentPosts: posts,
    featuredProducts: products,
    activeUsers: users.results?.map(transformRandomUser) || [],
  };
}

/**
 * 搜索接口（模拟）
 */
export async function searchAll(keyword: string) {
  const results = await Promise.all([
    fetchPosts(1, 5).then(posts =>
      posts.filter((p: any) => p.title.toLowerCase().includes(keyword.toLowerCase()))
    ),
    fetchProducts(5).then(products =>
      products.filter((p: any) => p.title.toLowerCase().includes(keyword.toLowerCase()))
    ),
  ]);

  return {
    posts: results[0],
    products: results[1],
  };
}
