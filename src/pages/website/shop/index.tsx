/**
 * Shop Page - 商店页面
 */

import React, { FC } from 'react';
import { Typography, Button, Row, Col, Space } from 'antd';
import { WebsiteNav, WebsiteFooter } from '@/components/WebsiteLayout';
import './index.less';

const { Title, Paragraph, Text } = Typography;

const ShopPage: FC = () => {
  return (
    <div className="shop-page">
      {/* Navigation */}
      <WebsiteNav siteName="BRAND" />

      {/* Header Section */}
      <section className="shop-header">
        <div className="header-background">
          <div className="placeholder-image">
            <span className="placeholder-text">Header Image (1440 x 720)</span>
          </div>
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="two-col-section">
        <div className="section-content">
          <Row gutter={[80, 60]} align="middle">
            <Col xs={24} lg={12}>
              <div className="col-image">
                <div className="placeholder-image">
                  <span className="placeholder-text">624 x 400</span>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="col-content">
                <Title level={3}>Heading</Title>
                <Paragraph>
                  A subheading for this section, as long or as short as you like
                </Paragraph>
                <Space>
                  <Button type="primary">Button</Button>
                  <Button>Secondary button</Button>
                </Space>
              </div>
            </Col>
          </Row>

          <Row gutter={[80, 60]} align="middle">
            <Col xs={24} lg={{ span: 12, order: 2 }}>
              <div className="col-content">
                <Title level={3}>Heading</Title>
                <Paragraph>
                  A subheading for this section, as long or as short as you like
                </Paragraph>
                <Space>
                  <Button type="primary">Button</Button>
                  <Button>Secondary button</Button>
                </Space>
              </div>
            </Col>
            <Col xs={24} lg={{ span: 12, order: 1 }}>
              <div className="col-image">
                <div className="placeholder-image">
                  <span className="placeholder-text">625 x 400</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-content">
          <Title level={2} className="section-heading">
            Section heading
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <div className="featured-card">
                <div className="featured-image">
                  <div className="placeholder-image">
                    <span className="placeholder-text">735 x 735</span>
                  </div>
                </div>
                <div className="featured-content">
                  <Title level={4}>Featured product</Title>
                  <Paragraph>Description of featured product</Paragraph>
                  <Text strong>$10.99</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="product-list">
                <div className="product-card-list">
                  <div className="product-card-list-image">
                    <div className="placeholder-image">
                      <span className="placeholder-text">515 x 283</span>
                    </div>
                  </div>
                  <div className="product-card-list-content">
                    <Title level={4}>Product</Title>
                    <Paragraph>Description of top product</Paragraph>
                    <Text strong>$10.99</Text>
                  </div>
                </div>

                <div className="product-card-list">
                  <div className="product-card-list-image">
                    <div className="placeholder-image">
                      <span className="placeholder-text">515 x 283</span>
                    </div>
                  </div>
                  <div className="product-card-list-content">
                    <Title level={4}>Product</Title>
                    <Paragraph>Description of lower product</Paragraph>
                    <Text strong>$10.99</Text>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Features List Section */}
      <section className="features-list-section">
        <div className="section-content">
          <Title level={2} className="section-heading">
            Section heading
          </Title>
          <Row gutter={[60, 48]}>
            <Col xs={24} md={12}>
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-number">01</div>
                  <Title level={4}>Subheading</Title>
                  <Paragraph>
                    Body text for whatever you'd like to say. Add main takeaway
                    points, quotes, anecdotes, or even a very very short story.
                  </Paragraph>
                </div>
                <div className="feature-item">
                  <div className="feature-number">02</div>
                  <Title level={4}>Subheading</Title>
                  <Paragraph>
                    Body text for whatever you'd like to claim. Add main takeaway
                    points, quotes, anecdotes, or even a very very short story.
                  </Paragraph>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-number">03</div>
                  <Title level={4}>Subheading</Title>
                  <Paragraph>
                    Body text for whatever you'd like to suggest. Add main takeaway
                    points, quotes, anecdotes, or even a very very short story.
                  </Paragraph>
                </div>
                <div className="feature-item">
                  <div className="feature-number">04</div>
                  <Title level={4}>Subheading</Title>
                  <Paragraph>
                    Body text for whatever you'd like to type. Add main takeaway
                    points, quotes, anecdotes, or even a very very short story.
                  </Paragraph>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Footer */}
      <WebsiteFooter />
    </div>
  );
};

export default ShopPage;
