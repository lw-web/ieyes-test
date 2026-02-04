import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/pages/index',
    },
  ],
  fastRefresh: {},
  webpack5: {},
  theme: {
    'primary-color': '#1890ff',
  },
  targets: {
    ie: 11,
  },
  // Ant Design 配置
  antd: {},
  // Less 配置
  lessLoader: {
    modifyVars: {
      '@primary-color': '#1890ff',
    },
    javascriptEnabled: true,
  },
});
