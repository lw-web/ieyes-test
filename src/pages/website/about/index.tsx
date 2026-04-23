/**
 * About Page - 关于页面
 */

import React, { FC } from 'react';
import { Typography, Form, Input, Button, Row, Col } from 'antd';
import { WebsiteNav, WebsiteFooter } from '@/components/WebsiteLayout';
import './index.less';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const AboutPage: FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <div className="about-page">
      {/* Navigation */}
      <WebsiteNav siteName="BRAND" />

      {/* About Section */}
      <section className="about-section">
        <div className="section-content">
          <Row gutter={[60, 40]} align="start">
            <Col xs={24} lg={9}>
              <div className="about-content">
                <Title level={1} className="about-title">
                  About
                </Title>
                <Paragraph className="about-subheading">
                  Subheading for description or instructions
                </Paragraph>
                <Paragraph className="about-paragraph">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                  ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.

                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt mollit
                  anim id est laborum.

                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                  quae ab illo inventore veritatis et quasi architecto beatae vitae
                  dicta sunt explicabo.
                </Paragraph>
              </div>
            </Col>

            <Col xs={24} lg={15}>
              <div className="about-image">
                <div className="placeholder-image">
                  <span className="placeholder-text">About Image (508 x 657)</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="section-content">
          <Title level={2} className="section-heading">
            Contact me
          </Title>

          <div className="contact-form-wrapper">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="contact-form"
            >
              <Row gutter={32}>
                <Col xs={24} sm={12}>
                  <Form.Item label="First name" name="firstName">
                    <Input placeholder="Label" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Last name" name="lastName">
                    <Input placeholder="Label" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Email address" name="email">
                <Input placeholder="Label" size="large" />
              </Form.Item>

              <Form.Item label="Your message" name="message">
                <TextArea
                  placeholder="Label"
                  rows={6}
                  style={{ height: '162px', resize: 'none' }}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" size="large" htmlType="submit" block>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <WebsiteFooter />
    </div>
  );
};

export default AboutPage;
