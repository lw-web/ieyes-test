/**
 * 网站页脚组件
 */

import React, { FC } from 'react';
import { Layout, Divider, Space } from 'antd';
import {
  TwitterOutlined,
  InstagramOutlined,
  FacebookOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';
import './Footer.less';

const { Footer: AntFooter } = Layout;

interface FooterLink {
  label: string;
  href?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  siteName?: string;
  sections?: FooterSection[];
}

const defaultSections: FooterSection[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products' },
      { label: 'New Arrivals' },
      { label: 'Best Sellers' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us' },
      { label: 'Careers' },
      { label: 'Press' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact' },
      { label: 'FAQ' },
      { label: 'Shipping' },
    ],
  },
];

const Footer: FC<FooterProps> = ({
  siteName = 'BRAND',
  sections = defaultSections,
}) => {
  return (
    <AntFooter className="website-footer">
      <Divider className="footer-divider" />

      <div className="footer-container">
        {/* Site Name */}
        <div className="footer-brand">
          <h3 className="footer-logo">{siteName}</h3>

          {/* Social Icons */}
          <Space size={12} className="footer-social">
            <a href="#" className="social-icon">
              <TwitterOutlined />
            </a>
            <a href="#" className="social-icon">
              <InstagramOutlined />
            </a>
            <a href="#" className="social-icon">
              <FacebookOutlined />
            </a>
            <a href="#" className="social-icon">
              <LinkedinOutlined />
            </a>
          </Space>
        </div>

        {/* Footer Sections */}
        {sections.map((section, index) => (
          <div key={index} className="footer-section">
            <h4 className="footer-section-title">{section.title}</h4>
            <ul className="footer-links">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a href={link.href || '#'}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        © 2024 {siteName}. All rights reserved.
      </div>
    </AntFooter>
  );
};

export default Footer;
