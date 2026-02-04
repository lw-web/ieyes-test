/**
 * Fetch 请求封装
 * - 自动添加 token 到 headers
 * - 统一处理错误 code
 * - 返回 JSON 格式数据
 */

// 请求配置接口
interface RequestConfig extends RequestInit {
  skipAuth?: boolean; // 是否跳过添加 token
  skipErrorHandler?: boolean; // 是否跳过错误处理
}

// 响应数据接口
interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

// 从 localStorage 获取 token
const getToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// 常见错误码处理
const handleError = (response: ApiResponse): void => {
  const { code, message: msg } = response;

  switch (code) {
    case 401:
      // 未授权，跳转登录页
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('登录已过期，请重新登录');
    case 403:
      throw new Error('没有权限访问');
    case 404:
      throw new Error('请求的资源不存在');
    case 500:
      throw new Error('服务器内部错误');
    case 502:
      throw new Error('网关错误');
    case 503:
      throw new Error('服务不可用');
    case 504:
      throw new Error('网关超时');
    default:
      if (code !== 0 && code !== 200) {
        throw new Error(msg || '请求失败');
      }
  }
};

/**
 * Fetch 封装
 * @param url 请求地址
 * @param config 请求配置
 * @returns Promise<T>
 */
async function request<T = any>(url: string, config: RequestConfig = {}): Promise<T> {
  const { skipAuth = false, skipErrorHandler = false, headers = {}, ...restConfig } = config;

  // 构建请求头
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 自动添加 token
  if (!skipAuth) {
    const token = getToken();
    if (token) {
      // @ts-ignore
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  try {
    // 发起请求
    const response = await fetch(url, {
      ...restConfig,
      headers: requestHeaders,
    });

    // 检查 HTTP 状态码
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    // 解析 JSON
    const result: ApiResponse<T> = await response.json();

    // 处理业务错误码
    if (!skipErrorHandler) {
      handleError(result);
    }

    // 返回数据
    return result.data;
  } catch (error) {
    // 错误处理
    if (error instanceof Error) {
      console.error('Request failed:', error.message);
      throw error;
    }
    throw new Error('请求失败');
  }
}

/**
 * GET 请求
 * @param url 请求地址
 * @param params 查询参数
 * @param config 请求配置
 */
export function get<T = any>(
  url: string,
  params?: Record<string, any>,
  config?: RequestConfig
): Promise<T> {
  // 构建查询字符串
  const query = params
    ? `?${Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')}`
    : '';

  return request<T>(url + query, {
    method: 'GET',
    ...config,
  });
}

/**
 * POST 请求
 * @param url 请求地址
 * @param data 请求体数据
 * @param config 请求配置
 */
export function post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...config,
  });
}

/**
 * PUT 请求
 * @param url 请求地址
 * @param data 请求体数据
 * @param config 请求配置
 */
export function put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  return request<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...config,
  });
}

/**
 * DELETE 请求
 * @param url 请求地址
 * @param config 请求配置
 */
export function del<T = any>(url: string, config?: RequestConfig): Promise<T> {
  return request<T>(url, {
    method: 'DELETE',
    ...config,
  });
}

/**
 * POST 表单请求
 * @param url 请求地址
 * @param data 表单数据
 * @param config 请求配置
 */
export function postForm<T = any>(
  url: string,
  data?: Record<string, any>,
  config?: RequestConfig
): Promise<T> {
  const formData = new FormData();
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
  }

  return request<T>(url, {
    method: 'POST',
    body: formData,
    headers: {
      // 移除 Content-Type，让浏览器自动设置
    },
    ...config,
  });
}

// 导出默认请求函数
export default request;
