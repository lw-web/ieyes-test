/**
 * Product Detail Page - 产品详情页
 */

import React, { FC } from 'react';
import { Typography, Button, Row, Col } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { WebsiteNav, WebsiteFooter } from '@/components/WebsiteLayout';
import './index.less';

const { Title, Paragraph, Text } = Typography;

const ProductDetailPage: FC = () => {
  const relatedProducts = [
    { id: 1, name: 'Product', description: 'Description of first product', price: '$10.99' },
    { id: 2, name: 'Product', description: 'Description of second product', price: '$10.99' },
    { id: 3, name: 'Product', description: 'Description of third product', price: '$10.99' },
    { id: 4, name: 'Product', description: 'Description of fourth product', price: '$10.99' },
    { id: 5, name: 'Product', description: 'Description of fifth product', price: '$10.99' },
    { id: 6, name: 'Product', description: 'Description of sixth product', price: '$10.99' },
  ];

  return (
    <div className="product-detail-page">
      {/* Navigation */}
      <WebsiteNav siteName="BRAND" />

      {/* Product Section */}
      <section className="product-section">
        <div className="section-content">
          <Row gutter={[60, 40]} align="start">
            {/* Product Image */}
            <Col xs={24} lg={12}>
              <div className="product-image">
                <div className="placeholder-image">
                  <span className="placeholder-text">Product Image (625 x 613)</span>
                </div>
              </div>
            </Col>

            {/* Product Info */}
            <Col xs={24} lg={12}>
              <div className="product-info">
                <Title level={1} className="product-name">
                  Product name
                </Title>
                <Paragraph className="product-subheading">
                  Subheading
                </Paragraph>
                <Text className="product-price">$49.99</Text>
                <Paragraph className="product-description">
                  Description of the product goes here. This includes all the details
                  about the product features, specifications, and other relevant
                  information that customers might want to know.
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingOutlined />}
                  className="add-to-cart-btn"
                  block
                >
                  Add to cart
                </Button>
                <Text type="secondary" className="product-fine-print">
                  Text box for additional details or fine print
                </Text>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="related-products-section">
        <div className="section-content">
          <Title level={2} className="section-heading">
            Related products
          </Title>
          <Row gutter={[35, 32]}>
            {relatedProducts.map((product) => (
              <Col xs={24} md={12} lg={8} key={product.id}>
                <div className="related-product-card">
                  <div className="related-product-image">
                    <div className="placeholder-image">
                      <span className="placeholder-text">404 x 238</span>
                    </div>
                  </div>
                  <div className="related-product-content">
                    <Title level={4}>{product.name}</Title>
                    <Paragraph>{product.description}</Paragraph>
                    <Text strong className="related-product-price">
                      {product.price}
                    </Text>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Footer */}
      <WebsiteFooter />
    </div>
  );
};

export default ProductDetailPage;
