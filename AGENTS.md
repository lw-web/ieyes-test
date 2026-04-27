# AGENTS.md

AI 代理在此代码库中工作的关键上下文。

## 常用命令

```bash
npm start              # 启动开发服务器 (localhost:8000) - 需要 Node.js OpenSSL 修复
npm run build          # 生产环境构建
npm run lint           # 运行 ESLint
npm run format         # 使用 Prettier 格式化代码
```

**Node.js 22 注意**: `npm start` 和 `npm run build` 需要 `NODE_OPTIONS=--openssl-legacy-provider`（已在 scripts 中配置）。否则 Webpack 5 在 OpenSSL 3 上会失败。

## 架构概览

- **UmiJS 3.5** React 元框架 - 路由在 `.umirc.ts` 中定义，不会自动检测
- **状态管理**: 使用 `useModel('modelName')` 来自 `umi`，不是 Redux/dva
- **API**: 自定义 fetch 封装在 `src/services/request.ts` - 自动注入 Bearer token（从 localStorage/sessionStorage 读取）
- **Serverless**: `api/` 目录包含 Vercel 函数（如 `api/health.js`）

## 添加功能

**新页面**: 创建 `src/pages/name/index.tsx` → 在 `.umirc.ts` 添加路由

**新 model**: 创建 `src/models/name.ts` 导出默认 hook → 通过 `useModel('name')` 使用

**新 API**: 在 `src/services/types.ts` 添加类型 → 在 `src/services/domain.ts` 添加函数 → 从 `src/services/index.ts` 导出

## TypeScript 注意事项

服务导入经常显示模块错误 - 使用 `// @ts-ignore`:
```typescript
// @ts-ignore
import { login } from '@/services';
```

这是 `@/*` 路径别名模块解析的已知问题。

## 代码风格

Prettier: semi=true, singleQuote=true, tabWidth=2, trailingComma='es5', printWidth=100

## Git 提交

格式: `<type>: <描述>` 并附带 Co-Authored-By。
使用 `npm run commit "msg"` 或参见 `docs/GIT_COMMIT_GUIDE.md`。

类型: feat, fix, docs, style, refactor, test, chore