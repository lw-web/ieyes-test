# ieyes-test

基于 UmiJS 3.5.41 + TypeScript 4.1.2 + Ant Design 5.27.0 + AntV G2 5.4.8 初始化的项目

## 技术栈

- **UmiJS**: 3.5.41
- **TypeScript**: 4.1.2
- **Ant Design**: 5.27.0
- **AntV G2**: 5.4.8
- **Prettier**: 3.1.0
- **Webpack**: 5
- **Less**: 4.2.0

## 开始使用

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm start
# 或
yarn start
```

访问 http://localhost:8000

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 代码格式化

```bash
npm run format
# 或
yarn format
```

## 项目结构

```
ieyes-test/
├── .gitignore          # Git 忽略文件
├── .prettierrc         # Prettier 配置
├── .umirc.ts           # UmiJS 配置
├── package.json        # 依赖配置
├── tsconfig.json       # TypeScript 配置
├── src/
│   ├── app.ts          # 应用运行时配置
│   ├── global.less     # 全局样式
│   ├── typings.d.ts    # 类型声明
│   └── pages/
│       └── index/      # 首页
│           ├── index.tsx
│           └── index.less
```

## 功能示例

项目首页包含以下功能示例：

1. **Ant Design 组件**: Statistic 统计数值、DatePicker 日期选择、Button 按钮等
2. **AntV G2 图表**: 柱状图展示数据趋势，支持数据刷新
3. **响应式布局**: 使用 Row/Col 实现栅格布局
