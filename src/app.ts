import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

export function rootContainer(container: React.ReactElement) {
  return React.createElement(
    ConfigProvider,
    { locale: zhCN },
    container
  );
}
