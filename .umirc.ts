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
    {
      path: '/counter',
      component: '@/pages/counter',
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
  // Dva 数据流配置
  dva: {},
  // Less 配置
  lessLoader: {
    modifyVars: {
      '@primary-color': '#1890ff',
    },
    javascriptEnabled: true,
  },
});
