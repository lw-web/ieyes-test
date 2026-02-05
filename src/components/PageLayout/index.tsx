/**
 * 统一页面布局组件
 * 封装页面公共结构：返回按钮、标题、描述、内容容器
 *
 * 可访问性特性：
 * - 语义化 HTML (header, main, nav)
 * - ARIA 标签和地标
 * - 键盘导航支持
 * - 焦点管理
 */

import React, { ReactNode } from 'react';
import { Button, Typography, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
// @ts-ignore
import { Link } from 'umi';
import './index.less';

const { Title, Paragraph } = Typography;

export interface PageLayoutProps {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description?: string;
  /** 额外操作区域 */
  extra?: ReactNode;
  /** 是否显示返回按钮 */
  showBack?: boolean;
  /** 返回按钮文字 */
  backText?: string;
  /** 返回链接地址 */
  backHref?: string;
  /** 面包屑导航 */
  breadcrumbs?: Array<{ label: string; href?: string }>;
  /** 子元素 */
  children: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 页面内容样式 */
  contentStyle?: React.CSSProperties;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  extra,
  showBack = true,
  backText = '返回首页',
  backHref = '/',
  breadcrumbs,
  children,
  className,
  contentStyle,
}) => {
  // 生成页面 ID 用于跳转链接
  const mainContentId = 'main-content';

  return (
    <div className={`page-layout ${className || ''}`}>
      {/* 跳转到主内容的无障碍链接 */}
      <a href={`#${mainContentId}`} className="skip-to-content">
        跳转到主要内容
      </a>

      {/* 页面头部 */}
      <header className="page-layout-header">
        {showBack && (
          <nav className="page-layout-back" aria-label="返回导航">
            <Link
              to={backHref}
              className="page-layout-back-link"
              aria-label={`返回${backText}`}
            >
              <Button
                type="primary"
                icon={<HomeOutlined aria-hidden="true" />}
                size="large"
                aria-label={backText}
              >
                {backText}
              </Button>
            </Link>
          </nav>
        )}

        {/* 面包屑导航 */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            className="page-layout-breadcrumb"
            aria-label="面包屑导航"
          >
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/" aria-label="返回首页">
                  首页
                </Link>
              </Breadcrumb.Item>
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <Breadcrumb.Item key={index}>
                    {item.href ? (
                      <Link to={item.href}>{item.label}</Link>
                    ) : (
                      <span aria-current="page">{item.label}</span>
                    )}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </nav>
        )}

        {/* 标题和操作区 */}
        <div className="page-layout-title-row">
          <div className="page-layout-title-content">
            <Title
              level={1}
              className="page-layout-title"
              id="page-title"
            >
              {title}
            </Title>
            {description && (
              <Paragraph
                className="page-layout-description"
                aria-describedby="page-description"
              >
                <span id="page-description">{description}</span>
              </Paragraph>
            )}
          </div>
          {extra && (
            <div className="page-layout-extra" role="complementary" aria-label="页面操作">
              {extra}
            </div>
          )}
        </div>
      </header>

      {/* 页面主体内容 */}
      <main
        id={mainContentId}
        className="page-layout-content"
        style={contentStyle}
        role="main"
        aria-labelledby="page-title"
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
