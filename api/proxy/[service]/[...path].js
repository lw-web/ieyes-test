// Vercel Serverless Function - 通用代理处理器
// 处理所有外部 API 请求的代理

const fetch = require('node-fetch');

// 外部 API 配置
const API_TARGETS = {
  jsonplaceholder: 'https://jsonplaceholder.typicode.com',
  fakestore: 'https://fakestoreapi.com',
  randomuser: 'https://randomuser.me',
  catfact: 'https://catfact.ninja',
};

module.exports = async (req, res) => {
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
    console.log('Raw Query:', JSON.stringify(req.query));

    // 获取服务名称和路径
    // Vercel 将动态路由参数放在 req.query 中
    // 过滤掉服务路由参数，保留真正的查询参数
    const service = req.query.service || '';
    const path = req.query.path;

    console.log('Service:', service);
    console.log('Path:', path);
    console.log('Path type:', Array.isArray(path) ? 'array' : typeof path);

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
    // path 可能是字符串或数组，需要统一处理
    let pathString = '';
    if (Array.isArray(path)) {
      pathString = path.filter(p => p).join('/'); // 过滤掉空值
    } else if (path && typeof path === 'string') {
      pathString = path;
    }

    // 排除 Vercel 路由参数，保留真正的查询参数
    const filteredQuery = {};
    Object.entries(req.query).forEach(([key, value]) => {
      // 排除 Vercel 的动态路由参数
      if (key !== 'service' && key !== 'path' && value !== undefined) {
        filteredQuery[key] = value;
      }
    });

    const queryString = new URLSearchParams(filteredQuery).toString();
    const targetUrl = `${targetBase}${pathString ? '/' + pathString : ''}${queryString ? '?' + queryString : ''}`;

    console.log('Path String:', pathString);
    console.log('Filtered Query:', JSON.stringify(filteredQuery));
    console.log('Target URL:', targetUrl);

    // 转发请求
    console.log('Fetching target URL...');
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
      ...(req.method !== 'GET' && req.method !== 'HEAD' && { body: JSON.stringify(req.body) }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(response.headers.raw()));

    // 检查响应是否为 JSON
    const contentType = response.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);

    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.log('Non-JSON response (first 200 chars):', text.substring(0, 200));
      // 尝试解析为 JSON，如果失败则返回原始文本
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: 'Invalid JSON response', rawText: text.substring(0, 500) };
      }
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy request failed',
      message: error.message || 'Unknown error'
    });
  }
};
