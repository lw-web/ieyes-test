/**
 * Express 后端服务
 * 提供 RESTful API 接口
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== 数据生成 ====================

// 角色列表
const roles = [
  { label: '超级管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '用户', value: 'user' },
];

// 部门列表
const departments = [
  { label: '技术部', value: 'tech' },
  { label: '产品部', value: 'product' },
  { label: '运营部', value: 'operation' },
  { label: '市场部', value: 'marketing' },
];

// 用户状态
const userStatuses = [
  { label: '正常', value: 'active' },
  { label: '禁用', value: 'inactive' },
  { label: '封禁', value: 'banned' },
];

// 生成用户数据
function generateUsers(count = 100) {
  const users = [];
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
      status: userStatuses[statusIndex].value,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      createdAt: new Date(now - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginAt: new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return users;
}

// 模拟数据库
const users = generateUsers(100);

// ==================== 辅助函数 ====================

/**
 * 处理过滤条件
 */
function applyFilters(data, filters) {
  if (!filters) return data;

  return data.filter((item) => {
    // filters 中的每个字段可能是单个值（搜索）或数组（多选筛选）
    for (const [key, value] of Object.entries(filters)) {
      if (value === null || value === undefined) continue;

      if (Array.isArray(value)) {
        // 多选筛选（如角色、部门、状态）
        if (value.length > 0 && !value.includes(item[key])) {
          return false;
        }
      } else if (typeof value === 'string' && value.length > 0) {
        // 单值搜索（filterDropdown 的搜索）
        const searchValue = value.toLowerCase();
        const itemValue = item[key];
        if (itemValue && typeof itemValue === 'string') {
          if (!itemValue.toLowerCase().includes(searchValue)) {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    return true;
  });
}

/**
 * 处理排序
 */
function applySorter(data, sorter) {
  if (!sorter || !sorter.field || !sorter.order) return data;

  const { field, order } = sorter;

  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

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
    if (typeof aVal === 'string' && /^\d{4}-\d{2}-\d{2}/.test(aVal)) {
      const dateA = new Date(aVal).getTime();
      const dateB = new Date(bVal).getTime();
      return order === 'ascend' ? dateA - dateB : dateB - dateA;
    }

    return 0;
  });
}

/**
 * 处理分页
 */
function applyPagination(data, current, pageSize) {
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  return {
    list: data.slice(start, end),
    total: data.length,
  };
}

// ==================== API 路由 ====================

/**
 * 获取用户列表
 * POST /api/user/list
 */
app.post('/api/user/list', (req, res) => {
  const { current = 1, pageSize = 10, filters, sorter } = req.body;

  // 模拟网络延迟
  setTimeout(() => {
    try {
      let filteredData = [...users];

      // 应用过滤
      filteredData = applyFilters(filteredData, filters);

      // 应用排序
      filteredData = applySorter(filteredData, sorter);

      // 应用分页
      const result = applyPagination(filteredData, current, pageSize);

      res.json({
        code: 0,
        data: result,
        message: 'success',
        success: true,
      });
    } catch (error) {
      console.error('API 错误:', error);
      res.status(500).json({
        code: 500,
        data: null,
        message: error.message,
        success: false,
      });
    }
  }, 300);
});

/**
 * 获取统计数据
 * GET /api/user/stats
 */
app.get('/api/user/stats', (req, res) => {
  setTimeout(() => {
    res.json({
      code: 0,
      data: {
        total: users.length,
        active: users.filter((u) => u.status === 'active').length,
        inactive: users.filter((u) => u.status === 'inactive').length,
        banned: users.filter((u) => u.status === 'banned').length,
      },
      message: 'success',
      success: true,
    });
  }, 200);
});

/**
 * 获取配置选项
 * GET /api/config/options
 */
app.get('/api/config/options', (req, res) => {
  res.json({
    code: 0,
    data: {
      roles,
      departments,
      userStatuses,
    },
    message: 'success',
    success: true,
  });
});

/**
 * 健康检查
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== 启动服务 ====================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Express Server Running...                                ║
║                                                           ║
║  📍 Local:    http://localhost:${PORT}                      ║
║  🔧 API Base: http://localhost:${PORT}/api                   ║
║                                                           ║
║  📋 Available Endpoints:                                   ║
║     POST /api/user/list    - 用户列表（分页、筛选、排序）  ║
║     GET  /api/user/stats   - 统计数据                     ║
║     GET  /api/config/options - 配置选项                    ║
║                                                           ║
╚════════════════════════════════════════════════════════════╝
  `);
});
