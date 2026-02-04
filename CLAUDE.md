# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 提供在此代码库中工作的指导。

## 常用命令

```bash
# 开发
npm start              # 启动开发服务器 http://localhost:8000
npm run build          # 生产环境构建
npm run lint           # 运行 ESLint
npm run format         # 使用 Prettier 格式化代码

# Git 操作
npm run commit "msg"   # 使用标准格式提交（自动添加 Co-Authored-By）
bash scripts/git-commit.sh "msg"  # 备用提交方式
```

## 架构概览

### 技术栈
- **UmiJS 3.5.41** - React 元框架，包含路由和构建工具
- **TypeScript 4.1.2** - 类型安全
- **Ant Design 5.27.0** - UI 组件库
- **AntV G2 5.4.8** - 数据可视化
- **Less** - CSS 预处理器
- **Node.js 22 兼容性**: 使用 `NODE_OPTIONS=--openssl-legacy-provider` 配合 Webpack 5

### 项目结构
```
src/
├── app.ts              # 应用运行时配置（AntD 语言、全局设置）
├── global.less         # 全局样式
├── typings.d.ts        # 模块声明（@/* 别名指向 src/*）
├── models/             # 状态管理模型
├── services/           # API 服务层
└── pages/              # 路由组件
```

### 关键配置文件
- `.umirc.ts` - UmiJS 配置（路由、插件、主题、webpack）
- `tsconfig.json` - TypeScript 配置
- `.prettierrc` - 代码格式化规则

## 状态管理：UmiJS useModel

本项目使用 UmiJS 内置的 model 系统，而非 Redux 或 dva。

**Model 模式** (`src/models/*.ts`):
```typescript
export default () => {
  const [state, setState] = useState(initialValue);
  return { state, setState };
};
```

**组件中使用**:
```typescript
import { useModel } from 'umi';

const { state, setState } = useModel('modelName');
```

Models 是简单的 hooks - 没有 actions、reducers 或 effects。只有状态和设置器。

## 服务层：Fetch 封装

API 层使用自定义 fetch 封装 (`src/services/request.ts`)，特性包括：

- **自动 token 注入**: 从 `localStorage.getItem('token')` 或 `sessionStorage` 读取
- **统一错误处理**: 处理 HTTP 状态码（401、403、404、500）和业务错误码
- **TypeScript 泛型**: `request<T>(url, config)` 提供类型安全响应
- **返回值**: 自动从响应中提取 `result.data`

**服务模式** (`src/services/user.ts`):
```typescript
import { request } from './request';

export async function login(params: LoginParams): Promise<LoginResult> {
  return request('/api/login', {
    method: 'POST',
    data: params,
    skipAuth: true,  // 用于不需要 token 的接口
  });
}
```

**导入服务**:
```typescript
// @ts-ignore  // 目前需要，因为模块解析问题
import { login, getUserList } from '@/services';
```

## UmiJS 路由

路由在 `.umirc.ts` 中定义：
```typescript
routes: [
  { path: '/', component: '@/pages/index' },
  { path: '/counter', component: '@/pages/counter' },
  { path: '/api-demo', component: '@/pages/api-demo' },
]
```

使用 `umi` 的 `<Link to="/path">` 进行导航。

## 开发说明

### 添加新页面
1. 在 `src/pages/page-name/index.tsx` 创建组件
2. 在 `.umirc.ts` 添加路由
3. 可选：创建 `index.less` 样式文件

### 添加新 Model
1. 在 `src/models/model-name.ts` 创建文件
2. 导出默认 hook 函数
3. 在组件中使用 `useModel('model-name')`

### 添加 API 服务
1. 在 `src/services/types.ts` 定义类型
2. 在 `src/services/domain-name.ts` 添加 API 函数
3. 从 `src/services/index.ts` 导出
4. 使用 `// @ts-ignore` 导入（模块解析已知问题）

### 已知问题
- **TypeScript 导入错误**: 服务可能显示导入错误 - 使用 `// @ts-ignore` 作为临时解决方案
- **多个开发服务器**: 使用 `netstat -ano | findstr :8000` 检查运行中的进程

## Git 提交规范

遵循 `docs/GIT_COMMIT_GUIDE.md` 中定义的提交类型：
- `feat` - 新功能
- `fix` - Bug 修复
- `docs` - 文档
- `style` - 代码格式
- `refactor` - 重构
- `test` - 测试
- `chore` - 构建/工具

**提交模板**:
```bash
git commit -m "<type>: <描述>

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

或使用 `npm run commit`，会自动添加 Co-Authored-By。
