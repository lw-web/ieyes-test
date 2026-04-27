// Vercel Serverless Function - 通用代理处理器
// 处理所有外部 API 请求的代理

import { VercelRequest, VercelResponse } from '@vercel/node';

// 外部 API 配置
const API_TARGETS: Record<string, string> = {
  jsonplaceholder: 'https://jsonplaceholder.typicode.com',
  fakestore: 'https://fakestoreapi.com',
  randomuser: 'https://randomuser.me',
  catfact: 'https://catfact.ninja',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 启用 CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 调试信息
    console.log('=== Proxy Request ===');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Query:', req.query);
    console.log('Headers:', req.headers);

    // 获取服务名称和路径
    const service = req.query.service as string;
    const path = req.query.path as string[];

    console.log('Service:', service);
    console.log('Path:', path);

    const targetBase = API_TARGETS[service];
    if (!targetBase) {
      console.error('Service not found:', service);
      return res.status(404).json({
        error: 'Service not found',
        service,
        available: Object.keys(API_TARGETS)
      });
    }

    // 构建目标 URL
    const pathString = path?.join('/') || '';
    // 排除 Vercel 的查询参数
    const filteredQuery: Record<string, string> = {};
    Object.entries(req.query).forEach(([key, value]) => {
      if (key !== 'service' && key !== 'path' && value !== undefined) {
        filteredQuery[key] = value as string;
      }
    });
    const queryString = new URLSearchParams(filteredQuery).toString();
    const targetUrl = `${targetBase}${pathString ? '/' + pathString : ''}${queryString ? '?' + queryString : ''}`;

    console.log('Target URL:', targetUrl);

    // 转发请求
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
      ...(req.method !== 'GET' && req.method !== 'HEAD' && { body: JSON.stringify(req.body) }),
    });

    console.log('Response status:', response.status);

    const data = await response.json();
    console.log('Response data received');

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy request failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
