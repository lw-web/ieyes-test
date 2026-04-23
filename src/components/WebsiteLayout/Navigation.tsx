/**
 * 网站导航栏组件
 */

import React, { FC } from 'react';
import { Layout, Menu, Button } from 'antd';
import { useHistory } from 'umi';
import './Navigation.less';

const { Header: AntHeader } = Layout;

interface NavigationProps {
  siteName?: string;
  theme?: 'light' | 'dark' | 'transparent';
}

const Navigation: FC<NavigationProps> = ({
  siteName = 'BRAND',
  theme = 'light'
}) => {
  const history = useHistory();

  const menuItems = [
    { key: 'landing', label: 'Home', onClick: () => history.push('/website/landing') },
    { key: 'shop', label: 'Shop', onClick: () => history.push('/website/shop') },
    { key: 'about', label: 'About', onClick: () => history.push('/website/about') },
  ];

  return (
    <AntHeader className={`website-nav website-nav--${theme}`}>
      <div className="nav-container">
        {/* Site Name / Logo */}
        <div className="nav-logo" onClick={() => history.push('/website/landing')}>
          {siteName}
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="horizontal"
          items={menuItems}
          className="nav-menu"
          theme={theme === 'dark' ? 'dark' : 'light'}
        />

        {/* CTA Button */}
        <Button
          type={theme === 'dark' ? 'primary' : 'default'}
          className="nav-cta"
          onClick={() => history.push('/website/about')}
        >
          Contact
        </Button>
      </div>
    </AntHeader>
  );
};

export default Navigation;
