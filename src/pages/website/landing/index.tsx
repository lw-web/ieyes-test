/**
 * Landing Page - 首页
 */

import React, { FC } from 'react';
import { Typography, Button, Row, Col, Space } from 'antd';
import { WebsiteNav, WebsiteFooter } from '@/components/WebsiteLayout';
import './index.less';

const { Title, Paragraph, Text } = Typography;

const LandingPage: FC = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <WebsiteNav siteName="BRAND" />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <Title level={1} className="hero-title">
              Landing page title
            </Title>
            <Paragraph className="hero-subtitle">
              Subheading that sets up context, shares more info about the website,
              or generally gets people psyched to keep scrolling.
            </Paragraph>
            <Button type="primary" size="large" className="hero-cta">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="hero-image-section">
        <div className="section-content">
          <div className="hero-image-wrapper">
            <div className="placeholder-image hero-main-image">
              <span className="placeholder-text">Hero Image (1280 x 640)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="feature-cards-section">
        <div className="section-content">
          <Title level={2} className="section-heading">
            Section heading
          </Title>
          <Row gutter={[32, 0]} className="feature-cards">
            <Col xs={24} md={8}>
              <div className="feature-card">
                <div className="feature-card-image">
                  <div className="placeholder-image">
                    <span className="placeholder-text">405 x 405</span>
                  </div>
                </div>
                <div className="feature-card-content">
                  <Title level={4}>Subheading</Title>
                  <Paragraph>
                    Body text for whatever you'd like to add more to the subheading.
                  </Paragraph>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="feature-card">
                <div className="feature-card-image">
                  <div className="placeholder-image">
                    <span className="placeholder-text">405 x 405</span>
                  </div>
                </div>
                <div className="feature-card-content">
                  <Title level={4}>Subheading</Title>
                  <Paragraph>
                    Body text for whatever you'd like to expand on the main point.
                  </Paragraph>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="feature-card">
                <div className="feature-card-image">
                  <div className="placeholder-image">
                    <span className="placeholder-text">405 x 405</span>
                  </div>
                </div>
                <div className="feature-card-content">
                  <Title level={4}>Subheading</Title>
                  <Paragraph>
                    Body text for whatever you'd like to share more.
                  </Paragraph>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Split Content Section */}
      <section className="split-content-section">
        <div className="section-content">
          <Row gutter={[60, 40]} align="middle">
            <Col xs={24} lg={10}>
              <div className="split-text">
                <Title level={2} className="section-heading">
                  Section heading
                </Title>
                <div className="text-items">
                  <div className="text-item">
                    <Title level={4}>Subheading</Title>
                    <Paragraph>
                      Body text for whatever you'd like to expand on the main point.
                    </Paragraph>
                  </div>
                  <div className="text-item">
                    <Title level={4}>Subheading</Title>
                    <Paragraph>
                      Body text for whatever you'd like to say. Add main takeaway points,
                      quotes, anecdotes.
                    </Paragraph>
                  </div>
                  <div className="text-item">
                    <Title level={4}>Subheading</Title>
                    <Paragraph>
                      Body text for whatever you'd like to add more to the main point.
                      It provides details, explanations, and context.
                    </Paragraph>
                  </div>
                </div>
                <Space className="split-buttons">
                  <Button type="primary" size="large">
                    Button
                  </Button>
                  <Button size="large">Secondary button</Button>
                </Space>
              </div>
            </Col>
            <Col xs={24} lg={14}>
              <div className="split-image">
                <div className="placeholder-image">
                  <span className="placeholder-text">704 x 704</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Two Column Cards Section */}
      <section className="two-col-cards-section">
        <div className="section-content">
          <Title level={2} className="section-heading">
            Section heading
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <div className="large-card">
                <div className="large-card-image">
                  <div className="placeholder-image">
                    <span className="placeholder-text">624 x 341</span>
                  </div>
                </div>
                <div className="large-card-content">
                  <Title level={4}>Subheading</Title>
                  <Paragraph>
                    Body text for whatever you'd like to add more to the subheading.
                  </Paragraph>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="large-card">
                <div className="large-card-image">
                  <div className="placeholder-image">
                    <span className="placeholder-text">624 x 341</span>
                  </div>
                </div>
                <div className="large-card-content">
                  <Title level={4}>Subheading</Title>
                  <Paragraph>
                    Body text for whatever you'd like to expand on the main point.
                  </Paragraph>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-content">
          <Title level={2} className="section-heading">
            Section heading
          </Title>
          <Row gutter={[32, 32]} className="testimonial-cards">
            <Col xs={24} md={8}>
              <div className="testimonial-card">
                <Paragraph className="testimonial-quote">
                  "A terrific piece of praise"
                </Paragraph>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <div className="placeholder-avatar" />
                  </div>
                  <div className="author-info">
                    <Text strong>Name</Text>
                    <br />
                    <Text type="secondary">Description</Text>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="testimonial-card">
                <Paragraph className="testimonial-quote">
                  "A fantastic bit of feedback"
                </Paragraph>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <div className="placeholder-avatar" />
                  </div>
                  <div className="author-info">
                    <Text strong>Name</Text>
                    <br />
                    <Text type="secondary">Description</Text>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="testimonial-card">
                <Paragraph className="testimonial-quote">
                  "A genuinely glowing review"
                </Paragraph>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <div className="placeholder-avatar" />
                  </div>
                  <div className="author-info">
                    <Text strong>Name</Text>
                    <br />
                    <Text type="secondary">Description</Text>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <Title level={2} className="cta-heading">
            Section heading
          </Title>
          <Space className="cta-buttons">
            <Button type="primary" size="large">
              Button
            </Button>
            <Button size="large">Secondary button</Button>
          </Space>
        </div>
      </section>

      {/* Footer */}
      <WebsiteFooter />
    </div>
  );
};

export default LandingPage;
