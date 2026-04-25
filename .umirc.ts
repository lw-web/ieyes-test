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
      path: '/counter-demo',
      component: '@/pages/counter-demo',
    },
    {
      path: '/api-demo',
      component: '@/pages/api-demo',
    },
    {
      path: '/table-demo',
      component: '@/pages/table-demo',
    },
    {
      path: '/user-stats',
      component: '@/pages/user-stats',
    },
    {
      path: '/figjam-demo',
      component: '@/pages/figjam-demo',
    },
    {
      path: '/website',
      component: '@/pages/website/landing',
    },
    {
      path: '/website/landing',
      component: '@/pages/website/landing',
    },
    {
      path: '/website/shop',
      component: '@/pages/website/shop',
    },
    {
      path: '/website/product',
      component: '@/pages/website/product-detail',
    },
    {
      path: '/website/about',
      component: '@/pages/website/about',
    },
    {
      path: '/website/article',
      component: '@/pages/website/article',
    },
    {
      path: '/website/pr-analysis',
      component: '@/pages/website/pr-analysis',
    },
  ],
  fastRefresh: {},
  webpack5: {},
  devServer: {
    port: 8000,
  },
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
